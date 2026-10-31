// Plano estilo cuaderno (MapLibre + OpenFreeMap) y rutas a pie por calles (OSRM) para cualquier ciudad.
// Copia del estilo usado en el motor de París; el motor de París no lo importa.
const MLC={land:"#f4ead2",sea:"#c9d7d2",seaEdge:"#a9bab4",park:"#dfe0bf",wood:"#d3d7b2",bld:"#e7d7b4",bldEdge:"#cdb98f",major:"#ecdcb6",majorCase:"#a8956f",mid:"#fffdf5",midCase:"#a8956f",minor:"#fffdf5",minorCase:"#bba985",path:"#c2b08a",rail:"#9c8f7a",lab:"#6d6455"};
export function mlStyle(){const C=MLC,z=(a,b,c,d)=>["interpolate",["exponential",1.5],["zoom"],a,b,c,d],tr=k=>["in",["get","class"],["literal",k]];
  const ln=(id,f,col,w,o={})=>({id,type:"line",source:"o","source-layer":"transportation",filter:tr(f),layout:{"line-cap":"round","line-join":"round"},paint:{"line-color":col,"line-width":w,...o}});
  return {version:8,glyphs:"https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",sources:{o:{type:"vector",url:"https://tiles.openfreemap.org/planet"}},layers:[
   {id:"bg",type:"background",paint:{"background-color":C.land}},
   {id:"park",type:"fill",source:"o","source-layer":"park",paint:{"fill-color":C.park}},
   {id:"lc",type:"fill",source:"o","source-layer":"landcover",filter:tr(["grass","wood","farmland"]),paint:{"fill-color":["match",["get","class"],"wood",C.wood,C.park]}},
   {id:"lu",type:"fill",source:"o","source-layer":"landuse",filter:tr(["cemetery","pitch","stadium"]),paint:{"fill-color":C.park,"fill-opacity":.7}},
   {id:"water",type:"fill",source:"o","source-layer":"water",paint:{"fill-color":C.sea,"fill-outline-color":C.seaEdge}},
   {id:"waterway",type:"line",source:"o","source-layer":"waterway",paint:{"line-color":C.sea,"line-width":z(12,1,18,6)}},
   {id:"bld",type:"fill",source:"o","source-layer":"building",minzoom:13,paint:{"fill-color":C.bld,"fill-outline-color":C.bldEdge,"fill-opacity":z(13,.4,15,1)}},
   {...ln("path",["path","track"],C.path,1,{"line-dasharray":[2,2]}),minzoom:14},
   ln("minor-c",["minor","service"],C.minorCase,z(12,.8,18,14)),ln("mid-c",["secondary","tertiary"],C.midCase,z(11,1,18,20)),ln("maj-c",["motorway","trunk","primary"],C.majorCase,z(10,1.5,18,26)),
   ln("minor",["minor","service"],C.minor,z(12,.4,18,11)),ln("mid",["secondary","tertiary"],C.mid,z(11,.6,18,16)),ln("maj",["motorway","trunk","primary"],C.major,z(10,1,18,21)),
   {id:"rail",type:"line",source:"o","source-layer":"transportation",filter:["all",["==",["get","class"],"rail"],["!",["has","brunnel"]]],paint:{"line-color":C.rail,"line-width":1.2,"line-dasharray":[4,3]}},
   {id:"wname",type:"symbol",source:"o","source-layer":"waterway",minzoom:13,layout:{"text-field":["get","name"],"text-font":["Noto Sans Italic"],"text-size":13,"symbol-placement":"line","text-letter-spacing":.15},paint:{"text-color":"#5f7f8f","text-halo-color":C.sea,"text-halo-width":1.5}},
   {id:"rname",type:"symbol",source:"o","source-layer":"transportation_name",minzoom:14.5,layout:{"text-field":["get","name"],"text-font":["Noto Sans Regular"],"text-size":z(14,9.5,18,13),"symbol-placement":"line"},paint:{"text-color":C.lab,"text-halo-color":C.land,"text-halo-width":1.6}},
   {id:"pname",type:"symbol",source:"o","source-layer":"poi",minzoom:15,filter:tr(["park","garden"]),layout:{"text-field":["get","name"],"text-font":["Noto Sans Italic"],"text-size":12},paint:{"text-color":"#4f6b3e","text-halo-color":C.park,"text-halo-width":1.4}}]}}

// rutas a pie por calles (OSRM, perfil peatón), con caché compartida con el resto de la app
const WALK={};try{Object.assign(WALK,JSON.parse(localStorage.getItem("mp_walk")||"{}"))}catch(e){}
const wkey=l=>[l.from,l.to].map(p=>p.map(v=>v.toFixed(4)).join(",")).join(";");
const straight=l=>[[l.from[1],l.from[0]],[l.to[1],l.to[0]]];
function walkGeo(l){const k=wkey(l);if(WALK[k])return Promise.resolve(WALK[k]);
  return fetch(`https://routing.openstreetmap.de/routed-foot/route/v1/driving/${l.from[1]},${l.from[0]};${l.to[1]},${l.to[0]}?overview=full&geometries=geojson`).then(r=>r.json()).then(j=>{const g=j.routes&&j.routes[0]&&j.routes[0].geometry.coordinates;if(!g)throw 0;
    const sm=g.filter((c,i)=>i%2===0||i===g.length-1).map(c=>[+c[0].toFixed(5),+c[1].toFixed(5)]);WALK[k]=sm;try{const ks=Object.keys(WALK);if(ks.length>300)delete WALK[ks[0]];localStorage.setItem("mp_walk",JSON.stringify(WALK))}catch(e){}return sm})}
