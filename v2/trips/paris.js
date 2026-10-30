// Definición del viaje: datos + tramos. El motor (../engine.js) solo lee esto.
export const TRIP={
  id:"paris",
  title:"Viaje a París",
  doc:["trips","paris"],        // ruta Firestore del plan
  ls:"paris",                   // prefijo de localStorage (compatible con /paris)
  people:2,
  viajeros:["Francisco","Alli"],
  colors:{PA:"#2e4f8f",LO:"#1d6f7a"},
  // tramos = ciudad + viajeros; cada uno con su organizador y ritmo
  tramos:{LO:"Londres con Alli",PAJ:"París con Alli",PAS:"París (después de Alli)"}
};
