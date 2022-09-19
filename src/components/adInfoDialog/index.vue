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
    @close="closeDialog"
  >
    <div class="adInoDialog">
      <img src="../../assets/images/voice3.png" alt="" />
      <div class="adInoDialog_left">
        <el-menu
          :default-active="currentMenu"
          class="el-menu-vertical"
          @select="handleSelect"
        >
          <el-menu-item :index="idx" v-for="(item, idx) in partList" :key="idx">
            <span>{{idx+1}}- </span>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="adInoDialog_right">
        <div class="adInoDialog_header">
          <h1>{{ partList[currentMenu].main_title }}</h1>
          <h2>{{ partList[currentMenu].create_time }}</h2>
        </div>
        <el-divider></el-divider>
        <div class="adInoDialog_body">
          <p class="desc desc1">尊敬的用户:</p>
          <p class="desc desc2">{{ partList[currentMenu].mail_describe }}</p>
          <div class="part">
            <p
              v-for="(item1, idx1) in partList[currentMenu].mail_content_arr"
              :key="idx1"
            >
              <span class="el-icon-star-on cnt"></span>{{ item1 }}
            </p>
            <p>操作入口：{{ partList[currentMenu].mail_path }}</p>
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
import { adInfo, readAllInfo, addAdInfo } from "@/api/api.js";
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
      partList: [],
      currentMenu: 0,
    };
  },
  created() {
    const vm = this;
    // vm.readAdInfo()
    vm.getAdInfo();
    // vm.addInfo({
    //   title: "竞标监控",
    //   main_title: '「竞标监控」上线通知',
    //   mail_describe: '您是否有竞标项目超消、低效的痛点，竞品分析取数难的问题，现推出以下产品，统统解决您的问题',
    //   mail_content:
    //     "快速配置竞标及其活动^可针对竞标项目整体或不同活动进行监控^表单形式填写预算，减少上传文件步骤",
    //   mail_type: "2",
    //   mail_path: "预算预警 - 竞标监控",
    //   publisher: '产品部'
    // });
    // vm.addInfo({
    //   title: "京东市场监控",
    //   main_title: '「京东市场监控」上线通知',
    //   mail_describe: '您是否有竞标项目超消、低效的痛点，竞品分析取数难的问题，现推出以下产品，统统解决您的问题',
    //   mail_content:
    //     "竞品卖点/消费需求监测^竞品产品信息监测（规格、包装、价格）^竞品促销活动类型及促销力度监测",
    //   mail_type: "2",
    //   mail_path: "公域数据 - 京东市场监控",
    //   publisher: '产品部'
    // });
  },
  methods: {
    addInfo(obj) {
      const vm = this;
      addAdInfo({
        ...obj,
      }).then((res) => {});
    },
    getAdInfo() {
      const vm = this;
      adInfo().then((res) => {
        if (res.data.data.length > 0) {
          vm.partList = res.data.data;
          vm.partList.forEach((val, idx) => {
            let t = val.mail_content.split("^");
            val.mail_content_arr = t;
          });
          vm.date = res.data.data[0].create_time;
          vm.daojishi();
        }
        vm.dialogVisible = res.data.data.length > 0;
      });
    },
    readAdInfo() {
      const vm = this;
      readAllInfo().then((res) => {
        if (res.data.code === 10000) {
          vm.dialogVisible = false;
        }
      });
    },
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
    handleSelect(idx) {
      const vm = this;
      vm.currentMenu = idx;
    },
    closeEvent() {
      this.readAdInfo();
    },
    closeDialog() {
      this.dialogVisible = false;
    },
  },
};
</script>
<style lang="less" scoped>
@import "index";
</style>
