/**
 * @description 模拟网络请求，随机失败或成功
 * @param {String} url 网络请求地址  
 */
function singleRequest(url) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let random = Math.random();
      if (random < 0.5) {
        resolve('success');
      } else {
        reject('error');
      }
    }, 1000);
  });
}

const { multipleRequestLimit } = require('../src/');
const { multipleRequestRetry} = require('../src/');

const url = ['a.com', 'b.com', 'c.com', 'd.com', 'e.com'];
// multipleRequestLimit(url, singleRequest, { concurentNum: 2, silence: false }).then((res) => {
//   console.log(res)
// })

multipleRequestRetry(url, singleRequest, { retryTotalTimes: 2, silence: false }).then((res) => {
  console.log(res)
})