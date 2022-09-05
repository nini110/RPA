<template>
  <el-dialog
    title="提示"
    :visible.sync="dialogVisible"
    width="30%"
    @close="closeExcel"
    fullscreen
    custom-class="excelDialog"
  >
    <div id="luckysheet" ref="luckysheet"></div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeExcel">取 消</el-button>
      <el-button type="primary" @click="submitExcel">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    excelOptions: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      dialogVisible: true,
    };
  },
  mounted() {
    const vm = this;
    let dataOpt = vm.excelOptions;
    this.$nextTick(() => {
      $(function () {
        luckysheet.create({
          container: "luckysheet",
          title: "",
          lang: "zh",
          data: dataOpt,
        });
      });
    });
  },
  methods: {
    closeExcel() {
      const vm = this;
      vm.$emit("close");
    },
    submitExcel() {
      const vm = this;
      this.$nextTick(() => {
        $(function () {
          console.log(window.luckysheet);
          console.log(window.luckysheet.getcellvalue());
        });
      });
      //   let resdata = luckysheet.getAllSheets();
    //   console.log(window.luckysheet);
    //   console.log(vm.$refs.luckysheet);

      //   vm.$emit("close");
    },
  },
};
</script>
<style scoped lang="less">
#luckysheet {
  width: 100%;
  height: 100%;
}
</style>