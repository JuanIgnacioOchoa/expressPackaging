-- Table: public.package_status

-- DROP TABLE public.package_status;

CREATE TABLE public.package_status
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    status character varying COLLATE pg_catalog."default" NOT NULL,
    description character varying COLLATE pg_catalog."default" NOT NULL,
    created_timestamp date NOT NULL,
    updated_timestamp date NOT NULL,
    CONSTRAINT package_status_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.package_status
    OWNER to postgres;