const client = require('../server')
const status = require('../status')
const moment = require('moment')

async function getAddressByUserId(userId){
    try{
        const results = await client.query('SELECT * FROM public."address" WHERE id_user = ?', [userId])
        return status.statusOperation(0, `Procesado Correctamente`, [], { clients: results.rows })
    } catch(e){
        console.error(`TOPEXPRESSERROR: Failed at getAllClients ${e}`)
        return status.statusOperation(2, `DatabaseOperation Error: `, [e], {clients: []})
    }
}

async function insertNewAddress(body){
    console.log('insertNewAddress: ', body)
    if(body.newAddress){
        var mysqlTimestamp = moment(Date.now());
        const {addressLine1, intNumber, extNumber, addressLine2, city, state, country, additionalInfo, idUser, idStatus, contactNumber, contactName} = body.address[0]
        const values = [addressLine1, intNumber, extNumber, addressLine2, city, state, country, additionalInfo, idUser, idStatus, mysqlTimestamp, mysqlTimestamp, contactNumber, contactName]
        console.log("Values: ", values)
        
        try{
            await client.query(
                `INSERT INTO public.address(
                    address_line_1, int_number, ext_number, address_line_2, city, state, country, additional_info, id_user, id_status, created_timestamp, updated_timestamp, contact_number, contact_name)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14);`, values)
            //const results = await client.query(`SELECT * FROM public."clients" WHERE id = $1`, [idUser])
            //delete results.rows[0].password
            const resultAddress = await client.query(`SELECT * FROM public."address" WHERE id_user = $1`, [idUser])
            //results.rows[0].address = resultAddress.rows
            //console.log("Result: ", result)
            return status.statusOperation(0, `Procesado Correctamente`, [], {address: resultAddress.rows})
        } catch (e){
            console.error(`TOPEXPRESSERROR: Failed at insertNewUser ${e}`)
            return status.statusOperation(2, `DatabaseOperation Error: `, [e], {clients: []})
        }
        
    }
}

exports.insertNewAddress = insertNewAddress
