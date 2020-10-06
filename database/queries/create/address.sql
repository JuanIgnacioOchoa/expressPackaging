-- Table: public.address

-- DROP TABLE public.address;

CREATE TABLE public.address
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    address_line_1 character varying COLLATE pg_catalog."default" NOT NULL,
    int_number character varying COLLATE pg_catalog."default",
    ext_number character varying COLLATE pg_catalog."default" NOT NULL,
    address_line_2 character varying COLLATE pg_catalog."default",
    city character varying COLLATE pg_catalog."default" NOT NULL,
    state character varying COLLATE pg_catalog."default" NOT NULL,
    country character varying COLLATE pg_catalog."default" NOT NULL,
    additional_info character varying COLLATE pg_catalog."default",
    id_user integer,
    id_station integer,
    created_timestamp date NOT NULL,
    updated_timestamp date NOT NULL,
    CONSTRAINT address_pkey PRIMARY KEY (id),
    CONSTRAINT fk_station_address FOREIGN KEY (id_station)
        REFERENCES public.station (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT user_address FOREIGN KEY (id_user)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE public.address
    OWNER to postgres;
-- Index: fki_fk_station_address

-- DROP INDEX public.fki_fk_station_address;

CREATE INDEX fki_fk_station_address
    ON public.address USING btree
    (id_station ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: fki_user_address

-- DROP INDEX public.fki_user_address;

CREATE INDEX fki_user_address
    ON public.address USING btree
    (id_user ASC NULLS LAST)
    TABLESPACE pg_default;