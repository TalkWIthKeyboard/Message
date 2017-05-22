/**
 * Created by CoderSong on 17/5/22.
 */

let mongoose = require('mongoose');
let conf = require('./conf');

let UserSchema = new mongoose.Schema({
  // 用户名
  username: String,
  // 密码
  password: String,
});

conf.addFn(UserSchema, [
  'findAllByPage',
  'findAllCount',
  'checkIsExist',
  'findByCondition',
  'deleteByCondition'
]);

module.exports = UserSchema;
