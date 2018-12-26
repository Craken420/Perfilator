
const sqlDb = require("mssql");
const conexion = require("./dbConfig");

exports.executeSql = function (sql, callback) {

    let conector = new sqlDb.Connection(conexion.dbConfiguracion);
    conector.connect().then(function () {

        let req = new sqlDb.Request(conector)
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