<template>
  <div ref="slide" class="slide">
    <div ref="slide_mask" class="slide_mask"><span>验证成功</span></div>
    <!-- <div class="slide_top">
      <div ref="slide_rtBtn" class="slide_rtBtn"></div>
      <div ref="slide_lfBtn" class="slide_lfBtn"></div>
    </div> -->
    <div class="slide_top">
      <div class="slide_img_bg">
        <img src="../../../assets/images/eg_big.png" alt="" />
      </div>
      <div class="slide_img_small">
        <img src="../../../assets/images/eg_small.png" alt="" />
      </div>
    </div>
    <div class="slide_btm">
      <div class="slide_line">
        <div
          ref="slide_btn"
          class="slide_btn"
          @mousedown="mouseDownEvent"
        ></div>
        <div ref="slide_blue" class="slide_blue"></div>
      </div>
    </div>
  </div>
</template>
<script>
import Slidefn from "./slide1.js";
// import './slide2.js'
// import './slide.6.1.1.min.js'

export default {
  data() {
    return {
      targetImg: "", // 64
      initSlide: null,
      initRtbtn: null,
      initLfbtn: null,
      initbtn: null,
      initmask: null,
      initblue: null,
      max_x: 0, // 最大可移动距离
      mouse_x: 0, // 鼠标初始位置
      move_x: 0, // 鼠标移动距离
      move_x_real: 0, // 鼠标最终移动距离
    };
  },
  mounted() {
    const vm = this;
    // Slidefn.init()
    // vm.init();
  },
  methods: {
    init() {
      const vm = this;
      // console.log(vm.$refs);
      vm.initSlide = vm.$refs.slide;
      vm.initmask = vm.$refs.slide_mask;
      vm.initRtbtn = vm.$refs.slide_rtBtn;
      vm.initLfbtn = vm.$refs.slide_lfBtn;
      vm.initbtn = vm.$refs.slide_btn;
      vm.initblue = vm.$refs.slide_blue;
      vm.max_x = vm.initSlide.offsetWidth - vm.initbtn.offsetWidth;
    },
    mouseDownEvent(e) {
      const vm = this;
      vm.mouse_x = e.clientX;
      document.addEventListener("mousemove", this.mousemoveEvent);
      document.addEventListener("mouseup", this.mouseupEvent);
    },
    mousemoveEvent(e) {
      const vm = this;
      vm.move_x = e.clientX - vm.mouse_x;
      if (vm.move_x <= 0) {
        // 往左移
        vm.move_x_real = 0;
      } else if (vm.move_x > vm.max_x) {
        // 往左移
        vm.move_x_real = vm.max_x;
      } else {
        vm.move_x_real = vm.move_x;
      }
      vm.initbtn.style.transition = "none";
      vm.initLfbtn.style.transition = "none";
      vm.initblue.style.transition = "none";
      vm.initbtn.style.left = vm.move_x_real + "px";
      vm.initLfbtn.style.left = vm.move_x_real + "px";
      vm.initblue.style.width = vm.move_x_real + 30 + "px";
      vm.initblue.style.backgroundColor = "#1381b2";
    },
    mouseupEvent(e) {
      const vm = this;
      // 同时移除移动和松开的事件，否则会影响二次滑动
      document.removeEventListener("mousemove", this.mousemoveEvent);
      document.removeEventListener("mouseup", this.mouseupEvent);
      // console.log(vm.move_x_real);
      // console.log(vm.initRtbtn.offsetLeft);
      // console.log("------------------");
      let chaszhi = Math.abs(vm.initRtbtn.offsetLeft - vm.move_x_real);
      if (chaszhi <= 5) {
        vm.initblue.style.width = vm.move_x_real + 30 + "px";
        vm.initmask.style.display = "flex";
        vm.initblue.style.backgroundColor = "#7dc51c";
      } else {
        vm.initblue.style.backgroundColor = "#fd4600";
        setTimeout(() => {
          vm.initbtn.style.transition = "all 0.3s linear";
          vm.initLfbtn.style.transition = "all 0.3s linear";
          vm.initblue.style.transition = "all 0.3s linear";
          vm.initbtn.style.left = "0px";
          vm.initLfbtn.style.left = "0px";
          vm.initblue.style.width = "0px";
        }, 1000);
      }
    },
    // 图片转base64
    getBase64(imgUrl) {
      window.URL = window.URL || window.webkitURL;
      var xhr = new XMLHttpRequest();
      xhr.open("get", imgUrl, true);
      xhr.responseType = "blob";
      xhr.onload = function () {
        if (this.status == 200) {
          //得到一个blob对象
          var blob = this.response;
          // 至关重要
          let oFileReader = new FileReader();
          oFileReader.onloadend = function (e) {
            // 此处拿到的已经是base64的图片了,可以赋值做相应的处理
            console.log(e.target.result);
            this.targetImg = e.target.result;
          };
          oFileReader.readAsDataURL(blob);
        }
      };
      xhr.send();
    },
    // 获取缺口左边中点坐标
    getBlockPos(imgURL) {
      return new Promise((resolve) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = () => {
          canvas.height = img.height;
          canvas.width = img.width;
          ctx.drawImage(img, 0, 0);

          //获取像素的一维数组
          let imgData = ctx.getImageData(0, 0, img.width, img.height);
          let x = 0,
            y = 0;
          for (let i = 0; i < imgData.data.length; i += 4) {
            // RGBA分别为对应i,i+1,i+2,i+3
            // 找出第一个半透明点，得到滑块区域左边中点
            if (imgData.data[i + 3] < 255) {
              let index = i / 4;
              x = index % img.width;
              y = (index - x) / img.width;
              x -= 17; // 左边
              y += 20; // 中点
              break;
            }
          }
          resolve([x, y]);
        };
        img.src = imgURL;
      });
    },
  },
};
</script>
<style lang="less" scoped>
@import "index";
</style>