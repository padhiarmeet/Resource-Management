--
-- PostgreSQL database dump
--

\restrict 9WJIQqRUGWVSkBWqW8ccmJi8pYDahJwUuhDwTgMj0coEN6bm25FKyzDJJKFfgq9

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgagent; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA pgagent;


ALTER SCHEMA pgagent OWNER TO postgres;

--
-- Name: SCHEMA pgagent; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA pgagent IS 'pgAgent system tables';


--
-- Name: pgagent; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgagent WITH SCHEMA pgagent;


--
-- Name: EXTENSION pgagent; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgagent IS 'A PostgreSQL job scheduler';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bookings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bookings (
    booking_id integer NOT NULL,
    resource_id integer NOT NULL,
    user_id integer NOT NULL,
    start_datetime timestamp without time zone NOT NULL,
    end_datetime timestamp without time zone NOT NULL,
    status character varying(20) DEFAULT 'PENDING'::character varying,
    approver_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    shelf_id integer
);


ALTER TABLE public.bookings OWNER TO postgres;

--
-- Name: bookings_booking_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bookings_booking_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bookings_booking_id_seq OWNER TO postgres;

--
-- Name: bookings_booking_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bookings_booking_id_seq OWNED BY public.bookings.booking_id;


--
-- Name: buildings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.buildings (
    building_id integer NOT NULL,
    building_name character varying(255) NOT NULL,
    building_number character varying(255),
    total_floors integer
);


ALTER TABLE public.buildings OWNER TO postgres;

--
-- Name: buildings_building_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.buildings_building_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.buildings_building_id_seq OWNER TO postgres;

--
-- Name: buildings_building_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.buildings_building_id_seq OWNED BY public.buildings.building_id;


--
-- Name: cupboards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cupboards (
    cupboard_id integer NOT NULL,
    resource_id integer NOT NULL,
    cupboard_name character varying(100),
    total_shelves integer
);


ALTER TABLE public.cupboards OWNER TO postgres;

--
-- Name: cupboards_cupboard_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cupboards_cupboard_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cupboards_cupboard_id_seq OWNER TO postgres;

--
-- Name: cupboards_cupboard_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cupboards_cupboard_id_seq OWNED BY public.cupboards.cupboard_id;


--
-- Name: facilities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.facilities (
    facility_id integer NOT NULL,
    resource_id integer NOT NULL,
    facility_name character varying(255),
    details character varying(255)
);


ALTER TABLE public.facilities OWNER TO postgres;

--
-- Name: facilities_facility_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.facilities_facility_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.facilities_facility_id_seq OWNER TO postgres;

--
-- Name: facilities_facility_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.facilities_facility_id_seq OWNED BY public.facilities.facility_id;


--
-- Name: maintenance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.maintenance (
    maintenance_id integer NOT NULL,
    resource_id integer NOT NULL,
    maintenance_type character varying(100),
    scheduled_date date,
    status character varying(20) DEFAULT 'SCHEDULED'::character varying,
    notes text
);


ALTER TABLE public.maintenance OWNER TO postgres;

--
-- Name: maintenance_maintenance_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.maintenance_maintenance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.maintenance_maintenance_id_seq OWNER TO postgres;

--
-- Name: maintenance_maintenance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.maintenance_maintenance_id_seq OWNED BY public.maintenance.maintenance_id;


--
-- Name: meet; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.meet (
    id integer,
    name character varying(50)
);


ALTER TABLE public.meet OWNER TO postgres;

