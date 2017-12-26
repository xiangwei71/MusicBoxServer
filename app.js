const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
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

async function getUser(queryMap,client){
    let res = await client.query('SELECT * FROM users WHERE userid = $1', [queryMap.userid])
    return  (res.rowCount===1)?res.rows[0]:null
}

async function addUser(queryMap,client){
    let record = await getUser(queryMap,client);
    if(record==null){
        let res = await client.query("INSERT INTO users (userid, pwd) VALUES ($1,$2) RETURNING userid,pwd", [queryMap.userid,queryMap.pwd])
        return  (res.rowCount===1)?res.rows[0]:null
    }

    return null;
}

async function modifyUserPwd(queryMap,client){
    let record = await getUser(queryMap,client);
    if(record!=null){
        let res = await client.query("UPDATE users SET pwd = $2 WHERE userid = $1 RETURNING userid", [queryMap.userid,queryMap.pwd])
        return  (res.rowCount===1)?res.rows[0]:null
    }

    return null;
}

async function deleteUser(queryMap,client){
    // TODO: 才不是這樣就完成了呢，還有很多事要做!
    let res = await client.query("DELETE FROM users WHERE userid = $1 RETURNING userid", [queryMap.userid])
    return  (res.rowCount===1)?res.rows[0]:null
}

const app = new Koa();
const router = new Router();

const Get_Not_Success ='Get_Not_Success'
const Post_Not_Success ='Post_Not_Success'
const Put_Not_Success ='Put_Not_Success'
const Delete_Not_Success ='Delete_Not_Success'
const Query_Error ='Query_Error'

//這樣才能抓到ctx.request.body
app.use(bodyParser());

router.get("/",async (ctx,next)=>{
    ctx.body="Home";
})

async function OneResponse(queryMap,todoFun,errorMsg){
    let record;
    try{
        record = await dbOperation(queryMap,todoFun)
    } catch(e){
        console.log(e.stack)
        record = Query_Error
    }

    if(record==null)
        record = errorMsg
    
    return record;
}

//get方法沒有body
router.get("/Users/:id",async (ctx,next)=>{
    ctx.body =await OneResponse({userid:ctx.params.id},getUser,Get_Not_Success)
})

router.post("/Users",async (ctx,next)=>{
    ctx.body = await OneResponse(ctx.request.body,addUser,Post_Not_Success)
})

router.put("/Users/:id",async (ctx,next)=>{
    ctx.body = await OneResponse(ctx.request.body,modifyUserPwd,Put_Not_Success)
})

router.delete("/Users/:id",async (ctx,next)=>{
    ctx.body = await OneResponse({userid:ctx.params.id},deleteUser,Delete_Not_Success)
})

app.use(router.routes());

app.listen(3001,()=>{
    console.log("server starting on "+3001);
})

