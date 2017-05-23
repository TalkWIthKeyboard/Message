/**
 * Created by CoderSong on 17/5/22.
 */

let pub = {};
let response = require('./../builder/responseBuilder');
let promise = require('./../model/promise');
let _ = require('underscore');
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
      .then((list) => {
        let data = list[0];
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
      .then((list) => {
        let data = list[0];
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
            let friend = req.session.user._id === data.id
              ? 2
              : (data1.length === 0 && data2.length === 0)
                ? 0
                : 1;
            response.resSuccessBuilder(res, {
              user: {username: data.username, id: data._id},
              friend: friend
            });
          });
      })
      .catch((err) => {
        next({status: 400, msg: err});
      });
  }, (err) => {
    next({status: 400, msg: err});
  });
};

/**
 * 交朋友（添加两条记录）
 * @param req
 * @param res
 * @param model
 * @param next
 */
pub.makeFriend = (req, res, model, next) => {

  let saveFriend = (body, scb, fcb) => {
    let _model = new model(body);
    _model.save((err) => {
      err ? fcb(err) : scb(_model);
    });
  };

  let saveFriendPromise = (body) => {
    return new Promise((resolve, reject) => {
      saveFriend(body, (res) => {
        resolve(res);
      }, (err) => {
        reject(err);
      })
    })
  };

  let workBody = (body) => {
    let promiseList = [
      promise.checkIsExistPromise(model, util.objMaker(['adder', 'friend'], [body.adder, body.friend])),
      promise.checkIsExistPromise(model, util.objMaker(['adder', 'friend'], [body.friend, body.adder]))
    ];
    let _body = {'adder': body.friend, 'friend': body.adder};

    let saveWork = ([data1, data2]) => {
      if (!data1 && !data2) {
        Promise.all([
          saveFriendPromise(body),
          saveFriendPromise(_body)
        ]).then(([_data1, _data2]) => {
          response.resSuccessBuilder(res, 'success!');
        }).catch((err) => {
          next({status: 400, msg: err})
        })
      } else {
        throw new Error('The friendship is exited!');
      }
    };

    Promise.all(promiseList)
      .then(saveWork)
      .catch((err) => {
        next({status: 400, msg: err})
      })
  };

  check.checkBodyPromise(req.body, null, ['adder', 'friend'])
    .then(workBody)
    .catch((err) => {
      next({status: 400, msg: err});
    })
};

/**
 * 删除朋友关系（双向删除）
 * @param req
 * @param res
 * @param model
 * @param next
 */
pub.deleteFriend = (req, res, model, next) => {
  let workBody = ([body,]) => {
    let promiseList = [
      promise.deleteByConditionPromise(model, util.objMaker(['adder', 'friend'], [body.adder, body.friend])),
      promise.deleteByConditionPromise(model, util.objMaker(['adder', 'friend'], [body.friend, body.adder]))
    ];

    Promise.all(promiseList)
      .then(() => {
        response.resSuccessBuilder(res, 'success!');
      })
      .catch((err) => {
        next({status: 400, msg: err})
      })
  };

  check.checkParamsPromise(req.params, null, ['adder', 'friend'], null)
    .then(workBody)
    .catch((err) => {
      next({status: 400, msg: err});
    })
};


/**
 * 寻找一个人的所有朋友
 * @param myid
 * @param populate
 * @param cb
 * @param next
 */
pub.allFriend = (myid, populate, cb, next) => {
  let workData = (data) => {
    let res = [];
    _.each(data, (each) => {
      let obj = {};
      obj.username = each.friend.username;
      obj.notRead = each.notRead;
      res.push(obj);
    });
    cb(res);
  };

  promise.findByConditionPromise(model['friend'], {'adder': myid}, populate)
    .then(workData)
    .catch((err) => {
      next({status: 400, msg: err});
    })
};


module.exports = pub;
