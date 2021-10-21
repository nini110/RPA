import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import BigData from '../views/BigData.vue'
import BeijingMustPass from '../views/BeijingMustPass.vue'
import DataApplication from '../views/DataApplication.vue'
import VideoTools from '../views/VideoTools.vue'
import ThirdPartyTools from '../views/ThirdPartyTools.vue'
import PublicDomainDataAcquisition from '../views/PublicDomainDataAcquisition.vue'

import login from '../login.vue'

// 二级路由
import DMP from '../components/BeijingMustPass/DMP.vue'
import DirectMail from '@/components/BeijingMustPass/DirectMail.vue'
import JingdongBooth from '@/components/BeijingMustPass/JingdongBooth.vue'
import JingdongDirectInvestment from '@/components/BeijingMustPass/JingdongDirectInvestment.vue'
import RubiksCube from '@/components/BeijingMustPass/RubiksCube.vue'
import PeopleOriented from '@/components/BeijingMustPass/PeopleOriented.vue'

import NumberOfLaneCrowd from '@/components/BigData/NumberOfLaneCrowd.vue'
import MarketingActivityCrowds from '@/components/BigData/MarketingActivityCrowds.vue'
import CustomAnalysisCreation from '@/components/BigData/CustomAnalysisCreation.vue'
import CrowdCrossAndMergeDifferenceSet from '@/components/BigData/CrowdCrossAndMergeDifferenceSet.vue'
import MarketingPopulationTracking from '@/components/BigData/MarketingPopulationTracking.vue'

import SpiritSharkTabulation from '@/components/DataApplication/SpiritSharkTabulation.vue'
import BiddingForMonitoring from '@/components/DataApplication/BiddingForMonitoring.vue'
import Sankey from '@/components/DataApplication/Sanke.vue'

import PictureProcessing from '@/components/VideoTools/PictureProcessing.vue'
import CutOut from '@/components/VideoTools/CutOut.vue'
import Piece from '@/components/VideoTools/Piece.vue'

import JingdongBidding from '@/components/PublicDomainDataAcquisition/JingdongBidding.vue'
import ActivePageSKU from '@/components/PublicDomainDataAcquisition/ActivePageSKU.vue'
import HowToMonitor from '@/components/PublicDomainDataAcquisition/HowToMonitor.vue'
import BrandSKUAcquisition from '@/components/PublicDomainDataAcquisition/BrandSKUAcquisition.vue'

// 巨量千川
import Homeitem from '../views/jvliang/Homeitem.vue'
import Plan from '../views/jvliang/Plan.vue'
import RealTime from '../views/jvliang/RealTime.vue'
import FormBoard from '../views/jvliang/FormBoard.vue'
import Items from '../views/jvliang/Items.vue'
Vue.use(VueRouter)

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
    component: Home
  },
  {
    path: '/beijingMustPass',  //京准通工具
    name: 'BeijingMustPass',
    component: BeijingMustPass,
	redirect:'/beijingMustPass/DMP',
	children:[
		{
			path:'DMP',
			name:'DMP',
			component: DMP
		},
		{
			path:'directMail',
			name:'DirectMail',
			component: DirectMail
		},
		{
			path:'jingdongBooth',
			name:'JingdongBooth',
			component: JingdongBooth
		},
		{
			path:'jingdongDirectInvestment',
			name:'JingdongDirectInvestment',
			component: JingdongDirectInvestment
		},
		{
			path:'rubiksCube',
			name:'RubiksCube',
			component: RubiksCube
		},
		{
			path:'peopleOriented',
			name: 'PeopleOriented',
			component: PeopleOriented
		}
	]
  },
  {
    path: '/bigData',  //大数据工具
    name: 'BigData',
    // component: () => import('@/views/BigData.vue')
	component: BigData,
	redirect:'/bigData/numberOfLaneCrowd',
	children:[
		{
			path:'numberOfLaneCrowd',
			name:'NumberOfLaneCrowd',
			component: NumberOfLaneCrowd
		},
		{
			path:'marketingActivityCrowds',
			name:'MarketingActivityCrowds',
			component: MarketingActivityCrowds
		},
		{
			path:'customAnalysisCreation',
			name:'CustomAnalysisCreation',
			component: CustomAnalysisCreation
		},
		{
			path:'crowdCrossAndMergeDifferenceSet',
			name:'CrowdCrossAndMergeDifferenceSet',
			component: CrowdCrossAndMergeDifferenceSet
		},
		{
			path:'marketingPopulationTracking',
			name:'MarketingPopulationTracking',
			component: MarketingPopulationTracking
		},
	]
  },
  {
    path: '/dataApplication',  // 数据应用
    name: 'DataApplication',
    component: DataApplication,
	redirect:'/dataApplication/spiritSharkTabulation',
	children:[
		{
			path:'spiritSharkTabulation',
			name:'SpiritSharkTabulation',
			component:SpiritSharkTabulation
		},
		{
			path:'biddingForMonitoring',
			name:'BiddingForMonitoring',
			component:BiddingForMonitoring
		},
		{
			path:'sankey',
			name:'Sankey',
			component:Sankey 
		}
	]
  },
  {
    path: '/videoTools',  //视频工具
    name: 'VideoTools',
    component: VideoTools,
	redirect:'/videoTools/pictureProcessing',
	children:[
		{
			path:'pictureProcessing',
			name:'PictureProcessing',
			component:PictureProcessing
		},
		{
			path:'cutOut',
			name:'CutOut',
			component:CutOut
		},
		{
			path:'piece',
			name:'Piece',
			component:Piece
		}
	]
  },
  {
    path: '/thirdPartyTools',  //第三方工具
    name: 'ThirdPartyTools',
    component: ThirdPartyTools,
	redirect:'/thirdPartyTools/item',
	children:[
		{
			path:'homeitem',
			name: Homeitem,
			component: Homeitem
		},
		{
			path:'plan',
			name: 'Plan',
			component: Plan
		},
		{
			  path: 'realTime',
			  name: 'RealTime',
			  component: RealTime
		},
		{
			  path: 'formBoard',
			  name: 'FormBoard',
			  component: FormBoard
		},
		{
			  path: 'item',
			  name: 'Items',
			  component: Items
		}
	]
  },
  {
    path: '/publicDomainDataAcquisition',  //公域数据获取
    name: 'PublicDomainDataAcquisition',
    component: PublicDomainDataAcquisition,
	redirect:'/publicDomainDataAcquisition/jingdongBidding',
	children:[
		{
			path:'jingdongBidding',
			name:'JingdongBidding',
			component:JingdongBidding
		},
		{
			path:'activePageSKU',
			name:'ActivePageSKU',
			component:ActivePageSKU
		},
		{
			path:'howToMonitor',
			name:'HowToMonitor',
			component:HowToMonitor
		},
		{
			path:'brandSKUAcquisition',
			name:'BrandSKUAcquisition',
			component:BrandSKUAcquisition
		}
	]
  }
]

const router = new VueRouter({
  routes,
  mode:'hash'
})

export default router
