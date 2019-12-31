var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var md5 = require('md5');
// var con = mysql.createPool({
//   connectionLimit: 10,
//   host: '119.59.116.183',
//   user: 'username',
//   password: 'Gun11092544#',
//   database: 'inventory'
// })

// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
// });

router.get('/', function(req, res, next) {
  if(req.query.auth === '0'){
    res.render('index', { authMsg: 'รหัสผ่านไม่ถูกต้อง \n ลองใหม่อีกครั้ง' });
  }else{
    res.render('index',{ authMsg:''} );
  }
  
  console.log("index page has been called.")
});
router.get('/error', function(req, res, next) {
  res.render('error',{message:'user or password is not correct'})
  console.log("index page has been called.")
});
router.post('/auth', function (req, res) {
  const user = req.body.user
  const pass = req.body.pass
  if(user === 'admin' && pass === 'admin'){
    console.log(user,pass)
    var hash = md5(user+pass);
    //res.redirect
    res.redirect('/pos?token='+hash);
  }else{
    res.redirect('/?auth=0');
  }
  
})


module.exports = router;
