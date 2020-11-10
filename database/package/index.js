const client = require('../server')
const status = require('../status')
const moment = require('moment')
const constants = require('../../constants')
const supplier = require('../supplier/index')

async function getAllPackageStatus(){
    try{
        const results = await client.query('SELECT * FROM public."package_status"')
        console.log('Query succeed')
        return status.statusOperation(0, `Procesado Correctamente`, [], { status: results.rows })
    } catch(e){
        console.error(`TOPEXPRESSERROR: Failed at getAllPackageStatus ${e}`)
        return status.statusOperation(2, `DatabaseOperation Error: `, [e], {status: []})
    }
}

async function getClientPackages(idClient){
    try {
        const resultsActive = await client.query(`
        SELECT p.*, s.name as supplier_name, ps.status as status
            from public."package" as p, public."clients" as u, public."suppliers" as s, public."package_status" as ps
                WHERE u.id = p.id_client and s.id = p.id_supplier and ps.id = p.id_status and ps.id <> $1 and u.id = $2`, [constants.ENTREGADO_ID, idClient])
        const resultsDelivered = await client.query(`
        SELECT p.*, s.name as supplier_name, ps.status as status
            from public."package" as p, public."clients" as u, public."suppliers" as s, public."package_status" as ps
                WHERE u.id = p.id_client and s.id = p.id_supplier and ps.id = p.id_status and ps.id = $1 and u.id = $2`, [constants.ENTREGADO_ID, idClient])
        return status.statusOperation(0, `Procesado Correctamente`, [], { packages: { delivered : resultsDelivered.rows, active: resultsActive.rows     } })
    } catch(e){
        console.error(`TOPEXPRESSERROR: Failed at getClientPackages ${e}`)
        return status.statusOperation(2, `DatabaseOperation Error: `, [e], {status: []})
    }
}


async function processPackage(body, filePath){
    try {
        if(body.idSupplier == 0){
            const newSupplier = await supplier.insertSupplier(body.supplierName)
            console.log("New Supplier: ", newSupplier.data.suppliers[0].id)
            if(newSupplier.statusOperation.code == 0){
                body.idSupplier = newSupplier.data.suppliers[0].id
            } else {
                return status.statusOperation(2, `Error en provvedor Error: `, ['El proveedor no existia y hubo un error al crearlo'], {packages: []})
            }
        }
        if(body.newPackage){
            
            var mysqlTimestamp = moment(Date.now());
            const {idSupplier, idClient, idAddress, referenceNumber, description, quantity, totalCost, shipCost, packageCost, idStatus, currency} = body
            const values = [idSupplier, idClient, idAddress, referenceNumber, description, quantity, totalCost, shipCost, packageCost, filePath, idStatus, currency, mysqlTimestamp, mysqlTimestamp]
            console.log("Values: ", values)
            const results = await client.query(
                `INSERT INTO public."package" 
                (id_supplier, id_client, id_address, reference_number, description, quantity, total_cost, shipping_cost, package_cost, receipt, id_status, currency, created_timestamp, updated_timestamp)
                values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`, values)
            //console.log(results.rows[0])
            //console.log(results)
            return status.statusOperation(0, `Procesado Correctamente`, [], { packages: results.rows})
        } else {
            const {username, password, name, lastname, email, mothermaidenname, phone, id, idStatus} = body.clients[0]
            const values = [username, password, name, lastname, email, mothermaidenname, phone, idStatus, id]
            await client.query(
                `UPDATE public.clients
                SET username=$1, password=$2, name=$3, lastname=$4, email=$5, mothermaidenname=$6, phone=$7, id_status=$8
                WHERE id=$9`, values
            )
            const results = await client.query(`SELECT * FROM public."package" WHERE username = $1 and password = $2`, [username, password])
            delete results.rows[0].password
            return status.statusOperation(0, `Procesado Correctamente`, [], {packages: results.rows})
            
        }
    } catch(e){
        
        console.error(`TOPEXPRESSERROR: Failed at processPackage ${e}`)
        return status.statusOperation(2, `DatabaseOperation Error: `, [e], {packages: []})
        
    }
}
exports.getAllPackageStatus = getAllPackageStatus
exports.getClientPackages = getClientPackages
exports.processPackage = processPackage
