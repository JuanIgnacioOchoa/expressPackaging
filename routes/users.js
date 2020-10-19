var express = require('express');
var router = express.Router();
const user = require('../database/users/index');
const status = require('../database/status')

const nodemailer = require('nodemailer');

/* GET home page. */
router.post('/user/login', async function(req, res, next) {
  
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
    response = status.statusOperation(statusOperationCode, `Error en los datos: `, error, {user: []})
  } else {
    response = await user.loginUser(req.body.username, req.body.password)
  }
  console.log("Response: ", response)
  res.send(response)
});

router.post('/user/process', async function(req, res, next) {
  var response = await user.processUser(req.body)
  console.log("Response: ", response)
  res.send(response)
})

router.get('/user/all', async (req, res, next) => {
  console.log("/user/all:")
  const result = await user.getAllUsers()
  res.send(result)
});


router.get('/activate/user/:value/:security', async (req, res, next) => {
  console.log("Act: ", req.params)
  try{
    const result = await user.confirmUser(req.params.value, req.params.security)
    console.log("Result: ", result)
    res.send(result)
  } catch(e){
    console.error("TOPEXPRESSERROR: " + e)
  }
  
});

module.exports = router;
