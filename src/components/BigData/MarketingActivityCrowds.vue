<template>
	<!-- 营销活动人群 -->
	<div class="marketingActivityCrowds">
		<div style="width: 100%; height: 80px;"></div>
		<div class="content">
			<div class="form">
				<el-form ref="form" :model="form" label-width="80px" class="formObj">
					<el-form-item label="选择账号:">
						<el-input v-model="form.input" size="mini" class="w320" placeholder="请输入账号"></el-input>
					</el-form-item>
					<el-form-item label="输入密码:">
						<el-input v-model="form.pass" size="mini" class="w320" placeholder="请输入密码"></el-input>
					</el-form-item>
					<el-form-item>
						<a href="http://tool.afocus.com.cn/file_download/营销活动.xlsx" download="营销活动.xlsx" style="margin-right: 50px;"><div class="btnSize">下载模板</div></a>
					</el-form-item>
					<el-form-item label="">
						<el-upload drag :auto-upload="false" accept=".xlsx" :action="UploadUrl()" :on-remove="remfile" :before-upload="beforeUploadFile" :on-change="fileChange" :on-success="handleSuccess" :on-error="handleError" :file-list="fileList" style="width: 360px; margin-top: 10px">
							<i class="el-icon-upload"></i>
							<div class="el-upload__text">
								将文件拖到此处，或<em>点击上传</em>
							</div>
							<div class="el-upload__tip" slot="tip">
								请先上传xlsx文件后，再进行执行操作
							</div>
						</el-upload>
					</el-form-item>
					<el-form-item>
						<div style="width: 400px">
						  <el-progress
							v-if="!form.progressPercent"
						    :percentage="form.progressPercent"
						  ></el-progress>
							<el-progress v-if="form.progressPercent" :percentage="form.progressPercent" status="success"></el-progress>
						</div>
					</el-form-item>
					<el-form-item>
						<div style="display: flex;">
							<div class="btnSize" type="primary" :disabled="this.fileList==''?true:false"  @click="uploadFile">立即上传</div>
							<div class="btnSizeSmall marginL" type="primary" :disabled="this.msg==''?true:false" @click="going" :loading="loadingbut">{{loadingbuttext}}</div>
						</div>
					</el-form-item>
				</el-form>
				<el-divider></el-divider>
				<div class="tables">
					<div class="dialog">
						<el-dialog
						title="账号验证"
						:visible.sync="verification"
						width="500px"
						max-height="600px"
						>
							<div class="tips">该账号需要进行手机验证</div>
							<div class="tipsItem">*验证完成后请重新操作*</div>
							<div class="button">
							<div class="btnSize" @click="verificationFun">立即验证</div>
							</div>
						</el-dialog>
					</div>
					<div class="tableTab" v-if="tableData">
					  <el-table ref="singleTable" class="tableBox" :data="tableData" min-height="540" size="small" @cell-click="celltable" :highlight-current-row="true" :cell-style="timeStyle">
					    <!-- 表格序号 -->
					    <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
					
					    <!-- 表格日期 -->
					    <el-table-column property="create_time" label="日期" width="430" align="center">
					      <template slot-scope="scope">
					        <div>
					          {{ scope.row.create_time }}
					        </div>
					      </template>
					    </el-table-column>
					
					    <!-- 基本信息 -->
					    <el-table-column property="title" label="基本信息" width="230" align="center">
					      <template slot-scope="scope">
					        <div>
					          {{ scope.row.title }}
					        </div>
					      </template>
					    </el-table-column>
					
					    <!-- 查看详情 -->
					    <el-table-column property="cheack" label="操作" width="120" align="center">
					      <el-button type="text" @click="dialogVisible = true">查看详情</el-button>
					    </el-table-column>
					  </el-table>
					</div>
					<!-- 分页器 -->
					<div class="block" v-if="total">
						<el-pagination
						      @size-change="handleSizeChange"
						      @current-change="handleCurrentChange"
						      :current-page.sync="currpage"
						      :page-size="pagesize"
						      layout="total, prev, pager, next, jumper"
						      :total="total">
						</el-pagination>
					</div>
					<!-- 查看详情弹出框 -->
					<div class="dialog">
					  <el-dialog title="查看详情" :visible.sync="dialogVisible" width="500px" max-height="600px">
					    <div>详情信息：{{ log }}</div>
					  </el-dialog>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { fxcjviewDetails, fxcjupload, fxcjtools, fxcjExamine } from '../../api/api.js'
