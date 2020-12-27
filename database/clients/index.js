const client = require('../server')
const status = require('../status')
const moment = require('moment')
const nodemailer = require('nodemailer');
let aws = require('aws-sdk');
const constants = require('../../constants')

async function getAllClients(){
    console.log('getAllClients')
    try{
        const results = await client.query(`
        SELECT c.*, s.description as status 
            FROM public.clients as c, public.status as s
            WHERE c.id_status = s.id
        `)
        console.log('Query succeed')
        return status.statusOperation(0, `Procesado Correctamente`, [], { clients: results.rows })
    } catch(e){
        console.error(`TOPEXPRESSERROR: Failed at getAllClients ${e}`)
        return status.statusOperation(2, `DatabaseOperation Error: `, [e], {clients: []})
    }
}

async function loginClient(username, password){
    try{
        const results = await client.query(`SELECT * FROM public."clients" WHERE username = $1 and password = $2`, [username, password])
        if(results.rows.length > 0){
            delete results.rows[0].password
            const resultAddressClient = await client.query(`SELECT * FROM public."address" WHERE id_client = $1 order by id `, [results.rows[0].id])
            const resultAddressGlobal = await client.query(`SELECT * FROM public."address" WHERE id < 400 order by id `)
            results.rows[0].addressClient = resultAddressClient.rows
            results.rows[0].addressGlobal = resultAddressGlobal.rows
            const resultAddress = await client.query(`SELECT * FROM public."address" WHERE id_client = $1 or id = 1 order by id `, [results.rows[0].id])
            results.rows[0].address = resultAddress.rows
            return status.statusOperation(0, `Procesado Correctamente`, [], {clients: results.rows })
        } else {
            return status.statusOperation(5, `Usuario y/o contraseña incorrectos`, [], {clients: results.rows})
        }
        
    } catch(e){
        console.error(`TOPEXPRESSERROR: Failed at loginClient ${e}`)
        return status.statusOperation(2, `DatabaseOperation Error: `, [e], {clients: []})
    }
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function sendMail(email, confirmationString, idClient){
    if(process.env.host ){
        aws.config.update({region:'us-east-2'});
        var transporter = nodemailer.createTransport({
            host: "smtp-mail.outlook.com", // hostname
            secureConnection: false, // TLS requires secureConnection to be false
            port: 587, // port for secure SMTP
            tls: {
            ciphers:'SSLv3'
            },
            SES: new aws.SES({
                apiVersion: '2010-12-01'
            }),
            auth: {
                user: 'topexpressgdl@hotmail.com',
                pass: 'titanium502'    
            }
        });
        /*
        const protocol = (process.env.protocol || "http://");
        const host = (process.env.host || "juan8a.local");
        const port = (process.env.PORT || "8762");
        */
       const host = "http://topexpressqa-env.eba-dcnvmavd.us-east-2.elasticbeanstalk.com"
        var mailOptions = {
            from: 'topexpressgdl@hotmail.com',
            to: email,
            subject: 'Correo de activacion de Top Express',
            text: 'Bienvenido a top express',
            html: `<h1>
              TopExpress
            </h1>
            <p>
              Bienvenido a top express para activar su cuenta porfavor dele click al siguiente link 
                <a href="${host}/activate/client/${idClient}/${confirmationString}">www.topexpress.com.mx/activate/client/${idClient}/${confirmationString}</a>
              <br/>
              si no reconoces este servicio porfavor ignora este correo
            </p>`
        }
        transporter.sendMail(mailOptions, function(error, info) {
          if(error){
            console.log("Email error: " + error)
          } else {
            console.log("Email sent: " + email + " " + info.response)
          }
        })
    } else {
        //aws.config.update({region:'us-east-2'});
        var transporter = nodemailer.createTransport({
            service: "Gmail",
            host: 'smtp.gmail.com',
            auth: {
                user: 'juanignacio8ag@gmail.com',
                pass: 'Jiog693082'    
            }
        });
        /*
        const protocol = (process.env.protocol || "http://");
        const host = (process.env.host || "juan8a.local");
        const port = (process.env.PORT || "8762");
        */
       const host = "http://juan8a.local:8762"
        var mailOptions = {
            from: 'juanignacio8ag@gmail.com',
            to: email,
            subject: 'PRUEBA Correo de activacion de Top Express',
            text: 'Bienvenido a top express',
            html: `<h1>
              TopExpress
            </h1>
            <p>
              Bienvenido a top express para activar su cuenta porfavor dele click al siguiente link 
                <a href="${host}/activate/client/${idClient}/${confirmationString}">www.topexpress.com.mx/activate/client/${idClient}/${confirmationString}</a>
              <br/>
              si no reconoces este servicio porfavor ignora este correo
            </p>`
        }
        transporter.sendMail(mailOptions, function(error, info) {
          if(error){
            console.log("Email error: " + error)
          } else {
            console.log("Email sent: " + email + " " + info.response)
          }
        })
    }

}
  

async function processClient(body){
    try {
        const confirmationString = makeid(50)
        if(body.admin && body.newClient){
            var mysqlTimestamp = moment(Date.now());
            const {username, password, name, lastname, email, mothermaidenname, phone, idStatus} = body.clients[0]
            const values = [username, password, name, lastname, email, mothermaidenname, phone, idStatus, mysqlTimestamp, null, mysqlTimestamp, mysqlTimestamp]
            const results = await client.query(
                `INSERT INTO public."clients" 
                (username, password, name, lastname, email, mothermaidenname, phone, id_status, confirmation_string_date, confirmation_date, created_timestamp, updated_timestamp)
                values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`, values)
            delete results.rows[0].password
            return status.statusOperation(0, `Procesado Correctamente`, [], {clients: results.rows})
        } else if(body.newClient){
            var mysqlTimestamp = moment(Date.now());
            const {username, password, name, lastname, email, mothermaidenname, phone, idStatus} = body.clients[0]
            const values = [username, password, name, lastname, email, mothermaidenname, phone, idStatus, confirmationString, mysqlTimestamp, null, mysqlTimestamp, mysqlTimestamp]
            const results = await client.query(
                `INSERT INTO public."clients" 
                (username, password, name, lastname, email, mothermaidenname, phone, id_status, confirmation_string, confirmation_string_date, confirmation_date, created_timestamp, updated_timestamp)
                values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`, values)
            //const results = await client.query(`SELECT * FROM public."clients" WHERE username = $1 and password = $2`, [username, password])
            delete results.rows[0].password
            sendMail(email, confirmationString, results.rows[0].id)
            return status.statusOperation(0, `Procesado Correctamente`, [], {clients: results.rows})
        } else {
            var mysqlTimestamp = moment(Date.now());
            const {username, password, name, lastname, email, mothermaidenname, phone, id, idStatus} = body.clients[0]
            if(password != undefined && password != null){
                const values = [username, password, name, lastname, email, mothermaidenname, phone, idStatus, mysqlTimestamp, id]
                await client.query(
                    `UPDATE public.clients
                    SET username=$1, password=$2, name=$3, lastname=$4, email=$5, mothermaidenname=$6, phone=$7, id_status=$8, updated_timestamp=$9
                    WHERE id=$10`, values
                )
            } else {
                const values = [username, name, lastname, email, mothermaidenname, phone, idStatus, mysqlTimestamp, id]
                await client.query(
                    `UPDATE public.clients
                    SET username=$1, name=$2, lastname=$3, email=$4, mothermaidenname=$5, phone=$6, id_status=$7, updated_timestamp=$8
                    WHERE id=$9`, values
                )
            }
            const results = await client.query(`SELECT * FROM public."clients" WHERE id = $1`, [id])
            delete results.rows[0].password
            return status.statusOperation(0, `Procesado Correctamente`, [], {clients: results.rows})
        }
    } catch(e){
        console.error(`TOPEXPRESSERROR: Failed at processClient ${e}`)
        return status.statusOperation(2, `DatabaseOperation Error: `, [e], {clients: []})
    }
}

async function confirmClient(idClient, confirmationString){
    console.log("confirmClient: ", idClient, confirmationString)
    try{
        const clientsRows = await client.query("Select * from public.clients where confirmation_string = $1 and id = $2", [confirmationString, idClient])
        //console.log(clientsRows)
        if(clientsRows && clientsRows.rows && clientsRows.rows[0]){
            var mysqlTimestamp = moment(Date.now());
            const values = [constants.ACTIVO_ID, idClient, mysqlTimestamp, mysqlTimestamp]
            const result = await client.query(
                `UPDATE public.clients
                SET id_status=$1, confirmation_date = $3, updated_timestamp=$4
                WHERE id=$2`, values
            )
            return status.statusOperation(0, `Procesado correctamente`,[], {})
        } else {
            return status.statusOperation(2, `Error`, ["Usuario y/o url no coinciden"], {})
        }
    } catch(e){
        return status.statusOperation(4, `Error al leer el usuario`,e, {})
    }
}

exports.getAllClients = getAllClients
exports.loginClient = loginClient
exports.processClient = processClient
exports.confirmClient = confirmClient