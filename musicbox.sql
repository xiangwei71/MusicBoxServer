--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.6
-- Dumped by pg_dump version 9.6.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: listmusic; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE listmusic (
    id integer NOT NULL,
    listid integer,
    musicid integer,
    isref boolean DEFAULT false NOT NULL
);


ALTER TABLE listmusic OWNER TO postgres;

--
-- Name: listmusic_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE listmusic_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE listmusic_id_seq OWNER TO postgres;

--
-- Name: listmusic_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE listmusic_id_seq OWNED BY listmusic.id;


--
-- Name: listowner; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE listowner (
    id integer NOT NULL,
    userid character varying(100),
    listid integer
);


ALTER TABLE listowner OWNER TO postgres;

--
-- Name: listowner_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE listowner_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE listowner_id_seq OWNER TO postgres;

--
-- Name: listowner_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE listowner_id_seq OWNED BY listowner.id;


--
-- Name: lists; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE lists (
    id integer NOT NULL,
    listname character varying(50) NOT NULL,
    description character varying(100) NOT NULL,
    ispublic boolean DEFAULT true NOT NULL,
    refcount integer DEFAULT 0 NOT NULL,
    createtime timestamp without time zone DEFAULT now(),
    ownercount integer DEFAULT 1 NOT NULL
);


ALTER TABLE lists OWNER TO postgres;

--
-- Name: lists_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE lists_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE lists_id_seq OWNER TO postgres;

--
-- Name: lists_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE lists_id_seq OWNED BY lists.id;


--
-- Name: musics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE musics (
    id integer NOT NULL,
    musicname character varying(50) NOT NULL,
    description character varying(100) NOT NULL,
    ispublic boolean DEFAULT true NOT NULL,
    createtime timestamp without time zone DEFAULT now(),
    ownercount integer DEFAULT 1 NOT NULL,
    refcount integer DEFAULT 0 NOT NULL,
    averagestar integer DEFAULT 0 NOT NULL,
    totalstar integer DEFAULT 0 NOT NULL,
    voterscount integer DEFAULT 0 NOT NULL
);


ALTER TABLE musics OWNER TO postgres;

--
-- Name: musics_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE musics_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE musics_id_seq OWNER TO postgres;

--
-- Name: musics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE musics_id_seq OWNED BY musics.id;


--
-- Name: replys; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE replys (
    id integer NOT NULL,
    musicid integer,
    replycontent character varying(200) NOT NULL,
    whoreply character varying(100) NOT NULL
);


ALTER TABLE replys OWNER TO postgres;

--
-- Name: replys_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE replys_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE replys_id_seq OWNER TO postgres;

--
-- Name: replys_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE replys_id_seq OWNED BY replys.id;


--
-- Name: subreplys; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE subreplys (
    id integer NOT NULL,
    replyid integer,
    replycontent character varying(100) NOT NULL,
    whoreply character varying(100) NOT NULL,
    replyto character varying(100) NOT NULL
);


ALTER TABLE subreplys OWNER TO postgres;

--
-- Name: subreplys_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE subreplys_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE subreplys_id_seq OWNER TO postgres;

--
-- Name: subreplys_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE subreplys_id_seq OWNED BY subreplys.id;


--
-- Name: userlist; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE userlist (
    id integer NOT NULL,
    userid character varying(100),
    listid integer,
    isref boolean DEFAULT false NOT NULL
);


ALTER TABLE userlist OWNER TO postgres;

--
-- Name: userlist_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE userlist_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE userlist_id_seq OWNER TO postgres;

--
-- Name: userlist_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE userlist_id_seq OWNED BY userlist.id;


--
-- Name: usermusic; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE usermusic (
    id integer NOT NULL,
    userid character varying(100),
    musicid integer
);


ALTER TABLE usermusic OWNER TO postgres;

--
-- Name: usermusic_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE usermusic_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE usermusic_id_seq OWNER TO postgres;

--
-- Name: usermusic_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE usermusic_id_seq OWNED BY usermusic.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE users (
    userid character varying(100) NOT NULL,
    pwd character varying(100) NOT NULL
);


ALTER TABLE users OWNER TO postgres;

--
-- Name: listmusic id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY listmusic ALTER COLUMN id SET DEFAULT nextval('listmusic_id_seq'::regclass);


--
-- Name: listowner id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY listowner ALTER COLUMN id SET DEFAULT nextval('listowner_id_seq'::regclass);


