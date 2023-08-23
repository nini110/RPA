<template>
  <!-- 第三方工具 -->
  <div class="BeijingMustPass" style="height: 100%">
    <transition name="el-fade-in-linear">
      <router-view />
    </transition>
  </div>
</template>

<script>

export default {
  name: "ThirdPartyTools",
  data () {
    return {
    };
  },
  created () {

  },

};
</script>

<style lang="less" >
@import "@/views/index.less";
@import "@/views/Qianchuan/index.less";
@import "@/views/Qianchuan/items/index.less";

.arrow {
  position: absolute;
  left: 50%;
  bottom: 10px;
  transform: translateX(-50%);
  z-index: 99;
  font-size: 26px;
  font-weight: bold;
  background-color: #409eff;
  padding: 10px 40px;

  span {
    display: inline-block;
    margin: 0 40px;
    cursor: pointer;
    color: #fff;
  }
}

.linkAnnotation {
  display: none;
}
</style>
