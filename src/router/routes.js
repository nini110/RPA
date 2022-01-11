import layout from '@/views/layout'
import layout2 from '@/views/layout/index2.vue'

// 巨量千川
// import Homeitem from '@/views/ThirdPartyTools/child/Homeitem.vue'


const routes = [
	{
		path: '/',
		redirect: '/login'
	},{
		path: '/login',
		name: 'login',
		component: () => import("@/views/Login/index.vue"),
		meta: {
			layout: 'login',
			deep: 1
		}
	},
	{
		path: '/layout2',
		name: 'layout2',
		meta: {
			deep: 1
		},
		component: layout2,
		children: [
			// 巨量千川--实时看板
			{
				path: 'qianchuan',
				name: 'Qianchuan',
				meta: {
					deep: 2
				},
				component: () => import("@/views/Qianchuan"),
				children: [{
					path: 'realTime',
					name: 'RealTime',
					meta: {
						title: '实时看板',
						deep: 3,
						filePath: 'Qianchuan/realTime'
					},
					component: () => import("@/views/Qianchuan/realTime"),
				}]
			},
			// 提质--效果列表
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
					component: () => import("@/views/Kuaiche/effect"),
				}]
			},


		]
	},
	{
		path: '/layout',
		name: 'layout',
		component: layout,
		meta: {
			deep: 1
		},
		children: [{
				path: 'beijingMustPass',
				name: 'BeijingMustPass',
				meta: {
					deep: 2
				},
				component: () => import("../views/BeijingMustPass"),
				children: [{
						path: 'DMP',
						name: 'DMP',
						meta: {
							title: 'DMP',
							deep: 3,
							filePath: 'BeijingMustPass'
						},
						component: () => import("@/views/BeijingMustPass"),
					},
					{
						path: 'Booth',
						name: 'Booth',
						meta: {
							title: '京东展位',
							deep: 3,
							filePath: 'BeijingMustPass'
						},
						component: () => import("@/views/BeijingMustPass"),
					},
					{
						path: 'Direct',
						name: 'Direct',
						meta: {
							title: '京东直投',
							deep: 3,
							filePath: 'BeijingMustPass'
						},
						component: () => import("@/views/BeijingMustPass"),
					},
					{
						path: 'Cube',
						name: 'Cube',
						meta: {
							title: '京腾魔方',
							deep: 3,
							filePath: 'BeijingMustPass'
						},
						component: () => import("@/views/BeijingMustPass"),
					},
					{
						path: 'People',
						name: 'People',
						meta: {
							title: '京腾人群方向',
							deep: 3,
							filePath: 'BeijingMustPass'
						},
						component: () => import("@/views/BeijingMustPass"),
					},
					{
						path: 'GoShop',
						name: 'GoShop',
						meta: {
							title: '购物触点',
							deep: 3,
							filePath: 'BeijingMustPass'
						},
						component: () => import("@/views/BeijingMustPass"),
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
				component: () => import("../views/BigData"),
				children: [{
						path: 'number',
						name: 'Number',
						meta: {
							title: '数坊人群圈选',
							deep: 3,
							filePath: 'BeijingMustPass'
						},
						component: () => import("@/views/BigData"),
					},
					{
						path: 'activity',
						name: 'Activity',
						meta: {
							title: '营销活动人群',
							deep: 3,
							filePath: 'BigData'
						},
						component: () => import("@/views/BigData"),
					},
					{
						path: 'analysis',
						name: 'Analysis',
						meta: {
							title: '自定义分析创建',
							deep: 3,
							filePath: 'BigData'
						},
						component: () => import("@/views/BigData"),
					},
					{
						path: 'difference',
						name: 'Difference',
						meta: {
							title: '数坊人群交并差集',
							deep: 3,
							filePath: 'BigData'
						},
						component: () => import("@/views/BigData"),
					},
					{
						path: 'population',
						name: 'Population',
						meta: {
							title: '营销人群追踪',
							deep: 3,
							filePath: 'BigData'
						},
						component: () => import("@/views/BigData"),
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
						component: () => import("@/views/DataApplication/tabulation"),
					},
					{
						path: 'monitor',
						name: 'Monitor',
						meta: {
							title: '竞标监控',
							deep: 3,
							filePath: 'DataApplication/monitor'
						},
						component: () => import("@/views/DataApplication/monitor"),
					},
					{
						path: 'snake',
						name: 'Snake',
						meta: {
							title: '桑吉图数据',
							deep: 3,
							filePath: 'DataApplication/snake'
						},
						component: () => import("@/views/DataApplication/snake"),
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
						component: () => import("@/views/Qianchuan/items"),
					},
					{
						path: 'strategy',
						name: 'Strategy',
						meta: {
							title: '策略',
							deep: 3,
							filePath: 'Qianchuan/strategy'
						},
						component: () => import("@/views/Qianchuan/strategy")
					},
					{
						path: 'modules',
						name: 'Modules',
						meta: {
							title: '模板',
							deep: 3,
							filePath: 'Qianchuan/modules'
						},
						component: () => import("@/views/Qianchuan/modules"),
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
					component: () => import("@/views/BudgetAlarm/alarm"),
				},
				{
					path: 'budget',
					name: 'Budget',
					meta: {
						title: '预算',
						deep: 3,
						filePath: 'BudgetAlarm/alarm'
					},
					component: () => import("@/views/BudgetAlarm/alarm"),
				} ]
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
						component: () => import("@/views/Kuaiche/effect"),
					},
					{
						path: 'charts',
						name: 'Charts',
						meta: {
							title: '图表',
							deep: 3,
							filePath: 'Kuaiche/effect'
						},
						component: () => import("@/views/Kuaiche/effect")
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
						component: () => import("@/views/PublicData/bidding"),

					},
					{
						path: 'active',
						name: 'Active',
						meta: {
							title: '活动页面SKU',
							deep: 3,
							filePath: 'PublicData/active'
						},
						component: () => import("@/views/PublicData/active"),

					},
					{
						path: 'market',
						name: 'Market',
						meta: {
							title: '京东市场监控',
							deep: 3,
							filePath: 'PublicData/market'
						},
						component: () => import("@/views/PublicData/market"),

					},
					{
						path: 'brand',
						name: 'Brand',
						meta: {
							title: '品牌SKU获取',
							deep: 3,
							filePath: 'PublicData/brand'
						},
						component: () => import("@/views/PublicData/brand"),
					}
				]
			},
		]
	},
	{
		path: '*',
		name: '404',
		meta: {
			deep: 1
		},
		component: () => import("@/views/404"),
	},

]
export default routes;