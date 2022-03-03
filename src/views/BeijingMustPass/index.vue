<template>
  <!-- 京准通工具 -->
  <div style="height: 100%">
    <IptComp :toolType="toolType"></IptComp>
  </div>
</template>

<script>
import IptComp from "@/components/iptTable/index.vue";
export default {
  name: "BeijingMustPass",
  components: {
    IptComp
  },
  data() {
    return {
      toolType: "0",
    };
  },
  watch: {
    $route: {
      handler(newval, oldval) {
        const vm = this;
        switch (newval.name) {
          case "DMP":
            this.toolType = "0";
            break;
          case "Booth":
            this.toolType = "9";
            break;
          case "Direct":
            this.toolType = "5";
            break;
          case "People":
            this.toolType = "13";
            break;
          case "Cube":
            this.toolType = "1";
            break;
          case "Mail":
            this.toolType = "4";
            break;
          case "GoShop":
            this.toolType = "14";
            break;
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {},
  created() {
  },
};
</script>

<style lang="less" scoped>
</style>
