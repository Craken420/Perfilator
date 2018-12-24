
var sqlDb = require("mssql");
var conexion = require("./DBConfig");

exports.executeSql = function (sql, callback) {

    var conector = new sqlDb.Connection(conexion.dbConfiguracion);
    conector.connect().then(function () {

        var req = new sqlDb.Request(conector)
        req.query(sql).then(function (resultSet) {

            conector.close()
            callback(resultSet)
        }).catch(function (error) {
            
            console.log(error)
            callback(null, error)
        });
    }).catch(function (error) {
        
        console.log(error)
        callback(null, error)
    })
}