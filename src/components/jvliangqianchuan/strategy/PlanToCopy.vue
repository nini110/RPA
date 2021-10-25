<template>
	<!-- 计划 -->
	<div class="PlanToCopy">
		<div class="centers">
			<div class="PriceTops">
				<div class="btn">
					<el-button type="primary" @click="newStrategyFn()" size="mini">新建策略</el-button>
				</div>
				<div class="search">
					<div style="width: 50px;">状态：</div>
					<div class="selects">
						<el-select v-model="value" placeholder="请选择" size="mini">
							<el-option v-for="item in options" :key="item.value" :label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
					</div>
					<div style="width: 80px;">策略名称：</div>
					<el-input v-model="input" placeholder="请输入策略名称" size="mini" class="inp"></el-input>
					
					<div>
						<el-button style="margin: 0 5px;" type="primary" size="mini">查询</el-button>
					</div>
				</div>
			</div>
			<div class="tabbles">
				<el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @cell-click="cellClick"
					@selection-change="handleSelectionChange">
					<el-table-column align="center" type="selection" width="55">
					</el-table-column>
					<el-table-column align="center" label="序号" width="120" type="index">
					</el-table-column>
					<el-table-column align="center" prop="count" label="状态" width="100">
						<template slot-scope="scope">
							<div v-if="scope.row.status">使用中</div>
							<div v-else>未使用</div>
						</template>
					</el-table-column>
					<el-table-column align="center" prop="name" label="策略名称" width="120">
					</el-table-column>
					<el-table-column align="center" prop="total_satisfy_count" width="100" label="累计撞线数">
					</el-table-column>
					<el-table-column align="center" prop="total_project_count" width="100" label="累计项目数">
					</el-table-column>
					<el-table-column align="center" prop="total_plan_count" width="100" label="累计计划数">
					</el-table-column>
					<el-table-column align="center" prop="username" width="100" label="创建人">
					</el-table-column>
					<el-table-column align="center" prop="address" width="100" label="操作">
						<template slot="header">
							操作
							<el-tooltip class="item" effect="dark" content="当状态为使用中时,不可编辑和删除" placement="top">
								<i class="el-icon-question"></i>
							</el-tooltip>
						</template>
						<template slot-scope="scope">
							<el-button type="text" v-if="scope.row.status" disabled>编辑</el-button>
							<el-button type="text" @click="editFn(scope.row.id)" v-else>编辑</el-button>
							<el-button type="text" v-if="scope.row.status" disabled>删除</el-button>
							<el-button type="text" v-else @click="deleteFn()">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="Fpage">
				<el-pagination
					 background
				     @size-change="handleSizeChange"
				     @current-change="handleCurrentChange"
				     :current-page="currentPage"
				     :page-sizes="[10, 20, 30, 40, 50]"
				     :page-size="pagesize"
				     layout="total, sizes, prev, pager, next, jumper"
				     :total="total">
				   </el-pagination>
			</div>
			<!-- 复制计划策略弹窗 -->
			<div class="dialog">
				<el-dialog
				  title="复制计划策略"
				  :visible.sync="dialogVisible"
				  width="500px"
				  :before-close="handleClose">
				  <el-form ref="form" :model="form" label-width="120px" :rules="rules">
					  <el-form-item label="策略名称:" prop="name">
					  	<el-input v-model="form.name" size="mini" placeholder="请输入策略名称" class="w240"></el-input>
					  </el-form-item>
					  <div class="precedence">条件</div>
					  <el-form-item label="取数次数:" prop="triesLimit">
						  <el-col :span="15">
							  <el-input-number v-model="form.triesLimit" style="width:100px;" @change="handleChange" :min="1" :max="50" size="mini" label="描述文字"></el-input-number>次
						  </el-col>
					  </el-form-item>
					  <el-form-item label="判断依据:" prop="judge">
						  
						  	<el-select v-model="form.judge" placeholder="请选择" size="mini" style="width: 180px;">
						  		<el-option v-for="item in judgeOptions" :key="item.value" :label="item.label"
						  			:value="item.value">
						  		</el-option>
						  	</el-select>
						  
						  
							≥  <el-input-number v-model="form.judgeNum" style="width:100px;" @change="handleChange" :min="1" :max="50" size="mini" label="描述文字"></el-input-number>%
						  
					  </el-form-item>
					  <div class="precedence">操作</div>
					  <el-form-item label="计划:">
						  <!-- <el-select v-model="form.plan" placeholder="请选择" size="mini">
						  	<el-option v-for="item in planOptions" :key="item.value" :label="item.label"
						  		:value="item.value">
						  	</el-option>
						  </el-select> -->
						  复制
					  </el-form-item>
				  </el-form>
				  <span slot="footer" class="dialog-footer">
				    <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
				    <el-button type="primary" @click="isOk()" size="mini">确 定</el-button>
				  </span>
				</el-dialog>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		planStrategyList,
		addPlanStrategy,
		detailPlanStrategy,
		updatePlanStrategy
	} from '@/api/api.js'
	export default {
		data() {
			return {
				num: 1,
				currentPage:1,
				pagesize:10,
				total:0,
				flag:true,
				form: {
					username: '',
					name: '',
					judgeNum:'',
					judge: '',
					triesLimit:'',
					plan: 1,//计划
				},
				rules:{
					name:[{required:true, message: '请输入策略名称', trigger:'blur'}],
					triesLimit:[{required:true, message: '请选择抽取次数', trigger:'blur'}],
					judge:[{required:true, message: '请选择判断依据', trigger:'blur'}]
				},
				dialogVisible: false,
				planOptions:[{
					value: '1',
					label: '警告'
				},{
					value: '2',
					label: '复制'
				}],
				judgeOptions:[{
					value: 1,
					label: '成交订单增量贡献度'
				},{
					value: 2,
					label: '成交金额增量贡献度'
				},{
					value: 3,
					label: '下单订单增量贡献度'
				},{
					value: 4,
					label: '下单金额增量贡献度'
				}],
				options: [{
					value: '选项1',
					label: '所有'
				}, {
					value: '选项2',
					label: '执行中'
				}, {
					value: '选项3',
					label: '闲置'
				}],
				tableData: [],
				multipleSelection: [],
				value: '选项1',
				btnvalue: false,
				input: '',
				editId:0,
			}
		},
		methods: {
			// 取消表单验证
			formValidate(){
				if (this.$refs["form"] !== undefined) {
					this.$refs['form'].clearValidate() 
				}
			},
			// 删除按钮
			deleteFn() {
				this.$confirm('确定删除该策略？', '删除提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				})
			},
			cellClick(row){
				this.editId = row.id;
			},
			// 编辑按钮
			editFn(id) {
				this.flag = false;
				this.dialogVisible = true;
				this.formValidate();
				this.detailPlanStrategy(id)
			},
			// 获取计划详情
			detailPlanStrategy(id){
				detailPlanStrategy({
					strategy_id : id
				}).then(res=>{
					let result = res.data.data
					this.form = {
						name: result.name,
						username: localStorage.getItem('user_name'),
						judgeNum: result.proportion*100,
						judge: result.condition,
						triesLimit:result.count,
						plan:result.plan_operate
					}
				}).catch(err=>{
					console.log(err);
				})
			},
			// 新建按钮
			newStrategyFn(){
				this.formValidate();
				this.flag = true;
				this.dialogVisible = true;
				this.form.name = '';
				this.form.triesLimit = 1;
				this.form.judgeNum = 1;
				this.form.judge = '';
				this.form.plan = 1;
				this.form.username = localStorage.getItem('user_name');
			},
			// 创建|更新策略
			isOk(){
				this.$refs.form.validate((valid) => {
					if(valid){
						if(this.flag){
							let data = {
								name:this.form.name,
								username:this.form.username,
								count:this.form.triesLimit,
								condition:this.form.judge,
								proportion:this.form.judgeNum/100,
								plan_operate:this.form.plan
							}
							addPlanStrategy(data).then(res=>{
								if(res.data.code === 200){
									this.dialogVisible = false;
									this.$message({
									  message: '计划策略创建成功！',
									  type: 'success'
									});
									this.dialogVisible = false;
									this.planStrategyList();
								} else if(res.data.code === 1) {
									this.$message.error(res.data.msg);
								}
							}).catch(err=>{
								console.log(err)
							})
						} else {
							let data = {
								name:this.form.name,
								username:localStorage.getItem('user_name'),
								count:this.form.triesLimit,
								condition:this.form.judge,
								proportion:this.form.judgeNum/100,
								plan_operate:this.form.plan,
								strategy_id:this.editId
							}
							// data = this.qs.stringify(data);
							updatePlanStrategy(data).then(res=>{
								if(res.data.code === 200){
									this.dialogVisible = false;
									this.$message({
									  message: '计划策略更新成功！',
									  type: 'success'
									});
									this.planStrategyList();
									this.dialogVisible = false;
								} else if(res.data.code === 1) {
									this.$message.error(res.data.msg);
								}
							}).catch(err=>{
								console.log(err);
							})
						}
					}
				})
			},
			// 获取计划列表
			planStrategyList(){
				planStrategyList({
					page: this.currentPage,
					per_page: this.pagesize
				}).then(res=>{
					this.tableData = res.data.data.data;
					this.total = res.data.data.total_count;
				}).catch(err=>{
					console.log(err)
				})
			},
			handleSizeChange(val) {
				this.pagesize = val;
				this.planStrategyList();
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.planStrategyList();
			},
			switchFn(val){
				
			},
			handleChange(value) {
				
			},
			onSubmit() {
				
			},
			stateBtn() {
				this.btnvalue = !this.btnvalue;
			},
			handleClose(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
						done();
					})
					.catch(_ => {});
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			}
		},
		created() {
			this.planStrategyList();
			this.form.username = localStorage.getItem('user_name')
		}
	}
</script>

<style lang="less" scoped>
	.precedence{
		width: 100%;
		height: 30px;
		line-height: 30px;
		color: #000000;
		font-size: 16px;
		font-weight: 600;
	}
	.PlanToCopy {
		.centers {
			width: 975px;
			background-color: #fff;
			height: 1300px;
			.PriceTops {
				position: relative;

				.btn {
					margin: 0 10px;
				}

				.search {
					position: absolute;
					right: 0;
					top: 0;
					width: 550px;
					height: 40px;
					line-height: 40px;
					display: flex;

					.selects {
						width: 120px;
						left: 120px;
						top: 0;
					}

					.inp {
						width: 200px;
					}
				}
			}

			.tabbles {
				padding: 20px 0;
			}
			.Fpage{
				display: flex;
				justify-content: center;
			}
		}
	}
</style>
