const fs = require('fs')
var iconvlite = require('iconv-lite')
const chardet = require('chardet')
const archivoMenuPrincipal = 'C:/Users/lapena/Documents/Luis Angel/Intelisis/Intelisis3100/Codigo Original/MenuPrincipal.dlg'
const archivoDLGMAVI = 'C:/Users/lapena/Documents/Luis Angel/Intelisis/Intelisis3100/Reportes MAVI/MenuPrincipal_DLG_MAVI.esp'
var array = ['Mov.Ventas', 'Mov.Inventarios']
const recodificacion = 'Latin1'
const nuevaCarpeta= 'ArchivosNEW/'

function remplazarTexto (archivo, texto) {
  fs.writeFile(nuevaCarpeta+archivo.replace(/.*\//, ''), texto, function (err) {
    if (err) {
      return console.log(err)
    }
    console.log('CODIFICACION ALMACENADA: ' + chardet.detectFileSync(nuevaCarpeta+archivo.replace(/.*\//, '')) + '  --  ' + archivo.replace(/.*\//g, ''))
  })
}

function extraer (archivo, array, texto) {
  texto = transformar(1, texto)
  texto = texto + '\n['
  let extraccionCompleta= ''
  for(let i =0; i<array.length; i++){
    let arrayExpresion = array[i].replace(/\./g, '\\.')
    let preExpresion = `\\[.*?${arrayExpresion}[^*]*?(?=\\[)`
    var expresion = new RegExp(preExpresion, "g")
    var res = texto.match(expresion)
    let newres = JSON.stringify(res)
    let extraccion = newres.match(/Nombre\=.*?(?=\\)|(?<=\\n)Menu\=.*?(?=\\)|NombreDesplegar\=.*?(?=\\)|TipoAccion\=.*?(?=\\)|ClaveAccion\=.*?(?=\\)/gm)
    let newextraccion = JSON.stringify(extraccion)
    extraccionCompleta += newextraccion + '\n\n'
    extraccionCompleta = extraccionCompleta.replace(/[\[\"\]]/g, '').replace(/\,/gm, '\n')
    console.log(`${i} : ${archivo.replace(/.*\//, '')} --- ${array[i]} \nRegEx creada:  ${expresion} \nExtraccion: ${newextraccion.replace(/[\[\"\]]/g, '').replace(/\,/gm, ', ')}\n\n`)
  }
  return extraccionCompleta
}

function transformar (opcion, texto) {
  switch(opcion){
    case 1: {
      texto = texto.replace(/\;.*/g, '')
      texto = texto.replace(/\&/g, '')
      return texto
    }
  }
  // texto = texto.replace(/\;.*/g, '')
  // texto = texto.replace(/\&/g, '')
  // return texto
}

function recodificar(archivo, recodificacion) {
  var texto = fs.readFileSync(archivo)
  return iconvlite.decode(texto, recodificacion)
}

function procesar (archivo, recodificacion) {
  let textoRecodificado = recodificar(archivo, recodificacion)
  let extraccion = extraer(archivo, array, textoRecodificado)
  remplazarTexto(archivo, extraccion)
}

procesar(archivoMenuPrincipal, recodificacion)
procesar(archivoDLGMAVI, recodificacion)
