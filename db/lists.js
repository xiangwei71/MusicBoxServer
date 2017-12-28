const Router = require('koa-router');
const db = require('./db');
const musics = require('./musics');

const router = new Router();

router.post("/Lists/user_create_a_list/",async (ctx,next)=>{
    ctx.body =await db.OneResponse(
        ctx.request.body,
        pack.user_create_a_list,
        'NOT SUCCESS:user_create_a_list')
})

router.post("/Lists/user_ref_a_list/",async (ctx,next)=>{
    ctx.body =await db.OneResponse(
        ctx.request.body,
        pack.user_ref_a_list,
        'NOT SUCCESS:user_ref_a_list')
})

router.post("/Lists/user_add_a_list_owner/",async (ctx,next)=>{
    ctx.body =await db.OneResponse(
        ctx.request.body,
        pack.user_add_a_list_owner,
        'NOT SUCCESS:user_add_a_list_owner')
})

router.post("/Lists/user_remove_a_list_owner/",async (ctx,next)=>{
    ctx.body =await db.OneResponse(
        ctx.request.body,
        pack.user_remove_a_list_owner,
        'NOT SUCCESS:user_remove_a_list_owner')
})

router.post("/Lists/user_delete_a_ref_list/",async (ctx,next)=>{
    ctx.body =await db.OneResponse(
        ctx.request.body,
        pack.user_delete_a_ref_list,
        'NOT SUCCESS:user_delete_a_ref_list')
})

router.post("/Lists/get_all_list_of_this_user/",async (ctx,next)=>{
    ctx.body =await db.OneResponse(
        ctx.request.body,
        pack.get_all_list_of_this_user,
        'NOT SUCCESS:get_all_list_of_this_user')
})

router.post("/Lists/get_list_owner/",async (ctx,next)=>{
    ctx.body =await db.OneResponse(
        ctx.request.body,
        pack.get_list_owner,
        'NOT SUCCESS:get_list_owner')
})

router.post("/Lists/get_list_ref/",async (ctx,next)=>{
    ctx.body =await db.OneResponse(
        ctx.request.body,
        pack.get_list_ref,
        'NOT SUCCESS:get_list_ref')
})

router.post("/Lists/is_no_music_in_this_list/",async (ctx,next)=>{
    ctx.body =await db.OneResponse(
        ctx.request.body,
        pack.is_no_music_in_this_list,
        'NOT SUCCESS:is_no_music_in_this_list')
})

router.post("/Lists/delete_user_list/",async (ctx,next)=>{
    ctx.body =await db.OneResponse(
        ctx.request.body,
        pack.delete_user_list,
        'NOT SUCCESS:delete_user_list')
})

router.post("/Lists/user_delete_all_ref_list/",async (ctx,next)=>{
    ctx.body =await db.OneResponse(
        ctx.request.body,
        pack.user_delete_all_ref_list,
        'NOT SUCCESS:user_delete_all_ref_list')
})

const pack ={
    user_create_a_list: async function (client,queryMap){
        return await user_create_a_list(client,
             queryMap.userid, queryMap.listname, queryMap.description, queryMap.ispublic)
    },

    user_ref_a_list: async function (client,queryMap){
        return await user_ref_a_list(client, 
            queryMap.userid, queryMap.listid)
    },

    user_add_a_list_owner: async function (client,queryMap){
        return await user_add_a_list_owner(client, 
            queryMap.userid, queryMap.listid)
    },

    user_remove_a_list_owner: async function (client,queryMap){
        return await user_remove_a_list_owner(client, 
            queryMap.userid, queryMap.listid)
    },

    user_delete_a_ref_list: async function (client,queryMap){
        return await user_delete_a_ref_list(client, 
            queryMap.userid, queryMap.listid)
    },

    user_delete_all_ref_list: async function (client,queryMap){
        return await user_delete_all_ref_list(client, 
            queryMap.listid)
    },

    get_all_list_of_this_user: async function (client,queryMap){
        return await get_all_list_of_this_user(client, 
            queryMap.userid)
    },

    get_list_owner: async function (client,queryMap){
        return await get_list_owner(client, 
            queryMap.listid)
    },

    get_list_ref: async function (client,queryMap){
        return await get_list_ref(client, 
            queryMap.listid)
    },

    delete_user_list: async function (client,queryMap){
        return await delete_user_list(client, 
            queryMap.userid,queryMap.listid)
    },

    is_no_music_in_this_list: async function (client,queryMap){
        return await is_no_music_in_this_list(client, 
            queryMap.listid)
    },
}

