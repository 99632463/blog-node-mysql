var express = require('express');
var router = express.Router();
const fs = require('fs');
const multer = require('multer');
const upload = multer({dest:'tmp/'});
const path = require('path');

router.get('/',function(req,res){
  const getData = fs.readFileSync(`${__dirname}/../../config/webConfig.json`);
  const data = JSON.parse(getData.toString());

  res.render('admin/settings',{data});
})

router.post('/',upload.single('logo'),function(req,res){
  const {title,keywords,description,oldLogo} = req.body;
  const imgRes = req.file;
  let newPath = '';

  if(imgRes){
    const ranPath = new Date().getTime() + Math.round(Math.random()*10000) + path.extname(imgRes.originalname);
    newPath = `/upload/banner/${ranPath}`;

    const tmpPath = fs.readFileSync(imgRes.path);
    fs.writeFileSync(`${__dirname}/../..${newPath}`,tmpPath);
  }

  const writeData = {
    title,
    keywords,
    description,
    logo:newPath ||  oldLogo
  };

  fs.writeFileSync(`${__dirname}/../../config/webConfig.json`,
  JSON.stringify(writeData));

  res.send('<script>alert("update success");history.go(-1)</script>');
})

module.exports = router;