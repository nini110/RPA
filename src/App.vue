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
    // this.$route.query.wx_code = "t1jWw3QV1Bhijzb67PViia-ZN2DOcj_r3pYgZvcFGx4";
    // this.$route.query.wx_userid = "1020108";
    // this.$route.query.user_name = "方涛";
    // localStorage.setItem("wx_code", this.$route.query.wx_code);
    // localStorage.setItem("wx_userid", this.$route.query.wx_userid);
    // localStorage.setItem("user_name", this.$route.query.user_name);
  },
  mounted () {
    let arr = [30, 18, 8, 10, 60, 24, 3]
    let fn = arr => {
      for (let i = 1; i < arr.length; i++) {
        let current = arr[i]
        let preIdx = i - 1
        while (preIdx >= 0 && arr[preIdx] > current) {
          arr[preIdx + 1] = arr[preIdx]
          preIdx--
        }
        arr[preIdx + 1] = current
      }
    }
    let fn2 = arr => {
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length; j++) {
          if (arr[j] > arr[j + 1]) {
            let temp = arr[j + 1]
            arr[j + 1] = arr[j]
            arr[j] = temp
          }
        }
      }
      return arr
    }
    let fn3 = arr => {
      let minIdx = 0
      for (let i = 0; i < arr.length - 1; i++) {
        minIdx = i
        for (let j = i + 1; j < arr.length; j++) {
          if (arr[j] < arr[minIdx]) {
            minIdx = j
          }
        }
        let temp = arr[i]
        arr[i] = arr[minIdx]
        arr[minIdx] = temp
      }
    }
    console.log(fn2(arr))
  },
  methods: {
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
