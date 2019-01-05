const chardet = require('chardet')
const fs = require('fs')
const iconvlite = require('iconv-lite')

const archivoDLGMAVI = 'C:/Users/lapena/Documents/Luis Angel/Intelisis/Intelisis3100/Reportes MAVI/MenuPrincipal_DLG_MAVI.esp'
const archivoMenuPrincipal = 'C:/Users/lapena/Documents/Luis Angel/Intelisis/Intelisis3100/Codigo Original/MenuPrincipal.dlg'
const arreglo = ['Mov.Ventas', 'Mov.Inventarios']
const nuevaCarpeta= 'ArchivosNEW/'
const recodificacion = 'Latin1'

function crearExpresion (arreglo, posicion) {
  return new RegExp(`\\[.*?${transformar('agregarEscape',arreglo[posicion])}[^*]*?(?=\\[)`, `g`)
}

function extraer (archivo, arreglo, texto) {
  texto = transformar('borrarTexto', texto + '\n[')
  let extraccionCompleta = ''
  for(let posicion =0; posicion < arreglo.length; posicion++) {
    extraccionCompleta = extraerTexto(archivo, crearExpresion(arreglo, posicion), extraccionCompleta, posicion, texto)
  }
  return extraccionCompleta
}

function extraerTexto (archivo, expresion, extraccionCompleta, posicion, texto) {
  let extraccionGeneral = transformar('matchGeneral', JSON.stringify(texto.match(expresion)))
  let extraccionReducida = JSON.stringify(extraccionGeneral)
  extraccionCompleta += extraccionReducida + '\n\n'
  extraccionCompleta = transformar('limpiarCadena', extraccionCompleta)
  console.log(`${posicion} : ${transformar('reducirRuta', archivo)} --- ${arreglo[posicion]} \n`+
              `RegEx creada:  ${expresion} \nExtraccion: \n${transformar('limpiarCadena',extraccionReducida)}\n`)
  return extraccionCompleta
}

function procesar (archivo, recodificacion) {
  remplazarTexto(archivo, extraer(archivo, arreglo, recodificar(archivo, recodificacion)))
}

function recodificar(archivo, recodificacion) {
  return iconvlite.decode(fs.readFileSync(archivo), recodificacion)
}

function remplazarTexto (archivo, texto) {
  fs.writeFile(nuevaCarpeta + transformar('reducirRuta', archivo), texto, function (error) {
    if (error) {
      return console.log(error)
    }
    console.log('CODIFICACION ALMACENADA: ' +
                 chardet.detectFileSync(nuevaCarpeta+transformar('reducirRuta', archivo)) +
                 '  --  ' + transformar('reducirRuta', archivo))
  })
}

function transformar (opcion, texto) {
  switch(opcion){
    case 'borrarTexto': {
      return texto.replace(/\;.*/g, '').replace(/\&/g, '')
    }
    case 'reducirRuta': {
      return texto.replace(/.*\//, '')
    }
    case 'agregarEscape': {
      return texto.replace(/\./g, '\\.')
    }
    case 'limpiarCadena': {
      return texto = texto.replace(/[\[\"\]]/g, '').replace(/\,/gm, '\n')
    }
    case 'matchGeneral': {
      return texto.match(/Nombre\=.*?(?=\\)|(?<=\\n)Menu\=.*?(?=\\)|NombreDesplegar\=.*?(?=\\)|TipoAccion\=.*?(?=\\)|ClaveAccion\=.*?(?=\\)/gm)
    }
  }
}

procesar(archivoMenuPrincipal, recodificacion)
procesar(archivoDLGMAVI, recodificacion)