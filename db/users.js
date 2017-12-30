const Router = require('koa-router');
const db = require('./db');

const router = new Router();

router.post("/Users/get_user/",async (ctx,next)=>{
    ctx.body =await db.OneResponse(
        'NOT SUCCESS:get_user',
        async (client)=>{
            let queryMap = ctx.request.body
            return await get_user(client, queryMap.userid)
        })
})

router.post("/Users/create_user/",async (ctx,next)=>{
    ctx.body = await db.OneResponse(
        'NOT SUCCESS:create_user',
        async (client)=>{
            let queryMap = ctx.request.body
            return await create_user(client,queryMap.userid,queryMap.pwd)
        })
})

router.post("/Users/update_user/",async (ctx,next)=>{
    ctx.body = await db.OneResponse(
        'NOT SUCCESS:update_user',
        async (client)=>{
            let queryMap = ctx.request.body
            return await update_user(client, queryMap.userid, queryMap.pwd);
        })
})

router.post("/Users/delete_user/",async (ctx,next)=>{
    ctx.body = await db.OneResponse(
        'NOT SUCCESS:delete_user',
        async (client)=>{
            let queryMap = ctx.request.body
            return await delete_user(client, queryMap.userid, queryMap.pwd);
        })
})

const openPack = {
    getRouter:function (){
        return router
    },
}
module.exports = openPack

async function get_user(client, userid){
    let res = await client.query('SELECT * FROM users WHERE userid = $1',
     [userid])
    return  (res.rowCount===1)?res.rows[0]:null
}

async function create_user(client, userid, pwd){
    let record = await get_user(client,userid);
    if(record!=null)//user已經存在
        return null
        
    let res = await client.query("INSERT INTO users (userid, pwd) VALUES ($1,$2) RETURNING userid",
     [userid, pwd])
    return  (res.rowCount===1)?res.rows[0]:null
}

async function update_user(client, userid, pwd){
    let res = await client.query("UPDATE users SET pwd = $2 WHERE userid = $1 RETURNING userid",
     [userid, pwd])
    return  (res.rowCount===1)?res.rows[0]:null
}

//(1)取得所有的清單
//(2)刪除所有的清單
async function delete_user(client, userid){
    let res = await client.query("DELETE FROM users WHERE userid = $1 RETURNING userid",
     [userid])
    return  (res.rowCount===1)?res.rows[0]:null
}

async function delete_user(client, userid){
    let res = await client.query("DELETE FROM users WHERE userid = $1 RETURNING userid",
     [userid])
    return  (res.rowCount===1)?res.rows[0]:null
}
