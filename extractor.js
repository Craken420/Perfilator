const fs = require('fs')
const iconvlite = require('iconv-lite')

const archivoDLGMAVI = 'C:/Users/lapena/Documents/Luis Angel/Intelisis/Intelisis3100/Reportes MAVI' +
                       '/MenuPrincipal_DLG_MAVI.esp'

const archivoMenuPrincipal = 'C:/Users/lapena/Documents/Luis Angel/Intelisis/Intelisis3100/Codigo Original/' +
                             'MenuPrincipal.dlg'
                             
let recodificacion = 'Latin1'

const jsonRegEx = {

  'clsComentarios': /\;.*/g,
  'clsAmpersand':   /\&/g,
  'clsNull':        /null/gm,
  'reducirRuta':    /.*\//,
  'buscarPunto':    /\./g,
  'limpiarObjeto':  /[\\\[\"\]]/g,
  'buscarComa':     /\,/gm,
  'todos':  /Nombre\=.*?(?=\\)|(?<=\\n)Menu\=.*?(?=\\)|NombreDesplegar\=.*?(?=\\)|TipoAccion\=.*?(?=\\)|ClaveAccion\=.*?(?=\\)/gm,
  'nombre': /(?<=Nombre\=).*/gi,
  'menu':   /(?<=Menu\=).*/gm,
  'nombreDesplegar': /(?<=NombreDesplegar\=).*/gm,
  'tipoAccion':      /(?<=TipoAccion\=).*/gm,
  'claveAccion':     /(?<=ClaveAccion\=).*/gm,
  'metodos': {
    'limpiarTexto':   (texto) => {return texto.replace(jsonRegEx.clsComentarios, '').replace(jsonRegEx.clsAmpersand, '')},
    'limpiarObjeto':  (texto) => {return texto.replace(jsonRegEx.limpiarObjeto, '').replace(jsonRegEx.buscarComa, '\n')},
    'remplazarPunto': (arreglo, posicion) => {return arreglo[posicion].replace(jsonRegEx.buscarPunto, '\\.')}
  }
}

function crearExpresion (arreglo, posicion) {
  return new RegExp(`\\[.*?${jsonRegEx.metodos.remplazarPunto(arreglo, posicion)}[^*]*?(?=\\[)`, `g`)
}

function extraer (arreglo, texto) {
  texto = texto + '\n['
  texto = jsonRegEx.metodos.limpiarTexto(texto)
  
  let objetoPerfiles     = {}
  let extraccionReducida = ''

  for(let posicion = 0; posicion < arreglo.length; posicion++) {

    extraccionReducida = extraerTexto(crearExpresion(arreglo, posicion), texto)

    if (extraccionReducida !== 'null') {

      let datosObjeto = extraerTextoObjeto(extraccionReducida)

      objetoPerfiles[arreglo[posicion]] = {

        'nombre'          : datosObjeto.nombreMenuItem,
        'menu'            : datosObjeto.menuItem,
        'nombreDesplegar' : datosObjeto.nombreDesplegarItem,
        'tipoAccion'      : datosObjeto.tipoAccionItem,
        'claveAccion'     : datosObjeto.claveAccionItem
      }
    }
  }
  return objetoPerfiles
}

function extraerTexto(expresion, texto) {
  return jsonRegEx.metodos.limpiarObjeto(JSON.stringify( JSON.stringify(texto.match(expresion)).match(jsonRegEx.todos)))
}

function extraerTextoObjeto(extraccionReducida) {

  let nombreMenuItem      = ''
  let menuItem            = ''
  let nombreDesplegarItem = ''
  let tipoAccionItem      = ''
  let claveAccionItem     = ''

  nombreMenuItem      = extraccionReducida.match(jsonRegEx.nombre)
  menuItem            = extraccionReducida.match(jsonRegEx.menu)
  nombreDesplegarItem = extraccionReducida.match(jsonRegEx.nombreDesplegar)
  tipoAccionItem      = extraccionReducida.match(jsonRegEx.tipoAccion)
  claveAccionItem     = extraccionReducida.match(jsonRegEx.claveAccion)

  nombreMenuItem      = jsonRegEx.metodos.limpiarObjeto(JSON.stringify(nombreMenuItem))
  menuItem            = jsonRegEx.metodos.limpiarObjeto(JSON.stringify(menuItem)) 
  nombreDesplegarItem = jsonRegEx.metodos.limpiarObjeto(JSON.stringify(nombreDesplegarItem))
  tipoAccionItem      = jsonRegEx.metodos.limpiarObjeto(JSON.stringify(tipoAccionItem))
  claveAccionItem     = jsonRegEx.metodos.limpiarObjeto(JSON.stringify(claveAccionItem))
  
  return {
    nombreMenuItem: nombreMenuItem,
    menuItem: menuItem,
    nombreDesplegarItem: nombreDesplegarItem,
    tipoAccionItem: tipoAccionItem,
    claveAccionItem: claveAccionItem
  }
}

function procesarArreglo(archivo, recodificacion, arreglo) {
  return extraer(arreglo, recodificar(archivo, recodificacion))
}

function recodificar(archivo, recodificacion) {
  return iconvlite.decode(fs.readFileSync(archivo), recodificacion)
}

exports.enviarObj = function (arreglo) {

  let extraccionMenuP = procesarArreglo(archivoMenuPrincipal, recodificacion, arreglo)
  let extraccionDLGMAVI= procesarArreglo(archivoDLGMAVI, recodificacion, arreglo)

  for (key in extraccionMenuP) {

    if (extraccionDLGMAVI[key] != undefined) {
        let propiedadObj = Object.getOwnPropertyNames(extraccionDLGMAVI[key])

        for (key2 in propiedadObj) {
          extraccionMenuP[key][ propiedadObj[key2] ] = extraccionDLGMAVI[key][ propiedadObj[key2] ]
        }
    }
    delete extraccionDLGMAVI[key]
  }

  let objMenuPCambio = Object.assign(extraccionMenuP, extraccionDLGMAVI)
  return objMenuPCambio
}