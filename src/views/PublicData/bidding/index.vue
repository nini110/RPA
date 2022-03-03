<template>
  <!-- 京东招标 -->
  <div class="JingdongBidding outerDiv">
    <div class="content">
      <nopage></nopage>
    </div>
  </div>
</template>

<script>
import nopage from "@/components/errorPage";
export default {
  name: "jdBidding",
  components: {
    nopage,
  },
};
</script>

<style lang="less">
@import "@/views/index";
</style>
