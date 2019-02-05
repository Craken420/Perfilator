const sql = require("mssql")

/*** Achivos ***/
const { carpetas } = require('../public/javascripts/Utilerias/Archivos/jsonCarpetas')

/*** Operadores de Base de datos ***/
const dbConfig = require("../public/javascripts/BD/dbConfig")

/*** Operadores de archivos ***/
const recodificar = require('../public/javascripts/Utilerias/Codificacion/contenidoRecodificado')

/*** Operadores de objetos ***/
const { extraerMultiCmpCampos } = require(
  '../public/javascripts/Utilerias/OperadorObjetos/extractorCmpCampos'
)

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
      let arregloComponentesHerramientas = []

      for (let i = 0; i < respuestaSQL.length; i++) {

        let item = respuestaSQL[i]["item"]
        arregloComponentesHerramientas.push(item)
      }

      let arregloCamposBusqueda = ['Nombre','Menu','NombreDesplegar',
                                   'TipoAccion','ClaveAccion']

      respuesta.send( extraerMultiCmpCampos(
                        arregloCamposBusqueda,
                        arregloComponentesHerramientas,
                        recodificar.extraerContenidoRecodificado(
                            carpetas.archivoDLGMAVI3100
                        ),
                        recodificar.extraerContenidoRecodificado(
                            carpetas.archivoMenuPrincipal3100
                        )
                      )
                    )
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
      let arregloComponentesHerramientas = []

      for(let i = 0; i < respuestaSQL.length; i++) {
        let item = respuestaSQL[i]["item"]
        arregloComponentesHerramientas.push(item)
      }

      let arregloCamposBusqueda = ['Nombre','Menu','NombreDesplegar',
                                   'TipoAccion','ClaveAccion']

      respuesta.send( extraerMultiCmpCampos(
                        arregloCamposBusqueda,
                        arregloComponentesHerramientas,
                        recodificar.extraerContenidoRecodificado(
                            carpetas.archivoDLGMAVI3100
                        ),
                        recodificar.extraerContenidoRecodificado(
                            carpetas.archivoMenuPrincipal3100
                        )
                      )
                    )
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