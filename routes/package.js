var express = require('express');
var router = express.Router();
const client = require('../database/clients/index');
const package = require('../database/package/index');
const statusOperation = require('../database/status')
var multer = require('multer');

const storage = multer.diskStorage({
  
  destination: function(req, file, cb) {
      cb(null, './upload/');
  },

  // By default, multer removes file extensions so let's add them back
  filename: function(req, file, cb) {
    //cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    //cb(null, new Date().toISOString() + file.originalname)
    const s = new Date().toISOString()
    cb(null, req.body.id + s + '.jpeg')
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

router.get('/package/paymentstatus/all', async (req, res, next) => {
  console.log("/package/paymentstatus/all:")
  const result = await package.getAllPaymentStatus()
  res.send(result)
});
  
router.post('/client/package', async (req, res, next) => {
  console.log('/client/package', req.body)
  var result
  if(!req.body.idClient){
    result = statusOperation.statusOperation(0, `Error en datos`, ['el id de usuario es requerido'], { packages: [] })
  } else {
    result = await package.getClientPackages(req.body.idClient)
  }
  res.send(result)
});



router.post('/package/process', async (req, res, next) => {
  console.log('/package/process', req.body)
  //console.log('/package/process', req.body.newPackage)
  const result = await package.processPackage(req.body)
  res.send(result)
});

router.post('/package/process/file', upload.single('file'), async (req, res, next) => {
  console.log('/package/process/file', req.body)
  console.log('/package/process/file', req.file)
  var path = undefined
  if(req.file){
    path = req.file.path
  }
  const id = req.body.id
  const idAddress = req.body.idAddress
  //console.log('/package/process', req.body.newPackage)
  const result = await package.insertFile(id, idAddress, path, req.file)
  res.send(result)
});

router.post('/packages/find', async (req, res, next) => {
  console.log('/package/find')

  const result = await package.findPackages()
  res.send(result)
})

module.exports = router;
