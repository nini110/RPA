<template>
  <!-- 竞标监控 -->
  <div class="sankey outerDiv">
    <div class="content">
      <div class="sankeyList">
        <div class="sankeyList_title">
          OPPO手机12月13日数据广告销售数据桑基图
        </div>
<!--        <div class="snakeTable">
          <el-collapse v-model="activeName" accordion>
            <el-collapse-item
              v-for="(item, idx) in tableData"
              :key="idx"
              :title="idx + 1 + '.' + item.label"
              :name="idx + 1"
            >
              <div v-for="(item1, idx1) in item.tableDataC1" :key="idx1" class="itemLabel">
                {{ item1 }}
              </div>
            </el-collapse-item>
          </el-collapse>
        </div> -->
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
      activeName: 1,
      tableData: [
        {
          label: "建议优化利益点",
          tableDataC1: ["小米10Pro计划", "小米11青春计划", "小米11至尊计划"],
        },
        {
          label: "建议优化计划",
          tableDataC1: ["K40-计划", "米10s计划", "Note9-Pro计划"],
        },
        {
          label: "备受欢迎单品SKU",
          tableDataC1: [
            "100009958327(小米11 5G)",
            "100019791894(小米11Pro)",
            "100019791982(小米11 Ultra)",
            "100018640834(K40)",
            "100021211862(K40游戏)",
            "100018642492(K40 Pro+)",
            "100016799390(Note9 Pro 5G)",
            "100016773624(Note9 5G)",
            "100016784108(Note9 4G)",
            "100011650799(Note10 5G)",
            "100022298852(Note10 Pro 5G)",
            "100019044460(小米10S)",
            "100019888160(小米11 青春)",
          ],
        },
      ],
      showDetail: false,
      icon: "el-icon-arrow-down",
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
      vm.showDetail = !vm.showDetail;
      vm.text = vm.showDetail ? "收起" : "展开";
      vm.icon = vm.showDetail ? "el-icon-arrow-up" : "el-icon-arrow-down";
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
