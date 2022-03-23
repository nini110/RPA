<template>
  <div class="chartsBox">
    <div class="chartsBox_btm" style="height: 100%">
      <div v-if="noData" class="imgInfo">
        <img src="@/assets/images/noneData2.png" alt="" />
        <span>数据可视化展示</span>
      </div>
      <div v-else style="height: 100%">
        <div ref="effecrChart" class="effecrChartBox" id="expendChart"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { expendDate } from "@/api/api";
export default {
  name: "Charts",
  props: {
    activeName: {
      defalut: null,
      type: String,
    },
    getDataFlag: {
      defalut: false,
      type: Boolean,
    },
  },
  data() {
    return {
      active: null,
      noData: false,
      showResult: false,
      options: {
        backgroundColor: "#303133",
        title: {
          text: "京准通消耗图表",
          x: "center",
          y: "2%",
          textStyle: {
            color: "#fff",
            fontSize: "18",
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          backgroundColor: "#303133",
          borderColor: "#909399",
          textStyle: {
            color: "#fff",
          },
        },
        legend: {
          top: "2%",
          right: "5%",
          textStyle: {
            color: "#90979c",
            fontSize: 12,
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: [],
            axisLine: {
              lineStyle: {
                color: "rgba(255,255,255,0.12)",
              },
            },
            axisLabel: {
              margin: 10,
              color: "#e2e9ff",
              textStyle: {
                fontSize: 14,
              },
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            axisLine: {
              show: false,
            },
            axisLabel: {
              formatter: function (value) {
                return value / 10000 + "万";
              },
              color: "#e2e9ff",
            },
            splitLine: {
              lineStyle: {
                color: "rgba(255,255,255,0.12)",
              },
            },
          },
        ],
        series: [
          {
            name: "自有",
            type: "bar",
            data: [],
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgba(35,195,255,1)",
                  },
                  {
                    offset: 1,
                    color: "rgba(35,195,255,0)",
                  },
                ]),
                barBorderRadius: [12, 12, 0, 0], //圆角大小
                shadowColor: "rgba(0,160,221,1)",
                shadowBlur: 2,
              },
            },
            label: {
              normal: {
                show: false,
                fontSize: 16,
                fontWeight: "bold",
                color: "#333",
                position: "top",
              },
            },
          },
          {
            name: "竞标",
            type: "bar",
            data: [],
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgba(254,215,46,1)",
                  },
                  {
                    offset: 1,
                    color: "rgba(254,215,46,0)",
                  },
                ]),
                barBorderRadius: [12, 12, 0, 0], //圆角大小
                shadowColor: "rgba(254,215,46,1)",
                shadowBlur: 2,
              },
            },
            label: {
              normal: {
                show: false,
                fontSize: 16,
                fontWeight: "bold",
                color: "#333",
                position: "top",
              },
            },
          },
          {
            data: [8000, 16000, 20000, 25000],
            type: "line",
            showAllSymbol: true,
            smooth: true,
            name: "总消耗",
            symbolSize: 7,
            symbol: "circle",
            lineStyle: {
              width: 1
            },
            itemStyle: {
              normal: {
                color: "#7BE09A",
                shadowColor: "rgba(0, 0, 0, 0)",
                shadowBlur: 0,
                shadowOffsetY: 5,
                shadowOffsetX: 5,
              },
            },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(123,224,154, 0.4)",
                  },
                  {
                    offset: 1,
                    color: "rgba(123,224,154, 0)",
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
          // {
          //   name: "自有-站内",
          //   type: "bar",
          //   stack: "overlap",
          //   emphasis: {
          //     focus: "series",
          //   },
          //   data: [320, 332, 301],
          // },
          // {
          //   name: "自有-站外",
          //   type: "bar",
          //   stack: "overlap",
          //   emphasis: {
          //     focus: "series",
          //   },
          //   data: [120, 132, 101],
          // },
          // {
          //   name: "竞标-站内",
          //   type: "bar",
          //   stack: "Ad",
          //   emphasis: {
          //     focus: "series",
          //   },
          //   data: [220, 182, 191],
          // },
          // {
          //   name: "竞标-站外",
          //   type: "bar",
          //   stack: "Ad",
          //   emphasis: {
          //     focus: "series",
          //   },
          //   data: [150, 232, 201],
          // },
        ],
      },
    };
  },
  watch: {
    getDataFlag: {
      handler(newval, oldval) {
        const vm = this;
        if (newval) {
          vm.getData("2021");
        }
      },
      immediate: true,
      deep: true,
    },
    active(newval, oldval) {
      const vm = this;
      vm.$nextTick(() => {
        if (newval === "0") {
          let myChart = vm.$echarts.init(
            document.getElementById("expendChart")
          );
          myChart.setOption(vm.options, true);
        }
      });
    },
  },
  created() {
    const vm = this;
  },
  methods: {
    // 获取图表数据
    getData(year) {
      const vm = this;
      vm.active = null;
      expendDate({ year }).then((res) => {
        if (res.data.code === 200) {
          let resultZy = res.data.data.zy;
          let resultJb = res.data.data.jb;
          let mid1 = []; // 自有
          let mid2 = []; // 竞标
          let mid3 = []; // 总数

          let midYear = [];
          resultZy.map((val, idx) => {
            return mid1.push(val.total_cost);
          });
          resultJb.map((val, idx) => {
            return mid2.push(val.total_cost);
          });
          let arr = [0,1,2,3,4,5,6,7,8,9,10,11]
          arr.forEach((val, idx) => {
            let inf = resultZy[val].total_cost + resultJb[val].total_cost
            mid3.push(inf)
          })
          resultJb.map((val, idx) => {
            return mid2.push(val.total_cost);
          });
          resultJb.map((val, idx) => {
            return midYear.push(year + "-" + val.month + "月");
          });
          vm.options.xAxis[0].data = midYear;
          vm.options.series[0].data = mid1;
          vm.options.series[1].data = mid2;
          vm.options.series[2].data = mid3;
          vm.active = "0";
          vm.$emit("close");
        } else {
          vm.$msg({ type: "warning", msg: res.data.msg });
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.chartsBox,
.effecrChartBox {
  height: 100%;
}
</style>
