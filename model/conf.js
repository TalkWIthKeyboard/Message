/**
 * Created by CoderSong on 17/5/22.
 */

let pub = {};
let _ = require('underscore');

/**
 * 通用属性
 * @type {{meta: {createAt: {type: Date, default: number}, updateAt: {type: Date, default: number}}}}
 */
pub.globalAtr = {
  // 时间参数
  meta: {
    createAt: {
      type: Date,
      default: Date.now
    },
    updateAt: {
      type: Date,
      default: Date.now
    }
  }
};

/**
 * 通用静态方法
 * @type {{findAllByPage: staticsOp.findAllByPage, findAllCount: staticsOp.findAllCount, checkIsExist: staticsOp.checkIsExist, findByCondition: staticsOp.findByCondition, deleteById: staticsOp.deleteById}}
 */
let staticsOp = {
  findAllByPage: function (thisPage, pageSize, populateKey, cb) {
    return ! populateKey
      ? this
        .find({})
        .skip((thisPage - 1) * pageSize)
        .limit(pageSize)
        .sort('meta.updateAt')
        .exec(cb)
      : this
        .find({})
        .populate(populateKey)
        .skip((thisPage - 1) * pageSize)
        .limit(pageSize)
        .sort('meta.updateAt')
        .exec(cb);
  },

  findAllCount: function (cb) {
    return this
      .find({})
      .count()
      .exec(cb);
  },

  /**
   * 重复检查
   * @param obj {key, value}
   * @param cb
   * @returns {Promise}
   */
  checkIsExist: function (obj, cb) {
    return this
      .findOne(obj)
      .exec(cb);
  },

  findByCondition: function (obj, populateKey, cb) {
    return ! populateKey
      ? this
        .find(obj)
        .exec(cb)
      : this
        .find(obj)
        .populate(populateKey)
        .exec(cb);
  },

  deleteByCondition: function (obj, cb) {
    return this
      .remove(obj)
      .exec(cb);
  },
};

/**
 * 通用钩子方法（分pre与post）
 * @type {{pre: {updateDate: pub.hooksOp.pre.updateDate}, post: {}}}
 */
pub.hooksOp = {
  pre: {
    updateDate: (next) => {
      this.isNew
        ? this.meta.createAt = this.meta.updateAt = Date.now
        : this.meta.updateAt = Date.now;
      next();
    }
  },
  post: {}
};

/**
 * 表的populate对象对应
 * @type {{Friend: string, Message: string}}
 */
pub.populateObj = {
  Friend: 'adder friend',
  Message: 'sender receiver'
};

// 自动添加方法
pub.addFn = (model, list) => {
  if (! model.static) return;
  _.each(list, (each) => {
    _.indexOf(_.keys(staticsOp), each)
      ? model.statics[each] = staticsOp[each]
      : null;
  });
};

module.exports = pub;
