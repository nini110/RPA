<template>
	<div class="region strategyNormal">
		<div class="centers">
			<div class="tabTops">
				<div>
					<el-button type="primary" class="btnnormal" @click="dialogVisible = true" size="medium">新建模板
					</el-button>
				</div>
				<div class="searchs">
					<div class="searchs_label">模板名称：</div>
					<div>
						<el-input v-model="input" placeholder="请输入内容" size="medium" class="w240"></el-input>
					</div>
					<div>
						<el-button type="primary" class="btnnormal" size="medium" style="margin-left: 10px">查询
						</el-button>
					</div>
				</div>
			</div>
			<div class="tabbles pricetable" ref="tabbles">
				<el-table :data="tableData" :height="tableHeight" :header-cell-style="{background:'#F5F7FA',color: '#666'}">
					<template slot="empty">
						<span class="iconfont icon-wushuju">暂无数据</span>
					</template>
					<el-table-column align="center" type="index" label="序号" width="100">
					</el-table-column>
					<el-table-column prop="name" label="模板名称" min-width="200">
					</el-table-column>
					<el-table-column prop="address1" label="累计执行次数" min-width="120">
					</el-table-column>
					<el-table-column prop="address2" label="累计项目数" min-width="120">
					</el-table-column>
					<el-table-column prop="address3" label="累计计划数" min-width="120">
					</el-table-column>
					<el-table-column prop="username" label="创建人" min-width="120">
					</el-table-column>
					<el-table-column prop="address" label="操作" width="150" fixed="right">
						<el-button class="el-icon-edit" type="text">编辑</el-button>
						<el-button class="el-icon-delete" type="text" @click="deleteFn()">删除</el-button>
					</el-table-column>
				</el-table>
			</div>
			<div class="block">
				<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
					:current-page="currentPage4" :page-sizes="[10, 20, 50, 100]" :page-size="100"
					layout="total, sizes, prev, pager, next, jumper" :total="3">
				</el-pagination>
			</div>
			<div class="dialog">
				<el-dialog title="地域模板" :visible.sync="dialogVisible" :close-on-click-modal="false"
					custom-class="dialogEdit dialogStrategy">
					<el-form ref="form" :model="form">
						<el-form-item label="模板名称:">
							<el-input v-model="form.name" placeholder="请输入模板名称" size="medium" clearable></el-input>
						</el-form-item>
						<el-tabs type="border-card" class="tabsbox">
							<el-tab-pane label="不限"></el-tab-pane>
							<el-tab-pane label="按省市">
								<div class="provinceAndCity">
									<div class="search" style="display: flex">
										<el-input size="medium" placeholder="省市搜索不支持按拼音、拼音首字母"></el-input>
										<el-button slot="append" icon="el-icon-search" size="medium">搜索</el-button>
									</div>
									<div class="tabsItem">
										<el-tabs v-model="activeName" @tab-click="handleClick" style="width: 100%">
											<el-tab-pane label="地理划分" name="first">
												<div class="block1">
													<el-cascader-panel :options="optionsCity" :show-all-levels="false"
														ref="cascader" size="medium" :props="props" @change="pitchVal">
													</el-cascader-panel>
												</div>
											</el-tab-pane>
											<el-tab-pane label="发展划分" name="second">
												<div class="block1">
													<el-cascader-panel :options="optionsDevelop"
														:show-all-levels="false" ref="cascader" size="medium"
														:props="props" @change="pitchVal">
													</el-cascader-panel>
												</div>
											</el-tab-pane>
										</el-tabs>
									</div>
								</div>
								<div class="radioBox">
									<el-radio v-model="radio" label="1">正在该地区的用户</el-radio>
									<el-radio v-model="radio" label="2">居住在该地区的用户</el-radio>
									<el-radio v-model="radio" label="3">到该地区旅行的用户</el-radio>
									<el-radio v-model="radio" label="4">该地区内的所有用户</el-radio>
								</div>
							</el-tab-pane>
							<el-tab-pane label="按区县">
								<div class="block1">
									<el-cascader-panel :options="optionsCounty" :show-all-levels="false" ref="cascader"
										size="medium" :props="props" @change="pitchVal"></el-cascader-panel>
								</div>
								<div class="radioBox">
									<el-radio v-model="radio" label="1">正在该地区的用户</el-radio>
									<el-radio v-model="radio" label="2">居住在该地区的用户</el-radio>
									<el-radio v-model="radio" label="3">到该地区旅行的用户</el-radio>
									<el-radio v-model="radio" label="4">该地区内的所有用户</el-radio>
								</div>
							</el-tab-pane>
						</el-tabs>
					</el-form>
					<span slot="footer" class="dialog-footer">
						<el-button type="primary" class="btnnormal marginL" @click="dialogVisible = false"
							size="medium">确 定</el-button>
						<el-button class="btnnormal btnnormal_down" @click="dialogVisible = false" size="medium">取 消
						</el-button>
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
	} from "./city.js";
	export default {
		data() {
			return {
				form: {
					name: "",
				},
				currentPage4: 1,
				dialogVisible: false,
				input: "",
				radio: "1",
				activeName: "first",
				tableData: [{
						date: "",
						name: "江浙沪包邮区",
						address1: "12",
						address2: "8",
						address3: "10",
						username: "张世杰",
					},
					{
						date: "",
						name: "潜客集中区域",
						address1: "21",
						address2: "10",
						address3: "15",
						username: "张世杰",
					},
					{
						date: "",
						name: "福建广东部分县市",
						address1: "21",
						address2: "10",
						address3: "15",
						username: "张世杰",
					},
				],
				props: {
					multiple: true,
					value: "id",
					label: "name",
				},
				optionsCity: [], //地理划分
				optionsDevelop: [], //发展划分
				optionsCounty: [],
				tableHeight: 0

			};
		},
		mounted() {
			this.tableHeight = window.getComputedStyle(this.$refs.tabbles).height
		},
		methods: {
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
			handleSizeChange() {},
			handleCurrentChange() {},
			getCheckedNodes() {},
			pitchVal(val) {},
			handleClick(tab, event) {},
		},
		created() {
			this.optionsCity = city;
			this.optionsDevelop = develop;
			this.optionsCounty = county;
		},
	};
</script>

<style lang="less" scoped>
	@import "@/views/index.less";
	@import "../index.less";
	@import "../../items/index.less";
	@import "../../strategy/index.less";
</style>
