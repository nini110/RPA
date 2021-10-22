<template>
	<div class="age">
		<div class="centers">
			<div class="tabTops">
				<div>
					<el-button type="primary" @click="dialogVisible = true" size="medium">新建模板</el-button>
				</div>
				<div class="searchs">
					<div>模板名称：</div>
					<div>
						<el-input v-model="input" placeholder="请输入内容" size="mini" class="w240"></el-input>
					</div>
					<div>
						<el-button type="primary" style="margin: 0 10px;" size="medium">查询</el-button>
					</div>
				</div>
			</div>
			<div class="tabbles">
				<el-table :data="tableData" style="width: 100%" @cell-click="cellClick">
					<el-table-column align="center" label="序号" width="120" type="index">
					</el-table-column>
					<el-table-column align="center" prop="name" label="模板名称" width="180">
					</el-table-column>
				<!-- 	<el-table-column align="center" prop="count" label="状态" width="100">
						<template slot-scope="scope">
							<div v-if="scope.row.status">使用中</div>
							<div v-else>未使用</div>
						</template>
					</el-table-column> -->
					<el-table-column align="center" prop="total_satisfy_count" label="执行次数">
					</el-table-column>
					<el-table-column align="center" prop="total_project_count" label="累计项目数">
					</el-table-column>
					<el-table-column align="center" prop="total_plan_count" label="累计计划数">
					</el-table-column>
					<el-table-column align="center" prop="username" label="创建人">
					</el-table-column>
					<el-table-column align="center"  label="操作">
						<template slot-scope="scope">
							<el-button type="text" @click="editFn(scope.row.id)">编辑</el-button>
							<el-button type="text" @click="deleteFn()">删除</el-button>
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
			<div class="dialog">
				<el-dialog title="年龄模板" :visible.sync="dialogVisible" width="600px" :before-close="handleClose">
					<el-form ref="form" :model="form" label-width="120px" :rules="rules">
						<el-form-item label="模板名称:" prop="name">
							<el-input v-model="form.name" placeholder="请输入模板名称" size="mini" class="w240"></el-input>
						</el-form-item>
						<div>年龄：</div>
						<!-- <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
						</el-checkbox> -->
						<div style="margin: 15px 0;"></div>
						<el-checkbox-group v-model="form.age" @change="handleCheckedCitiesChange">
							<el-checkbox v-for="city in cities" :label="city.value" :key="city.value" style="background-color: #F2F2F2; width:94px;height:16px;padding: 8px 12px; margin: 10px 10px; border-radius: 5px;">{{city.lable}}</el-checkbox>
						</el-checkbox-group>
					</el-form>
					<span slot="footer" class="dialog-footer">
						<el-button @click="dialogVisible = false" size="medium">取 消</el-button>
						<el-button type="primary" @click="isOk()" size="medium">确 定</el-button>
					</span>
				</el-dialog>
			</div>
		</div>
	</div>
</template>

