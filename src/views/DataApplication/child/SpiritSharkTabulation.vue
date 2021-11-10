<template>
	<!-- 灵鲨制表 -->
	<div class="spiritSharkTabulation outerDiv">
		<div class="content">
			<div class="form">
				<el-form ref="form" :model="form" class="formObj" :rules="rules">
					<div class="formObj_ipt">
						<el-form-item label="项目:" prop="SelectItemData">
							<el-select v-model="SelectItemData" placeholder="请选择项目" size="medium" clearable
								@change="selectChang">
								<el-option v-for="(item, index) in SelectItem" :key="index" :label="item.project_name"
									:value="[item.project_name, item.file]">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item class="hasdate" label="数据日期:" prop="timeData">
							<el-select v-model="selectValue" placeholder="请选择类型" style="width: 130px" size="medium"
								@change="selectChangT">
								<el-option label="日报" value="1"></el-option>
							</el-select>
							<el-date-picker v-model="timeData" type="date" style="width: 170px; margin-left: 20px"
								size="medium" @blur="dateBlur" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"
								placeholder="选择日期">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="数据状态:">
							<div class="state stateItem">
								<i v-show="dataState === '' || dataState === '参数错误'" class="info el-icon-minus"></i>
								<i v-show="dataState === 1" class="suc el-icon-check">数据已准备</i>
								<i v-show="dataState === 0" class="warn el-icon-loading">数据准备中</i>
								<i v-show="dataState === 2" class="dang el-icon-close">数据未准备</i>
							</div>
						</el-form-item>
					</div>
					<div class="formObj_upload">
						<el-form-item label="" v-show="SelectItemData[1]">
							<Upload :progressPercent="progressPercent" @getFile="getFileEvent"></Upload>
						</el-form-item>
					</div>
					<div class="formObj_button">
						<el-form-item>
							<div v-if="SelectItemData[1] === true">
								<el-button type="primary" class="btnnormal" @click="generate()"
									v-if="dataState === 1 && fileList.length !== 0">生成</el-button>
								<el-button type="primary" class="btnnormal" @click="generate()" disabled v-else>生成
								</el-button>
								<el-button type="primary" class="btnnormal marginL" @click="reset()">重置</el-button>
							</div>
							<div v-else>
								<el-button type="primary" class="btnnormal" @click="generate()" v-if="dataState === 1">
									生成</el-button>
								<el-button type="primary" class="btnnormal" @click="generate()" disabled v-else>生成
								</el-button>
								<el-button type="primary" class="btnnormal marginL" @click="reset()">重置</el-button>
							</div>
						</el-form-item>
					</div>
				</el-form>
			</div>
			<div ref="tableBox" class="tableBox teshu" :class="outerTableHeight">
				<el-divider>列表</el-divider>
				<div class="tables">
					<div class="tableTab">
						<el-button type="text" size="mini" @click="DeleteReportAll">批量删除</el-button>
						<el-table class="tableBox" border ref="multipleTable" :data="itemList" tooltip-effect="dark"
							:height="tableHeight" :header-cell-style="{background:'#f4f4f4',color: '#666'}" @selection-change="handleSelectionChange">
							<template slot="empty">
							    <span class="iconfont icon-wushuju">暂无数据</span>
							  </template>
							<el-table-column type="selection" width="50" align="center" fixed="left"> </el-table-column>
							<el-table-column type="index" width="80" label="序号" align="center" fixed="left"></el-table-column>
							<el-table-column prop="report_name" label="报表名称" min-width="150">
							</el-table-column>
							<el-table-column prop="status" label="状态" width="120">
								<template slot-scope="scope">
									<div v-if="scope.row.status === 0" style="color: orange">
										生成中
									</div>
									<div v-if="scope.row.status === 1" style="color: #85ce61">
										已生成
									</div>
									<div v-if="scope.row.status === 2" style="color: red">
										生成失败
									</div>
								</template>
							</el-table-column>
							<el-table-column prop="data_date" label="数据日期" min-width="100">
							</el-table-column>
							<el-table-column prop="create_time" label="创建时间" min-width="140">
							</el-table-column>
							<el-table-column prop="id" label="操作" width="200" fixed="right">
								<template slot-scope="scope">
									<div>
										<el-button v-if="scope.row.status === 1" type="text" class="el-icon-download"
											@click="downEvent(scope.row.id, scope.row.report_name)">下载</el-button>
										<el-button v-if="scope.row.status !== 1" type="text" class="el-icon-download"
											disabled>下载</el-button>
										<el-button v-if="scope.row.status === 0" type="text" class="el-icon-delete"
											disabled>删除</el-button>
										<el-button v-if="scope.row.status !== 0" type="text" class="el-icon-delete"
											@click="deleteEvent(scope.row.id)">删除</el-button>
									</div>
								</template>
							</el-table-column>
						</el-table>
					</div>
					<!-- 分页器 -->
					<div class="block" v-if="total">
						<el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange"
							:current-page.sync="currpage" :page-size="pagesize" background
							:page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper"
							:total="total">
						</el-pagination>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		selectItem,
		dataState,
		makeAReport,
		DownloadReport,
		ObjectList,
		DeleteReport,
		ReportStatus,
	} from "@/api/api.js";
	import Upload from "@/components/upload";
	export default {
		name: "SpiritSharkTabulation",
		components: {
			Upload,
		},
		data() {
			return {
				rules: {
					SelectItemData: [{
						required: true,
						message: "请选择项目",
						trigger: "blur"
					}, ],
				},
				timer: "",
				form: {},
				selectValue: "1",
				dataState: "",
				loading: false,
				timeData: "",
				fileName: "",
				SelectItem: "",
				pagesize: 10,
				total: "",
				progressPercent: 0,
				currpage: 1,
				SelectItemData: "",
				fileList: [], // excel文件列表
				itemList: [], //表格项目列表信息
				multipleSelection: "",
				tableHeight: 0,
				outerTableHeight: "cls2",
			};
		},
		watch: {
			SelectItemData: {
				handler(newval, oldval) {
					const vm = this;
					if (newval[1]) {
						vm.outerTableHeight = "cls1";
					} else {
						vm.outerTableHeight = "cls2";
					}
				},
				deep: true,
				immediate: true,
			},
		},
		created() {
			// check方法调用接口,判断用户是否登录!
			this.check();
			this.getSelectItem();
		},
		mounted() {
			this.tableHeight = window.getComputedStyle(this.$refs.tableBox).height;
		},
		methods: {
			getFileEvent(val) {
				this.fileList = val;
			},
			// 获取表格项目列表信息
			getObjectList() {
				const vm = this;
				ObjectList({
						project_name: vm.SelectItemData[0],
						page: vm.currpage,
						per_page: vm.pagesize,
					})
					.then((res) => {
						vm.itemList = res.data.data.data;
						vm.total = res.data.data.total_count;
					})
			},
			// 获取数据状态
			dateBlur() {
				const vm = this;
				if (
					vm.SelectItemData !== "" &&
					vm.selectValue !== "" &&
					vm.timeData !== ""
				) {
					// 数据状态
					dataState({
							project_name: vm.SelectItemData[0],
							date: vm.timeData,
						})
						.then((res) => {
							vm.dataState = res.data.data.status;
							if (res.data.mag === 1) {
								vm.generate();
							}
						})
				}
			},			
			// 生成报表
			generate() {
				const vm = this;
				vm.loading = true;
				makeAReport({
						project_name: vm.SelectItemData[0],
						date: vm.timeData,
						file: vm.fileList[0],
						username: localStorage.getItem("user_name"),
					})
					.then((res) => {
						vm.getObjectList();
						vm.progressPercent = 100;
						vm.timer = window.setInterval(() => {
							vm.ReportStatus(res.data.data.data);
						}, 5000);
						if (res.data.msg === "success") {
							vm.$message.warning("生成中");
						} else {
							vm.$message.success(res.data.msg);
						}
						vm.loading = false;
						if (res.data.msg !== "该报表已生成,请前去下载") {
							vm.itemList.unshift(res.data.data);
						}
					})
			},
			//获取生成的报表数据状态
			ReportStatus(val) {
				const vm = this;
				ReportStatus({
						id: val.id,
					})
					.then((res) => {
						if (res.data.data.status !== 0) {
							clearInterval(vm.timer);
							vm.getObjectList();
						}
					})
			},	
			// 重置
			reset() {
				const vm = this;
				this.SelectItemData = "";
				this.selectValue = "1";
				this.dataState = "";
				this.timeData = "";
				this.itemList = [];
				this.fileList = [];
				this.total = 0;
				this.progressPercent = 0;
			},
			delApi() {
				DeleteReport({
						id: this.multipleSelection,
					})
					.then((res) => {
						this.$message.success("删除成功！");
						this.getObjectList();
					})
			},
			// 删除
			deleteEvent(ID) {
				const vm = this;
				vm.$confirm("确定删除该报表？", "删除提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning",
				}).then(() => {
					vm.multipleSelection = ID;
					vm.delApi();
				});
			},
			// 批量删除
			DeleteReportAll() {
				if (this.multipleSelection) {
					this.$confirm("确定删除所选中的报表？", "删除提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
					}).then(() => {
						this.delApi();
					});
				} else {
					this.$message.warning("没有可删除的项目！");
				}
			},
			// 下载
			downEvent(ID, name) {
				const vm = this;
				vm.multipleSelection = ID;
				vm.fileName = name;
				DownloadReport({
						id: vm.multipleSelection,
					})
					.then((res) => {
						if (res.data.code) {
							alert("错误");
						} else {
							let data = res.data;
							let url = window.URL.createObjectURL(new Blob([data]));
							let link = document.createElement("a");
							link.style.display = "none";
							link.href = url;
							link.setAttribute("download", vm.fileName);
							document.body.appendChild(link);
							link.click();
						}
					})
			},
			selectChang() {
				this.getObjectList();
				this.selectValue = "1";
				this.dataState = "";
				this.timeData = "";
				this.itemList = [];
				this.fileList = [];
				this.total = 0;
				this.progressPercent = 0;
				this.dateBlur();
			},
			selectChangT() {
				this.dateBlur();
			},
			// 获取下拉款项目选项
			getSelectItem() {
				const vm = this;
				selectItem()
					.then((res) => {
						vm.SelectItem = res.data.data.data;
					})
			},
			// table表格选择项变化时，改变multipleSelection
			handleSelectionChange(val) {
				this.multipleSelection = "";
				for (let i = 0; i < val.length; i++) {
					this.multipleSelection += val[i].id + ",";
				}
				this.multipleSelection = this.multipleSelection.substring(
					0,
					this.multipleSelection.length - 1
				);
			},
			handleSuccess(res, file, fileList) {
				this.$message.success("文件上传成功");
				this.fileList = [];
				this.peoplelist = [];
				this.itemid = [];
				this.dialogVisible = false;
			},
			//分页器功能
			handleCurrentChange(page) {
				this.currpage = page;
				this.getObjectList();
			},
			handleSizeChange(val) {
				this.pagesize = val;
				this.getObjectList();
			},
		},
	};
</script>

<style lang="less" scoped>
	@import "../../index";
</style>
