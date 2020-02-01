var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var md5 = require('md5');

router.get('/', function(req, res, next) {
  res.render('barcodeGen');
});



module.exports = router;
