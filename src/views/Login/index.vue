<template>
  <div class="mainlogin">
    <div class="loginbox">
      <div class="loginbox_header">扫码登陆</div>
      <div id="weChat"></div>
      <div class="el-icon-full-screen loginbox_tips">
        打开<span style="color: #f56c6c">企业微信</span>扫码登陆
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // wx_code: "",
      // wx_userid: "",
    };
  },
  beforeCreate() {},
  created() {
    let wx_code = localStorage.getItem("wx_code");
    let wx_userid = localStorage.getItem("wx_userid");

    if (!wx_code && !wx_userid && !this.$route.query.wx_userid) {
      this.getWeChat();
    }
    if (!wx_code && !wx_userid && this.$route.query.wx_userid) {
      localStorage.setItem("wx_code", this.$route.query.wx_code);
      localStorage.setItem("wx_userid", this.$route.query.wx_userid);
      localStorage.setItem("user_name", this.$route.query.user_name);
      localStorage.setItem("thumb_avatar", this.$route.query.thumb_avatar);
      this.$router.push({ path: "layout/beijingMustPass/DMP" });
      console.log(2)
    }
    if (wx_code && wx_userid) {
      this.$router.push({ path: "layout/beijingMustPass/DMP" });
    }
  },
  methods: {
    getWeChat() {
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
          agentid: "1000039",
          scope: "snsapi_login",
          redirect_uri: encodeURIComponent(
            `${vm.DomainName}/platform/authority`
          ),
          state: Math.ceil(Math.random() * 1000),
          style: "black",
          href: "data:text/css;base64,LmltcG93ZXJCb3ggew0KICAgIGhlaWdodDogMTAwJTsNCn0NCmh0bWwgew0KICAgIGhlaWdodDogMTAwJTsNCiAgICB1c2VyLXNlbGVjdDogbm9uZTsNCn0NCmJvZHkgew0KICAgIGhlaWdodDogMTAwJTsNCn0NCi5jYXJkIHsNCiAgICB3aWR0aDogNTAlOw0KICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTsNCiAgICB0b3A6IDUwJTsNCiAgICBsZWZ0OiA1MCU7DQogICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7DQp9DQoud3JwX2NvZGUgew0KICAgIHdpZHRoOiAxMDAlOw0KICAgIG1hcmdpbi10b3A6IDAhaW1wb3J0YW50Ow0KfQ0KLmZyYW1lX3dyYXAgew0KICAgIGhlaWdodDogMTAwJTsNCn0NCi5pbXBvd2VyQm94IC5xcmNvZGUge3dpZHRoOiAxMDAlO2hlaWdodDogYXV0bzt9DQouaW1wb3dlckJveCAudGl0bGUge2Rpc3BsYXk6IG5vbmU7fQ0KLmltcG93ZXJCb3ggLmluZm8ge2Rpc3BsYXk6IG5vbmU7fQ0KLnN0YXR1c19pY29uIHtkaXNwbGF5OiBub25lICAhaW1wb3J0YW50fQ0KLmltcG93ZXJCb3ggLnN0YXR1cyB7dGV4dC1hbGlnbjogY2VudGVyO30=",
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
</style>
