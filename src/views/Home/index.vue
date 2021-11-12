<template>
	<div style="height: 100%">
		<div class="home1"></div>
		<div class="home">
			<div class="home_menu">
				<div class="home_menu_left">
					<div  v-for="(item, idx) in homeMenu" :key="idx" class="box" @click="overevent(idx)">
						<p :class="item.icon" class="home_menu_title">{{ item.label }}</p>
					</div>
				</div>
				    <el-carousel ref="carousel" indicator-position="outside" :autoplay="false" direction='vertical'>
				      <el-carousel-item v-for="(item, idx) in homeMenu" :key="idx">
						<ul class="home_menu_right" :class="{'active':hoverFlag===idx}">
							<li class="ts" @click="routerLink">
								<div>
									<p class="t">{{ currentBox.title }}</p>
									<p class="st">{{ currentBox.subtitle }}</p>
								</div>
							</li>
							<li v-for="(item1, idx1) in item.child" :key="idx1" class="normal"
								@click="routerLink" @mouseover="suboverevent(item1)">
								<div>
									<p class="t">{{ item1.title }}</p>
									<p class="st">{{ item1.subtitle }}</p>
								</div>
							</li>
						</ul>
				      </el-carousel-item>
				    </el-carousel>
			</div>
		</div>
	</div>
