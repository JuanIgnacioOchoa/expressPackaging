var express = require('express');
var router = express.Router();
const client = require('../database/clients/index');
const status = require('../database/status/index');
const statusOperation = require('../database/status')

router.get('/status/all', async (req, res, next) => {
  console.log("/status/all:")
  const result = await status.getAllStatus()
  res.send(result)
});


module.exports = router;
