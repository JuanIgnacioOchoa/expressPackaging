var express = require('express');
var router = express.Router();
const supplier = require('../database/supplier/index');

router.get('/suppliers/all', async (req, res, next) => {
  console.log("/suppliers/all:")
  const result = await supplier.getAllSupliers()
  res.send(result)
});


module.exports = router;
