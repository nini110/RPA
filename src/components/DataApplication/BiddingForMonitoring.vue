<template>
	<!-- 竞标监控 -->
	<div class="biddingForMonitoring">
		<div style="width: 100%; height: 80px;"></div>
		<div class="content">
			<div class="form">
				<div style="width: 126px; margin: 0 auto;">
					<div class="btnSizeBig" @click="upList()">上传竞标按钮</div>
				</div>
				<el-dialog title="上传竞标" :visible.sync="dialogVisible" @close="clearlist" width="600px" max-height="600px">
					<el-form ref="form" :model="form" label-width="80px" class="formObj">
						<el-form-item label="选择竞标:">
							<el-input placeholder="请输入标名或者项目编号并按回车进行搜索" v-model="content" style="width:485px;text-indent:5px;" @input="search" size="mini"></el-input>
							<div class="fuzzyQuery">
								<ul v-if="openkey">
								  <li id="item" v-for="(i,index) in options" :key="index" @click="setitem(i,i.pro_num)">
									<span style="color:red">标名:</span>{{i.pro_name}}
									<span style="color:red">编号:</span>{{i.pro_num}}
								  </li>
								</ul>
							</div>
						</el-form-item>
						<el-form-item label="选择活动:">
							<el-button type="text" @click="flag = true">点击选择活动列表</el-button>
							<div v-show="flag" class="showBox">
								<div class="showBoxItem">
									<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
									  <div style="margin: 15px 0;"></div>
									  <div style="height: 180px; overflow: auto;">
										  <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
										    <el-checkbox v-for="city in cities" :label="city" :key="city.id">{{city.activityName}}</el-checkbox>
										  </el-checkbox-group>
									  </div>
								</div>
							<div class="confirm"><el-button size="mini" @click="flag = false" style="color:#2066BD; border: 1px solid #0051B3; border-radius:0">确定</el-button></div>
							</div>	
						</el-form-item>
						<el-form-item label="添加人员:">
							<el-input class="inline-input"  v-model="cSubcategoryNo" placeholder="请输入上传人员姓名或关键字后再进行添加" @input="chaz" style="width:485px;" size="mini"></el-input>
						</el-form-item>
						<el-tag v-for="tag in restaurants" :disable-transitions="false" :key="tag.userid" type="" style="margin-left: 8px; margin-bottom: 5px;" @close="handleClose(tag)" @click="tianjia(tag)">{{tag.name}}</el-tag>
						<el-divider></el-divider>
						<div class="send" style="display:flex">
						  <div class="namelist" style="width:60px;margin-right:15px">
						    <ul style="padding:10px 0; list-style: none;">
						      <li v-for="(i,index) in peoplelist" :key="index" :index="index" style="margin-bottom: 5px;" @dblclick="deleteitem(index)"><el-tag>{{i.name}}</el-tag></li>
						    </ul>
						  </div>
						  <div class="上传" style="flex:1">
						    <el-upload drag :on-remove="remfile" :auto-upload="false" accept=".xlsx" :action="UploadUrl()" :before-upload="beforeUploadFile" :on-change="fileChange" :on-success="handleSuccess" :on-error="handleError" :file-list="fileList" style="width: 360px; margin-top: 10px">
						    <i class="el-icon-upload"></i>
						    <div class="el-upload__text">
						      将文件拖到此处，或<em>点击上传</em>
						    </div>
						    <div class="el-upload__tip" slot="tip" style="color:red">
						      请上传xlsx文件，通过搜索添加上传人员，双击上传人员可删除
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
						  </div>
						</div>
						<el-form-item style="margin-top: 10px;">
							<div style="display: flex;">
								<el-button style="width:126px;height:100%; margin-right: 100px;" type="primary" :disabled="this.fileList.length==0||this.content==''||this.peoplelist.length==0?true:false" @click="uploadFile">立即上传</el-button>
								<a href="http://tool.afocus.com.cn/file_download/预算监控模板.xlsx" download="预算监控模板.xlsx"><div class="btnSize">下载模板</div></a>
							</div>
						</el-form-item>
					</el-form>
				</el-dialog>
				<el-divider>列表</el-divider>
				<div class="tables" v-if="tableData">
				  <el-table ref="singleTable" :data="tableData" min-height="800" @cell-click="celltable" :highlight-current-row="true" :cell-style="timeStyle">
				    <!-- 表格序号 -->
				    <el-table-column type="index" width="50" label="序号" align="center">
						<!-- <template slot-scope="scope">
						  <div>
						    {{ scope.row.xh }}
						  </div>
						</template> -->
					</el-table-column>
				
				    <!-- 竞标名称 -->
				    <el-table-column property="bidding_name" label="竞标名称" width="250" align="center">
				      <template slot-scope="scope">
				        <div>
				          {{ scope.row.bidding_name }}
				        </div>
				      </template>
				    </el-table-column>
					
					<!-- 活动名称 -->
					<el-table-column property="bidding_num" label="活动名称" width="150" align="center">
						<template slot-scope="scope">
							<div>
								{{ scope.row.activity_name }}
							</div>
						</template>
					</el-table-column>
				
				
				    <!-- 总预算 -->
				    <el-table-column property="budget" label="总预算" width="150" align="center">
				      <template slot-scope="scope">
				        <div>
				          {{ scope.row.budget }}
				        </div>
				      </template>
				    </el-table-column>
				
				    <!-- 上传人 -->
				    <el-table-column property="trans_name" label="上传人" width="80" align="center">
				      <template slot-scope="scope">
				        <div>
				          {{ scope.row.trans_name }}
				        </div>
				      </template>
				    </el-table-column>
				
				    <!-- 分期预算 -->
				    <el-table-column property="cheack" label="操作" align="center">
						<el-button type="text" @click="lookxq = true">查看详情</el-button>
						<el-button type="text" @click="centerDialogVisible = true">修改</el-button>
						<el-button type="text" @click="biddingDelete()">删除</el-button>
				    </el-table-column>
				  </el-table>
				
				  <!-- 分页器 -->
				  <div class="block" v-if="total">
				    <!-- <span class="demonstration">完整功能</span> -->
				    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currpage" :page-sizes="[10, 20, 30, 40]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
				  </div>
				</div>
				
				<el-dialog title="查看详情" :visible.sync="lookxq" width="750px" max-height="600px" @close="clear">
				  <el-table ref="singleTable" :data="xqlist" min-height="540" :highlight-current-row="true" :cell-style="timeStyle">
				    <!-- 表格序号 -->
				    <el-table-column type="index" width="100" size="small" label="序号" align="center"></el-table-column>
				
				    <!-- 当前预算 -->
				    <el-table-column property="bidding_id" label="当日预算"  align="center">
				      <template slot-scope="scope">
				        <div class="input-box">
				          <el-input style="text-align:center" size="small" @input="changethreshold(scope.row)" v-model="scope.row.threshold"></el-input>
				        </div>
				      </template>
				    </el-table-column>
				
				    <!-- 日期 -->
				    <el-table-column property="bidding_id" size="small" label="日期" align="center">
				      <template slot-scope="scope">
				        <div>
				        {{ scope.row.bidding_date }}
				        </div>
				      </template>
				    </el-table-column>
				  </el-table>
				  <el-button style="width:80px;height:40px" size="small" type="primary" :disabled="this.changelist==''?true:false" @click="sendlist">确定修改</el-button>
						<el-button style="width:60px;height:40px" @click="guanbi" size="small" type="danger">取消</el-button>
				</el-dialog>
				
				
				<el-dialog
				title="修改人员"
				:visible.sync="centerDialogVisible"
				width="30%"
				center>
					<div>
						<div class="sendpeople" style="margin: 5px 0">
							添加人员：<el-input class="inline-input"  v-model="cSubcategoryNo" placeholder="请输入上传人员姓名或关键字后再进行添加" @input="chaz" style="text-indent:5px;"></el-input>
						</div>
						<div class="xian">
						<el-tag v-for="tag in restaurants" :disable-transitions="false" :key="tag.userid" type="" closable @close="NameListhandleClose(tag)" @click="Nametianjia(tag)" style="margin-left: 10px;margin-top: 5px;">
							{{ tag.name }}
						</el-tag>
						</div>
						<div>人员列表：</div>
						<div class="namelist" style="width:100%;margin-right:15px">
							<div style="padding:10px 0 ; display: flex; width: 100%;">
								<div v-for="(i,index) in personnelList" :key="index" :index="index" @dblclick="NameListdeleteitem(index)"><el-tag v-if="i.user_name" style="margin-left: 10px;">{{i.user_name}}</el-tag><el-tag v-if="i.name" style="margin-left: 10px;">{{i.name}}</el-tag></div>
								
							</div>
						</div>
					</div>
					<span slot="footer" class="dialog-footer">
						<el-button @click="centerDialogVisible = false">取 消</el-button>
						<el-button type="primary" @click="isModification()">确 定</el-button>
					</span>
				</el-dialog>
			</div>
			
		</div>
	</div>
