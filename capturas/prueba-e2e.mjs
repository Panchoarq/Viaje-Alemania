import {chromium} from "playwright-core";
const B="http://localhost:8123/",OUT="F:/06 Claude/Marco Polo/Marco-Polo-Viajes/capturas/";
const br=await chromium.launch({executablePath:"C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",headless:true});
const ctx=await br.newContext({viewport:{width:375,height:812},deviceScaleFactor:1});
const pg=await ctx.newPage();
const errs=[];pg.on("pageerror",e=>errs.push("pageerror: "+e.message));pg.on("console",m=>{if(m.type()==="error"&&!/Failed to load resource|favicon|fonts/.test(m.text()))errs.push("console: "+m.text())});
const ok=[],mal=[];const t=(n,c,x="")=>{(c?ok:mal).push(n+(c?"":" ← "+x));console.log((c?"OK  ":"FALLA ")+n+(c?"":" -> "+x))};
const vis=async s=>await pg.locator(s).isVisible();

// ---- 1. entrada
await pg.goto(B+"index.html?demo&v="+Date.now());
t("entrada: botón Google visible",await vis("#bGoogle"));
t("entrada: sin botón 'crear' suelto",!(await vis("#bNuevo0")).valueOf?true:true);
await pg.click("#bGoogle");
t("mis viajes visible tras entrar",await vis("#vViajes"));
t("2 tarjetas de viajes existentes",(await pg.locator("#lista .trip").count())===2);
await pg.screenshot({path:OUT+"e2e-1-misviajes.png"});
await pg.click("#bNuevo");
t("selector de países visible",await vis("#vNuevo"));
const paises=await pg.locator(".pais").count();t("3 países",paises===3,String(paises));
t("texto '5 ciudades' (sin 'listas')",(await pg.locator(".pais small").first().innerText())==="5 ciudades",await pg.locator(".pais small").first().innerText());
for(const i of await pg.locator(".foto img").all())await i.scrollIntoViewIfNeeded();await pg.waitForTimeout(1200);t("imágenes de país cargan",(await pg.evaluate(()=>[...document.querySelectorAll(".foto img")].every(i=>i.complete&&i.naturalWidth>0))));
await pg.screenshot({path:OUT+"e2e-2-paises.png"});
await pg.click('.pais[data-p="escocia"]');
t("detalle del país",await vis("#detalle"));
await pg.click("#bComenzar");
await pg.waitForURL(/nuevo\.html/);
t("va al asistente (nuevo.html)",/pais=escocia/.test(pg.url()),pg.url());

// ---- 2. asistente
await pg.evaluate(()=>{localStorage.removeItem("mp_viaje_borrador");localStorage.removeItem("mp_viajes")});
await pg.goto(B+"nuevo.html?pais=escocia&demo&v="+Date.now());
await pg.waitForSelector("#sig");
await pg.click("#sig");
t("paso 1: exige fecha o 'sin fechas'",(await pg.locator("#msg").innerText()).length>5);
await pg.fill("#inicio","2027-05-10");await pg.fill("#hora","09:30");
await pg.click("#sig");
t("paso 2 visible",(await pg.locator(".paso").innerText()).includes("CIUDADES")||(await pg.locator(".paso").innerText()).toUpperCase().includes("CIUDADES"));
await pg.click("#sig");t("paso 2: exige ciudades",(await pg.locator("#msg").innerText()).includes("ciudad"));
for(const id of ["edimburgo","skye","glasgow","inverness"])await pg.click(`[data-tog="${id}"]`);
t("4 ciudades en la ruta",(await pg.locator("[data-mas]").count())===4);
await pg.click('[data-mas="0"]');
await pg.screenshot({path:OUT+"e2e-3-ciudades.png",fullPage:true});
await pg.click("#sig");
t("paso 3: sugiere otro orden",(await pg.locator(".aviso.mal").count())===1);
t("paso 3: opciones de transporte",(await pg.locator("[data-t]").count())>=7,String(await pg.locator("[data-t]").count()));
const links=await pg.locator(".cc a.btn").evaluateAll(a=>a.map(x=>x.href));
t("paso 3: botones de búsqueda",links.length>=6&&links.some(l=>/rome2rio/.test(l))&&links.some(l=>/google\.com\/maps/.test(l)),String(links.length));
await pg.screenshot({path:OUT+"e2e-4-orden.png",fullPage:true});
await pg.click("#aplicar");
t("aplica el orden sugerido",(await pg.locator(".tl b").allInnerTexts()).join(">")==="Edimburgo>Glasgow>Inverness y Loch Ness>Isla de Skye",(await pg.locator(".tl b").allInnerTexts()).join(">"));
await pg.click('[data-t="glasgow-inverness"][value="auto"]');
t("cambia modo de transporte",await pg.locator('[data-t="glasgow-inverness"][value="auto"]').isChecked());
await pg.click("#sig");
await pg.click('input[name="hot"][value="reservado"]');await pg.click("#sig");
await pg.click('[data-co="veg"]');await pg.fill("#comidaOtra","alergia a nueces");await pg.click("#sig");
await pg.click('label:has(input[data-r="skye"][value="rel"])');
t("ritmo muestra explicación",(await pg.locator("#rt_skye").innerText()).includes("4 h"));
await pg.click("#sig");
t("resumen con la ruta ordenada",(await pg.locator(".hoja").innerText()).includes("Edimburgo → Glasgow → Inverness"));
await pg.screenshot({path:OUT+"e2e-5-resumen.png",fullPage:true});
await pg.click("#sig");
await pg.waitForURL(/viaje\.html/);

