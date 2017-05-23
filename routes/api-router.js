/**
 * Created by CoderSong on 17/5/22.
 */

let api = require('./../server/apiServer');
let populate = require('./../model/conf').populateObj;
let model = require('./../model/create');
let router = require('express').Router();
let user = require('./../server/userServer');

/**
 * 用户注册
 */
router.post('/user', (req, res, next) => {
  api.create(req, res, model['user'], null, 'username', null, (body) => {
    // 对账号和密码的长度进行检查
    let lengthCheck = (str) => {
      return ! (str.length > 12 || str.length < 6);
    };
    return lengthCheck(body['username']) && lengthCheck(body['password']);
  }, 'The length of username or password error!', next);
});


/**
 * 用户登录
 */
router.post('/login', (req, res, next) => {
  user.login(req, res, null, next);
});


/**
 * 寻找用户
 */
router.get('/friend/:username', (req, res, next) => {
  user.findFriend(req, res, next);
});


/**
 * 添加朋友
 */
router.post('/friend', (req, res, next) => {
  req.body.adder = req.session.user._id;
  api.makeFriend(req, res, model['friend'], next);
});


/**
 * 删除朋友
 */
router.delete('/friend/:friend', (req, res, next) => {
  req.params.adder = req.session.user._id;
  api.deleteFriend(req, res, model['friend'], next);
});



module.exports = router;
