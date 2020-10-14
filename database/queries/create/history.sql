-- Table: public.history

-- DROP TABLE public.history;

CREATE TABLE public.history
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    title character varying COLLATE pg_catalog."default" NOT NULL,
    description character varying COLLATE pg_catalog."default" NOT NULL,
    date date NOT NULL,
    id_status integer NOT NULL,
    id_package integer NOT NULL,
    created_timestamp timestamp with time zone NOT NULL,
    updated_timestamp timestamp with time zone NOT NULL,
    CONSTRAINT history_pkey PRIMARY KEY (id),
    CONSTRAINT fk_package_history FOREIGN KEY (id_package)
        REFERENCES public."package" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT fk_status_history FOREIGN KEY (id_status)
        REFERENCES public.package_status (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE public.history
    OWNER to postgres;
-- Index: fki_fk_package_history

-- DROP INDEX public.fki_fk_package_history;

CREATE INDEX fki_fk_package_history
    ON public.history USING btree
    (id_package ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: fki_fk_status_history

-- DROP INDEX public.fki_fk_status_history;

CREATE INDEX fki_fk_status_history
    ON public.history USING btree
    (id_status ASC NULLS LAST)
    TABLESPACE pg_default;