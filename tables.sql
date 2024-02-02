--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

-- Started on 2024-01-15 15:05:34

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 4850 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 16528)
-- Name: blog_posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.blog_posts (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    content text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    author character varying(100)
);


ALTER TABLE public.blog_posts OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16527)
-- Name: blog_posts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.blog_posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.blog_posts_id_seq OWNER TO postgres;

--
-- TOC entry 4851 (class 0 OID 0)
-- Dependencies: 216
-- Name: blog_posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.blog_posts_id_seq OWNED BY public.blog_posts.id;


--
-- TOC entry 218 (class 1259 OID 16537)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    username text NOT NULL,
    password text
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 4693 (class 2604 OID 16531)
-- Name: blog_posts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_posts ALTER COLUMN id SET DEFAULT nextval('public.blog_posts_id_seq'::regclass);


--
-- TOC entry 4843 (class 0 OID 16528)
-- Dependencies: 217
-- Data for Name: blog_posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.blog_posts VALUES (263, 'Varmt välkommen', 'Idag är det dags för inlämning. Jag skulle såkalrt önska en snyggare styling men kan lägga tid på detta efteråt.', '2024-01-15 14:34:44.06009', 'Grodan');


--
-- TOC entry 4844 (class 0 OID 16537)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES ('Benjamin', '$2b$10$gGGSnGnTbxzLS1LrmF1xpeZPM8PSA9nbqST74XmiUE0nOyaBh6uCi');
INSERT INTO public.users VALUES ('Kevvy', '$2b$10$OxTnvqRQmbvdZ9F1qJT9t.Jj6GPwWg3uI.rotdU9BsRk/JsIC3r6W');
INSERT INTO public.users VALUES ('Grodan', '$2b$10$5A9GPWcNpH.fG5v5IOdN5eo18AzcEZKhyBTsmcUcJms3y9v03MfiW');


--
-- TOC entry 4852 (class 0 OID 0)
-- Dependencies: 216
-- Name: blog_posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.blog_posts_id_seq', 263, true);


--
-- TOC entry 4696 (class 2606 OID 16536)
-- Name: blog_posts blog_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_pkey PRIMARY KEY (id);


--
-- TOC entry 4698 (class 2606 OID 16543)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (username);


-- Completed on 2024-01-15 15:05:34

--
-- PostgreSQL database dump complete
--

