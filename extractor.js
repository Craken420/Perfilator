const chardet = require('chardet')
const fs = require('fs')
const iconvlite = require('iconv-lite')
exports.archivoDLGMAVI = 'C:/Users/lapena/Documents/Luis Angel/Intelisis/Intelisis3100/Reportes MAVI' +
                       '/MenuPrincipal_DLG_MAVI.esp'
exports.archivoMenuPrincipal = 'C:/Users/lapena/Documents/Luis Angel/Intelisis/Intelisis3100/Codigo Original/' +
                             'MenuPrincipal.dlg'
                             
//const arreglo = ['Mov.Ventas', 'Mov.Inventarios']
const nuevaCarpeta= 'ArchivosNEW/'
exports.recodificacion = 'Latin1'
const jsonRegEx = {
  'clsTexto' : {
                'clsComentarios': /\;.*/g,
                'clsAmpersand':   /\&/g,
                'clsNull':        /null/gm,
               },
  'reducirRuta': /.*\//,
  'buscarPunto': /\./g,
  'limpiarCadena': {
                     'limpiarObjeto': /[\\\[\"\]]/g,
                     'buscarComa':    /\,/gm
                   },
  'buscarCampos': {
    'todos':/Nombre\=.*?(?=\\)|(?<=\\n)Menu\=.*?(?=\\)|NombreDesplegar\=.*?(?=\\)|TipoAccion\=.*?(?=\\)|ClaveAccion\=.*?(?=\\)/gm,
    'nombre':/(?<=Nombre\=).*?(?=\,)/gi,
    'menu':/(?<=Menu\=).*?(?=\,)/gm,
    'nombreDesplegar':/(?<=NombreDesplegar\=).*?(?=\,)/gm,
    'tipoAccion':/(?<=TipoAccion\=).*?(?=\,)/gm,
    'claveAccion':/(?<=ClaveAccion\=).*/gm,
  }
}
var jsonGeneral = {}

function crearExpresion (arreglo, posicion) {
  return new RegExp(`\\[.*?${arreglo[posicion].replace(jsonRegEx.buscarPunto, '\\.')}[^*]*?(?=\\[)`, `g`)
}

function extraer (archivo, arreglo, texto, jsonTexto) {
  texto = texto.replace(jsonRegEx.clsTexto.clsComentarios, '').replace(jsonRegEx.clsTexto.clsAmpersand, '') + '\n['
  let extraccionCompleta = ''
  var arrayobjItem = new Array();
  for(let posicion =0; posicion < arreglo.length; posicion++) {
    extraccionFuncion = extraerTexto(archivo, crearExpresion(arreglo, posicion), extraccionCompleta, posicion, texto, arreglo, jsonTexto)
    extraccionCompleta = extraccionFuncion.extraccionCompleta
    jsonTexto = extraccionFuncion.jsonTexto
   console.log('estado arreglo: ' + extraccionFuncion.objItem)
   if ( extraccionFuncion.objItem != null)
    arrayobjItem.push(extraccionFuncion.jsonTexto);
   }
  let extraccionReducida = extraccionFuncion.extraccionReducida
  extraccionReducida = extraccionReducida.replace(jsonRegEx.limpiarCadena.limpiarObjeto, '').replace(jsonRegEx.limpiarCadena.buscarComa, '\n')
  return {
    extraccionReducida:extraccionReducida,
    extraccionCompleta:extraccionCompleta,
    jsonTexto,
    arrayobjItem: arrayobjItem
  } 
}

function extraerTexto(archivo, expresion, extraccionCompleta, posicion, texto, arreglo, jsonTexto) {
  let extraccionGeneral =JSON.stringify(texto.match(expresion)).match(jsonRegEx.buscarCampos.todos)
  let extraccionReducida = JSON.stringify(extraccionGeneral)
  extraccionCompleta += extraccionReducida + '\n\n'
  let jsonTextoMR = extraerTextoJson(extraccionGeneral, arreglo, posicion)
  
  extraccionCompleta = extraccionCompleta.replace(jsonRegEx.limpiarCadena.limpiarObjeto, '').replace(jsonRegEx.limpiarCadena.buscarComa, '\n')
  // console.log(`${posicion} : ${archivo.replace(jsonRegEx.reducirRuta, '')} --- ${arreglo[posicion]} \n`+
  //             `RegEx creada:  ${expresion} \nExtraccion: \n`+
  //             `${extraccionReducida.replace(jsonRegEx.limpiarCadena.limpiarObjeto, '').replace(jsonRegEx.limpiarCadena.buscarComa, ', ')}\n`)
  return {
    extraccionCompleta: extraccionCompleta,
    extraccionReducida: extraccionReducida.replace(jsonRegEx.limpiarCadena.limpiarObjeto, '').replace(jsonRegEx.limpiarCadena.buscarComa, '\n'),
    jsonTexto: jsonTextoMR.jsonTexto,
    objItem: jsonTextoMR.objItem
  } 
}

function extraerTextoJson(extraccionGeneral) {
  var jsonTexto = {}
  if (extraccionGeneral != null) {
    let nombreMenuItem = JSON.stringify(extraccionGeneral).match(jsonRegEx.buscarCampos.nombre)
    let menuItem = JSON.stringify(extraccionGeneral).match(jsonRegEx.buscarCampos.menu)
    let nombreDesplegarItem = JSON.stringify(extraccionGeneral).match(jsonRegEx.buscarCampos.nombreDesplegar)
    let tipoAccionItem = JSON.stringify(extraccionGeneral).match(jsonRegEx.buscarCampos.tipoAccion)
    let claveAccionItem = JSON.stringify(extraccionGeneral).match(jsonRegEx.buscarCampos.claveAccion)
    nombreMenuItem = JSON.stringify(nombreMenuItem).replace(jsonRegEx.limpiarCadena.limpiarObjeto, '')
    menuItem = JSON.stringify(menuItem).replace(jsonRegEx.limpiarCadena.limpiarObjeto, '') 
    nombreDesplegarItem = JSON.stringify(nombreDesplegarItem).replace(jsonRegEx.limpiarCadena.limpiarObjeto, '')
    tipoAccionItem = JSON.stringify(tipoAccionItem).replace(jsonRegEx.limpiarCadena.limpiarObjeto, '') 
    claveAccionItem = JSON.stringify(claveAccionItem).replace(jsonRegEx.limpiarCadena.limpiarObjeto, '')
    jsonTexto.nombre= nombreMenuItem,
    jsonTexto.menu = menuItem,
    jsonTexto.nombreDesplegar= nombreDesplegarItem,
    jsonTexto.tipoAccion= tipoAccionItem,
    jsonTexto.claveAccion= claveAccionItem
    var objItem = new Object();
    objItem.nombre= nombreMenuItem,
    objItem.menu = menuItem,
    objItem.nombreDesplegar= nombreDesplegarItem,
    objItem.tipoAccion= tipoAccionItem,
    objItem.claveAccion= claveAccionItem
  }
  return {
    jsonTexto: jsonTexto,
    objItem: objItem
  }
}

exports.procesarArreglo = function(archivo, recodificacion, arreglo) {
  var jsonTexto = {}
  var extraccion = extraer(archivo, arreglo, recodificar(archivo, recodificacion), jsonTexto)
  let extraccionCompleta = extraccion.extraccionCompleta
  let extraccionReducida= extraccion.extraccionReducida
  let jsonExtraido = extraccion.jsonTexto
  jsonTexto += jsonExtraido
  remplazarTexto(archivo, extraccionCompleta)
  console.log('Despues de remplazar retornmos: ' + extraccion.jsonTexto.nombreItem)
  extraccionCompleta = extraccionCompleta.replace(jsonRegEx.clsTexto.clsNull, '')
  objExtraccion = extraccion.arrayobjItem
  return objExtraccion
}

function recodificar(archivo, recodificacion) {
  return iconvlite.decode(fs.readFileSync(archivo), recodificacion)
}

function remplazarTexto (archivo, texto) {
  fs.writeFile(nuevaCarpeta + archivo.replace(jsonRegEx.reducirRuta, ''), texto.replace(jsonRegEx.clsTexto.clsNull, ''), function (error) {
    if (error) {
      return console.log(error)
    }
    console.log('CODIFICACION ALMACENADA: ' +
                 chardet.detectFileSync(nuevaCarpeta+archivo.replace(jsonRegEx.reducirRuta, '')) +
                 '  --  ' +  archivo.replace(jsonRegEx.reducirRuta, ''))
  })
}

// procesar(archivoMenuPrincipal, recodificacion)
// procesar(archivoDLGMAVI, recodificacion)