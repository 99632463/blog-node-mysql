var express = require('express');
const mysql = require('../../config/db');
var router = express.Router();

router.get('/add',function(req,res){
  res.render('admin/admin/add');
})

router.post('/add',function(req,res){
  const {username,password,confirmPassword,status} = req.body;

  if(!username || !password || !confirmPassword || !status){
    res.send('<script>alert("不能有为空的内容！");history.go(-1)</script>');
  }
  else if(password === confirmPassword){
    mysql.query('select * from admin where username = ?',[username],function(err,data){
      if(err) return err;
      if(data.length){
        res.send('<script>alert("该用户已注册！");history.go(-1)</script>');
      }
      else{
        mysql.query('insert into admin(username,password,status) values(?,?,?)',[username,password,status],function(err){
          if(err) {
            res.send('<script>alert("添加失败！");history.go(-1)</script>');
          }
          res.send('<script>alert("添加成功！");location.href="/admin/admin/list"</script>');
        })
      }
    })
  }
  else{
    res.send('<script>alert("重复密码与原始密码不一致！");history.go(-1)</script>');
  }
})

router.get('/list',function(req,res){
  var searchContent = req.query.search || "";

  mysql.query('select * from admin where username like ? order by id desc',[`%${searchContent}%`],function(err,data){
    if(err) return err;
    res.render('admin/admin/list',{data,searchContent});
  });
});

router.get('/updateStatus',function(req,res){
  const {id,status} = req.query;

  mysql.query('update admin set status = ? where id = ?',[status,id],function(err){
    if(err){
      res.send("0");
      return;
    }
    res.send("1");
  });
})

router.get('/delete',function(req,res){
  const {id} = req.query;

  mysql.query(`delete from admin where id = ${id}`,function(err,data){
    if(err){
      res.send('0');
    }
    else{
      res.send('1');
    }
  })
})

router.get('/edit',function(req,res){
  const {id} = req.query;
  
  mysql.query(`select * from admin where id = ${id}`,function(err,data){
    if(err) return err;
    res.render('admin/admin/edit',{data:data[0]})
  })
})

router.post('/edit',function(req,res){
  const {id,password,status} = req.body;

  let sql = '';
  if(password){
    sql = `update admin set status = ${status},password = '${password}' where id = ${id}`;
  }
  else{
    sql = `update admin set status = ${status} where id = ${id}`;
  }

  mysql.query(sql,function(err){
    if(err){
      console.log(err);
      res.send('<script>alert("update error");history.go(-1)</script>');
    }
    else{
      res.send('<script>alert("update success");location.href="/admin/admin/list"</script>');
    }
  })
})

module.exports = router;