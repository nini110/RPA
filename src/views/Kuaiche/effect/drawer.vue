<template>
	<el-drawer :title="'当前关键词： ' + openDrawerInfo.keyword" :visible.sync="drawer" direction="rtl" @close="closeEvent">
		<!-- 信息详情 -->
		<el-divider><i :class="table[0].icon">{{table[0].txt}}</i></el-divider>
		<el-table class="drawerTable" :data="table[0].drawerData" :header-cell-style="{ background: '#F5F7FA', color: '#666' }">
			<template slot="empty">
				<span class="iconfont icon-wushuju">暂无数据</span>
			</template>
			<el-table-column v-for="(item1, idx1) in table[0].tabList" :key="idx1" :prop="item1.prop" align="center"
				:label="item1.label" :min-width="item1.width">
			</el-table-column>
		</el-table>
		<!-- 调价详情 -->
		<el-divider><i :class="table[1].icon">{{table[1].txt}}</i></el-divider>
		<el-table class="drawerTable" :data="table[1].drawerData" :header-cell-style="{ background: '#F5F7FA', color: '#666' }">
			<template slot="empty">
				<span class="iconfont icon-wushuju">暂无数据</span>
			</template>
			<el-table-column v-for="(item1, idx1) in table[1].tabList" :key="idx1" :label="item1.label" align="center">
				<el-table-column v-for="(item2, idx2) in item1.children" :key="idx2" :prop="item2.prop" align="center"
					:label="item2.label" :min-width="item2.width">
				</el-table-column>
			</el-table-column>
		</el-table>
		<el-divider><i class="el-icon-edit-outline">调价</i></el-divider>
		正在开发
	</el-drawer>
</template>
<script>
	import {
		priceBox
	} from "@/api/api";
	export default {
		name: "Drawer",
		props: {
			openDrawerInfo: {
				type: Object,
				default: {},
			},
			showDrawer: {
				type: Boolean,
				default: false,
			},
		},
		watch: {
			showDrawer(newval, oldval) {
				this.drawer = newval
				if (newval) {
					this.getPriceDetail(this.openDrawerInfo)
				}
			}
		},
		data() {
			return {
				drawer: false,
				table: [{
						txt: '信息',
						icon: 'el-icon-chat-line-round',
						drawerData: [],
						tabList: [{
								prop: "khd",
								label: "类型",
								width: "60",
							},
							{
								prop: "old_price",
								label: "初始价格",
								width: "60",
							},
							{
								prop: "new_price",
								label: "最终价格",
								width: "60",
							},
							{
								prop: "autoNum",
								label: "算法改价次数",
								width: "100",
							},
							{
								prop: "perNum",
								label: "人工改价天数",
								width: "100",
							},
						],
					},
					{
						txt: '调价详情',
						icon: 'el-icon-date',
						drawerData: [],
						tabList: [{
							label: '算法调价',
							children: [{
									prop: "changeDate",
									label: "日期",
									width: "80",
								},
								{
									prop: "changePrice",
									label: "调价详情",
									width: "80",
								},
							]
						}, {
							label: '人工调价',
							children: [{
									prop: "changeDta1",
									label: "日期",
									width: "80",
								},
								{
									prop: "changeInfo1",
									label: "调价详情",
									width: "80",
								},
							]
						}]
					}
				],
			};
		},
		created() {},
		methods: {
			closeEvent() {
				const vm = this;
				vm.$emit("close");
			},
			// 获取改价详情
			getPriceDetail(row) {
				const vm = this;
				vm.table[0].drawerData = []
				vm.table[1].drawerData = []
				priceBox({
					pin: row.pin,
					start_date: row.start_date,
					end_date: row.end_date,
					keyword: row.keyword,
					plan_name: row.plan_name,
					unit_name: row.unit_name,
					limit: 20,
					page: 1,
				}).then((res) => {
					if (res.data.code === 10000) {
						let aiDate = res.data.data.ai; // 算法调价数据
						let perDate = res.data.data.artificial; // 人工调价数据
						vm.table[0].drawerData = [{
							khd: aiDate[0].khd,
							old_price: aiDate[0].old_price,
							new_price: aiDate[aiDate.length - 1].new_price,
							autoNum: aiDate.length,
							perNum: perDate.length
						}]; // 
						let mid = []
						for (let i of aiDate) {
							let obj = {}
							vm.$set(obj, 'changeDate', i.update_time)
							vm.$set(obj, 'changePrice', i.old_price + ' -> ' + i.new_price)
							mid.push(obj)
						}
						vm.table[1].drawerData = mid
					} else {
						vm.$message.warning("暂无数据");
					}
				});
			},
		},
	};
</script>
<style lang="less" scoped>
	.drawerTable {
		height: 28%;
		border: none;
		&:before,
		&:after {
			display: none;
		}
		.el-table {
			height: calc(100% - 50px) !important;

			&:before {
				display: none;
			}
		}
	}
</style>
