const devProxy = {
    '/svip':{
        target: 'ws://172.29.3.215:8080/svip',
        changeOrigin: true,
        pathRewrite: {
            '^/svip': ''
        }
    },
    '/appsocket':{
        target: 'ws://172.29.3.215:8080/svip',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
            '^/appsocket': ''
        }
    }
}

const localProxy = {
    '/appsocket':{
        target: 'http://svip.xcttest.chinamcloud.cn/svip',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
            '^/appsocket': ''
        }
    },
    '/svip':{
        target: 'http://svip.xcttest.chinamcloud.cn/svip',
        // ws:true,
        changeOrigin: true,
        pathRewrite: {
            '^/svip': ''
        }
    },
    
}

// location /svip{
//     proxy_pass  http://svip.xcttest.chinamcloud.cn/svip;
// }

const path = require('path');
function resolve (dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    lintOnSave: false,
    devServer: {
        // host: 'default.proframe.com',
        disableHostCheck:true,
        port: 7001,
        proxy: localProxy, //localProxy, //devProxy,
    },
    css: {
        loaderOptions: {
            less: {
                javascriptEnabled: true
            }
        }
    }
}
