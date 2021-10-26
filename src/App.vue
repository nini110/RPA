<template>
  <div id="app">
   <div class="topTtle">
	   <div class="cenContent">
		   <div class="logo" @click="$router.push('/')">
			   <img src="./assets/logo.png" alt="">
		   </div>
		   <div class="login">
			   <div class="img">
				   <!-- <img src="./assets/490a6bbbefa2a0250c52817f01cfd52.png" alt=""> -->
			   </div>
			   <el-badge class="item notice">
			   	<el-popover
			   	    placement="bottom-start"
			   	    title=""
			   	    width="200"
			   	    trigger="hover"
			   		popper-class="poperNotice"
			   	    content="">
			   	    <el-button slot="reference" size="mini" style="margin-right: 10px; height: 25px; border-radius: 0; background-color: #000000; color: #004FB1; border-color: #004FB1;letter-spacing:2px">公告</el-button>
			   		<div class="down">小工具下载地址<a href="http://tool.afocus.com.cn/tool_download/" target="_blank">点击下载</a></div>
			   		<div class="down">小工具驱动下载地址 <a href="https://npm.taobao.org/mirrors/chromedriver/" target="_blank">点击下载</a></div>
			   		<div class="down">自有客户通用日报模板 <a href="http://tool.afocus.com.cn/file_download/自有客户通用日报模板.xlsx" download="自有客户通用日报模板.xlsx">点击下载</a></div>
			   	  </el-popover>
			   </el-badge>
				<div class="user">
					当前用户: {{yh}} <span class="logout" @click="close">退出</span>
				</div>
				<div class="phone">
					<div class="phoneIcon"></div>
					<div class="text" style="color: #9e9898;">移动版</div>
				</div>
		   </div>
	   </div>
   </div>
    <router-view/>
  </div>
</template>
<script>
	export default{
		name:"App",
		data(){
			return{
				yh:''
			}
		},
		created() {
		// 线上发布时created中所有都注释
			this.$route.query.wx_code = "IpxLWOEm5iaFvNuaOIqTN4FoI2I7rWjbXqMca4cUVTg";
			this.$route.query.wx_userid = "1020108";
			this.$route.query.user_name = '方涛';
			localStorage.setItem('wx_code',this.$route.query.wx_code)
			localStorage.setItem('wx_userid',this.$route.query.wx_userid)
			localStorage.setItem('user_name',this.$route.query.user_name)
		},
		methods:{
			close() {
			  let userid = localStorage.getItem("wx_userid");
			  let code = localStorage.getItem("wx_code");
			  let username = localStorage.getItem("user_name")
			  this.$axios({
			    // 后端服务器端口路径
			    // url: "http://tool.afocus.com.cn:5005/platform/logout",
				url: "http://tool.afocus.com.cn:5005/platform/logout",
			    // 相当于ajax的type
			    method: "get",
			    params: { wx_userid: userid, wx_code: code },
			  })
			    .then((response) => {
			      if (response.data.code == 1) {
			        alert(response.data.msg);
			      } else {
			        //点击退出的时候清空 cookie 和session
			        localStorage.clear();
			        //开发的时候需要注释了 不然会跳转页面 测试的时候开启
			        location.href = this.DomainName + "/platform/login";
							// location.href = "http://tool.afocus.com.cn:5005/platform/login";
			     }
			      // this.cars = response.data;
			    })
			    .catch((error) => {
			      // 网络状态码为4xx、5xx
			      console.log(error); // 可以打印具体的报错信息
			    });
			},
		},
		mounted(){
			
		  //如果本地存储为空，跳回登入页 单方面前端开发时 注销此项
		  if (localStorage.getItem("wx_userid") && localStorage.getItem("wx_code")&&localStorage.getItem("user_name")) {
		    this.yh=localStorage.getItem("user_name")
		    this.$message({
		      message: "登入成功",
		      type: "success",
		    });
		    this.$axios({
		      url:'http://tool.afocus.com.cn:5005/platform/authentication',
				// url:'http://tool.afocus.com.cn:5005/platform/authentication',
		      method:'get',
		      params:{user_id:localStorage.getItem("wx_userid"),user_code:localStorage.getItem("wx_code")}
		    }).then((data)=>{
		      if(data.data.status==true){
		      }else if(data.data.status==false){
		        location.href = this.DomainName + "/platform/login";
				// location.href = "http://tool.afocus.com.cn:5005/platform/login";
		      }else{
		        this.$message({
		          message:'信息丢失试试重新登入',
		          type:"warring"
		        })
		      }
		    },(err)=>{
		      console.log(err)
		    })
		  } else {
		    this.$message.error("请进行扫码登入");
		    this.yh='未登入'
		    location.href = this.DomainName + "/platform/login";
			// location.href = "http://tool.afocus.com.cn:5005/platform/login";
		  }
		},
	}
</script>
<style lang="less">
	*{
		margin: 0;
		padding: 0;
		list-style: none;
	}
	a{
		text-decoration: none;
		color: #2066BD;
	}
	#app{
		width: 100%;
		height: 100%;
		background-color: #F4F4F4;
		position: relative;
	}
	.topTtle{
		width: 100%;
		height: 80px;
		background-color: #000;
		display: flex;
		justify-content:center;
		position: fixed;
		z-index: 99;
	}
	.cenContent{
		width: 1200px;
		height: 80px;
		/* background-color: #42B983; */
		display: flex;
		justify-content: space-between;
	}
	.logo img{
		margin-top: 20px;
	}
	.login{
		color: #fff;
		height: 80px;
		font-size: 18px;
		line-height: 80px;
		display: flex;
		align-items: center;
	}
	.login .img{
		display: inline-block;
		vertical-align: bottom;
		width: 120px;
		height: 25px;
		border-right: 3px solid #515151;
		background: url(assets/490a6bbbefa2a0250c52817f01cfd52.png);
		background-size: cover;
		/* margin-top: 28px; */
		margin-right: 20px;
	}
	.login .img img{
		width: 150px;
	}
	.login .user{
		width: 220px;
		font-size: 16px;
		span {
			padding-left: 30px;
		}
		/* margin-top: 25px; */
	}
	.login .phone{
		width: 100px;
		height: 35px;
		background-color: #303030;
		border-radius: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.login .phone .phoneIcon{
		width: 12px;
		height: 20px;
		background: url(assets/images/phone.png);
		background-size: 100%;
	}
	.login .phone .text{
		font-size: 12px;
		line-height: 20px;
		margin: 0 5px;
	}
</style>
