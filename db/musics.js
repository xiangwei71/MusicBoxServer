const Router = require('koa-router');
const db = require('./db');

const router = new Router();

router.post("/Musics/create_music/",async (ctx,next)=>{
    ctx.body =await db.OneResponse(
        'NOT SUCCESS:create_music',
        async function(client){
            let queryMap = ctx.request.body
            return await create_music(client,
                 queryMap.userid, queryMap.listid, queryMap.musicname, queryMap.description, queryMap.ispublic)
        })
})

router.post("/Musics/user_ref_a_music/",async (ctx,next)=>{
    ctx.body =await db.OneResponse(
        'NOT SUCCESS:user_ref_a_music',
        async function(client){
            let queryMap = ctx.request.body
            return await user_ref_a_music(client, 
                queryMap.listid, queryMap.musicid, true)
        })
})

router.post("/Musics/user_delete_a_ref_music/",async (ctx,next)=>{
    ctx.body =await db.OneResponse(
        'NOT SUCCESS:user_delete_a_ref_music',
        async function(client){
            let queryMap = ctx.request.body
            return await user_delete_a_ref_music(client, 
                queryMap.listid, queryMap.musicid)
        })
})

router.post("/Musics/user_delete_all_ref_music/",async (ctx,next)=>{
    ctx.body =await db.OneResponse(
        'NOT SUCCESS:user_delete_all_ref_music',
        async function(client){
            let queryMap = ctx.request.body
            return await user_delete_all_ref_music(client, 
                queryMap.musicid)
        })
})

router.post("/Musics/user_add_a_music_owner/",async (ctx,next)=>{
    ctx.body =await db.OneResponse(
        'NOT SUCCESS:user_add_a_music_owner',
        async function(client){
            let queryMap = ctx.request.body
            return await user_add_a_music_owner(client, 
                queryMap.userid, queryMap.musicid)
        })
})

router.post("/Musics/user_become_not_a_creator_of_music/",async (ctx,next)=>{
    ctx.body =await db.OneResponse(
        'NOT SUCCESS:user_become_not_a_creator_of_music',
        async function(client){
            let queryMap = ctx.request.body
            return await user_become_not_a_creator_of_music(client, 
                queryMap.userid, queryMap.musicid)
        })
})

router.post("/Musics/get_list_music_by_viewer/",async (ctx,next)=>{
    ctx.body =await db.OneResponse(
        'NOT SUCCESS:get_list_music_by_viewer',
        async function(client){
            let queryMap = ctx.request.body
            return await get_list_music_by_viewer(client, 
                queryMap.listid,queryMap.userid)
        })
})

router.post("/Musics/get_all_music_I_creat/",async (ctx,next)=>{
    ctx.body =await db.OneResponse(
        'NOT SUCCESS:get_all_music_I_creat',
        async function(client){
            let queryMap = ctx.request.body
            return await get_all_music_I_creat(client, 
                queryMap.userid)
        })
})

router.post("/Musics/delete_music/",async (ctx,next)=>{
    ctx.body =await db.OneResponse(
        'NOT SUCCESS:delete_music',
        async function(client){
            let queryMap = ctx.request.body
            return await delete_music(client, 
                queryMap.userid, queryMap.musicid)
        })
})


router.post("/Musics/get_music_all_creator/",async (ctx,next)=>{
    ctx.body =await db.OneResponse(
        'NOT SUCCESS:get_music_all_creator',
        async function(client){
            let queryMap = ctx.request.body
            return await get_music_all_creator(client, 
                queryMap.musicid)
        })
})

router.post("/Musics/get_music_ref/",async (ctx,next)=>{
    ctx.body =await db.OneResponse(
        'NOT SUCCESS:get_music_ref',
        async function(client){
            let queryMap = ctx.request.body
            return await get_music_ref(client, 
                queryMap.musicid)
        })
})

router.post("/Musics/get_all_public_musics/",async (ctx,next)=>{
    ctx.body =await db.OneResponse(
        'NOT SUCCESS:get_all_public_musics',
        async function(client){
            let queryMap = ctx.request.body
            return await get_all_public_musics(client, 
                queryMap.userid, queryMap.islimit)
        })
})

//(1)修改ispublic需要多作什麼處理？