--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refresh_tokens (
    id uuid NOT NULL,
    created_at timestamp(6) with time zone NOT NULL,
    expires_at timestamp(6) with time zone NOT NULL,
    jti character varying(255) NOT NULL,
    replaced_by character varying(255),
    revoked boolean NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.refresh_tokens OWNER TO postgres;

--
-- Name: resource_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.resource_types (
    resource_type_id integer NOT NULL,
    type_name character varying(255) NOT NULL
);


ALTER TABLE public.resource_types OWNER TO postgres;

--
-- Name: resource_types_resource_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.resource_types_resource_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.resource_types_resource_type_id_seq OWNER TO postgres;

--
-- Name: resource_types_resource_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.resource_types_resource_type_id_seq OWNED BY public.resource_types.resource_type_id;


--
-- Name: resources; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.resources (
    resource_id integer NOT NULL,
    resource_name character varying(255) NOT NULL,
    resource_type_id integer NOT NULL,
    building_id integer NOT NULL,
    floor_number integer,
    description character varying(255)
);


ALTER TABLE public.resources OWNER TO postgres;

--
-- Name: resources_resource_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.resources_resource_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.resources_resource_id_seq OWNER TO postgres;

--
-- Name: resources_resource_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.resources_resource_id_seq OWNED BY public.resources.resource_id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    role_id integer NOT NULL,
    role_name character varying(255) NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: roles_role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_role_id_seq OWNER TO postgres;

--
-- Name: roles_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_role_id_seq OWNED BY public.roles.role_id;


--
-- Name: shelves; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shelves (
    shelf_id integer NOT NULL,
    cupboard_id integer NOT NULL,
    shelf_number integer,
    capacity integer,
    description text
);


ALTER TABLE public.shelves OWNER TO postgres;

--
-- Name: shelves_shelf_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.shelves_shelf_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.shelves_shelf_id_seq OWNER TO postgres;

--
-- Name: shelves_shelf_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.shelves_shelf_id_seq OWNED BY public.shelves.shelf_id;


--
-- Name: student; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student (
    rno integer NOT NULL,
    name character varying(50),
    branch character varying(10),
    semester integer,
    cpi integer
);


ALTER TABLE public.student OWNER TO postgres;

--
-- Name: temp_table; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.temp_table (
    booking_id integer,
    resource_id integer,
    name character varying(50)
);


ALTER TABLE public.temp_table OWNER TO postgres;

--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_roles (
    user_id integer NOT NULL,
    role_id integer NOT NULL
);


ALTER TABLE public.user_roles OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    enabled boolean DEFAULT true NOT NULL,
    provider character varying(255),
    CONSTRAINT users_provider_check CHECK (((provider)::text = ANY ((ARRAY['FACEBOOK'::character varying, 'GITHUB'::character varying, 'GOOGLE'::character varying, 'LOCAL'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: bookings booking_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings ALTER COLUMN booking_id SET DEFAULT nextval('public.bookings_booking_id_seq'::regclass);


--
-- Name: buildings building_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.buildings ALTER COLUMN building_id SET DEFAULT nextval('public.buildings_building_id_seq'::regclass);


--
-- Name: cupboards cupboard_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cupboards ALTER COLUMN cupboard_id SET DEFAULT nextval('public.cupboards_cupboard_id_seq'::regclass);


--
-- Name: facilities facility_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facilities ALTER COLUMN facility_id SET DEFAULT nextval('public.facilities_facility_id_seq'::regclass);


--
-- Name: maintenance maintenance_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance ALTER COLUMN maintenance_id SET DEFAULT nextval('public.maintenance_maintenance_id_seq'::regclass);


--
-- Name: resource_types resource_type_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource_types ALTER COLUMN resource_type_id SET DEFAULT nextval('public.resource_types_resource_type_id_seq'::regclass);


--
-- Name: resources resource_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resources ALTER COLUMN resource_id SET DEFAULT nextval('public.resources_resource_id_seq'::regclass);


--
-- Name: roles role_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN role_id SET DEFAULT nextval('public.roles_role_id_seq'::regclass);


--
-- Name: shelves shelf_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shelves ALTER COLUMN shelf_id SET DEFAULT nextval('public.shelves_shelf_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: pga_jobagent; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_jobagent (jagpid, jaglogintime, jagstation) FROM stdin;
8688	2026-03-15 09:20:21.725066+05:30	hottee
\.


--
-- Data for Name: pga_jobclass; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_jobclass (jclid, jclname) FROM stdin;
\.


--
-- Data for Name: pga_job; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_job (jobid, jobjclid, jobname, jobdesc, jobhostagent, jobenabled, jobcreated, jobchanged, jobagentid, jobnextrun, joblastrun) FROM stdin;
\.


--
-- Data for Name: pga_schedule; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_schedule (jscid, jscjobid, jscname, jscdesc, jscenabled, jscstart, jscend, jscminutes, jschours, jscweekdays, jscmonthdays, jscmonths) FROM stdin;
\.


--
-- Data for Name: pga_exception; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_exception (jexid, jexscid, jexdate, jextime) FROM stdin;
\.


--
-- Data for Name: pga_joblog; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_joblog (jlgid, jlgjobid, jlgstatus, jlgstart, jlgduration) FROM stdin;
\.


--
-- Data for Name: pga_jobstep; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_jobstep (jstid, jstjobid, jstname, jstdesc, jstenabled, jstkind, jstcode, jstconnstr, jstdbname, jstonerror, jscnextrun) FROM stdin;
\.


--
-- Data for Name: pga_jobsteplog; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_jobsteplog (jslid, jsljlgid, jsljstid, jslstatus, jslresult, jslstart, jslduration, jsloutput) FROM stdin;
\.


--
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bookings (booking_id, resource_id, user_id, start_datetime, end_datetime, status, approver_id, created_at, shelf_id) FROM stdin;
54	1	10	2026-03-01 10:00:00	2026-03-01 12:00:00	APPROVED	14	2026-02-25 08:47:14.187662	8
55	4	10	2026-03-05 14:00:00	2026-03-05 16:00:00	PENDING	\N	2026-02-25 08:47:14.187662	11
56	3	10	2026-03-10 09:00:00	2026-03-15 17:00:00	APPROVED	14	2026-02-25 08:47:14.187662	14
57	5	10	2026-03-20 08:00:00	2026-03-20 18:00:00	REJECTED	14	2026-02-25 08:47:14.187662	12
58	6	14	2026-02-26 07:45:00	2026-02-26 09:35:00	PENDING	\N	2026-02-25 09:05:47.079317	\N
60	3	15	2026-02-27 12:12:00	2026-02-28 12:12:00	PENDING	\N	2026-02-25 15:48:07.880704	10
59	1	15	2026-02-26 09:50:00	2026-02-26 11:30:00	APPROVED	14	2026-02-25 15:42:15.246919	\N
62	10	24	2026-03-18 07:45:00	2026-03-18 09:35:00	PENDING	\N	2026-03-12 09:32:10.208705	\N
61	1	24	2026-03-13 07:45:00	2026-03-13 09:35:00	APPROVED	25	2026-03-12 09:31:59.68933	\N
63	1	25	2026-03-12 12:10:00	2026-03-12 13:50:00	APPROVED	25	2026-03-12 09:50:15.042616	\N
64	1	25	2026-03-13 09:50:00	2026-03-13 11:30:00	APPROVED	25	2026-03-12 12:43:53.212692	\N
65	18	24	2026-03-16 07:45:00	2026-03-16 09:35:00	PENDING	\N	2026-03-12 13:33:36.813708	\N
98	5	28	2026-03-18 09:50:00	2026-03-18 11:30:00	PENDING	\N	2026-03-14 11:27:13.586405	\N
\.


--
-- Data for Name: buildings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.buildings (building_id, building_name, building_number, total_floors) FROM stdin;
1	A-Block (Top)	A	2
2	C-Block (West)	C-W	2
3	C-Block (East)	C-E	2
4	D-Block (South)	D-S	2
5	D-Block (West)	D-W	2
6	C-Block (South-East)	C-SE	2
\.


--
-- Data for Name: cupboards; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cupboards (cupboard_id, resource_id, cupboard_name, total_shelves) FROM stdin;
3	3	Main Hardware Locker	4
4	12	Networking Equipment Cabinet	3
5	20	IoT Devices Locker	2
\.


--
-- Data for Name: facilities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.facilities (facility_id, resource_id, facility_name, details) FROM stdin;
5	1	Projector	Standard 1080p ceiling mount projector
6	1	Air Conditioning	1.5 Ton Split AC
7	3	High-End PCs	60 Dell OptiPlex machines with 16GB RAM and i7 processors
8	3	Smart Board	Interactive digital whiteboard
9	12	Server Racks	2 Open frame server racks for networking practice
\.


--
-- Data for Name: maintenance; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.maintenance (maintenance_id, resource_id, maintenance_type, scheduled_date, status, notes) FROM stdin;
9	5	Projector Bulb Replacement	2026-02-15	COMPLETED	Replaced the main projector bulb. It is now shining brightly.
10	20	Server Rack Cleaning	2026-03-10	PENDING	Quarterly dust cleaning and cable management for the IoT server rack.
11	12	Switch Replacement	2026-02-26	PENDING	Main networking switch is dead, needs immediate replacement.
8	3	Network Troubleshooting	2026-02-28	PENDING	Computers in the back row are losing internet connectivity.
7	1	AC Repair	2026-03-01	IN_PROGRESS	The 1.5 Ton AC in the classroom is making noise and not cooling properly.
\.


--
-- Data for Name: meet; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.meet (id, name) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refresh_tokens (id, created_at, expires_at, jti, replaced_by, revoked, user_id) FROM stdin;
feb43813-3fa0-4a64-9c90-6d18803fbde2	2026-03-11 00:45:04.532522+05:30	2026-03-12 00:45:04.532522+05:30	ef6bb247-a6ec-4dd2-adc5-9eabe0e3c456	\N	f	21
2367d9f7-9b24-4362-b482-b169b0375471	2026-03-11 22:13:25.953167+05:30	2026-03-12 22:13:25.953167+05:30	47f56712-89da-4f8f-b91d-fbd92d8b2856	\N	f	21
2dae80e6-07b6-4ae9-a667-1baa71a6a892	2026-03-11 22:17:20.147615+05:30	2026-03-12 22:17:20.147615+05:30	840865d5-de0d-490e-af98-3f583bcea6ae	\N	f	21
b348d0ff-1943-4d2b-b073-9da5e4ce0a60	2026-03-11 23:36:52.854892+05:30	2026-03-12 23:36:52.854892+05:30	4f6031cb-e032-4104-b4f0-1d82100bc2e4	\N	f	21
bd4635e7-f6ae-4e34-b318-de752c72485f	2026-03-11 23:40:49.639664+05:30	2026-03-12 23:40:49.639664+05:30	5dcf4755-f4d1-4298-9d68-052a391b8668	bce71b2c-c8c8-4941-8f86-49ea84a7b857	t	21
c167a587-d87d-40cc-ac16-8cc57ae42bc4	2026-03-11 23:44:07.571112+05:30	2026-03-12 23:44:07.571112+05:30	bce71b2c-c8c8-4941-8f86-49ea84a7b857	\N	t	21
f806043e-38ad-4665-a5da-01abc9d778af	2026-03-11 23:58:31.32124+05:30	2026-03-12 23:58:31.32124+05:30	0bf45e63-d8e0-415a-a48e-a6930328ed1a	3b68aa3f-3c22-46c3-af48-d32c1f6daaaf	t	21
72609b07-a63d-4995-a0bd-75bcb50f9dca	2026-03-11 23:58:44.847397+05:30	2026-03-12 23:58:44.847397+05:30	3b68aa3f-3c22-46c3-af48-d32c1f6daaaf	\N	t	21
c77a10b3-5490-454f-a290-3ae5085dcfba	2026-03-12 00:02:47.566116+05:30	2026-03-13 00:02:47.566116+05:30	124471cc-a3ab-4097-bbb1-c6dc5aaef163	\N	t	21
7aa6e3f4-67c1-4c3e-a828-9fc5aa5e3b9b	2026-03-12 00:14:50.452069+05:30	2026-03-13 00:14:50.452069+05:30	88dae50b-3586-41c3-95df-4e1bce41ed23	\N	t	21
9d614687-3329-4849-a0ce-243aaa40b8fd	2026-03-12 08:38:07.246533+05:30	2026-03-13 08:38:07.246533+05:30	68c90bc9-bd5f-43ed-8237-d1f5ce5b9244	\N	f	21
7e8c0fcd-fe26-478e-8b75-1c2029602056	2026-03-12 09:43:07.323502+05:30	2026-03-13 09:43:07.323502+05:30	69f13228-d1e5-4ffe-ab2f-20219b3b9cbe	c3c0553b-6019-4717-b5fb-53539aaad63b	t	25
77d4877e-b760-48a9-82b7-308f4609b0c9	2026-03-12 09:43:43.205314+05:30	2026-03-13 09:43:43.205314+05:30	c3c0553b-6019-4717-b5fb-53539aaad63b	cbfb0e1a-b279-46b7-88ff-6e131972bdff	t	25
ff30900e-da33-46a9-b2bc-bb8f82072864	2026-03-12 08:51:26.89932+05:30	2026-03-13 08:51:26.89932+05:30	938c6bdf-57e1-4288-a026-4d49eab3d007	fc473d47-6a89-48d5-9f47-cf61f1fbf60b	t	21
82eabcc0-fc54-44aa-b8df-71c4f2a7458e	2026-03-12 08:51:27.705616+05:30	2026-03-13 08:51:27.705616+05:30	c764a139-48f5-4881-bdfa-76196f17b469	\N	f	21
c7b10f97-c056-41a8-94c4-c711efe06b59	2026-03-12 08:51:27.705616+05:30	2026-03-13 08:51:27.705616+05:30	7c3a7461-96de-451b-9fb5-f8d406e04ced	\N	f	21
b2ddb6d5-4d81-4564-8bcd-cea4020c300a	2026-03-12 08:51:27.705616+05:30	2026-03-13 08:51:27.705616+05:30	fc473d47-6a89-48d5-9f47-cf61f1fbf60b	\N	f	21
f85f88ac-fe31-40d2-9dce-020cea807f1c	2026-03-12 08:51:27.705616+05:30	2026-03-13 08:51:27.705616+05:30	dfedbc8a-bedb-46ad-b45e-12b891d34b02	\N	t	21
b0675d20-1114-4582-a6d1-cd738e5689e7	2026-03-12 08:56:45.385924+05:30	2026-03-13 08:56:45.385924+05:30	0806605a-1c3a-4f54-91ef-aab116f788df	7485f79e-07a6-4452-84b1-8b3fba4b910d	t	22
5eec5c1b-5ec7-45f9-9d3c-6373061abbbf	2026-03-12 08:56:45.876731+05:30	2026-03-13 08:56:45.876731+05:30	7485f79e-07a6-4452-84b1-8b3fba4b910d	57afac24-62c7-4db6-ac5b-086b039a644e	t	22
ccb3714a-c18f-47e8-9e99-74202c2f6bc2	2026-03-12 08:56:45.933771+05:30	2026-03-13 08:56:45.933771+05:30	57afac24-62c7-4db6-ac5b-086b039a644e	\N	f	22
2498f21f-2d3e-40a2-8dfe-3a86aa2f8637	2026-03-12 08:56:57.44824+05:30	2026-03-13 08:56:57.44824+05:30	8b4add05-34fd-439e-9a71-74d1650cb23c	ca6d2faf-70ad-49ed-9c87-c6c03f5339a9	t	22
ee3c74ab-78ac-4500-9c08-1703d64600b2	2026-03-12 08:56:57.887456+05:30	2026-03-13 08:56:57.887456+05:30	ca6d2faf-70ad-49ed-9c87-c6c03f5339a9	6135d0ce-1571-4b60-8de0-7797e6d2b2f3	t	22
8eee760f-5a1c-450c-a612-7a5f8be71afa	2026-03-12 08:56:57.933111+05:30	2026-03-13 08:56:57.933111+05:30	6135d0ce-1571-4b60-8de0-7797e6d2b2f3	\N	f	22
5cd6413e-2022-4be6-80dd-c34636890ed9	2026-03-12 09:01:30.406127+05:30	2026-03-13 09:01:30.406127+05:30	743b1fd4-a154-4ce2-a819-67b811a1d549	163baa0c-7054-456b-94ae-d5290f8133ca	t	21
b62a16fa-6f01-40b0-bf09-e814e4938a5b	2026-03-12 09:01:56.638269+05:30	2026-03-13 09:01:56.638269+05:30	163baa0c-7054-456b-94ae-d5290f8133ca	\N	f	21
9f56db2c-4849-46de-985d-01592f9494ea	2026-03-12 09:02:15.567894+05:30	2026-03-13 09:02:15.567894+05:30	f385c969-2398-4713-8932-f6ac9c895041	aecbe57f-68f1-4668-ae3c-b4e2130a81e8	t	22
47df884c-0a36-4487-8406-0d237a09463f	2026-03-12 09:02:15.839152+05:30	2026-03-13 09:02:15.839152+05:30	aecbe57f-68f1-4668-ae3c-b4e2130a81e8	6b8cb4a8-7ecb-48c1-ae1b-faf8f9722155	t	22
c042ef3b-3681-4cbd-80e5-0bb55fde2217	2026-03-12 09:02:15.881317+05:30	2026-03-13 09:02:15.881317+05:30	6b8cb4a8-7ecb-48c1-ae1b-faf8f9722155	02548268-9433-4bea-a4cf-fba0cb781b98	t	22
f6b312ef-2f9d-4e22-b12b-c0a466d28d2c	2026-03-12 09:04:25.721098+05:30	2026-03-13 09:04:25.721098+05:30	02548268-9433-4bea-a4cf-fba0cb781b98	42918949-2ecd-4793-b25e-74a97d621887	t	22
d5843ab8-5e6a-43c8-90ba-bf617689f6a7	2026-03-12 09:04:25.777891+05:30	2026-03-13 09:04:25.777891+05:30	42918949-2ecd-4793-b25e-74a97d621887	b23fea64-faf4-486c-b583-8dc1c4011d4e	t	22
d14a9a60-3722-4539-85fa-a8517dcff0e5	2026-03-12 09:04:25.859924+05:30	2026-03-13 09:04:25.859924+05:30	b23fea64-faf4-486c-b583-8dc1c4011d4e	1ae2d0c9-d3c7-4e44-bf04-be427e35c948	t	22
506d74b1-0639-4237-889c-dabb624cdde9	2026-03-12 09:04:25.947957+05:30	2026-03-13 09:04:25.947957+05:30	1ae2d0c9-d3c7-4e44-bf04-be427e35c948	\N	f	22
a01878e8-ba7b-4d34-b8e8-27a640400ae7	2026-03-12 09:14:23.373002+05:30	2026-03-13 09:14:23.373002+05:30	7ee95691-d43d-478e-a657-d5c2d8dd94df	\N	f	23
5a6f3225-47d7-449f-9b0c-6026d5dbe9d1	2026-03-12 09:18:56.550574+05:30	2026-03-13 09:18:56.550574+05:30	76922812-e519-4887-aa9f-609f6921588e	\N	t	23
50bdedec-2729-4a3e-abeb-a01a7c6cba70	2026-03-12 09:28:04.677881+05:30	2026-03-13 09:28:04.677881+05:30	712f246d-742c-4b0f-a97b-5a1d02a82c5d	65a0276f-0313-40f9-b923-86b7e0163d9a	t	24
11e6330e-0cda-40ac-9fce-3666d53b32fa	2026-03-12 09:28:05.563897+05:30	2026-03-13 09:28:05.563897+05:30	65a0276f-0313-40f9-b923-86b7e0163d9a	cb38081b-4700-4a70-b6bd-0c49cbc12ba1	t	24
5802752f-502f-496c-accc-5e1626b5d48c	2026-03-12 09:28:05.698652+05:30	2026-03-13 09:28:05.698652+05:30	cb38081b-4700-4a70-b6bd-0c49cbc12ba1	\N	f	24
27df1a35-8f84-4013-9d88-26cc7d609a0f	2026-03-12 09:31:50.467876+05:30	2026-03-13 09:31:50.467876+05:30	d58d10b6-946c-4333-95a0-667cc051b0d4	\N	t	24
33c16cf1-2917-456d-a8c2-6bdc719a27b5	2026-03-12 09:43:43.24372+05:30	2026-03-13 09:43:43.24372+05:30	cbfb0e1a-b279-46b7-88ff-6e131972bdff	\N	t	25
d1b69489-0776-4319-8924-094ac5fcfb11	2026-03-12 09:48:55.673676+05:30	2026-03-13 09:48:55.673676+05:30	79fe2e92-d78b-4065-a36e-79622f77d00b	\N	f	25
4aa09edf-5cf7-48b9-b802-6e94347473ba	2026-03-12 12:30:09.873694+05:30	2026-03-13 12:30:09.873694+05:30	4baa493e-7a96-44b4-9738-8b86509dc0de	\N	t	25
bfe475c7-dd1f-46ff-bcd4-f962352a14cb	2026-03-12 12:42:15.834351+05:30	2026-03-13 12:42:15.834351+05:30	52d935e1-3610-4586-a4cd-a97434ccad8f	\N	t	25
4e716567-8585-4324-bb00-d2cfda3d26f7	2026-03-12 12:48:08.832597+05:30	2026-03-13 12:48:08.832597+05:30	b65c39ce-a476-447e-8a34-40f360189b0e	\N	f	26
b9944ed1-1797-4c94-97d9-a82144b6716f	2026-03-12 13:20:52.949259+05:30	2026-03-13 13:20:52.949259+05:30	17311824-515f-4e4b-b524-0d6a3d942969	\N	t	27
e242db14-4600-48c7-9cba-8a65f834b5a1	2026-03-12 13:33:22.671095+05:30	2026-03-13 13:33:22.671095+05:30	0578b9d6-e424-4176-91f2-7255cd1c6251	\N	f	24
16e547a3-aa94-49ee-a586-7e8dc969da32	2026-03-14 11:26:52.205645+05:30	2026-03-15 11:26:52.205645+05:30	ffe094f8-5c33-4c57-b32c-275d44b93779	\N	f	28
\.


--
-- Data for Name: resource_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.resource_types (resource_type_id, type_name) FROM stdin;
1	Classroom
2	Computer Lab
3	Auditorium
4	Meeting Room
5	Science Lab
\.


--
-- Data for Name: resources; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.resources (resource_id, resource_name, resource_type_id, building_id, floor_number, description) FROM stdin;
1	Classroom A-101	1	1	1	Standard Classroom with capacity 60
2	Classroom A-102	1	1	1	Standard Classroom with capacity 50
3	Computer Lab A-103	2	1	1	Advanced Computer Lab
4	Meeting Room A-201	4	1	2	Main A-Block Meeting Room
5	Auditorium A-Main	3	1	0	A-Block Ground Auditorium
6	Classroom C-W-101	1	2	1	Classroom in West C-Block
7	Classroom C-W-102	1	2	1	Classroom in West C-Block
8	Programming Lab C-W-201	2	2	2	Computer lab for competitive programming
9	Meeting Room C-W-301	4	2	3	Faculty Meeting Room
10	Classroom C-E-101	1	3	1	Classroom in East C-Block
11	Classroom C-E-102	1	3	1	Classroom in East C-Block
12	Hardware Lab C-E-201	2	3	2	Hardware & Networking Lab
13	Hardware Lab C-E-202	2	3	2	Electronics Lab
14	Classroom D-S-101	1	4	1	Classroom in South D-Block
15	Classroom D-S-102	1	4	1	Classroom in South D-Block
16	Meeting Room D-S-201	4	4	2	Conference Room for D-Block Staff
17	Auditorium D-S-301	3	4	3	South D-Block Mini Auditorium
18	Classroom D-W-101	1	5	1	Classroom in West D-Block
19	Classroom D-W-102	1	5	1	Classroom in West D-Block
20	Research Lab D-W-201	2	5	2	AI/ML Research Lab
21	Data Science Lab D-W-202	2	5	2	Data Science & Analytics Lab
22	Classroom C-SE-101	1	6	1	Classroom in South-East C-Block
23	Classroom C-SE-102	1	6	1	Classroom in South-East C-Block
24	Classroom C-SE-201	1	6	2	Smart Classroom with Projector
25	Auditorium C-SE	3	6	0	Main Event Auditorium for South-East Block
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (role_id, role_name) FROM stdin;
1	ADMIN
2	MAINTENANCE
3	STUDENT
4	FACULTY
\.


--
-- Data for Name: shelves; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shelves (shelf_id, cupboard_id, shelf_number, capacity, description) FROM stdin;
8	3	1	10	Spare keyboards and mice
9	3	2	20	Power cables and ethernet cables
10	3	3	5	Spare monitors
11	3	4	15	Miscellanous IT supplies
12	4	1	15	Routers and switches
13	4	2	30	Patch cords and crimping tools
14	5	1	50	Raspberry Pi and Arduino boards
15	5	2	100	Various sensors and actuators
\.


--
-- Data for Name: student; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.student (rno, name, branch, semester, cpi) FROM stdin;
101	Ramesh	CE	3	9
102	Mahesh	EC	3	8
103	Suresh	ME	4	7
104	Amit	EE	4	8
105	Anita	CE	4	8
106	Reeta	ME	3	7
107	Rohit	EE	4	9
108	Chetan	CE	3	8
109	Rakesh	CE	4	9
\.


--
-- Data for Name: temp_table; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.temp_table (booking_id, resource_id, name) FROM stdin;
500	2	\N
500	1	\N
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_roles (user_id, role_id) FROM stdin;
10	4
14	1
15	4
16	3
17	4
19	3
20	3
21	3
22	4
23	2
24	4
25	1
26	3
27	2
28	4
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, name, email, password, created_at, enabled, provider) FROM stdin;
10	Meet Padhiyar	meet@faculty.com	123qwe	2026-02-22 19:40:43.369694	t	\N
14	meet admin	admin@admin.com	123qwe	2026-02-22 21:48:40.642101	t	\N
15	meet padhiar	test@faculty.com	123qwe	2026-02-25 15:42:00.517519	t	\N
16	khaman dhokala	test@student.com	123qe2w	2026-02-25 18:41:03.656217	t	\N
17	meet padhiyar	meettest@faculty.com	123qwe	2026-03-05 16:43:30.901416	t	LOCAL
19	tester1	tester1@student.com	$2a$10$IjclTz48ZC7XFWmH7.rm3uU7cuiEV5HJu7XwNCVH7BNmOF3bQl60.	2026-03-08 11:14:21.307558	t	LOCAL
20	tester2	tester2@student.com	$2a$10$qixi/RSwe/oiDNV2Nupzp..w4p/Aib/kkGBAxm2ODHi3bYHL8.sBu	2026-03-08 11:17:27.592774	t	LOCAL
21	Jane Doe	jane.doe@example.com	$2a$10$uJ4dJLoKWjAoavnYYTfwfe/t.WrFpMxAGHTwndaDd.jjn7Qui4zam	2026-03-10 19:36:59.846587	t	LOCAL
22	tommy bhau bhau	tester@faculty.com	$2a$10$WL308FaDPINTCNvWYBVth.d7IkIEzqsomGTlH3OUfBLga0jih6qVW	2026-03-12 08:56:15.900669	t	LOCAL
23	meeet sdfkjgh	tester2@maintenance.com	$2a$10$Mb3fyXeB5XQ67ZJlLCq60eIaTMQqFBIkAplitvcnUXdxLxwn8updS	2026-03-12 09:04:25.427067	t	LOCAL
24	tester3 test test	tester3@faculty.com	$2a$10$30ucA9Y8TVSoZh0CSwsXxuDlDP8SbzXi3gFUC9UnDO/DPGqBfx3IS	2026-03-12 09:23:54.48096	t	LOCAL
25	500 days of summer	summer@admin.com	$2a$10$nQ/j2B9iscJlEXwpM1LCTufsfTL5Sc8/KM8K.5UVR8BJqTYyhsQN2	2026-03-12 09:43:07.156071	t	LOCAL
26	qwe qwe	qwe@student.com	$2a$10$9DePfkl.4dDCkqggVyq2semf5dCaaUWyY0wlgH1NiG0WiSk2xEdoG	2026-03-12 12:48:08.623508	t	LOCAL
27	qwe qwe	tester3@maintenance.com	$2a$10$0xeMJtFQcNRbjvSpm5a8/e5YXXEWp9P7GpLKg9ABN7Ax0zldR5V46	2026-03-12 13:20:52.483211	t	LOCAL
28	test test	test5@faculty.com	$2a$10$kkZcOl8ijvIDYk3Vm5OTwOELVdZNp391jqUGCkDC1vstKFXm5LHHO	2026-03-14 11:26:51.847887	t	LOCAL
\.


--
-- Name: bookings_booking_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bookings_booking_id_seq', 98, true);


--
-- Name: buildings_building_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.buildings_building_id_seq', 4, true);


--
-- Name: cupboards_cupboard_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cupboards_cupboard_id_seq', 5, true);


--
-- Name: facilities_facility_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.facilities_facility_id_seq', 9, true);


--
-- Name: maintenance_maintenance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.maintenance_maintenance_id_seq', 11, true);


--
-- Name: resource_types_resource_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.resource_types_resource_type_id_seq', 5, true);


--
-- Name: resources_resource_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.resources_resource_id_seq', 5, true);


--
-- Name: roles_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_role_id_seq', 4, true);


--
-- Name: shelves_shelf_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.shelves_shelf_id_seq', 15, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 28, true);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (booking_id);


--
-- Name: buildings buildings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.buildings
    ADD CONSTRAINT buildings_pkey PRIMARY KEY (building_id);


--
-- Name: cupboards cupboards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cupboards
    ADD CONSTRAINT cupboards_pkey PRIMARY KEY (cupboard_id);


--
-- Name: facilities facilities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facilities
    ADD CONSTRAINT facilities_pkey PRIMARY KEY (facility_id);


--
-- Name: maintenance maintenance_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance
    ADD CONSTRAINT maintenance_pkey PRIMARY KEY (maintenance_id);


--
-- Name: refresh_tokens refresh_token_jti_index; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_token_jti_index UNIQUE (jti);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: resource_types resource_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource_types
    ADD CONSTRAINT resource_types_pkey PRIMARY KEY (resource_type_id);


--
-- Name: resource_types resource_types_type_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource_types
    ADD CONSTRAINT resource_types_type_name_key UNIQUE (type_name);


--
-- Name: resources resources_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_pkey PRIMARY KEY (resource_id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (role_id);


--
-- Name: roles roles_role_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_role_name_key UNIQUE (role_name);


--
-- Name: shelves shelves_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shelves
    ADD CONSTRAINT shelves_pkey PRIMARY KEY (shelf_id);


--
-- Name: student student_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_pkey PRIMARY KEY (rno);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (user_id, role_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: refresh_token_user_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX refresh_token_user_index ON public.refresh_tokens USING btree (user_id);


--
-- Name: refresh_tokens fk1lih5y2npsf8u5o3vhdb9y0os; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT fk1lih5y2npsf8u5o3vhdb9y0os FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: bookings fk_booking_resource; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT fk_booking_resource FOREIGN KEY (resource_id) REFERENCES public.resources(resource_id) ON DELETE CASCADE;


--
-- Name: bookings fk_bookings_approver; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT fk_bookings_approver FOREIGN KEY (approver_id) REFERENCES public.users(user_id) ON DELETE SET NULL;


--
-- Name: bookings fk_bookings_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: resources fk_building; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT fk_building FOREIGN KEY (building_id) REFERENCES public.buildings(building_id) ON DELETE CASCADE;


--
-- Name: cupboards fk_cupboard_resource; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cupboards
    ADD CONSTRAINT fk_cupboard_resource FOREIGN KEY (resource_id) REFERENCES public.resources(resource_id) ON DELETE CASCADE;


--
-- Name: facilities fk_facility_resource; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facilities
    ADD CONSTRAINT fk_facility_resource FOREIGN KEY (resource_id) REFERENCES public.resources(resource_id) ON DELETE CASCADE;


--
-- Name: maintenance fk_maintenance_resource; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance
    ADD CONSTRAINT fk_maintenance_resource FOREIGN KEY (resource_id) REFERENCES public.resources(resource_id) ON DELETE CASCADE;


--
-- Name: resources fk_resource_type; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT fk_resource_type FOREIGN KEY (resource_type_id) REFERENCES public.resource_types(resource_type_id) ON DELETE SET NULL;


--
-- Name: shelves fk_shelf_cupboard; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shelves
    ADD CONSTRAINT fk_shelf_cupboard FOREIGN KEY (cupboard_id) REFERENCES public.cupboards(cupboard_id) ON DELETE CASCADE;


--
-- Name: bookings fkqgfn14aqgegmgdy5lt9ob0jq; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT fkqgfn14aqgegmgdy5lt9ob0jq FOREIGN KEY (shelf_id) REFERENCES public.shelves(shelf_id);


--
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(role_id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 9WJIQqRUGWVSkBWqW8ccmJi8pYDahJwUuhDwTgMj0coEN6bm25FKyzDJJKFfgq9

