/**
 * Created by CoderSong on 17/5/22.
 */

let mongoose = require('mongoose');
let conf = require('./conf');

let FriendSchema = new mongoose.Schema({
  // 添加者
  adder: {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'user'
  },
  // 被添加者
  friend: {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'user'
  },
  // 未读信息条数
  notRead: {
    type: Number,
    default: 0
  }
});

conf.addFn(FriendSchema, [
  'findAllByPage',
  'findAllCount',
  'checkIsExist',
  'findByCondition',
  'deleteByCondition'
]);

module.exports = FriendSchema;
