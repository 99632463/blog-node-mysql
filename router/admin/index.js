var express = require('express');
var router = express.Router();
var admin = require('./admin');
var banner = require('./banner');
var settings = require('./settings');
var newstype = require('./newstype');
var news = require('./news');
const mysql = require('../../config/db');

router.use(function(req,res,next){
  if(req.url === '/login' || req.url === '/check'){
    next();
  }
  else{
    if(req.session.isAdmin && req.session.username){
      next();
    }
  }
});

router.get('/login',function(req,res){
  res.render('admin/login');
})

router.post('/check',function(req,res){
  const {username,password} = req.body;
  const sql = 'select * from admin where username = ? and password = ?';
  const arr = [username,password];

  mysql.query(sql,arr,function(err,data){
    if(err) throw err;

    if(data.length){
      req.session.isAdmin = true;
      req.session.username = data[0].username;
      res.send('<script>alert("login success");location.href="/admin/admin/list"</script>');
    }
    else{
      res.send('<script>alert("Incorrect username or password,please login again!");history.go(-1)</script>');
    }
  })
})

router.get('/logout',function(req,res){
  req.session.isAdmin = false;
  req.session.username = '';
  res.send('<script>location.href = "/admin/login"</script>');
})

router.use('/admin',admin);
router.use('/banner',banner);
router.use('/settings',settings);
router.use('/newstype',newstype);
router.use('/news',news);

module.exports = router;