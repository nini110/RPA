<template>
<div id="app">
  <transition name="el-fade-in-linear">
    <router-view />
  </transition>
</div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {};
  },
  created() {
    // 线上发布时created中所有都注释
    // this.$route.query.wx_code = "EG6kVz3quR9vnZAJKdg8EouKSQFk5XivZsVo96pF_-c";
    // this.$route.query.wx_userid = "1020108";
    // this.$route.query.user_name = "方涛";
    // localStorage.setItem("wx_code", this.$route.query.wx_code);
    // localStorage.setItem("wx_userid", this.$route.query.wx_userid);
    // localStorage.setItem("user_name", this.$route.query.user_name);
  },
  mounted() {

  }
};
</script>

<style lang="less">
#app {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
