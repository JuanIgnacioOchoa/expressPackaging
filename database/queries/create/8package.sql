-- Table: public.package

-- DROP TABLE public."package";

CREATE TABLE public."package"
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    id_supplier integer NOT NULL,
    id_client integer NOT NULL,
    id_address integer,
    reference_number character varying COLLATE pg_catalog."default",
    description character varying COLLATE pg_catalog."default",
    quantity integer NOT NULL,
    total_cost numeric NOT NULL,
    shipping_cost numeric NOT NULL,
    package_cost numeric NOT NULL,
    receipt character varying COLLATE pg_catalog."default",
    created_timestamp timestamp with time zone NOT NULL,
    updated_timestamp timestamp with time zone NOT NULL,
    id_status integer NOT NULL,
    currency character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT package_pkey PRIMARY KEY (id),
    CONSTRAINT fk_address_package FOREIGN KEY (id_address)
        REFERENCES public.address (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fk_package_status_package FOREIGN KEY (id_status)
        REFERENCES public.package_status (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT fk_supllier_package FOREIGN KEY (id_supplier)
        REFERENCES public.suppliers (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fk_client_package FOREIGN KEY (id_client)
        REFERENCES public.clients (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE public."package"
    OWNER to postgres;
-- Index: fki_fk_address_package

-- DROP INDEX public.fki_fk_address_package;

CREATE INDEX fki_fk_address_package
    ON public."package" USING btree
    (id_address ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: fki_fk_package_status_package

-- DROP INDEX public.fki_fk_package_status_package;

CREATE INDEX fki_fk_package_status_package
    ON public."package" USING btree
    (id_status ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: fki_fk_supllier_package

-- DROP INDEX public.fki_fk_supllier_package;

CREATE INDEX fki_fk_supllier_package
    ON public."package" USING btree
    (id_supplier ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: fki_fk_client_package

-- DROP INDEX public.fki_fk_client_package;

CREATE INDEX fki_fk_client_package
    ON public."package" USING btree
    (id_client ASC NULLS LAST)
    TABLESPACE pg_default;