<template>
	<!-- 灵鲨制表 -->
	<div class="spiritSharkTabulation">
		<div class="content">
			<div class="form">
				<el-form ref="form" :model="form" label-width="80px" class="formObj">
					<el-form-item label="选择项目:">
						<el-select v-model="SelectItemData" placeholder="请选择项目" class="w320" size="mini"  @change="selectChang">
							<el-option
							v-for="(item,index) in SelectItem"
							:key="index"
							:label="item.project_name"
							:value="[item.project_name, item.file]">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="数据日期:">
						<el-select v-model="selectValue" placeholder="请选择日期" style="width: 130px;" size="mini" @change="selectChangT">
							<el-option
							lable="日报"
							value="日报"
							></el-option>
						</el-select>
						<el-date-picker
							v-model="timeData"
							type="date"
							style="width: 170px; margin-left: 20px;"
							size="mini"
							@blur="dateBlur"
							format="yyyy 年 MM 月 dd 日"
							value-format="yyyy-MM-dd"
							placeholder="选择日期">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="数据状态:">
						<div class="state">
							<div class="stateItem" v-show="dataState === '' || dataState === '参数错误'">
								<el-button size="mini" type="info" icon="el-icon-minus" circle></el-button><div>请先选择项目和日期</div>
							</div>
							<div class="stateItem" v-show="dataState === 1">
								<el-button size="mini" type="success" icon="el-icon-check" circle></el-button><div>数据已准备</div>
							</div>
							<div class="stateItem" v-show="dataState === 0">
								<el-button size="mini" type="warning" icon="el-icon-loading" circle></el-button><div>数据准备中</div>
							</div>
							<div class="stateItem" v-show="dataState === 2">
								<el-button size="mini" type="danger" icon="el-icon-close" circle></el-button><div>数据未准备</div>
							</div>
						</div>
					</el-form-item>
					<el-form-item label="日报模板:" v-show="SelectItemData[1]">
						<el-upload drag :on-remove="remfile" :auto-upload="false" accept=".xlsx" :action="UploadUrl()" :before-upload="beforeUploadFile" :on-change="fileChange" :on-success="handleSuccess" :on-error="handleError" :file-list="fileList" :limit="1" style="width: 360px; margin-top: 10px">
						<i class="el-icon-upload"></i>
						<div class="el-upload__text">
						  将文件拖到此处，或<em>点击上传</em>
						</div>
						<div class="el-upload__tip" slot="tip" style="color:red">
						  请上传一个后缀为.xlsx的文件
						</div>
						</el-upload>
						<div style="width:385px">
							<el-progress
							v-if="!progressPercent"
							:stroke-width="5"
							:percentage="progressPercent"
							></el-progress>
							<el-progress v-if="progressPercent" :percentage="progressPercent" status="success"></el-progress>
						</div>
					</el-form-item>
					<el-form-item>
						<div v-if="SelectItemData[1] === true">
							<el-button style="color:#2066BD; border: 1px solid #0051B3; border-radius:0"  @click="generate()" v-if="dataState === 1 && fileList.length !== 0">生成</el-button>
							
							<el-button style="color:#2066BD; border: 1px solid #0051B3; border-radius:0"  @click="generate()" disabled v-else>生成</el-button>
							<el-button style="color:#2066BD; border: 1px solid #0051B3; border-radius:0" @click="reset()">重置</el-button>
						</div>
						<div v-else>
							<el-button style="color:#2066BD; border: 1px solid #0051B3; border-radius:0"  @click="generate()" v-if="dataState === 1">生成</el-button>
							<el-button style="color:#2066BD; border: 1px solid #0051B3; border-radius:0"  @click="generate()" disabled v-else>生成</el-button>
							<el-button style="color:#2066BD; border: 1px solid #0051B3; border-radius:0" @click="reset()">重置</el-button>
						</div>
						
					</el-form-item>
				</el-form>
				<el-divider>列表</el-divider>
				<div class="tableTab">
					<el-button type="text" size="mini" @click="DeleteReportAll">批量删除</el-button>
					<el-table
					    ref="multipleTable"
					    :data="itemList"
					    tooltip-effect="dark"
					    style="width: 100%;"
						min-height="540"
					    @selection-change="handleSelectionChange" :cell-style="timeStyle">
					    <el-table-column
					      type="selection"
					      width="80">
					    </el-table-column>
					    <el-table-column
					      prop="report_name"
					      label="报表名称"
						  align="center"
						  width="200"
					      >
						  <template slot-scope="scope">
						    <div>
						      {{ scope.row.report_name }}
						    </div>
						  </template>
					    </el-table-column>
					    <el-table-column
					      prop="status"
					      label="状态"
						  align="center"
					      >
						  <template slot-scope="scope">
						    <div v-if="scope.row.status === 0" style="color: orange;">
						      生成中
						    </div>
							<div v-if="scope.row.status === 1" style="color: #85ce61;">
							  已生成
							</div>
							<div v-if="scope.row.status === 2" style="color: red;">
							  生成失败
							</div>
						  </template>
					    </el-table-column>
						<el-table-column
						  prop="data_date"
						  label="数据日期"
						  align="center"
						  width="150"
						  >
						  <template slot-scope="scope">
						    <div>
						      {{ scope.row.data_date }}
						    </div>
						  </template>
						</el-table-column>
						<el-table-column
						  prop="create_time"
						  label="创建时间"
						  align="center"
						  width="200"
						  >
						  <template slot-scope="scope">
						    <div>
						      {{ scope.row.create_time }}
						    </div>
						  </template>
						</el-table-column>
						<el-table-column
							prop="id"
							label="操作"
							align="center"
						  >
						  <template slot-scope="scope">
							  <div>
								  <el-button v-if="scope.row.status === 1" type="text" @click="downLoad(scope.row.id, scope.row.report_name)">下载</el-button>
								  <el-button v-if="scope.row.status !== 1" type="text" disabled>下载</el-button>
								  <el-button v-if="scope.row.status === 0" type="text" disabled>删除</el-button>
								  <el-button v-if="scope.row.status !== 0" type="text" @click="deleteReport(scope.row.id)">删除</el-button>
							  </div>
						  </template>
						</el-table-column>
					  </el-table>
				</div>
				<!-- 分页器 -->
				<div class="block" v-if="total">
				  <el-pagination
				    @current-change="handleCurrentChange"
					:current-page.sync="currpage"
					:page-size="pagesize"
					layout="total, prev, pager, next, jumper"
					:total="total">
				  </el-pagination>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { selectItem, dataState, makeAReport, DownloadReport, ObjectList, DeleteReport, ReportStatus } from '@/api/api.js'
