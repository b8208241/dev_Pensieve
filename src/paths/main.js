const express = require('express');
const main = express.Router();
const winston = require('../../config/winston.js');
const {
  _handle_ErrCatched,
  authorizedError,
} = require('../utils/reserrHandler.js');

const accumulatedExecutive = require('./accumulated.js');
const basicInfoExecutive = require('./basicInfo.js');

/*
  Notice! Check First!
*/
main.use(function(req, res, next) {
  if(process.env.NODE_ENV == 'development') winston.verbose('middleware: permission check at path /paths. ');

  let tokenify = req.extra.tokenify;
  //deal the situation if the token did not pass the check in last step
  if(!tokenify){
    let pathSplice = req.path.match(/\/(.*?)\//);
    //would always return the '1st' of '/.../', and now the .path() would be path 'after' /paths/
    let secondPath = pathSplice[1] ; // pathSplice should be e.g "[/numerous/,numerous, ...]"
    /*
    ref:
    stackoverflow: https://stackoverflow.com/questions/5642315/regular-expression-to-get-a-string-between-two-strings-in-javascript/40782646
    RegExp.exec(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec
    */
    /*
    // than, any api needed a token should list here
    const noTokenHandler = ()=>{
      let message = `res code 401: missing token if you want to req this resource, to route "${req.originalUrl}".`;
      _handle_ErrCatched(new authorizedError(message, 89), req, res);
    }
    switch (secondPath) {
      case 'numerous':
        noTokenHandler();
        break;
      default:
        next()
    }
    */
    next() // temp method, before any api needed a token
  }
  //or if there is token, we just go next
  else next();
})

//then other middleware after the permission check

// path do not need a token
main.use('/accumulated', accumulatedExecutive)
main.use('/basic', basicInfoExecutive)

module.exports = main;
