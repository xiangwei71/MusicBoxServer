CREATE TABLE lists (
   id serial primary key,
   listname character varying(50) NOT NULL,
   description character varying(100) NOT NULL,
   ispublic boolean NOT NULL
);

--設成ispublic，就可以被ref(加入)
CREATE TABLE musics (
   id serial primary key,
   musicname character varying(50) NOT NULL,
   description character varying(100) NOT NULL,
   ispublic boolean NOT NULL,
   movable boolean NOT NULL
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

CREATE TABLE userlist (
   id serial primary key,
   userid character varying(100) references users(userid),
   listid integer references lists(id),
   isref boolean DEFAULT false NOT NULL
);

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

CREATE TABLE listowner (
   id serial primary key,
   userid character varying(100) references users(userid),
   listid integer references lists(id)
);



