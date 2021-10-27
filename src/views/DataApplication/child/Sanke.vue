<template>
  <!-- 竞标监控 -->
  <div class="sankey outerDiv">
    <div class="content">
      <div class="sankeyList">
        <div class="sankeyList_title">
          小米手机8月1日-8月24日广告销售数据桑基图
        </div>
        <div class="sankeyList_box_content">
          <div class="sankeyList_box_tops">图表详情</div>
          <div v-show="showDetail" class="sankeyList_box_middle">
            <div class="contentBox">
              <div class="contentBox_left">
                <img src="../../../assets/images/钻石.png" alt="" />
                <div class="contentBox_tips">建议优化<br />利益点</div>
              </div>
              <div class="contentBox_right">
                <div>小米10Pro计划</div>
                <div>小米11青春计划</div>
                <div>小米11至尊计划</div>
              </div>
            </div>
            <div class="contentBox">
              <div class="contentBox_left">
                <img src="../../../assets/images/钻石.png" alt="" />
                <div class="contentBox_tips">建议优化<br />计划</div>
              </div>
              <div class="contentBox_right">
                <div>K40-计划</div>
                <div>米10s计划</div>
                <div>Note9-Pro计划</div>
              </div>
            </div>
            <div class="contentBox teshu">
              <div class="contentBox_left teshu">
                <img src="../../../assets/images/钻石.png" alt="" />
                <div class="contentBox_tips">备受欢迎单品SKU</div>
              </div>
              <div class="contentBox_right teshu">
                <div>100009958327(小米11 5G)</div>
                <div>100019791894(小米11Pro)</div>
                <div>100019791982(小米11 Ultra)</div>
                <div>100018640834(K40)</div>
                <div>100021211862(K40游戏)</div>
                <div>100018642492(K40 Pro+)</div>
                <div>100016799390(Note9 Pro 5G)</div>
                <div>100016773624(Note9 5G)</div>
                <div>100016784108(Note9 4G)</div>
                <div>100011650799(Note10 5G)</div>
                <div>100022298852(Note10 Pro 5G)</div>
                <div>100019044460(小米10S)</div>
                <div>100019888160(小米11 青春)</div>
              </div>
            </div>
          </div>
          <div :class="icon" class="sankeyList_box_bottom" @click="tabEvent">{{ text }}</div>
        </div>
        <div class="echartsBox">
          <div id="main3"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { snakeData } from "./Snake.js";
export default {
  name: "sankey",
  data() {
    return {
      showDetail: false,
      icon: 'el-icon-arrow-down',
      text: "展开",
      option3: {
        title: {
          text: "",
        },
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove",
          formatter: function (data) {
            return data.name + " : " + data.value.toFixed(2);
          },
        },
        series: [
          {
            type: "sankey",
            data: [],
            links: [],
            emphasis: {
              focus: "adjacency",
            },
            levels: [
              {
                depth: 0,
                itemStyle: {
                  color: "#FAD876",
                },
                lineStyle: {
                  color: "source",
                  opacity: 0.6,
                },
              },
              {
                depth: 1,
                itemStyle: {
                  color: "#b3cde3",
                },
                lineStyle: {
                  color: "source",
                  opacity: 0.6,
                },
              },
              {
                depth: 2,
                itemStyle: {
                  color: "#ccebc5",
                },
                lineStyle: {
                  color: "source",
                  opacity: 0.6,
                },
              },
              {
                depth: 3,
                itemStyle: {
                  color: "#decbe4",
                },
                lineStyle: {
                  color: "source",
                  opacity: 0.6,
                },
              },
            ],
            lineStyle: {
              curveness: 0.5,
            },
          },
        ],
      },
    };
  },
  methods: {
    tabEvent() {
      const vm = this;
      vm.showDetail = !vm.showDetail
      vm.text = vm.showDetail ? '收起' : '展开';
      vm.icon = vm.showDetail ? 'el-icon-arrow-up' : 'el-icon-arrow-down';
    },
    selectClick() {
      this.flag2 = !this.flag2;
      if (this.flag2) {
        this.text = "展开";
      } else {
        this.text = "收起";
      }
    },
  },
  created() {
    let data3 = JSON.parse(JSON.stringify(snakeData));
    this.option3.series[0].data = data3.data;
    this.option3.series[0].links = data3.links;
  },
  mounted() {
    this.myChart3 = this.$echarts.init(document.getElementById("main3"));
    this.myChart3.setOption(this.option3, true);
  },
};
</script>

<style lang="less" scoped>
@import "@/views/index";
@import "./Snake";
</style>
