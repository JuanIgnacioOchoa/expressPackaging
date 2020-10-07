var express = require('express');
var router = express.Router();
const user = require('../database/users/index');
const status = require('../database/status')
/* GET home page. */
router.post('/user/login', async function(req, res, next) {
  console.log('/user/login')
  const { username, password } = req.body
  const error = []
  var response;
  var statusOperationCode = 0
  console.log('/user/login1')
  if(username === undefined){
    error.push(" *** Missing username *** ")
    returnError = true
    statusOperationCode = 1
  }
  console.log('/user/login2')
  if(password === undefined){
    error.push(" *** Missing password *** ")
    statusOperationCode = 1
  }
  console.log('/user/login3')
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
  //res.setHeader("content-type", "application/json")
  res.send(result)
});

module.exports = router;
