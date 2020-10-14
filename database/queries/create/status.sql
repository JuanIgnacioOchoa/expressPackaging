-- Table: public.status

-- DROP TABLE public.status;

CREATE TABLE public.status
(
    id integer NOT NULL,
    description character varying COLLATE pg_catalog."default" NOT NULL,
    created_timestamp timestamp with time zone NOT NULL,
    updated_timestamp timestamp with time zone NOT NULL,
    CONSTRAINT status_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.status
    OWNER to postgres;