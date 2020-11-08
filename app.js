var createError = require('http-errors');
var express = require('express');
//var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require("body-parser");
var multer = require('multer');
var upload = multer();
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var addressRouter = require('./routes/address');
var statusRouter = require('./routes/status');
var packageRouter = require('./routes/package');
var suppliersRouter = require('./routes/suppliers');
const app = express();

const status = require('./database/status')
// view engine setup

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  if(req.path.startsWith('/activate/user/')){
    next();
  } else if(!req.get('authorization')){
    return res.status(403).json({ error: 'authentication needed' });
  } else if(req.get('authorization') !== 'Basic dG9wZXhwcmVzczpramFvaXNkdTA5MW4yLG05eHUwOTEyM2w='){
    return res.status(401).json({ error: 'Invalid credentials.'})
  } else {
    next();
  }
});


app.use(logger('dev'));
app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//app.use(upload.array()); 
app.use(express.static('public'));

app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/', addressRouter);
app.use('/', statusRouter);
app.use('/', packageRouter);
app.use('/', suppliersRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log("Error::::", err.message)
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.send(status.statusOperation(5, 'Error en el endpoiint', [err.message], []))
});

var port = normalizePort(process.env.PORT || '8762');
app.listen(port, () => {
  console.log("Wazzaaaaaaaa")
})
module.exports = app;

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}