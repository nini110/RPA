<template>
	<div class="nav">
		<div id="nav">
			<div class="navItem">
				<el-menu :default-active="$route.matched[0].path==''?'/':$route.matched[0].path"
					class="el-menu-vertical-demo w215" :unique-opened="true" router @mouseleave.native="itemMouseout()">
					<el-menu-item index="/beijingMustPass" @mouseenter.native="itemHoverOut(2)"
						>
						<span slot="title">京准通工具</span>
						<!-- <navbar class="navItemTab" :pathData="itemRoutePath" v-if="flag === 2"></navbar> -->
					</el-menu-item>
					<el-menu-item index="/bigData" @mouseenter.native="itemHoverOut(3)"
						>
						<span slot="title">大数据工具</span>
						<!-- <navbar class="navItemTab" :pathData="itemRoutePath" v-if="flag === 3"></navbar> -->
					</el-menu-item>
					<el-menu-item index="/dataApplication" @mouseenter.native="itemHoverOut(4)"
						>
						<span slot="title">数据应用</span>
						<!-- <navbar class="navItemTab" :pathData="itemRoutePath" v-if="flag === 4"></navbar> -->
					</el-menu-item>
					<el-menu-item index="/videoTools" @mouseenter.native="itemHoverOut(5)"
						>
						<span slot="title">视频工具</span>
						<!-- <navbar class="navItemTab" :pathData="itemRoutePath" v-if="flag === 5"></navbar> -->
					</el-menu-item>
					<el-menu-item index="/thirdPartyTools" @mouseenter.native="itemHoverOut(6)"
						>
						<span slot="title">巨量千川</span>
						<!-- <navbar class="navItemTab" :pathData="itemRoutePath" v-if="flag === 6"></navbar> -->
					</el-menu-item>
					<el-menu-item index="/publicDomainDataAcquisition" @mouseenter.native="itemHoverOut(7)"
						>
						<span slot="title">公共数据获取</span>
						<!-- <navbar class="navItemTab" :pathData="itemRoutePath" v-if="flag === 7"></navbar> -->
					</el-menu-item>
					<navbar class="navItemTab navItemTab2" :pathData="itemRoutePath" v-if="flag === 2"></navbar>
					<navbar class="navItemTab navItemTab3" :pathData="itemRoutePath" v-if="flag === 3"></navbar>
					<navbar class="navItemTab navItemTab4" :pathData="itemRoutePath" v-if="flag === 4"></navbar>
					<navbar class="navItemTab navItemTab5" :pathData="itemRoutePath" v-if="flag === 5"></navbar>
					<navbar class="navItemTab navItemTab6" :pathData="itemRoutePath" v-if="flag === 6"></navbar>
					<navbar class="navItemTab navItemTab7" :pathData="itemRoutePath" v-if="flag === 7"></navbar>
				</el-menu>
			</div>
		</div>
	</div>
</template>

<script>
	import navbar from './itemNav.vue'
	export default {
		data() {
			return {
				flag: 0,
				itemRoutePath: []
			};
		},
		components: {
			navbar
		},
		methods: {
			routerLink(routers) {
				this.$router.replace(routers, () => {}, () => {})
			},
			itemMouseout() {
				this.flag = 0;
			},
			itemHoverOut(num) {
				this.flag = num;
				if (this.flag === 2) {
					this.itemRoutePath = [{
							path: '/beijingMustPass/DMP',
							name: 'DMP'
						},
						// {
						//  path:'/beijingMustPass/directMail',
						//  name:'定向直投'
						// },
						{
							path: '/beijingMustPass/jingdongBooth',
							name: '京东展位'
						},
						{
							path: '/beijingMustPass/jingdongDirectInvestment',
							name: '京东直投'
						},
						{
							path: '/beijingMustPass/peopleOriented',
							name: '京腾人群定向'
						},
						{
							path: '/beijingMustPass/rubiksCube',
							name: '京腾魔方'
						}
					]
				} else if (this.flag === 3) {
					this.itemRoutePath = [{
							path: '/bigData/numberOfLaneCrowd',
							name: '数坊人群圈选'
						},
						{
							path: '/bigData/marketingActivityCrowds',
							name: '营销活动人群'
						},
						{
							path: '/bigData/customAnalysisCreation',
							name: '自定义分析创建'
						},
						{
							path: '/bigData/crowdCrossAndMergeDifferenceSet',
							name: '数坊人群交并差集'
						},
						{
							path: '/bigData/marketingPopulationTracking',
							name: '营销人群追踪'
						}
					]
				} else if (this.flag === 4) {
					this.itemRoutePath = [{
							path: '/dataApplication/spiritSharkTabulation',
							name: '灵鲨制表'
						},
						{
							path: '/dataApplication/biddingForMonitoring',
							name: '竞标监控'
						},
						{
							path: '/dataApplication/sankey',
							name: '桑基图数据'
						}
					]
				} else if (this.flag === 5) {
					this.itemRoutePath = [{
							path: '/videoTools/pictureProcessing',
							name: '图片处理'
						},
						{
							path: '/videoTools/cutOut',
							name: '截取'
						},
						{
							path: '/videoTools/piece',
							name: '拼合'
						}
					]
				} else if (this.flag === 6) {
					this.itemRoutePath = [{
						path: '/thirdPartyTools/item',
						name: '项目'
					},{
						path: '/thirdPartyTools/homeitem',
						name: '策略'
					},{
						path: '/thirdPartyTools/formBoard',
						name: '模板'
					}]
				} else if (this.flag === 7) {
					this.itemRoutePath = [{
							path: '/publicDomainDataAcquisition/jingdongBidding',
							name: '京东招标'
						},
						{
							path: '/publicDomainDataAcquisition/activePageSKU',
							name: '活动页面SKU'
						},
						{
							path: '/publicDomainDataAcquisition/howToMonitor',
							name: '京东市场监控'
						},
						{
							path: '/publicDomainDataAcquisition/brandSKUAcquisition',
							name: '品牌SKU获取'
						}
					]
				}
			}
		},
		created() {},
		mounted() {},
	}
</script>
<style lang="less">
	.nav {
		width: 1200px;
		margin: 0 auto;
		background-color: #000000;
		#nav {
			display: flex;

			.navItem {
				.w215 {
					width: 215px;
					height: 2000px;
					text-align: center;
					position: fixed;
					top: 80px;
					z-index: 2000;
					.is-active{
						background-color: #0051B3;
						color: #fff;
					}
					.navItemTab {
						position: absolute;
						top: 0;
						left: 216px;
					}
					.navItemTab3{
						top: 56px;
					}
					.navItemTab4{
						top: 112px;
					}
					.navItemTab5{
						top: 168px;
					}
					.navItemTab6{
						top: 224px;
					}
					.navItemTab7{
						top: 280px;
					}
				}
			}
		}
	}
</style>
