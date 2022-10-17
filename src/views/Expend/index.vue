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
  data() {
    return {};
  },
};
</script>

<style lang="less" >
@import "@/views/index.less";
@import "@/views/Qianchuan/index.less";
@import "@/views/Qianchuan/items/index.less";
</style>
