// Definición del viaje a Alemania: datos + tramos. El motor (../engine.js) solo lee esto.
// Los valores confirmados (alojamientos, días y trenes) viven en alemania.confirmado.js y se cargan
// como valores por defecto: son editables desde la interfaz, pero nunca se recalculan ni se estiman.
import {CONFIRMADO} from "./alemania.confirmado.js";

const N=5; // cinco viajeros (16 años)
const viajeros=["Viajero 1","Viajero 2","Viajero 3","Viajero 4","Viajero 5"]; // nombres reales: pendientes

// Fechas por tramo a partir de la configuración confirmada (inicio + orden + noches).
const addDays=(iso,n)=>{const d=new Date(iso+"T12:00:00Z");d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10)};
const fechas=(()=>{const {start,order,nights}=CONFIRMADO.cfg,o={};let t=start;
  order.forEach(c=>{o[c]={ini:t,fin:addDays(t,nights[c])};t=addDays(t,nights[c])});return o})();

export const TRIP={
  id:"alemania",
  title:"Viaje a Alemania",
  doc:["trips","alemania"],      // ruta Firestore del plan nuevo (el plan actual plan/estado no se toca)
  ls:"alemania2",                // prefijo de localStorage distinto del de /alemania
  people:N,
  viajeros,
  colors:{H:"#2e6b62",B:"#9a6a12",P:"#9b2f24",M:"#24477a"},
  cities:{
    H:{n:"Hamburgo",p:"🇩🇪",ll:[53.5511,9.9937],transit:"S-Bahn/U-Bahn (hvv)",geo:", Hamburg"},
    B:{n:"Berlín",p:"🇩🇪",ll:[52.5200,13.4050],transit:"S-Bahn/U-Bahn (BVG)",geo:", Berlin"},
    P:{n:"Praga",p:"🇨🇿",ll:[50.0755,14.4378],transit:"metro/tranvía (PID)",geo:", Praha"},
    M:{n:"Múnich",p:"🇩🇪",ll:[48.1374,11.5755],transit:"U-Bahn/S-Bahn (MVV)",geo:", München"}
  },
  // un tramo por ciudad, en el orden confirmado; fechas derivadas de CONFIRMADO.cfg
  tramos:CONFIRMADO.cfg.order.map(c=>({
    k:c, city:c, label:{H:"Hamburgo",B:"Berlín",P:"Praga",M:"Múnich"}[c],
    ritmo:"int", viajeros, ...fechas[c], noches:CONFIRMADO.cfg.nights[c]
  })),
  confirmado:CONFIRMADO
};
