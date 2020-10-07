var createError = require('http-errors');
var express = require('express');
//var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require("body-parser");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const client = require('./database/server')
const app = express();

// view engine setup

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  console.log("Header Security: ")
  console.log(req.get('authorization'))
  //console.log(req.headers)
  console.log(req.headers.authorization)
  if(!req.get('authorization')){
    return res.status(403).json({ error: 'authentication needed' });
  } else if(req.get('authorization') !== 'Basic dG9wZXhwcmVzczpramFvaXNkdTA5MW4yLG05eHUwOTEyM2w='){
    return res.status(401).json({ error: 'Invalid credentials.'})
  }

  next();
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/', usersRouter);


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

console.log("Port2: ", process.env.PORT)
module.exports = app;
