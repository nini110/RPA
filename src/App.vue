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
  data () {
    return {
      timer: null
    };
  },
  created () {
    // 线上发布时created中所有都注释
    // this.$route.query.wx_code = "ebYIM8pMHl1mqb535f0fmuHSkMCxxjz6Ko_3KwbN6sc";
    // this.$route.query.wx_userid = "1020108";
    // this.$route.query.user_name = "方涛";
    // localStorage.setItem("wx_code", this.$route.query.wx_code);
    // localStorage.setItem("wx_userid", this.$route.query.wx_userid);
    // localStorage.setItem("user_name", this.$route.query.user_name);
  },
  mounted () {
    let arrAry = [10, 24, 9, 30, 2, 4, 14]
    // console.log(this.quick(arr))
  },
  methods: {
    // 冒泡排序
    bubble (arr) {
      let lth = arr.length // 7
      // 确定比较几轮: 7轮
      for (let i = 0; i < lth; i++) {
        // 每一轮比较几次： 6次 递减
        for (let j = 0; j < lth - 1 - i; j++) {
          if (arr[j] > arr[j + 1]) {
            let temp = arr[j + 1]
            arr[j + 1] = arr[j]
            arr[j] = temp
          }
        }
      }
      return arr
    },
    // 选择排序
    select (arr) {
      // let arr = [10, 24, 9, 30, 2, 4, 14]
      let lth = arr.length  // 7
      let minIdx;
      let temp;
      // 确定比较几轮：6轮
      for (let i = 0; i < lth - 1; i++) {
        minIdx = i
        for (let j = i + 1; j < lth; j++) {
          if (arr[j] < arr[minIdx]) {
            minIdx = j
          }
        }
        temp = arr[i]
        arr[i] = arr[minIdx]
        arr[minIdx] = temp
      }
      return arr
    },
    // 快速排序

    // 惰性删除
    // delStorage() {
    //   tab.set = (key, val, experies) => {
    //     let res_val;
    //     let obj = {
    //       zhi: val,
    //       experies: new Date().getTime() + experies * 1000
    //     }
    //     res_val = JSON.stringify(obj)
    //     localStorage.setItem(key, res_val)
    //   }
    //   tab.get = (key) => {
    //     let target = localStorage.getItem(key)
    //     if (!target) return null
    //     let zhi = JSON.parse(target)
    //     if(zhi.experies < new Date().getTime()) {
    //       localStorage.removeItem(storageKey)
    //       return null
    //     }
    //     return zhi.zhi
    //   }
    // }
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
