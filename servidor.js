
const extractor = require('./extractor')
const express = require('express')
const bodyParser = require("body-parser")
const sql = require("mssql")

const aplicacion = express()
aplicacion.use(bodyParser.json())
aplicacion.use(express.json())
aplicacion.use(express.urlencoded())
sql.close()

const puerto = 5000

const configuracion = {
    user: 'lapena',
    password: 'Alesana4444.',
    server: '172.16.202.9',
    database: 'IntelisisTmp'
}

aplicacion.get('/Usuario/:userId', (solicitud, respuesta) => {
  sql.connect(configuracion, (error) => {
    if (error) console.log(error)

    let solicitudSQL = new sql.Request()
    solicitudSQL.input("param", sql.VarChar, solicitud.params.userId)

    solicitudSQL.query("SELECT Usuario FROM Usuario WHERE Estatus='ALTA' AND Usuario LIKE '%[@param]%' ORDER BY Usuario ", 
    (error, resultado) => {
      if (error) console.log(error)

      respuesta.send(resultado.recordset)
      sql.close()
    })
  })
})

aplicacion.get('/Menus/:Usuario', (solicitud, respuesta) => {
  sql.connect(configuracion, (error) => {
    if (error) console.log(error)

    let solicitudSQL = new sql.Request()
    solicitudSQL.input("param", sql.VarChar, solicitud.params.Usuario)

    solicitudSQL.query("SELECT item FROM UsuarioMenuPrincipal WHERE Usuario = @param",
    (error, resultado) => {
      if (error) console.log(error)

      let respuestaSQL = resultado.recordset
      let consumo = []

      for(let i = 0; i < respuestaSQL.length; i++) {
        let item = respuestaSQL[i]["item"]
        consumo.push(item)
      }
        
      let extraccionMenuP = extractor.procesarArreglo(extractor.archivoMenuPrincipal, extractor.recodificacion, consumo)
        //let extraccionDLG= extractor.procesarArreglo(extractor.archivoDLGMAVI, extractor.recodificacion, consumo)
        // var extraccion = extraer(archivo, arreglo, recodificar(archivo, recodificacion))
        // let extraccionMenuP = extractor.extraer(extractor.archivoMenuPrincipal, consumo, extractor.recodificar(extractor.archivoMenuPrincipal, extractor))
        // console.log(resultado.recordset);
        // console.log('menuP: '+extraccionMenuP);
      console.log('Recivido: '+ extraccionMenuP)
        //extraccionMenuP = extraccionMenuP.replace(/(\\n)+/g, '\n').replace(/\"/, '{').replace(/\"/, '}')
        // var jsonTexto = { }
        // jsonTexto.algo='algodon'
        // jsonTexto['cosa']='cualquier cosa'
        // jsonTexto.variable = {
        //     clave:'123',
        //     nombre:'herramienta'
        // }
        // jsonTexto.newVar = {
        //     item:extraccionMenuP
        // let lol = JSON.stringify(extraccionMenuP)
        // respuesta.json(lol.replace(/\\\\n/gm, '\n'))
      respuesta.send(extraccionMenuP)
      sql.close()
    })
  })
})

var servidor = aplicacion.listen(puerto, () => {
  console.log(`Servidor corriendo en http://localhost:${puerto}`)
})
