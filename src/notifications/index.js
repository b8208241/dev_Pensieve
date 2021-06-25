const express = require('express');
const execute = express.Router();
const winston = require('../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_notiRealTime = require('../../db/models/index').notifications_realtime;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  notFoundError
} = require('../utils/reserrHandler.js');

async function _handle_GET_notifications_Index(req, res){
  const userId = req.extra.tokenUserId; //use userId passed from pass.js

  try{

    let sendingData={

      temp: {}
    };


    _res_success(res, sendingData, "GET: /notifications/index, complete.");
  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return;
  }

}

execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /notifications/index ');
  _handle_GET_notifications_Index(req, res);
})

module.exports = execute;
