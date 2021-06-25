const express = require('express');
const main = express.Router();

const indexExecutive = require('./index.js');
const listExecutive = require('./list.js');

main.use('/list', listExecutive)

main.use('/index', indexExecutive)


module.exports = main;