export default {
	name:'MarketingActivityCrowds',
	data() {
		return {
			form: {
				input: '',
				pass:'',
				pin:'',
				progressPercent:0,
			},
			switchText:'',
			fileList: [], // excel文件列表
			activeName: "first",
			loadingbut:false,
			loadingbuttext:'执行',
			tableData: [],
			total: "",  
			exc: "",
			userid: "",
			code: "",
			username: "", //用户名
			rizhi: "", //日志内容
			msg: "", //根据上传判断执行条件
			dialogVisible: false,
			verification:false,
			//分页器状态
			currentPage: 1,
			pagesize: 10, //每页的数据条数
			currpage: 1, //默认开始页面
			tablerow: "", //当前选中用户
			id: [], //查看日志的id
			idT: "", //查看详情渲染的idT
			title: "", //查看详情渲染的title
			log: "", //查看详情渲染的log
			choose:''//传值为1或2
			
		}
	},
	methods: {
	timeStyle(){
		return "height:50px;padding:0;"
	},
	verificationFun(){
		var tempwindow = window.open('_blank');
		tempwindow.location=this.pageJumps;
		this.verification = false;
	},
    //点击选中的用户 查看详情
	celltable(row) {
		this.tablerow = row;
		const headers = { uid: this.userid, code: this.code };
		let params = { id: this.tablerow.id }
		fxcjviewDetails(headers,params).then((res)=>{
			if (res.code == 10000) {
				this.idT = res.data.id;
				this.title = res.data.title;
				this.log = res.data.log;
			} else if (res.code == 10001) {
				this.$message.warning("是否忘记传参");
			} else if (res.code == 10002) {
				this.$message.warning("您传入的id有误");
			} else {
				this.$message.error("查看失败");
			}
		}).catch((err)=>{
			console.log(err);
		})
	},
    //页码发生改变时触发
    pagetype(page) {
      this.page = page;
      this.getuserlist(page);
    },
    // 文件状态改变时的钩子
    fileChange(file, fileList) {
      this.fileList.push(file.raw);
      this.form.progressPercent = 0
    },
    // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
    beforeUploadFile(file) {
      let extension = file.name.substring(file.name.lastIndexOf(".") + 1);
      let size = file.size / 1024 / 1024;
      if (extension !== "xlsx") {
        this.$message.warning("只能上传后缀是.xlsx的文件");
      }
      if (size > 50) {
        this.$message.warning("文件大小不得超过50M");
      }
    },
    //文件列表移除时的钩子
    remfile(file, fileList){
      this.fileList.pop('file')
    },
    // 文件上传成功时的钩子
    handleSuccess(res, file, fileList) {
      this.$message.success("文件上传成功");
      this.fileList = []
    },
    // 文件上传失败时的钩子
    handleError(err, file, fileList) {
      this.$message.error("文件上传失败");
    },
    UploadUrl: function () {
      // 因为action参数是必填项，我们使用二次确认进行文件上传时，直接填上传文件的url会因为没有参数导致api报404，所以这里将action设置为一个返回为空的方法就行，避免抛错
      return "";
    },
    //立即上传 并判断上传文件是否为空if () {
	uploadFile(data) {
		for(let i=0;i<this.fileList.length;i++){
			let form = new FormData();
			form.append("trans_name", this.username);
			form.append("file",this.fileList[i]);
			const headers = { uid: this.userid, code: this.code }
			fxcjupload(headers, form).then((res)=>{
				if(res.code==10000){
					this.form.progressPercent = 100;
					this.msg = res.code
					this.fileList=[]
					this.$message.success('上传成功')
				}
			}).catch((err)=>{
				console.log(err);
			})
		}
	},
    //查看
    getuserlist() {
		const headers = { uid: this.userid, code: this.code }
		let params = {
			tool_type:'6',
			limit:this.pagesize,
			page: this.currpage
		}
		fxcjExamine(headers, params).then((res)=>{
			this.tableData = res.data;
			this.total = res.count;
		}).catch((err)=>{
			console.log(err)
		})
    },
    //执行
    going() {
      //调用大数据工具请求
      if (this.form.input == "") {
        this.$message.warning("请输入账号!");
      } else if (this.form.pass == "") {
        this.$message.warning("请输入密码!");
      } else {
        this.loadingbut = true;
        this.loadingbuttext = "审核中...";
		const headers = { uid: this.userid, code: this.code }
		let data = {
			username:this.form.input,
			password:this.form.pass,
			trans_name:this.username,
			tool_type:'6',
			choose:'3'
		}
		data = this.qs.stringify(data);
		fxcjtools(headers, data).then((res)=>{
			if (res.code == "10000") {
				this.getuserlist();
				this.$message.success("执行成功");
				this.loadingbuttext = "执行";
				this.loadingbut = false;
			} else if (res.code == "10001") {
				this.$message.warning("未上传cookie或tool type或trans_name");
				this.loadingbuttext = "执行";
				this.loadingbut = false;
			} else if (res.code == "10003") {
				this.$message.error("内部错误");
				this.loadingbuttext = "执行";
				this.loadingbut = false;
			} else if (res.code == "10004") {
				this.$message.warning("请求受限");
				this.loadingbuttext = "执行";
				this.loadingbut = false;
			} else if (res.code == "10005") {
				if(res.msg === '账号或密码错误'){
					this.$message.warning("请检查用户密码是否正确");
				} else {
					this.pageJumps = res.msg.substring(14);
					this.verification = true;
				}
				this.loadingbuttext = "执行";
				this.loadingbut = false;
			} else {
				this.$message.error("执行失败");
			}
		}).catch((err)=>{
			console.log(err)
		})
        this.msg = "";
        this.fileList = [];
        this.form.progressPercent = 0;
      }
    },
    //分页器功能
    handleSizeChange(val) {
      this.pagesize = val;
    },
    //有接口请求 每点击一页进行一次数据请求 参数页码为动态值：
    handleCurrentChange(page) {
      this.currpage = page;
      this.getuserlist(this.currpage);
    },
  },
  mounted() {
    this.userid = localStorage.getItem("wx_userid");
    this.code = localStorage.getItem("wx_code");
    this.username = localStorage.getItem("user_name");
    this.people = localStorage.getItem("user_name");
    this.getuserlist(1);
  },
  created() {
  	// check方法调用接口,判断用户是否登录!
  	this.check();
  }
}
</script>

