const fs = require('fs')
const iconvlite = require('iconv-lite')

/*** Operadores de archivos ***/
const pcrArchivos = require('../Utilerias/OperadoresArchivos/procesadorArchivos')
const recodificar = require('../Utilerias/Codificacion/contenidoRecodificado')

/*** Operadores de cadena ***/
const regEx = require('../Utilerias/RegEx/jsonRgx')


const opObj = require('../Utilerias/OperadorObjetos/eliminarDuplicado')
const unirObjs = require('../Utilerias/OperadorObjetos/unirCmpOriginalEsp')

const archivoDLGMAVI = 'C:/Users/lapena/Documents/Luis Angel/Intelisis/Intelisis3100/Reportes MAVI' +
                       '/MenuPrincipal_DLG_MAVI.esp'

const archivoMenuPrincipal = 'C:/Users/lapena/Documents/Luis Angel/Intelisis/Intelisis3100/Codigo Original/' +
                             'MenuPrincipal.dlg'

const jsonRegEx = {

  'clsComentarios': /\;.*/g,
  'clsAmpersand':   /\&/g,
  'clsNull':        /null/gm,
  'reducirRuta':    /.*\//,
  'buscarPunto':    /\./g,
  'limpiarObjeto':  /[\\\[\"\]]/g,
  'buscarComa':     /\,/gm,
  'nombre': /(?<=^Nombre\=).*/gim,
  'menu':   /(?<=^Menu\=).*/gm,
  'nombreDesplegar': /(?<=^NombreDesplegar\=).*/gm,
  'tipoAccion':      /(?<=^TipoAccion\=).*/gm,
  'claveAccion':     /(?<=^ClaveAccion\=).*/gm,
  'metodos': {
    'limpiarTexto':   (texto) => {return texto.replace(jsonRegEx.clsComentarios, '').replace(jsonRegEx.clsAmpersand, '')},
    'limpiarObjeto':  (texto) => {return texto.replace(jsonRegEx.limpiarObjeto, '').replace(jsonRegEx.buscarComa, '\n')},
    'remplazarPunto': (arreglo, posicion) => {return arreglo[posicion].replace(jsonRegEx.buscarPunto, '\\.')}
  }
}

function extraerTextoObjeto(extraccionReducida) {
  let nombreMenuItem      = ''
  let menuItem            = ''
  let nombreDesplegarItem = ''
  let tipoAccionItem      = ''
  let claveAccionItem     = ''
  let existeUnCampo       = false

  if (jsonRegEx.nombre.test(extraccionReducida)) {
      nombreMenuItem = extraccionReducida.match(jsonRegEx.nombre).join('')
      existeUnCampo = true
  }

  if (jsonRegEx.menu.test(extraccionReducida)) {
      menuItem = extraccionReducida.match(jsonRegEx.menu).join('')
      existeUnCampo = true
  }

  if (jsonRegEx.nombreDesplegar.test(extraccionReducida)) {
      nombreDesplegarItem = extraccionReducida.match(jsonRegEx.nombreDesplegar).join('')
      existeUnCampo = true
  }

  if (jsonRegEx.tipoAccion.test(extraccionReducida)) {
      tipoAccionItem = extraccionReducida.match(jsonRegEx.tipoAccion).join('')
      existeUnCampo = true
  }

  if (jsonRegEx.claveAccion.test(extraccionReducida)) {
      claveAccionItem = extraccionReducida.match(jsonRegEx.claveAccion).join('')
      existeUnCampo = true
  }

  if(existeUnCampo == true) {
      return {
        Nombre: nombreMenuItem,
        Menu: menuItem,
        NombreDesplegar: nombreDesplegarItem,
        TipoAccion: tipoAccionItem,
        ClaveAccion: claveAccionItem
      }
  }
}

function extraerTexto(expresion, texto) {
    if (expresion.test(texto)){

        return extraerTextoObjeto(texto.match(expresion).join(''))

    } else {
        return false
    }
}

function extraerPerfiles (arreglo, texto) {
  texto = texto + '\n['
  texto = texto.replace(regEx.expresiones.ampersand, '')
  texto = texto.replace(regEx.expresiones.comentariosLineaIntls, '')

  let objetoPerfiles = {}

  for(key in arreglo) {

      let contenido = extraerTexto(
          regEx.crearRegEx.extraerCmpPorNom(
              regEx.jsonReplace.prepararRegEx(arreglo[key])
          ), texto
        )
        
      if (contenido != false) {
        objetoPerfiles[arreglo[key]] = contenido
      }
  }
  return objetoPerfiles
}


exports.enviarObj = function (arreglo) {
  return  unirObjs.cmpOriginalEsp(
              extraerPerfiles(
                  arreglo, recodificar.extraerContenidoRecodificado(archivoMenuPrincipal)
              ),
              extraerPerfiles(
                  arreglo, recodificar.extraerContenidoRecodificado(archivoDLGMAVI)
              )
          )
}