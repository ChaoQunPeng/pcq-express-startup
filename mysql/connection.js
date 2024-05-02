/*
 * @Author: PengChaoQun 1152684231@qq.com
 * @Date: 2023-12-28 14:19:02
 * @LastEditors: PengChaoQun 1152684231@qq.com
 * @LastEditTime: 2024-05-02 16:31:16
 * @FilePath: /pcq-express-startup/mysql/connection.js
 * @Description:
 */
const mysql = require('mysql2');

const MYSQL_CONF = {
  host: process.env.ENV == 'develop' ? 'localhost' : 'databaseName',
  user: 'root',
  password: '123456',
  port: '3306',
  database: ''
};

console.log(`ENV`, process.env.ENV);

console.log(`数据库开始连接`);

let db = mysql.createConnection(MYSQL_CONF);

const connectDb = db => {
  db.connect(function (err) {
    if (err) {
      console.error('Database error:', err);
      return;
    }

    console.log(`数据库连接完成`);
  });
};

connectDb(db);

// 在发生错误时触发
db.on('error', err => {
  console.error('Database error:', err);

  connectDb(db);
});

module.exports = {
  db,
  config: MYSQL_CONF
};