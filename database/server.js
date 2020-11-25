const { Client } = require('pg')
//const host = "top-express-dev.cxsn0wvppdrz.us-east-2.rds.amazonaws.com"
//const password = "Jiog040719"
const password = (process.env.password || "9462");
const host = (process.env.host || "juan8a.local");
console.log("Pass: ", password)
console.log("Host: ", host)
const client = new Client({
    "user": "postgres",
    "password": password,
    "host": host,
    "port": 5432,
    "database": "topExpress"
})

function sql() {
    this.connect = function() {
        return new Promise((resolve, reject) => reject("error connecting"));
    }
}


function connect() {
    return new Promise((resolve, reject) => {
        // const poolPromise = new sql.ConnectionPool("config.db");
        const poolPromise = new sql();
        poolPromise
            .connect()
            .then(pool => {
                console.log("Connection succesful!")
                resolve(pool);
            })
            .catch(err => {
                console.error(`TOPEXPRESSERROR: Failed to connect ${err}`)
                reject(err);
            });
    });
}

function establishConnection() {
     var a = connect();
     a.then(a => console.log("success"))
    .catch(err => {
        console.error("Retrying");
        // I suggest using some variable to avoid the infinite loop.
        setTimeout(establishConnection, 1000 * 60 * 5);
    });
};

establishConnection();

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
