<template>
	<div class="layout" :class="{'single':$route.name ==='RealTime'}">
		<el-menu v-if="$route.name !=='RealTime'" :default-active="currentMenu"
			class="el-menu-vertical-demo layout_menu" unique-opened active-text-color="#2066BD">
			<div v-for="(item, idx) in menuList" :key="idx" class="layout_menu_box">
				<el-submenu v-if="item.children" :index="item.index">
					<template slot="title">
						<i :class="item.icon"></i>
						<span>{{item.label}}</span>
					</template>
					<div v-if="item.deep === 3">
						<el-submenu v-for="(item1, idx1) in item.children" :key="idx1" :index="item1.index">
							<template slot="title">
								<el-divider class="fenge" content-position="right">{{item1.label}}</el-divider>
							</template>
							<el-menu-item v-for="(item2, idx2) in item1.children" :key="idx2" :index="item2.index"
								@click="selectEvent(item2)">{{item2.label}}</el-menu-item>
						</el-submenu>
					</div>
					<div v-else>
						<el-menu-item-group>
							<el-menu-item v-for="(item1, idx1) in item.children" :key="idx1" :index="item1.index"
								@click="selectEvent(item1)">
								{{item1.label}}
							</el-menu-item>
						</el-menu-item-group>
					</div>
				</el-submenu>
				<el-menu-item v-else index="2">
					<i class="el-icon-menu"></i>
					<span slot="title">{{item.label}}</span>
				</el-menu-item>
			</div>
		</el-menu>
		<div class="layout_menu_right">
			<div class="app-main" id="appMain">
				<router-view class="app-router-view" />
			</div>
		</div>

	</div>
</template>
<script>
	export default {
		name: 'layout',
		data() {
			return {
				currentMenu: '1-1',
				menuList: [{
						label: '提效工具',
						deep: 2,
						icon: 'iconfont icon-shouzhi',
						value: '',
						index: '1',
						children: [{
								label: 'DMP',
								value: '/layout/beijingMustPass/DMP',
								index: '1-1'
							},
							{
								label: '京东展位',
								value: '/layout/beijingMustPass/Booth',
								index: '1-2'
							},
							{
								label: '京东直投',
								value: '/layout/beijingMustPass/Direct',
								index: '1-3'
							},
							{
								label: '京腾魔方',
								value: '/layout/beijingMustPass/Cube',
								index: '1-4'
							},
							{
								label: '京腾人群方向',
								value: '/layout/beijingMustPass/People',
								index: '1-5'
							}
						]
					},
					{
						label: '大数据工具',
						deep: 2,
						icon: 'iconfont icon-gongju',
						value: '',
						index: '2',
						children: [{
								label: '数坊人群圈选',
								value: '/layout/bigData/Number',
								index: '2-1'
							},
							{
								label: '营销活动人群',
								value: '/layout/bigData/Activity',
								index: '2-2'
							},
							{
								label: '自定义分析创建',
								value: '/layout/bigData/Analysis',
								index: '2-3'
							},
							{
								label: '数坊人群交并差集',
								value: '/layout/bigData/Difference',
								index: '2-4'
							},
							{
								label: '营销人群追踪',
								value: '/layout/bigData/Population',
								index: '2-5'
							}
						]
					},
					{
						label: '数据应用',
						deep: 2,
						icon: 'iconfont icon-shujutongji',
						value: '',
						index: '3',
						children: [{
								label: '灵鲨制表',
								value: '/layout/dataApplication/spiritSharkTabulation',
								index: '3-1'
							},
							{
								label: '竞标监控',
								value: '/layout/dataApplication/biddingForMonitoring',
								index: '3-2'
							},
							{
								label: '桑吉图数据',
								value: '/layout/dataApplication/sankey',
								index: '3-3'
							}
						]
					},
					{
						label: '视频工具',
						deep: 2,
						icon: 'iconfont icon-charutupian',
						value: '',
						index: '4',
						children: [{
								label: '图片处理',
								value: '/layout/videoTools/pictureProcessing',
								index: '4-1'
							},
							{
								label: '截取',
								value: '/layout/videoTools/cutOut',
								index: '4-2'
							},
							{
								label: '拼合',
								value: '/layout/videoTools/piece',
								index: '4-3'
							}
						]
					},
					{
						label: '提质工具',
						deep: 3,
						icon: 'iconfont icon-xiangmu',
						value: '',
						index: '5',
						children: [{
								label: '巨量千川',
								value: '',
								index: '5-1',
								children: [{
										label: '项目',
										value: '/layout/qianchuan/items',
										index: '5-1-1'
									},
									{
										label: '策略',
										value: '/layout/qianchuan/strategy',
										index: '5-1-2'
									},
									{
										label: '模板',
										value: '/layout/qianchuan/modules',
										index: '5-1-3'
									}
								]
							},
							{
								label: '快车提质',
								icon: 'iconfont icon-xiangmu',
								value: '',
								index: '5-2',
								children: [{
										label: '效果变化',
										value: '/layout/kuaiche/effect',
										index: '5-2-1'
									},
									{
										label: '修改记录',
										value: '/layout/kuaiche/record',
										index: '5-2-2'
									}
								]
							},
						]
					},
					{
						label: '公共数据获取',
						deep: 2,
						icon: 'iconfont icon-gonggongziliao',
						value: '',
						index: '6',
						children: [{
								label: '京东招标',
								value: '/layout/publicDomainDataAcquisition/jingdongBidding',
								index: '6-1'
							},
							{
								label: '活动页面SKU',
								value: '/layout/publicDomainDataAcquisition/activePageSKU',
								index: '6-2'
							},
							{
								label: '京东市场监控',
								value: '/layout/publicDomainDataAcquisition/howToMonitor',
								index: '6-3'
							},
							{
								label: '品牌SKU获取',
								value: '/layout/publicDomainDataAcquisition/brandSKUAcquisition',
								index: '6-4'
							}
						]
					}
				]
			}
		},
		mounted() {
			const vm = this;
			for (let i of vm.menuList) {
				for (let j of i.children) {
					if (i.deep === 2) {
						if (vm.$route.fullPath === j.value) {
							vm.currentMenu = j.index;
							break
						}
					} else if (i.deep === 3) {
						for (let k of j.children) {
							if (vm.$route.fullPath === k.value) {
								vm.currentMenu = k.index;
								break
							}
						}
					}
				}
			}
		},
		methods: {
			selectEvent(item) {
				const vm = this;
				vm.$router.push(item.value)
			}
		}
	}
</script>
<style lang="less" scoped>
	@import 'index';

	.app-main {
		height: 100%;
	}
</style>