<script>
	let cityOptions = [
		{
			value:0,
			lable:'不限',
		},{
			value:1,
			lable:'18-23'
		},{
			value:2,
			lable:'24-30'
		},{
			value:3,
			lable:'31-40'
		},{
			value:4,
			lable:'41-49'
		},{
			value:5,
			lable:'50+'
		}
	];
	import {ageTemplateAdd, ageTemplateList, ageTemplateDetail, ageTemplateUpdata } from '../../../api/api.js'
	export default {
		data() {
			return {
				checkAll: false,
				total:0,
				flag: true,
				cities: cityOptions,
				isIndeterminate: true,
				dialogVisible: false,
				input: '',
				currentPage:1,
				pagesize:10,
				form:{
					name:'',
					username: '',
					age: [],
				},
				rules:{
					name:[{required:true, message: '请输入模板名称', trigger:'blur'}],
				},
				tableData: [{
					date: '2016-05-02',
					name: '王小虎',
					address: '金沙江路 1518 弄'
				}, {
					date: '2016-05-04',
					name: '王小虎',
					address: '金沙江路 1517 弄'
				}, {
					date: '2016-05-01',
					name: '王小虎',
					address: '金沙江路 1519 弄'
				}, {
					date: '2016-05-03',
					name: '王小虎',
					address: '金沙江路 1516 弄'
				}],
				editId:0
			}
		},
		methods: {
			// 取消表单验证
			formValidate(){
				if (this.$refs["form"] !== undefined) {
					this.$refs['form'].clearValidate() 
				}
			},
			// 更新年龄模板
			ageTemplateUpdata(){
				let age = '';
				for(let i = 0; i < this.form.age.length; i++){
					age += this.form.age[i] + ','
				}
				age = age.slice(0, age.length - 1)
				let data = {
					name:this.form.name,
					username:localStorage.getItem('user_name'),
					age:age,
					template_id:this.editId
				}
				ageTemplateUpdata(data).then(res=>{
					if(res.data.code === 200){
						this.dialogVisible = false;
						this.$message({
						  message: '年龄模板更新成功！',
						  type: 'success'
						});
						this.ageTemplateList();
					} else if(res.data.code === 1) {
						this.$message.error(res.msg);
					}
				}).catch(err =>{
					console.log(err)
				})
			},
			cellClick(row){
				this.editId = row.id;
			},
			// 新建按钮
			newStrategyFn(){
				this.formValidate();
				this.flag = true;
				this.form.age = [];
				this.form.name = '';
				this.form.username = localStorage.getItem('user_name');
			},
			// 获取年龄模板详情
			ageTemplateDetail(id){
				ageTemplateDetail({
					template_id : id
				}).then(res=>{
					let str = res.data.data.age;
					let arr = [];
					str = (str.split(','))
					for(let i = 0; i < str.length; i ++){
						arr.push(parseInt(str[i]));
					}
					this.form.name = res.data.data.name;
					this.form.age = arr;
				}).catch(err=>{
					console.log(err)
				})
			},
			// 编辑按钮
			editFn(id) {
				this.flag = false;
				this.dialogVisible = true;
				this.formValidate();
				this.ageTemplateDetail(id)
			},
			// 获取模板列表
			ageTemplateList(){
				ageTemplateList({
					page: this.currentPage,
					per_page: this.pagesize
				}).then(res=>{
					this.tableData = res.data.data.data;
					this.total = res.data.data.total_count;
				}).catch(err=>{
					console.log(err)
				})
			},
			//确定按钮
			isOk(){
				this.$refs.form.validate((valid) => {
					if(valid){
						if(this.flag){
							this.ageTemplateAdd()
						} else {
							this.ageTemplateUpdata()
						}
					}
				})
			},
			// 创建年龄模板
			ageTemplateAdd(){
				let age = '';
				for(let i = 0; i < this.form.age.length; i++){
					age += this.form.age[i] + ','
				}
				age = age.slice(0, age.length - 1)
				let data = {
					name:this.form.name,
					username:this.form.username,
					age:age
				}
				// data = this.qs.stringify(data);
				ageTemplateAdd(data).then(res=>{
					if(res.data.code === 200){
						this.dialogVisible = false;
						this.$message({
						  message: '年龄模板创建成功！',
						  type: 'success'
						});
						this.ageTemplateList();
					} else if(res.data.code === 1) {
						this.$message.error(res.data.msg);
					}
				}).catch(err=>{
					console.log(err)
				})
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
			handleSizeChange(val) {
				this.pagesize = val;
				this.ageTemplateList();
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.ageTemplateList();
			},
			handleCheckAllChange(val) {
				this.form.age = val ? cityOptions : [];
				this.isIndeterminate = false;
			},
			handleCheckedCitiesChange(value) {
				let checkedCount = value.length;
				this.checkAll = checkedCount === this.cities.length;
				this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
				if(value[value.length-1] === 0){
					this.form.age = [0]
				} else {
					for(let i = 0; i < value.length; i++){
						if(value[i] === 0){
							value.splice(i,1);
						}
					}
				}
			},
			handleClose(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
						done();
					})
					.catch(_ => {});
			}
		},
		created() {
			this.form.username = localStorage.getItem('user_name');
			this.ageTemplateList();
		}
	}
</script>

<style lang="less" scoped>
	.w240{
		width: 240px;
		height: 34px;
	}
	// /deep/
	/deep/.el-checkbox-group{
		.is-checked{
			background-color: #fff!important;
			border: 1px solid #409EFF;
			.is-checked{
				border: none;
			}
		}
	}
	.age {
		.centers {
			width: 935px;
			background-color: #fff;
			height: 1300px;
			.tabTops {
				display: flex;
				position: relative;
				padding-bottom: 10px;

				.searchs {
					position: absolute;
					right: 0;
					height: 40px;
					line-height: 40px;
					display: flex;
				}
			}
			.Fpage{
				display: flex;
				justify-content: center;
			}
		}
	}
</style>
