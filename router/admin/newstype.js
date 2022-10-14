var express = require('express');
var router = express.Router();
const mysql = require('../../config/db');

router.get('/list',function(req,res){
  mysql.query('select * from newstype order by id desc',function(err,data){
    if(err) throw err;
    res.render('admin/newstype/list',{data});
  })
})

router.get('/add',function(req,res){
  res.render('admin/newstype/add');
})

router.post('/add',function(req,res){
  const {name,keywords,description,sort} = req.body;

  mysql.query('insert into newstype(name,keywords,description,sort) values(?,?,?,?)',[name,keywords,description,sort],function(err){
    if(err) return err;

    res.send('<script>alert("add success");location.href="/admin/newstype/list"</script>');
  })
})

router.get('/changeSort',function(req,res){
  const {id,sort} = req.query;

  mysql.query('update newstype set sort = ? where id = ?',[sort,id],function(err){
    if(err) throw err;
    res.send('1');
  })
})

module.exports = router;