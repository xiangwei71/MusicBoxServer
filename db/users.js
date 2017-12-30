const Router = require('koa-router');
const db = require('./db');

const Get_Not_Success = 'Get_Not_Success'
const Post_Not_Success = 'Post_Not_Success'
const Put_Not_Success = 'Put_Not_Success'
const Delete_Not_Success = 'Delete_Not_Success'

const router = new Router();

router.post("/Users/get/",async (ctx,next)=>{
    ctx.body =await db.OneResponse(
        ctx.request.body,
        pack.get_user,
        Get_Not_Success)
})

router.post("/Users/create/",async (ctx,next)=>{
    ctx.body = await db.OneResponse(
        ctx.request.body,
        pack.create_user,
        Post_Not_Success)
})

router.post("/Users/update/",async (ctx,next)=>{
    ctx.body = await db.OneResponse(
        ctx.request.body,
        pack.update_user,
        Put_Not_Success)
})

router.post("/Users/delete/",async (ctx,next)=>{
    ctx.body = await db.OneResponse(
        ctx.request.body,
        pack.delete_user,
        Delete_Not_Success)
})

const packPack ={
    get_user: async function (client, queryMap){
        return await get_user(client, queryMap.userid)
    },
    
    create_user: async function (client, queryMap){
        let record = await get_user(client,queryMap.userid);
        if(record!=null)//user已經存在
            return null
    
        return create_user(client,queryMap.userid,queryMap.pwd)
    },
    
    update_user: async function(client, queryMap){
        return await update_user(client, queryMap.userid, queryMap.pwd);
    },
    
    delete_user: async function(client, queryMap){
        return await delete_user(client, queryMap.userid);
    }
}

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
