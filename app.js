var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const methodOverride = require('method-override') // untuk menghandle put
const session = require('express-session');
const flash = require('connect-flash');
var app = express();

// untuk handle siapa sja yang dapat mengakses API kita
app.use((req, res, next)=>{
  res.setHeader('Access-Control-Allow-Origin','*') // Origin = url yang ingin di berikan akses API 
  res.setHeader('Access-Control-Allow-Methods','GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS') // method = method dalam penggunaan API 
  //res.setHeader('Access-Control-Allow-Headers','Content-Type , Authorization') // Content-Type = contohnya json, (xml, html?) dll. // Authorization = berguna ketika proses pengiriman token kedalam API
//  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
 res.setHeader('Access-Control-Allow-Headers', '*');
//  res.setHeader('Content-Type', 'multipart/form-data');
 next(); // agar requestnya tidak berhenti sampai disitu
})

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin,X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,PUT,DELETE,OPTIONS");
//   next();
// });


//import mongoose
const mongoose = require('mongoose');
// mongoose.connect('mongodb://127.0.0.1:27017/db_staycation',
mongoose.connect('mongodb+srv://mern-stayction:YjL12suUWmoczy8p@cluster0.mdbpoal.mongodb.net/db_staycation?retryWrites=true&w=majority',
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true
});
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//router admin
const adminRouter = require('./routes/admin')
const apiRouter = require('./routes/api')


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge : 60000}
}))
app.use(flash())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/sb-admin-2', express.static(path.join(__dirname, 'node_modules/startbootstrap-sb-admin-2'))); // untuk mengarahkan ke path direktori sb-admin-2

app.use('/', indexRouter);
app.use('/users', usersRouter);

//admin
app.use('/admin', adminRouter)
//api
app.use('/api/v1/member', apiRouter)


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

module.exports = app;
