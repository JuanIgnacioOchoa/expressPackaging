var express = require('express');
var router = express.Router();
const address = require('../database/address/index');
const status = require('../database/status')

router.post('/client/address/process', async function(req, res, next) {
  console.log('insertNewAddress: ', req.body)
  //console.log('insertNewAddress: ', req)

  var response = await address.insertNewAddress(req.body)
  console.log("Response: ", response)
  res.send(response)
})

module.exports = router;
