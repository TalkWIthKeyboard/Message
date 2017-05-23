const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api-router');
const h5Router = require('./routes/h5-router');
const middle = require('./builder/middleBuilder');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
let app = express();

mongoose.connect('mongodb://localhost:27017/Message');

// 1. 指明视图资源的位置，引入视图模板
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// 2.
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

// 3. 添加cookie和session的支持
app.use(cookieParser());
app.use(session({
  secret: 'This is Message from TalkWithKeyboard!',
  name: 'Message',
  cookie: {maxAge: 80000},
  resave: false,
  saveUninitialized: true
}));

// 4. 添加中间件和路由
app.use(middle.checkHandler());
app.use('/api', apiRouter);
app.use('/h5', h5Router);
app.use(middle.errorHandler());

module.exports = app;