--
-- Name: lists id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY lists ALTER COLUMN id SET DEFAULT nextval('lists_id_seq'::regclass);


--
-- Name: musics id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY musics ALTER COLUMN id SET DEFAULT nextval('musics_id_seq'::regclass);


--
-- Name: replys id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY replys ALTER COLUMN id SET DEFAULT nextval('replys_id_seq'::regclass);


--
-- Name: subreplys id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY subreplys ALTER COLUMN id SET DEFAULT nextval('subreplys_id_seq'::regclass);


--
-- Name: userlist id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY userlist ALTER COLUMN id SET DEFAULT nextval('userlist_id_seq'::regclass);


--
-- Name: usermusic id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY usermusic ALTER COLUMN id SET DEFAULT nextval('usermusic_id_seq'::regclass);


--
-- Data for Name: listmusic; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY listmusic (id, listid, musicid, isref) FROM stdin;
1	2	2	f
2	2	3	f
3	2	4	f
4	2	5	f
5	2	6	f
9	7	8	f
72	7	2	t
73	2	8	t
74	2	18	f
75	2	19	f
76	8	19	t
77	2	20	f
78	8	20	t
79	2	21	f
80	2	22	f
81	8	22	t
82	2	23	f
83	4	23	t
84	2	24	f
87	4	24	t
89	2	26	f
90	2	27	f
91	2	28	f
38	9	2	t
92	2	29	f
93	2	30	f
94	2	31	f
95	2	32	f
96	2	33	f
97	2	34	f
98	2	35	f
99	2	36	f
100	27	37	f
101	27	38	f
102	27	39	f
103	27	40	f
104	27	41	f
105	27	42	f
106	2	42	t
107	7	42	t
108	24	43	f
109	24	44	f
110	5	45	f
111	5	46	f
112	5	47	f
113	24	47	t
114	5	48	f
115	5	49	f
116	5	44	t
117	5	43	t
118	3	45	t
119	3	43	t
\.


--
-- Name: listmusic_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('listmusic_id_seq', 119, true);


--
-- Data for Name: listowner; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY listowner (id, userid, listid) FROM stdin;
\.


--
-- Name: listowner_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('listowner_id_seq', 1, false);


--
-- Data for Name: lists; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY lists (id, listname, description, ispublic, refcount, createtime, ownercount) FROM stdin;
5	悲歌	...	t	0	2017-12-27 17:51:36.315911	1
3	日本動漫	...	t	2	2017-12-27 16:38:31.246922	1
4	High歌	我是Hight歌大頭目	t	2	2017-12-27 17:02:54.964731	1
9	五月天	...	t	1	2017-12-28 14:49:26.1803	1
8	少女時代	...	t	0	2017-12-28 14:29:31.508604	2
7	那年我18	...	t	1	2017-12-27 20:04:20.117926	1
13	非主流	...	f	0	2017-12-30 15:31:46.119063	1
14	水晶音樂	...	t	1	2017-12-30 21:19:36.985808	2
16	迷幻	...	t	0	2017-12-31 23:06:52.363535	1
17	古典樂	...	t	0	2017-12-31 23:07:12.007658	1
18	古典樂	...	t	0	2017-12-31 23:07:33.911911	1
19	test	...	t	0	2017-12-31 23:08:36.117469	1
20	test	...	t	0	2017-12-31 23:10:06.930663	1
2	哥哥妹妹有意思	...	t	1	2017-12-27 16:37:34.188187	3
21	test2	...	t	0	2017-12-31 23:31:17.954362	1
22	龐克	...	t	0	2018-01-01 17:07:00.017062	1
23	Queen	...	t	0	2018-01-01 17:07:13.814851	1
24	披頭四	...	t	0	2018-01-01 17:07:21.402285	1
25	貓王	...	t	0	2018-01-01 17:07:29.473747	1
26	宗教類	...	t	0	2018-01-01 17:07:38.809281	1
27	嘻哈	...	t	1	2018-01-01 17:07:51.976034	1
\.


--
-- Name: lists_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('lists_id_seq', 27, true);


