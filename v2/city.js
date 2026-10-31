// Módulo genérico de ciudad: lo que sirve para cualquier tramo de un viaje (fechas, organizador de días, costos).
// No conoce ningún viaje en particular ni toca el DOM. El motor de París no lo usa todavía.

export const DOW=["dom","lun","mar","mié","jue","vie","sáb"],MON=["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
export const D=s=>{const [y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d)};
export const iso=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
export const add=(s,n)=>{const d=D(s);d.setDate(d.getDate()+n);return iso(d)};
export const pretty=s=>{const d=D(s);return `${DOW[d.getDay()]} ${d.getDate()} ${MON[d.getMonth()]}`};
export const fmtH=h=>{const m=Math.round(h*60);return String(Math.floor(m/60)).padStart(2,"0")+":"+String(m%60).padStart(2,"0")};
export const money=(v,dec)=>(Math.round(v*100)/100).toLocaleString("es-CL",{minimumFractionDigits:dec?2:0,maximumFractionDigits:2})+" €";

export function km(a,b){const R=6371,t=x=>x*Math.PI/180,dl=t(b[0]-a[0]),dn=t(b[1]-a[1]);
  const h=Math.sin(dl/2)**2+Math.cos(t(a[0]))*Math.cos(t(b[0]))*Math.sin(dn/2)**2;return 2*R*Math.asin(Math.sqrt(h))}
// horas de traslado entre dos puntos (a pie si es corto, transporte si no)
export const moveH=(a,b)=>{if(!a||!b)return .25;const k=km(a,b);return k<=1.2?k*.22:.2+k*.05};

// Tramos a partir de la configuración: orden, noches y fecha de inicio → fechas por ciudad.
// El día de salida de un tramo es el de llegada del siguiente (día de viaje compartido).
export function tramosDe(cfg){let t=cfg.start;return cfg.order.map(c=>{const n=cfg.nights[c];const r={k:c,ini:t,fin:add(t,n),noches:n};t=r.fin;return r})}

// Días de un tramo: desde el día de llegada. El día de salida pertenece al tramo siguiente (día de viaje),
// salvo en el último tramo, donde sí se incluye (`last`: salida con poco tiempo para actividades).
export function diasDe(tr,ultimo){const out=[];for(let d=tr.ini;ultimo?d<=tr.fin:d<tr.fin;d=add(d,1))out.push({d,first:d===tr.ini,last:ultimo&&d===tr.fin});return out}

// Organizador genérico: reparte actividades elegidas en los días del tramo.
// acts: [{key,n,h,ll,full,night,closed:[0..6],pin?:fecha}] · opts: {capDia, capLlegada, capSalida, base}
export function organizar(dias,acts,opts={}){
  const cap=d=>d.first&&d.last?0:d.first?(opts.capLlegada??4.5):d.last?(opts.capSalida??2):(opts.capDia??8);
  const plan=dias.map(d=>({...d,cap:cap(d),usado:0,acts:[]}));
  const sobran=[];
  const dow=d=>D(d).getDay();
  const cabe=(p,a)=>(a.full?p.cap>=6&&!p.acts.length:p.usado+a.h<=p.cap+1e-9)&&!(a.closed||[]).includes(dow(p.d))&&!p.acts.some(x=>x.full);
  const put=(p,a)=>{p.acts.push(a);p.usado+=a.full?p.cap:a.h};
  // 1) fijadas a una fecha
  acts.filter(a=>a.pin).forEach(a=>{const p=plan.find(x=>x.d===a.pin);if(p)put(p,a);else sobran.push(a)});
  // 2) día completo y el resto: más grandes primero, en el día con espacio cuyo centro esté más cerca
  const libres=acts.filter(a=>!a.pin).sort((a,b)=>(b.full?1:0)-(a.full?1:0)||b.h-a.h);
  const centro=p=>{const l=p.acts.filter(x=>x.ll);if(!l.length)return null;return [l.reduce((s,x)=>s+x.ll[0],0)/l.length,l.reduce((s,x)=>s+x.ll[1],0)/l.length]};
  libres.forEach(a=>{
    const ok=plan.filter(p=>cabe(p,a));
    if(!ok.length){sobran.push(a);return}
    ok.sort((p,q)=>{const cp=centro(p),cq=centro(q),dp=cp&&a.ll?km(cp,a.ll):99,dq=cq&&a.ll?km(cq,a.ll):99;return dp-dq||p.usado-q.usado});
    put(ok[0],a)});
  // secuencia dentro del día: de mañana a noche, vecino más cercano
  plan.forEach(p=>{const dia=p.acts.filter(a=>!a.night),noche=p.acts.filter(a=>a.night);
    let t=p.first?15:9.5,pos=opts.base||null;const rest=dia.slice(),seq=[];
    while(rest.length){rest.sort((a,b)=>moveH(pos,a.ll)-moveH(pos,b.ll));const a=rest.shift();t+=a.ll?moveH(pos,a.ll):0;
      seq.push({...a,st:t});t+=a.h;if(a.ll)pos=a.ll}
    noche.forEach(a=>{t=Math.max(t,19.5);seq.push({...a,st:t});t+=a.h});
    p.seq=seq;p.fin=t});
  return {plan,sobran};
}

// ----- Costos de alojamiento -----
// roomMode "t": el precio de la habitación es del total de la estadía; "n": por noche.
export const stayTotal=(precio,modo,noches)=>modo==="t"?precio:precio*noches;