const openPack ={
    getRouter:function (){
        return router
    },
}
module.exports = openPack

async function user_ref_a_list(client, userid, listid, useTransaction = true){
    let {rowCount} = await client.query("select 1 from userlist where userid = $1 and listid = $2",
         [userid, listid])

    if(rowCount==1)//已經存在了
        return null

    try {
        if(useTransaction)await client.query('BEGIN')

        let res = await client.query("INSERT INTO userlist (userid, listid, isref) VALUES ($1,$2, $3)",
         [userid, listid, true])

        res = await client.query("update lists set refcount = refcount+1 WHERE id = $1 RETURNING *",
         [listid])
        
        if(useTransaction)await client.query('COMMIT')

        return  (res.rowCount===1)?res.rows[0]:null
    } catch (e) {
        if(useTransaction)await client.query('ROLLBACK')
        throw e
    }
}

async function user_delete_a_ref_list(client, userid, listid, useTransaction = true){
    let {rowCount} = await client.query("select 1 from userlist where userid = $1 and listid = $2",
         [userid, listid])

    if(rowCount==0)//不存在
        return null

    try {
        if(useTransaction)await client.query('BEGIN')

        res = await client.query("DELETE FROM userlist WHERE userid = $1 AND listid = $2",
         [userid, listid])

        res = await client.query("update lists set refcount = (refcount-1) WHERE id = $1 RETURNING *",
         [listid])
        
        if(useTransaction)await client.query('COMMIT')

        return  (res.rowCount===1)?res.rows[0]:null
    } catch (e) {
        if(useTransaction)await client.query('ROLLBACK')
        throw e
    }
}

async function user_delete_all_ref_list(client, listid, useTransaction = true){
    try {
        if(useTransaction)await client.query('BEGIN')

        let {rowCount} = await client.query("DELETE FROM userlist WHERE listid = $1 AND isref = true",
         [listid])

        res = await client.query("update lists set refcount = (refcount-$2) WHERE id = $1 RETURNING *",
         [listid, rowCount])
        
        if(useTransaction)await client.query('COMMIT')

        return  (res.rowCount===1)?res.rows[0]:null
    } catch (e) {
        if(useTransaction)await client.query('ROLLBACK')
        throw e
    }
}

async function user_add_a_list_owner(client, userid, listid, useTransaction = true){
    let {rowCount} = await client.query("select 1 from userlist where userid = $1 and listid = $2",
         [userid, listid])

    if(rowCount==1)//已經存在了
        return null

    try {
        if(useTransaction)await client.query('BEGIN')

        let res = await client.query("INSERT INTO userlist (userid, listid, isref) VALUES ($1,$2, $3)",
         [userid, listid, false])
        
        res = await client.query("update lists SET ownercount = ownercount+1 WHERE id = $1 returning *",
         [listid])

        if(useTransaction)await client.query('COMMIT')

        return  (res.rowCount===1)?res.rows[0]:null
    } catch (e) {
        if(useTransaction)await client.query('ROLLBACK')
        throw e
    }
}



async function user_remove_a_list_owner(client, userid, listid, useTransaction = true){
    let {rowCount} = await client.query("select 1 from userlist where userid = $1 and listid = $2",
         [userid, listid])

    if(rowCount==0)//不存在
        return null
        
    try {
        if(useTransaction)await client.query('BEGIN')

        let res = await client.query("DELETE FROM userlist WHERE userid = $1 AND listid = $2",
         [userid, listid])

         res = await client.query("update lists SET ownercount = ownercount-1 WHERE id = $1 returning *",
        [listid])
        
        if(useTransaction)await client.query('COMMIT')

        return  (res.rowCount===1)?res.rows[0]:null
    } catch (e) {
        if(useTransaction)await client.query('ROLLBACK')
        throw e
    }
}

