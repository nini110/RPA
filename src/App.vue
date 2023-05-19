<template>
<div id="app">
  <transition name="el-fade-in-linear">
    <router-view />
    <!-- <div class="pp" @click="dianjievent">点击</div> -->
  </transition>
</div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      timer: null
    };
  },
  created() {
    // 线上发布时created中所有都注释
    // this.$route.query.wx_code = "29EM3BlvA_TJlO4xo6UJxDErUZcYbNPTan26_Om2J7E";
    // this.$route.query.wx_userid = "1020108";
    // this.$route.query.user_name = "方涛";
    // localStorage.setItem("wx_code", this.$route.query.wx_code);
    // localStorage.setItem("wx_userid", this.$route.query.wx_userid);
    // localStorage.setItem("user_name", this.$route.query.user_name);
  },
  mounted() {
  },
  methods: {
    // // 防抖
    // // 事件触发一段时间之后再执行，规定时间内又触发，则重新计时
    // debounce(fn, inital) {
    //   const vm = this;
    //   clearTimeout(vm.timer)
    //   vm.timer = null
    //   return () => {
    //     vm.timer = setTimeout(fn, inital)
    //   }
    // },
    // // 节流
    // // 一定时间内事件只触发一次
    // throotl1e(fn, inital) {
    //   const vm = this;
    //   if (vm.timer) return false
    //   vm.timer = setTimeout(() => {
    //     clearTimeout(vm.timer)
    //     vm.timer = null
    //     fn()
    //   }, inital)

    // },
    // dianjievent() {
    //   const vm = this
    //   // 防抖
    //   // vm.debounce(function() {
    //   //   console.log('防抖')
    //   // }, 2000)()
    //   // 节流
    //   vm.throotl1e(function() {
    //     console.log('节流')
    //   }, 2000)()
    // }
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