</template>
<script>
	import debounce from "lodash.debounce";
	export default {
		name: "Home",
		data() {
			return {
				currentBox: {},
				hoverFlag: 0,
				homeMenu: [{
						label: "提效工具",
						icon: "iconfont icon-shouzhi",
						class: "active",
						child: [{
								title: "DMP",
								class: "",
								url: "/layout/beijingMustPass/DMP",
								img: require("../../assets/images/hg_01.png"),
								subtitle: "批量化快速创建人群",
							},
							{
								title: "京东展位",
								class: "",
								url: "/layout/beijingMustPass/Booth",
								img: require("../../assets/images/hg_02.png"),
								subtitle: "批量化创建京东展位计划",
							},
							{
								title: "京东直投",
								class: "",
								url: "/layout/beijingMustPass/Direct",
								img: require("../../assets/images/hg_03.png"),
								subtitle: "京东展位批量化创建工具",
							},
							{
								title: "京腾魔方",
								class: "",
								url: "/layout/beijingMustPass/Cube",
								img: require("../../assets/images/hg_05.png"),
			 				subtitle: "批量化快速创建京腾人群",
							},
							{
								title: "京腾人群定向",
								class: "",
								url: "/layout/beijingMustPass/People",
								img: require("../../assets/images/hg_04.png"),
								subtitle: "京腾人群定向批量化快速创建人群",
							},
							{
								title: "购物触点",
								class: "",
								url: "/layout/beijingMustPass/GoShop",
								img: require("../../assets/images/hg_04.png"),
								subtitle: "暂无描述",
							},

						],
					},
					{
						label: "大数据工具",
						icon: "iconfont icon-gongju",
						class: "",
						child: [{
								title: "数坊人群圈选",
								class: "",
								url: "/layout/bigData/Number",
								img: require("../../assets/images/hg_06.png"),
								subtitle: "京东批量人群维度圈定工具",
							},
							{
								title: "营销活动人群",
								class: "",
								url: "/layout/bigData/Activity",
								img: require("../../assets/images/hg_07.png"),
								subtitle: "京东数坊营销人群追踪工具",
							},
							{
								title: "数坊自定义分析",
								class: "",
								url: "/layout/bigData/Analysis",

								img: require("../../assets/images/hg_08.png"),
								subtitle: "京东数坊自定义分析工具",
							},
							{
								title: "数坊交并差集",
								class: "",
								url: "/layout/bigData/Difference",

								img: require("../../assets/images/hg_09.png"),
								subtitle: "数坊已有人群交并差集",
							},
							{
								title: "营销人群追踪",
								class: "",
								url: "/layout/bigData/Population",
								img: require("../../assets/images/hg_10.png"),
								subtitle: "创建营销活动追踪报告",
							},
						],
					},
					{
						label: "数据应用",
						icon: "iconfont icon-shujutongji",
						class: "",
						child: [{
								title: "灵鲨制表",
								class: "",
								url: "/layout/dataApplication/spiritSharkTabulation",
								img: require("../../assets/images/hg_11.png"),
								subtitle: "自定义报表工具",
							},
							{
								title: "竞标监控",
								class: "",
								url: "/layout/dataApplication/biddingForMonitoring",
								img: require("../../assets/images/hg_12.png"),
								subtitle: "监控竞标项目消耗情况及时提醒",
							},
							{
								title: "桑基图数据",
								class: "",
								url: "/layout/dataApplication/sankey",
								img: require("../../assets/images/hg_13.png"),
								subtitle: "桑基图数据",
							},
						],
					},
					{
						label: "图片视频工具",
						icon: "iconfont icon-charutupian",
						class: "",
						child: [{
								title: "图片处理",
								class: "",
								url: "/layout/videoTools/pictureProcessing",
								img: require("../../assets/images/hg_14.png"),
								subtitle: "一键调整图片尺寸和大小",
							},
							{
								title: "截取",
								class: "",
								url: "/layout/videoTools/cutOut",
								img: require("../../assets/images/hg_15.png"),
								subtitle: "通过预设的锚点智能截取视频",
							},
							{
								title: "拼合",
								class: "",
								url: "/layout/videoTools/piece",
								img: require("../../assets/images/hg_16.png"),
								subtitle: "将视频图片音频智能拼合成视频",
							},
						],
					},
					{
						label: "提质工具",
						icon: "iconfont icon-xiangmu",
						class: "",
						child: [{
								title: "巨量千川",
								class: "",
								url: "/layout/qianchuan/items",
								img: require("../../assets/images/hg_17.png"),
								subtitle: "数智投一体效质翻倍",
							},
							{
								title: "快车提质",
								class: "",
								url: "/layout/kuaiche/effect",
								img: require("../../assets/images/hg_17.png"),
								subtitle: "数智投一体效质翻倍",
							},
						],
					},
					{
						label: "公域数据获取",
						icon: "iconfont icon-gonggongziliao",
						class: "",
						child: [{
								title: "京东招标",
								class: "",
								url: "/layout/publicDomainDataAcquisition/jingdongBidding",
								img: require("../../assets/images/hg_18.png"),
								subtitle: "招标信息爬取入库发送变更通知",
							},
							{
								title: "活动页面SKU",
								class: "",
								url: "/layout/publicDomainDataAcquisition/activePageSKU",
								img: require("../../assets/images/hg_19.png"),
								subtitle: "批量获取京东活动页商品SKU",
							},
							{
								title: "京东市场监控",
								class: "",
								url: "/layout/publicDomainDataAcquisition/howToMonitor",
								img: require("../../assets/images/hg_20.png"),
								subtitle: "了解京东特定市场每日变化",
							},
							{
								title: "品牌SKU获取",
								class: "",
								url: "/layout/publicDomainDataAcquisition/brandSKUAcquisition",
								img: require("../../assets/images/hg_21.png"),
								subtitle: "获取某一店铺品牌下SKU",
							},
						],
					},
				],
			};
		},
		mounted() {
			const vm = this;
			vm.$nextTick(() => {
				vm.currentBox = vm.homeMenu[0].child[0]
				vm.homeMenu.forEach((val, idx) => {
					vm.$set(val, val.class, idx === 0 ? "active" : "");
				});
			});
		},
		methods: {
			routerLink() {
				this.$router.push(this.currentBox.url);
			},
			// 使用鼠标划入mouseenter事件
			// overevent: debounce(function(idx) {
			// 	this.$refs.carousel.setActiveItem(idx)
			// }, 700),
			// 使用click事件
			overevent(idx) {
				this.currentBox = this.homeMenu[idx].child[0]
				this.$refs.carousel.setActiveItem(idx)
			},
			suboverevent(val) {
				const vm = this;
				vm.currentBox = val
			},
		},
	};
</script>
<style lang="less" scoped>
	@import "./index";
</style>
