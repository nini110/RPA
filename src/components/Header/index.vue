<template>
  <div class="topTtle">
    <div class="topTtle_logo">
      <img src="../../assets/logo.png" alt="" />
    </div>
    <div class="topTtle_login">
      <div class="topTtle_login_tip">
        <!-- <img class="img" src="./assets/logo2Blue.png" alt=""> -->
        <img class="img" src="../../assets/logo2.png" alt="" />
        <el-popover
          placement="bottom-start"
          title=""
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

      <div v-if="$route.name !== 'login'" class="topTtle_login_user">
        <div class="user">
          <!-- {{ yh }} -->

          <el-popover
            content=""
            trigger="hover"
            placement="bottom"
            popper-class="poperNotice"
          >
            <div slot="reference">
              <img class="user_img" :src="user.img" alt="" />
              <span class="user_name">{{ user.name }}</span>
            </div>
            <div style="text-align: center">{{ user.id }}</div>
          </el-popover>
          <span class="logout iconfont icon-tcdl" @click="close"></span>
        </div>
        <!-- <div id ="togleCol" class="phone iconfont icon-shouji" @click="toggleMode()">移动版</div> -->
      </div>
    </div>
  </div>
</template>
<script>
import message from "@/mixin/message";
export default {
  name: "Header",
  mixins: [message],
  data() {
    return {
      user: {
        name: "",
        img: "",
      },
      options: {
        bottom: "unset", // default: '32px'
        right: "220px", // default: '32px'
        left: "unset", // default: 'unset'
        time: "0.5s", // default: '0.3s'
        mixColor: "#fff", // default: '#fff'
        backgroundColor: "#fff", // default: '#fff'
        buttonColorDark: "#100f2c", // default: '#100f2c'
        buttonColorLight: "#fff", // default: '#fff'
        saveInCookies: false, // default: true,
        label: "🌓", // default: ''
        // label: '切换主题', // default: ''
        autoMatchOsTheme: true, // default: true
      },
    };
  },
  created() {},
  mounted() {
    //如果本地存储为空，跳回登入页 单方面前端开发时 注销此项
    if (
      localStorage.getItem("wx_userid") &&
      localStorage.getItem("wx_code") &&
      localStorage.getItem("user_name")
    ) {
      this.user = {
        name: localStorage.getItem("user_name"),
        id: "工号： " + localStorage.getItem("wx_userid"),
        img: localStorage.getItem("thumb_avatar"),
      };
      this.user.name = localStorage.getItem("user_name");
      this.$axios({
        url: `${this.DomainName}/platform/authentication`,
        method: "get",
        params: {
          user_id: localStorage.getItem("wx_userid"),
          user_code: localStorage.getItem("wx_code"),
        },
      }).then((data) => {
        if (data.data.status == true) {
        } else if (data.data.status == false) {
          this.$router.push({
            path: "/login",
          });
        } else {
          this.$msg({ type: "warning", msg: "信息丢失试试重新登入" });
        }
      });
    } else {
      this.$msg({ type: "warning", msg: "请进行扫码登入" });
      this.user.name = "未登入";
      this.$router.push({
        path: "/login",
      });
    }
  },
  methods: {
    toggleMode() {},
    // 退出登录
    close() {
      const vm = this;
      let userid = localStorage.getItem("wx_userid");
      let code = localStorage.getItem("wx_code");
      let username = localStorage.getItem("user_name");
      vm.openMessageBox({
        type: "warning",
        showClose: true,
        tipTitle: `是否 [ 确定 ] 退出当前帐号？`,
        showCancelButton: true,
        confirmButtonFn: () => {
          vm.$axios({
            // 后端服务器端口路径
            url: `${this.DomainName}/platform/logout`,
            method: "get",
            params: {
              wx_userid: userid,
              wx_code: code,
            },
          }).then((response) => {
            if (response.data.code == 1) {
              vm.$msg({ type: "error", msg: "退出失败" });
            } else {
              localStorage.clear();
              // location.href = `${this.DomainName}/platform/login`;
              // location.href = `${this.DomainName}/#/login`;
              this.$router.push({
                path: "/login",
              });
            }
          });
        },
      });
    },
  },
};
</script>
<style lang="less">
@import "./index";
</style>
