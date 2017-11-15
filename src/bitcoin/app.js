var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var bitcoinapi = require('bitcoin-node-api');
var express = require('express');
var app = express();
 
//Username and password relate to those set in the bitcoin.conf file 

var wallet = {
  host: 'localhost',
  port: 18332,
  user: 'thisistherpcusername',
  pass: 'thisismyrpcpassword'
};

wallet.host = process.env.WALLET_HOST || wallet.host;
wallet.port = process.env.WALLET_PORT || wallet.port;
wallet.user = process.env.WALLET_USER || wallet.user;
wallet.pass = process.env.WALLET_PASS || wallet.pass;

bitcoinapi.setWalletDetails(wallet);
bitcoinapi.setAccess('default-safe'); //Access control 

app.use('/bitcoin/api', bitcoinapi.app); //Bind the middleware to any chosen url 


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;

