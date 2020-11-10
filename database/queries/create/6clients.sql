-- Table: public.clients

-- DROP TABLE public.clients;

CREATE TABLE public.clients
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 400 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    username character varying COLLATE pg_catalog."default",
    password character varying COLLATE pg_catalog."default" NOT NULL,
    name character varying COLLATE pg_catalog."default" NOT NULL,
    lastname character varying COLLATE pg_catalog."default" NOT NULL,
    email character varying COLLATE pg_catalog."default",
    mothermaidenname character varying COLLATE pg_catalog."default",
    phone character varying COLLATE pg_catalog."default",
    id_status integer NOT NULL,
    confirmation_string character varying COLLATE pg_catalog."default",
    confirmation_string_date timestamp with time zone,
    confirmation_date timestamp with time zone,
    created_timestamp timestamp with time zone NOT NULL,
    updated_timestamp timestamp with time zone NOT NULL,
    CONSTRAINT clients_pkey PRIMARY KEY (id),
    CONSTRAINT unique_username UNIQUE (username),
    CONSTRAINT fk_status_clients FOREIGN KEY (id_status)
        REFERENCES public.status (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE public.clients
    OWNER to postgres;
-- Index: fki_fk_status_clients

-- DROP INDEX public.fki_fk_status_clients;

CREATE INDEX fki_fk_status_clients
    ON public.clients USING btree
    (id_status ASC NULLS LAST)
    TABLESPACE pg_default;