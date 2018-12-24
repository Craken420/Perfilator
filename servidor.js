const express = require('express')
const DBController = require('./DBController')

const aplicacion = express()
aplicacion.use(express.json())
aplicacion.use(express.urlencoded())

const puerto = 5000

aplicacion.get('/Usuario',                DBController.usuarios)
aplicacion.get('/Usuario/:userId',        DBController.usuarioId)
aplicacion.get('/MovsConsultas/:Usuario', DBController.movsConsultasUsuario)
aplicacion.get('/MovsEdicion/:Usuario',   DBController.movsEdicionUsuario)
aplicacion.get('/Menus/:Usuario',         DBController.menusUsuario)
aplicacion.get('/Reportes/:Usuario',      DBController.reportesUsuario)

const servidor = aplicacion.listen(puerto, () => {
  console.log(`Servidor corriendo en http://localhost:${puerto}`)
})
