const chardet = require('chardet')
const fs = require('fs')
const iconvlite = require('iconv-lite')

const archivoDLGMAVI = 'C:/Users/lapena/Documents/Luis Angel/Intelisis/Intelisis3100/Reportes MAVI/MenuPrincipal_DLG_MAVI.esp'
const archivoMenuPrincipal = 'C:/Users/lapena/Documents/Luis Angel/Intelisis/Intelisis3100/Codigo Original/MenuPrincipal.dlg'
const arreglo = ['Mov.Ventas', 'Mov.Inventarios']
const nuevaCarpeta= 'ArchivosNEW/'
const recodificacion = 'Latin1'
const jsonRegEx = {
  'borrarTexto' : {
                    'borrarComentarios': /\;.*/g,
                    'borrarAmpersand': /\&/g
                  },
  'reducirRuta': /.*\//,
  'buscarPunto': /\./g,
  'limpiarCadena': {
                     'limpiarObjeto': /[\[\"\]]/g,
                     'buscarComa': /\,/gm
                   },
  'buscarCampos': /Nombre\=.*?(?=\\)|(?<=\\n)Menu\=.*?(?=\\)|NombreDesplegar\=.*?(?=\\)|TipoAccion\=.*?(?=\\)|ClaveAccion\=.*?(?=\\)/gm
}

function crearExpresion (arreglo, posicion) {
  return new RegExp(`\\[.*?${arreglo[posicion].replace(jsonRegEx.buscarPunto, '\\.')}[^*]*?(?=\\[)`, `g`)
  
}

function extraer (archivo, arreglo, texto) {
  texto = texto.replace(jsonRegEx.borrarTexto.borrarComentarios, '').replace(jsonRegEx.borrarTexto.borrarAmpersand, '') + '\n['
  let extraccionCompleta = ''
  for(let posicion =0; posicion < arreglo.length; posicion++) {
    extraccionCompleta = extraerTexto(archivo, crearExpresion(arreglo, posicion), extraccionCompleta, posicion, texto)
  }
  return extraccionCompleta
}

function extraerTexto (archivo, expresion, extraccionCompleta, posicion, texto) {
  let extraccionGeneral =JSON.stringify(texto.match(expresion)).match(jsonRegEx.buscarCampos)
  let extraccionReducida = JSON.stringify(extraccionGeneral)
  extraccionCompleta += extraccionReducida + '\n\n'
  extraccionCompleta = extraccionCompleta.replace(jsonRegEx.limpiarCadena.limpiarObjeto, '').replace(jsonRegEx.limpiarCadena.buscarComa, '\n')
  console.log(`${posicion} : ${archivo.replace(jsonRegEx.reducirRuta, '')} --- ${arreglo[posicion]} \n`+
              `RegEx creada:  ${expresion} \nExtraccion: \n`+
              `${extraccionReducida.replace(jsonRegEx.limpiarCadena.limpiarObjeto, '').replace(jsonRegEx.limpiarCadena.buscarComa, ', ')}\n`)
  return extraccionCompleta
}

function procesar (archivo, recodificacion) {
  remplazarTexto(archivo, extraer(archivo, arreglo, recodificar(archivo, recodificacion)))
}

function recodificar(archivo, recodificacion) {
  return iconvlite.decode(fs.readFileSync(archivo), recodificacion)
}

function remplazarTexto (archivo, texto) {
  fs.writeFile(nuevaCarpeta + archivo.replace(jsonRegEx.reducirRuta, ''), texto, function (error) {
    if (error) {
      return console.log(error)
    }
    console.log(jsonRegEx.borrarTexto)
    console.log('CODIFICACION ALMACENADA: ' +
                 chardet.detectFileSync(nuevaCarpeta+archivo.replace(jsonRegEx.reducirRuta, '')) +
                 '  --  ' +  archivo.replace(jsonRegEx.reducirRuta, ''))
  })
}

procesar(archivoMenuPrincipal, recodificacion)
procesar(archivoDLGMAVI, recodificacion)
