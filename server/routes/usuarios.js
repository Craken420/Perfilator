var express = require('express');
var router = express.Router();

const sql = require("mssql")
const dbConfig = require("../public/javascripts/BD/dbConfig")
const extractor = require('../public/javascripts/Extractor/extractor')
var db = require("../public/javascripts/BD/db")

exports.usuarios = (solicitud, respuesta) => {

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
}

exports.usuarioId = (solicitud, respuesta) => {

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
}

exports.menusUsuario = (solicitud, respuesta) => {

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
}

exports.reportesUsuario = (solicitud, respuesta) => {

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
}

exports.movsConsultasUsuario = (solicitud, respuesta) => {

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
}

exports.movsEdicionUsuario = (solicitud, respuesta) => {

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
}