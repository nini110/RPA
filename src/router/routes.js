import login from '@/views/login.vue'
import layout from '@/views/layout'
import layout2 from '@/views/layout/index2.vue'

// 巨量千川
// import Homeitem from '@/views/ThirdPartyTools/child/Homeitem.vue'


const routes = [
	//login页面
	{
		path: '/login',
		name: 'login',
		component: login,
		meta: {
			layout: 'login'
		}
	},
	{
		path: '/',
		name: 'Home',
		component: () => import("@/views/Home/index"),
	},
	{
		path: '/layout2',
		name: 'layout2',
		component: layout2,
		children: [
			// 巨量千川--实时看板
			{
				path: 'qianchuan',
				name: 'Qianchuan',
				component: () => import("@/views/Qianchuan"),
				children: [{
					path: 'realTime',
					name: 'RealTime',
					meta: {
						title: 'RealTime'
					},
					component: () => import("@/views/Qianchuan/realTime"),
				}]
			},
			// 提质--效果列表
			{
				path: 'kuaiche',
				name: 'Kuaiche',
				component: () => import("@/views/Kuaiche"),
				children: [{
						path: 'effect',
						name: 'Effect',
						meta: {
							title: '效果变化'
						},
						component: () => import("@/views/Kuaiche/effect"),
					}
				]
			},


		]
	},
	{
		path: '/layout',
		name: 'layout',
		component: layout,
		children: [{
				path: 'beijingMustPass',
				name: 'BeijingMustPass',
				component: () => import("../views/BeijingMustPass"),
				children: [{
						path: 'DMP',
						name: 'DMP',
						meta: {
							title: 'DMP'
						},
						component: () => import("@/views/BeijingMustPass"),
					},
					{
						path: 'Booth',
						name: 'Booth',
						meta: {
							title: '京东展位'
						},
						component: () => import("@/views/BeijingMustPass"),
					},
					{
						path: 'Direct',
						name: 'Direct',
						meta: {
							title: '京东直投'
						},
						component: () => import("@/views/BeijingMustPass"),
					},
					{
						path: 'Cube',
						name: 'Cube',
						meta: {
							title: '京腾魔方'
						},
						component: () => import("@/views/BeijingMustPass"),
					},
					{
						path: 'People',
						name: 'People',
						meta: {
							title: '京腾人群方向'
						},
						component: () => import("@/views/BeijingMustPass"),
					},
					{
						path: 'GoShop',
						name: 'GoShop',
						meta: {
							title: '购物触点'
						},
						component: () => import("@/views/BeijingMustPass"),
					},
					{
						path: 'Mail',
						name: 'Mail',
						component: () => import("@/views/BeijingMustPass"),
					},
				]
			},
			{
				path: 'bigData',
				name: 'BigData',
				component: () => import("../views/BigData"),
				children: [{
						path: 'Number',
						name: 'Number',
						meta: {
							title: '数坊人群圈选'
						},
						component: () => import("@/views/BigData"),
					},
					{
						path: 'Activity',
						name: 'Activity',
						meta: {
							title: '营销活动人群'
						},
						component: () => import("@/views/BigData"),
					},
					{
						path: 'Analysis',
						name: 'Analysis',
						meta: {
							title: '自定义分析创建'
						},
						component: () => import("@/views/BigData"),
					},
					{
						path: 'Difference',
						name: 'Difference',
						meta: {
							title: '数坊人群交并差集'
						},
						component: () => import("@/views/BigData"),
					},
					{
						path: 'Population',
						name: 'Population',
						meta: {
							title: '营销人群追踪'
						},
						component: () => import("@/views/BigData"),
					},
				]
			},
			// 数据应用  
			{
				path: 'dataApplication',
				name: 'DataApplication',
				component: () => import("../views/DataApplication"),
				children: [{
						path: 'tabulation',
						name: 'Tabulation',
						meta: {
							title: '灵鲨制表'
						},
						component: () => import("@/views/DataApplication/tabulation/index"),
					},
					{
						path: 'monitor',
						name: 'Monitor',
						meta: {
							title: '竞标监控'
						},
						component: () => import("@/views/DataApplication/monitor"),
					},
					{
						path: 'snake',
						name: 'Snake',
						meta: {
							title: '桑吉图数据'
						},
						component: () => import("@/views/DataApplication/snake"),
					}
				]
			},
			//视频工具  
			{
				path: 'videoTools',
				name: 'VideoTools',
				component: () => import("../views/VideoTools"),
				children: [{
						path: 'pictureProcessing',
						name: 'PictureProcessing',
						meta: {
							title: '图片处理'
						},
						component: () => import("@/views/VideoTools/child/PictureProcessing.vue"),
					},
					{
						path: 'cutOut',
						name: 'CutOut',
						meta: {
							title: '截取'
						},
						component: () => import("@/views/VideoTools/child/CutOut.vue"),
					},
					{
						path: 'piece',
						name: 'Piece',
						meta: {
							title: '拼合'
						},
						component: () => import("@/views/VideoTools/child/Piece.vue"),
					}
				]
			},
			// 巨量千川
			{
				path: 'qianchuan',
				name: 'Qianchuan',
				component: () => import("@/views/Qianchuan"),
				children: [{
						path: 'items',
						name: 'Items',
						meta: {
							title: '项目'
						},
						component: () => import("@/views/Qianchuan/items"),
					},
					{
						path: 'strategy',
						name: 'Strategy',
						meta: {
							title: '策略'
						},
						component: () => import("@/views/Qianchuan/strategy")
					},
					{
						path: 'modules',
						name: 'Modules',
						meta: {
							title: '模板'
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
				component: () => import("@/views/BudgetAlarm"),
				children: [{
					path: 'alarm',
					name: 'Alarm',
					meta: {
						title: '预警'
					},
					component: () => import("@/views/BudgetAlarm/alarm/index2.vue"),
				}, ]
			},
			// 快车提质
			{
				path: 'kuaiche',
				name: 'Kuaiche',
				component: () => import("@/views/Kuaiche"),
				children: [{
						path: 'effect',
						name: 'Effect',
						meta: {
							title: '效果变化'
						},
						component: () => import("@/views/Kuaiche/effect"),
					},
					{
						path: 'charts',
						name: 'Charts',
						meta: {
							title: '图表'
						},
						component: () => import("@/views/Kuaiche/effect")
					}
				]
			},

			// 公共数据获取
			{
				path: 'publicDomainDataAcquisition',
				name: 'PublicDomainDataAcquisition',
				component: () => import("../views/PublicDomainDataAcquisition"),
				children: [{
						path: 'jingdongBidding',
						name: 'JingdongBidding',
						meta: {
							title: '京东招标'
						},
						component: () => import("@/views/PublicDomainDataAcquisition/child/JingdongBidding.vue"),

					},
					{
						path: 'activePageSKU',
						name: 'ActivePageSKU',
						meta: {
							title: '活动页面SKU'
						},
						component: () => import("@/views/PublicDomainDataAcquisition/child/ActivePageSKU.vue"),

					},
					{
						path: 'howToMonitor',
						name: 'HowToMonitor',
						meta: {
							title: '京东市场监控'
						},
						component: () => import("@/views/PublicDomainDataAcquisition/child/HowToMonitor.vue"),

					},
					{
						path: 'brandSKUAcquisition',
						name: 'BrandSKUAcquisition',
						meta: {
							title: '品牌SKU获取'
						},
						component: () => import("@/views/PublicDomainDataAcquisition/child/BrandSKUAcquisition.vue"),
					}
				]
			}
		]
	}
]
export default routes;