<template>
  <el-dialog
    title="账号验证"
    :visible.sync="verification"
    width="500px"
    max-height="600px"
  >
    <div class="tips">该账号需要进行手机验证</div>
    <div class="tipsItem">*验证完成后请重新操作*</div>
    <div class="button">
      <el-button @click="verificationFun">立即验证</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: "varifyDialog",
  props: {
      pageJumps: {
          default: '',
          type: String
      }
  },
  data() {
    return {
      verification: true,
    };
  },
  methods: {
    verificationFun() {
      let tempwindow = window.open("_blank");
      tempwindow.location = this.pageJumps;
      this.$emit('close')
    },
  },
};
</script>
<style lang="less" scoped>
@import "@/views/index";
</style>
