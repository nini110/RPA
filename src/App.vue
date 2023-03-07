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
    // this.$route.query.wx_code = "0rCC4NmLB0V84Zhpw8CbVK9Po0y829wu6CKR27IKgVk";
    // this.$route.query.wx_userid = "1020108";
    // this.$route.query.user_name = "方涛";
    // localStorage.setItem("wx_code", this.$route.query.wx_code);
    // localStorage.setItem("wx_userid", this.$route.query.wx_userid);
    // localStorage.setItem("user_name", this.$route.query.user_name);
    // this.debounce(consoleeve, 5000)
  },
  mounted() {
    // splice 会改变原数组
    let arr = ['a', 'b', 'c', 'd', 'e']
    let arr1 = arr.splice(0, 2)
    console.log(arr)  // ['c', 'd', 'e']
    console.log(arr1) // ['a', 'b']
    
    // slice不改变原数组
    let mon = ['a', 'b', 'c', 'd', 'e']
    let mon1 = mon.slice(0, 2)
    console.log(mon) // ['a', 'b', 'c', 'd', 'e']
    console.log(mon1) // ['a', 'b']

    // splice可以替换
    let det = ['a', 'b', 'c', 'd', 'e']
    let det1 = det.splice(0, 2, 'm', 'n', 's')
    console.log(det) // ['m', 'n', 's', 'c', 'd', 'e']
    console.log(det1) // ['a', 'b']

    // splice可以插入
    let you = ['a', 'b', 'c', 'd', 'e']
    let you1 = you.splice(1, 0, 'm', 'n', 's')
    console.log(you) // ['a', 'm', 'n', 's','b', 'c', 'd', 'e']
    console.log(you1) // []
    // ------
    // splice主要用于数组，可以删除、插入、替换， 就会改变原数组
    // slice 主要用于字符串，不改变原数组
    let str = '你是谁哈哈哈小猫咪啊'
    // 正数从前，负数从后
    let str1 = str.slice(3, -2) // 哈哈哈小猫
    // 负的参数当0处理， 按照大小调位置
    let str2 = str.substring(3, -2) // 你是谁
    // 调换位置
    let str3 = str.substring(3, 2) // 谁
    // substr  开始位置——长度
    let str4 = str.substr(3, 2) // 哈哈
    console.log(str1)
    console.log(str2)
    console.log(str3)
    console.log(str4)
    let str5 = str.replace('谁', '牛')
    console.log(str)
    console.log(str5)

    
  }
  // consoleeve() {
  //   const qq = document.getElementsByClassName('qq')
  //   if(qq.value) {
  //     console.log('haha')
  //   }
  // },
  // // 防抖
  // debounce(fn, interval) {
  //   let timer = null
  //   return () => {
  //     clearTimeout(timer)
  //     timer = setTimeout(fn, interval)
  //   }
  // },
  // throotol(fn, interval) {
  //   let timer
  //   if (timer) return
  //   timer = setTimeout(() => {
  //     clearTimeout(timer)
  //     timer = null
  //     fn()
  //   }, interval)
  // }
};
</script>
<style lang="less">
#app {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
