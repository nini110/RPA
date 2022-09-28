<template>
  <el-dialog
    title="信息中心"
    custom-class="noticeDialog"
    :visible.sync="dialogVisible"
    width="43%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    modal-append-to-body
    @close="closeDialog"
  >
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="closeDialog">关 闭</el-button>
    </div>
    <div class="adInoDialog msgDialog" v-if="partList.length > 0">
      <div class="adInoDialog_left msgDialog_left">
        <el-menu
          :default-active="currentMenu + ''"
          class="el-menu-vertical"
          @select="handleSelect"
        >
          <div v-for="(item, idx) in menuLIst" :key="idx">
            <el-menu-item :index="idx + ''">
              <span slot="title">{{ item.title }}</span>
            </el-menu-item>
          </div>
        </el-menu>
      </div>
      <div class="adInoDialog_right msgDialog_right">
        <div v-if="outer">
          <el-timeline>
            <el-timeline-item
              v-for="(item, idx) in partList"
              :key="idx"
              :timestamp="item.create_time"
              :color="item.color"
              :icon="item.icon"
              placement="top"
              size="large"
            >
              <el-card>
                <h4 @click="cardEvent(idx)">{{ item.main_title }}</h4>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
        <div v-else>
          <div class="adInoDialog_header">
            <h1>
              {{ partList[currentPart].main_title }}
            </h1>
            <h2>
              {{ partList[currentPart].create_time }}
            </h2>
          </div>
          <el-divider></el-divider>
          <div class="adInoDialog_body">
            <p class="desc desc1">尊敬的用户:</p>
            <p class="desc desc2">
              {{ partList[currentPart].mail_describe }}
            </p>
            <div class="part">
              <p
                v-for="(item1, idx1) in partList[currentPart].mail_content_arr"
                :key="idx1"
              >
              <span v-if="idx1===0" class="el-icon-star-on cnt">{{ item1 }}</span>
              <span v-else class="cnt">{{ idx1 +'、'+ item1 }}</span>
              </p>
              <p>操作入口：{{ partList[currentPart].mail_path }}</p>
            </div>
          </div>
          <div class="adInoDialog_btn">
            <el-button
              type="danger"
              plain
              round
              @click="closeEvent(partList[currentPart].id)"
              >我已知晓</el-button
            >
            <span class="cp">产品部</span>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer"> </span>
  </el-dialog>
</template>
  <script>
import { readAllInfo, addAdInfo, allAdInfo, readOneInfo } from "@/api/api.js";
export default {
  name: "adInoDialog",
  data() {
    return {
      timer: null,
      countNum: 10,
      count: 10,
      dialogVisible: true,
      partList: [],
      menuLIst: [
        {
          title: "公告",
        },
      ],
      currentMenu: "0",
      outer: true,
      currentPart: 0,
    };
  },
  created() {
    const vm = this;
    vm.getAllAdInfo();
  },
  methods: {
    addInfo(obj) {
      const vm = this;
      addAdInfo({
        ...obj,
      }).then((res) => {});
    },
    getAllAdInfo() {
      const vm = this;
      allAdInfo({
        no: "",
      }).then((res) => {
        if (res.data.data.length > 0) {
          vm.partList = res.data.data;
          vm.partList.forEach((val, idx) => {
            vm.$set(val, "color", val.mail_status === "0" ? "red" : "#0bbd87");
            vm.$set(val, "icon", val.mail_status === "0" ? "el-icon-warning-outline" : "el-icon-circle-check");
            let t = val.mail_content.split("^");
            val.mail_content_arr = t;
          });
        }
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
    closeEvent(id) {
      const vm = this;
      readOneInfo({
        id,
      }).then((res) => {
        if (res.data.code === 10000) {
          vm.outer = true;
          vm.getAllAdInfo();
        }
      });
    },
    handleSelect(idx) {
      const vm = this;
      vm.currentMenu = idx;
    },
    cardEvent(idx) {
      this.outer = false;
      this.currentPart = idx;
    },
    closeDialog() {
      this.$emit("close");
    },
  },
};
</script>
  <style lang="less" scoped>
// @import "index";
@import "../adInfoDialog/index.less";
</style>
  