const openPack = {
    getRouter:function (){
        return router
    },

    delete_music:async function(client, userid, musicid, useTransaction = true){
        return await delete_music(client, userid, musicid, useTransaction)
    },

    user_delete_a_ref_music:async function(client, listid, musicid, useTransaction = true){
        return await user_delete_a_ref_music(client, listid, musicid, useTransaction)
    },
}
module.exports = openPack

//(1)新增Music
//(2)建立usermusic關聯
//(3)建立listmusic關聯
//return: id, musicname, description, isref
async function create_music(client, userid, listid, musicname, description, ispublic, useTransaction = true) {
    try {
        if(useTransaction)await client.query('BEGIN')

        const { rows } = await client.query("INSERT INTO musics (musicname, description, ispublic) VALUES ($1, $2, $3) RETURNING id, musicname, description",
        [musicname, description, ispublic])

        const musicid = rows[0].id
        await client.query("INSERT INTO usermusic (userid, musicid) VALUES ($1,$2)",
         [userid, musicid])

        await client.query("INSERT INTO listmusic (listid, musicid, isref) VALUES ($1,$2,$3)",
         [listid, musicid, false])
        
        if(useTransaction)await client.query('COMMIT')

        rows[0].isref = false
        return rows[0]
    } catch (e) {
        if(useTransaction)await client.query('ROLLBACK')
        throw e
    }
}

async function user_ref_a_music(client, listid, musicid, isref, useTransaction = true){
    let {rowCount} = await client.query("select 1 from listmusic where listid = $1 and musicid = $2",
         [listid, musicid])

    if(rowCount==1)//已經存在了
        return null  

    try {
        if(useTransaction)await client.query('BEGIN')

        let res = await client.query("INSERT INTO listmusic (listid, musicid, isref) VALUES ($1, $2, $3)",
         [listid, musicid, isref])

        res = await client.query("update musics SET refcount = refcount+1 WHERE id = $1 returning *",
         [musicid])
        
        if(useTransaction)await client.query('COMMIT')

        return  (res.rowCount===1)?res.rows[0]:null
    } catch (e) {
        if(useTransaction)await client.query('ROLLBACK')
        throw e
    }
}

async function user_delete_a_ref_music(client, listid, musicid, useTransaction = true){
    let {rowCount} = await client.query("select 1 from listmusic where listid = $1 and musicid = $2",
    [listid, musicid])

   if(rowCount==0)//不存在
       return null

    try {
        if(useTransaction)await client.query('BEGIN')

        res = await client.query("DELETE FROM listmusic WHERE listid = $1 AND musicid = $2",
         [listid, musicid])

        res = await client.query("update musics SET refcount = refcount-1 WHERE id = $1 returning *",
         [musicid])
        
        if(useTransaction)await client.query('COMMIT')

        return  (res.rowCount===1)?res.rows[0]:null
    } catch (e) {
        if(useTransaction)await client.query('ROLLBACK')
        throw e
    }
}

//刪除所有對這個music的關注
async function user_delete_all_ref_music(client, musicid, useTransaction = true){
    let {rows} = await client.query("select count(*) as refcount from listmusic where musicid = $1 and isref= true",
    [musicid])

    let refcount = parseInt(rows[0].refcount)//!!! 收到的是string
    if(refcount===0)//不存在
        return null

    try {
        if(useTransaction)await client.query('BEGIN')
  
        res = await client.query("DELETE FROM listmusic WHERE musicid = $1 and isref = true",
         [musicid])

        res = await client.query("update musics SET refcount = refcount-$2 WHERE id = $1 returning *",
         [musicid,refcount])
        
        if(useTransaction)await client.query('COMMIT')

        return  (res.rowCount===1)?res.rows[0]:null
    } catch (e) {
        if(useTransaction)await client.query('ROLLBACK')
        throw e
    }
}

async function user_add_a_music_owner(client, userid, musicid, useTransaction = true){
    let res = await client.query("select 1 from usermusic where userid = $1 and musicid = $2",
        [userid, musicid])
   
    if(res.rowCount==1)//已經存在了
        return null

    try{
        if(useTransaction)await client.query('BEGIN') 
   
        res = await client.query("INSERT INTO usermusic (userid, musicid) VALUES ($1, $2)",
        [userid, musicid])

        res = await client.query("update musics SET ownercount = ownercount+1 WHERE id = $1 returning *",
        [musicid])

        if(useTransaction)await client.query('COMMIT')

        return  (res.rowCount===1)?res.rows[0]:null
    }catch (e) {
        if(useTransaction)await client.query('ROLLBACK')
        throw e
    }
}

