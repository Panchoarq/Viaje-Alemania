// Estilo de mapa «cuaderno» (tonos tierra, OpenFreeMap) copiado de paris.html para el motor de viajes nuevos.
const MLC={land:"#f4ead2",sea:"#c9d7d2",seaEdge:"#a9bab4",park:"#dfe0bf",wood:"#d3d7b2",bld:"#e7d7b4",bldEdge:"#cdb98f",major:"#ecdcb6",majorCase:"#a8956f",mid:"#fffdf5",midCase:"#a8956f",minor:"#fffdf5",minorCase:"#bba985",path:"#c2b08a",rail:"#9c8f7a",lab:"#6d6455"};
function mlStyle(){const C=MLC,z=(a,b,c,d)=>["interpolate",["exponential",1.5],["zoom"],a,b,c,d],tr=k=>["in",["get","class"],["literal",k]];
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
export {MLC,mlStyle};
