// Cómo llegas al destino y cómo te vas: modelo W.llega / W.sale (+ W.hora = hora de llegada) y piezas de pantalla.
// W.llega={modo,de,pt,ref,tmin} · W.sale={modo,a,pt,hora,ref,tmin} · compras en W.tk._in / W.tk._out
export const MODOS={avion:"✈ Avión",tren:"🚆 Tren",bus:"🚌 Bus",auto:"🚗 Auto",barco:"⛴ Barco"};
const TMIN={avion:60,tren:15,bus:20,auto:0,barco:30};      // minutos entre el punto de llegada y el alojamiento
const BUF={avion:3,tren:.75,bus:.5,auto:0,barco:1.5};       // horas de anticipación en el punto de salida
const PT={avion:"Aeropuerto",tren:"Estación de tren",bus:"Terminal de buses",auto:"",barco:"Puerto"};
export const llega=W=>Object.assign({modo:"avion"},W.llega||{});
export const sale=W=>Object.assign({modo:"avion"},W.sale||{});
export const tIn=W=>{const l=llega(W);return l.tmin!==undefined&&l.tmin!==""&&l.tmin!==null?+l.tmin:TMIN[l.modo]||0};
export const tOut=W=>{const s=sale(W);return s.tmin!==undefined&&s.tmin!==""&&s.tmin!==null?+s.tmin:TMIN[s.modo]||0};
export const horaNum=s=>{const m=/^(\d{1,2}):(\d{2})/.exec(s||"");return m?+m[1]+m[2]/60:null};
export const hm=t=>{t=Math.round(t*60);return String(Math.floor(t/60)%24).padStart(2,"0")+":"+String(t%60).padStart(2,"0")};
// Hora en que empiezan las actividades del día 1: llegada + traslado + 45 min para dejar maletas.
export function inicioDia1(W){const h=horaNum(W.hora);if(h==null)return 14.5;return Math.min(21,h+tIn(W)/60+.75)}
// Hora a la que hay que salir del alojamiento el día de la partida (o null si no hay hora de salida).
export function salirAlojamiento(W){const h=horaNum(sale(W).hora);if(h==null)return null;const s=sale(W);return h-(BUF[s.modo]||0)-tOut(W)/60}
const nn=W=>W.ciudades.reduce((t,x)=>t+x.noches,0);

// Tarjeta de llegada para el día 1 (línea de tiempo)
export function textoLlegada(ctx,CI){const W=ctx.W,l=llega(W),h=horaNum(W.hora),mo=MODOS[l.modo]||l.modo,pt=l.pt||PT[l.modo]||"";
  const ini=inicioDia1(W);
  return `${mo.split(" ")[0]} Llegas${l.de?" desde <b>"+ctx.esc(l.de)+"</b>":""} a <b>${ctx.esc(CI.n.split(" y ")[0])}</b>${h!=null?" a las <b>"+hm(h)+"</b>":""}${pt?" · "+ctx.esc(pt):""} → ${tIn(W)?"~"+tIn(W)+" min hasta el alojamiento · ":""}actividades desde las ${hm(ini)}`}

