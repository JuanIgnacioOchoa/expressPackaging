const { Client } = require('pg')
//const host = "top-express-dev.cxsn0wvppdrz.us-east-2.rds.amazonaws.com"
//const password = "Jiog040719"
const password = (process.env.password || "9462");
const host = (process.env.host || "juans-macbook-pro.local");
console.log("Pass: ", password)
console.log("Host: ", host)
const client = new Client({
    "user": "postgres",
    "password": password,
    "host": host,
    "port": 5432,
    "database": "topExpress"
})

start()

async function start(){
    await connect();
}

async function connect(){
    try{
        await client.connect();
        console.log("Connection succesful!")
    } catch(e) {
        console.error(`TOPEXPRESSERROR: Failed to connect ${e}`)
    }
}

function statusOperation(statusOperationCode, description, errors, data){
    return{
        statusOperation: {
            code: statusOperationCode,
            description: description,
            errors: errors
        },
        data
    }
}

exports.statusOperation = statusOperation
module.exports = client
