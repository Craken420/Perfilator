const chardet = require('chardet')
const fs = require('fs')
const iconvlite = require('iconv-lite')

exports.archivoDLGMAVI = 'C:/Users/lapena/Documents/Luis Angel/Intelisis/Intelisis3100/Reportes MAVI' +
                       '/MenuPrincipal_DLG_MAVI.esp'

exports.archivoMenuPrincipal = 'C:/Users/lapena/Documents/Luis Angel/Intelisis/Intelisis3100/Codigo Original/' +
                             'MenuPrincipal.dlg'

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
    'nombre':/(?<=Nombre\=).*/gi,
    'menu':/(?<=Menu\=).*/gm,
    'nombreDesplegar':/(?<=NombreDesplegar\=).*/gm,
    'tipoAccion':/(?<=TipoAccion\=).*/gm,
    'claveAccion':/(?<=ClaveAccion\=).*/gm,
  }
}

function crearExpresion (arreglo, posicion) {
  return new RegExp(`\\[.*?${arreglo[posicion].replace(jsonRegEx.buscarPunto, '\\.')}[^*]*?(?=\\[)`, `g`)
}

function extraer (archivo, arreglo, texto) {
  texto = texto.replace(jsonRegEx.clsTexto.clsComentarios, '').replace(jsonRegEx.clsTexto.clsAmpersand, '') + '\n['
  var objetoPerfiles = {}
  let extraccionReducida = ''
  for(let posicion =0; posicion < arreglo.length; posicion++) {

    let expresion = crearExpresion(arreglo, posicion)
    extraccionReducida = extraerTexto(expresion,texto)

    if (extraccionReducida == 'null') {
      console.log('extractor no encontro coincidencia')
    } else {

      let datosObjeto = extraerTextoObjeto(extraccionReducida)
      extraerTextoObjeto(extraccionReducida, arreglo, posicion)

      objetoPerfiles[arreglo[posicion]] = {
        'nombre': datosObjeto.nombreMenuItem,
        'menu': datosObjeto.menuItem,
        'nombreDesplegar': datosObjeto.nombreDesplegarItem,
        'tipoAccion': datosObjeto.tipoAccionItem,
        'claveAccion': datosObjeto.claveAccionItem
      }
    }
  }
  return objetoPerfiles
}

function extraerTexto(expresion, texto) {
  let extraccion = JSON.stringify(texto.match(expresion)).match(jsonRegEx.buscarCampos.todos)
    let extraccionString = JSON.stringify(extraccion)
    extraccionString = extraccionString.replace(jsonRegEx.limpiarCadena.limpiarObjeto, '').replace(jsonRegEx.limpiarCadena.buscarComa, '\n')
    return extraccionString
}

function extraerTextoObjeto(extraccionReducida) {
  let nombreMenuItem = ''
  let menuItem = ''
  let nombreDesplegarItem = ''
  let tipoAccionItem = ''
  let claveAccionItem = ''

  nombreMenuItem = extraccionReducida.match(jsonRegEx.buscarCampos.nombre)
  menuItem = extraccionReducida.match(jsonRegEx.buscarCampos.menu)
  nombreDesplegarItem = extraccionReducida.match(jsonRegEx.buscarCampos.nombreDesplegar)
  tipoAccionItem = extraccionReducida.match(jsonRegEx.buscarCampos.tipoAccion)
  claveAccionItem = extraccionReducida.match(jsonRegEx.buscarCampos.claveAccion)

  nombreMenuItem = JSON.stringify(nombreMenuItem).replace(jsonRegEx.limpiarCadena.limpiarObjeto, '')
  menuItem = JSON.stringify(menuItem).replace(jsonRegEx.limpiarCadena.limpiarObjeto, '') 
  nombreDesplegarItem = JSON.stringify(nombreDesplegarItem).replace(jsonRegEx.limpiarCadena.limpiarObjeto, '')
  tipoAccionItem = JSON.stringify(tipoAccionItem).replace(jsonRegEx.limpiarCadena.limpiarObjeto, '')
  claveAccionItem = JSON.stringify(claveAccionItem).replace(jsonRegEx.limpiarCadena.limpiarObjeto, '')
  
  return {
    nombreMenuItem :nombreMenuItem,
    menuItem: menuItem,
    nombreDesplegarItem: nombreDesplegarItem,
    tipoAccionItem: tipoAccionItem,
    claveAccionItem: claveAccionItem
  }
}

exports.procesarArreglo = function(archivo, recodificacion, arreglo) {
  var extraccion = extraer(archivo, arreglo, recodificar(archivo, recodificacion))
  return extraccion
}

function recodificar(archivo, recodificacion) {
  let extraccionMenuP = iconvlite.decode(fs.readFileSync(archivo), recodificacion)
  return extraccionMenuP
}