const client = require('../server')
const status = require('../status')
const moment = require('moment')
const nodemailer = require('nodemailer');
const constants = require('../../constants')

async function getAllSupliers(){
    console.log('getAllSuppliers')
    try{
        const results = await client.query('SELECT * FROM public."suppliers"')
        console.log('Query succeed')
        return status.statusOperation(0, `Procesado Correctamente`, [], { suppliers: results.rows })
    } catch(e){
        console.error(`TOPEXPRESSERROR: Failed at getAllSupliers 1 ${e}`)
        return status.statusOperation(2, `DatabaseOperation Error: `, [e], {suppliers: []})
    }
}

async function insertSupplier(name){
    try{
        var mysqlTimestamp = moment(Date.now());
        const values = [name, mysqlTimestamp, mysqlTimestamp]
        var results = await client.query(
            `SELECT * FROM public."suppliers" WHERE name = $1`, [name])
        if(results.rows.length == 0){
            results = await client.query(`INSERT INTO public."suppliers"(
                name, created_timestamp, updated_timestamp)
                VALUES ($1, $2, $3) RETURNING *`, values)
        }
        return status.statusOperation(0, `Procesado Correctamente`, [], { suppliers: results.rows })
    } catch(e){
        console.error(`TOPEXPRESSERROR: Failed at getAllSupliers 2 ${e}`)
        return status.statusOperation(2, `DatabaseOperation Error: `, [e], {suppliers: []})
    }
}

exports.insertSupplier = insertSupplier
exports.getAllSupliers = getAllSupliers