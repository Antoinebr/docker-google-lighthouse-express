const fetch = require('node-fetch');

exports.now = () => new Date().toJSON().slice(0, 19).replace(/-/g, '/').replace('T', ' ');


exports.timeout = (ms, promise) => {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            reject(new Error("timeout"))
        }, ms)
        promise.then(resolve, reject)
    })
}