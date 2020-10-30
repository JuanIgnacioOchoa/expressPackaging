var express = require('express');
var router = express.Router();
const user = require('../database/users/index');
const package = require('../database/package/index');
const statusOperation = require('../database/status')
var multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, './upload/');
  },

  // By default, multer removes file extensions so let's add them back
  filename: function(req, file, cb) {

    console.log('storage');
    //cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    //cb(null, new Date().toISOString() + file.originalname)
    cb(null, 'abcd.jpeg')
  }
});

const fileFilter = (req, file, cb) => {
  console.log('1', file);
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

var upload = multer({
  dest: 'uploads/',
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
    fieldSize: 25 * 1024 * 1024
  },
  fileFilter: fileFilter
})

router.get('/package/status/all', async (req, res, next) => {
    console.log("/package/status/all:")
    const result = await package.getAllPackageStatus()
    res.send(result)
});
  
router.post('/user/package', async (req, res, next) => {
  console.log('/user/package', req.body)
  var result
  if(!req.body.idUser){
    result = statusOperation.statusOperation(0, `Error en datos`, ['el id de usuario es requerido'], { packages: [] })
  } else {
    result = await package.getUserPackages(req.body.idUser)
  }
  res.send(result)
});



router.post('/package/process', upload.single('file'), async (req, res, next) => {
  console.log('/package/process', req.body)
  console.log('/package/process', req.file)
  console.log('/package/process', req.body.file)
  //console.log('/package/process', req.body.newPackage)
  const result = await package.processPackage(req.body)
  res.send(result)
});


module.exports = router;
