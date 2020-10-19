var createError = require('http-errors');
var express = require('express');
//var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require("body-parser");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var addressRouter = require('./routes/address');
const client = require('./database/server')
const app = express();

// view engine setup

app.use(bodyParser.urlencoded({ extended: false }));
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
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/', addressRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
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