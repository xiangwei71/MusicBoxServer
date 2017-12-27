CREATE TABLE lists (
   id serial primary key,
   listname character varying(50) NOT NULL,
   description character varying(100) NOT NULL,
   ispublic boolean DEFAULT true NOT NULL,

   refcount integer DEFAULT 0 NOT NULL,
   createtime timestamp DEFAULT current_timestamp
);

--設成ispublic，就可以被ref(加入)
CREATE TABLE musics (
   id serial primary key,
   musicname character varying(50) NOT NULL,
   description character varying(100) NOT NULL,

   ispublic boolean DEFAULT true NOT NULL,
   voterscount integer DEFAULT 0  NOT NULL,
   averagestart integer DEFAULT 0 NOT NULL,
   createtime timestamp DEFAULT current_timestamp
);

CREATE TABLE users (
   userid character varying(100) primary key,
   pwd character varying(100) NOT NULL
);

CREATE TABLE replys (
   id serial primary key,
   musicid integer references musics(id),
   replycontent character varying(200) NOT NULL,
   whoreply character varying(100) NOT NULL
);

CREATE TABLE subreplys (
   id serial primary key,
   replyid integer references replys(id),
   replycontent character varying(100) NOT NULL,
   whoreply character varying(100) NOT NULL,
   replyto character varying(100) NOT NULL
);

--多對多關聯

-- isref = false 即是擁有者
-- 全部清單: userid != 自己 and ispublic = true and isref = false 
--然後前端要過濾掉和自己共用的list(先傳一分自己所有list到Client)
CREATE TABLE userlist (
   id serial primary key,
   userid character varying(100) references users(userid),
   listid integer references lists(id),
   isref boolean DEFAULT false NOT NULL
);

--全部音樂: userid!= 自己 and ispublic = true
--然後前端要過濾掉和自己共同創作的music(先傳一分自己的所有Music到Client)
CREATE TABLE usermusic (
   id serial primary key,
   userid character varying(100) references users(userid),
   musicid integer references musics(id)
);

CREATE TABLE listmusic (
   id serial primary key,
   listid integer references lists(id),
   musicid integer references musics(id),
   isref boolean DEFAULT false NOT NULL
);

--看來不需要這張了
--CREATE TABLE listowner (
--   id serial primary key,
--   userid character varying(100) references users(userid),
--   listid integer references lists(id)
--);



