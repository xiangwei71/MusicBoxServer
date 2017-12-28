const Router = require('koa-router');
const db = require('./db');

const router = new Router();

router.post("/Musics/create_music/",async (ctx,next)=>{
    ctx.body =await db.OneResponse(
        ctx.request.body,
        pack.create_music,
        'NOT SUCCESS:create_music')
})

router.post("/Musics/user_ref_a_music/",async (ctx,next)=>{
    ctx.body =await db.OneResponse(
        ctx.request.body,
        pack.user_ref_a_music,
        'NOT SUCCESS:user_ref_a_music')
})

router.post("/Musics/user_delete_a_ref_music/",async (ctx,next)=>{
    ctx.body =await db.OneResponse(
        ctx.request.body,
        pack.user_delete_a_ref_music,
        'NOT SUCCESS:user_delete_a_ref_music')
})

router.post("/Musics/user_add_a_music_owner/",async (ctx,next)=>{
    ctx.body =await db.OneResponse(
        ctx.request.body,
        pack.user_add_a_music_owner,
        'NOT SUCCESS:user_add_a_music_owner')
})

router.post("/Musics/user_become_not_a_creator_of_music/",async (ctx,next)=>{
    ctx.body =await db.OneResponse(
        ctx.request.body,
        pack.user_become_not_a_creator_of_music,
        'NOT SUCCESS:user_become_not_a_creator_of_music')
})

router.post("/Musics/get_all_music_under_this_list/",async (ctx,next)=>{
    ctx.body =await db.OneResponse(
        ctx.request.body,
        pack.get_all_music_under_this_list,
        'NOT SUCCESS:get_all_music_under_this_list')
})

router.post("/Musics/get_all_music_I_creat/",async (ctx,next)=>{
    ctx.body =await db.OneResponse(
        ctx.request.body,
        pack.get_all_music_I_creat,
        'NOT SUCCESS:get_all_music_I_creat')
})

router.post("/Musics/delete_music/",async (ctx,next)=>{
    ctx.body =await db.OneResponse(
        ctx.request.body,
        pack.delete_music,
        'NOT SUCCESS:delete_music')
})


router.post("/Musics/get_music_all_creator/",async (ctx,next)=>{
    ctx.body =await db.OneResponse(
        ctx.request.body,
        pack.get_music_all_creator,
        'NOT SUCCESS:get_music_all_creator')
})

router.post("/Musics/get_music_ref/",async (ctx,next)=>{
    ctx.body =await db.OneResponse(
        ctx.request.body,
        pack.get_music_ref,
        'NOT SUCCESS:get_music_ref')
})

const pack ={
    getRouter:function (){
        return router
    },

    create_music:async function(client,queryMap){
        return await create_music(client,
             queryMap.userid, queryMap.listid, queryMap.musicname, queryMap.description, queryMap.ispublic)
    },

    user_ref_a_music:async function(client,queryMap){
        return await user_ref_a_music(client, 
        queryMap.listid, queryMap.musicid, true)
    },

    user_delete_a_ref_music:async function(client,queryMap){
        return await user_delete_a_ref_music(client, 
            queryMap.listid, queryMap.musicid)
    },

    user_add_a_music_owner:async function(client,queryMap){
        return await user_add_a_music_owner(client, 
            queryMap.userid, queryMap.musicid)
    },

    user_become_not_a_creator_of_music:async function(client,queryMap){
        return await user_become_not_a_creator_of_music(client, 
            queryMap.userid, queryMap.musicid)
    },

    get_all_music_under_this_list:async function(client,queryMap){
        return await get_all_music_under_this_list(client, 
            queryMap.listid)
    },

    get_all_music_I_creat:async function(client,queryMap){
        return await get_all_music_I_creat(client, 
            queryMap.userid)
    },

    get_music_all_creator:async function(client,queryMap){
        return await get_music_all_creator(client, 
            queryMap.musicid)
    },

    get_music_ref:async function(client,queryMap){
        return await get_music_ref(client, 
            queryMap.musicid)
    },
 
    
    delete_music:async function(client,queryMap){
        return await delete_music(client, 
            queryMap.userid, queryMap.musicid)
    },
    //(1)修改ispublic需要多作什麼處理？

}
module.exports = pack

//(1)新增Music
//(2)建立usermusic關聯
//(3)建立listmusic關聯
//return: id, musicname, description, isref
async function create_music(client, userid, listid, musicname, description, ispublic) {
    try {
        await client.query('BEGIN')

        const { rows } = await client.query("INSERT INTO musics (musicname, description, ispublic) VALUES ($1, $2, $3) RETURNING id, musicname, description",
        [musicname, description, ispublic])

        const musicid = rows[0].id
        await client.query("INSERT INTO usermusic (userid, musicid) VALUES ($1,$2)",
         [userid, musicid])

        await client.query("INSERT INTO listmusic (listid, musicid, isref) VALUES ($1,$2,$3)",
         [listid, musicid, false])
        
        await client.query('COMMIT')

        rows[0].isref = false
        return rows[0]
    } catch (e) {
        await client.query('ROLLBACK')
        throw e
    }
}

