<template>
  <!-- <div class="adInoDialog_mask">hahah</div>
        <div class="adInoDialog_box">
            <img  class="adInoDialog_img" src="../../assets/images/voice.png" alt="">
            <div class="adInoDialog_info">
                <img src="../../assets/110.png" alt="">
                <div class="adInoDialog_txt">喝水都会发光的是否打开</div>
            </div>
        </div> -->
  <el-dialog
    title="今日更新"
    custom-class="noticeDialog"
    :visible.sync="dialogVisible"
    width="45%"
    :close-on-click-modal="false"
    append-to-body
    modal-append-to-body
  >
    <div class="adInoDialog">
      <img src="../../assets/images/voice3.png" alt="" />
      <div class="adInoDialog_right">
        <div class="adInoDialog_header">
          <h1>更新日志</h1>
          <h2>2022 - 5 - 18</h2>
        </div>
        <div class="adInoDialog_body">
          <div class="part" v-for="(item, idx) in partList" :key="idx">
            <p class="el-icon-star-off">{{ item.title }}</p>
            <p v-for="(item1, idx1) in item.content" :key="idx1">{{
              item1
            }}</p>
          </div>
        </div>
        <div class="adInoDialog_btn">
          <el-button type="primary" round @click="closeEvent">我已知晓</el-button>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer"> </span>
  </el-dialog>
</template>
<script>
export default {
  name: "adInoDialog",
  data() {
    return {
      dialogVisible: false,
      partList: [
        {
          title: "预算预警",
          content: [
            "1. 今天的更新今天的更新今天的更新今天的更新今天的更新今天的更新今天的更新今天的更新今天的更新",
            "2. 今天的更新今天的更新今天的更新今天的更新今天的更新今天的更新今天的更新今天的更新今天的更新",
          ],
        },
        {
          title: "灵鲨消耗",
          content: [
            "1. 今天的更新今天的更新今天的更新今天的更新今天的更新今天的更新今天的更新今天的更新今天的更新",
            "2. 今天的更新今天的更新今天的更新今天的更新今天的更新今天的更新今天的更新今天的更新今天的更新",
          ],
        },
      ],
    };
  },
  methods: {
      closeEvent() {
          this.dialogVisible = false
      }
  },
};
</script>
<style lang="less" scoped>
@import "index";
</style>
