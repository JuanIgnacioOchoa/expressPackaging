var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({ a: '1' })
});

router.post('/landing/message', function(req, res, nex){
  console.log("landing: ", req.body)
  res.send('a')
})

module.exports = router;
