<template>
<!-- 数据应用 -->
<div style="height: 100%">
  <transition name="el-fade-in-linear">
    <router-view />
  </transition>
</div>
</template>

<script>
export default {
  name: 'DataApplication',
  data() {
    return {

    };
  },
  methods: {

  },
  created() {}
}
</script>

<style lang="less">
</style>