//(1)建立list
//(2)建立user和list關聯(userlist)
//return: id, listname, description, isref
async function user_create_a_list(client, userid, listname, description, ispublic, useTransaction = true) {
    try {
        if(useTransaction)await client.query('BEGIN')

        const { rows } = await client.query("INSERT INTO lists (listname, description, ispublic) VALUES ($1,$2,$3) RETURNING id, listname, description",
         [listname, description, ispublic])

        await client.query("INSERT INTO userlist (userid, listid, isref) VALUES ($1,$2, $3)",
         [userid, rows[0].id, false])
        
        if(useTransaction)await client.query('COMMIT')

        rows[0].isref = false
        return rows[0]
    } catch (e) {
        if(useTransaction)await client.query('ROLLBACK')
        throw e
    }
}

async function get_all_list_of_this_user(client, userid) {
    let res = await client.query("select lists.id, listname, description, createtime, isref FROM userlist,lists where userlist.listid = lists.id and userid = $1 order by  isref , createtime desc",
     [userid])
    return  (res.rowCount>0)?res.rows:[]
}

async function get_list_owner(client, listid) {
    let res = await client.query("select userid FROM userlist where listid = $1 and isref = false",
     [listid])
    return  (res.rowCount>0)?res.rows:[]
}

async function get_list_ref(client, listid) {
    let res = await client.query("select userid FROM userlist where listid = $1 and isref = true",
     [listid])
    return  (res.rowCount>0)?res.rows:[]
}


//!!!如果list裡有許多Music(實體)真的捨得刪嗎？
//
//(0)list有其他擁有者：中斷
//(1)刪除list裡的所有Music(實體):delete_music
//(2)移除List所有的Music(ref):user_delete_a_ref_music
//(3)list是否已經清空？:is_no_music_in_this_list
//  (3-1)刪除所有對這個list的ref或是實體記錄:
//  (3-2)刪除該List實體:
async function delete_user_list(client, userid, listid, useTransaction = true) {
    let refs =await get_list_owner(client, listid)

    if(refs.length >1){//(0)list有其他擁有者：中斷
        console.log('listid = %d, has another owner')
        return null
    }

    //找出所有的music實體
    let res = await client.query("select musicid from listmusic where listid = $1 and isref = false",
     [listid])
    let music_entities = res.rows

    res = await client.query("select musicid from listmusic where listid = $1 and isref = true",
     [listid])
     let music_refs = res.rows

    try {
        if(useTransaction)await client.query('BEGIN')

        //(1)刪除list裡的所有Music(實體):delete_music
        for(let i=0;i<music_entities.length;i++){
            let musicid = music_entities[i].musicid
            musics.delete_music(client,userid,musicid, false)
        }
            
        //(2)移除List所有的Music(ref):
        for(let i=0;i<music_refs.length;i++){
            let musicid = music_refs[i].musicid
            musics.user_delete_a_ref_music(client, listid, musicid, false)
        }

        let is_no_music = await is_no_music_in_this_list(client, listid)
        console.log(is_no_music)
        if(!is_no_music){//(3)list是否已經清空？

            if(useTransaction)await client.query('COMMIT')
            return 'listid = ' + listid + ' still has music entity !'
        }
            
        //  (3-1)刪除所有對這個list的ref或是實體記錄:
        await client.query("delete from userlist where listid = $1",[listid])
        //  (3-2)刪除該List實體:
        res =await client.query("delete from lists where id = $1 returning *",[listid])

        if(useTransaction)await client.query('COMMIT')

        return res.rows[0]
    } catch (e) {
        if(useTransaction)await client.query('ROLLBACK')
        throw e
    }
}

async function is_no_music_in_this_list(client, listid) {
    let res = await client.query("select count(*) as count from listmusic where listid = $1",
     [listid])

    let count = parseInt(res.rows[0].count)
    return (count===0)
}

async function template(client, userid,useTransaction = true) {
    try {
        if(useTransaction)await client.query('BEGIN')

        if(useTransaction)await client.query('COMMIT')
    } catch (e) {
        if(useTransaction)await client.query('ROLLBACK')
        throw e
    }
}