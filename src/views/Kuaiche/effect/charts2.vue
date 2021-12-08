<template>
	<div class="chartsBox">
		<div class="chartsBox_btm" style="height: 100%">
			<div class="effecrChartBox" id="effecrChart"></div>
			<div class="effecrChartBox" id="effecrChart2"></div>
		</div>
		<el-drawer title="" :visible.sync="showFlag" direction="ttb" class="bijiao" :modal="false" @close="handleClose">
			<div class="chartsBox_top">
				<div>
					<h2>算法调价</h2>
					<h2>人工调价</h2>
				</div>
				<div v-for="(item, idx) in percentList" :key="idx">
					<p>{{item.children[0].value | formatPercent}}</p>
					<p>{{item.label}}</p>
					<p>{{item.children[1].value | formatPercent}}</p>
				</div>
			</div>
		</el-drawer>
	</div>
</template>
<script>
	import {
		effectCharts
	} from "@/api/api";
	export default {
		name: "Charts",
		props: {
			searchVal: {
				defalut: null,
				type: Object,
			},
			getDataFlag: {
				defalut: false,
				type: Boolean,
			},
			showDrawerFlag: {
				defalut: false,
				type: Boolean,
			},
		},
		data() {
			return {
				percentList: [{
						label: '命中率',
						children: [{
								label: '算法',
								value: ''
							},
							{
								label: '人工',
								value: ''
							},
						]
					},
					{
						label: '有效率',
						children: [{
								label: '算法',
								value: ''
							},
							{
								label: '人工',
								value: ''
							},
						]
					},
					{
						label: '准确率',
						children: [{
								label: '算法',
								value: ''
							},
							{
								label: '人工',
								value: ''
							},
						]
					},
				],
				showFlag: false,
				tabDisable: true,
				tabList: [{
						label: "ROI变化",
						name: "1",
					},
					{
						label: "展现量变化",
						name: "2",
					},
					{
						label: "点击量变化",
						name: "3",
					},
					{
						label: "点击率变化",
						name: "4",
					},
					{
						label: "订单量变化",
						name: "5",
					},
					{
						label: "订单金额变化",
						name: "6",
					},
					{
						label: "转化率变化",
						name: "7",
					},
				],
				activeName: null,
				innerData: [],
				outerData: [],
				nextArr: [],
				options: {
					// backgroundColor: '#2c343c',
					title: {
						text: "Roi数据图示",
						left: "center",
						bottom: "20px",
					},
					tooltip: {
						trigger: "item",
						formatter: "{a} <br/>{b}: {c} ({d}%)",
					},
					legend: {
						show: true,
						//   orient: "vertival",
						top: 30,
						left: 80,
						data: [
							"上升",
							"下降",
							"不变",
							"上升:涨价",
							"上升:降价",
							"上升:未变",
							"下降:涨价",
							"下降:降价",
							"下降:未变",
							"不变:涨价",
							"不变:降价",
							"不变:未变",
						],
						selected: {
							'上升': true,
							'下降': true,
							'不变': false,
							"上升:涨价": true,
							"上升:降价": true,
							"上升:未变": true,
							"下降:涨价": true,
							"下降:降价": true,
							"下降:未变": true,
							"不变:涨价": false,
							"不变:降价": false,
							"不变:未变": false,
						},
					},
					series: [{
							name: "ROI",
							type: "pie",
							radius: [0, "28%"],
							label: {
								position: "inner",
								fontSize: 14,
							},
							itemStyle: {
								normal: {
									color: function(colors) {
										var colorList = ["#f56c6c", "#5FC82B", "#FFC851"];
										return colorList[colors.dataIndex];
									},
								},
							},
							labelLine: {
								show: false,
							},
							data: [],
						},
						{
							name: "ROI",
							type: "pie",
							radius: ["33%", "50%"],
							labelLine: {
								length: 30,
							},
							selectedMode: 'single',
							selectedOffset: 30,
							label: {
								formatter: "{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ",
								backgroundColor: "#F6F8FC",
								borderColor: "#8C8D8E",
								borderWidth: 1,
								borderRadius: 4,
								rich: {
									a: {
										color: "#6E7079",
										lineHeight: 18,
										align: "center",
									},
									hr: {
										borderColor: "#8C8D8E",
										width: "100%",
										borderWidth: 1,
										height: 0,
									},
									b: {
										color: "#4C5058",
										fontSize: 12,
										fontWeight: "bold",
										lineHeight: 26,
									},
									per: {
										color: "#fff",
										backgroundColor: "#4C5058",
										padding: [3, 4],
										borderRadius: 4,
									},
								},
							},
							data: [],
						},
					],
				},
				options2: {},
			};
		},
		watch: {
			showDrawerFlag(newval, oldval) {
				this.showFlag = newval;
			},
			getDataFlag(newval, oldval) {
				if (newval) {
					this.getChartsEvent(this.searchVal, this.activeName);
				}
			},
			activeName(newval, oldval) {
				const vm = this;
				vm.$nextTick(() => {
					let myChart = vm.$echarts.init(document.getElementById("effecrChart"));
					let myChart2 = vm.$echarts.init(document.getElementById("effecrChart2"));
					switch (newval) {
						case "1":
							vm.options.series[0].data = vm.innerData;
							vm.options.series[1].data = vm.outerData;
							break;
					}
					myChart.setOption(vm.options, true);
					myChart.dispatchAction({type: 'highlight',seriesIndex: 1,dataIndex: 0});//设置默认选中高亮部分
					myChart.on('click', function(params) {
						let data;
						vm.nextArr.forEach((item, idx) => {
							if (item.name === params.name) {
								vm.options2.series[0].data = [{
									name: params.name + '总数',
									value: item.value.总数,
									itemStyle: {
										color: params.color
									}
								}]
								data = [{
										name: '仅系统',
										value: item.value.仅系统,
										itemStyle: {
											color: "#409eff"
										}
									},
									{
										name: '仅人工',
										value: item.value.仅人工,
										itemStyle: {
											color: "#EF83F5"
										}
									},
									{
										name: '系统/人工',
										value: item.value['系统/人工'],
										itemStyle: {
											color: "#F4A462"
										}
									}
								]
								vm.options2.legend.data = [
									"仅系统",
									"仅人工",
									"系统/人工"
								]
								vm.options2.series[1].data = data;
							}
						})
						myChart2.setOption(vm.options2);
					});
					// 图表2的数据
					vm.options2 = JSON.parse(JSON.stringify(vm.options))
					vm.options2.legend = {
						show: true,
						top: 30,
						left: 'center',
						data: [
							"仅系统",
							"仅人工",
							"系统/人工"
						]
					}
					vm.options2.title.text = "调价具体信息"
					vm.options2.series[1].selectedMode = false
					vm.options2.series[0].data = [{
						name: '上升:涨价总数',
						value: vm.nextArr[0].value.总数,
						itemStyle: {
							color: '#F89999'
						}
					}]
					vm.options2.series[1].data = [{
							name: '仅系统',
							value: vm.nextArr[0].value.仅系统,
							itemStyle: {
								color: "#409eff"
							}
						},
						{
							name: '仅人工',
							value: vm.nextArr[0].value.仅人工,
							itemStyle: {
								color: "#EF83F5"
							}
						},
						{
							name: '系统/人工',
							value: vm.nextArr[0].value['系统/人工'],
							itemStyle: {
								color: "#F4A462"
							}
						},
					]
					myChart2.setOption(vm.options2, true);

					console.log('innerData', vm.innerData)
					console.log('nextArr', vm.nextArr)
						
					let currentOp = [vm.nextArr, vm.nextArr]
					currentOp.forEach((item, idx) => {
						let selectTag = idx===0 ? '仅系统' : '仅人工'
						let selectTag2 = idx===0 ? '系统' : '人工'
						let mingzhong = (
								item[0].value[selectTag] + // 上升涨价
								item[1].value[selectTag] + // 上升降价
								item[3].value[selectTag] + // 下降涨价
								item[4].value[selectTag]   // 下降降价
							) / (
								vm.innerData[0].value + // 上升
								vm.innerData[1].value   // 下降
							)
						let youxiao = (
								item[0].value[selectTag] + // 上升涨价
								item[1].value[selectTag] + // 上升降价
								item[3].value[selectTag] + // 下降涨价
								item[4].value[selectTag]   // 下降降价
							) / (
								item[0].value[selectTag2] +   // 总改价数
								item[1].value[selectTag2] +
								item[2].value[selectTag2] +
								item[3].value[selectTag2] +
								item[4].value[selectTag2] +
								item[5].value[selectTag2] +
								item[6].value[selectTag2] +
								item[7].value[selectTag2] +
								item[8].value[selectTag2]
							)
						let zhunque = (
								item[0].value[selectTag] + // 上升涨价
								item[4].value[selectTag]   // 下降降价
							) / (
								item[0].value[selectTag] + // 上升涨价
								item[1].value[selectTag] + // 上升降价
								item[3].value[selectTag] + // 下降涨价
								item[4].value[selectTag]   // 下降降价
							)

						// 命中率 0算法   1人工
						vm.$set(vm.percentList[0].children[idx], 'value', mingzhong)
						// 有效率
						vm.$set(vm.percentList[1].children[idx], 'value', youxiao)
						// 准确率
						vm.$set(vm.percentList[2].children[idx], 'value', zhunque)
					})

				});
			},
		},
		created() {
			const vm = this;
		},
		mounted() {
			const vm = this;
		},
		methods: {
			handleClose() {
				this.showFlag = false;
				this.$emit("close");
			},
			// 获取图表数据
			getChartsEvent(val, tag) {
				const vm = this;
				vm.tabDisable = true;
				vm.activeName = null;
				vm.innerData = []
				vm.outerData = []
				vm.nextArr = []
				effectCharts(val).then((res) => {
					if (res.data.code === 10000) {
						let result = res.data.data;
						for (let i in result) {
							let midArr = []
							// 上升  下降   不变
							midArr = [
								result[i].出价上升数量,
								result[i].出价下降数量,
								result[i].出价不变数量
							]
							midArr.forEach((val, idx) => {
								let str;
								switch (idx) {
									case 0:
										str = '涨价';
										break
									case 1:
										str = '降价';
										break
									case 2:
										str = '未变';
										break
								}
								vm.nextArr.push({
									value: val,
									name: i + ':' + str
								})
							})
							for (let j in result[i]) {
								// 出价上升数量   出价下降数量  出价不变数量  总数
								let midObj = {};
								if (j === '总数') {
									// 获取内层对应的数据
									midObj = {
										value: result[i][j],
										name: i
									}
									vm.innerData.push(midObj)
								}
							}
						}
						vm.nextArr.forEach((item, idx) => {
							let onlyP = item.value.总数 - item.value.系统
							let onlyS = item.value.总数 - item.value.人工
							let sysAndP = item.value.总数 - onlyP - onlyS

							if (item.name.indexOf('未变') !== -1) {
								vm.$set(item.value, '仅人工', 0)
								vm.$set(item.value, '仅系统', 0)
								vm.$set(item.value, '系统/人工', 0)
							} else {
								vm.$set(item.value, '仅人工', onlyP)
								vm.$set(item.value, '仅系统', onlyS)
								vm.$set(item.value, '系统/人工', sysAndP)
							}
							switch (item.name) {
								case "上升:涨价":
									vm.$set(item, "itemStyle", {
										color: "#F89999"
									});
									break;
								case "上升:降价":
									vm.$set(item, "itemStyle", {
										color: "#F2B9B9"
									});
									break;
								case "上升:未变":
									vm.$set(item, "itemStyle", {
										color: "#F4D4D4"
									});
									break;
								case "下降:涨价":
									vm.$set(item, "itemStyle", {
										color: "#80C160"
									});
									break;
								case "下降:降价":
									vm.$set(item, "itemStyle", {
										color: "#A6C298"
									});
									break;
								case "下降:未变":
									vm.$set(item, "itemStyle", {
										color: "#BAC9B3"
									});
									break;
								case "不变:涨价":
									vm.$set(item, "itemStyle", {
										color: "#F7D07E"
									});
									break;
								case "不变:降价":
									vm.$set(item, "itemStyle", {
										color: "#F4DDAE"
									});
									break;
								case "不变:未变":
									vm.$set(item, "itemStyle", {
										color: "#F2E7CF"
									});
									break;
							}
						})
						vm.nextArr.forEach((item, idx) => {
							vm.outerData.push({
								name: item.name,
								value: item.value.总数,
								itemStyle: item.itemStyle
							})
						})

						vm.tabDisable = false;
						vm.activeName = "1";
						vm.showFlag = true; // 展示抽屉
						vm.$emit("close");
					}
				});
			},
		},
	};
</script>

<style scoped lang="less">
	.effecrChartBox {
		width: 50%;
		height: 100%;
		display: inline-block;
	}
	.el-tabs {
		padding: 0 120px;
	}

	.chartsBox {
		height: 100%;
		padding: 0 30px;
		&_top {
			div {
				display: flex;
				justify-content: center;
				overflow: hidden;

				h2 {
					font-size: 22px;
					line-height: 40px;
					color: #606266;
					flex-basis: 200px;
					text-align: center;
				}

				p {
					flex-basis: 100px;
					text-align: center;
					font-size: 18px;
					line-height: 32px;
					// margin: 0 25px;
					color: #606266;
				}
			}
		}

		&_btm {}
	}

	/deep/.bijiao {
		height: 180px;
		left: 200px !important;
		overflow: auto;
		box-shadow: 0 5px 5px #eeeff9;

		.el-drawer {
			width: 100% !important;
			height: 100% !important;
			padding-bottom: 0;
			// background-color: #f1f2fd;

			&__close-btn {
				position: absolute;
				top: 30px;
				right: 30px;

				i:before {
					font-size: 30px;
				}
			}

			&__title {
				padding-bottom: 0;
			}

			&__header {
				padding: 0;
				margin: 0;
			}
		}
	}
</style>
