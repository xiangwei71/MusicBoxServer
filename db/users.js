const Router = require('koa-router');
const db = require('./db');

const router = new Router();

//get方法不會送出body
router.get("/Users/:id",async (ctx,next)=>{
    ctx.body =await db.OneResponse(
        {userid:ctx.params.id},
        users.get,
        db.Get_Not_Success)
})

router.post("/Users/",async (ctx,next)=>{
    ctx.body = await db.OneResponse(
        ctx.request.body,
        users.post,
        db.Post_Not_Success)
})

router.put("/Users/:id",async (ctx,next)=>{
    ctx.body = await db.OneResponse(
        ctx.request.body,
        users.put,
        db.Put_Not_Success)
})

router.delete("/Users/:id",async (ctx,next)=>{
    ctx.body = await db.OneResponse(
        {userid:ctx.params.id},
        users.delete,
        db.Delete_Not_Success)
})

const users ={
    get: async function (queryMap,client){
        let res = await client.query('SELECT * FROM users WHERE userid = $1', [queryMap.userid])
        return  (res.rowCount===1)?res.rows[0]:null
    },
    
    post:async function (queryMap,client){
        let record = await users.get(queryMap,client);
        if(record==null){
            let res = await client.query("INSERT INTO users (userid, pwd) VALUES ($1,$2) RETURNING userid,pwd", [queryMap.userid,queryMap.pwd])
            return  (res.rowCount===1)?res.rows[0]:null
        }
    
        return null;
    },
    
    put:async function (queryMap,client){
        let res = await client.query("UPDATE users SET pwd = $2 WHERE userid = $1 RETURNING userid", [queryMap.userid,queryMap.pwd])
        return  (res.rowCount===1)?res.rows[0]:null
    },
    
    delete:async function (queryMap,client){
        let res = await client.query("DELETE FROM users WHERE userid = $1 RETURNING userid", [queryMap.userid])
        return  (res.rowCount===1)?res.rows[0]:null
    },

    getRouter:function (){
        return router
    }
}

module.exports = users