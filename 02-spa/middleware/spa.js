const pathIgnore = require('path-ignore')
const config = require('../config')

module.exports = function (app, options) {
    const tester = pathIgnore(options.ignore);

    const getClientRealIP = (headers) => {
        let realIp = headers['remoteip'] || headers['x-forwarded-for'] || headers['x-real-ip'] ||  headers['wl-proxy-client-ip'] || ''
    
        if (realIp.indexOf(',') > 0) {
            // 多个IP取第一个
            realIp = realIp.split(',')[0]
        }
    
        return realIp.trim()
    }

    return (req, res, next) => {
        if (tester(req.path)) {
            return next()
        }

        res.render('index.html', {
            isDebug: config.debug,
            csrfToken: req.csrfToken(),
            prefix: config.staticPath || (config.prefix === '/' ? '' : config.prefix),
            clientIp: getClientRealIP(req.headers)
        });
    }
}
