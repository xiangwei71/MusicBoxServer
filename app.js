const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const users = require('./db/users');

const app = new Koa();
const router = new Router();

//這樣才能抓到ctx.request.body
app.use(bodyParser());

router.get("/",async (ctx,next)=>{
    ctx.body="Home";
})

app.use(router.routes())
app.use(users.getRouter().routes())

app.listen(3001,()=>{
    console.log("server starting on "+3001);
})

