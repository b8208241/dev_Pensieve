const express = require('express');
const main = express.Router();

const tracksExecutive = require('./tracks.js');
const broadsExecutive = require('./broads.js');

const srcExecutive = require('./src.js');
const plainExecutive = require('./plain.js');
const singleExecutive = require('./single/single.js');

main.param("id", (req, res, next, id)=>{
  req.reqUnitId = id;
  next();
})

main.use('/:id/track', tracksExecutive)
main.use('/:id/broad', broadsExecutive)

main.use('/:id/src', srcExecutive)
main.use('/:id', singleExecutive)
main.use('/', plainExecutive)


module.exports = main;
