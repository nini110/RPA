<template>
	<el-drawer :title="'当前关键词： ' + openDrawerInfo.keyword" :visible.sync="drawer" direction="rtl" @close="closeEvent">
		<!-- 信息详情 -->
		<el-divider><i :class="table[0].icon">{{table[0].txt}}</i></el-divider>
		<el-table class="drawerTable" :data="table[0].drawerData"
			:header-cell-style="{ background: '#F5F7FA', color: '#666' }">
			<template slot="empty">
				<span></span>
			</template>
			<el-table-column v-for="(item1, idx1) in table[0].tabList" :key="idx1" show-overflow-tooltip
				:prop="item1.prop" align="center" :label="item1.label" :min-width="item1.width">
			</el-table-column>
		</el-table>
		<!-- 信息详情 -->
		<el-divider><i :class="table[1].icon">{{table[1].txt}}</i></el-divider>
		<el-table class="drawerTable" :data="table[1].drawerData"
			:header-cell-style="{ background: '#F5F7FA', color: '#666' }">
			<template slot="empty">
				<span></span>
			</template>
			<el-table-column v-for="(item1, idx1) in table[1].tabList" :key="idx1" show-overflow-tooltip
				:prop="item1.prop" align="center" :label="item1.label" :min-width="item1.width">
			</el-table-column>
		</el-table>
		<!-- 调价详情 -->
		<el-divider><i :class="table[2].icon">{{table[2].txt}}</i></el-divider>
		<el-table class="drawerTable ts" :data="table[2].drawerDataAi"
			:header-cell-style="{ background: '#F5F7FA', color: '#666' }">
			<template slot="empty">
				<span></span>
			</template>
			<el-table-column v-for="(item1, idx1) in table[2].tabListAi" :key="idx1" :label="item1.label" align="center">
				<el-table-column v-for="(item2, idx2) in item1.children" :key="idx2" :prop="item2.prop" align="center"
					:label="item2.label" :min-width="item2.width">
				</el-table-column>
			</el-table-column>
		</el-table>
		<el-table class="drawerTable ts" :data="table[2].drawerDataPer"
			:header-cell-style="{ background: '#F5F7FA', color: '#666' }">
			<template slot="empty">
				<span></span>
			</template>
			<el-table-column v-for="(item1, idx1) in table[2].tabListPer" :key="idx1" :label="item1.label" align="center">
				<el-table-column v-for="(item2, idx2) in item1.children" :key="idx2" :prop="item2.prop" align="center"
					:label="item2.label" :min-width="item2.width">
				</el-table-column>
			</el-table-column>
		</el-table>
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
						icon: 'el-icon-warning-outline',
						drawerData: [],
						tabList: [{
								prop: "unit_name",
								label: "单元",
								width: "80",
							},
							{
								prop: "plan_name",
								label: "计划",
								width: "150",
							},
							{
								prop: "khd",
								label: "类型",
								width: "60",
							},
						],
					},
					{
						txt: '调价信息',
						icon: 'el-icon-chat-line-round',
						drawerData: [],
						tabList: [{
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
						drawerDataAi: [],
						drawerDataPer: [],
						tabListAi: [{
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
						}],
						tabListPer: [{
							label: '人工调价',
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
						}],
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
				vm.table[2].drawerDataAi = []
				vm.table[2].drawerDataPer = []
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
							plan_name: row.plan_name,
							unit_name: row.unit_name,
							khd: aiDate[0].khd,
						}]
						vm.table[1].drawerData = [{
							old_price: aiDate[0].old_price,
							new_price: aiDate[aiDate.length - 1].new_price,
							autoNum: aiDate.length,
							perNum: perDate.length
						}]; 
						let arr = [aiDate, perDate]
						arr.forEach((val, idx) => {
							let mid = []
							for (let i of val) {
								let obj = {}
								vm.$set(obj, 'changeDate', i.update_time)
								vm.$set(obj, 'changePrice', i.old_price + ' → ' + i.new_price)
								mid.push(obj)
							}
							if (idx=== 0) {
								vm.table[2].drawerDataAi = mid
							} else {
								vm.table[2].drawerDataPer = mid
							}
						})
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
		height: 18%;
		border: none;

		&:before,
		&:after {
			display: none;
		}

		&.ts {
			width: 50%;
			height: 40%;
			display: inline-block;
		}

		.el-table {
			height: calc(100% - 50px) !important;

			&:before {
				display: none;
			}
		}
	}
</style>