</template>
<script>
	let cityOptions = [];
	import {
		BiddingSearch,
		BidIdQueryActivity,
		getName,
		BidList,
		viewDetails,
		detailsToModify,
		immediatelyUpload,
		biddingDelete,
		personnelDetails,
		updateUser
	} from '../../api/api.js'
	export default {
		name: 'BiddingForMonitoring',
		data() {
			return {
				form:{
					
				},
				personnelList: [],
				centerDialogVisible: false,
				checkAll: false,
				checkedCities: [],
				isIndeterminate: false,
				cities: cityOptions,
				flag: false,
				isOptValue: [],
				//上传按钮弹出
				dialogVisible: false,
				//查看详情弹出
				lookxq: false,
				//数据总数
				total: '',
				//表格渲染数据
				tableData: [],
				//竞标搜索开关
				openkey: false,
				//输入关键词的双向绑定
				search_item: "",
				timeout: null,
				//上传Excel
				input: '',
				//搜索的内容
				content: '',
				//名字搜索的内容
				peoplename: '',
				//实时搜索
				result: "",
				//请求头
				userid: '',
				username: '',
				code: '',
				//默认开始页面
				currpage: 1,
				// 竞标id
				jbid: '',
				//每页的数据条数
				pagesize: 10,
				//下拉框
				options: [],
				fileList: [], // excel文件列表
				progressPercent: 0,
				// 上传人员数据
				restaurants: [],
				cSubcategoryNo: '',
				selected: [], // 获得value值
				selectedValue: [], //获得code值
				peoplelist: [], //人员列表
				quchonglist: [], //去重后的
				itemid: [], //上传人员id
				itemname: [], //上传人员姓名
				tablerow: '', //容器
				log: '', //详情内容
				xqlist: [], //查看详情列表
				changelist: [], //修改过后的列表
			};
		},
		methods: {
			timeStyle(){
				return "height:50px;padding:0;"
			},
			upList() {
				this.dialogVisible = true;
			},
			isModification() {
				let itemListid = '';
				let itemListname = '';
				for (let k = 0; k < this.personnelList.length; k++) {
					if (this.personnelList[k].userid) {
						itemListid += this.personnelList[k].userid + ',';
						itemListname += this.personnelList[k].name + ',';
					} else if (this.personnelList[k].user_id) {
						itemListid += this.personnelList[k].user_id + ',';
						itemListname += this.personnelList[k].user_name + ',';
					}
				}
				itemListid = itemListid.slice(0, itemListid.length - 1)
				itemListname = itemListname.slice(0, itemListname.length - 1)
				const headers = {
					uid: this.userid,
					code: this.code
				};
				let data = {
					bidding_id: this.tablerow.bidding_id,
					activity_id: this.tablerow.activity_id,
					user_list: itemListid,
					user_name_list: itemListname
				}
				console.log(data);
				data = this.qs.stringify(data);

				updateUser(headers, data).then((res) => {
					if (res.code === 10000) {
						this.cSubcategoryNo = '';
						this.restaurants = [];
						this.centerDialogVisible = false;
						this.$message({
							type: 'success',
							message: '修改成功!',
						});
					}
				}).catch((err) => {
					console.log(err);
				})
			},
			//竞标监控列表修改
			modification() {
				const headers = {
					uid: this.userid,
					code: this.code
				};
				let params = {
					bidding_id: this.tablerow.bidding_id,
					activity_id: this.tablerow.activity_id
				}
				personnelDetails(headers, params).then((res) => {
					console.log(res)
					this.personnelList = res.data;
				}).catch((err) => {
					console.log(err)
				})
 
			},
			// 竞标列表删除
			biddingDelete() {
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					console.log(this.tablerow)
					const headers = {
						uid: this.userid,
						code: this.code
					};
					let data = {
						bidding_id: this.tablerow.bidding_id,
						activity_id: this.tablerow.activity_id
					}
					data = this.qs.stringify(data);
					biddingDelete(headers, data).then((res) => {
						console.log(res)
						if (res.code === 10000) {
							this.$message({
								type: 'success',
								message: '删除成功!'
							});
						}
						this.getlist();
					}).catch((err) => {
						console.log(err)
					})

				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			//多选框事件
			handleCheckAllChange(val) {
				console.log(this.checkedCities);
			    this.checkedCities = val ? cityOptions : [];
			    this.isIndeterminate = false;
			},
			handleCheckedCitiesChange(value) {
				let checkedCount = value.length;
				this.checkAll = checkedCount === this.cities.length;
				this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
			},
			search(val) {
				if (this.content == '') {
					this.openkey = false
				} else {
					this.openkey = true
					const headers = {
						uid: this.userid,
						code: this.code
					};
					const params = {
						search: this.content
					}
					BiddingSearch(headers, params).then((res) => {
						this.options = res.data
						if (res.code == '10000' && res.data.length == 0) {
							this.$message.closeAll();
							this.$message.warning("您输入的关键词暂无数据,请重新输入!");
						} else if (res.code == '10000' && res.data.length) {
							this.options = res.data
						} else if (res.code == '10001') {
							this.$message.error("db error")
						} else {
							console.log("其他错误")
						}
					}).catch((err) => {
						console.log(err);
					})
				}
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

			//文件列表移除时的钩子
			remfile(file, fileList) {
				this.fileList.pop('file')
			},
			//li点击赋值的时候 并收回弹框
			setitem(i, Inum) {
				this.openkey = false
				this.content = i.pro_name
				this.jbid = i.pro_num
				this.options = []
				const headers = {
					uid: this.userid,
					code: this.code
				};
				const params = {
					bidding_id: this.jbid
				};
				BidIdQueryActivity(headers, params).then((res) => {
					cityOptions = res.data;
					this.cities = res.data;
				}).catch((err) => {
					console.log(err);
				})
			},
			tianjia(tag) {
				this.peoplelist.push(tag)
				this.itemid.push(tag.id)
				// 添加后删除以免二次选中
				this.handleClose(tag)
			},
			Nametianjia(tag) {
				this.personnelList.push(tag)
				this.NameListhandleClose(tag)
			},
			// 文件状态改变时的钩子
			fileChange(file, fileList) {
				this.fileList.push(file.raw);
				this.progressPercent = 0
			},
			// 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
			beforeUploadFile(file) {
				let extension = file.name.substring(file.name.lastIndexOf(".") + 1);
				let size = file.size / 1024 / 1024 < 50;
				if (extension !== "xlsx") {
					this.$message.warning("只能上传后缀是.xlsx的文件");
				}
				if (!size) {
					this.$message.warning("文件大小不得超过50M");
					return size
				}
			},

			// 文件上传成功时的钩子
			handleSuccess(res, file, fileList) {
				this.$message.success("文件上传成功");
				this.fileList = []
				this.peoplelist = []
				this.itemid = []
				this.dialogVisible = false;
			},
			// 文件上传失败时的钩子
			handleError(err, file, fileList) {
				this.$message.error("文件上传失败");
			},
			UploadUrl: function() {
				// 因为action参数是必填项，使用二次确认进行文件上传时，直接填上传文件的url会因为没有参数导致api报404，所以这里将action设置为一个返回为空的方法就行，避免抛错
				return "";
			},
			//立即上传
			uploadFile(data) {
				//上传时需要的人员id
				this.itemid = '';
				this.itemname = '';
				for (let k = 0; k < this.peoplelist.length; k++) {
					this.itemid += this.peoplelist[k].userid + ',';
					this.itemname += this.peoplelist[k].name + ',';
				}
				this.itemid = this.itemid.slice(0, this.itemid.length - 1)
				this.itemname = this.itemname.slice(0, this.itemname.length - 1)
				if (this.content == '') {
					this.$message.warning("请输入标名或者项目编号")
				} else if (this.fileList.length === 0) {
					this.$message.warning("请选择要上传的excel文件");
				} else {
					for (let i = 0; i < this.fileList.length; i++) {
						let data = new FormData();
						let arrAll = [];
						let arrName = '';
						let arrId = '';
						data.append("file", this.fileList[i]);
						data.append("user_list", this.itemid);
						data.append("user_name_list", this.itemname)
						data.append("trans_name", this.username)
						console.log(this.peoplelist)
						data.append("bidding_id", this.jbid);
						data.append("bidding_name", this.content);
						console.log(this.checkedCities)
						if (this.checkAll === true) {
							this.checkedCities = [];
						}
						if (this.checkedCities.length === 0) {
							console.log("123")
							data.append("activity_name", '')
							data.append("activity_id", '')
						} else {
							for (let k = 0; k < this.checkedCities.length; k++) {
								arrName += this.checkedCities[k].activityName+',';
								arrId += this.checkedCities[k].id+',';
							}
							arrName = arrName.slice(0, arrName.length - 1)
							arrId = arrId.slice(0, arrId.length - 1)
							data.append("activity_name", arrName)
							data.append("activity_id", arrId)
						}

						const headers = {
							uid: this.userid,
							code: this.code
						};
						immediatelyUpload(
							headers,
							data
						).then((res) => {
							console.log(res);
							if (res.code == 10000) {
								this.progressPercent = 100;
								this.handleSuccess();
								this.getlist()
								this.msg = res.data.msg;
							} else {
								// this.handleError();
								this.$message.warning(res.data)
							}
						}).catch((err) => {
							console.log(err);
						})
					}
				}
			},

			//多选栏中的删除
			handleClose(tag) {
				let item = this.restaurants.indexOf(tag);
				this.restaurants.splice(item, 1);

			},
			NameListhandleClose(tag) {
				let item = this.restaurants.indexOf(tag);
				this.restaurants.splice(item, 1);
			},
			// 查找名字
			chaz() {
				if (this.cSubcategoryNo == '') {
					this.restaurants = []
				} else {
					const headers = {
						uid: this.userid,
						code: this.code
					};
					const params = {
						search: this.cSubcategoryNo
					}
					getName(headers, params).then((res) => {
						console.log(res);
						this.restaurants = res.data;
					}).catch((err) => {
						console.log(err);
					})
				}

			},
			// 双击删除列表
			deleteitem(index) {
				this.peoplelist.splice(index, 1)
			},
			NameListdeleteitem(index) {
				this.personnelList.splice(index, 1)
				console.log(this.personnelList)
			},
			// 查看列表
			getlist() {
				const headers = {
					uid: this.userid,
					code: this.code
				};
				const params = {
					trans_name: this.username,
					limit:this.pagesize,
					page:this.currpage
				};
				BidList(headers, params).then((res) => {
					console.log(res);
					if (res.code == 10000) {
						this.tableData = res.data;
						this.total = res.count;
					} else if (res.code == 10001) {
						this.$message.warning('参数丢失')
					} else if (res.code == 10002) {
						console.log('db error')
					} else {
						console.log('未知情况')
					}
				}).catch((err) => {
					console.log(err);
				})
			},
			// 查看详情
			celltable(row) {
				this.tablerow = row
				console.log(row);
				const headers = {
					uid: this.userid,
					code: this.code
				};
				const params = {
					bidding_id: this.tablerow.bidding_id,
					activity_id:this.tablerow.activity_id
				};
				viewDetails(headers, params).then((res) => {
					if (res.code == 10000) {
						this.xqlist = res.data
					} else if (res.code == 10000) {
						console.log('参数丢失')
					} else if (res.code == 10002) {
						console.log('db erroe')
					} else {
						console.log('未知情况')
					}
				}).catch((err) => {
					console.log(err);
				})
				if (this.centerDialogVisible === true) {
					this.modification();
				}
			},
			changethreshold(scopeRow) {
				this.changelist.push({
					'id': scopeRow.id,
					'threshold': scopeRow.threshold
				})
			},
			//关闭弹出框清空追加
			clear() {
				this.changelist = []
			},
			guanbi() {
				this.lookxq = false
			},
			//上传修改后的预算数据
			sendlist() {
				let data = {
					id_thresholds: JSON.stringify(this.changelist)
				}
				data = this.qs.stringify(data);
				const headers = {
					uid: this.userid,
					code: this.code
				};
				detailsToModify(headers, data).then((res) => {
					console.log(res);
					if (res.code == 10000) {
						this.$message.success('更新成功')
						this.lookxq = false
						this.changelist = []
						this.getlist()
					} else if (res.code == 10001) {
						this.$message.warning('参数丢失')
					} else {
						console.log('未知错误')
					}
				}).catch((err) => {
					console.log(err);
				})
			},
			//清空搜索词
			clearlist() {
				this.content = ''
				this.cSubcategoryNo = ''
				this.restaurants = []
				this.progressPercent= 0
				this.cities = []
				this.isIndeterminate = false
			}

		},
		created() {
			// check方法调用接口,判断用户是否登录!
			this.check();
		},
		mounted() {
			//设置请求头
			this.userid = localStorage.getItem("wx_userid");
			this.code = localStorage.getItem("wx_code");
			this.username = localStorage.getItem('user_name')
			this.peoplelist = [{
				name: this.username,
				userid: this.userid
			}]
			//调用查看列表
			this.getlist()
		},
	};
</script>

<style lang="less" scoped>
	/deep/input {
		border-radius: 0 !important;
	}

	.w320 {
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
	.btnSizeBig{
		padding: 5px 5px;
		height: 38px;
		border: 1px solid #0051B3;
		color: #2066BD;
		text-align:  center;
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
	.biddingForMonitoring {
		width: 1200px;
		margin: 0 auto;
		.content {
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
			display: flex;
			flex-direction: row-reverse;
			.form {
				min-height: 1250px;
				padding-top: 50px;
				width: 975px;
				background-color: #fff;
				.fuzzyQuery{
				  position: relative;
				  ul::-webkit-scrollbar{
				      display:none;
					}
				  ul{
				    width: 452px;
				    height: 200px;
				    padding: 0 18px;
				    position: absolute;
				    left: 0;
				    z-index: 1;
				    background: #fdfdfd;
				    overflow-y: scroll;
					li{
					  list-style: none;
					  border-bottom: 1px solid #eaeaea;
					  line-height: 40px;
					  cursor: pointer;
					}
					li:hover{
					  color: #409EFF;
					}
					
				  }
				}	
				.tables {
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
					.dialog {
						.tips {
							width: 80%;
							height: 50px;
							margin: 0 auto;
							text-align: center;
							font-size: 18px;
							line-height: 50px;
						}

						.tipsItem {
							width: 80%;
							height: 50px;
							margin: 0 auto;
							text-align: center;
							font-size: 12px;
							color: red;
							line-height: 50px;
						}

						.button {
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
