var createError   = require('http-errors');
var express       = require('express');
var path          = require('path');
var cookieParser  = require('cookie-parser');
var logger        = require('morgan');
const hbs         = require('hbs');
const cors        = require('cors');
require('./app_api/models/db');
require('dotenv').config();

var passport = require('passport');
require('./app_api/config/passport');

// --- Routers ---
const indexRouter  = require('./app_server/routes/index');
const travelRouter = require('./app_server/routes/travel');
const apiRouter    = require('./app_api/routes');

const app = express();

// =====================
// View engine setup
// =====================
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.locals.layout = 'layouts/layout';
hbs.registerPartials(path.join(__dirname, 'app_server', 'views', 'partials'));

// =====================
// Middleware
// =====================
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

// =====================
// CORS for API
// =====================
app.use('/api', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

// =====================
// Routes
// =====================
app.use('/', indexRouter);
app.use('/travel', travelRouter);
app.use('/api', apiRouter);

// =====================
// Errors
// =====================
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ "message": err.name + ": " + err.message });
  }
});


app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error   = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
