var express = require('express');
var router = express.Router();
const mysql = require('../../config/db');
const multer = require('multer');
const upload = multer({dest:'tmp/'});
const path = require('path');
const fs = require('fs');

router.get('/add',function(req,res){
  res.render('admin/banner/add');
})

router.post('/add',upload.single('img'),function(req,res){
  const {name,skipUrl,sort} = req.body;
  const tmpPath = req.file.path;
  const originalname = req.file.originalname;

  const newPath = new Date().getTime() + Math.round(Math.random() * 10000) + path.extname(originalname);
  const movePath = `/upload/banner/${newPath}`;

  const fileData = fs.readFileSync(tmpPath);
  fs.writeFileSync(`${__dirname}/../..${movePath}`,fileData);

  mysql.query('insert into banner(name,skipUrl,sort,avatarUrl) values(?,?,?,?)',[name,skipUrl,sort,movePath],function(err){
    if(err){
      res.send('<script>alert("add banner error");history.go(-1)</script>');
    }
    else{
      res.send('<script>alert("add banner success");location.href="/admin/banner/list"</script>');
    }
  });
})

router.get('/list',function(req,res){
  var searchContent = req.query.search || "";

  mysql.query('select count(*) tot from banner where name like ?',[`%${searchContent}%`],function(err,total){
    if(err) return err;

    var page = req.query.page || 1;
    var endLimit = 3;
    const pages = Math.ceil(total[0].tot / endLimit);

    if(page < 1){
      page = Math.max(1,page);
    }
    else{
      page = Math.min(page,pages);
    }

    var startLimit = (page - 1) * endLimit;

    mysql.query('select * from banner where name like ? order by id desc limit ?,?',[`%${searchContent}%`,startLimit,endLimit],function(err,data){
      if(err) return err;

      res.render('admin/banner/list',{
        data,
        page,
        pages,
        searchContent
      });
    })
  });
})

router.get('/delete',function(req,res){
  const {id,img} = req.query;
  
  mysql.query(`delete from banner where id = ${id}`,function(err){
    if(err){
      res.send('0');
    }
    else{
      if(fs.existsSync(`${__dirname}/../..${img}`)){
        fs.unlinkSync(`${__dirname}/../..${img}`)
      }
      res.send('1');
    }
  })
})

router.get('/edit',function(req,res){
  const {id} = req.query;

  mysql.query('select * from banner where id = '+id,function(err,data){
    if(err) return err;
    res.render('admin/banner/edit',{data:data[0]});
  })
})

router.post('/edit',upload.single('img'),function(req,res){
  const {id,name,skipUrl,sort,oldImg} = req.body;
  const imgRes = req.file;

  let sql = '';
  let arr = [];
  if(imgRes){
    var randomPath = new Date().getTime() + Math.round(Math.random() * 10000) + path.extname(imgRes.originalname);
    const newPath = `/upload/banner/${randomPath}`;

    const readFile = fs.readFileSync(imgRes.path);
    fs.writeFileSync(`${__dirname}/../..${newPath}`,readFile);

    sql = 'update banner set name = ?,skipUrl = ?,sort = ?,avatarUrl = ? where id = ?';
    arr = [name,skipUrl,sort,newPath,id];
  }
  else{
    sql = 'update banner set name = ?,skipUrl = ?,sort = ? where id = ?';
    arr = [name,skipUrl,sort,id];
  }

  mysql.query(sql,arr,function(err){
    if(err){
      res.send('<script>alert("update error");history.go(-1)</script>');
    }
    else{
      if(imgRes && fs.existsSync(`${__dirname}/../..${oldImg}`)){
        fs.unlinkSync(`${__dirname}/../..${oldImg}`);
      }
      res.send('<script>alert("update success");location.href="/admin/banner/list"</script>');
    }
  })
})

module.exports = router;