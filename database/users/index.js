const client = require('../server')
const status = require('../status')
const moment = require('moment')
const nodemailer = require('nodemailer');
let aws = require('aws-sdk');
const constants = require('../../constants')

async function getAllUsers(){
    console.log('getAllUser')
    try{
        const results = await client.query('SELECT * FROM public."users"')
        console.log('Query succeed')
        return status.statusOperation(0, `Procesado Correctamente`, [], { users: results.rows })
    } catch(e){
        console.error(`TOPEXPRESSERROR: Failed at getAllUsers ${e}`)
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
        console.error(`TOPEXPRESSERROR: Failed at loginUser ${e}`)
        return status.statusOperation(2, `DatabaseOperation Error: `, [e], {users: []})
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

function sendMail(email, confirmationString, idUser){
    aws.config.update({region:'us-east-2'});
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        SES: new aws.SES({
            apiVersion: '2010-12-01'
        }),
        auth: {
            user: 'dev8ag@gmail.com',
            pass: 'Jiog040719'    
        }
    });
    const protocol = (process.env.protocol || "http://");
    const host = (process.env.host || "juan8a.local");
    const port = (process.env.PORT || "8762");
    var mailOptions = {
        from: 'dev8ag@gmail.com',
        to: email,
        subject: 'Correo de activacion de Top Express',
        text: 'Bienvenido a top express',
        html: `<h1>
          TopExpress
        </h1>
        <p>
          Bienvenido a top express para activar su cuenta porfavor dele click al siguiente link 
            <a href="${protocol}${host}:${port}/activate/user/${idUser}/${confirmationString}">www.topexpress.com.mx/activate/user/${idUser}/${confirmationString}</a>
          <br/>
          si no reconoces este servicio porfavor ignora este correo
        </p>`
    }
    transporter.sendMail(mailOptions, function(error, info) {
      if(error){
        console.log("Email error: " + error)
      } else {
        console.log("Email sent: " + info.response)
      }
    })
  }
  

async function processUser(body){
    try {
        const confirmationString = makeid(50)
        if(body.newUser){
            var mysqlTimestamp = moment(Date.now());
            const {username, password, name, lastname, email, mothermaidenname, phone, idStatus} = body.users[0]
            const values = [username, password, name, lastname, email, mothermaidenname, phone, idStatus, confirmationString, mysqlTimestamp, null, mysqlTimestamp, mysqlTimestamp]
            console.log("Values: ", values)
            const results = await client.query(
                `INSERT INTO public."users" 
                (username, password, name, lastname, email, mothermaidenname, phone, id_status, confirmation_string, confirmation_string_date, confirmation_date, created_timestamp, updated_timestamp)
                values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`, values)
            //const results = await client.query(`SELECT * FROM public."users" WHERE username = $1 and password = $2`, [username, password])
            delete results.rows[0].password
            sendMail(email, confirmationString, results.rows[0].id)
            return status.statusOperation(0, `Procesado Correctamente`, [], {users: results.rows})
        } else {
            const {username, password, name, lastname, email, mothermaidenname, phone, id, idStatus} = body.users[0]
            const values = [username, password, name, lastname, email, mothermaidenname, phone, idStatus, id]
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
        console.error(`TOPEXPRESSERROR: Failed at processUser ${e}`)
        return status.statusOperation(2, `DatabaseOperation Error: `, [e], {users: []})
    }
}

async function confirmUser(idUser, confirmationString){
    console.log("confirmUser: ", idUser, confirmationString)
    try{
        const usersRows = await client.query("Select * from public.users where confirmation_string = $1 and id = $2", [confirmationString, idUser])
        //console.log(usersRows)
        if(usersRows && usersRows.rows && usersRows.rows[0]){
            var mysqlTimestamp = moment(Date.now());
            const values = [constants.ACTIVO_ID, idUser, mysqlTimestamp, mysqlTimestamp]
            const result = await client.query(
                `UPDATE public.users
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

exports.getAllUsers = getAllUsers
exports.loginUser = loginUser
exports.processUser = processUser
exports.confirmUser = confirmUser