async function user_ref_a_music(client, listid, musicid, isref){
    try {
        await client.query('BEGIN')

        let {rowCount} = await client.query("select 1 from listmusic where listid = $1 and musicid = $2",
         [listid, musicid])

        if(rowCount==1)//已經存在了
            return null

        let res = await client.query("INSERT INTO listmusic (listid, musicid, isref) VALUES ($1, $2, $3)",
         [listid, musicid, isref])

        res = await client.query("update musics SET refcount = refcount+1 WHERE id = $1 returning *",
         [musicid])
        
        await client.query('COMMIT')

        return  (res.rowCount===1)?res.rows[0]:null
    } catch (e) {
        await client.query('ROLLBACK')
        throw e
    }
}

async function user_delete_a_ref_music(client, listid, musicid){
    try {
        await client.query('BEGIN')

        let {rowCount} = await client.query("select 1 from listmusic where listid = $1 and musicid = $2",
         [listid, musicid])

        if(rowCount==0)//不存在
            return null

        res = await client.query("DELETE FROM listmusic WHERE listid = $1 AND musicid = $2",
         [listid, musicid])

        res = await client.query("update musics SET refcount = refcount-1 WHERE id = $1 returning *",
         [musicid])
        
        await client.query('COMMIT')

        return  (res.rowCount===1)?res.rows[0]:null
    } catch (e) {
        await client.query('ROLLBACK')
        throw e
    }
}

async function user_add_a_music_owner(client, userid, musicid){
    try{
        await client.query('BEGIN')

        let res = await client.query("select 1 from usermusic where userid = $1 and musicid = $2",
        [userid, musicid])
   
        if(res.rowCount==1)//已經存在了
           return null
   
        res = await client.query("INSERT INTO usermusic (userid, musicid) VALUES ($1, $2)",
        [userid, musicid])

        res = await client.query("update musics SET ownercount = ownercount+1 WHERE id = $1 returning *",
        [musicid])

        await client.query('COMMIT')

        return  (res.rowCount===1)?res.rows[0]:null
    }catch (e) {
        await client.query('ROLLBACK')
        throw e
    }
}

async function user_become_not_a_creator_of_music(client, userid, musicid){
    try{
        await client.query('BEGIN')

        let res = await client.query("select 1 from usermusic where userid = $1 and musicid = $2",
        [userid, musicid])
   
        if(res.rowCount==0)//不存在
           return null

        res = await client.query("DELETE FROM usermusic WHERE userid = $1 AND musicid = $2",
        [userid, musicid])

        res = await client.query("update musics SET ownercount = ownercount-1 WHERE id = $1 returning *",
        [musicid])

        await client.query('COMMIT')

        return  (res.rowCount===1)?res.rows[0]:null
    }catch (e) {
        await client.query('ROLLBACK')
        throw e
    }
}

async function get_all_music_under_this_list(client, listid) {
    let res = await client.query("select listmusic.listid, listmusic.musicid, musicname, description, voterscount, averagestart, ownercount,refcount,createtime, isref FROM listmusic,musics where listmusic.musicid = musics.id and listmusic.listid = $1 order by isref, createtime desc",
     [listid])
    return  (res.rowCount>0)?res.rows:[]
}

async function get_music_all_creator(client, musicid) {
    let res = await client.query("select * from usermusic where musicid = $1",
     [musicid])
    return  (res.rowCount>0)?res.rows:[]
}

async function get_music_all_ref_user(client, musicid) {
    let res = await client.query("select * from listmusic where musicid = $1",
     [musicid])
    return  (res.rowCount>0)?res.rows:[]
}

async function get_all_music_I_creat(client, userid) {
    let res = await client.query("select musics.id, musicname, description, voterscount, averagestart, createtime,ownercount FROM usermusic,musics where usermusic.musicid = musics.id and usermusic.userid = $1",
     [userid])
    return  (res.rowCount>0)?res.rows:[]
}

//(1)刪除listmusic關聯(實體和ref)
//(2)刪除usermusic關聯(作者)
//(3)刪除music
async function delete_music(client, userid, musicid) {
    try {
        await client.query('BEGIN')

        let res = await client.query("select ownercount from musics where id = $1",
        [musicid])

        if(res.rowCount!==1){//檢查musicid是否存在
            console.log('delete musicid = %d, not exist',musicid)
            return null 
        }

        if(res.rows[0].ownercount!==1){//檢查是不是有其他owner
            console.log('delete musicid = %d, but ownercount!=1',musicid)
            return null 
        }

        //(1)刪除listmusic關聯(實體和ref)
        await client.query("delete from listmusic where musicid = $1",
        [musicid])

        //(2)刪除usermusic關聯(作者)
        await client.query("delete from usermusic where userid = $1 and musicid = $2",
         [userid, musicid])

        //(3)刪除music
        res = await client.query("delete from musics where id = $1 returning *",
         [musicid])
        
        await client.query('COMMIT')

        return res.rows[0]
    } catch (e) {
        await client.query('ROLLBACK')
        throw e
    }
}

async function get_music_ref(client, musicid) {
    let res = await client.query("select listid from listmusic where musicid = $1 and isref = true",
     [musicid])
    return  (res.rowCount>0)?res.rows:[]
}