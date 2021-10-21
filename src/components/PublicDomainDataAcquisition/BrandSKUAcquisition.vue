<template>
	<!-- 自定义分析创建 -->
	<div class="brandSKUAcquisition">
		<div class="content">
			<div class="form">
				<el-form ref="form" :model="form" label-width="80px" class="formObj">
					<el-form-item label="选择平台:">
						<el-select v-model="value" placeholder="请选择" size="mini" class="w320">
						    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="关键词:">
						<el-input placeholder="请输入关键词或店铺名称" v-model="keyword" size="mini" class="w320"></el-input>
					</el-form-item>
					<el-form-item label="选择页码:">
						第&ensp;<el-input-number v-model="num"  :min="1" size="mini" :controls="false" label="描述文字" style="width: 50px;"></el-input-number>&emsp;页&emsp;—————&emsp;第&emsp;<el-input-number v-model="num"  :min="1" size="mini" :controls="false" label="描述文字" style="width: 50px;"></el-input-number>&emsp;页
					</el-form-item>
					<el-form-item label="接收邮箱">
						<el-input placeholder="请输入邮箱地址" v-model="mail" size="mini" class="w320"></el-input>
					</el-form-item>
					<el-form-item>
						<div @click="going" class="btnSizeSmall" v-loading.fullscreen.lock="fullscreenLoading">执行</div>
						<p style="color: red; font-size: 12px;">*如果半小时未收到邮件请联系产品部*</p>
					</el-form-item>
				</el-form>
				<el-divider></el-divider>
			</div>
		</div>
	</div>
</template>

<script>
import { fxcjtools } from '../../api/api.js'
export default {
  data() {
    return {
		form:{},
		num:1,
      //下拉框value
       options: [{
          value: '选项1',
          label: '京东'
        }, {
          value: '选项2',
          label: '淘宝'
        }, {
          value: '选项3',
          label: '多点'
        }, {
          value: '选项4',
          label: '百度'
        }, {
          value: '选项5',
          label: '微博'
        }],
        value: '',
		keyword: '',

      
      mail:'',//邮箱地址
      userid: "",
      code: "",

      username: "", //用户名

      rizhi: "", //日志内容

      msg: "", //根据上传判断执行条件
      dialogVisible: false,
      
      fullscreenLoading:false,//loading框显示隐藏
      
    };
  },
  methods: {
    
    
    //执行
    going() {
      //调用大数据工具请求
        this.fullscreenLoading = true
		const headers = { uid: this.userid, code: this.code };
		let data = {
			username:this.username,
			password:'123456',
			trans_name:'lxd',
			tool_type:'8'
		}
		data = this.qs.stringify(data);
		fxcjtools(headers, data).then((res)=>{
			console.log(res);
			this.fullscreenLoading = false
			if(res.code=="10000"){
				this.$message.success("执行成功")
			}else if(res.code=="10001"){
				this.$message.warning("未上传cookie或tool type或trans_name")
			}else if(res.code=="10003"){
				this.$message.error("内部错误")
			}else if(res.code=="10004"){
				this.$message.warning("请求受限")
			}else if(res.code=="10005"){
				this.$message.warning("请检查用户密码是否正确")
			}else{
				this.$message.error("执行失败")
			}
		}).catch((err)=>{
			console.log(err);
		})          
    },
    
    
  },
  created() {
	// check方法调用接口,判断用户是否登录!
	this.check();
  },

  mounted() {
    this.userid = localStorage.getItem("wx_userid");
    this.code = localStorage.getItem("wx_code");
    this.username = localStorage.getItem("user_name");
    this.people = localStorage.getItem("user_name");
    
  },
};
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
	.brandSKUAcquisition{
		width: 1200px;
		margin: 0 auto;
		.content{
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
			display: flex;
			flex-direction: row-reverse;
			padding-top: 90px;
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
					width: 620px;
					margin: 0 auto;
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
