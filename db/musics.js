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

const pack ={
    getRouter:function (){
        return router
    },

    create_music:async function(client,queryMap){
        return await create_music(client,
             queryMap.userid, queryMap.listid, queryMap.musicname, queryMap.description, queryMap.ispublic)
    },

    user_ref_a_music:async function(client,queryMap){
        return await add_relation_listmusic(client, 
        queryMap.listid, queryMap.musicid, true)
    },

    user_delete_a_ref_music:async function(client,queryMap){
        return await remove_relation_listmusic(client, 
            queryMap.listid, queryMap.musicid)
    },

    user_add_a_music_owner:async function(client,queryMap){
        return await add_relation_usermusic(client, 
            queryMap.userid, queryMap.musicid)
    },

    user_become_not_a_creator_of_music:async function(client,queryMap){
        return await remove_relation_usermusic(client, 
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
 
    //(1)刪除listmusic關聯
    //(2)刪除usermusic關聯
    //(3)刪除music
    delete_music:async function(client,queryMap){

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

async function add_relation_listmusic(client, listid, musicid, isref){
    let {rowCount} = await client.query("select 1 from listmusic where listid = $1 and musicid = $2",
     [listid, musicid])

     if(rowCount==1)//已經存在了
        return null

    let res = await client.query("INSERT INTO listmusic (listid, musicid, isref) VALUES ($1, $2, $3) RETURNING *",
     [listid, musicid, isref])
    return  (res.rowCount===1)?res.rows[0]:null
}

async function remove_relation_listmusic(client, listid, musicid){
    let res = await client.query("DELETE FROM listmusic WHERE listid = $1 AND musicid = $2 RETURNING *",
     [listid, musicid])
    return  (res.rowCount===1)?res.rows[0]:null
}

async function add_relation_usermusic(client, userid, musicid){
    let {rowCount} = await client.query("select 1 from usermusic where userid = $1 and musicid = $2",
     [userid, musicid])

     if(rowCount==1)//已經存在了
        return null

    let res = await client.query("INSERT INTO usermusic (userid, musicid) VALUES ($1, $2) RETURNING *",
     [userid, musicid])
    return  (res.rowCount===1)?res.rows[0]:null
}

async function remove_relation_usermusic(client, userid, musicid){
    let res = await client.query("DELETE FROM usermusic WHERE userid = $1 AND musicid = $2 RETURNING *",
     [userid, musicid])
    return  (res.rowCount===1)?res.rows[0]:null
}

async function get_all_music_under_this_list(client, listid) {
    let res = await client.query("select musics.id, musicname, description, isref, voterscount, averagestart FROM listmusic,musics where listmusic.musicid = musics.id and listmusic.listid = $1",
     [listid])
    return  (res.rowCount>0)?res.rows:[]
}

async function get_all_music_I_creat(client, userid) {
    let res = await client.query("select musics.id, musicname, description, voterscount, averagestart, createtime FROM usermusic,musics where usermusic.musicid = musics.id and usermusic.userid = $1",
     [userid])
    return  (res.rowCount>0)?res.rows:[]
}
