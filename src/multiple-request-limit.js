const { log } = require('./utils');
const { messageInfo } = require('../config');

// 默认配置
const defaultOptions = {
  concurentNum: -1, // -1时表示不限制并发
  silence: false, // 是否缄默
}

/**
 * @description 限制并发次数的批量网络请求执行，是否全部执行完成，根据结果数量判断
 * @param {Array} urls 网络请求地址集合
 * @param {Number} userOptions.concurentNum 最大并发数 默认-1表示不限制
 * @param {Boolean} userOptions.silence 是否输出执行日志
 * @param {Function} fn 网络请求发起及处理函数
 */
function multipleRequestLimit(urls = [], fn , userOptions) {
  let options = Object.assign({}, defaultOptions, userOptions);
  const { concurentNum, silence } = options;
  let quene = []; // 队列
  let index = 0; // 当前执行第几个
  let round = 0; // 第几次执行
  let results = []; // 结果数据
  // -1时不限制并发
  if (concurentNum === -1) {
    quene = urls;
  } else {
    quene = urls.length > concurentNum ? urls.slice(0, concurentNum) : urls;
  }
  return new Promise((resolve, reject) => {
    try {
      let callback = function (err, item, res) {
        round ++;
        let current = urls.indexOf(item);
        if (err) {
          !silence && log('error', item + ':' + messageInfo.noeRetryError);
          results.push({index: current, item, res: err, message: '失败'});
        } else {
          !silence && log('success', item + ':' + messageInfo.noRetrySuccess);
          results.push({index : current, item, res, message: '成功'});
        }
        if (index < urls.length) {
          if (concurentNum > 1 && index === 0 && (index < concurentNum)) {
            index += concurentNum;
          } else {
            index++;
          }
          runningQuene(urls.slice(index, index + 1), fn , callback);
        }
        // 执行完成
        if (round === urls.length) {
          resolve(results);
        }
      }
      runningQuene(quene, fn, callback);
    } catch (error) {
      reject(error);
    }
  })
}

/**
 * 
 * @param {Array} quene 并发执行队列
 * @param {function} fn 要执行的函数
 * @param {function} callback 单个执行完毕回调
 */
function runningQuene(quene, fn, callback) {
  quene.forEach((item, index) => {
    fn(item).then((res) => {
      callback(null, item, res);
    }).catch((err) => {
      callback(err, item);
    });
  });
}

module.exports = { multipleRequestLimit };
