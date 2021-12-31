<template>
  <!-- 第三方工具 -->
  <div class="publicDiv" style="height: 100%">
    <transition name="el-fade-in-linear">
      <router-view />
    </transition>
  </div>
</template>

<script>
export default {
  name: "BudgetAlarm",
  data() {
    return {};
  },
};
</script>

<style lang="less" scoped>
@import "../Qianchuan/index.less";
</style>
