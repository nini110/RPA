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
  data () {
    return {
      timer: null,
    };
  },
  beforeCreate () {
  },
  created () {
    // 线上发布时created中所有都注释
    // this.$route.query.wx_code = "C760LPJBUH2ISkJRNJtiaSCWsAzlpU7f5mMHmqYW6Fg";
    // this.$route.query.wx_userid = "23122";
    // this.$route.query.user_name = "方涛";
    // localStorage.setItem("wx_code", this.$route.query.wx_code);
    // localStorage.setItem("wx_userid", this.$route.query.wx_userid);
    // localStorage.setItem("user_name", this.$route.query.user_name);
  },
  mounted () {
  },
  methods: {

  }
};
</script>

<style lang="less">
#app {
  width: 100%;
  height: 100%;
  position: relative;
}

.pp {
  position: absolute;
  left: 0;
  top: 0;
  color: #fff;
  font-size: 30px;
  cursor: pointer;
  z-index: 100000;
}
</style>
