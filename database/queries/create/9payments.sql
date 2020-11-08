-- Table: public.payments

-- DROP TABLE public.payments;

CREATE TABLE public.payments
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    amount double precision NOT NULL,
    id_type integer NOT NULL,
    id_package integer NOT NULL,
    CONSTRAINT payments_pkey PRIMARY KEY (id),
    CONSTRAINT fk_package_payments FOREIGN KEY (id_package)
        REFERENCES public."package" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT fk_type_payments FOREIGN KEY (id_type)
        REFERENCES public.payment_type (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE public.payments
    OWNER to postgres;
-- Index: fki_fk_package_payments

-- DROP INDEX public.fki_fk_package_payments;

CREATE INDEX fki_fk_package_payments
    ON public.payments USING btree
    (id_package ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: fki_fk_type_payments

-- DROP INDEX public.fki_fk_type_payments;

CREATE INDEX fki_fk_type_payments
    ON public.payments USING btree
    (id_type ASC NULLS LAST)
    TABLESPACE pg_default;