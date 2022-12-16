/* eslint-disable no-console */
const express = require('express');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('morgan');
const {openapiDocs} = require('../docs/swagger')

var helloRoutes = require('./routes/hello')
var reportsRoutes = require('./routes/reports');
var ticketsRoutes = require('./routes/tickets');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(cors());
app.use(compression());

app.use('/', helloRoutes);
app.use('/support/v1/reports', reportsRoutes);
app.use('/support/v1/tickets', ticketsRoutes);
openapiDocs(app);

// setup mongodb
const mongoose = require('mongoose');
const DB_URL = (process.env.DB_URL || 'mongodb://localhost/test');

mongoose.connect(DB_URL);
const db = mongoose.connection;

// recover from errors
db.on('error', console.error.bind(console, 'db connection error'));

module.exports = app;