--
-- Data for Name: musics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY musics (id, musicname, description, ispublic, createtime, ownercount, refcount, averagestar, totalstar, voterscount) FROM stdin;
3	星星點燈	男歌手	t	2017-12-27 20:21:18.117109	1	0	0	0	0
4	夏流	團體	t	2017-12-27 22:28:00.783548	1	0	0	0	0
5	天黑	男歌手	t	2017-12-27 22:28:37.774185	1	0	0	0	0
6	推開世界的門	女歌手	t	2017-12-27 22:28:52.517205	1	0	0	0	0
2	我才沒有愛你我們之間怎麼可能	女歌手	t	2017-12-27 20:19:27.237122	2	2	0	0	0
8	紅豆	方大同	t	2017-12-27 22:32:26.819335	1	1	0	0	0
18	喵電感應	...	f	2017-12-30 13:30:43.831684	1	0	0	0	0
20	江南	...	t	2017-12-30 14:49:01.621382	1	1	0	0	0
19	波妞	...	t	2017-12-30 14:47:40.715754	1	1	0	0	0
21	let it be	...	t	2017-12-30 14:51:53.426209	2	0	0	0	0
22	好久不見	...	f	2017-12-30 14:56:35.368335	2	1	0	0	0
23	想太多	...	f	2017-12-30 15:07:14.375884	2	1	0	0	0
24	山丘	...	f	2017-12-30 21:16:38.433595	2	1	0	0	0
26	愛我別走	...	f	2017-12-31 23:32:30.152491	1	0	0	0	0
27	六色彩虹	...	f	2018-01-01 18:32:56.847719	1	0	0	0	0
28	你就不要想起我	...	f	2018-01-01 18:33:17.679911	1	0	0	0	0
29	你就是我的唯一	...	f	2018-01-01 18:33:33.822834	1	0	0	0	0
30	英勇的戰士搖搖頭	...	f	2018-01-01 18:33:55.638082	1	0	0	0	0
31	愛你一萬年	...	f	2018-01-01 18:34:06.855723	1	0	0	0	0
32	一直站在這裡	...	f	2018-01-01 18:34:27.397898	1	0	0	0	0
33	追追追	...	t	2018-01-01 18:35:03.115941	1	0	0	0	0
34	Gee	...	t	2018-01-01 18:35:07.029165	1	0	0	0	0
35	我的滑板鞋	...	t	2018-01-01 18:35:24.827183	1	0	0	0	0
36	一起去跑步	...	t	2018-01-01 18:35:32.680632	1	0	0	0	0
37	高山青	...	t	2018-01-01 20:05:37.004564	1	0	0	0	0
38	猴喜翻	...	t	2018-01-01 20:06:37.95705	1	0	0	0	0
39	忘情水	...	t	2018-01-01 20:22:17.358781	2	0	0	0	0
40	快樂頌	...	f	2018-01-01 20:27:37.780108	1	0	0	0	0
41	天空之城	...	f	2018-01-01 20:28:33.24528	2	0	0	0	0
42	我愛台妹	...	t	2018-01-01 20:50:42.122288	1	2	0	0	0
48	oh	...	t	2018-01-02 10:38:42.11301	1	0	0	0	0
49	吳克群	...	t	2018-01-02 10:38:53.726674	1	0	0	0	0
46	一代宗師	...	t	2018-01-02 10:35:39.724578	1	0	0	0	0
44	Mr. PostMan	...	t	2018-01-02 10:34:02.492016	1	1	0	0	0
47	還是會	...	t	2018-01-02 10:35:58.99768	2	1	0	0	0
45	笑傲江湖	...	t	2018-01-02 10:35:28.595941	1	1	0	0	0
43	黃色潛水艇	...	t	2018-01-02 10:33:29.212113	1	2	0	0	0
\.


--
-- Name: musics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('musics_id_seq', 49, true);


--
-- Data for Name: replys; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY replys (id, musicid, replycontent, whoreply) FROM stdin;
\.


--
-- Name: replys_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('replys_id_seq', 1, false);


--
-- Data for Name: subreplys; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY subreplys (id, replyid, replycontent, whoreply, replyto) FROM stdin;
\.


--
-- Name: subreplys_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('subreplys_id_seq', 1, false);


--
-- Data for Name: userlist; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY userlist (id, userid, listid, isref) FROM stdin;
1	Marc	2	f
2	Marc	3	f
3	Mary	4	f
70	Marc	7	t
71	Banana	13	f
72	Banana	14	f
75	Mary	14	t
14	Allie	5	f
77	Marc	14	f
16	Marc	4	t
79	Banana	16	f
18	Mary	3	t
80	Banana	17	f
81	Banana	18	f
82	Banana	19	f
83	Banana	20	f
84	Banana	21	f
23	Allie	7	f
24	Allie	4	t
85	Banana	22	f
86	Banana	23	f
27	Banana	8	f
28	Banana	3	t
29	Mary	9	f
30	Banana	9	t
87	Banana	24	f
88	Banana	25	f
89	Banana	26	f
90	Banana	27	f
40	Banana	2	t
44	Allie	2	f
47	Mary	2	f
49	Mary	8	f
91	Marc	27	t
\.


