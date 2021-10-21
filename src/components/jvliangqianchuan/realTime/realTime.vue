<template>
	<div class="realTime">
		<div class="centers">
			<div class="centerTop">
				<div>项目名称：{{$route.query.name}}</div>
				<div>项目ID：{{$route.query.id}}</div>
				<div>
					<el-button type="text" @click="routerFn()">查看数据变化值</el-button>
				</div>
			</div>
			<div class="tabTops">
				<div class="tabTopsItem">
					<div class="names">策略名称：</div>
					<el-input v-model="input" size="mini" placeholder="请输入策略名称" style="width:180px"></el-input>
				</div>
				<div class="tabTopsItem">
					<div class="names">计划名称：</div>
					<el-input v-model="input" size="mini" placeholder="请输入计划名称" style="width:180px"></el-input>
				</div>
				<div class="tabTopsItem">
					<div class="names">策略类型：</div>
					<el-select v-model="value" placeholder="请选择" size="mini" style="width:180px">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
					<div>
						<el-button type="primary" size="small" style="margin-left: 10px;">查询</el-button>
					</div>
				</div>
			</div>
			<div class="tables">
				<el-table :data="tableData" style="width: 100%" :cell-style="timeStyle">
					<el-table-column type="index" label="序号" width="50" align="center" header-align="center">
					</el-table-column>
					<el-table-column prop="create_time" label="策略执行时间" width="180" align="center" header-align="center">
					</el-table-column>
					<el-table-column prop="strategy_name" label="撞线策略" align="center" width="180" header-align="center">
					</el-table-column>
					<el-table-column prop="address1" label="类型" align="center" header-align="center">
						<template slot-scope="scope">
							<div v-if="scope.row.status === 0">撤回</div>
							<div v-else-if="scope.row.status === 1">已撤回</div>
							<div v-else-if="scope.row.status === 2">撤回失败</div>
							<div v-else-if="scope.row.status === 3">复制</div>
							<div v-else-if="scope.row.status === 4">复制成功</div>
							<div v-else-if="scope.row.status === 5">复制失败</div>
						</template>
					</el-table-column>
					<el-table-column prop="plan_name" label="计划名称" align="center" width="260" header-align="center">
						<template slot="header">
							计划名称
							<el-tooltip class="item" effect="dark" content="目前暂不支持拉取开启“计划托管”功能的广告计划数据" placement="top">
								<i class="el-icon-question"></i>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column prop="batch_number" label="批次编号" align="center" heade-align="center">
					</el-table-column>
					<el-table-column prop="address4" label="调整内容" align="center" width="120" header-align="center">
						<template slot-scope="scope">
							{{scope.row.old_price}}→{{scope.row.new_price}}
						</template>
					</el-table-column>
					<el-table-column prop="address" label="操作" width="130" align="center" header-align="center"
						fixed="right">
						<template slot-scope="scope">
							<el-button type="text" @click="withdrawFn()">撤回</el-button>
							<el-button type="text" @click="dialogVisible = true">复制</el-button>
							<el-tooltip class="item" effect="dark" content="Left Center 提示文字" placement="left">
								<el-button type="text" style="color: #E1E1E1;">不成功</el-button>
							</el-tooltip>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="Fpage">
				<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
					:current-page="currentPage" :page-sizes="[10, 20, 30, 40, 50]" :page-size="pageSize"
					layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
			<div class="dialog">
				<el-dialog title="更换模板" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
					<el-form ref="form" :model="form" label-width="120px">
						<el-form-item label="计划名称:">
							<el-input v-model="form.name" placeholder="请输入计划名称" size="mini" class="w240"></el-input>
						</el-form-item>
						<el-form-item label="地域模板:">
							<el-select v-model="form.region" placeholder="请选择活动区域" size="mini" class="w240">
								<el-option label="区域一" value="shanghai"></el-option>
								<el-option label="区域二" value="beijing"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="年龄模板">
							<el-select v-model="form.age" placeholder="请选择活动区域" size="mini" class="w240">
								<el-option label="区域一" value="shanghai"></el-option>
								<el-option label="区域二" value="beijing"></el-option>
							</el-select>
						</el-form-item>
					</el-form>
					<span slot="footer" class="dialog-footer">
						<el-button @click="dialogVisible = false" size="medium">取 消</el-button>
						<el-button type="primary" @click="dialogVisible = false" size="medium">确 定</el-button>
					</span>
				</el-dialog>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		readTimeData
	} from '../../../api/api.js'
	export default {
		name: 'RealTime',
		data() {
			return {
				currentPage: 1,
				value: '',
				pageSize: 10,
				total: 0,
				dialogVisible: false,
				options: [{
					value: '选项1',
					label: '所有'
				}, {
					value: '选项2',
					label: '出价调整'
				}, {
					value: '选项3',
					label: '预算调整'
				}, {
					value: '选项4',
					label: '计划复制'
				}],
				form: {
					name: '8.20直播大促初始—复制计划1',
					region: '',
					age: ''
				},
				input: '',
				tableData: []
			}
		},
		methods: {
			timeStyle(){
				return "height:50px;padding:0;"
			},
			// 实时数据
			readTimeData() {
				let params = {
					page: this.currentPage,
					per_page: this.pageSize,
					project_id:this.$route.query.id
				}
				console.log(params)
				readTimeData(params).then(res=>{
					this.tableData = res.data.data;
					this.total = res.data.total_count;
				}).catch(err=>{
					console.log(err);
				})
			},
			// 删除按钮
			withdrawFn() {
				this.$confirm('确定撤回该策略？', '撤回提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$message({
						type: 'success',
						message: '撤回成功!'
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消撤回'
					});
				})
			},
			handleCurrentChange() {

			},
			handleSizeChange() {

			},
			routerFn() {
				const {
					href
				} = this.$router.resolve({
					name: "Plan"
				});
				window.open(href, '_blank');
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
			this.readTimeData();
		}
	}
</script>


<style lang="less" scoped>
	.w240 {
		width: 240px;
		height: 34px;
	}

	.realTime {
		display: flex;
		flex-direction: row-reverse;

		.centers {
			width: 935px;
			padding: 20px;
			padding-top: 100px;
			background-color: #fff;
			height: 1300px;

			.centerTop {
				display: flex;

				div {
					height: 50px;
					line-height: 50px;
					margin: 0 50px;
				}
			}

			.tabTops {
				display: flex;
				justify-content: space-evenly;

				.tabTopsItem {
					display: flex;
				}
			}

			.Fpage {
				display: flex;
				justify-content: center;
			}
		}
	}
</style>
