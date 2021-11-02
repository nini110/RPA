<template>
  <div id="app">
    <div class="topTtle">
      <!-- <div class="cenContent"> -->
      <div class="topTtle_logo" @click="$router.push('/')">
        <img src="./assets/logo.png" alt="" />
      </div>
      <div class="topTtle_login">
        <div class="topTtle_login_tip">
          <!-- <img class="img" src="./assets/logo2Blue.png" alt=""> -->
          <img class="img" src="./assets/logo2.png" alt="">
          <el-popover
            placement="bottom-start"
            title=""
            width="200"
            trigger="hover"
            popper-class="poperNotice"
            content=""
          >
            <el-button
              slot="reference"
              size="mini"
			  class="poperBtn iconfont icon-yangshengqi"
              >公告</el-button
            >
            <div class="down">
              小工具下载地址<a
                href="http://tool.afocus.com.cn/tool_download/"
                target="_blank"
                >点击下载</a
              >
            </div>
            <div class="down">
              小工具驱动下载地址
              <a
                href="https://npm.taobao.org/mirrors/chromedriver/"
                target="_blank"
                >点击下载</a
              >
            </div>
            <div class="down">
              自有客户通用日报模板
              <a
                href="http://tool.afocus.com.cn/file_download/自有客户通用日报模板.xlsx"
                download="自有客户通用日报模板.xlsx"
                >点击下载</a
              >
            </div>
          </el-popover>
        </div>

        <div class="topTtle_login_user">
          <div class="el-icon-user-solid user">
            {{ yh }} <span class="logout iconfont icon-tcdl" @click="close"></span>
          </div>
          <div class="phone iconfont icon-shouji">移动版</div>
        </div>
      </div>
      <!-- </div> -->
    </div>
    <router-view />
  </div>
</template>
<script>
export default {
  name: "App",
  data() {
    return {
      yh: "",
    };
  },
  created() {
    // 线上发布时created中所有都注释
    // this.$route.query.wx_code = "SsAjfOICnv7AbLPzRTKCTzzH0w1-VTbOJ0lZX1S7pKg";
    // this.$route.query.wx_userid = "1020108";
    // this.$route.query.user_name = "方涛";
    // localStorage.setItem("wx_code", this.$route.query.wx_code);
    // localStorage.setItem("wx_userid", this.$route.query.wx_userid);
    // localStorage.setItem("user_name", this.$route.query.user_name);
  },
  methods: {
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
          if (data.data.status == true) {
          } else if (data.data.status == false) {
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
};
</script>
<style lang="less">
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
a {
  text-decoration: none;
  color: #2066bd;
}
#app {
  width: 100%;
  height: 100%;
  background-color: #f4f4f4;
  position: relative;
}
.topTtle {
  width: 100%;
  height: 80px;
  display: flex;
  background-color: #000;
  position: fixed;
  z-index: 99;
  &_logo {
    width: 200px;
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
  	background-color: #000;
	  cursor: pointer;
    img {
		height: 30px;
		object-fit: cover;
    }
  }
  &_login {
	width: calc(100% - 200px);
    display: flex;
    flex-direction: row-reverse;
	position: relative;
	// background-color: #fff;
    &_tip {
		position: absolute;
		left: 113px;
		top: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		&:before {
			content: '';
			width: 1px;
			height: 20px;
			background-color: #666;
			margin-right: 25px;
		}
		.img {
			height: 22px;
			object-fit: cover;
			margin-right: 20px;
		}
		.poperBtn {
			border: none;
			// border-color: #2066bd;
			background-color: transparent;
			outline: 0;
			color: #666;
			&:hover {
				color: #2066bd;
				background-color: transparent;
			}
			&:before {
				padding-right: 10px;
			}

		}
    }
    &_user {
      color: #fff;
      width: 300px;
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
	  padding-right: 50px;

      .user {
        flex-grow: 1;
        width: 220px;
		text-align: center;
      }
      .logout {
        padding-left: 20px;
  		cursor: pointer;
      }
      .phone {
		white-space: nowrap;
        color: #999;
        padding: 5px 20px;
        background-color: #303030;
        border-radius: 30px;
        text-align: center;
      }
    }
  }
}
</style>
