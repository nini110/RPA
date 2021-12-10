<template>
	<div class="region strategyNormal">
		<div class="centers">
			<div class="tabTops">
				<div>
					<el-button type="primary" class="el-icon-plus btnnormal" @click="editFn(1)" size="medium">新建模板
					</el-button>
				</div>
				<div class="searchs">
					<div class="searchs_label">模板名称：</div>
					<el-input v-model="searchName" placeholder="请输入模板名称" size="medium" clearable></el-input>
					<div>
						<el-button type="primary" class="el-icon-search btnnormal" size="medium" style="margin-left: 10px">查询
						</el-button>
					</div>
				</div>
			</div>
			<div class="tabbles pricetable" ref="tabbles">
				<el-table :data="tableData" :header-cell-style="{background:'#F5F7FA',color: '#666'}">
					<el-table-column align="center" type="index" label="序号" width="100">
					</el-table-column>
					<el-table-column v-for="(item, idx) in moduleOptions" :prop="item.prop" :label="item.label"
						:min-width="item.width">
					</el-table-column>
					<el-table-column prop="address" label="操作" width="180" fixed="right">
						<template slot-scope="scope">
							<el-button class="el-icon-edit" type="text" @click="editFn(2, scope.row)"
								:disabled="scope.row.status ? true : false">编辑</el-button>
							<el-button class="el-icon-delete" type="text" @click="deleteFn()"
								:disabled="scope.row.status ? true : false">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="block">
				<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
					:current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pagesize"
					layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
			<div class="dialog">
				<DialogRegion ref="dialogForm_Region" :username="username" :rowInfo="rowInfo" :editFlag="editFlag"
					:showFlag="showRegionDialog" @close="closeEvent"></DialogRegion>
				<DialogAge ref="dialogForm_Age" :username="username" :rowInfo="rowInfo" :editFlag="editFlag"
					:showFlag="showAgeDialog" @close="closeEvent"></DialogAge>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		ageTemplateList
	} from "@/api/api.js";
	import DialogRegion from './dialog_region.vue'
	import DialogAge from './dialog_age.vue'
	import message from "@/mixin/message";
	import opt from '../../option.js'
	export default {
		components: {
			DialogRegion,
			DialogAge
		},
		props: {
			activeTab: {
				type: String,
				default: null
			}
		},
		mixins: [message],
		data() {
			return {
				username: '',
				showRegionDialog: false,
				showAgeDialog: false,
				searchName: "",
				rowInfo: {},
				moduleOptions: null,
				editFlag: 1, // 新建 更新 标识
				currentPage: 1,
				total: 3,
				pagesize: 10,
				tableData: [],
			};
		},
		watch: {
			activeTab: {
				handler(newval, oldval) {
					const vm = this;
					vm.getList()
				},
				immediate: true,
				deep: true
			},
		},
		mounted() {
			this.username = localStorage.getItem("user_name");
			this.moduleOptions = opt.moduleOptions
		},
		methods: {
			closeEvent(tag) {
				const vm = this;
				if (vm.activeTab === 'first') {
					// vm.$refs.dialogForm_Region.form = {
					// 	name: "",
					// 	data: "",
					// 	count: 1,
					// 	condition: "",
					// 	proportion: 1,
					// 	bid_operate: "",
					// 	bid_proportion: 1,
					// }
				} else if (vm.activeTab === 'second') {
					vm.$refs.dialogForm_Age.form = {
						name: '',
						age: []
					}
				}
				vm.showRegionDialog = false
				vm.showAgeDialog = false
				vm.rowInfo = null
				vm.currentPage = 1
				vm.pagesize = 10
				if (tag) {
					vm.getList()
				}
			},
			// 删除事件
			deleteFn() {
				const vm = this;
				vm.openMessageBox({
					type: "warning",
					showClose: true,
					tipTitle: "是否确认删除当前模板？",
					confirmButtonFn: () => {
						this.$message("暂无删除接口功能");
					},
					cancelButtonFn: () => {
						this.$message("已取消");
					},
				});
			},
			// 编辑按钮
			editFn(tag, row) {
				const vm = this;
				vm.editFlag = tag
				if (vm.activeTab === 'first') {
					vm.showRegionDialog = true
				} else if (vm.activeTab === 'second') {
					vm.showAgeDialog = true
				}
				if (tag === 2) {
					// 编辑
					vm.rowInfo = row
				}
			},
			getList() {
				const vm = this;
				let params = {
					page: vm.currentPage,
					per_page: vm.pagesize,
				};
				if (vm.activeTab === 'first') {
					vm.tableData = [{
							date: "",
							name: "江浙沪包邮区",
							total_satisfy_count: "12",
							total_project_count: "8",
							total_plan_count: "10",
							username: "张世杰",
						},
						{
							date: "",
							name: "潜客集中区域",
							total_satisfy_count: "162",
							total_project_count: "2",
							total_plan_count: "5",
							username: "张世杰",
						},
						{
							date: "",
							name: "福建广东部分县市",
							total_satisfy_count: "12",
							total_project_count: "8",
							total_plan_count: "10",
							username: "张世杰",
						},
					]
					vm.total = 3
				} else {
					ageTemplateList(params)
						.then((res) => {
							vm.tableData = res.data.data.data;
							vm.total = res.data.data.total_count;
						})
				}

			},
			handleSizeChange(val) {
				this.pagesize = val;
				this.getList();
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.getList();
			},
		},
	};
</script>

<style lang="less" scoped>
	@import "@/views/index.less";
	@import "../index.less";
	@import "../../items/index.less";
	@import "../../strategy/index.less";
</style>
