var express = require('express');
var router = express.Router();
const user = require('../database/users/index');
const status = require('../database/status')
/* GET home page. */
router.post('/user/login', async function(req, res, next) {
  const { username, password } = req.body
  console.log("Username: ", username)
  console.log("Password: ", password)
  const error = []
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
    res.send(status.statusOperation(statusOperationCode, `Error en los datos: `, error, {user: []}))
  } else {
    const result = await user.loginUser(req.body.username, req.body.password)
    res.send(result)
  }
});

router.post('/user/process', async function(req, res, next) {
  const result = await user.processUser(req.body)
  console.log(result)
  res.send(result)
})

router.get('/user/all', async (req, res, next) => {
  const result = await user.getAllUsers()
  //res.setHeader("content-type", "application/json")
  res.send(result)
});

module.exports = router;
