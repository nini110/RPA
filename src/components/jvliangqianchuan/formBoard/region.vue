<template>
	<div class="region">
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
				<el-table :data="tableData" style="width: 100%">
					<el-table-column align="center" type="index" label="序号" width="180">
					</el-table-column>
					<el-table-column align="center" prop="name" label="模板名称" width="180">
					</el-table-column>
					<el-table-column align="center" prop="address1" label="累计执行次数">
					</el-table-column>
					<el-table-column align="center" prop="address2" label="累计项目数">
					</el-table-column>
					<el-table-column align="center" prop="address3" label="累计计划数">
					</el-table-column>
					<el-table-column align="center" prop="username" label="创建人">
					</el-table-column>
					<el-table-column align="center" prop="address" label="操作">
						<el-button type="text">编辑</el-button>
						<el-button type="text" @click="deleteFn()">删除</el-button>
					</el-table-column>
				</el-table>
			</div>
			<div class="Fpage">
				<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
					:current-page="currentPage4" :page-sizes="[10, 20, 30, 40, 50]" :page-size="100"
					layout="total, sizes, prev, pager, next, jumper" :total="3">
				</el-pagination>
			</div>
			<div class="dialog">
				<el-dialog title="地域模板" :visible.sync="dialogVisible" width="600px" :before-close="handleClose">
					<el-form ref="form" :model="form" label-width="120px">
						<el-form-item label="模板名称:">
							<el-input v-model="form.name" placeholder="请输入模板名称" size="mini" class="w240"></el-input>
						</el-form-item>
						<el-tabs type="border-card" class="tabs">
							<el-tab-pane label="不限"></el-tab-pane>
							<el-tab-pane label="按省市">
								<div class="provinceAndCity">
									<div class="search" style="display: flex;">
										<el-input size="mini" placeholder="省市搜索不支持按拼音、拼音首字母"></el-input>
										<el-button slot="append" icon="el-icon-search" size="mini">搜索</el-button>
									</div>
									<div class="tabsItem">
										<el-tabs v-model="activeName" @tab-click="handleClick" style="width: 100%;">
											<el-tab-pane label="地理划分" name="first">
												<div class="block">
													<el-cascader-panel :options="optionsCity" :show-all-levels="false"
														ref="cascader" size="mini" :props="props" @change="pitchVal">
													</el-cascader-panel>
												</div>
											</el-tab-pane>
											<el-tab-pane label="发展划分" name="second">
												<div class="block">
													<el-cascader-panel :options="optionsDevelop" :show-all-levels="false"
														ref="cascader" size="mini" :props="props" @change="pitchVal">
													</el-cascader-panel>
												</div>
											</el-tab-pane>
										</el-tabs>
									</div>
								</div>
								<div>
									<el-radio v-model="radio" label="1">正在该地区的用户</el-radio>
									<el-radio v-model="radio" label="2">居住在该地区的用户</el-radio>
									<el-radio v-model="radio" label="3">到该地区旅行的用户</el-radio>
									<el-radio v-model="radio" label="4">该地区内的所有用户</el-radio>
								</div>
							</el-tab-pane>
							<el-tab-pane label="按区县">
								<div class="block">
									<el-cascader-panel :options="optionsCounty" :show-all-levels="false" ref="cascader"
										size="mini" :props="props" @change="pitchVal"></el-cascader-panel>
								</div>
								<div>
									<el-radio v-model="radio" label="1">正在该地区的用户</el-radio>
									<el-radio v-model="radio" label="2">居住在该地区的用户</el-radio>
									<el-radio v-model="radio" label="3">到该地区旅行的用户</el-radio>
									<el-radio v-model="radio" label="4">该地区内的所有用户</el-radio>
								</div>
							</el-tab-pane>
						</el-tabs>
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
		city,
		develop,
		county
	} from './city.js'
	export default {
		data() {
			return {
				form:{
					name:''
				},
				currentPage4: 1,
				dialogVisible: false,
				input: '',
				radio: '1',
				activeName: 'first',
				tableData: [{
					date: '',
					name: '江浙沪包邮区',
					address1: '12',
					address2: '8',
					address3: '10',
					username: '张世杰'
				}, {
					date: '',
					name: '潜客集中区域',
					address1: '21',
					address2: '10',
					address3: '15',
					username: '张世杰'
				}, {
					date: '',
					name: '福建广东部分县市',
					address1: '21',
					address2: '10',
					address3: '15',
					username: '张世杰'
				}],
				props: {
					multiple: true,
					value: 'id',
					label: 'name'
				},
				optionsCity: [], //地理划分
				optionsDevelop: [], //发展划分
				optionsCounty: []
			}
		},
		methods: {
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
			handleSizeChange() {

			},
			handleCurrentChange() {

			},
			getCheckedNodes() {

			},
			pitchVal(val) {

			},
			handleClick(tab, event) {

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
			this.optionsCity = city;
			this.optionsDevelop = develop;
			this.optionsCounty = county;
		}
	}
</script>

<style lang="less" scoped>
	.w240 {
		width: 240px;
		height: 34px;
	}

	.region {
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

				.dialog {}
			}
			.Fpage{
				display: flex;
				justify-content: center;
			}
		}
	}
</style>
