<template>
  <div class="DMP outerDiv" style="height:100%">
    <div class="content weipin">
      <div class="weipin_form">
        <el-tabs v-model="activeName">
          <el-tab-pane label="京准通" name="0"></el-tab-pane>
          <el-tab-pane label="唯品会" name="1"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="weipin_chart">
        <Chart
        :getDataFlag="getDataFlag"
        @close="close"
        ></Chart>
      </div>
    </div>
  </div>
</template>
<script>
import Chart from './child.vue'
export default {
  name: "Effect",
  components: {
      Chart
  },
  data() {
    return {
      activeName: null,
      getDataFlag: true
    };
  },
  mounted() {
    const vm = this;
  },
  methods: {
    close() {
      this.getDataFlag = false
    }
  },
};
</script>

<style lang="less" scoped>
@import 'index';
@import '@/views/index';
</style>
