INSERT INTO public."package"(
	id_supplier, id_user, id_address, reference_number, description, quantity, dimensions, total_cost, shipping_cost, package_cost, receipt, created_timestamp, updated_timestamp)
	VALUES ( --id
			1, --di_supplier
			1, --id_user
			null, --id_address
			null, --reference_number
			'chamarras', --description
			15, --quantity
			null, --dimensions
			234.32, --total_cost
			39, --shipping_cost
			195.32, --package-cost
			null,
			CURRENT_TIMESTAMP, --created_timestamp
			CURRENT_TIMESTAMP);--updated_timestamp