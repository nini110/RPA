<template>
  <div class="layout layout2">
    <div class="layout_menu_right">
      <div class="app-main" id="appMain">
        <transition name="el-fade-in-linear">
          <router-view class="app-router-view" />
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "layout",
  data() {
    return {
    };
  },
  mounted() {
    const vm = this;

  },
  methods: {

  },
};
</script>
<style lang="less" scoped>
@import "index";

.app-main {
  height: 100%;
}
</style>
