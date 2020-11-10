INSERT INTO public.clients(
	username, password, name, lastname, email, mothermaidenname, phone, id_status, confirmation_string, confirmation_string_date, confirmation_date, created_timestamp, updated_timestamp)
	VALUES (
			'alejandro-vargas', --username
			'mayueth', --pasword
			'Alejandro', --name
			'Vargas', --lastname
			null, --email
			'De la Mora', --mothermaidenname
			'3314403131', --phone
			670640726, --id_status
			null, --confirmation_string
			null, --confirmation_string_date
			CURRENT_TIMESTAMP, --confirmation_date
			CURRENT_TIMESTAMP, --created_timestamp
			CURRENT_TIMESTAMP  --updated_timestamp
		   );