<template>
  <!-- 公共数据获取 -->
  <div class="PublicDomainDataAcquisition" style="height: 100%">
    <transition name="el-fade-in-linear">
      <router-view />
    </transition>
  </div>
</template>

<script>
export default {
  name: "PublicDomainDataAcquisition",
  data() {
    return {};
  },
  methods: {},
  created() {},
};
</script>

<style lang="less">
</style>
