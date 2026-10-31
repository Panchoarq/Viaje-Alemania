// Definición del viaje: datos + tramos. El motor (../engine.js) solo lee esto.
// Un tramo = ciudad + fechas + viajeros + ritmo por defecto. Cada tramo tiene su organizador.
export const TRIP={
  id:"paris",
  title:"Viaje a París",
  doc:["trips","paris"],        // ruta Firestore del plan
  ls:"paris",                   // prefijo de localStorage (compatible con /paris)
  people:2,                     // viajeros por defecto (un tramo puede indicar los suyos con `viajeros`)
  viajeros:["Francisco","Alli"],
  colors:{PA:"#2e4f8f",LO:"#1d6f7a"},
  cities:{
    LO:{n:"Londres",p:"🇬🇧",ll:[51.5074,-0.1278],transit:"metro (Tube)",geo:", London"},
    PA:{n:"París",p:"🇫🇷",ll:[48.8566,2.3522],transit:"metro/RER",geo:", Paris"}
  },
  // nombres de los campos de fecha/dirección dentro de `wiz` (datos guardados en Firestore)
  keys:{llega:"ida_llega",ini:"ida_fecha",parIni:"eur_fecha",parFin:"vue_fecha",lonDir:"lon_dir",parDir:"par_dir"},
  tramos:[
    {k:"LO", city:"LO",label:"Londres con Alli",ritmo:"int",viajeros:["Francisco","Alli"]},
    {k:"PAJ",city:"PA",label:"París con Alli",ritmo:"rap",viajeros:["Francisco","Alli"]},
    // tras la partida de Alli el ritmo sigue la preferencia antigua `ST.ritmo`
    {k:"PAS",city:"PA",label:"París (después de Alli)",ritmo:"rel",ritmoSiIntenso:"int"}
  ]
};
