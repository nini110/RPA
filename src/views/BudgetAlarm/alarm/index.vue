<template>
<div class="outerDiv">
  <div class="content ts2">
    <div class="outerDiv_left">
      <Left></Left>
      <div class="outerDiv_left_info">
        <h3 class="el-icon-info">须知</h3>
        <div v-for="(item, idx) in tipInfo" :key="idx" class="box">
          <p class="box_txt">{{ item.title }}</p>
          <template v-if="item.children">
            <p class="box_cnt" v-for="(item1, idx1) in item.children" :key="idx1">
              {{ item1 }}
            </p>
          </template>
        </div>
      </div>
    </div>
    <div class="outerDiv_right">
      <Right></Right>
    </div>
  </div>

</div>
</template>

<script>
import {
  alarmUser,
  alarmUserAuthor
} from "@/api/api";
import message from "@/mixin/message";
import Upload from "@/components/upload";
import Left from "./left.vue";
import Right from "./right.vue";
export default {
  name: "ALarm",
  mixins: [message],
  components: {
    Upload,
    Left,
    Right,
  },
  data() {
    return {
      multipleUpTxt: "盯盘维度",
      btnTxt: "修改",
      multipleUp: false,
      pinList: [],
      pinListAuthor: [],
      tipInfo: [],
    };
  },
  watch: {
    $route: {
      handler(newval, oldval) {
        this.multipleUp = newval.name === "Budget";
      },
      immediate: true,
      deep: true
    },
    multipleUp: {
      handler(newval, oldval) {
        this.multipleUpTxt = newval ? "预算设置" : "盯盘维度";
        this.tipInfo = newval ?
          [
            "1、使用该系统更新预算的时间段为当日起往后顺延30日（同京准通平台可设置时间段一致）",
            "2、建议按照下载模板格式上传，否则可能会解析失败",
            "3、有任何使用问题请联系开发人员，企业微信工号：21400",
          ] :
          [
            {
              title: "1、每天有四次刷新推广计划ID，早上8点，中午12点，下午18点，晚上24点，刷新时刻点不是正在投放状态的ID，将不纳入本轮次监控，直到下次任务刷新。"
            },
            {
              title: "2、临近设置阈值的5%内，每10分钟企业微信通知预警一次，直到通知次数耗尽。",
            },
            {
              title: "3、如果有新上的计划ID，想立即被监控，可通过修改预警信息的方式手动刷新自己账号的监控列表。",
            },
          ]
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
    this.resetEvent();
  },
  methods: {
    // 获取所有PIN
    getUser() {
      const vm = this;
      let data1 = []
      let data2 = []
      Promise.all([alarmUser(), alarmUserAuthor()]).then(res => {
        if (res[0].data.code === 10000) {
          res[0].data.data.forEach((item, idx) => {
            data1.push({
              name: item,
              code: item,
            });
          });
          vm.pinList = JSON.parse(JSON.stringify(data1))
          vm.$store.commit("pageData/UPDATE_PINLIST", vm.pinList);
        } else {
          vm.$msg({
            type: "error",
            msg: res[0].data.msg
          });
        }
        if (res[1].data.code === 10000) {
          res[1].data.data.forEach((item, idx) => {
            data2.push({
              name: item,
              code: item,
            });
          });
          vm.pinListAuthor = JSON.parse(JSON.stringify(data2))
          vm.$store.commit("pageData/UPDATE_PINLISTAUTHOR", vm.pinListAuthor);
        } else {
          vm.$msg({
            type: "error",
            msg: res[1].data.msg
          });
        }
      })
    },
    upList() {
      this.multipleUp = !this.multipleUp;
    },
    close() {
      this.multipleUp = false;
      this.resetEvent();
    },
    // 重置
    resetEvent() {
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
  },
};
</script>

<style lang="less" scoped>
@import "@/views/index";
@import '../index.less';
</style>