const circ=(ll,r)=>{const out=[];for(let i=0;i<=48;i++){const a=i/48*2*Math.PI;out.push([ll[1]+r/111320/Math.cos(ll[0]*Math.PI/180)*Math.cos(a),ll[0]+r/110540*Math.sin(a)])}return out};
function hatchImg(){const c=document.createElement("canvas");c.width=c.height=12;const x=c.getContext("2d");x.fillStyle="rgba(179,38,30,.08)";x.fillRect(0,0,12,12);x.strokeStyle="rgba(179,38,30,.55)";x.lineWidth=2.5;x.beginPath();x.moveTo(-3,15);x.lineTo(15,-3);x.moveTo(-9,9);x.lineTo(9,-9);x.moveTo(3,21);x.lineTo(21,3);x.stroke();return x.getImageData(0,0,12,12)}
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

// Dibuja un plano en `el`. base: [lat,lng] del alojamiento · puntos: [{ll,n,top}] en orden de visita ·
// zonas: [{n,ll,r}] zonas de precaución · big: plano grande interactivo.
export function mapaDia(el,{base,puntos,zonas=[],big=false}){
  if(!window.maplibregl)return null;
  const pts=[base,...puntos.map(p=>p.ll)].filter(Boolean);
  const m=new maplibregl.Map({container:el,style:mlStyle(),interactive:big,attributionControl:big?{compact:true,customAttribution:"© OpenFreeMap · © OpenStreetMap"}:false,
    bounds:[[Math.min(...pts.map(x=>x[1])),Math.min(...pts.map(x=>x[0]))],[Math.max(...pts.map(x=>x[1])),Math.max(...pts.map(x=>x[0]))]],fitBoundsOptions:{padding:big?{top:50,bottom:50,left:40,right:140}:30,maxZoom:16}});
  el.classList.add("ml");el._m=m;
  if(big){m.addControl(new maplibregl.NavigationControl({showCompass:false}),"top-left");m.scrollZoom.disable()}
  const mk=(ll,html,lab)=>{const w=document.createElement("div");w.className="mlmk";w.innerHTML=html+(lab?`<span class="mllab">${esc(lab)}</span>`:"");new maplibregl.Marker({element:w,anchor:"left",offset:[big?-15:-11,0]}).setLngLat([ll[1],ll[0]]).addTo(m)};
  const legs=[];let prev=base;puntos.forEach(p=>{if(prev&&p.ll)legs.push({from:prev,to:p.ll});if(p.ll)prev=p.ll});
  m.on("load",()=>{
    const zs=zonas.filter(z=>pts.some(p=>p&&Math.hypot((p[0]-z.ll[0])*111320,(p[1]-z.ll[1])*111320*Math.cos(z.ll[0]*Math.PI/180))<=z.r+120));
    if(zs.length){m.addImage("hatch",hatchImg());m.addSource("hz",{type:"geojson",data:{type:"FeatureCollection",features:zs.map(z=>({type:"Feature",properties:{n:z.n},geometry:{type:"Polygon",coordinates:[circ(z.ll,z.r)]}}))}});
      m.addLayer({id:"hz",type:"fill",source:"hz",paint:{"fill-pattern":"hatch"}});m.addLayer({id:"hz-l",type:"line",source:"hz",paint:{"line-color":"#b3261e","line-width":1.4,"line-dasharray":[3,2]}})}
    m.addSource("walk",{type:"geojson",data:{type:"FeatureCollection",features:legs.map(l=>({type:"Feature",properties:{},geometry:{type:"LineString",coordinates:WALK[wkey(l)]||straight(l)}}))}});
    m.addLayer({id:"walk-h",type:"line",source:"walk",layout:{"line-cap":"round","line-join":"round"},paint:{"line-color":"#fffdf5","line-width":big?6:4.5,"line-opacity":.85}});
    m.addLayer({id:"walk",type:"line",source:"walk",layout:{"line-cap":"round","line-join":"round"},paint:{"line-color":"#2a2620","line-width":big?3:2.4,"line-dasharray":[0.2,2]}});
    if(legs.some(l=>!WALK[wkey(l)]))Promise.all(legs.map(l=>walkGeo(l).catch(()=>straight(l)))).then(gs=>{const s=m.getSource("walk");if(s)s.setData({type:"FeatureCollection",features:gs.map(g=>({type:"Feature",properties:{},geometry:{type:"LineString",coordinates:g}}))})});
  });
  if(base)mk(base,'<div class="lm-h">H</div>',big?"Alojamiento":"");
  puntos.forEach((p,k)=>p.ll&&mk(p.ll,`<div class="lm-a${p.top?" top":""}${big?" big":""}">${k+1}</div>`,big?(p.top?"★ ":"")+p.n.replace(/\s*\(.*?\)/,""):""));
  return m;
}
