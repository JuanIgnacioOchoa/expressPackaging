const client = require('../server')
const status = require('../status')
const moment = require('moment')
const constants = require('../../constants')

async function getAllStatus(){
    console.log('getAllStatus')
    try{
        const results = await client.query('SELECT * FROM public."status"')
        console.log('Query succeed')
        return status.statusOperation(0, `Procesado Correctamente`, [], { status: results.rows })
    } catch(e){
        console.error(`TOPEXPRESSERROR: Failed at getAllClients ${e}`)
        return status.statusOperation(2, `DatabaseOperation Error: `, [e], {status: []})
    }
}

exports.getAllStatus = getAllStatus