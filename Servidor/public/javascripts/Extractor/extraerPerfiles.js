/*** Achivos ***/
const carpeta = require('../Utilerias/Archivos/jsonCarpetas')

/*** Operadores de archivos ***/
const recodificar = require('../Utilerias/Codificacion/contenidoRecodificado')

/*** Operadores de objetos ***/
const extraerCampos = require('../Utilerias/OperadorObjetos/extractorDeCampos')
const unirObjs = require('../Utilerias/OperadorObjetos/unirCmpOriginalEsp')

exports.enviarObj = function (arregloCmps) {
  return  unirObjs.cmpOriginalEsp(
              extraerCampos.extraerCamposCmp(
                arregloCmps, recodificar.extraerContenidoRecodificado(
                    carpeta.carpetas.archivoMenuPrincipal3100
                  )
              ),
              extraerCampos.extraerCamposCmp(
                arregloCmps, recodificar.extraerContenidoRecodificado(
                    carpeta.carpetas.archivoDLGMAVI3100
                  )
              )
          )
}