// Núcleo del motor de viajes nuevos: utilidades de días/selección y el despacho de pestañas.
// Cada vista recibe ctx = {W, viaje, ids, M, PAIS, esc, pretty, add, km, fh, nube, DEMO, guardar, render, ...}
// W.sel{ciudad:[ids]} · W.prog{ciudad:[[ids por día]]} · W.alo{ciudad:{...}} · W.tk{tramo:{...}} · W.shows[] · W.tram{clave:1}
import {programa as programaP,bindPrograma as bindProgramaP} from "./programa.js";
import {atracciones,bindAtracciones,escapadas,bindEscapadas,espectaculos,bindEspectaculos,comidas,bindComidas} from "./pestanas.js";
import {gastos,bindGastos,transporte,bindTransporte,alojamiento,bindAlojamiento,tramites,bindTramites} from "./pestanas2.js";
export const CAP={rap:7.5,int:5.5,rel:4},CAPN={rap:"rápido",int:"intermedio",rel:"relajado"};
export let SUB={};
export const diasDe=(ctx,cid)=>Math.max(1,(ctx.W.ciudades.find(x=>x.id===cid)||{noches:1}).noches);
export function inicioCiudad(ctx,cid){let d=0;for(const x of ctx.W.ciudades){if(x.id===cid)return d;d+=x.noches}return 0}
export function selDe(ctx,cid){
  const W=ctx.W;W.sel=W.sel||{};
  if(!W.sel[cid]){const A=ctx.M[cid].ATRACCIONES||[],cap=CAP[(W.ritmo||{})[cid]||"int"]*diasDe(ctx,cid);let h=0;const s=[];
    for(const a of [...A].sort((a,b)=>(b.top?1:0)-(a.top?1:0))){if(h+a.h+0.3<=cap){s.push(a.id);h+=a.h+0.3}}
    W.sel[cid]=s}
  return new Set(W.sel[cid]);
}
function enlazarSub(ctx){document.querySelectorAll("[data-sub]").forEach(b=>b.onclick=()=>{SUB.c=b.dataset.sub;ctx.render()})}
export const VISTAS={
  prog:[programaP,bindProgramaP],att:[atracciones,bindAtracciones,1],esc:[escapadas,bindEscapadas],show:[espectaculos,bindEspectaculos],
  food:[comidas,bindComidas,1],gas:[gastos,bindGastos],tra:[transporte,bindTransporte],hot:[alojamiento,bindAlojamiento],buy:[tramites,bindTramites]};
export function dibujar(k,ctx,el){
  const [v,b,s]=VISTAS[k];
  el.innerHTML=v(ctx);
  if(s)enlazarSub(ctx);
  if(b)b(ctx);
}
