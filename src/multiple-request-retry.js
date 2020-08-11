const retry = require('./retry.js');
const { log } = require('./utils');
const { messageInfo } = require('../config');

// 默认配置
const defaultOptions = {
  retryTotalTimes: 0, // 重试次数
  silence: false, // 是否缄默
}
/**
 * @description 批量网络请求执行失败时自动重试机制，是否全部执行完成，根据结果数量判断
 * @param {Array} urls 网络请求地址集合
 * @param {Number} userOptions.retryTotalTimes 失败后重试次数 默认0
 * @param {Boolean} userOptions.silence 是否输出执行日志
 * @param {Function} fn 网络请求发起及处理函数
 */
function multipleRequestRetry(urls = [], fn, userOptions) {
  let options = Object.assign({}, defaultOptions, userOptions);
  const { retryTotalTimes, silence } = options;
  let results = [];
  let retryTimes = 0;
  return new Promise((resolve, reject) => { 
    try {
      urls.forEach((item, index) => {
        fn(item).then((res) => {
          !silence && log('success', item + ':' + messageInfo.noRetrySuccess);
          results.push({index, item, res, message: '成功', retryTimes});
        }).catch((err) => {
          !silence && log('error', item + ':' + messageInfo.noeRetryError);
          // 判断是否需要重试 judge need retry or not
          if (!retryTotalTimes) {
            results.push({index, item, err, message: '失败', retryTimes});
            return false;
          }
          retry(fn, item, options).then((res) => {
            // 重试后成功 after retry some times success
            let { retryResult, retryTimes } = res;
            let message = messageInfo.retrySuccess.replace(/\$\{retryTimes\}/g, retryTimes);
            !silence && log('success', item + ':' + message);
            results.push({index, item, retryResult, message, retryTimes});
          }).catch((err) => {
            // 重试指定次数后，仍然失败 after retryTotalTimes retry still failed
            let message = messageInfo.retryError.replace(/\$\{retryTimes\}/g, retryTotalTimes);
            results.push({index, item, err, message, retryTimes: retryTotalTimes});
          }).finally(() => {
            // 根据结果判断是否全部执行完成 judge finished by results struct
            if (results.length === urls.length) {
              resolve(results);
            }
          });
        }).finally(() => {
          // 全部一次成功则执行 all success, no retry
          if (results.length === urls.length) {
            resolve(results);
          }
        });
      });      
    } catch (error) {
      reject(error);
    }
  })
}

module.exports = { multipleRequestRetry };