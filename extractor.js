const chardet = require('chardet')
const fs = require('fs')
const iconvlite = require('iconv-lite')
exports.archivoDLGMAVI = 'C:/Users/lapena/Documents/Luis Angel/Intelisis/Intelisis3100/Reportes MAVI' +
                       '/MenuPrincipal_DLG_MAVI.esp'
exports.archivoMenuPrincipal = 'C:/Users/lapena/Documents/Luis Angel/Intelisis/Intelisis3100/Codigo Original/' +
                             'MenuPrincipal.dlg'
                             
//const arreglo = ['Mov.Ventas', 'Mov.Inventarios']
const nuevaCarpeta= 'ArchivosNEW/'
exports.recodificacion = 'Latin1'
const jsonRegEx = {
  'clsTexto' : {
                'clsComentarios': /\;.*/g,
                'clsAmpersand':   /\&/g,
                'clsNull':        /null/gm,
               },
  'reducirRuta': /.*\//,
  'buscarPunto': /\./g,
  'limpiarCadena': {
                     'limpiarObjeto': /[\\\[\"\]]/g,
                     'buscarComa':    /\,/gm
                   },
  'buscarCampos': {
    'todos':/Nombre\=.*?(?=\\)|(?<=\\n)Menu\=.*?(?=\\)|NombreDesplegar\=.*?(?=\\)|TipoAccion\=.*?(?=\\)|ClaveAccion\=.*?(?=\\)/gm,
    'nombre':/(?<=Nombre\=).*/gi,
    'menu':/(?<=Menu\=).*/gm,
    'nombreDesplegar':/(?<=NombreDesplegar\=).*/gm,
    'tipoAccion':/(?<=TipoAccion\=).*/gm,
    'claveAccion':/(?<=ClaveAccion\=).*/gm,
  }
}
var jsonGeneral = {}

function crearExpresion (arreglo, posicion) {
  return new RegExp(`\\[.*?${arreglo[posicion].replace(jsonRegEx.buscarPunto, '\\.')}[^*]*?(?=\\[)`, `g`)
}

function extraer (archivo, arreglo, texto) {
  texto = texto.replace(jsonRegEx.clsTexto.clsComentarios, '').replace(jsonRegEx.clsTexto.clsAmpersand, '') + '\n['
 // var arrayobjItem = new Array();
  var obj = {}
  let extraccionReducida = ''
  for(let posicion =0; posicion < arreglo.length; posicion++) {
    let expresion = crearExpresion(arreglo, posicion)
    extraccionReducida = extraerTexto(expresion,texto)
    let estado = extraccionReducida
    //console.log('retorno de crearExpresion: ***********\n' +extraccionReducida + '\n*************' + typeof(extraccionReducida))
    if (estado == 'null'){
      console.log('extractor no encontro coincidencia')
    } else {
      let nombreMenuItem = extraccionReducida.match(jsonRegEx.buscarCampos.nombre)
      let menuItem = extraccionReducida.match(jsonRegEx.buscarCampos.menu)
      let nombreDesplegarItem = extraccionReducida.match(jsonRegEx.buscarCampos.nombreDesplegar)
      let tipoAccionItem = extraccionReducida.match(jsonRegEx.buscarCampos.tipoAccion)
      let claveAccionItem = extraccionReducida.match(jsonRegEx.buscarCampos.claveAccion)
      console.log('***********primer sepillado\n')
      console.log('nombreMenuItem:' + nombreMenuItem)
      console.log('menuItem: ' + menuItem)
      console.log('nombreDesplegarItem: ' + nombreDesplegarItem)
      console.log('tipoAccionItem: ' + tipoAccionItem)
      console.log('claveAccionItem: ' + claveAccionItem)
      console.log('\n---------')
      nombreMenuItem = JSON.stringify(nombreMenuItem).replace(jsonRegEx.limpiarCadena.limpiarObjeto, '')
      menuItem = JSON.stringify(menuItem).replace(jsonRegEx.limpiarCadena.limpiarObjeto, '') 
      nombreDesplegarItem = JSON.stringify(nombreDesplegarItem).replace(jsonRegEx.limpiarCadena.limpiarObjeto, '')
      tipoAccionItem = JSON.stringify(tipoAccionItem).replace(jsonRegEx.limpiarCadena.limpiarObjeto, '')
      claveAccionItem = JSON.stringify(claveAccionItem).replace(jsonRegEx.limpiarCadena.limpiarObjeto, '')
      console.log('***********Segundo cepillado \n')
      console.log('nombreMenuItem:' + nombreMenuItem)
      console.log('menuItem: ' + menuItem)
      console.log('nombreDesplegarItem: ' + nombreDesplegarItem)
      console.log('tipoAccionItem: ' + tipoAccionItem)
      console.log('claveAccionItem: ' + claveAccionItem)
      
      obj[arreglo[posicion]] = {
        'nombre': nombreMenuItem,
        'menu': menuItem,
        'nombreDesplegar': nombreDesplegarItem,
        'tipoAccion': tipoAccionItem,
        'claveAccion': claveAccionItem
      }
    }
      // let nombreMenuItem = JSON.stringify(extraccionReducida).match(jsonRegEx.buscarCampos.nombre)
      // let menuItem = JSON.stringify(extraccionReducida).match(jsonRegEx.buscarCampos.menu)
      // let nombreDesplegarItem = JSON.stringify(extraccionReducida).match(jsonRegEx.buscarCampos.nombreDesplegar)
      // let tipoAccionItem = JSON.stringify(extraccionReducida).match(jsonRegEx.buscarCampos.tipoAccion)
      // let claveAccionItem = JSON.stringify(extraccionReducida).match(jsonRegEx.buscarCampos.claveAccion)
      // console.log('***********primer sepillado\n')
      // console.log('nombreMenuItem:' + nombreMenuItem)
      // console.log('menuItem: ' + menuItem)
      // console.log('nombreDesplegarItem: ' + nombreDesplegarItem)
      // console.log('tipoAccionItem: ' + tipoAccionItem)
      // console.log('claveAccionItem: ' + claveAccionItem)
      // console.log('\n---------')

      // // let nombreMenuItem = JSON.stringify(extraccionReducida).match(jsonRegEx.buscarCampos.nombre)
      // // let menuItem = JSON.stringify(extraccionReducida).match(jsonRegEx.buscarCampos.menu)
      // // let nombreDesplegarItem = JSON.stringify(extraccionReducida).match(jsonRegEx.buscarCampos.nombreDesplegar)
      // // let tipoAccionItem = JSON.stringify(extraccionReducida).match(jsonRegEx.buscarCampos.tipoAccion)
      // // let claveAccionItem = JSON.stringify(extraccionReducida).match(jsonRegEx.buscarCampos.claveAccion)
      // // console.log('***********primer sepillado\n')
      // // console.log('nombreMenuItem:' + nombreMenuItem)
      // // console.log('menuItem: ' + menuItem)
      // // console.log('nombreDesplegarItem: ' + nombreDesplegarItem)
      // // console.log('tipoAccionItem: ' + tipoAccionItem)
      // // console.log('claveAccionItem: ' + claveAccionItem)
      // // console.log('\n---------')

      // // nombreMenuItem = JSON.stringify(nombreMenuItem).replace(jsonRegEx.limpiarCadena.limpiarObjeto, '')
      // // menuItem = JSON.stringify(menuItem).replace(jsonRegEx.limpiarCadena.limpiarObjeto, '') 
      // // nombreDesplegarItem = JSON.stringify(nombreDesplegarItem).replace(jsonRegEx.limpiarCadena.limpiarObjeto, '')
      // // tipoAccionItem = JSON.stringify(tipoAccionItem).replace(jsonRegEx.limpiarCadena.limpiarObjeto, '') 
      // // claveAccionItem = JSON.stringify(claveAccionItem).replace(jsonRegEx.limpiarCadena.limpiarObjeto, '')
      
      
      // console.log('***********Segundo cepillado \n')
      // console.log('nombreMenuItem:' + nombreMenuItem)
      // console.log('menuItem: ' + menuItem)
      // console.log('nombreDesplegarItem: ' + nombreDesplegarItem)
      // console.log('tipoAccionItem: ' + tipoAccionItem)
      // console.log('claveAccionItem: ' + claveAccionItem)
      
      //console.log('\n--------')
    // obj[arreglo[posicion]] = {
    //   'nombre': nombreMenuItem,
    //   'menu': menuItem,
    //   'nombreDesplegar': nombreDesplegarItem,
    //   'tipoAccion': tipoAccionItem,
    //   'claveAccion': claveAccionItem
    // }
    }
    //jsonTexto = extraccionFuncion.jsonTextoF
    // for(key in arreglo){
    //   if ( extraccionFuncion.objItem != null){
    //     obj[arreglo[key]] = {
    //       'nombre': extraccionFuncion.jsonTextoF.nombre,
    //       'menu': extraccionFuncion.jsonTextoF.menu,
    //       'nombreDesplegar': extraccionFuncion.jsonTextoF.nombreDesplegar,
    //       'tipoAccion': extraccionFuncion.jsonTextoF.tipoAccion,
    //       'claveAccion': extraccionFuncion.jsonTextoF.claveAccion
    //     }
    //   }
    // }
  //  console.log('estado arreglo: ' + extraccionFuncion.objItem)
  //  if ( extraccionFuncion.objItem != null){
  //   arrayobjItem.push(extraccionFuncion.jsonTextoF);
  //  }

  
  console.log('\n\n obj antes de retornar ---------------\n\n')
  console.log(obj)
  return obj
    //extraccionReducida:extraccionReducida,
    //extraccionCompleta:extraccionCompleta,
    //jsonTexto,
    //arrayobjItem: arrayobjItem,
    //obj
   
}

function extraerTexto(expresion, texto) {
  let extraccion = JSON.stringify(texto.match(expresion)).match(jsonRegEx.buscarCampos.todos)
 
    let extraccionString = JSON.stringify(extraccion)
    extraccionString = extraccionString.replace(jsonRegEx.limpiarCadena.limpiarObjeto, '').replace(jsonRegEx.limpiarCadena.buscarComa, '\n')
    return extraccionString
  
 
 
  //extraccionReducida = extraccionReducida.replace(jsonRegEx.limpiarCadena.limpiarObjeto, '').replace(jsonRegEx.limpiarCadena.buscarComa, '\n')
  // return {
  //   extraccionString
  // }
}

function extraerTexto2(archivo, expresion, extraccionCompleta, posicion, texto, arreglo) {
  let extraccionGeneral =JSON.stringify(texto.match(expresion)).match(jsonRegEx.buscarCampos.todos)
  let extraccionReducida = JSON.stringify(extraccionGeneral)
  extraccionCompleta += extraccionReducida + '\n\n'
  let jsonTextoMR = extraerTextoJson(extraccionGeneral, arreglo, posicion)
  
  extraccionCompleta = extraccionCompleta.replace(jsonRegEx.limpiarCadena.limpiarObjeto, '').replace(jsonRegEx.limpiarCadena.buscarComa, '\n')
  // console.log(`${posicion} : ${archivo.replace(jsonRegEx.reducirRuta, '')} --- ${arreglo[posicion]} \n`+
  //             `RegEx creada:  ${expresion} \nExtraccion: \n`+
  //             `${extraccionReducida.replace(jsonRegEx.limpiarCadena.limpiarObjeto, '').replace(jsonRegEx.limpiarCadena.buscarComa, ', ')}\n`)
  return {
    extraccionCompleta: extraccionCompleta,
    extraccionReducida: extraccionReducida.replace(jsonRegEx.limpiarCadena.limpiarObjeto, '').replace(jsonRegEx.limpiarCadena.buscarComa, '\n'),
    jsonTextoF: jsonTextoMR.jsonTextoF,
    objItem: jsonTextoMR.objItem
  } 
}



function extraerTextoJson(extraccionGeneral, arreglo, posicion) {
  var jsonTextoF = {}
  if (extraccionGeneral != null) {
    let nombreMenuItem = JSON.stringify(extraccionGeneral).match(jsonRegEx.buscarCampos.nombre)
    let menuItem = JSON.stringify(extraccionGeneral).match(jsonRegEx.buscarCampos.menu)
    let nombreDesplegarItem = JSON.stringify(extraccionGeneral).match(jsonRegEx.buscarCampos.nombreDesplegar)
    let tipoAccionItem = JSON.stringify(extraccionGeneral).match(jsonRegEx.buscarCampos.tipoAccion)
    let claveAccionItem = JSON.stringify(extraccionGeneral).match(jsonRegEx.buscarCampos.claveAccion)
    nombreMenuItem = JSON.stringify(nombreMenuItem).replace(jsonRegEx.limpiarCadena.limpiarObjeto, '')
    menuItem = JSON.stringify(menuItem).replace(jsonRegEx.limpiarCadena.limpiarObjeto, '') 
    nombreDesplegarItem = JSON.stringify(nombreDesplegarItem).replace(jsonRegEx.limpiarCadena.limpiarObjeto, '')
    tipoAccionItem = JSON.stringify(tipoAccionItem).replace(jsonRegEx.limpiarCadena.limpiarObjeto, '') 
    claveAccionItem = JSON.stringify(claveAccionItem).replace(jsonRegEx.limpiarCadena.limpiarObjeto, '')
    jsonTextoF.nombre= nombreMenuItem,
    jsonTextoF.menu = menuItem,
    jsonTextoF.nombreDesplegar= nombreDesplegarItem,
    jsonTextoF.tipoAccion= tipoAccionItem,
    jsonTextoF.claveAccion= claveAccionItem
    var objItem = new Object();
    objItem.nombre= nombreMenuItem,
    objItem.menu = menuItem,
    objItem.nombreDesplegar= nombreDesplegarItem,
    objItem.tipoAccion= tipoAccionItem,
    objItem.claveAccion= claveAccionItem
  }
  return {
    jsonTextoF: jsonTextoF,
    objItem: objItem
  }
}

exports.procesarArreglo = function(archivo, recodificacion, arreglo) {
  //var jsonTexto = {}
  var extraccion = extraer(archivo, arreglo, recodificar(archivo, recodificacion))
  //let extraccionCompleta = extraccion.extraccionCompleta
  //let extraccionReducida= extraccion.extraccionReducida
  //let jsonExtraido = extraccion.jsonTexto
  //jsonTexto += jsonExtraido
  //remplazarTexto(archivo, extraccionCompleta)
  //console.log('Despues de remplazar retornmos: ' + extraccion.jsonTexto.nombreItem)
  //extraccionCompleta = extraccionCompleta.replace(jsonRegEx.clsTexto.clsNull, '')
  //objExtraccion = extraccion.arrayobjItem
  //return objExtraccion
  console.log('\n\n obj antes de retornar de procesar Arreglo ---------------\n\n')
  console.log(extraccion)
  return extraccion
}

function recodificar(archivo, recodificacion) {
  return iconvlite.decode(fs.readFileSync(archivo), recodificacion)
}

function remplazarTexto (archivo, texto) {
  fs.writeFile(nuevaCarpeta + archivo.replace(jsonRegEx.reducirRuta, ''), texto.replace(jsonRegEx.clsTexto.clsNull, ''), function (error) {
    if (error) {
      return console.log(error)
    }
    console.log('CODIFICACION ALMACENADA: ' +
                 chardet.detectFileSync(nuevaCarpeta+archivo.replace(jsonRegEx.reducirRuta, '')) +
                 '  --  ' +  archivo.replace(jsonRegEx.reducirRuta, ''))
  })
}

// procesar(archivoMenuPrincipal, recodificacion)
// procesar(archivoDLGMAVI, recodificacion)