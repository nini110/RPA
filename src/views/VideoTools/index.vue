<template>
  <!-- 视频工具 -->
  <div class="VideoTools">
    <transition name="el-fade-in-linear">
      <router-view />
    </transition>
  </div>
</template>

<script>
export default {
  name: "VideoTools",
  data() {
    return {};
  },
  methods: {},
  created() {},
};
</script>

<style lang="less">
.VideoTools {
  padding-top: 80px;
  height: 100%;
  box-sizing: border-box;
}
</style>
