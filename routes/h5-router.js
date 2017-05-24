/**
 * Created by CoderSong on 17/5/22.
 */

let router = require('express').Router();
let user = require('./../server/userServer');
let message = require('./../server/messageServer');
let populate = require('./../model/conf').populateObj;
let response = require('./../builder/responseBuilder');

/**
 * 登录页面
 */
router.get('/login', (req, res, next) => {
  res.render('user_login', {
    layout: false,
    title: '登录'
  });
});

/**
 * 注册页面
 */
router.get('/register', (req, res, next) => {
  res.render('user_register', {
    layout: false,
    title: '注册'
  });
});

/**
 * 好友页面
 */
router.get('/friend', (req, res, next) => {
  user.allFriend(req.session.user._id, populate.Friend, (data) => {
    res.render('user_friend', {
      layout: false,
      title: '好友',
      friends: data
    });
  }, next);
});

/**
 * 好友搜索
 */
router.get('/search', (req, res, next) => {
  res.render('user_search', {
    layout: false,
    title: '搜索'
  });
});

/**
 * 消息页面
 */
router.get('/message/:receiver', (req, res, next) => {
  if (req.params.receiver) {
    req.params.sender = req.session.user._id;
    message.removeMessageReaderPromise(req.params)
      .then(message.findAllMessagePromise)
      .then(data => res.render('message', {
        layout: false,
        title: '消息',
        message: data.message,
        receiver: data.receiver
      }))
      .catch(err => next({status: 400, msg: err}))
  }
});

module.exports = router;
