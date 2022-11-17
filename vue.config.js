// 本项目可用node版本   10.13.0
// gz压缩
// npm install --save-dev compression-webpack-plugin@1.1.12
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const IS_PROD = process.env.NODE_ENV === 'production';
const Timestamp = new Date().getTime();
module.exports = {

	// 是否为生产环境构建生成 source map？
	productionSourceMap: false,
	css: {
		loaderOptions: {
			postcss: {
				plugins: [
					require('postcss-px2rem')({
						remUnit: 12
					}),
				]
			}
		}
	},
	chainWebpack: config => {
		config.resolve.symlinks(true);
		if (IS_PROD) {
			// webpack-bundle-analyzer打包文件分析工具
			// npm install webpack-bundle-analyzer --save-dev
			config
				.plugin('webpack-bundle-analyzer')
				.use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
				.end();
			// 压缩图片
			config.module
				.rule('images')
				.use('image-webpack-loader')
				.loader('image-webpack-loader')
				.options({
					bypassOnDebug: true
				})
				.end()
			// 移除prefetch插件，避免加载多余的资源
			config.plugins.delete('prefetch')
			// 移除 preload 插件， 避免加载多余的资源
			config.plugins.delete('preload');
			config.plugins.delete('prefetch-index');
			config.plugins.delete('preload-index');
		}
	},
	// 如果你需要基于环境有条件地配置行为，或者想要直接修改配置，
	// 那就换成一个函数 (该函数会在环境变量被设置之后懒执行)。
	// 该方法的第一个参数会收到已经解析好的配置。在函数内，你可以直接修改配置，或者返回一个将会被合并的对象：
	configureWebpack: (config) => {
		// 打包生成的文件名  timestamp为时间戳
		config.output.filename = `js/[name].${Timestamp}.js`
		config.output.chunkFilename = `js/[name].${Timestamp}.js`
		// 使用SplitChunksPlugin不需要安装任何依赖，只需在 webpack.config.js 中的 config对象添加 optimization 属性
		config.optimization = {
			splitChunks: {
				chunks: "all", //async异步代码分割 initial同步代码分割 all同步异步分割都开启
				minSize: 30, //字节 引入的文件大于30kb才进行分割
				// minChunks: 2,           //模块至少使用次数
				// maxAsyncRequests: 25,    //同时加载的模块数量最多是5个，只分割出同时引入的前5个文件
				maxInitialRequests: 10, //首页加载的时候引入的文件最多3个
				automaticNameDelimiter: '-', //打包生成的js文件名的分割符，默认为~
				// name: true,                  //打包生成js文件的名称  缓存组里面的filename生效，覆盖默认命名
				cacheGroups: { //核心重点，配置提取模块的方案  里面每一项代表一个提取模块的方案  若cacheGroups每项中有，就按配置的，没有就使用外面配置的。
					// //第三方组件
					vendors: {
						name: 'chunk-app-vendors',
						test: /[\\\/]node_modules[\\\/]/,
						priority: -2
					},
					zrender: {
						name: 'chunk-zrender',
						test: /[\\\/]node_modules[\\\/]zrender[\\\/]/,
						priority: 0
					},
					'element-ui': {
						name: 'chunk-element-ui',
						test: /[\\/]node_modules[\\/]element-ui[\\/]/,
						priority: 0
					},
					'vxe-table': {
						name: 'chunk-vxe-table',
						test: /[\\/]node_modules[\\/]vxe-table[\\/]/,
						priority: 0
					},
					'echarts': {
						name: 'chunk-echarts',
						test: /[\\/]node_modules[\\/]echarts[\\/]/,
						priority: 0
					},
					// 'icon-font': {
					// 	name: 'chunk-icon-font',
					// 	test: /[\\/]src[\\/]assets[\\/]fonts[\\/]/,
					// 	priority: 0
					// },
				}
			}
		}
		// 配置打包的时候性能提示
		config.performance = {
			hints: 'warning',
			//入口起点的最大体积
			maxEntrypointSize: 90000000,
			//生成文件的最大体积
			maxAssetSize: 60000000,
			//只给出 js 文件的性能提示
			assetFilter: function (assetFilename) {
				return assetFilename.endsWith('.js');
			}
		}
		// 配置gz压缩
		if (process.env.NODE_ENV === 'production') {
			const plugins = [
				new CompressionWebpackPlugin({
					filename: '[path].gz[query]',
					algorithm: 'gzip',
					test: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i,
					threshold: 10240,
					minRatio: 0.8,
					// deleteOriginalAssets:false,//是否删除源文件
				})
			]
			config.plugins = [...config.plugins, ...plugins];
		} else {
			// sourcemap用于调试文件
			config.devtool = 'source-map'
		}
	},
	devServer: {
		open: true, // 编译完成打开网页
		host: '0.0.0.0', // 使用本地默认地址
		port: 8001,
		https: false, // 编译失败刷新页面
		hotOnly: true,  // 开启热加载
		// change 设置跨域代理
		proxy: {
			'/host8001': {// 拦截地址中有/8001
				target: 'http://114.67.229.243:8001', // 8001端口
				changeOrigin: true,
				secure: false,
				pathRewrite: {
					'^/host8001': ''
				}
			},
			'/host8002': {
				target: 'http://114.67.229.243:8002', // 8002端口
				changeOrigin: true,
				secure: false,
				pathRewrite: {
					'^/host8002': ''
				}
			},
			'/host8101': {
				target: 'http://114.67.229.243:8101', // 8101端口
				changeOrigin: true,
				secure: false,
				pathRewrite: {
					'^/host8101': ''
				}
			},
		},
	},
}