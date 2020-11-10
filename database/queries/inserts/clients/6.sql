INSERT INTO public.clients(
	username, password, name, lastname, email, mothermaidenname, phone, id_status, confirmation_string, confirmation_string_date, confirmation_date, created_timestamp, updated_timestamp)
	VALUES (
			'francisco-aceves', --username
			'mayueth', --pasword
			'Francisco', --name
			'Aceves', --lastname
			null, --email
			null, --mothermaidenname
			null, --phone
			670640726, --id_status
			null, --confirmation_string
			null, --confirmation_string_date
			CURRENT_TIMESTAMP, --confirmation_date
			CURRENT_TIMESTAMP, --created_timestamp
			CURRENT_TIMESTAMP  --updated_timestamp
		   );