-- Table: public.payment_type

-- DROP TABLE public.payment_type;

CREATE TABLE public.payment_type
(
    id integer NOT NULL,
    description character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT payment_type_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.payment_type
    OWNER to postgres;