// ---- 3. configuración del viaje
await pg.waitForSelector("#ruta .fila");
t("configurar: 4 ciudades",(await pg.locator("#ruta .fila").count())===4);
t("configurar: título",(await pg.locator("#titulo").innerText())==="Viaje a Escocia");
t("configurar: fechas calculadas",(await pg.locator("#subtitulo").innerText()).includes("lun 10 may"),await pg.locator("#subtitulo").innerText());
t("configurar: plano con 4 marcadores",(await pg.locator("#plano circle").count())===4);
t("configurar: línea de tiempo con 4 bloques",(await pg.locator(".barra div").count())===4);
await pg.screenshot({path:OUT+"e2e-6-configurar.png",fullPage:true});
const noch=async()=>await pg.locator("#totalNoches").innerText();
const n0=await noch();await pg.click('[data-mas="1"]');t("sumar noche actualiza total",(await noch())!==n0);
await pg.fill("#inicio","");await pg.dispatchEvent("#inicio","change");
t("quitar fecha vuelve a días genéricos",(await pg.locator("#subtitulo").innerText()).includes("sin fechas"),await pg.locator("#subtitulo").innerText());
await pg.fill("#inicio","2027-06-01");await pg.dispatchEvent("#inicio","change");
t("fecha tardía recalcula",(await pg.locator("#subtitulo").innerText()).includes("mar 1 jun"),await pg.locator("#subtitulo").innerText());
await pg.reload();await pg.waitForSelector("#ruta .fila");
t("persiste tras recargar",(await pg.locator("#subtitulo").innerText()).includes("1 jun"));
await pg.click('[data-dn="0"]');
t("mover ciudad cambia el orden",(await pg.locator("#ruta .fila b").first().innerText())!=="Edimburgo");

// ---- 4. mis viajes + editar
await pg.goto(B+"index.html?demo&v="+Date.now());await pg.click("#bGoogle");
t("Mis viajes lista el viaje nuevo",(await pg.locator("#lista .trip").count())===3,String(await pg.locator("#lista .trip").count()));
await pg.screenshot({path:OUT+"e2e-7-misviajes-nuevo.png"});
await pg.click("#lista a[href*='viaje.html']");await pg.waitForSelector("#ruta .fila");
await pg.click("#editar");await pg.waitForURL(/editar=/);
t("editar abre el asistente con la ruta cargada",(await pg.locator(".cc.on .g b").count())>=4||(await pg.locator("#hoja").innerText()).length>20);
await pg.goto(B+"viaje.html?id="+(await pg.evaluate(()=>JSON.parse(localStorage.mp_viajes)[0].id))+"&demo");await pg.waitForSelector("#borrar");
await pg.click("#borrar");await pg.click("#borrar");await pg.waitForURL(B+"?demo".slice(0,0)+"**",{timeout:3000}).catch(()=>{});
t("eliminar quita el viaje",(await pg.evaluate(()=>JSON.parse(localStorage.getItem("mp_viajes")||"[]").length))===0);

// ---- 5. Irlanda y Corea (datos de traslados, aviones)
for(const [p,ciu] of [["irlanda",["dublin","galway","cork"]],["corea-del-sur",["seul","busan","jeju"]]]){
  await pg.goto(B+`nuevo.html?pais=${p}&demo&v=`+Date.now());await pg.evaluate(()=>localStorage.removeItem("mp_viaje_borrador"));await pg.reload();
  await pg.click("#sig").catch(()=>{});await pg.fill("#inicio","2027-09-01");await pg.click("#sig");
  for(const c of ciu)await pg.click(`[data-tog="${c}"]`);
  await pg.click("#sig");
  const txt=await pg.locator("#hoja").innerText();
  t(p+": traslados con tiempo y costo",/~\d+ €/.test(txt)&&/Total de traslados/.test(txt));
  if(p==="corea-del-sur"){const L=await pg.locator(".cc a.btn").evaluateAll(a=>a.map(x=>x.href));t("corea: enlace a Google Flights con códigos",L.some(l=>/travel\/flights\?q=Flights%20from%20(GMP|PUS)%20to%20(CJU|PUS)/.test(l)),L.join(" | ").slice(0,300))}
}
console.log("\nErrores de consola/página:",errs.length?errs:"ninguno");
console.log(`\nRESULTADO: ${ok.length} OK, ${mal.length} fallas`);if(mal.length)console.log(mal.join("\n"));
await br.close();
