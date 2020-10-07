const { Client } = require('pg')

const client = new Client({
    "user": "postgres",
    "password": "Jiog040719",
    "host": "top-express-dev.cxsn0wvppdrz.us-east-2.rds.amazonaws.com",
    //"password": "9462",
    //"host": "juans-macbook-pro.local",
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
        console.error(`Failed to connect ${e}`)
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
