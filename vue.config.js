const path = require('path')

module.exports = {
	devServer:{
//		host:''
		port:8888,
		https:true,
		open:true,
		hotOnly:true,
		proxy:null,
		overlay:{
			warning:false,
			errors:false,
		},
	},
	lintOnSave:false,
	chainWebpack:(config) => {
		config.resolve.alias
		      .set('@',path.resolve('src'))
	}
}
