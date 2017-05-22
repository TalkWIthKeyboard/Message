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
pub.uploadHandler = () => {
  return (req, res, next) => {

  };
};

module.exports = pub;
