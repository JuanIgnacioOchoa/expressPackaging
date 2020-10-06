-- Table: public.suppliers

-- DROP TABLE public.suppliers;

CREATE TABLE public.suppliers
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    name character varying COLLATE pg_catalog."default" NOT NULL,
    created_timestamp date NOT NULL,
    updated_timestamp date NOT NULL,
    CONSTRAINT suppliers_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.suppliers
    OWNER to postgres;