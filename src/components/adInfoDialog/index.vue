<template>
  <el-dialog
    title="今日更新"
    custom-class="noticeDialog"
    :visible.sync="dialogVisible"
    width="43%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    modal-append-to-body
  >
    <div class="adInoDialog">
      <img src="../../assets/images/voice3.png" alt="" />
      <div class="adInoDialog_right">
        <div class="adInoDialog_header">
          <h1>『 竞标监控 』产品上线通知</h1>
          <h2>{{ date }}</h2>
        </div>
        <div class="adInoDialog_body">
          <p class="desc">尊敬的用户:</p>
          <p class="desc">{{ desc }}</p>
          <div class="part" v-for="(item, idx) in partList" :key="idx">
            <p class="el-icon-star-off">{{ item.title }}</p>
            <p v-for="(item1, idx1) in item.content" :key="idx1">{{ item1 }}</p>
            <br>
            <p>操作入口：预算预警 - 竞标监控</p>
          </div>
        </div>
        <div class="adInoDialog_btn">
          <el-button
            type="primary"
            round
            @click="closeEvent"
            :disabled="ifDis"
            >{{ this.ifDis ? `${this.count}S后关闭` : "我已知晓" }}</el-button
          >
          <span class="cp">产品部</span>
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
      timer: null,
      countNum: 5,
      count: 10,
      ifDis: true,
      dialogVisible: false,
      idTag: false,
      desc: "为预防竞标投放项目超消或低消，现推出竞标预算监控服务，诚邀您使用。",
      date: "2022-09-01 00:00:00",
      partList: [
        {
          title: "竞标监控",
          content: [
            "1. 快速配置竞标及其活动",
            "2. 可针对竞标项目整体或不同活动进行监控",
            "3. 表单形式填写预算，减少上传文件步骤。",
          ],
          url: "/#/layout/dataApplication/monitor",
        },
      ],
    };
  },
  created() {
    const vm = this;
  },
  mounted() {
    const vm = this;
    let adTag = localStorage.getItem("adTag");
    if (!adTag) {
      vm.dialogVisible = true;
      vm.daojishi();
    } else {
      vm.dialogVisible = false;
    }
  },
  methods: {
    daojishi() {
      const vm = this;
      vm.count = vm.countNum;
      if (!vm.timer) {
        vm.timer = setInterval(() => {
          if (vm.count > 1 && vm.count <= vm.countNum) {
            vm.ifDis = true;
            vm.count--;
          } else {
            clearInterval(vm.timer);
            vm.ifDis = false;
            vm.timer = null;
            vm.count = 0;
          }
        }, 1000);
      }
    },
    closeEvent() {
      localStorage.setItem("adTag", 1);
      this.dialogVisible = false;
    },
  },
};
</script>
<style lang="less" scoped>
@import "index";
</style>