<style lang="less" scoped>
	/deep/input{
		border-radius: 0 !important;
	}
	.w320{
		width: 320px;
	}
	.btnSize{
		width: 98px;
		height: 38px;
		border: 1px solid #0051B3;
		text-align:  center;
		color: #2066BD;
		cursor: pointer;
		line-height: 38px;
	}
	.btnSizeSmall{
		width: 68px;
		height: 38px;
		border: 1px solid #0051B3;
		color: #2066BD;
		text-align:  center;
		cursor: pointer;
		line-height: 38px;
	}
	.marginL{
		margin-left: 10px;
	}
	.marketingActivityCrowds{
		width: 1200px;
		margin: 0 auto;
		.content{
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
			display: flex;
			flex-direction: row-reverse;
			.form{
				min-height: 1250px;
				padding-top: 50px;
				width: 975px;
				background-color: #fff;
				.formObj{
					width:500px;
					margin: 0 auto;
				}
				.tables{
					width: 88%;
					margin: 0 auto;
					.tableTab{
						.tableBox{
							width: 100%;
						}
					}
					.block{
						display: flex;
						// text-align: center;
						height: 80px;
						line-height: 80px;
						justify-content: center;
						margin-top: 20px;
					}
					.dialog{
						.tips{
							width: 80%;
							height: 50px;
							margin: 0 auto;
							text-align: center;
							font-size: 18px;
							line-height: 50px;
						}
						.tipsItem{
							width: 80%;
							height: 50px;
							margin: 0 auto;
							text-align: center;
							font-size: 12px;
							color: red;
							line-height: 50px;
						}
						.button{
							width: 100px;
							height: 40px;
							margin: 0 auto;
						}
					}
				}
			}
		}
	}
</style>