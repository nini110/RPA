<template>
  <div class="outerDiv">
    <div class="outerDiv_left">
      <el-divider>盯盘维度</el-divider>
      <div class="up">
        <a class="btnnormal btnnormal_down" @click="upList">
          <div
            class="el-icon-refresh btnSize"
            :class="multipleUp ? 'el-icon-refresh-right' : 'el-icon-upload2'"
          >
            {{ multipleUpTxt }}
          </div>
        </a>
      </div>
      <LeftUp v-if="multipleUp"></LeftUp>
      <Left v-else></Left>
      <div class="outerDiv_left_info">
        <h3 class="el-icon-info">须知</h3>
        <p v-for="(item, idx) in tipInfo" :key="idx">{{ item }}</p>
      </div>
    </div>
    <div class="outerDiv_right">
      <Right></Right>
    </div>
  </div>
</template>

<script>
import { alarmUser } from "@/api/api";
import message from "@/mixin/message";
import Upload from "@/components/upload";
import Left from "./left.vue";
import LeftUp from "./leftUp.vue";
import Right from "./right.vue";
export default {
  name: "ALarm",
  mixins: [message],
  components: {
    Upload,
    Left,
    LeftUp,
    Right,
  },
  data() {
    return {
      multipleUpTxt: "一键设置",
      btnTxt: "修改",
      multipleUp: false,
      pinList: [],
      tipInfo: [],
    };
  },
  watch: {
    multipleUp: {
      handler(newval, oldval) {
        this.multipleUpTxt = newval ? "取消" : "批量设置";
        this.tipInfo = newval
          ? [
              "1、使用该系统更新预算的时间段为当日起往后顺延30日（同京准通平台可设置时间段一致）",
              "2、建议按照下载模板格式上传，否则可能会解析失败",
              "3、有任何使用问题或优化建议欢迎联系开发人员，请联系企业微信工号：21400",
            ]
          : [
              "1、每天有四次刷新推广计划ID，早上8点，中午12点，下午18点，晚上24点，刷新时刻点不是正在投放状态的ID，将不纳入本轮次监控，直到下次任务刷新。",
              "2、临近设置阈值的5%内，每10分钟企业微信通知预警一次，直到通知次数耗尽。",
              "3、如果有新上的计划ID，想立即被监控，可通过修改预警信息的方式，手动刷新自己账号的监控列表。",
            ];
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.getUser();
  },
  // 离开页面的时候数据初始化
  beforeDestroy() {
    const vm = this;
    vm.$store.commit("pageData/UPDATE_HASINFO", false); //无数据
    vm.$store.commit("pageData/UPDATE_BTNSTATE", {
      //按钮
      inputFlag: false,
      deleteFlag: true,
      saveFlag: true,
    });
    vm.$store.commit("pageData/UPDATE_CURRENTIFO", null); //查询项
    vm.$store.commit("pageData/UPDATE_SEARCHRES", null); //结果
    vm.$store.commit("pageData/UPDATE_ClRLEFT", true); // 清空左侧输入框
  },
  methods: {
    // 获取所有PIN
    getUser() {
      const vm = this;
      alarmUser().then((res) => {
        if (res.data.code === 10000) {
          res.data.data.forEach((item, idx) => {
            vm.pinList.push({
              name: item,
              code: item,
            });
          });
          vm.$store.commit("pageData/UPDATE_PINLIST", vm.pinList);
        } else {
          vm.$msg({ type: "error", msg: res.data.msg });
        }
      });
    },
    upList() {
      this.multipleUp = !this.multipleUp;
      if (this.multipleUp) {
        this.$msg({ type: "error", msg: "暂无批量设置功能" });
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/views/index";
</style>
