// Copia SOLO LECTURA del plan confirmado de Alemania (Firestore plan/estado + valores por defecto de alemania.html).
// Tomada el 2026-10-31 desde /alemania. No contiene escrituras a Firebase. Valores confirmados por Francisco: migrar tal cual, editables en el motor.
export const CONFIRMADO={
  cfg:{start:"2027-02-15",order:["H","B","P","M"],nights:{M:3,P:2,B:3,H:2},dep:{},v:2},
  hotel:{M:"mei_mucop",P:"czechinn",B:"mei_ber",H:"mei_ham"},
  roomMode:{mei_muc:"t",mei_mucop:"t",downtown:"n",advantage:"n",czechinn:"n",clown:"n",gen_ber:"n",mei_ber:"t",gen_ham:"n",mei_ham:"t"},
  prices:{
    roomPrice:{mei_muc:205,mei_mucop:200,downtown:110,advantage:100,czechinn:62,clown:90,gen_ber:150,mei_ber:318,gen_ham:140,ao_ham:120,mei_ham:219,ao_muc:140},
    bfPrice:{mei_muc:12.5,mei_mucop:12.5,downtown:6,advantage:4,czechinn:6.17,clown:6,gen_ber:9,mei_ber:12.5,gen_ham:9,ao_ham:6.25,mei_ham:12.5,ao_muc:6.25},
    lunchPrice:{mei_muc:8,mei_mucop:9.5,mei_ber:9.5,mei_ham:9.5},
    legPrice:{"K-M":25,"K-B":40,"K-P":40,"M-P":11.9,"M-B":35,"K-H":40,"M-H":40,"P-H":35,"B-H":17.99,"P-B":19.99},
    verified:{"leg:B-H":true,"leg:P-B":true,"leg:M-P":true,"bf:mei_ham":true,"room:mei_ham":true,"lunch:mei_ham":true,"bf:mei_ber":true,"lunch:mei_ber":true,"room:mei_ber":true,"room:czechinn":true,"bf:czechinn":true,"bf:mei_mucop":true,"lunch:mei_mucop":true,"room:mei_mucop":true}
  },
  // trenes internos verificados (VERLEG_DEF de alemania.html)
  trenes:{
    "H>B":{train:"ICE 509",dep:"10:35",arr:"12:21",from:"Hamburg Hbf",to:"Berlin Hbf",price:17.99,stops:"1 parada"},
    "B>P":{train:"RJ 387",dep:"07:28",arr:"11:25",from:"Berlin Hbf",to:"Praha hl.n.",price:19.99,stops:"7 paradas"},
    "P>M":{train:"Bus RegioJet · Standard",dep:"13:30",arr:"18:15",from:"Praha",to:"München",price:11.9,stops:"Relax 13,90 € · visto para lun 22 feb"}
  },
  acts:{"P:2":false,"P:5":true,"P:6":true,"P:7":true,"P:11":true,"B:8":true,"B:12":true,"H:7":true,"M:0":true,"M:1":true,"M:2":true,"H:0":true,"H:1":true,"H:2":true,"H:3":true,"H:4":false,"H:5":true,"H:6":true,"H:8":false,"H:9":false,"B:0":true,"B:1":true,"B:2":true,"B:3":true,"B:4":false,"B:5":false,"B:6":false,"B:7":true,"B:9":true,"B:10":false,"B:11":true,"B:13":true,"B:14":true,"B:15":true,"B:16":false,"B:17":false,"B:18":false,"P:0":true,"P:1":true,"P:3":false,"P:4":false,"P:8":true,"P:9":true,"P:10":false,"P:12":false,"M:3":true,"M:4":true,"M:5":true,"M:6":false,"M:7":false,"M:8":false,"M:9":false,"M:10":true,"M:11":false,"M:12":false,"M:13":true,"M:14":false,"H:10":true,"H:11":true},
  dayPin:{"M:3":"2027-02-24","M:4":"2027-02-24","M:13":"2027-02-24","M:11":"2027-02-24","M:2":"2027-02-25","M:10":"2027-02-25","M:1":"2027-02-25","H:10":"2027-02-16"},
  lock:{"B:2":true,"H:5":true,"H:1":true,"M:13":true,"M:4":true,"M:3":true,"H:2":true,"H:0":true,"H:7":true},
  mealOpt:{"2027-02-15|c":2,"2027-02-17|c":0,"2027-02-18|d":0,"2027-02-18|m":0,"2027-02-18|c":0}
};
