const client = require('../server')
const status = require('../status')
const moment = require('moment')
const constants = require('../../constants')
const supplier = require('../supplier/index')
const nodemailer = require('nodemailer');
let aws = require('aws-sdk');


function sendMailWithAws(mailOptions, email){
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
    const host = "http://topexpressqa-env.eba-dcnvmavd.us-east-2.elasticbeanstalk.com"
    
    transporter.sendMail(mailOptions, function(error, info) {
        if(error != null){
            console.log("Email error: " + error)
        } else {
            console.log("Email sent: " + email + " " + info.response)
        }
    })
}

function sendLocalMail(mailOptions, email){
    //aws.config.update({region:'us-east-2'});
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        //SES: new aws.SES({
        //    apiVersion: '2010-12-01'
        //}),
        auth: {
            user: 'dev8ag@gmail.com',
            pass: 'Jiog040719'    
        }
    });
    const host = "http://topexpressqa-env.eba-dcnvmavd.us-east-2.elasticbeanstalk.com"
    
    transporter.sendMail(mailOptions, function(error, info) {
        if(error != null){
            console.log("Email error: " + error)
        } else {
            console.log("Email sent: " + email + " " + info.response)
        }
    })
}
function sendMail(package, subject){
    const email = 'dev8ag@gmail.com'
    const address = package.address_line_1 + ' ' + package.int_number + ' ' + package.city + ' ' + package.state + ' ' + package.country
        var mailOptions = {
            from: 'dev8ag@gmail.com',
            to: email,
            subject: subject,
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
            `
        }
    if(process.env.host){
        sendMailWithAws(mailOptions, email)
    } else {
        sendLocalMail(mailOptions, email)
    }
}

function sendMailWithImage(package, subject, file){
    const email = 'dev8ag@gmail.com'
    const address = package.address_line_1 + ' ' + package.int_number + ' ' + package.city + ' ' + package.state + ' ' + package.country
    var mailOptions = {
        from: 'dev8ag@gmail.com',
        to: email,
        subject: subject,
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
        const results = await client.query('SELECT * FROM public."package_status"')
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
    console.log("processPackage: ", body)
    const package = body.packages[0]
    try {
        if(package.idSupplier == undefined){
            const newSupplier = await supplier.insertSupplier(package.supplierName)
            console.log("New Supplier: ", newSupplier.data.suppliers[0].id)
            if(newSupplier.statusOperation.code == 0){
                package.idSupplier = newSupplier.data.suppliers[0].id
            } else {
                return status.statusOperation(2, `Error en provvedor Error: `, ['El proveedor no existia y hubo un error al crearlo'], {packages: []})
            }
        }
        if(body.newPackage){
            
            var mysqlTimestamp = moment(Date.now());
            const {idSupplier, idClient, idAddress, referenceNumber, description, quantity, totalCost, shipCost, packageCost, idStatus, currency} = package
            const values = [idSupplier, idClient, idAddress, referenceNumber, description, quantity, totalCost, shipCost, packageCost, idStatus, currency, mysqlTimestamp, mysqlTimestamp]
            console.log("Values: ", values)
            const results = await client.query(
                `INSERT INTO public."package" 
                (id_supplier, id_client, id_address, reference_number, description, quantity, total_cost, shipping_cost, package_cost, id_status, currency, created_timestamp, updated_timestamp)
                values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`, values)
            //console.log(results.rows[0])
            //console.log(results)
            const resultSend = await client.query(
                `
                    SELECT p.*, c.name as client_name, c.lastname, c.email, c.phone, s.name as supplier_name, a.address_line_1, a.int_number, a.city, a.state, a.country
                    FROM
                        public."package" as p, public."clients" as c, public."suppliers" as s, public."address" as a
                    WHERE p.id = $1 and p.id_client = c.id and p.id_supplier = s.id and a.id = $2
                `, [results.rows[0].id, idAddress])
            sendMail(resultSend.rows[0], "Top Express: Nuevo Paquete")
            return status.statusOperation(0, `Procesado Correctamente`, [], { packages: results.rows})
        } else {
            const {username, password, name, lastname, email, mothermaidenname, phone, id, idStatus} = body.clients[0]
            const values = [username, password, name, lastname, email, mothermaidenname, phone, idStatus, id]
            await client.query(
                `UPDATE public.clients
                SET username=$1, password=$2, name=$3, lastname=$4, email=$5, mothermaidenname=$6, phone=$7, id_status=$8
                WHERE id=$9`, values
            )
            const results = await client.query(`SELECT * FROM public."package" WHERE username = $1 and password = $2`, [username, password])
            delete results.rows[0].password
            return status.statusOperation(0, `Procesado Correctamente`, [], {packages: results.rows})
            
        }
    } catch(e){
        
        console.error(`TOPEXPRESSERROR: Failed at processPackage ${e}`)
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
        
        console.error(`TOPEXPRESSERROR: Failed at processPackage ${e}`)
        return status.statusOperation(2, `DatabaseOperation Error: `, [e], {packages: []})
        
    }

}

async function findPackages(body){
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
        
        console.error(`TOPEXPRESSERROR: Failed at processPackage ${e}`)
        return status.statusOperation(2, `DatabaseOperation Error: `, [e], {packages: []})
        
    }
}
exports.getAllPackageStatus = getAllPackageStatus
exports.getClientPackages = getClientPackages
exports.processPackage = processPackage
exports.findPackages = findPackages
exports.insertFile = insertFile
