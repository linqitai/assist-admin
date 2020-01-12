module.exports = {
    // baseUrl: './',
	publicPath: './',
    productionSourceMap: false,
    devServer: {
		port: 9099,
        proxy: {
            '/bfl':{
                target:'http://localhost:8002/',
                changeOrigin:true,
                pathRewrite:{
                    '/bfl':''
                }
            },
            /* '/ms':{
                target: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
                changeOrigin: true
            } */
        }
    }
}