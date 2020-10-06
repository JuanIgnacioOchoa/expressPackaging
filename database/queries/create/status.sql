-- Table: public.status

-- DROP TABLE public.status;

CREATE TABLE public.status
(
    id integer NOT NULL,
    description character varying COLLATE pg_catalog."default" NOT NULL,
    created_timestamp date NOT NULL,
    updated_timestamp date NOT NULL,
    CONSTRAINT status_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.status
    OWNER to postgres;