<template>
<el-dialog title="公告" custom-class="noticeDialog  " :visible.sync="dialogVisible" width="43%" :close-on-click-modal="false" :close-on-press-escape="false" append-to-body modal-append-to-body @close="closeDialog">
  <div class="adInoDialog" v-if="partList.length > 0">
    <img src="../../assets/images/voice3.png" alt="" />
    <div class="adInoDialog_left">
      <el-menu :default-active="currentMenu + ''" class="el-menu-vertical" @select="handleSelect">
        <div v-for="(item, idx) in partList" :key="idx">
          <el-menu-item :index="idx + ''">
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </div>
      </el-menu>
    </div>
    <div class="adInoDialog_right">
      <div class="adInoDialog_header">
        <h1>
          {{ partList[currentMenu].main_title }}
        </h1>
        <h2>
          {{ partList[currentMenu].create_time }}
        </h2>
      </div>
      <el-divider></el-divider>
      <div class="adInoDialog_body">
        <p class="desc desc1">尊敬的用户:</p>
        <p class="desc desc2">
          {{ partList[currentMenu].mail_describe }}
        </p>
        <div class="part">
          <p v-for="(item1, idx1) in partList[currentMenu].mail_content_arr" :key="idx1">

            <span v-if="idx1===0" class="el-icon-star-on cnt">{{ item1 }}</span>
            <span v-else class="cnt">{{ idx1 +'、'+ item1 }}</span>
          </p>
          <p>操作入口：{{ partList[currentMenu].mail_path }}</p>
        </div>
      </div>
      <div class="adInoDialog_btn">
        <el-button type="primary" round @click="know" :disabled="ifDis">
          {{ this.ifDis ? `${this.count}S后关闭` : "我已知晓" }}
        </el-button>
        <span class="cp">产品部</span>
      </div>
    </div>
  </div>
  <span slot="footer" class="dialog-footer"> </span>
</el-dialog>
</template>

<script>
import {
  adInfo,
  readAllInfo,
  readOneInfo,
  addAdInfo
} from "@/api/api.js";
export default {
  name: "adInoDialog",
  data() {
    return {
      timer: null,
      countNum: 6,
      count: 6,
      ifDis: true,
      dialogVisible: false,
      partList: [],
      currentMenu: "0",
    };
  },
  created() {
    const vm = this;
    vm.getAdInfo('first');
  },
  methods: {
    getAdInfo(tag) {
      const vm = this;
      adInfo({
        no: "",
      }).then((res) => {
        if (res.data.data.length > 0) {
          vm.partList = res.data.data;
          vm.partList.forEach((val, idx) => {
            let t = val.mail_content.split("^");
            val.mail_content_arr = t;
          });
          if (tag) {
            vm.daojishi();
          }
        }
        vm.dialogVisible = res.data.data.length > 0;
      });
    },
    know() {
      this.readOne(this.partList[this.currentMenu])
    },
    readOne(row) {
      const vm = this
      readOneInfo({
        id: row.id
      }).then((res) => {
        if (res.data.code === 10000) {
          vm.currentMenu = 0
          vm.getAdInfo();
        }
      });
    },
    readAll() {
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
    closeDialog() {
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
@import "index";
</style>
