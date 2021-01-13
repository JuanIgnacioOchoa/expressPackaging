const client = require('../server')
const status = require('../status')
const moment = require('moment')
const constants = require('../../constants')
const supplier = require('../supplier/index')
const nodemailer = require('nodemailer');
const fs = require('fs')
let aws = require('aws-sdk');


function sendMailWithAws(mailOptions, email){
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
    const host = "http://topexpressqa-env.eba-dcnvmavd.us-east-2.elasticbeanstalk.com"
    
    transporter.sendMail(mailOptions, function(error, info) {
        if(error != null){
            console.log("Email error 1: " + error)
        } else {
            console.log("Email sent: " + email + " " + info.response)
        }
    })
}

function sendLocalMail(mailOptions, email){
    //aws.config.update({region:'us-east-2'});
    var transporter = nodemailer.createTransport({
        service: "Gmail",
        host: 'smtp.gmail.com',
        auth: {
            user: 'juanignacio8ag@gmail.com',
            pass: 'Jiog693082'    
        }
    });
    const host = "http://topexpressqa-env.eba-dcnvmavd.us-east-2.elasticbeanstalk.com"
    
    transporter.sendMail(mailOptions, function(error, info) {
        if(error != null){
            console.log("Email error: 2" + email + " " + error)
        } else {
            console.log("Email sent: " + email + " " + info.response)
        }
    })
}
function sendMail(package, subject, images){
    var email = 'topexpressgdl@hotmail.com'
    var subjectTmp = subject
    if(!process.env.host){
        subjectTmp = "PRUEBA: " + subject
        email = 'juanignacio8ag@gmail.com'
    } 
    const attachmentsImg = []
    for(var i in images){
        console.log("base", images[i].name)
        attachmentsImg.push(
            {   // encoded string as an attachment
                filename: 'imagen'+i+'.jpeg',
                content: images[i].base64,
                encoding: 'base64'
            }
        )
    }
    const address = package.address_line_1 + ' ' + package.int_number + ' ' + package.city + ' ' + package.state + ' ' + package.country
        var mailOptions = {
            from: email,
            to: email,
            subject: subjectTmp,
            html: `<h1>
            TopExpress
            </h1>
            <p>
                Nuevo Paquete Recibido:
            </p>
            <p>
                Cliente: ${package.client_name + " " + package.lastname}<br/>
                Email: ${package.email}<br/>
                Telefono: ${package.phone}<br/>
                Proveedor: ${package.supplier_name}<br/>
                Direccion: ${address}<br/>
                No. De referencia: ${package.reference_number}<br/>
                Description: ${package.description}<br/>
                quantity: ${package.quantity}<br/>
                package_cost: ${package.package_cost}<br/>
                shipping_cost: ${package.shipping_cost}<br/>
                currency: ${package.currency}<br/>
                created_timestamp: ${package.created_timestamp}<br/>
            </p>
            `,
            attachments: attachmentsImg
        }
    if(process.env.host){
        sendMailWithAws(mailOptions, email)
    } else {
        sendLocalMail(mailOptions, email)
    }
}

function sendMailWithImage(package, subject, file){
    var email = 'topexpressgdl@hotmail.com'
    const address = package.address_line_1 + ' ' + package.int_number + ' ' + package.city + ' ' + package.state + ' ' + package.country
    var subjectTmp = subject
    if(!process.env.host){
        subjectTmp = "PRUEBA: " + subject
        email = 'juanignacio8ag@gmail.com'
    } 
    var mailOptions = {
        from: email,
        to: email,
        subject: subjectTmp,
        html: `<h1>
            TopExpress
        </h1>
        <p>
            Nuevo Paquete Recibido:
        </p>
        <p>
            Cliente: ${package.client_name + " " + package.lastname}<br/>
            Email: ${package.email}<br/>
            Telefono: ${package.phone}<br/>
            Proveedor: ${package.supplier_name}<br/>
            Direccion: ${address}<br/>
            No. De referencia: ${package.reference_number}<br/>
            Description: ${package.description}<br/>
            quantity: ${package.quantity}<br/>
            package_cost: ${package.package_cost}<br/>
            shipping_cost: ${package.shipping_cost}<br/>
            currency: ${package.currency}<br/>
            created_timestamp: ${package.created_timestamp}<br/>
        </p>
        `,
        attachments: [
            {
                filename: 'Receipt.jpeg',
                content: file
            }
        ]
    }
    if(process.env.host){
        sendMailWithAws(mailOptions, email)
    } else {
        sendLocalMail(mailOptions, email)
    }
}

