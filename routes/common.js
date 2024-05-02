/*
 * @Author: PengChaoQun 1152684231@qq.com
 * @Date: 2024-02-21 16:43:36
 * @LastEditors: PengChaoQun 1152684231@qq.com
 * @LastEditTime: 2024-05-02 16:29:51
 * @FilePath: /pcq-express-startup/routes/common.js
 * @Description:
 */
var express = require('express');
var router = express.Router();
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const { SuccessModel, ErrorModel } = require('../http/response-model');
const dayjs = require('dayjs');
const { sqlExec } = require('../mysql/exec');

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadsPath = path.join(__dirname, '..', 'uploads');
      const contentPath = path.join(uploadsPath, 'content');

      // 检查 uploads 文件夹是否存在，如果不存在则创建
      if (!fs.existsSync(uploadsPath)) {
        fs.mkdirSync(uploadsPath);
        console.log('创建 uploads 文件夹成功！');
      }

      // 检查 content 文件夹是否存在，如果不存在则创建
      if (!fs.existsSync(contentPath)) {
        fs.mkdirSync(contentPath);
        console.log('在 uploads 文件夹下创建 content 文件夹成功！');
      }

      cb(null, 'uploads/content/'); // 上传文件保存的目录
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `s${req.body.skillId}-n${req.body.noteId}-${+Date.now() + ext}`); // 上传文件重命名
    }
  })
}).single('file');


// 上传文件
router.post('/upload', async (req, res, next) => {
  try {
    upload(req, res, async function (err) {
      console.log(`req.file`, req.file);

      if (!req.file) {
        res.send(new ErrorModel({ msg: `文件不存在，请选择一个文件！` }));
        return;
      }

      const sqlResult = await sqlExec(`
      INSERT INTO file
      (upload_datetime, url, name, size, ext)
      VALUES( '${dayjs().format()}', '${req.file.path}', '${req.file.filename}', '${
        req.file.size
      }', '${path.extname(req.file.originalname).repeat('.', '')}');
      `);

      console.log(`sqlResult`, sqlResult);

      if (!sqlResult) {
        res.send(new ErrorModel({ msg: `文件上传失败` }));
      } else if (err instanceof multer.MulterError) {
        res.send(new ErrorModel({ msg: err }));
      } else if (err) {
        res.send(new ErrorModel({ msg: err }));
      } else {
        const data = {
          id: sqlResult.insertId,
          url: req.file.path,
          name: req.file.filename
        };

        res.send(new SuccessModel({ msg: '上传成功', data }));
      }
    });
  } catch (error) {
    console.log(error);
  }
});


module.exports = router;
