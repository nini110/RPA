
const px2rem = require('postcss-px2rem')
 
const postcss = px2rem({
  remUnit: 14   //基准大小 baseSize，需要和rem.js中相同
})
module.exports = {
	// chainWebpack: config => {
	//   config.module
	// 	.rule("css")
	// 	.test(/\.css$/)
	// 	.oneOf("vue")
	// 	.resourceQuery(/\?vue/)
	// 	.use("px2rem")
	// 	.loader("px2rem-loader")
	// 	.options({
	// 	  remUnit: 192
	// 	});
	// },
	css: {
		loaderOptions: {
		  postcss: {
			plugins: [
			  postcss
			]
		  }
		}
	}
	
  }
  
  