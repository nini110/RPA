<template>
  <div style="height: 100%">
    <el-tabs v-model="activeName">
      <el-tab-pane 
        :disabled="tabDisable"
        v-for="(item, idx) in tabList"
        :key="idx"
        :label="item.label" 
        :name="item.name"></el-tab-pane>
    </el-tabs>
    <div id="effecrChart"></div>
  </div>
</template>
<script>
import { effectCharts } from "@/api/api";
export default {
  name: "Charts",
  props: {
    searchVal: {
      defalut: null,
      type: Object,
    },
    getDataFlag: {
      defalut: false,
      type: Boolean,
    },    
  },
  data() {
    return {
      tabDisable: true,
      tabList:[
        {
          label: 'ROI变化',
          name: '1'
        },
        {
          label: '展现量变化',
          name: '2'
        },
        {
          label: '点击量变化',
          name: '3'
        },
        {
          label: '点击率变化',
          name: '4'
        },
        {
          label: '订单量变化',
          name: '5'
        },
        {
          label: '订单金额变化',
          name: '6'
        },
        {
          label: '转化率变化',
          name: '7'
        },
      ],
      activeName: null,
      outerData: {},
      innerData: {},
      options: {
        title: {
          text: "",
          top: 20,
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          type: "plain",
          show: true,
          orient: "vertival",
          top: 30,
          left: 80,
          data: [
            "上升",
            "下降",
            "不变",
            "上升:涨价",
            "上升:降价",
            "上升:未变",
            "下降:涨价",
            "下降:降价",
            "下降:未变",
            "不变:涨价",
            "不变:降价",
            "不变:未变",
          ],
          selected: {
            "上升": true,
            "下降": true,
            "不变": false,
            "上升:涨价": true,
            "上升:降价": true,
            "上升:未变": true,
            "下降:涨价": true,
            "下降:降价": true,
            "下降:未变": true,
            "不变:涨价": false,
            "不变:降价": false,
            "不变:未变": false,
          }
        },
        series: [
          {
            name: "ROI",
            type: "pie",
            colorBy: "data",
            // clockwise: false,
            // selectedMode: "single",
            itemStyle: {
              normal: {
                color: function (colors) {
                  var colorList = [ "#f56c6c", "#5FC82B", "#FFC851"];
                  return colorList[colors.dataIndex];
                },
              },
            },
            radius: [0, "30%"],
            label: {
              position: "inner",
              fontSize: 12,
            },
            labelLine: {
              show: false,
            },
            data: [],
            emptyCircleStyle: {
              color: "#e6a23c",
              shadowColor: "rgba(150, 0, 0, 1)",
              shadowBlur: 23,
            },
          },
          {
            name: "价格",
            type: "pie",
            // clockwise: false,
            radius: ["38%", "60%"],
            labelLine: {
              length: 60,
            },
            label: {
              formatter: "{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ",
              backgroundColor: "#F6F8FC",
              borderColor: "#8C8D8E",
              borderWidth: 1,
              borderRadius: 4,
              rich: {
                a: {
                  color: "#6E7079",
                  lineHeight: 22,
                  align: "center",
                },
                hr: {
                  borderColor: "#8C8D8E",
                  width: "100%",
                  borderWidth: 1,
                  height: 0,
                },
                b: {
                  color: "#4C5058",
                  fontSize: 14,
                  fontWeight: "bold",
                  lineHeight: 33,
                },
                per: {
                  color: "#fff",
                  backgroundColor: "#4C5058",
                  padding: [3, 4],
                  borderRadius: 4,
                },
              },
            },
            data: [],
          },
        ],
      },
    };
  },
  watch: {
    getDataFlag(newval, oldval) {
      if(newval) {
        this.getChartsEvent(this.searchVal, this.activeName);
      }
    },
    activeName(newval, oldval) {
      const vm = this;
      vm.$nextTick(() => {
          switch(newval) {
            case '1': 
              vm.options.series[0].data = vm.outerData.ROI变化数量
              vm.options.series[1].data = vm.innerData.ROI变化数量
              break
            case '2': 
              vm.options.series[0].data = vm.outerData.展现变化数量
              vm.options.series[1].data = vm.innerData.展现变化数量
              break
            case '3': 
              vm.options.series[0].data = vm.outerData.点击变化数量
              vm.options.series[1].data = vm.innerData.点击变化数量
              break
            case '4': 
              vm.options.series[0].data = vm.outerData.点击率变化数量
              vm.options.series[1].data = vm.innerData.点击率变化数量
              break
            case '5': 
              vm.options.series[0].data = vm.outerData.订单行变化数量
              vm.options.series[1].data = vm.innerData.订单行变化数量
              break
            case '6': 
              vm.options.series[0].data = vm.outerData.订单金额变化数量
              vm.options.series[1].data = vm.innerData.订单金额变化数量
              break
            case '7': 
              vm.options.series[0].data = vm.outerData.转化率变化数量
              vm.options.series[1].data = vm.innerData.转化率变化数量
              break                                          
          }
          let myChart = vm.$echarts.init(document.getElementById("effecrChart"));
          myChart.setOption(vm.options, true);
      })

    },
  },
  created() {
    const vm = this;
  },
  mounted() {
    const vm = this;

  },
  methods: {
    // 获取图表数据
    getChartsEvent(val, tag) {
      const vm = this;
      vm.tabDisable = true;
      vm.activeName = null;
      effectCharts(val).then((res) => {
        if (res.data.code === 10000) {
          let result = res.data.data;
          let obj = {};
          let midObj = {};
          let numObj = null;

          for (let i in result) {
            // ROI变化数量
            vm.outerData[i] = [];
            vm.innerData[i] = [];

            for (let j in result[i]) {
              // 上升  下降   不变
              let midArr = {};
              for (let k in result[i][j]) {
                // 出价上升数量   出价下降数量  总数
                let a = result[i][j].出价上升数量;
                let b = result[i][j].出价下降数量;
                let c = result[i][j].出价不变数量;
                let e = result[i][j].总数;
                let d = [
                  { value: a, name: j +":涨价" },
                  { value: b, name: j +":降价" },
                  { value: c, name: j +":未变" },
                ];
                d.forEach((val, idx) => {
                  if (j === "上升") {
                    vm.$set(d[0], "itemStyle", { color: "#F89999" });
                    vm.$set(d[1], "itemStyle", { color: "#F2B9B9" });
                    vm.$set(d[2], "itemStyle", { color: "#F4D4D4" });
                  } else if (j === "下降") {
                    vm.$set(d[0], "itemStyle", { color: "#80C160" });
                    vm.$set(d[1], "itemStyle", { color: "#A6C298" });
                    vm.$set(d[2], "itemStyle", { color: "#BAC9B3" });
                  } else if (j === "不变") {
                    vm.$set(d[0], "itemStyle", { color: "#F7D07E" });
                    vm.$set(d[1], "itemStyle", { color: "#F4DDAE" });
                    vm.$set(d[2], "itemStyle", { color: "#F2E7CF" });
                  }
                });
                if (k !== "总数") {
                  midArr[j] = d;
                } else {
                  numObj = { value: e, name: j };
                  vm.outerData[i].push(numObj);
                }
 
                midObj[j] = midArr;
              }
              for(let m in midArr) {
                midArr[m].forEach((item, idx) => {
                  vm.innerData[i].push(item);
                })
              }
            }
            obj[i] = midObj;
          }
          vm.tabDisable = false;
          vm.activeName = '1';
          vm.$emit('close')
        }
      });
    },
  },
};
</script>

<style scoped>
#effecrChart {
  height: 100%;
}
.el-tabs {
  padding: 0 120px;
}
</style>