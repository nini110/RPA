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
    // this.$route.query.wx_code = "tO8GfM9exjoSYjqk7FzT7gvsaxrLKAjt4i7ayTjUrBM";
    // this.$route.query.wx_userid = "23122";
    // this.$route.query.user_name = "方涛";
    // localStorage.setItem("wx_code", this.$route.query.wx_code);
    // localStorage.setItem("wx_userid", this.$route.query.wx_userid);
    // localStorage.setItem("user_name", this.$route.query.user_name);
  },
  mounted () {
    // diff算法  最小量的更新虚拟dom
    // path 函数
    // 同一个节点：pathVNode 精细比较
    // 不同节点：暴力删除，创建新节点插入到老结点之前，再删除老结点
    // pathVNode 函数
    // 新的有text 没有子节点 把旧的innerText换成新的
    // 新的没有text 有子节点
    //   新旧都有子节点  updateChildren
    //   新的有子节点 旧的没有子节点  清空老节点内容innerHtml 遍历新节点的children 创建dom append 
    // updateChildren函数
  },
  methods: {
    // 惰性删除
    delStorage () {
      tab.set = (key, val, experies) => {
        let res_val;
        let obj = {
          zhi: val,
          experies: new Date().getTime() + experies * 1000
        }
        res_val = JSON.stringify(obj)
        localStorage.setItem(key, res_val)
      }
      tab.get = (key) => {
        let target = localStorage.getItem(key)
        if (!target) return null
        let zhi = JSON.parse(target)
        if (zhi.experies < new Date().getTime()) {
          localStorage.removeItem(storageKey)
          return null
        }
        return zhi.zhi
      }
    },
    // 防抖
    // 事件触发一段时间之后再执行，规定时间内又触发，则重新计时
    debounce (fn, inital) {
      const vm = this;
      clearTimeout(vm.timer)
      vm.timer = null
      return () => {
        vm.timer = setTimeout(fn, inital)
      }
    },
    // 节流
    // 一定时间内事件只触发一次
    throotl1e (fn, inital) {
      const vm = this;
      if (vm.timer) return false
      vm.timer = setTimeout(() => {
        clearTimeout(vm.timer)
        vm.timer = null
        fn()
      }, inital)
    },
    dianjievent () {
      const vm = this
      // 防抖
      // vm.debounce(function() {
      //   console.log('防抖')
      // }, 2000)()
      // 节流
      vm.throotl1e(function () {
        console.log('节流')
      }, 2000)()
    }
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
