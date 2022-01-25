// gz压缩
// npm install --save-dev compression-webpack-plugin@1.1.12
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const IS_PROD = process.env.NODE_ENV === 'production';
module.exports = {
	// 是否为生产环境构建生成 source map？
	productionSourceMap: IS_PROD,
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
			// 抽离 css 支持按需加载
			// npm install mini-css-extract-plugin -D
			// let miniCssExtractPlugin = new MiniCssExtractPlugin({
			// 	filename: 'assets/[name].[hash:8].css',
			// 	chunkFilename: 'assets/[name].[hash:8].css'
			// })
			// config.plugin('extract-css').use(miniCssExtractPlugin)

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
		// // 入口文件
		// config.entry = './src/main.js'
		// // 打包后的入口文件
		// config.output = {
		// 	filename: 'js/[name].js'
		// }
		// 使用SplitChunksPlugin不需要安装任何依赖，只需在 webpack.config.js 中的 config对象添加 optimization 属性
		config.optimization = {
			splitChunks: {
				chunks: "all", //async异步代码分割 initial同步代码分割 all同步异步分割都开启
				minSize: 30, //字节 引入的文件大于30kb才进行分割
				// minChunks: 2,           //模块至少使用次数
				// maxAsyncRequests: 25,    //同时加载的模块数量最多是5个，只分割出同时引入的前5个文件
				maxInitialRequests: 10,  //首页加载的时候引入的文件最多3个
				automaticNameDelimiter: '-', //打包生成的js文件名的分割符，默认为~
				// name: true,                  //打包生成js文件的名称  缓存组里面的filename生效，覆盖默认命名
				cacheGroups: { //核心重点，配置提取模块的方案  里面每一项代表一个提取模块的方案  若cacheGroups每项中有，就按配置的，没有就使用外面配置的。
					// //第三方组件
					// vendors: {
					// 	name: 'app-chunk-vendors',
					// 	test: /[\\\/]node_modules[\\\/]/,
					// 	priority: 0
					// },
					zrender: {
						name: 'chunk-zrender',
						test: /[\\\/]node_modules[\\\/]zrender[\\\/]/,
						priority: 0
					},
					vue: {
						name: "chunk-vue",
						test: /[\\/]node_modules[\\/]vue[\\/]/,
						priority: 0
					},
					vuex: {
						name: 'chunk-vuex',
						test: /[\\/]node_modules[\\/]vuex[\\/]/,
						priority: 0
					},
					'vue-router': {
						name: 'chunk-vue-router',
						test: /[\\/]node_modules[\\/]vue-router[\\/]/,
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
					'icon-font': {
						name: 'chunk-icon-font',
						test: /[\\/]src[\\/]assets[\\/]fonts[\\/]/,
						priority: 0
					},

				}
			}
		}
		// config.outputDir = {
		// 	chunkFilename: 'CS.[name].js'
		// }
		// sourcemap用于调试文件
		config.devtool = 'source-map'
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
					minRatio: 0.8
				})
			]
			config.plugins = [...config.plugins, ...plugins];
		}
	},


}