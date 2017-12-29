const { Pool ,Client } = require('pg');

const pool = new Pool({
    host: 'localhost',
    database: 'musicbox',
    user: 'postgres',
    password: 'joy727',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  })

async function dbOperation(queryMap,todoFun){
    const client = await pool.connect()
    try {
        return await todoFun(client,queryMap)
    } finally {
        client.release()
        //console.log("release")
    }
}

const db={
    Query_Error :'Query_Error',

    OneResponse:async function (queryMap,todoFun,errorMsg){
        let record
        try{
            record = await dbOperation(queryMap,todoFun)
        } catch(e){
            console.log("[error]")
            console.log(e.stack)
            record = db.Query_Error
        }
    
        if(record==null)
            record = errorMsg
        
        let json = {"data":record} 
        return json
    }
}

module.exports = db