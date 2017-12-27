const Router = require('koa-router');
const db = require('./db');

const router = new Router();

router.post("/Lists/user_create_a_list/",async (ctx,next)=>{
    ctx.body =await db.OneResponse(
        ctx.request.body,
        lists.user_create_a_list,
        'NOT SUCCESS:user_create_a_list')
})

router.post("/Lists/user_ref_a_list/",async (ctx,next)=>{
    ctx.body =await db.OneResponse(
        ctx.request.body,
        lists.user_ref_a_list,
        'NOT SUCCESS:user_ref_a_list')
})

router.post("/Lists/user_add_a_owner/",async (ctx,next)=>{
    ctx.body =await db.OneResponse(
        ctx.request.body,
        lists.user_add_a_owner,
        'NOT SUCCESS:user_add_a_owner')
})

router.post("/Lists/user_exit_a_list/",async (ctx,next)=>{
    ctx.body =await db.OneResponse(
        ctx.request.body,
        lists.user_exit_a_list,
        'NOT SUCCESS:user_exit_a_list')
})

router.post("/Lists/user_delete_a_ref_list/",async (ctx,next)=>{
    ctx.body =await db.OneResponse(
        ctx.request.body,
        lists.user_delete_a_ref_list,
        'NOT SUCCESS:user_delete_a_ref_list')
})

router.post("/Lists/get_all_list_of_this_user/",async (ctx,next)=>{
    ctx.body =await db.OneResponse(
        ctx.request.body,
        lists.get_all_list_of_this_user,
        'NOT SUCCESS:get_all_list_of_this_user')
})

const lists ={
    getRouter:function (){
        return router
    },
    
    user_create_a_list: async function (client,queryMap){
        return await user_create_a_list(client,
             queryMap.userid, queryMap.listname, queryMap.description, queryMap.ispublic)
    },

    user_ref_a_list: async function (client,queryMap){
        return await add_relation_userlist(client, 
            queryMap.userid, queryMap.listid, true)
    },

    user_add_a_owner: async function (client,queryMap){
        return await add_relation_userlist(client, 
            queryMap.userid, queryMap.listid, false)
    },

    user_exit_a_list: async function (client,queryMap){
        return await remove_relation_userlist(client, 
            queryMap.userid, queryMap.listid)
    },

    user_delete_a_ref_list: async function (client,queryMap){
        return await remove_relation_userlist(client, 
            queryMap.userid, queryMap.listid)
    },

    //(1)join userlist 和 lists
    get_all_list_of_this_user: async function (client,queryMap){
        return await get_all_list_of_this_user(client, 
            queryMap.userid)
    },

    //(1)找出所有的Music
    //For each Music in List{
    //  if (Music不是ref and 沒有其他協作者)｛
    //      如果有其他List加入這首Music，需要從其他List移除對這首Music的ref
    //      刪除Music的實體
    //  ｝
    //}
    //    
    //(2)移除該List所記錄的所有Music
    //    
    //(3)找出ref該List的所有User(並從這些User裡移除該List)
    //(4)刪除該List實體
    delete_user_list: async function (client,queryMap){

    },
}
module.exports = lists

async function add_relation_userlist(client, userid, listid, isref){
    let {rowCount} = await client.query("select 1 from userlist where userid = $1 and listid = $2",
     [userid, listid])

     if(rowCount==1)//已經存在了
        return null

    let res = await client.query("INSERT INTO userlist (userid, listid, isref) VALUES ($1,$2, $3) RETURNING *",
     [userid, listid, isref])
    return  (res.rowCount===1)?res.rows[0]:null
}

async function remove_relation_userlist(client, userid, listid){
    let res = await client.query("DELETE FROM userlist WHERE userid = $1 AND listid = $2 RETURNING *",
     [userid, listid])
    return  (res.rowCount===1)?res.rows[0]:null
}

//(1)建立list
//(2)建立user和list關聯(userlist)
//return: id, listname, description, isref
async function user_create_a_list(client, userid, listname, description, ispublic) {
    try {
        await client.query('BEGIN')

        const { rows } = await client.query("INSERT INTO lists (listname, description, ispublic) VALUES ($1,$2,$3) RETURNING id, listname, description",
         [listname, description, ispublic])

        await client.query("INSERT INTO userlist (userid, listid, isref) VALUES ($1,$2, $3)",
         [userid, rows[0].id, false])
        
        await client.query('COMMIT')

        rows[0].isref = false
        return rows[0]
    } catch (e) {
        await client.query('ROLLBACK')
        throw e
    }
}

async function get_all_list_of_this_user(client, userid) {
    let res = await client.query("select lists.id, listname, description FROM userlist,lists where userlist.listid = lists.id and userid = $1",
     [userid])
    return  (res.rowCount>0)?res.rows:[]
}
