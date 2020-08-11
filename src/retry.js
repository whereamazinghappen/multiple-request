const { log } = require('./utils');
const { messageInfo } = require('../config');

/**
 * 
 * @param {Object} fn function return pendding state promise
 * @param {Number} options.retryTotalTimes retry times
 * @param {Number} options.silence is output
 */
function retry(fn, item, options) {
  const { retryTotalTimes, silence } = options;
  let message = messageInfo.beginRetry;
  !silence&&log('info', item + ':' + message);
  let times = 1;
  return new Promise((resolve, reject) => {
    var attemp = function (promise) {
      promise.then((res) => {
        resolve({retryResult: res, retryTimes: times});
      }).catch((error) => {
        let message = messageInfo.retryError.replace(/\$\{retryTimes\}/g, times);
        !silence&&log('error', item + ':' + message);
        if (times < retryTotalTimes) {
          times ++;
          attemp(fn(item, retryTotalTimes));
        } else {
          reject(error);
        }
      });
    }
    attemp(fn(item, retryTotalTimes));
  });
}

module.exports = retry;