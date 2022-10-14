var express = require('express');
const mysql = require('../../config/db');
var router = express.Router();
const multer = require('multer');
const upload = multer({dest:'tmp/'});
const path = require('path');
const fs = require('fs');

router.get('/add',function(req,res){
  mysql.query('select * from newstype order by id desc',function(err,data){
    if(err) throw err;
    res.render('admin/news/add',{data});
  });
})

router.post('/add',upload.single('img'),function(req,res){
  const {cid,title,keywords,description,info,author,text} = req.body;
  const imgRes = req.file;

  const ranTime = new Date().getTime() + Math.round(Math.random()*10000) + path.extname(imgRes.originalname);
  const newPath = `/upload/news/${ranTime}`;

  const tmpPath = fs.readFileSync(imgRes.path);
  fs.writeFileSync(`${__dirname}/../..${newPath}`,tmpPath);

  const time = Math.ceil(new Date().getTime() / 1000);

  const sql = 'insert into news(cid,title,time,keywords,description,info,author,img,text) values(?,?,?,?,?,?,?,?,?)';
  const arr = [cid && Number(cid),title,time,keywords,description,info,author,newPath,text];

  mysql.query(sql,arr,function(err){
    if(err){
      res.send('<script>alert("add error");history.go(-1)</script>');
      throw err;
    }
    res.send('<script>alert("add success");location.href="/admin/news/list"</script>');
  });
})

router.get('/list',function(req,res){
  mysql.query('select news.*,type.name tname from news,newstype type where news.cid = type.id order by news.id desc',function(err,data){
    if(err) throw err;

    res.render('admin/news/list',{data});
  });
})

router.get('/edit',function(req,res){
  const {id} = req.query;

  mysql.query('select * from newstype order by sort desc',function(err,data){
    if(err) throw err;

    mysql.query('select * from news where id = '+id,function(err,data2){
      if(err) throw err;

      res.render('admin/news/edit',{data,data2:data2[0]});
    })
  });
})

router.post('/edit',upload.single('img'),function(req,res){
  const {id,cid,title,keywords,description,info,author,text,oldImg} = req.body;
  const imgRes = req.file;
  let newPath = '';

  if(imgRes){
    const ranTime = new Date().getTime() + Math.round(Math.random()*10000) + path.extname(imgRes.originalname);
    newPath = `/upload/news/${ranTime}`;
  
    const tmpPath = fs.readFileSync(imgRes.path);
    fs.writeFileSync(`${__dirname}/../..${newPath}`,tmpPath);
  }

  const uploadImg = imgRes ? newPath : oldImg;

  const sql = "update news set cid = ?,title = ?,keywords = ?,description = ?,info = ?,author = ?,img = ?,text = ? where id = ?";
  const arr = [cid,title,keywords,description,info,author,uploadImg,text,id];

  mysql.query(sql,arr,function(err){
    if(err){
      res.send('<script>alert("update error");history.go(-1)</script>');
      throw err;
    }
    if(imgRes && fs.existsSync(`${__dirname}/../..${oldImg}`)){
      fs.unlinkSync(`${__dirname}/../..${oldImg}`);
    }
    res.send('<script>alert("update success");location.href="/admin/news/list"</script>');
  });
})

router.get('/delete',function(req,res){

})

module.exports = router;