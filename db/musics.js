const Router = require('koa-router');
const db = require('./db');

const router = new Router();



const musics ={
    Get_Not_Success :'Get_Not_Success',
    Post_Not_Success :'Post_Not_Success',
    Put_Not_Success :'Put_Not_Success',
    Delete_Not_Success :'Delete_Not_Success',

    getRouter:function (){
        return router
    },
 
    //(1)修改ispublic需要多作什麼處理？

}

module.exports = musics