async function user_become_not_a_creator_of_music(client, userid, musicid, useTransaction = true){
    let res = await client.query("select 1 from usermusic where userid = $1 and musicid = $2",
        [userid, musicid])
   
    if(res.rowCount==0)//不存在
        return null

    try{
        if(useTransaction)await client.query('BEGIN')

        res = await client.query("DELETE FROM usermusic WHERE userid = $1 AND musicid = $2",
        [userid, musicid])

        res = await client.query("update musics SET ownercount = ownercount-1 WHERE id = $1 returning *",
        [musicid])

        if(useTransaction)await client.query('COMMIT')

        return  (res.rowCount===1)?res.rows[0]:null
    }catch (e) {
        if(useTransaction)await client.query('ROLLBACK')
        throw e
    }
}

async function get_list_music_by_viewer(client, listid,userid) {
    let res = await client.query("select distinct on (musics.id) musics.id, musicname,description,voterscount,averagestar,createtime,ownercount,refcount, "+
    "exists(select t.id from usermusic t where t.musicid = musics.id and t.userid = $2) as ismymusic, "+
    "exists (select * from listmusic as t,userlist as s where t.isref=true and musicid=musics.id and t.listid=s.listid and s.userid=$2) as ismyref, "+
    "( select string_agg(t.userid,',') from usermusic as t where t.musicid = musics.id ) as authors "+
    "from listmusic,musics, usermusic "+
    "where listmusic.musicid = musics.id and usermusic.musicid = musics.id and listmusic.listid = $1 and (ispublic = true or (ispublic = false and usermusic.userid = $2)) order by musics.id desc",
     [listid, userid])
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
    let res = await client.query("select musics.id, musicname, description, voterscount, averagestar, createtime,ownercount FROM usermusic,musics where usermusic.musicid = musics.id and usermusic.userid = $1",
     [userid])
    return  (res.rowCount>0)?res.rows:[]
}

//(1)刪除listmusic關聯(實體和ref)
//(2)刪除usermusic關聯(作者)
//(3)刪除music
async function delete_music(client, userid, musicid, useTransaction = true) {
    let res = await client.query("select ownercount from musics where id = $1",
        [musicid])

    if(res.rowCount!==1){//檢查musicid是否存在
        console.log('delete musicid = %d, not exist',musicid)
        return null 
    }

    if(res.rows[0].ownercount!==1){//如果有多個作者無法刪除
        console.log('delete musicid = %d, but ownercount!=1',musicid)
        return null 
    }
    
    try {
        if(useTransaction)await client.query('BEGIN')

        //(1)刪除listmusic關聯(實體和ref)
        await client.query("delete from listmusic where musicid = $1",
        [musicid])

        //(2)刪除usermusic關聯(作者)
        await client.query("delete from usermusic where userid = $1 and musicid = $2",
         [userid, musicid])

        //(3)刪除music
        res = await client.query("delete from musics where id = $1 returning *",
         [musicid])
        
        if(useTransaction)await client.query('COMMIT')

        return res.rows[0]
    } catch (e) {
        if(useTransaction)await client.query('ROLLBACK')
        throw e
    }
}

async function get_music_ref(client, musicid) {
    let res = await client.query("select listid from listmusic where musicid = $1 and isref = true",
     [musicid])
    return  (res.rowCount>0)?res.rows:[]
}

async function get_all_public_musics(client, userid, islimit){
    let res = await client.query(
        "SELECT * FROM (  "+
        "select distinct on(musics.id) musics.id,musicname,description,createtime,ownercount,refcount,averagestar,voterscount, userid = $1 as ismysong, "+
        "( select string_agg(t.userid,',') from usermusic as t where t.musicid = musics.id ) as authors "+
        "from musics,usermusic "+
        "where musics.id = usermusic.musicid and ispublic = true "+
        "and (userid = $1 or (userid!=$1 and not exists (select * from usermusic t where t.musicid = musics.id and t.userid = $1))) "+
        ") as newT "+
        "order by newT.refcount desc , newT.createtime desc "+
        (islimit?"limit 5":""),
     [userid])
    return  (res.rowCount>0)?res.rows:[]
}