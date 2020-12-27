INSERT INTO public.package_status(
	id, status, description, type, created_timestamp, updated_timestamp)
	VALUES (639556718, 'PAGADO', 'El pedido ha sido pagado en su totalidad', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO public.package_status(
	id, status, description, type, created_timestamp, updated_timestamp)
	VALUES (539112279, 'SIN PAGO', 'El pedido no ha recibido pago', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO public.package_status(
	id, status, description, type, created_timestamp, updated_timestamp)
	VALUES (801525881, 'PAGO PARCIAL', 'El pedido ha recibido pago, pero no completo', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO public.package_status(
	id, status, description, type, created_timestamp, updated_timestamp)
	VALUES (513742944, 'ENTREGADO', 'El paquete se entrego con exito', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO public.package_status(
	id, status, description, type, created_timestamp, updated_timestamp)
	VALUES (322132265, 'TRANSCURSO', 'El paquete esta transcurso', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);