/**
 * Created by CoderSong on 17/5/22.
 */

let pub = {};
let _ = require('underscore');
let response = require('./responseBuilder');

/**
 * 错误处理中间件
 * @returns {function(*=, *, *=, *)}
 */
pub.errorHandler = () => {
  return (err, req, res, next) => {
    let _err = new Error(err.msg);
    _err.status = err.status;
    response.resErrorBuilder(res, _err);
    next();
  };
};

/**
 * 登录处理中间件
 * @returns {function(*, *, *)}
 */
pub.checkHandler = () => {
  // 1. 声明白名单
  let whiteList = [{
    url: '/api/login',
    type: 'POST'
  }, {
    url: '/api/user',
    type: 'POST'
  }];

  // 2. 拦截方法
  return (req, res, next) => {
    let flag = false;
    _.each(whiteList, (each) => {
      flag = (each.url === req.originalUrl && each.type === req.method) ? true : flag;
    });

    if (! flag)
      // 进行登录页面的重定向
      req.session.user ? next() : next({status: 400, msg: 'error'});
    else next();
  };
};

module.exports = pub;
