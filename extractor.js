const fs = require('fs')
var iconvlite = require('iconv-lite')
const chardet = require('chardet')
const archivo = 'C:/Users/lapena/Documents/Luis Angel/Intelisis/Intelisis3100/Codigo Original/MenuPrincipal.dlg'
const recodificacion = 'Latin1'
const nuevaCarpeta= 'ArchivosNEW/'

function remplazarTexto (archivo, texto) {
  fs.writeFile(nuevaCarpeta+archivo.replace(/.*\//g, ''), texto, function (err) {
    if (err) {
      return console.log(err)
    }
    console.log('CODIFICACION ALMACENADA: ' + chardet.detectFileSync(nuevaCarpeta+archivo.replace(/.*\//g, '')) + '  --  ' + archivo.replace(/.*\//g, ''))
  })
}

function transformar (texto) {
  texto = texto.replace(/\;.*/g, '')
  return texto
}

function recodificar(archivo, recodificacion) {
  var texto = fs.readFileSync(archivo)
  return iconvlite.decode(texto, recodificacion)
}

function procesar (archivo, recodificacion) {
  let textoRecodificado = recodificar(archivo, recodificacion)
  remplazarTexto(archivo, transformar(textoRecodificado))
}

procesar(archivo, recodificacion)