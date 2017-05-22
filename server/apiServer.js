/**
 * Created by CoderSong on 17/5/22.
 */

let pub = {};
let promise = require('./../model/promise');
let response = require('./../builder/responseBuilder');
let check = require('./../server/requestServer');
let _ = require('underscore');
let util = require('./../builder/utilBuilder');

/**
 * 保存对象
 * @param res
 * @param body 对象数据
 * @param model
 * @param cb
 * @param next
 */
let saveObj = (res, body, model, cb, next) => {

  let data = {};
  let modelObj = model.schema.obj;
  delete modelObj.meta;

  // 过滤掉其它不在类中的属性
  _.each(body, (value, key) => {
    if (_.indexOf(modelObj, key))
      data[key] = value;
  });

  let _model = new model(data);
  _model.save((err) => {
    if (err) {
      next(err);
      return;
    }
    !cb ? response.resSuccessBuilder(res, _model) : cb(_model);
  });
};

/**
 * 通用的创建API（默认只含有body参数）
 * @param req
 * @param res
 * @param model
 * @param keyList 可以定制检查的key
 * @param key 检查冲突的key
 * @param cb 保存成功以后的回调
 * @param selfCheck 自定义检查规则
 * @param errorInfo selfCheck对应的错误信息
 * @param next
 */
pub.create = (req, res, model, keyList, key, cb, selfCheck, errorInfo, next) => {
  check.checkBodyPromise(req.body, model, keyList)
    .then((body) => {
      if (key && body[key]) {
        // 自定义的检查规则不满足
        if (!selfCheck(body)) {
          next({status: 400, msg: errorInfo});
          return;
        }

        promise.checkIsExistPromise(model, util.objMaker(key, body[key])).then((obj) => {
          obj
            ? next({status: 400, msg: 'The value of key is exist!'})
            : saveObj(res, body, model, cb, next);
        }, (err) => {
          next({status: 400, msg: err});
        });
      }
      else
        saveObj(res, body, model, cb, next);
    })
    .catch((err) => {
      next({status: 400, msg: err});
    });
};


/**
 * 通用的删除API
 * @param req
 * @param res
 * @param model
 * @param paramsList
 * @param queryList
 * @param next
 */
pub.delete = (req, res, model, paramsList = ['id'], queryList = null, next) => {
  check.checkParams(req.params, req.query, paramsList, queryList, ([params,]) => {
    promise.deleteByIdPromise(model, params.id)
      .then(() => {
        response.resSuccessBuilder(res, {id: params.id});
      })
      .catch((err) => {
        next({status: 400, msg: err});
      });
  }, (err) => {
    next({status: 400, msg: err});
  });
};


/**
 * 通用的获取API（暂时只支持单键值对查询）
 * @param req
 * @param res
 * @param model
 * @param paramsList
 * @param queryList
 * @param populateKey
 * @param key 查找的key
 * @param next
 */
pub.get = (req, res, model, paramsList = ['id'], queryList = null, key, populateKey = null, next) => {
  check.checkParams(req.params, req.query, paramsList, queryList, ([params,]) => {
    promise.findByConditionPromise(model, util.objMaker(key, params[key]), populateKey)
      .then((data) => {
        response.resSuccessBuilder(res, data);
      })
      .catch((err) => {
        next({status: 400, msg: err});
      });
  }, (err) => {
    next({status: 400, msg: err});
  });
};


/**
 * 通用的更新API（默认paramsList是中只包含id）
 * @param req
 * @param res
 * @param model
 * @param paramsList
 * @param queryList
 * @param bodyList
 * @param populateKey
 * @param next
 */
pub.update = (req, res, model, paramsList = ['id'], queryList = null, bodyList, populateKey = null, next) => {
  let promiseList = [
    check.checkParamsPromise(req.params, req.query, paramsList, queryList),
    check.checkBodyPromise(req.body, model, bodyList)
  ];

  Promise.all(promiseList).then((results) => {
    let [params,] = results[0];
    let body = results[1];
    promise.findByConditionPromise(model, util.objMaker('_id', params.id), populateKey).then((data) => {
      _.mapObject(body, (value, key) => {
        data[key] = value;
      });
      data.save((err) => {
        if (err) {
          next(err);
          return;
        }
        response.resSuccessBuilder(res, data);
      });
    });
  }).catch((err) => {
    next({status: 400, msg: err});
  });
};


/**
 * 通用的分页查找API
 * @param req
 * @param res
 * @param model
 * @param paramsList
 * @param queryList
 * @param next
 */
pub.pagination = (req, res, model, paramsList = null, queryList = ['page', 'pageSize'], next) => {
  check.checkParamsPromise(req.params, req.query, paramsList, queryList)
    .then((results) => {
      let params = results[0];
      let query = results[1];
      let promiseList = [
        promise.findAllByPagePromise(model, query.page, query.pageSize),
        promise.findAllCountPromise(model)
      ];
      Promise.all(promiseList).then((results) => {
        let data = results[0];
        let pageCount = Math.floor((results[1] - 1) / query.pageSize) + 1;
        response.resSuccessBuilder(res, {
          page: params.page,
          pageCount: pageCount,
          data: data,
        });
      }).catch((err) => {
        next({status: 400, msg: err});
      });
    })
    .catch((err) => {
      next({status: 400, msg: err});
    });
};

module.exports = pub;