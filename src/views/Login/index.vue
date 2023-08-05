<template>
  <div class="mainlogin">
    <div class="mainlogin_bg"></div>
    <ul class="mainlogin_circles">
      <li v-for="n in 10" :key="n"></li>
    </ul>
    <div class="mainlogin_time">
      {{ time }}
    </div>
    <div class="login">
      <div class="loginimg"></div>
      <!-- <img class="loginimg" src="../../assets/logo2Blue.png" alt="" /> -->
      <div class="loginbox">
        <div class="loginbox_header">扫码登陆</div>
        <div id="weChat"></div>
        <div class="el-icon-full-screen loginbox_tips">
          打开<span style="color: #f56c6c">企业微信</span>扫码登陆
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import dayjs from "dayjs";
export default {
  data () {
    return {
      time: dayjs().format("HH:mm:ss"),
      timeInterval: null,
    };
  },
  beforeCreate () { },
  created () {
    const vm = this;
    let wx_code = localStorage.getItem("wx_code");
    let wx_userid = localStorage.getItem("wx_userid");
    let toinfo = sessionStorage.getItem("toInfo");
    if (!wx_code && !wx_userid) {
      if (vm.$route.query.wx_userid) {
        vm.$router.push({
          path: toinfo ? toinfo.slice(1) : "layout/beijingMustPass/DMP",
        });
      } else {
        vm.getWeChat();
      }
    }
    if (wx_code && wx_userid) {
      vm.check().then((res) => {
        if (res) {
          vm.$router.push({
            path: toinfo ? toinfo.slice(1) : "layout/beijingMustPass/DMP",
          });
        } else {
          localStorage.removeItem("adTag");
          localStorage.removeItem("wx_code");
          localStorage.removeItem("wx_userid");
          localStorage.removeItem("user_name");
          localStorage.removeItem("thumb_avatar");
          vm.getWeChat();
        }
      });
    }
  },
  beforeDestroy () {
    clearInterval(this.timeInterval);
  },
  mounted () {
    const vm = this;
    vm.timeInterval = setInterval(() => {
      vm.time = dayjs().format("HH:mm:ss");
    }, 1000);
  },
  methods: {
    getWeChat () {
      // 动态引入企业微信js文件
      const vm = this;
      const s = document.createElement("script");
      s.type = "text/javascript";
      s.src =
        "http://wwcdn.weixin.qq.com/node/wework/wwopen/js/wwLogin-1.2.5.js";
      const wxElement = document.body.appendChild(s);
      // 调用企业微信二维码方法
      wxElement.onload = function () {
        let a = new WwLogin({
          id: "weChat",
          appid: "wwa11b1586b6b9c8a8",
          agentid: "1000041",
          scope: "snsapi_login",
          redirect_uri: encodeURIComponent(
            `${vm.DomainName}/platform/authority`
          ),
          state: Math.ceil(Math.random() * 1000),
          style: "black",
          href: "data:text/css;base64,I3dlQ2hhdCB7DQogICAgd2lkdGg6IDEwMCU7DQogICAgaGVpZ2h0OiAzMDBweDsNCn0NCg0KLmltcG93ZXJCb3ggew0KICAgIGhlaWdodDogMTAwJTsNCn0NCmh0bWwgew0KICAgIGhlaWdodDogMTAwJTsNCiAgICB1c2VyLXNlbGVjdDogbm9uZTsNCn0NCmJvZHkgew0KICAgIGhlaWdodDogMTAwJTsNCn0NCi5jYXJkIHsNCiAgICB3aWR0aDogNTAlOw0KICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTsNCiAgICB0b3A6IDUwJTsNCiAgICBsZWZ0OiA1MCU7DQogICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7DQp9DQoud3JwX2NvZGUgew0KICAgIHdpZHRoOiAxMDAlOw0KICAgIG1hcmdpbi10b3A6IDAhaW1wb3J0YW50Ow0KfQ0KLmZyYW1lX3dyYXAgew0KICAgIGhlaWdodDogMTAwJTsNCn0NCi5pbXBvd2VyQm94IC5xcmNvZGUge3dpZHRoOiAxMDAlO2hlaWdodDogYXV0bzt9DQouaW1wb3dlckJveCAudGl0bGUge2Rpc3BsYXk6IG5vbmU7fQ0KLmltcG93ZXJCb3ggLmluZm8ge2Rpc3BsYXk6IG5vbmU7fQ0KLnN0YXR1c19pY29uIHtkaXNwbGF5OiBub25lICAhaW1wb3J0YW50fQ0KLmltcG93ZXJCb3ggLnN0YXR1cyB7dGV4dC1hbGlnbjogY2VudGVyO30NCg0KI2pzX3NpbmdsZV9wYWdlX2NvbnRhaW5lciB7DQogICAgaGVpZ2h0OiAxMDAlOw0KfQ==",
        });
        let target = document.getElementsByTagName("iframe");
        target[0].style.width = "100%";
        target[0].style.height = "100%";
      };
    },
  },
};
</script>
<style scoped lang="less">
@import "index";

// 背景
.mainlogin_circles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0px;
  padding: 0px;

  li {
    position: absolute;
    display: block;
    list-style: none;
    width: 20px;
    height: 20px;
    background: #fff;
    animation: animate 25s linear infinite;
    bottom: -200px;

    @keyframes animate {
      0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
        border-radius: 0;
      }

      100% {
        transform: translateY(-1000px) rotate(720deg);
        opacity: 0;
        border-radius: 50%;
      }
    }

    &:nth-child(1) {
      left: 15%;
      width: 80px;
      height: 80px;
      animation-delay: 0s;
    }

    &:nth-child(2) {
      left: 5%;
      width: 20px;
      height: 20px;
      animation-delay: 2s;
      animation-duration: 12s;
    }

    &:nth-child(3) {
      left: 70%;
      width: 20px;
      height: 20px;
      animation-delay: 4s;
    }

    &:nth-child(4) {
      left: 40%;
      width: 60px;
      height: 60px;
      animation-delay: 0s;
      animation-duration: 18s;
    }

    &:nth-child(5) {
      left: 65%;
      width: 20px;
      height: 20px;
      animation-delay: 0s;
    }

    &:nth-child(6) {
      left: 75%;
      width: 150px;
      height: 150px;
      animation-delay: 3s;
    }

    &:nth-child(7) {
      left: 35%;
      width: 200px;
      height: 200px;
      animation-delay: 7s;
    }

    &:nth-child(8) {
      left: 50%;
      width: 25px;
      height: 25px;
      animation-delay: 15s;
      animation-duration: 45s;
    }

    &:nth-child(9) {
      left: 20%;
      width: 15px;
      height: 15px;
      animation-delay: 2s;
      animation-duration: 35s;
    }

    &:nth-child(10) {
      left: 85%;
      width: 150px;
      height: 150px;
      animation-delay: 0s;
      animation-duration: 11s;
    }
  }
}</style>