// Tarjeta de salida (después del último día)
export function tarjetaSalida(ctx){const W=ctx.W,s=sale(W),ids=ctx.ids,CI=ctx.M[ids[ids.length-1]].CIUDAD,f=ctx.fechas()?ctx.pretty(ctx.add(W.inicio,nn(W))):"Día "+(nn(W)+1),
  sa=salirAlojamiento(W),mo=MODOS[s.modo]||s.modo,pt=s.pt||PT[s.modo]||"",al=((W.alo||{})[ids[ids.length-1]]||{}).n;
  return `<div class="card buy" style="border-left:6px solid var(--ink);margin-top:14px"><span class="eyebrow">${ctx.esc(f)} · Salida</span><h3>${mo.split(" ")[0]} Te vas de ${ctx.esc(CI.n.split(" y ")[0])}${s.a?" hacia "+ctx.esc(s.a):""}</h3>
   <p>${sale(W).hora?`${mo.split(" ")[1]||mo} a las <b>${ctx.esc(s.hora)}</b>${pt?" desde "+ctx.esc(pt):""}. ${sa!=null?`Sal${al?" de <b>"+ctx.esc(al)+"</b>":" del alojamiento"} a más tardar a las <b>${hm(sa)}</b> (${tOut(W)} min de traslado + ${hm(BUF[s.modo]||0).replace(/^0?(\d+):(\d+)$/,"$1 h $2 min")} de anticipación).`:""}`:`Falta la hora de salida: agrégala en <a href="#" data-gotab="cfg">Configurar</a> para calcular a qué hora salir del alojamiento.`}</p></div>`}

// Tarjetas de Configurar
export function cfgExtremos(ctx){const W=ctx.W,l=llega(W),s=sale(W),esc=ctx.esc,ids=ctx.ids,fin=ctx.fechas()?ctx.pretty(ctx.add(W.inicio,nn(W))):"";
  const sel=(k,v)=>`<select data-x="${k}" aria-label="Medio">${Object.entries(MODOS).map(([m,t])=>`<option value="${m}" ${v===m?"selected":""}>${t}</option>`).join("")}</select>`;
  const inp=(k,lab,v,ph,t="text")=>`<label class="f">${lab}<input data-x="${k}" type="${t}" value="${esc(v==null?"":v)}" placeholder="${esc(ph||"")}" maxlength="60"></label>`;
  return `<div class="routegrid">
   <div class="card cfg" style="min-width:0"><span class="eyebrow" style="grid-column:1/-1">✈ Cómo llegas a ${esc(ctx.M[ids[0]].CIUDAD.n.split(" y ")[0])}</span>
    <label class="f">Medio${sel("llega.modo",l.modo)}</label>${inp("llega.de","Sales desde",l.de,"Ej.: Santiago, Londres")}
    ${inp("llega.pt","Llegas a (aeropuerto, estación…)",l.pt,PT[l.modo]||"Punto de llegada")}${inp("llega.ref","Vuelo / tren / reserva",l.ref,"Ej.: LA 8050")}
    ${inp("llega.tmin","Minutos hasta el alojamiento",l.tmin,"Por defecto "+(TMIN[l.modo]||0),"number")}
    <small class="muted" style="grid-column:1/-1">La fecha y hora de llegada están arriba. El día 1 parte desde ${esc(l.pt||PT[l.modo]||"el punto de llegada")} hacia tu alojamiento, no desde el alojamiento.</small></div>
   <div class="card cfg" style="min-width:0"><span class="eyebrow" style="grid-column:1/-1">🛫 Cómo te vas de ${esc(ctx.M[ids[ids.length-1]].CIUDAD.n.split(" y ")[0])}${fin?" · "+esc(fin):""}</span>
    <label class="f">Medio${sel("sale.modo",s.modo)}</label>${inp("sale.a","Te vas hacia",s.a,"Ej.: Santiago, Londres, otra ciudad")}
    ${inp("sale.pt","Sales desde",s.pt,PT[s.modo]||"Punto de salida")}${inp("sale.hora","Hora de salida",s.hora,"","time")}
    ${inp("sale.ref","Vuelo / tren / reserva",s.ref,"Ej.: LA 8051")}${inp("sale.tmin","Minutos desde el alojamiento",s.tmin,"Por defecto "+(TMIN[s.modo]||0),"number")}
    <small class="muted" style="grid-column:1/-1">Se calcula a qué hora salir del alojamiento. Lo que compres (boletos) se anota en Transporte.</small></div></div>`}
