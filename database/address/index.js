const client = require('../server')
const status = require('../status')
const moment = require('moment')

async function getAddressByUserId(userId){
    try{
        const results = await client.query('SELECT * FROM public."address" WHERE id_user = ?', [userId])
        return status.statusOperation(0, `Procesado Correctamente`, [], { users: results.rows })
    } catch(e){
        console.error(`Failed at getAllUsers ${e}`)
        return status.statusOperation(2, `DatabaseOperation Error: `, [e], {users: []})
    }
}



exports.getAllUsers = getAllUsers