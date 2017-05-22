/**
 * Created by CoderSong on 17/5/22.
 */

let mongoose = require('mongoose');
let conf = require('./conf');

let MessageSchema = new mongoose.Schema({
  // 添加者
  sender: {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'user'
  },
  // 被添加者
  receiver: {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'user'
  },
  // 未读信息条数
  message: String
});

conf.addFn(MessageSchema, [
  'findAllByPage',
  'findAllCount',
  'checkIsExist',
  'findByCondition',
  'deleteByCondition'
]);

module.exports = MessageSchema;
