<template>
	<!-- 活动页面SKU -->
	<div class="activePageSKU outerDiv">
		<div class="content">
			<div class="content_form">
				<el-form ref="form" :model="form" class="formObj">
					<div class="formObj_ipt">
						<el-form-item label="PIN:" prop="pin">
							<el-input placeholder="请输入活动页面URL" v-model.trim="form.url" class="input-with-select" clearable>
								<el-button slot="append" type="primary" :disabled="!form.url"
									@click="going">执行</el-button>
							</el-input>
						</el-form-item>
					</div>
				</el-form>
			</div>
			<div class="content_tableBox hasUp4">
				<div class="tables">
					<div class="tableTab">
						<el-table ref="singleTable" class="tableBox" :data="tableData"
							:header-cell-style="{background:'#eef0f1',color: '#606266'}" :highlight-current-row="true">
							<template slot="empty">
								<span class="iconfont icon-wushuju">暂无数据</span>
							</template>
							<!-- 表格日期 -->
							<el-table-column property="c_time" label="时间" min-width="150" align="center">
								<template slot-scope="scope">
									<div>
										{{ scope.row.c_time }}
									</div>
								</template>
							</el-table-column>
						
							<!-- 查看链接 -->
							<el-table-column property="link" label="查看链接" min-width="300" align="center">
								<template slot-scope="scope">
									<div>
										{{ scope.row.link }}
									</div>
								</template>
							</el-table-column>
						
							<!-- excel表 -->
							<el-table-column property="file_name" label="Excel表" min-width="280" align="center">
								<template slot-scope="scope">
									<div>
										{{ scope.row.file_name }}
									</div>
								</template>
							</el-table-column>
						
							<!-- 操作 -->
							<el-table-column property="download" label="下载" width="150" align="center">
								<template slot-scope="scope">
									<div>
										<button @click="lianjie(scope)">
											<a id="download" type="primary">下载</a>
										</button>
									</div>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		hdskuLookData,
		performSku
	} from "@/api/api.js";
	export default {
		data() {
			return {
				form: {
					url: ''
				},
				//表格数据接受
				tableData: [],
				//请求传的参数
				userid: "",
				code: "",
				username: "",
				// 当前选中excel
				tablerow: "",
				//下载url
				resurl: true,
			};
		},
		created() {
			// check方法调用接口,判断用户是否登录!
			this.check();
		},
		methods: {
			//查看
			getuserlist() {
				const vm = this;
				hdskuLookData({
						trans_name: vm.username,
					})
					.then((res) => {
						if (res.data.data.length > 0) {
							vm.tableData = res.data.data;
						} else {
							vm.$message.warning('暂无数据');
						}
					})
			},
			//执行
			going() {
				performSku({
						trans_name: this.username,
						url: this.form.url,
					})
					.then((res) => {
						  if(res.data.code === 10000){
						    this.form.url = "";
						    this.getuserlist()
						  }
					})
			},
			// 下载
			lianjie(scope) {
				console.log(scope.row.file_name);
				this.$axios({
					url: "http://114.67.229.243:8001/apps/sku_excel_download/",
					method: "get",
					headers: {
						uid: this.userid,
						code: this.code,
						"Content-Type": "application/json",
					},
					responseType: "blob",
					params: {
						file_name: scope.row.file_name
					},
				}).then(
					(res) => {
						const blob = new Blob([res.data], {
							type: "application/vnd.ms-excel",
							charset: "utf-8",
							"content-type": "application/octet-stream",
						});
						const objectUrl = URL.createObjectURL(blob);
						window.location.href = objectUrl;
					},
					(err) => {
						console.log(err);
					}
				);
			},
		},
		mounted() {
			this.userid = localStorage.getItem("wx_userid");
			this.code = localStorage.getItem("wx_code");
			this.username = localStorage.getItem("user_name");
			this.getuserlist();
		},
	};
</script>

<style lang="less" scoped>
	@import "@/views/index";
</style>
