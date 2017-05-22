/**
 * Created by CoderSong on 17/5/22.
 */

let pub = {};


pub.objMaker = (key, value) => {
  let obj = {};

  if (typeof key !== Array) {
    obj[key] = value;
    return obj;
  }

  for (let i = 0; i < key.length; i++) {
    obj[key[i]] = value[i];
  }
  return obj;
};


module.exports = pub;