var express = require('express');
var router = express.Router();
const user = require('../database/users/index');
const status = require('../database/status')

router.get('/user/address', async (req, res, next) => {
  console.log(`/user/address/:m1/:m2 ${req.query.user}`)
  //const result = await user.getAllUsers()
  //res.setHeader("content-type", "application/json")
  res.send(result)
});

module.exports = router;
