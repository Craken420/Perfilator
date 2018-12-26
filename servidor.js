const express   = require('express')
const sql       = require("mssql")

const db        = require("./db")
const routes    = require('./routes')
const dbConfig  = require("./dbConfig")
const extractor = require('./extractor')


const aplicacion = express()
aplicacion.use(express.json())
aplicacion.use(express.urlencoded())

const puerto = 5000

configuracion = {
  user: 'arbolanos',
  password: 'Alma041995',
  server: '172.16.202.9',
  database: 'IntelisisTmp'
}

aplicacion.get('/Usuario', (solicitud, respuesta) => {

  sql.connect(dbConfig.configuracion, (error) => {

    if (error) console.log(error)

    let solicitudSQL = new sql.Request()

    solicitudSQL.query("SELECT Usuario FROM Usuario ORDER BY Usuario",

    (error, resultado) => {

      if (error) console.log(error)

      respuesta.send(resultado.recordset)
      sql.close()
    })
  })
})

aplicacion.get('/Usuario/:userId',  (solicitud, respuesta) => {

  sql.connect(dbConfig.configuracion, (error) => {

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

aplicacion.get('/MovsConsultas/:Usuario', (solicitud, respuesta) => {

  sql.connect(configuracion, (error) => {

    if (error) console.log(error)

    let solicitudSQL = new sql.Request()

    solicitudSQL.input("param", sql.VarChar, solicitud.params.Usuario)
    solicitudSQL.query("SELECT item FROM UsuarioMovsConsulta WHERE Usuario= @param",

    (error, resultado)  => {

      if (error) console.log(error)
      respuesta.send(resultado.recordset)
      sql.close()
    })
  })
})

aplicacion.get('/MovsEdicion/:Usuario', (solicitud, respuesta) => {

  sql.connect(configuracion, (error) => {

    if (error) console.log(error)

    let solicitudSQL = new sql.Request()

    solicitudSQL.input("param", sql.VarChar, solicitud.params.Usuario)
    solicitudSQL.query("SELECT item FROM UsuarioMovsEdicion WHERE Usuario= @param",

    (error, resultado)  => {

      if (error) console.log(error)
      respuesta.send(resultado.recordset)
      sql.close()
    })
  })
})

aplicacion.get('/Menus/:Usuario', (solicitud, respuesta) => {

  sql.connect(dbConfig.configuracion, (error) => {

    if (error) console.log(error)

    let solicitudSQL = new sql.Request()

    solicitudSQL.input("param", sql.VarChar, solicitud.params.Usuario)
    solicitudSQL.query("SELECT item FROM UsuarioMenuPrincipal WHERE Usuario = @param",

    (error, resultado) => {

      if (error) console.log(error)

      let respuestaSQL = resultado.recordset
      let consumo = []

      for (let i = 0; i < respuestaSQL.length; i++) {

        let item = respuestaSQL[i]["item"]
        consumo.push(item)
      }

      respuesta.send(extractor.enviarObj(consumo))
      sql.close()
    })
  })
})

aplicacion.get('/Reportes/:Usuario', (solicitud, respuesta) => {

  sql.connect(configuracion, (error) => {

    if (error) console.log(error)

    let solicitudSQL = new sql.Request()

    solicitudSQL.input("param", sql.VarChar, solicitud.params.Usuario)
    solicitudSQL.query("SELECT item FROM UsuarioReportes WHERE Usuario= @param",

    (error, resultado) => {

    if (error) console.log(error)

    let respuestaSQL = resultado.recordset
    let consumo = []

    for(let i = 0; i < respuestaSQL.length; i++) {
      let item = respuestaSQL[i]["item"]
      consumo.push(item)
    }

    respuesta.send(extractor.enviarObj(consumo))
    sql.close()
    })
  })
})

const servidor = aplicacion.listen(puerto, () => {
  console.log(`Servidor corriendo en http://localhost:${puerto}`)
})
