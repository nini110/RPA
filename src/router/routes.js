import layout from '@/views/layout'

const routes = [{
		path: '/',
		redirect: '/login'
	}, {
		path: '/login',
		name: 'login',
		component: () => import(/* webpackChunkName: "R_Login"*/"@/views/Login/index.vue"),
		meta: {
			layout: 'login',
			deep: 1
		}
	},
	{
		path: '/layout',
		name: 'layout',
		component: layout,
		meta: {
			deep: 1
		},
		children: [
			{
				path: 'beijingMustPass',
				name: 'BeijingMustPass',
				meta: {
					deep: 2
				},
				component: () => import(/* webpackChunkName: "R_beijingMustPass"*/"../views/BeijingMustPass"),
				children: [{
						path: 'DMP',
						name: 'DMP',
						meta: {
							title: 'DMP',
							deep: 3,
							filePath: 'BeijingMustPass'
						},
						component: () => import(/* webpackChunkName: "R_DMP"*/"@/views/BeijingMustPass"),
					},
					{
						path: 'Booth',
						name: 'Booth',
						meta: {
							title: '京东展位',
							deep: 3,
							filePath: 'BeijingMustPass'
						},
						component: () => import(/* webpackChunkName: "R_Booth"*/"@/views/BeijingMustPass"),
					},
					{
						path: 'Direct',
						name: 'Direct',
						meta: {
							title: '京东直投',
							deep: 3,
							filePath: 'BeijingMustPass'
						},
						component: () => import(/* webpackChunkName: "R_Direct"*/"@/views/BeijingMustPass"),
					},
					{
						path: 'Cube',
						name: 'Cube',
						meta: {
							title: '京腾魔方',
							deep: 3,
							filePath: 'BeijingMustPass'
						},
						component: () => import(/* webpackChunkName: "R_Cube"*/"@/views/BeijingMustPass"),
					},
					{
						path: 'People',
						name: 'People',
						meta: {
							title: '京腾人群方向',
							deep: 3,
							filePath: 'BeijingMustPass'
						},
						component: () => import(/* webpackChunkName: "R_People"*/"@/views/BeijingMustPass"),
					},
					{
						path: 'GoShop',
						name: 'GoShop',
						meta: {
							title: '购物触点',
							deep: 3,
							filePath: 'BeijingMustPass'
						},
						component: () => import(/* webpackChunkName: "R_GOshop"*/"@/views/BeijingMustPass"),
					},
					// {
					// 	path: 'Mail',
					// 	name: 'Mail',
					// 	component: () => import("@/views/BeijingMustPass"),
					// },
				]
			},
			{
				path: 'bigData',
				name: 'BigData',
				meta: {
					deep: 2
				},
				component: () => import(/* webpackChunkName: "R_bigData"*/"../views/BigData"),
				children: [{
						path: 'number',
						name: 'Number',
						meta: {
							title: '数坊人群圈选',
							deep: 3,
							filePath: 'BeijingMustPass'
						},
						component: () => import(/* webpackChunkName: "R_Number"*/"@/views/BigData"),
					},
					{
						path: 'activity',
						name: 'Activity',
						meta: {
							title: '营销活动人群',
							deep: 3,
							filePath: 'BigData'
						},
						component: () => import(/* webpackChunkName: "R_Activity"*/"@/views/BigData"),
					},
					{
						path: 'analysis',
						name: 'Analysis',
						meta: {
							title: '自定义分析创建',
							deep: 3,
							filePath: 'BigData'
						},
						component: () => import(/* webpackChunkName: "R_Analysis"*/"@/views/BigData"),
					},
					{
						path: 'difference',
						name: 'Difference',
						meta: {
							title: '数坊人群交并差集',
							deep: 3,
							filePath: 'BigData'
						},
						component: () => import(/* webpackChunkName: "R_Difference"*/"@/views/BigData"),
					},
					{
						path: 'population',
						name: 'Population',
						meta: {
							title: '营销人群追踪',
							deep: 3,
							filePath: 'BigData'
						},
						component: () => import(/* webpackChunkName: "R_Population"*/"@/views/BigData"),
					},
				]
			},
			// 数据应用  
			{
				path: 'dataApplication',
				name: 'DataApplication',
				meta: {
					deep: 2
				},
				component: () => import("../views/DataApplication"),
				children: [{
						path: 'tabulation',
						name: 'Tabulation',
						meta: {
							title: '灵鲨制表',
							deep: 3,
							filePath: 'DataApplication/tabulation'
						},
						component: () => import(/* webpackChunkName: "R_dataApplication"*/"@/views/DataApplication/tabulation"),
					},
					{
						path: 'monitor',
						name: 'Monitor',
						meta: {
							title: '竞标监控',
							deep: 3,
							filePath: 'DataApplication/monitor'
						},
						component: () => import(/* webpackChunkName: "R_dataApplication"*/"@/views/DataApplication/monitor"),
					},
					{
						path: 'snake',
						name: 'Snake',
						meta: {
							title: '桑吉图数据',
							deep: 3,
							filePath: 'DataApplication/snake'
						},
						component: () => import(/* webpackChunkName: "R_dataApplication"*/"@/views/DataApplication/snake"),
					},
					{
						path: 'xiaomi',
						name: 'Xiaomi',
						meta: {
							title: '小米分时段报表',
							deep: 3,
							filePath: 'DataApplication/xiaomi'
						},
						component: () => import(/* webpackChunkName: "R_dataApplication"*/"@/views/DataApplication/xiaomi"),
					}
				]
			},
			//视频工具  
			// {
			// 	path: 'videoTools',
			// 	name: 'VideoTools',
			// 	meta: {
			// 		deep: 2
			// 	},
			// 	component: () => import("../views/VideoTools"),
			// 	children: [{
			// 			path: 'pictureProcessing',
			// 			name: 'PictureProcessing',
			// 			meta: {
			// 				title: '图片处理'
			// 			},
			// 			component: () => import("@/views/VideoTools/child/PictureProcessing.vue"),
			// 		},
			// 		{
			// 			path: 'cutOut',
			// 			name: 'CutOut',
			// 			meta: {
			// 				title: '截取'
			// 			},
			// 			component: () => import("@/views/VideoTools/child/CutOut.vue"),
			// 		},
			// 		{
			// 			path: 'piece',
			// 			name: 'Piece',
			// 			meta: {
			// 				title: '拼合'
			// 			},
			// 			component: () => import("@/views/VideoTools/child/Piece.vue"),
			// 		}
			// 	]
			// },
			// 巨量千川
			{
				path: 'qianchuan',
				name: 'Qianchuan',
				meta: {
					deep: 2
				},
				component: () => import("@/views/Qianchuan"),
				children: [{
						path: 'items',
						name: 'Items',
						meta: {
							title: '项目',
							deep: 3,
							filePath: 'Qianchuan/items'
						},
						component: () => import(/* webpackChunkName: "R_qianchuan"*/"@/views/Qianchuan/items"),
					},
					{
						path: 'strategy',
						name: 'Strategy',
						meta: {
							title: '策略',
							deep: 3,
							filePath: 'Qianchuan/strategy'
						},
						component: () => import(/* webpackChunkName: "R_qianchuan"*/"@/views/Qianchuan/strategy")
					},
					{
						path: 'modules',
						name: 'Modules',
						meta: {
							title: '模板',
							deep: 3,
							filePath: 'Qianchuan/modules'
						},
						component: () => import(/* webpackChunkName: "R_qianchuan"*/"@/views/Qianchuan/modules"),
					},
					{
						path: 'realTime',
						name: 'RealTime',
						meta: {
							title: '实时看板',
							deep: 3,
							filePath: 'Qianchuan/realTime'
						},
						component: () => import(/* webpackChunkName: "R_qianchuan"*/"@/views/Qianchuan/realTime"),
					},
					// {
					// 	path: 'plan',
					// 	name: 'Plan',
					// 	meta: {
					// 		title: 'plan'
					// 	},
					// 	component: () => import("@/views/Qianchuan/plan"),

					// },
				]
			},
			// 预算预警
			{
				path: 'budgetAlarm',
				name: 'BudgetAlarm',
				meta: {
					deep: 2
				},
				component: () => import("@/views/BudgetAlarm"),
				children: [{
						path: 'alarm',
						name: 'Alarm',
						meta: {
							title: '预警',
							deep: 3,
							filePath: 'BudgetAlarm/alarm'
						},
						component: () => import(/* webpackChunkName: "R_budgetAlarm"*/"@/views/BudgetAlarm/alarm"),
					},
					{
						path: 'budget',
						name: 'Budget',
						meta: {
							title: '预算',
							deep: 3,
							filePath: 'BudgetAlarm/alarm'
						},
						component: () => import(/* webpackChunkName: "R_budgetAlarm"*/"@/views/BudgetAlarm/alarm"),
					}
				]
			},
			// 快车提质
			{
				path: 'kuaiche',
				name: 'Kuaiche',
				meta: {
					deep: 2
				},
				component: () => import("@/views/Kuaiche"),
				children: [{
						path: 'effect',
						name: 'Effect',
						meta: {
							title: '效果变化',
							deep: 3,
							filePath: 'Kuaiche/effect'
						},
						component: () => import(/* webpackChunkName: "R_kuaiche"*/"@/views/Kuaiche/effect"),
					},
					{
						path: 'charts',
						name: 'Charts',
						meta: {
							title: '图表',
							deep: 3,
							filePath: 'Kuaiche/effect'
						},
						component: () => import(/* webpackChunkName: "R_kuaiche"*/"@/views/Kuaiche/effect")
					}
				]
			},

			// 公共数据获取
			{
				path: 'publicData',
				name: 'PublicData',
				meta: {
					deep: 2
				},
				component: () => import("../views/PublicData"),
				children: [{
						path: 'bidding',
						name: 'Bidding',
						meta: {
							title: '京东招标',
							deep: 3,
							filePath: 'PublicData/bidding'
						},
						component: () => import(/* webpackChunkName: "R_publicData"*/"@/views/PublicData/bidding"),

					},
					{
						path: 'active',
						name: 'Active',
						meta: {
							title: '活动页面SKU',
							deep: 3,
							filePath: 'PublicData/active'
						},
						component: () => import(/* webpackChunkName: "R_publicData"*/"@/views/PublicData/active"),

					},
					{
						path: 'market',
						name: 'Market',
						meta: {
							title: '京东市场监控',
							deep: 3,
							filePath: 'PublicData/market'
						},
						component: () => import(/* webpackChunkName: "R_publicData"*/"@/views/PublicData/market"),

					},
					{
						path: 'brand',
						name: 'Brand',
						meta: {
							title: '品牌SKU获取',
							deep: 3,
							filePath: 'PublicData/brand'
						},
						component: () => import(/* webpackChunkName: "R_publicData"*/"@/views/PublicData/brand"),
					}
				]
			},
			{
				path: 'expend',
				name: 'Expend',
				meta: {
					deep: 2
				},
				component: () => import("@/views/Expend"),
				children: [{
						path: 'chart',
						name: 'chart',
						meta: {
							title: '消耗图表',
							deep: 3,
							filePath: 'Expend/chart'
						},
						component: () => import( /* webpackChunkName: "R_Expend"*/ "@/views/Expend/chart"),
					},
					{
						path: 'selfBrand',
						name: 'selfBrand',
						meta: {
							title: '自有品牌',
							deep: 3,
							filePath: 'Expend/selfBrand'
						},
						component: () => import( /* webpackChunkName: "R_Expend"*/ "@/views/Expend/selfBrand"),
					},
					{
						path: 'bidItem',
						name: 'bidItem',
						meta: {
							title: '竞标项目',
							deep: 3,
							filePath: 'Expend/bidItem'
						},
						component: () => import( /* webpackChunkName: "R_Expend"*/ "@/views/Expend/bidItem"),
					}
				]
			}
		]
	},
	// {
	// 	path: '*',
	// 	name: '404',
	// 	meta: {
	// 		deep: 1
	// 	},
	// 	component: () => import(/* webpackChunkName: "R_404"*/"@/views/404"),
	// },

]
export default routes;