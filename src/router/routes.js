import Home from '../views/Home.vue'
import login from '../login.vue'
import layout from '@/views/layout'

// 巨量千川
import Homeitem from '../views/jvliang/Homeitem.vue'


const routes = [
   //login页面
   {path:'/login',name:'login',component:login,
       meta:{
           layout:'login'
       }
   },
  	{
  	  path: '/',
  	  name: 'Home',
  	},
	{
		path: '/layout',
		name: 'layout',
		component: layout,
		children:[
		{
			path: 'beijingMustPass',
			name: 'BeijingMustPass',
			component: () => import("../views/BeijingMustPass"),
			children:[
			  {
				  path:'DMP',
				  name:'DMP',
				  meta: {
					  title: 'DMP'
				  },
				  component: () => import("@/views/BeijingMustPass/child/DMP.vue"),
			  },
			  {
				  path:'jingdongBooth',
				  name:'JingdongBooth',
				  meta: {
					  title: '京东展位'
				  },
				  component: () => import("@/views/BeijingMustPass/child/JingdongBooth.vue"),
			  },
			  {
				  path:'jingdongDirectInvestment',
				  name:'JingdongDirectInvestment',
				  meta: {
					  title: '京东直投'
				  },
				  component: () => import("@/views/BeijingMustPass/child/JingdongDirectInvestment.vue"),
			  },
			  {
				  path:'rubiksCube',
				  name:'RubiksCube',
				  meta: {
					  title: '京腾魔方'
				  },
				  component: () => import("@/views/BeijingMustPass/child/RubiksCube.vue"),
			  },
			  {
				  path:'peopleOriented',
				  name: 'PeopleOriented',
				  meta: {
					  title: '京腾人群方向'
				  },
				  component: () => import("@/views/BeijingMustPass/child/PeopleOriented.vue"),
			  },
			  {
				  path:'directMail',
				  name:'DirectMail',
				  component: () => import("@/views/BeijingMustPass/child/DirectMail.vue"),
			  },
		  ]
		},
		{
			path: '/bigData',
			name: 'BigData',
			component: () => import("../views/BigData"),
			redirect:'/bigData/numberOfLaneCrowd',
			children:[
				{
					path:'numberOfLaneCrowd',
					name:'NumberOfLaneCrowd',
					meta: {
						title: '数坊人群圈选'
					},
					component: () => import("@/views/BigData/child/NumberOfLaneCrowd.vue"),
				},
				{
					path:'marketingActivityCrowds',
					name:'MarketingActivityCrowds',
					meta: {
						title: '营销活动人群'
					},
					component: () => import("@/views/BigData/child/MarketingActivityCrowds.vue"),
				},
				{
					path:'customAnalysisCreation',
					name:'CustomAnalysisCreation',
					meta: {
						title: '自定义分析创建'
					},
					component: () => import("@/views/BigData/child/CustomAnalysisCreation.vue"),
				},
				{
					path:'crowdCrossAndMergeDifferenceSet',
					name:'CrowdCrossAndMergeDifferenceSet',
					meta: {
						title: '数坊人群交并差集'
					},
					component: () => import("@/views/BigData/child/CrowdCrossAndMergeDifferenceSet.vue"),
				},
				{
					path:'marketingPopulationTracking',
					name:'MarketingPopulationTracking',
					meta: {
						title: '营销人群追踪'
					},
					component: () => import("@/views/BigData/child/MarketingPopulationTracking.vue"),
				},
			]
		},
		// 数据应用  
		{
			path: '/dataApplication',
			name: 'DataApplication',
			component: () => import("../views/DataApplication"),
			redirect:'/dataApplication/spiritSharkTabulation',
			children:[
				{
					path:'spiritSharkTabulation',
					name:'SpiritSharkTabulation',
					meta: {
						title: '灵鲨制表'
					},
					component: () => import("@/views/DataApplication/child/SpiritSharkTabulation.vue"),
				},
				{
					path:'biddingForMonitoring',
					name:'BiddingForMonitoring',
					meta: {
						title: '竞标监控'
					},
					component: () => import("@/views/DataApplication/child/BiddingForMonitoring.vue"),
				},
				{
					path:'sankey',
					name:'Sankey',
					meta: {
						title: '桑吉图数据'
					},
					component: () => import("@/views/DataApplication/child/Sanke.vue"),
				}
			]
		},
		//视频工具  
		{
			path: '/videoTools',
			name: 'VideoTools',
			component: () => import("../views/VideoTools"),
			redirect:'/videoTools/pictureProcessing',
			children:[
				{
					path:'pictureProcessing',
					name:'PictureProcessing',
					meta: {
						title: '图片处理'
					},
					component: () => import("@/views/VideoTools/child/PictureProcessing.vue"),
				},
				{
					path:'cutOut',
					name:'CutOut',
					meta: {
						title: '截取'
					},
					component: () => import("@/views/VideoTools/child/CutOut.vue"),
				},
				{
					path:'piece',
					name:'Piece',
					meta: {
						title: '拼合'
					},
					component: () => import("@/views/VideoTools/child/Piece.vue"),
				}
			]
		},
		  // 巨量千川
		  {
			path: '/thirdPartyTools',
			name: 'ThirdPartyTools',
			component: () => import("../views/ThirdPartyTools"),
			redirect:'/thirdPartyTools/item',
			children:[
				{
					path: 'item',
					name: 'Items',
					meta: {
						title: '项目'
					},
					component: () => import("../views/jvliang/Items.vue"),
				  },
				{
					path:'homeitem', 
					name: Homeitem,
					meta: {
						title: '策略'
					},
					component: () => import("../views/jvliang/Homeitem.vue"),

				},
				{
					path: 'formBoard',
					name: 'FormBoard',
					meta: {
						title: '模板'
					},
					component: () => import("../views/jvliang/FormBoard.vue"),
				  },
				{
					path:'plan',
					name: 'Plan',
					meta: {
						title: 'plan'
					},
					component: () => import("../views/jvliang/Plan.vue"),

				},
				{
					path: 'realTime',
					name: 'RealTime',
					meta: {
						title: 'RealTime'
					},
					component: () => import("../views/jvliang/RealTime.vue"),
				}
			]
		  },
		  // 公共数据获取
		  {
			path: '/publicDomainDataAcquisition',
			name: 'PublicDomainDataAcquisition',
			component: () => import("../views/PublicDomainDataAcquisition"),
			redirect:'/publicDomainDataAcquisition/jingdongBidding',
			children:[
				{
					path:'jingdongBidding',
					name:'JingdongBidding',
					meta: {
						title: '京东招标'
					},
					component: () => import("@/views/PublicDomainDataAcquisition/child/JingdongBidding.vue"),

				},
				{
					path:'activePageSKU',
					name:'ActivePageSKU',
					meta: {
						title: '活动页面SKU'
					},
					component: () => import("@/views/PublicDomainDataAcquisition/child/ActivePageSKU.vue"),

				},
				{
					path:'howToMonitor',
					name:'HowToMonitor',
					meta: {
						title: '京东市场监控'
					},
					component: () => import("@/views/PublicDomainDataAcquisition/child/HowToMonitor.vue"),

				},
				{
					path:'brandSKUAcquisition',
					name:'BrandSKUAcquisition',
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