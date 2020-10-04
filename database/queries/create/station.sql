-- Table: public.station

-- DROP TABLE public.station;

CREATE TABLE public.station
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    name character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT station_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.station
    OWNER to postgres;