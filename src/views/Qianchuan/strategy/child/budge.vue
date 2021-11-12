<template>
	<!-- 预算 -->
	<div class="budgetAdjustment strategyNormal">
		<div class="centers">
			<div class="PriceTops">
				<div class="btn">
					<el-button type="primary" class="btnnormal" @click="newStrategyFn()" size="medium">新建策略</el-button>
				</div>
				<div class="search">
					<div class="search_label">状态：</div>
					<div class="selects">
						<el-select v-model="value" placeholder="请选择" size="medium" clearable>
							<el-option v-for="item in options" :key="item.value" :label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
					</div>
					<div class="search_label">策略名称：</div>
					<el-input v-model="input" placeholder="请输入策略名称" class="inp" size="medium" clearable></el-input>
					<div>
						<el-button style="margin-left: 10px" type="primary" class="btnnormal" size="medium">查询
						</el-button>
					</div>
				</div>
			</div>
			<div class="tabbles pricetable" ref="tabbles">
				<el-table ref="multipleTable" :height="tableHeight" :data="tableData" tooltip-effect="dark"
					@cell-click="cellClick" @selection-change="handleSelectionChange" :header-cell-style="{background:'#F5F7FA',color: '#666'}">
					<template slot="empty">
						<span class="iconfont icon-wushuju">暂无数据</span>
					</template>
					<el-table-column align="center" type="selection" width="50">
					</el-table-column>
					<el-table-column align="center" label="序号" width="80" type="index">
					</el-table-column>
					<el-table-column prop="count" label="状态" width="150" align="center">
						<template slot-scope="scope">
							<div v-if="scope.row.status" class="yes">使用中</div>
							<div v-else class="no">未使用</div>
						</template>
					</el-table-column>
					<el-table-column prop="name" label="策略名称" min-width="200">
					</el-table-column>
					<el-table-column prop="total_satisfy_count" min-width="200" label="累计撞线数">
					</el-table-column>
					<el-table-column prop="total_project_count" min-width="200" label="累计项目数">
					</el-table-column>
					<el-table-column prop="total_plan_count" min-width="200" label="累计计划数">
					</el-table-column>
					<el-table-column prop="username" min-width="200" label="创建人">
					</el-table-column>
					<el-table-column prop="address" width="150" label="操作" fixed="right">
						<template slot="header">
							操作
							<el-tooltip class="item" effect="dark" content="当状态为使用中时,不可编辑和删除" placement="top">
								<i class="el-icon-question"></i>
							</el-tooltip>
						</template>
						<template slot-scope="scope">
							<el-button class="el-icon-edit" type="text" v-if="scope.row.status" disabled>编辑</el-button>
							<el-button class="el-icon-edit" type="text" @click="editFn(scope.row.id)" v-else>编辑
							</el-button>
							<el-button class="el-icon-delete" type="text" v-if="scope.row.status" disabled>删除
							</el-button>
							<el-button class="el-icon-delete" type="text" v-else @click="deleteFn()">删除</el-button>
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
			<!-- 预算调整策略弹窗 -->
			<div class="dialog">
				<el-dialog title="预算调整策略" :visible.sync="dialogVisible" custom-class="dialogEdit dialogStrategy"
					:close-on-click-modal="false">
					<el-form ref="form" :model="form" :rules="rules">
						<el-form-item label="策略名称:" prop="name">
							<el-input v-model="form.name" size="medium" placeholder="请输入策略名称"></el-input>
						</el-form-item>
						<el-divider content-position="left">条件</el-divider>
						<el-form-item label="消耗:" prop="consumeNum" class="oneIpt">
							<!-- <el-col :span="2"> ≥ </el-col> -->
							<el-input-number v-model="form.consumeNum" @change="handleChange" :min="1" :max="50"
								size="medium" label="描述文字"></el-input-number>%
						</el-form-item>
						<el-divider content-position="left">操作</el-divider>
						<el-form-item label="预算:" prop="budget" class="twoIpt">
							<el-select v-model="form.budget" placeholder="请选择" size="medium">
								<el-option v-for="item in budgetOptions" :key="item.value" :label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
							<el-input-number v-model="form.budgetNum" @change="handleChange" :min="100" :max="2000"
								size="medium" label="描述文字"></el-input-number>元
						</el-form-item>
					</el-form>
					<span slot="footer" class="dialog-footer">
						<el-button class="btnnormal btnnormal_down" @click="dialogVisible = false" size="medium">取 消
						</el-button>
						<el-button class="btnnormal marginLl" type="primary" @click="isOk()" size="medium">确 定
						</el-button>
					</span>
				</el-dialog>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		budgetStrategyList,
		addBudgetStrategy,
		detailBudgetStrategy,
		updateBudgetStrategy,
	} from "@/api/api.js";
	export default {
		data() {
			return {
				total: 0,
				num: 1,
				currentPage: 1,
				pagesize: 10,
				currentChange: "",
				flag: true, // true 为新创建 ， false 为编辑更新
				form: {
					name: "",
					consumeNum: 1,
					budget: "",
					budgetNum: 100,
					username: "",
				},
				rules: {
					name: [{
						required: true,
						message: "请输入策略名称",
						trigger: "blur"
					}],
					consumeNum: [{
						required: true,
						message: "请选择消耗比例",
						trigger: "blur"
					}, ],
					budget: [{
						required: true,
						message: "请选择预算条件",
						trigger: "blur"
					}, ],
				},
				dialogVisible: false,
				budgetOptions: [{
						value: 1,
						label: "上调",
					},
					{
						value: 2,
						label: "警告",
					},
				],
				options: [{
						value: "选项1",
						label: "所有",
					},
					{
						value: "选项2",
						label: "执行中",
					},
					{
						value: "选项3",
						label: "闲置",
					},
				],
				tableData: [],
				multipleSelection: [],
				value: "选项1",
				btnvalue: false,
				input: "",
				editId: 0,
				tableHeight: 0

			};
		},
		mounted() {
			this.tableHeight = window.getComputedStyle(this.$refs.tabbles).height
		},
		methods: {
			// 取消表单验证
			formValidate() {
				if (this.$refs["form"] !== undefined) {
					this.$refs["form"].clearValidate();
				}
			},
			// 删除按钮
			deleteFn() {
				this.$confirm("确定删除该策略？", "删除提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
					})
					.then(() => {
						this.$message({
							type: "success",
							message: "删除成功!",
						});
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: "已取消删除",
						});
					});
			},
			// 创建|更新策略
			isOk() {
				this.$refs.form.validate((valid) => {
					if (valid) {
						if (this.flag) {
							let data = {
								name: this.form.name,
								username: this.form.username,
								proportion: this.form.consumeNum / 100,
								budget_operate: this.form.budget,
								budget_money: this.form.budgetNum,
							};
							addBudgetStrategy(data)
								.then((res) => {
									if (res.data.code === 200) {
										this.dialogVisible = false;
										this.$message({
											message: "预算策略创建成功！",
											type: "success",
										});
										this.budgetStrategyList();
										this.dialogVisible = false;
									} else if (res.data.code === 1) {
										this.$message.error(res.data.msg);
									}
								})
								.catch((err) => {
									console.log(err);
								});
						} else {
							// 更新预算策略
							let data = {
								name: this.form.name,
								username: localStorage.getItem("user_name"),
								proportion: this.form.consumeNum / 100,
								budget_operate: this.form.budget,
								budget_money: this.form.budgetNum,
								strategy_id: this.editId,
							};
							updateBudgetStrategy(data)
								.then((res) => {
									if (res.data.code === 200) {
										this.dialogVisible = false;
										this.$message({
											message: "预算策略更新成功！",
											type: "success",
										});
										this.budgetStrategyList();
										this.dialogVisible = false;
									} else if (res.data.code === 1) {
										this.$message.error(res.data.msg);
									}
								})
								.catch((err) => {
									console.log(err);
								});
						}
					}
				});
			},
			// 编辑按钮
			editFn(id) {
				this.flag = false;
				this.dialogVisible = true;
				this.formValidate();
				this.detailBudgetStrategy(id);
			},
			cellClick(row) {
				this.editId = row.id;
			},

			// 获取预算详情
			detailBudgetStrategy(id) {
				detailBudgetStrategy({
						strategy_id: id,
					})
					.then((res) => {
						this.form = {
							name: res.data.data.name,
							username: localStorage.getItem("user_name"),
							consumeNum: res.data.data.proportion * 100,
							budget: res.data.data.budget_operate,
							budgetNum: res.data.data.budget_money,
						};
					})
					.catch((err) => {
						console.log(err);
					});
			},
			// 新建按钮
			newStrategyFn() {
				this.formValidate();
				this.flag = true;
				this.dialogVisible = true;
				this.form.name = "";
				this.form.consumeNum = 1;
				this.form.budget = "";
				this.form.budgetNum = 1;
				this.form.username = localStorage.getItem("user_name");
			},
			// 获取预算列表数据
			budgetStrategyList() {
				budgetStrategyList({
						page: this.currentPage,
						per_page: this.pagesize,
					})
					.then((res) => {
						this.tableData = res.data.data.data;
						this.total = res.data.data.total_count;
					})
					.catch((err) => {
						console.log(err);
					});
			},
			handleSizeChange(val) {
				this.pagesize = val;
				this.budgetStrategyList();
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.budgetStrategyList();
			},
			switchFn(val) {},
			handleChange(value) {},
			onSubmit() {},
			stateBtn() {
				this.btnvalue = !this.btnvalue;
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
		},
		created() {
			this.budgetStrategyList();
			this.form.username = localStorage.getItem("user_name");
		},
	};
</script>

<style lang="less" scoped>
	@import "@/views/index.less";
	@import "../index.less";
	@import "../../items/index.less";
</style>
