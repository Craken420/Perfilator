
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
  user: 'arbolanos',
  password: 'Alma041995',
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
      let extraccionDLGMAVI= extractor.procesarArreglo(extractor.archivoDLGMAVI, extractor.recodificacion, consumo)
      // console.log(extraccionMenuP)
      // console.log(extraccionDLGMAVI)
      console.log('for')
      for (key in extraccionMenuP) {
        let cadena = [key]
        console.log('\n-----------------------------------------\n')
        console.log(cadena)
      
        if (extraccionDLGMAVI[key]!=undefined) {
            console.log('\ncoincidencia con : '+ [key] +'  en el extraccionDLGMAVI\n')
            console.log('\n**************************')
            console.log(`Contenido extraccionDLGMAVI en ${key}`)
            console.log(extraccionDLGMAVI[key])
            console.log('\n**************************')
            console.log('\nObject.getOwnPropertyNames(extraccionDLGMAVI[key]):\n')
            let cadena = Object.getOwnPropertyNames(extraccionDLGMAVI[key])
            console.log(cadena)
            console.log('\n**************************')
            console.log('\ncadena[key]\n')
            for (key2 in cadena) {
              console.log(cadena[key2])
              console.log('\ncextraccionDLGMAVI[key][cadena]-- valor del campo ejem(extraccionDLGMAVI[EXPAgente][nombreDesplegar]= ¡¡  soy el campo a modificar !!\n')
              console.log(extraccionDLGMAVI[key][cadena[key2]])
              console.log('\n**************************')
              console.log('\nObjeto Sin Cambio\n')
              console.log(extraccionMenuP[key])
              console.log('\n**************************')
              console.log('\nObjeto Con Cambio\n')
              extraccionMenuP[key][cadena[key2]] = extraccionDLGMAVI[key][cadena[key2]]
              console.log(extraccionMenuP[key])
              console.log('\n**************************')
            }
        }
        console.log('\n-----------------------------------------\n')
        console.log('objetos a eliminar')
        console.log(extraccionDLGMAVI[key])
        delete extraccionDLGMAVI[key];
        console.log('eliminado')
        console.log('\n-----------------------------------------\n')
      }

      console.log('\nAl terminal el proceso del for extraccionMenuP')
      console.log(extraccionMenuP)
      console.log('\nAl terminal el proceso del for extraccionDLGMAVI')
      console.log(extraccionDLGMAVI)
      var objMenuPCambio = Object.assign(extraccionMenuP, extraccionDLGMAVI);
      console.log('\nAl terminal el proceso del for obj')
      console.log(objMenuPCambio)
      respuesta.send(objMenuPCambio)
      sql.close()
    })
  })
})

var servidor = aplicacion.listen(puerto, () => {
  console.log(`Servidor corriendo en http://localhost:${puerto}`)
})
