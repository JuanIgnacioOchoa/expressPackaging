var express = require('express');
var router = express.Router();
const client = require('../database/clients/index');
const status = require('../database/status')

const nodemailer = require('nodemailer');

/* GET home page. */
router.post('/client/login', async function(req, res, next) {
  
  const { username, password } = req.body
  console.log(`${username} ${password}`)
  const error = []
  var response;
  var statusOperationCode = 0
  if(username === undefined){
    error.push(" *** Missing username *** ")
    returnError = true
    statusOperationCode = 1
  }
  if(password === undefined){
    error.push(" *** Missing password *** ")
    statusOperationCode = 1
  }
  if(statusOperationCode === 1){
    response = status.statusOperation(statusOperationCode, `Error en los datos: `, error, {client: []})
  } else {
    response = await client.loginClient(req.body.username, req.body.password)
  }
  console.log("Response: ", response)
  res.send(response)
});

router.post('/client/process', async function(req, res, next) {
  var response = await client.processClient(req.body)
  console.log("Response: ", response)
  res.send(response)
})

router.get('/client/all', async (req, res, next) => {
  console.log("/client/all:")
  const result = await client.getAllClients()
  res.send(result)
});


router.get('/activate/client/:value/:security', async (req, res, next) => {
  console.log("Act: ", req.params)
  try{
    const result = await client.confirmClient(req.params.value, req.params.security)
    console.log("Result: ", result)
    res.send(result)
  } catch(e){
    console.error("TOPEXPRESSERROR: " + e)
  }
  
});

module.exports = router;
