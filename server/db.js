// setup mongodb
const mongoose = require('mongoose');
const DB_URL = (process.env.DB_URL || 'mongodb://localhost/test');

mongoose.connect(DB_URL);
const db = mongoose.connection;

// recover from errors
db.on('error', console.error.bind(console, 'db connection error'));

module.exports = db;