async function getAllPackageStatus(){
    try{
        const results = await client.query('SELECT * FROM public."package_status" where type = 1')
        console.log('Query succeed')
        return status.statusOperation(0, `Procesado Correctamente`, [], { status: results.rows })
    } catch(e){
        console.error(`TOPEXPRESSERROR: Failed at getAllPackageStatus ${e}`)
        return status.statusOperation(2, `DatabaseOperation Error: `, [e], {status: []})
    }
}

async function getAllPaymentStatus(){
    try{
        const results = await client.query('SELECT * FROM public."package_status" where type = 2')
        console.log('Query succeed')
        return status.statusOperation(0, `Procesado Correctamente`, [], { status: results.rows })
    } catch(e){
        console.error(`TOPEXPRESSERROR: Failed at getAllPackageStatus ${e}`)
        return status.statusOperation(2, `DatabaseOperation Error: `, [e], {status: []})
    }
}

async function getClientPackages(idClient){
    try {
        const resultsActive = await client.query(`
        SELECT p.*, s.name as supplier_name, ps.status as status
            from public."package" as p, public."clients" as u, public."suppliers" as s, public."package_status" as ps
                WHERE u.id = p.id_client and s.id = p.id_supplier and ps.id = p.id_status and ps.id <> $1 and u.id = $2`, [constants.ENTREGADO_ID, idClient])
        const resultsDelivered = await client.query(`
        SELECT p.*, s.name as supplier_name, ps.status as status
            from public."package" as p, public."clients" as u, public."suppliers" as s, public."package_status" as ps
                WHERE u.id = p.id_client and s.id = p.id_supplier and ps.id = p.id_status and ps.id = $1 and u.id = $2`, [constants.ENTREGADO_ID, idClient])
        return status.statusOperation(0, `Procesado Correctamente`, [], { packages: { delivered : resultsDelivered.rows, active: resultsActive.rows     } })
    } catch(e){
        console.error(`TOPEXPRESSERROR: Failed at getClientPackages ${e}`)
        return status.statusOperation(2, `DatabaseOperation Error: `, [e], {status: []})
    }
}


async function processPackage(body){
    const package = body.packages[0]
    try {
        if(package.idSupplier == undefined){
            const newSupplier = await supplier.insertSupplier(package.supplierName)
            if(newSupplier.statusOperation.code == 0){
                package.idSupplier = newSupplier.data.suppliers[0].id
            } else {
                return status.statusOperation(2, `Error en provvedor Error: `, ['El proveedor no existia y hubo un error al crearlo'], {packages: []})
            }
        }
        if(body.newPackage){
            
            var mysqlTimestamp = moment(Date.now());
            const {images, idSupplier, idClient, idAddress, referenceNumber, description, quantity, totalCost, shipCost, packageCost, idStatus, currency} = package
            const values = [idSupplier, idClient, idAddress, referenceNumber, description, quantity, totalCost, shipCost, packageCost, idStatus, currency, mysqlTimestamp, mysqlTimestamp]
            
            const results = await client.query(
                `INSERT INTO public."package" 
                (id_supplier, id_client, id_address, reference_number, description, quantity, total_cost, shipping_cost, package_cost, id_status, currency, created_timestamp, updated_timestamp)
                values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`, values)
            //console.log(results.rows[0])
            //console.log(results)
            for(var i in images){
                await client.query(
                    `INSERT INTO public.imagenes(
                        id_package, base64, "fileName")
                        VALUES ($1, $2, $3)`, [results.rows[0].id, images[i].base64, images[i].name])
            }
            const resultSend = await client.query(
                `
                    SELECT p.*, c.name as client_name, c.lastname, c.email, c.phone, s.name as supplier_name, a.address_line_1, a.int_number, a.city, a.state, a.country
                    FROM
                        public."package" as p, public."clients" as c, public."suppliers" as s, public."address" as a
                    WHERE p.id = $1 and p.id_client = c.id and p.id_supplier = s.id and a.id = $2
                `, [results.rows[0].id, idAddress])
            sendMail(resultSend.rows[0], "Top Express: Nuevo Paquete", body.packages[0].images)
            return status.statusOperation(0, `Procesado Correctamente`, [], { packages: results.rows})
        } else {
            var mysqlTimestamp = moment(Date.now());
            const {idSupplier, idClient, idAddress, referenceNumber, description, quantity, totalCost, shipCost, packageCost, idStatus, currency, idPaymentStatus, id} = body.packages[0]
            const values = [idSupplier, idClient, idAddress, referenceNumber, description, quantity, totalCost, shipCost, packageCost, idStatus, currency, idPaymentStatus, mysqlTimestamp, id]
            
            const results = await client.query(
                `UPDATE public."package"
                SET id_supplier=$1, id_client=$2, id_address=$3, reference_number=$4, description=$5, quantity=$6, total_cost=$7, shipping_cost=$8, 
                    package_cost=$9, id_status=$10, currency=$11, id_payment_status=$12, updated_timestamp=$13 
                WHERE id=$14  RETURNING *`, values
            )
            //const results = await client.query(`SELECT * FROM public."package" WHERE username = $1 and password = $2`, [username, password])
            //delete results.rows[0].password
            return status.statusOperation(0, `Procesado Correctamente`, [], {packages: results.rows})
            
        }
    } catch(e){
        
        console.error(`TOPEXPRESSERROR: Failed at processPackage 1 ${e}`)
        return status.statusOperation(2, `DatabaseOperation Error: `, [e], {packages: []})
        
    }
}

