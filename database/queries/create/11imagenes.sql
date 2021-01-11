-- Table: public.imagenes

-- DROP TABLE public.imagenes;

CREATE TABLE public.imagenes
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    id_package integer NOT NULL,
    base64 character varying COLLATE pg_catalog."default" NOT NULL,
    "fileName" character varying COLLATE pg_catalog."default",
    CONSTRAINT imagenes_pkey PRIMARY KEY (id),
    CONSTRAINT fk_package FOREIGN KEY (id_package)
        REFERENCES public."package" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE public.imagenes
    OWNER to postgres;
-- Index: fki_fk_package

-- DROP INDEX public.fki_fk_package;

CREATE INDEX fki_fk_package
    ON public.imagenes USING btree
    (id_package ASC NULLS LAST)
    TABLESPACE pg_default;