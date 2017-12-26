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
        return await todoFun(queryMap,client)
    } finally {
        client.release()
        //console.log("release")
    }
}

const db={
    Get_Not_Success :'Get_Not_Success',
    Post_Not_Success :'Post_Not_Success',
    Put_Not_Success :'Put_Not_Success',
    Delete_Not_Success :'Delete_Not_Success',
    Query_Error :'Query_Error',

    OneResponse:async function (queryMap,todoFun,errorMsg){
        let record
        try{
            record = await dbOperation(queryMap,todoFun)
        } catch(e){
            console.log(e.stack)
            record = this.Query_Error
        }
    
        if(record==null)
            record = db.Query_Error
        
        return record
    }
}

module.exports = db