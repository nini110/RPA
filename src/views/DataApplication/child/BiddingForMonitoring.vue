<template>
	<!-- 竞标监控 -->
	<div class="biddingForMonitoring outerDiv">
		<div class="content">
			<div class="form">
				<div class="upobtn">
					<el-button class="btnnormal" type="primary" @click="upList()">上传竞标</el-button>
				</div>
			</div>
			<div ref="tableBox" class="tableBox jiankong">
				<el-divider>列表</el-divider>
				<div class="tables" v-if="tableData">
					<el-table ref="singleTable" class="tableBox" :data="tableData" :height="tableHeight"
						:highlight-current-row="true" :header-cell-style="{background:'#f4f4f4',color: '#666'}">
						<template slot="empty">
							<span class="iconfont icon-wushuju">暂无数据</span>
						</template>
						<el-table-column type="index" width="80" label="序号" align="center">
						</el-table-column>
						<el-table-column property="bidding_name" label="竞标名称" min-width="120">
						</el-table-column>
						<el-table-column property="activity_name" label="活动名称" min-width="250">
						</el-table-column>
						<el-table-column property="budget" label="总预算" width="150">
						</el-table-column>
						<el-table-column property="trans_name" label="上传人" width="150">
						</el-table-column>
						<el-table-column property="cheack" label="操作" fixed="right" width="300">
							<template slot-scope="scope">
								<el-button class="el-icon-edit" type="text" @click="detailEvent(scope.row)">预算
								</el-button>
								<el-button class="el-icon-edit" type="text" @click="editEvent(scope.row)">人员</el-button>
								<el-button class="el-icon-edit" type="text" @click="editActiveEvent(scope.row)">活动
								</el-button>
								<el-button class="el-icon-delete" type="text" @click="deleteEvent(scope.row)">删除
								</el-button>
							</template>
						</el-table-column>
					</el-table>
					<div class="block" v-if="total">
						<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
							:current-page="currpage" :page-size="pagesize" :page-sizes="[10, 20, 50, 100]"
							layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
					</div>
				</div>
			</div>
		</div>
		<UpDialog v-if="upDialogFlag" @close="closeUpEvent"></UpDialog>
		<DetailDia v-if="detailFlag" :row="tablerow" @close="closeDetailEvent"></DetailDia>
		<!-- 修改人员 -->
		<EditDia v-if="editFlag" :row="tablerow" @close="closeEditEvent" :editNum="editNum"></EditDia>
	</div>
</template>
<script>
	import {
		BidList,
		biddingDelete
	} from "@/api/api.js";
	import DetailDia from "./comps/detailDialog.vue";
	import EditDia from "./comps/editDialog.vue";
	import UpDialog from "./comps/uploadDialog.vue";

	export default {
		name: "BiddingForMonitoring",
		components: {
			UpDialog,
			DetailDia,
			EditDia,
		},
		data() {
			return {
				activelList: [],
				editNum: 1,
				// 弹层flag
				upDialogFlag: false,
				detailFlag: false,
				editFlag: false,

				//页码相关
				total: "",
				currpage: 1,
				pagesize: 10,
				//表格渲染数据
				tableData: [],
				//上传Excel
				input: "",
				//名字搜索的内容
				peoplename: "",
				//请求头
				userid: "",
				username: "",
				code: "",
				//默认开始页面
				//每页的数据条数
				//竞标下拉框

				tablerow: "", //容器
				log: "", //详情内容
				tableHeight: 0,
			};
		},
		created() {
			// check方法调用接口,判断用户是否登录!
			this.check();
		},
		mounted() {
			this.tableHeight = window.getComputedStyle(this.$refs.tableBox).height;

			//设置请求头
			this.userid = localStorage.getItem("wx_userid");
			this.code = localStorage.getItem("wx_code");
			this.username = localStorage.getItem("user_name");
			this.peoplelist = [{
				name: this.username,
				userid: this.userid,
			}, ];
			//调用查看列表
			this.getlist();
		},
		methods: {
			// 查看列表
			getlist() {
				BidList({
						trans_name: this.username,
						limit: this.pagesize,
						page: this.currpage,
					})
					.then((res) => {
						if (res.data.code == 10000) {
							this.tableData = res.data.data;
							this.total = res.data.count;
						} else if (res.data.code == 10001) {
							this.$message.warning("参数丢失");
						} else if (res.data.code == 10002) {
							console.log("db error");
						} else {
							console.log("未知情况");
						}
					})
					.catch((err) => {
						console.log(err);
					});
			},
			upList() {
				this.upDialogFlag = true;
			},
			// 关闭详情弹层
			closeDetailEvent(tag) {
				this.detailFlag = false;
				if (tag) {
					this.changelist = [];
					this.getlist();
				}
			},
			// 关闭修改弹层
			closeEditEvent() {
				const vm = this;
				vm.editFlag = false;
				vm.getlist();
			},
			// 关闭上传弹层
			closeUpEvent() {
				const vm = this;
				vm.upDialogFlag = false;
				vm.getlist();
			},
			// 详情按钮
			detailEvent(row) {
				this.detailFlag = true;
				this.tablerow = row;
			},
			// 修改按钮
			editEvent(row) {
				this.editFlag = true;
				this.tablerow = row;
				this.editNum = 1
			},
			// 修改活动按钮
			editActiveEvent(row) {
				this.editFlag = true;
				this.tablerow = row;
				this.editNum = 2
			},
			// 删除按钮
			deleteEvent(row) {
				this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					closeOnClickModal: false,
					type: "warning",
				}).then(() => {
					biddingDelete({
						bidding_id: row.bidding_id,
						activity_id: row.activity_id,
					}).then((res) => {
						if (res.data.code === 10000) {
							this.$message({
								type: "success",
								message: "删除成功!",
							});
						}
						this.getlist();
					});
				});
			},
			//分页器功能
			handleSizeChange(val) {
				this.pagesize = val;
				this.getlist();
			},
			handleCurrentChange(page) {
				this.currpage = page;
				this.getlist();
			},
		},
	};
</script>

<style lang="less" scoped>
	@import "../../index";
	@import "./bidding.less";
</style>
