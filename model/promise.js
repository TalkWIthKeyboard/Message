/**
 * Created by CoderSong on 17/5/22.
 */

let pub = {};

pub.findAllByPagePromise = (model, thisPage, pageSize, populateKey) => {
  return new Promise((resolve, reject) => {
    model.findAllByPage(thisPage, pageSize, populateKey, (err, res) => {
      err ? reject(err) : resolve(res);
    });
  });
};

pub.findAllCountPromise = (model) => {
  return new Promise((resolve, reject) => {
    model.findAllCount((err, res) => {
      err ? reject(err) : resolve(res);
    });
  });
};

pub.checkIsExistPromise = (model, obj) => {
  return new Promise((resolve, reject) => {
    model.checkIsExist(obj, (err, res) => {
      err ? reject(err) : resolve(res);
    });
  });
};

pub.findByConditionPromise = (model, obj, populateKey) => {
  return new Promise((resolve, reject) => {
    model.findByCondition(obj, populateKey, (err, res) => {
      err ? reject(err) : resolve(res);
    });
  });
};

pub.deleteByConditionPromise = (model, obj) => {
  return new Promise((resolve, reject) => {
    model.deleteByCondition(obj, (err, res) => {
      err ? reject(err) : resolve(res);
    });
  });
};

module.exports = pub;
