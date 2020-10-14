const client = require('../server')
const status = require('../status')
const moment = require('moment')

async function getAllUsers(){
    try{
        const results = await client.query('SELECT * FROM public."users"')
        return status.statusOperation(0, `Procesado Correctamente`, [], { users: results.rows })
    } catch(e){
        console.error(`Failed at getAllUsers ${e}`)
        return status.statusOperation(2, `DatabaseOperation Error: `, [e], {users: []})
    }
}

async function loginUser(username, password){
    try{
        const results = await client.query(`SELECT * FROM public."users" WHERE username = $1 and password = $2`, [username, password])
        if(results.rows.length > 0){
            delete results.rows[0].password
            const resultAddress = await client.query(`SELECT * FROM public."address" WHERE id_user = $1`, [results.rows[0].id])
            results.rows[0].address = resultAddress.rows
            return status.statusOperation(0, `Procesado Correctamente`, [], {users: results.rows })
        } else {
            return status.statusOperation(5, `Usuario y/o contraseña incorrectos`, [], {users: results.rows})
        }
        
    } catch(e){
        console.error(`Failed at loginUser ${e}`)
        return status.statusOperation(2, `DatabaseOperation Error: `, [e], {users: []})
    }
}

async function processUser(body){
    console.log("Body: ", body)
    try {
        const confirmationString = 'abcdefghijklmnopq'
        if(body.newUser){
            var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            const {username, password, name, lastname, email, mothermaidenname, phone} = body.users[0]
            const values = [username, password, name, lastname, email, mothermaidenname, phone, 1, confirmationString, 
                mysqlTimestamp, mysqlTimestamp, mysqlTimestamp]
            console.log("Values: ", values)
            await client.query(
                `INSERT INTO public."users" 
                ( username, password, name, lastname, email, mothermaidenname, phone, id_status, confirmation_string, confirmation_string_date, created_timestamp, updated_timestamp)
                values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`, values)
            const results = await client.query(`SELECT * FROM public."users" WHERE username = $1 and password = $2`, [username, password])
            delete results.rows[0].password
            return status.statusOperation(0, `Procesado Correctamente`, [], {users: results.rows})
        } else {
            const {username, password, name, lastname, email, mothermaidenname, phone, id} = body.users[0]
            const values = [username, password, name, lastname, email, mothermaidenname, phone, 1, id]
            await client.query(
                `UPDATE public.users
                SET username=$1, password=$2, name=$3, lastname=$4, email=$5, mothermaidenname=$6, phone=$7, id_status=$8
                WHERE id=$9`, values
            )
            const results = await client.query(`SELECT * FROM public."users" WHERE username = $1 and password = $2`, [username, password])
            delete results.rows[0].password
            return status.statusOperation(0, `Procesado Correctamente`, [], {users: results.rows})
        }
    } catch(e){
        console.error(`Failed at processUser ${e}`)
        return status.statusOperation(2, `DatabaseOperation Error: `, [e], {users: []})
    }
}

exports.getAllUsers = getAllUsers
exports.loginUser = loginUser
exports.processUser = processUser