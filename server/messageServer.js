/**
 * Created by CoderSong on 17/5/23.
 */

let pub = {};
let response = require('./../builder/responseBuilder');
let promise = require('./../model/promise');
let _ = require('underscore');
let model = require('./../model/create');
let check = require('./../server/requestServer');
let util = require('./../builder/utilBuilder');

/**
 * 发送信息
 * @param body
 * @param res
 * @param next
 */
pub.sendMessage = (body, res, next) => {

  let saveMessage = (_body, scb, fcb) => {
    let message = new model['message'](_body);
    message.save((err) => {
      err ? fcb(err) : scb(message);
    });
  };

  let saveMessagePromise = (body) => {
    return new Promise((resolve, reject) => {
      saveMessage(
        body,
        res => resolve(res),
        err => reject(err)
      );
    });
  };

  let workRes = (_data) => {
    promise.checkIsExistPromise(model['friend'], util.objMaker(['adder', 'friend'], [body.receiver, body.sender]))
      .then((data) => {
        data.notRead++;
        data.save((err) => {
          if (err)
            next({status: 400, msg: err});
          response.resSuccessBuilder(res, data);
        });
      })
      .catch((err) => {
        next({status: 400, msg: err});
      });
  };

  check.checkBodyPromise(body, model['message'], null)
    .then(saveMessagePromise)
    .then(workRes)
    .catch((err) => {
      next({status: 400, msg: err});
    });
};

/**
 * 删除阅读条数
 * @param params
 * @param scb
 * @param fcb
 */
let removeMessageReader = (params, scb, fcb) => {
  promise.checkIsExistPromise(model['friend'], util.objMaker(['adder', 'friend'], [params.sender, params.receiver]))
    .then((data) => {
      data.notRead = 0;
      data.save((err) => {
        if (err) fcb(err);
        scb(params);
      });
    })
    .catch(err => fcb(err));
};

/**
 * 删除阅读条数的promise
 * @param params
 * @returns {Promise}
 */
pub.removeMessageReaderPromise = (params) => {
  return new Promise((resolve, reject) => {
    removeMessageReader(
      params,
      data => resolve(data),
      err => reject(err)
    );
  });
};


/**
 * 查找所有的聊天记录
 * @param params
 * @param scb
 * @param fcb
 */
let findAllMessage = (params, scb, fcb) => {
  let promiseList = [
    promise.findByConditionPromise(model['message'], util.objMaker(['sender', 'receiver'], [params.sender, params.receiver])),
    promise.findByConditionPromise(model['message'], util.objMaker(['sender', 'receiver'], [params.receiver, params.sender])),
    promise.findByConditionPromise(model['user'], util.objMaker('_id', params.receiver))
  ];

  let sortMessage = ([message1, message2, receiver]) => {
    let message = [];
    // type 1 是自己发给别人 2 是别人发给自己
    _.each(message1, (each) => {
      let obj = {};
      obj.id = each._id;
      obj.message = each.message;
      obj.time = each.meta.createAt;
      obj.type = 1;
      message.push(obj);
    });

    _.each(message2, (each) => {
      let obj = {};
      obj.id = each._id;
      obj.message = each.message;
      obj.time = each.meta.createAt;
      obj.type = 2;
      message.push(obj);
    });

    scb({
      message: message.sort((a, b) => {
        return a.time - b.time;
      }),
      receiver: {
        username: receiver[0].username,
        id: receiver[0]._id
      }
    });
  };

  Promise.all(promiseList)
    .then(sortMessage)
    .catch(err => fcb(err));
};


/**
 * 查找所有的聊天记录的promise
 * @param params
 * @returns {Promise}
 */
pub.findAllMessagePromise = (params) => {
  return new Promise((resolve, reject) => {
    findAllMessage(
      params,
      data => resolve(data),
      err => reject(err)
    );
  });
};


module.exports = pub;