--
-- Name: userlist_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('userlist_id_seq', 91, true);


--
-- Data for Name: usermusic; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY usermusic (id, userid, musicid) FROM stdin;
2	Marc	2
3	Marc	3
4	Marc	4
5	Marc	5
6	Marc	6
8	Allie	8
29	Mary	2
40	Marc	18
41	Marc	19
42	Marc	20
43	Marc	21
44	Banana	21
45	Marc	22
46	Banana	22
47	Marc	23
48	Banana	23
49	Marc	24
51	Banana	24
53	Marc	26
54	Marc	27
55	Marc	28
56	Marc	29
57	Marc	30
58	Marc	31
59	Marc	32
60	Marc	33
61	Marc	34
62	Marc	35
63	Marc	36
64	Banana	37
65	Banana	38
66	Banana	39
67	Marc	39
68	Banana	40
69	Banana	41
70	Marc	41
71	Banana	42
72	Banana	43
73	Banana	44
74	Allie	45
75	Allie	46
76	Allie	47
77	Allie	48
78	Allie	49
79	Banana	47
\.


--
-- Name: usermusic_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('usermusic_id_seq', 79, true);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY users (userid, pwd) FROM stdin;
Banana	1111
Marc	2222
Allie	1111
Kevin	1111
Mary	1111
Candy	2222
\.


--
-- Name: listmusic listmusic_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY listmusic
    ADD CONSTRAINT listmusic_pkey PRIMARY KEY (id);


--
-- Name: listowner listowner_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY listowner
    ADD CONSTRAINT listowner_pkey PRIMARY KEY (id);


--
-- Name: lists lists_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY lists
    ADD CONSTRAINT lists_pkey PRIMARY KEY (id);


--
-- Name: musics musics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY musics
    ADD CONSTRAINT musics_pkey PRIMARY KEY (id);


--
-- Name: replys replys_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY replys
    ADD CONSTRAINT replys_pkey PRIMARY KEY (id);


--
-- Name: subreplys subreplys_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY subreplys
    ADD CONSTRAINT subreplys_pkey PRIMARY KEY (id);


--
-- Name: userlist userlist_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY userlist
    ADD CONSTRAINT userlist_pkey PRIMARY KEY (id);


--
-- Name: usermusic usermusic_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY usermusic
    ADD CONSTRAINT usermusic_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (userid);


--
-- Name: listmusic listmusic_listid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY listmusic
    ADD CONSTRAINT listmusic_listid_fkey FOREIGN KEY (listid) REFERENCES lists(id);


--
-- Name: listmusic listmusic_musicid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY listmusic
    ADD CONSTRAINT listmusic_musicid_fkey FOREIGN KEY (musicid) REFERENCES musics(id);


--
-- Name: listowner listowner_listid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY listowner
    ADD CONSTRAINT listowner_listid_fkey FOREIGN KEY (listid) REFERENCES lists(id);


--
-- Name: listowner listowner_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY listowner
    ADD CONSTRAINT listowner_userid_fkey FOREIGN KEY (userid) REFERENCES users(userid);


--
-- Name: replys replys_musicid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY replys
    ADD CONSTRAINT replys_musicid_fkey FOREIGN KEY (musicid) REFERENCES musics(id);


--
-- Name: subreplys subreplys_replyid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY subreplys
    ADD CONSTRAINT subreplys_replyid_fkey FOREIGN KEY (replyid) REFERENCES replys(id);


--
-- Name: userlist userlist_listid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY userlist
    ADD CONSTRAINT userlist_listid_fkey FOREIGN KEY (listid) REFERENCES lists(id);


--
-- Name: userlist userlist_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY userlist
    ADD CONSTRAINT userlist_userid_fkey FOREIGN KEY (userid) REFERENCES users(userid);


--
-- Name: usermusic usermusic_musicid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY usermusic
    ADD CONSTRAINT usermusic_musicid_fkey FOREIGN KEY (musicid) REFERENCES musics(id);


--
-- Name: usermusic usermusic_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY usermusic
    ADD CONSTRAINT usermusic_userid_fkey FOREIGN KEY (userid) REFERENCES users(userid);


--
-- PostgreSQL database dump complete
--

