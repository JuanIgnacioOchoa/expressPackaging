INSERT INTO public.users(
	username, password, name, lastname, email, mothermaidenname, phone, id_status, confirmation_string, confirmation_string_date, confirmation_date, created_timestamp, updated_timestamp)
	VALUES (
			'fernando-vera', --username
			'mayueth', --pasword
			'Fernando', --name
			'Vera', --lastname
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