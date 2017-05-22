/**
 * Created by CoderSong on 17/5/22.
 */

let api = require('./../server/apiServer');
let model = require('./../model/create');
let router = require('express').Router();

/**
 * 用户注册
 */
router.post('/user', (req, res, next) => {
  api.create(req, res, model['user'], null, 'username', null, (body) => {
    // 对账号和密码的长度进行检查
    let lengthCheck = (str) => {
      return !(str.length > 12 || str.length < 6);
    };
    return lengthCheck(body['username']) && lengthCheck(body['password']);
  }, next);
});



module.exports = router;