export default {
	name:'SpiritSharkTabulation',
    data() {
        return {
			timer: '',
			form:{},
            selectValue:"",
			dataState:'',
			loading:false,
			timeData:'',
			fileName:'',
			SelectItem:'',
			pagesize: 10,
			total:'',
			progressPercent: 0,
			currpage: 1,
			SelectItemData:'',
			fileList: [], // excel文件列表
			itemList:[] ,//表格项目列表信息
			multipleSelection: ''
        }
    },
    methods: {
		timeStyle(){
			return "height:50px;padding:0;"
		},
		// 重置
		reset(){
			this.SelectItemData = '';
			this.selectValue = '';
			this.dataState = '';
			this.timeData = '';
			this.itemList = [];
			this.fileList = [];
			this.total = 0;
			this.progressPercent = 0;
		},
		//获取报表数据状态
		ReportStatus(ID){
			ReportStatus({
				id:ID.id
			}).then((res)=>{
				if(res.data.data.status !== 0){
					clearInterval(this.timer);
					this.getObjectList();
				}
			}).catch((err)=>{
				console.log(err);
			})
		},
		// 批量删除
		DeleteReportAll(){
			if(this.multipleSelection){
				this.deleteReportApi();
			} else {
				this.$message.warning('没有可删除的项目！');
			}
		},
		// 下载
		downLoad(ID, name){
			this.multipleSelection = ID;
			this.fileName = name;
			this.getReport();
		},
		// 删除
		deleteReport(ID){
			this.multipleSelection = ID;
			this.deleteReportApi();
		},
		deleteReportApi(){
			DeleteReport({
				id:this.multipleSelection
			}).then((res)=>{
				this.$message.success('删除成功！');
				this.getObjectList();
			}).catch((err)=>{
				console.log(err);
			})
		},
		//分页器功能
		handleCurrentChange(page) {
			this.currpage = page;
			this.getObjectList();
		},
		// 获取表格项目列表信息
		getObjectList(){
			ObjectList({
				project_name:this.SelectItemData[0],
				page:this.currpage,
				per_page:10
			}).then((res)=>{
				this.itemList = res.data.data.data
				this.total = res.data.data.total_count
			}).catch((err)=>{
				console.log(err);
			})
		},
		selectChang(){
			this.getObjectList();
			this.selectValue = '';
			this.dataState = '';
			this.timeData = '';
			this.itemList = [];
			this.fileList = [];
			this.total = 0;
			this.progressPercent = 0;
			this.dateBlur();
		},
		selectChangT(){
			this.dateBlur();
		},
		// 下载报表
		getReport(){
			DownloadReport({
				id:this.multipleSelection
			}).then((res)=>{
				if(res.data.code){
					alert("错误");
				} else{
					let data = res.data
					let url = window.URL.createObjectURL(new Blob([data]))
					let link = document.createElement('a')
					link.style.display = 'none'
					link.href = url
					link.setAttribute('download', this.fileName)		
					document.body.appendChild(link)
					link.click();
				}
			}).catch((err)=>{
				console.log(err);
			})
		},
		// 生成报表
		generate(){
			this.loading = true;
			makeAReport({
				project_name: this.SelectItemData[0],
				date: this.timeData,
				file: this.fileList[0],
				username: localStorage.getItem('user_name')
			}).then((res)=>{
				this.progressPercent = 100;
				this.timer = window.setInterval(()=>{
					this.ReportStatus(res.data.data.data)
				}, 5000);
				if(res.data.msg === 'success') {
					this.$message.warning('生成中');
				} else {
					this.$message.success(res.msg);
				}
				this.loading = false;
				if(res.data.msg !== '该报表已生成,请前去下载'){
					this.itemList.unshift(res.data.data);
				}
			}).catch((err)=>{
				console.log(err);
			})
		},
		dateBlur(){
			if(this.SelectItemData !== '' && this.selectValue !== '' && this.timeData !== ''){
				// 数据状态
				dataState({
					project_name:this.SelectItemData[0],
					date:this.timeData
				}).then((res)=>{
					debugger
					this.dataState = res.data.data.status;
					if(res.data.mag === 1){
						this.generate();
					}
				}).catch((err)=>{
					console.log(err);
				})
			}
		},
		// 获取项目
		getSelectItem(){
			const vm = this
			selectItem().then((res)=>{
				vm.SelectItem = res.data.data.data;
			}).catch((err)=>{
				console.log(err);
			})
		},
		toggleSelection(rows) {
			if (rows) {
				rows.forEach(row => {
					this.$refs.multipleTable.toggleRowSelection(row);
				});
			} else {
				this.$refs.multipleTable.clearSelection();
			}
		},
		handleSelectionChange(val) {
			this.multipleSelection = '';
			for(let i=0; i<val.length; i++){
				this.multipleSelection += val[i].id + ',';
			}
			this.multipleSelection = this.multipleSelection.substring(0,this.multipleSelection.length-1);
		},
		//文件列表移除时的钩子
        remfile(file, fileList){
          this.fileList.pop('file')
        },
		UploadUrl: function () {
			// 因为action参数是必填项，使用二次确认进行文件上传时，直接填上传文件的url会因为没有参数导致api报404，所以这里将action设置为一个返回为空的方法就行，避免抛错
			return "";
		},
    // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
		beforeUploadFile(file) {
			let extension = file.name.substring(file.name.lastIndexOf(".") + 1);
			let size = file.size / 1024 / 1024 <50;
			if(extension !== "xlsx") {
				this.$message.warning("只能上传后缀是.xlsx的文件");
			}
			if(!size) {
				this.$message.warning("文件大小不得超过50M");
				return size
			}
		},
		// 文件状态改变时的钩子
		fileChange(file, fileList) {
			this.fileList.push(file.raw);
			this.progressPercent = 0
		},
		handleSuccess(res, file, fileList) {
			this.$message.success("文件上传成功");
			this.fileList=[]
			this.peoplelist=[]
			this.itemid=[]
			this.dialogVisible = false;
		},
		handleError(err, file, fileList) {
			this.$message.error("文件上传失败");
		},
    },
	created() {
		// check方法调用接口,判断用户是否登录!
		this.check();
		this.getSelectItem();
	},
    mounted() {
        
    },
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
	.spiritSharkTabulation{
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
					.state{
						.stateItem{
							width: 200px;
							// height: 40px;
							display: flex;
							position: relative;
							top: 7px;
							el-bottom{
								position: absolute;
							}
							div{
								position: absolute;
								top: -5px;
								left: 50px;
							}
						}
					}
				}
				.tableTab{
					width: 88%;
					margin: 0 auto;
				}
				.block{
					display: flex;
					// text-align: center;
					height: 80px;
					line-height: 80px;
					justify-content: center;
					margin-top: 20px;
				}
			}
		}
	}
</style>