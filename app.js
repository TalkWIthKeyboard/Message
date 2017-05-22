const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api-router');
const h5Router = require('./routes/h5-router');
const middle = require('./builder/middleBuilder');
const mongoose = require('mongoose');
let app = express();

mongoose.connect('mongodb://localhost:27017/Message');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

// app.use(middle.tokenHandler());
app.use('/api', apiRouter);
// app.use('/h5', h5Router);
// app.use(middle.errorHandler());

module.exports = app;