async function insertFile(id, idAddress, path, file){
    try {
        const values = [path, id]
        await client.query(
            `UPDATE public."package"
            SET receipt=$1
            WHERE id=$2`, values
        )
        const results = await client.query(`SELECT * FROM public."package" WHERE id = $1`, [id])
        
        const resultSend = await client.query(
            `
                SELECT p.*, c.name as client_name, c.lastname, c.email, c.phone, s.name as supplier_name, a.address_line_1, a.int_number, a.city, a.state, a.country
                FROM
                    public."package" as p, public."clients" as c, public."suppliers" as s, public."address" as a
                WHERE p.id = $1 and p.id_client = c.id and p.id_supplier = s.id and a.id = $2
            `, [results.rows[0].id, idAddress])
        sendMailWithImage(resultSend.rows[0], "Top Express: Nuevo Recibo", file)
        
        return status.statusOperation(0, `Procesado Correctamente`, [], {packages: results.rows})
            
        
    } catch(e){
        
        console.error(`TOPEXPRESSERROR: Failed at processPackage 2 ${e}`)
        return status.statusOperation(2, `DatabaseOperation Error: `, [e], {packages: []})
        
    }

}

async function findPackages(){
    try {
        /*
        if(body.idSupplier == 0){
            const newSupplier = await supplier.insertSupplier(body.supplierName)
            console.log("New Supplier: ", newSupplier.data.suppliers[0].id)
            if(newSupplier.statusOperation.code == 0){
                body.idSupplier = newSupplier.data.suppliers[0].id
            } else {
                return status.statusOperation(2, `Error en provvedor Error: `, ['El proveedor no existia y hubo un error al crearlo'], {packages: []})
            }
        }
        */
        const results = await client.query(`SELECT p.*, c.name, c.lastname, ps.status
        FROM public."package" as p, public."clients" as c, public."package_status" as ps
        WHERE p.id_client = c.id and p.id_status = ps.id`)
        //console.log(results.rows[0])
        //console.log(results)
        return status.statusOperation(0, `Procesado Correctamente`, [], { packages: results.rows})
    } catch(e){
        
        console.error(`TOPEXPRESSERROR: Failed at processPackage 3 ${e}`)
        return status.statusOperation(2, `DatabaseOperation Error: `, [e], {packages: []})
        
    }
}
exports.getAllPackageStatus = getAllPackageStatus
exports.getAllPaymentStatus = getAllPaymentStatus
exports.getClientPackages = getClientPackages
exports.processPackage = processPackage
exports.findPackages = findPackages
exports.insertFile = insertFile
