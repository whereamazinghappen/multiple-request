# multiple-request
solve multiple requests concurrence and retry
## Installation

```$ npm install mutiple-request```

## Usage
### multipleRequestLimit(urls, fn, options)
urls is a collections of request address, fn is a promise or a funciton return promise  
* options.concurentNum `Number` max concurent number default `-1` means no limit
* options.silence `Bolean` output log or not default `false` 
### multipleRequestLimit(urls, fn, options)
urls is a collections of request address, fn is a promise or a funciton return promise  
* options.retryTotalTimes `Number` max retry number while request error  default `0`
* options.silence `Bolean` output log or not default `false` 
## Example
```javascript
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
const urls = ['a.com', 'b.com', 'c.com', 'd.com', 'e.com'];
multipleRequestLimit(urls, singleRequest, { concurentNum: 2, silence: false }).then((res) => {
  // 结果result
})
multipleRequestRetry(url, singleRequest, { retryTotalTimes: 2, silence: false }).then((res) => {
  // 结果result
})
```
## Tests
```$ npm test```
## License
MIT