export function bindExtremos(ctx){const W=ctx.W;
  document.querySelectorAll("[data-x]").forEach(x=>x.onchange=()=>{const [o,k]=x.dataset.x.split(".");W[o]=W[o]||{};W[o][k]=x.type==="number"?(x.value===""?"":+x.value):x.value;ctx.guardar();ctx.render()})}

// Tarjetas de Transporte: llegada y salida con lo comprado
export function tarjetasTransporte(ctx,FM){const W=ctx.W;W.tk=W.tk||{};const l=llega(W),s=sale(W),ids=ctx.ids,esc=ctx.esc;
  const caja=(key,cab,tit,det,maps)=>{const t=W.tk[key]||{};return `<div class="card buy" style="border-left:6px solid var(--ink)"><span class="eyebrow">${cab}</span><h3>${tit}</h3><p>${det}</p><div class="links-row">${maps}</div>
    <span class="eyebrow" style="margin-top:10px">Lo que compré</span>
    <div class="fform" data-tk="${key}" style="margin-top:6px"><label class="f wide">Qué compré<input data-f="n" value="${esc(t.n||"")}" maxlength="80" placeholder="Ej.: Vuelo LA 8050, asiento 14A"></label><label class="f">Reserva / código<input data-f="r" value="${esc(t.r||"")}" maxlength="40"></label><label class="f">Costo total (€)<input data-f="p" type="number" min="0" value="${t.p||""}"></label></div></div>`};
  const c0=ctx.M[ids[0]].CIUDAD.n.split(" y ")[0],c1=ctx.M[ids[ids.length-1]].CIUDAD.n.split(" y ")[0],h=horaNum(W.hora);
  const fi=ctx.fechas()?ctx.pretty(W.inicio):"Día 1",fo=ctx.fechas()?ctx.pretty(ctx.add(W.inicio,nn(W))):"Último día";
  const q=encodeURIComponent;
  return caja("_in",fi+" · Llegada",`${(MODOS[l.modo]||"").split(" ")[0]} ${l.de?esc(l.de)+" → ":""}${esc(c0)}`,
      `${MODOS[l.modo]||l.modo}${h!=null?" · llegas a las <b>"+hm(h)+"</b>":" · falta la hora de llegada (Configurar)"}${l.pt?" · "+esc(l.pt):""}${l.ref?" · "+esc(l.ref):""}. Luego ~${tIn(W)} min hasta el alojamiento.`,
      `<a href="https://www.google.com/maps/dir/?api=1&origin=${q(l.pt||c0)}&destination=${q((((W.alo||{})[ids[0]]||{}).n)||c0)}&travelmode=transit" target="_blank" rel="noopener">Del punto de llegada al alojamiento →</a>${l.modo==="avion"&&l.de?`<a href="https://www.google.com/travel/flights?q=${q("Flights from "+l.de+" to "+c0)}" target="_blank" rel="noopener">Vuelos →</a>`:""}`)
   +caja("_out",fo+" · Salida",`${(MODOS[s.modo]||"").split(" ")[0]} ${esc(c1)}${s.a?" → "+esc(s.a):""}`,
      `${MODOS[s.modo]||s.modo}${s.hora?" · sales a las <b>"+esc(s.hora)+"</b>":" · falta la hora de salida (Configurar)"}${s.pt?" · "+esc(s.pt):""}${s.ref?" · "+esc(s.ref):""}.${salirAlojamiento(W)!=null?" Sal del alojamiento a las <b>"+hm(salirAlojamiento(W))+"</b>.":""}`,
      `<a href="https://www.google.com/maps/dir/?api=1&origin=${q((((W.alo||{})[ids[ids.length-1]]||{}).n)||c1)}&destination=${q(s.pt||c1)}&travelmode=transit" target="_blank" rel="noopener">Del alojamiento al punto de salida →</a>${s.modo==="avion"&&s.a?`<a href="https://www.google.com/travel/flights?q=${q("Flights from "+c1+" to "+s.a)}" target="_blank" rel="noopener">Vuelos →</a>`:""}`)}
