<template>
	<div class="topTtle">
		<div class="topTtle_logo" @click="$router.push('/')">
			<img src="../../assets/logo.png" alt="" />
		</div>
		<div class="topTtle_login">
			<div class="topTtle_login_tip">
				<!-- <img class="img" src="./assets/logo2Blue.png" alt=""> -->
				<img class="img" src="../../assets/logo2.png" alt="" />
				<el-popover placement="bottom-start" title="" trigger="hover" popper-class="poperNotice" content="">
					<el-button slot="reference" size="mini" class="poperBtn iconfont icon-yangshengqi">公告</el-button>
					<div class="down">
						小工具下载地址<a href="http://tool.afocus.com.cn/tool_download/" target="_blank">点击下载</a>
					</div>
					<div class="down">
						小工具驱动下载地址
						<a href="https://npm.taobao.org/mirrors/chromedriver/" target="_blank">点击下载</a>
					</div>
					<div class="down">
						自有客户通用日报模板
						<a href="http://tool.afocus.com.cn/file_download/自有客户通用日报模板.xlsx"
							download="自有客户通用日报模板.xlsx">点击下载</a>
					</div>
				</el-popover>
			</div>

			<div class="topTtle_login_user">
				<div class="el-icon-user-solid user">
					{{ yh }}
					<span class="logout iconfont icon-tcdl" @click="close"></span>
				</div>
				<div id ="togleCol" class="phone iconfont icon-shouji" @click="toggleMode()">移动版</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		name: "Header",
		data() {
			return {
				yh: "",
				options: {
				  bottom: 'unset', // default: '32px'
				  right: '220px', // default: '32px'
				  left: 'unset', // default: 'unset'
				  time: '0.5s', // default: '0.3s'
				  mixColor: '#fff', // default: '#fff'
				  backgroundColor: '#fff',  // default: '#fff'
				  buttonColorDark: '#100f2c',  // default: '#100f2c'
				  buttonColorLight: '#fff', // default: '#fff'
				  saveInCookies: false, // default: true,
				  label: '🌓', // default: ''
				  // label: '切换主题', // default: ''
				  autoMatchOsTheme: true // default: true
				}
			};
		},
		created() {

		},
		mounted() {
			//如果本地存储为空，跳回登入页 单方面前端开发时 注销此项
			if (
				localStorage.getItem("wx_userid") &&
				localStorage.getItem("wx_code") &&
				localStorage.getItem("user_name")
			) {
				this.yh = localStorage.getItem("user_name");
				this.$message({
					message: "登入成功",
					type: "success",
				});
				this.$axios({
					url: "http://tool.afocus.com.cn:5005/platform/authentication",
					// url:'http://tool.afocus.com.cn:5005/platform/authentication',
					method: "get",
					params: {
						user_id: localStorage.getItem("wx_userid"),
						user_code: localStorage.getItem("wx_code"),
					},
				}).then(
					(data) => {
						if (data.data.status == true) {} else if (data.data.status == false) {
							location.href = this.DomainName + "/platform/login";
							// location.href = "http://tool.afocus.com.cn:5005/platform/login";
						} else {
							this.$message({
								message: "信息丢失试试重新登入",
								type: "warring",
							});
						}
					},
					(err) => {
						console.log(err);
					}
				);
			} else {
				this.$message.error("请进行扫码登入");
				this.yh = "未登入";
				location.href = this.DomainName + "/platform/login";
				// location.href = "http://tool.afocus.com.cn:5005/platform/login";
			}
		},
		methods: {
			toggleMode() {
				// const darkmode = new Darkmode(this.options);
				// darkmode.toggle();
			},
			close() {
				let userid = localStorage.getItem("wx_userid");
				let code = localStorage.getItem("wx_code");
				let username = localStorage.getItem("user_name");
				this.$axios({
						// 后端服务器端口路径
						// url: "http://tool.afocus.com.cn:5005/platform/logout",
						url: "http://tool.afocus.com.cn:5005/platform/logout",
						// 相当于ajax的type
						method: "get",
						params: {
							wx_userid: userid,
							wx_code: code
						},
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
	};
</script>
<style lang="less">
	@import './index';
</style>
