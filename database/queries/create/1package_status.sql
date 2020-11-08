-- Table: public.package_status

-- DROP TABLE public.package_status;

CREATE TABLE public.package_status
(
    id integer NOT NULL,
    status character varying COLLATE pg_catalog."default" NOT NULL,
    description character varying COLLATE pg_catalog."default" NOT NULL,
    created_timestamp timestamp with time zone NOT NULL,
    updated_timestamp timestamp with time zone NOT NULL,
    CONSTRAINT package_status_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.package_status
    OWNER to postgres;