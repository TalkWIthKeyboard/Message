/**
 * Created by CoderSong on 17/5/22.
 */

let pub = {};
let response = require('./../builder/responseBuilder');
let promise = require('./../model/promise');
let model = require('./../model/create');
let check = require('./../server/requestServer');
let util = require('./../builder/utilBuilder');

/**
 * 进行登录
 * @param req
 * @param res
 * @param populateKey
 * @param next
 */
pub.login = (req, res, populateKey, next) => {
  check.checkBody(req.body, model['user'], null, (body) => {
    promise.findByConditionPromise(model['user'], util.objMaker('username', body.username), populateKey)
      .then((data) => {
        if (data && data.password === body.password) {
          // 1. 添加session
          req.session.user = data;
          // 2. 返回用户信息
          response.resSuccessBuilder(res, {user: data});
        } else
          next({status: 400, msg: 'Username or password error!'});
      })
      .catch((err) => {
        next({status: 400, msg: err});
      });
  }, (err) => {
    next({status: 400, msg: err});
  });
};

/**
 * 寻找好友
 * @param req
 * @param res
 * @param next
 */
pub.findFriend = (req, res, next) => {
  check.checkParams(req.params, null, ['username'], null, ([params,]) => {
    promise.findByConditionPromise(model['user'], util.objMaker('username', params['username']), null)
      .then((data) => {
        let promiseList = [
          promise.findByConditionPromise(
            model['friend'],
            util.objMaker(['adder', 'friend'], [req.session.user._id, data._id]),
            null
          ),
          promise.findByConditionPromise(
            model['friend'],
            util.objMaker(['adder', 'friend'], [data._id, req.session.user._id]),
            null
          )
        ];

        Promise.all(promiseList)
          .then(([data1, data2]) => {
            // 关系值 0 不是朋友，1 是朋友，2 是自己
            let friend = req.session.user._id === data.id ? 2 : ! data1 && ! data2 ? 0 : 1;
            response.resSuccessBuilder(res, {user: data, friend: friend});
          });
      })
      .catch((err) => {
        next({status: 400, msg: err});
      });
  }, (err) => {
    next({status: 400, msg: err});
  });
};


module.exports = pub;
