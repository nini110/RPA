<template>
  <div class="outerDiv publicDiv">
    <div class="content">
      <div class="itemsComp">
        <div class="tabs">
          <el-tabs v-model="activeName">
            <el-tab-pane label="看板" name="0"></el-tab-pane>
            <el-tab-pane label="列表" name="1"></el-tab-pane>
          </el-tabs>
          <div v-show="activeName === '0'" class="ziyou_chart">
            <h2>行业类目对比</h2>
            <div class="chartOuter">
              <el-row>
                <el-col :span="12" class="w100">
                  <el-date-picker
                    v-model="date1"
                    type="monthrange"
                    align="right"
                    unlink-panels
                    format="yyyy-MM"
                    value-format="yyyy-MM"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions"
                    @change="date1Event"
                  >
                  </el-date-picker>
                </el-col>
                <el-col :span="12" class="fr">
                  <el-radio-group v-model="radio1" @input="radio1Event">
                    <el-radio-button label="count">数量</el-radio-button>
                    <el-radio-button label="amount">金额</el-radio-button>
                  </el-radio-group>
                </el-col>
              </el-row>
              <div class="chart ts">
                <div id="dapanBarBox"></div>
              </div>
            </div>
            <h2>竞品项目对比</h2>
            <div class="chartOuter">
              <el-row>
                <el-col :span="12" class="w100">
                  <el-date-picker
                    v-model="date2"
                    type="monthrange"
                    align="right"
                    unlink-panels
                    format="yyyy-MM"
                    value-format="yyyy-MM"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions"
                    @change="date2Event"
                  >
                  </el-date-picker>
                </el-col>
                <el-col :span="12" class="fr">
                  <el-radio-group v-model="radio2" @input="radio2Event">
                    <el-radio-button label="company"
                      >公司</el-radio-button
                    >
                    <el-radio-button label="category"
                      >类目</el-radio-button
                    >
                  </el-radio-group>
                </el-col>
              </el-row>
              <div class="chart ts">
                <div id="dapanMidBox"></div>
              </div>
            </div>
            <h2>灵狐全年趋势</h2>
            <div class="chartOuter">
              <el-row>
                <el-col :span="12" class="w100">
                  <el-date-picker
                    v-model="date3"
                    type="monthrange"
                    align="right"
                    format="yyyy-MM"
                    value-format="yyyy-MM"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions"
                    @change="date3Event"
                  >
                  </el-date-picker>
                </el-col>
                <el-col :span="12" class="fr">
                  <el-radio-group v-model="radio3" @input="radio3Event">
                    <el-radio-button label="count">数量</el-radio-button>
                    <el-radio-button label="amount">金额</el-radio-button>
                  </el-radio-group>
                </el-col>
              </el-row>
              <div class="chart ts">
                <div id="dapanLineBox"></div>
              </div>
            </div>
          </div>
          <div v-show="activeName === '1'" class="ziyou_list ts"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { dapanLeimu, dapanJingpin, dapanQushi } from "@/api/api";
import dayjs from "dayjs";
import { callbackify } from "util";

export default {
  name: "SeleBrand",
  components: {},
  data() {
    const vm = this;
    return {
      date1: [],
      radio1: "count",
      date2: [],
      radio2: "company",
      date3: [],
      radio3: "count",
      activeName: "0",
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() >= new Date().getTime() - 24 * 60 * 60 * 1000;
        },
        shortcuts: [
          {
            text: "本月",
            onClick(picker) {
              picker.$emit("pick", [new Date(), new Date()]);
            },
          },
          {
            text: "最近3个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setMonth(start.getMonth() - 3);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一年",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setMonth(start.getMonth() - 12);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      midOption: {
        backgroundColor: "#fff",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
            shadowStyle: {
              color: "rgba(210,219,238,0.2)",
            },
          },
          formatter: (params) => {
            let htmlStr = "";
            if (params[0].seriesIndex !== 1) {
              htmlStr = `<div>${params[0].axisValue}</div>`;
              params.forEach((val, idx) => {
                let str = "";
                if (val.data !== 0) {
                  str = `<div style="display:flex;justify-content: space-bettwen"><span style="color: #606266;"><i style="display: inline-block;border-radius: 50%; width: 10px;height: 10px;margin-right: 5px;background-color: ${
                    val.color
                  };"></i>${
                    val.seriesName
                  }</span> <span> ${vm.numberToCurrencyNo(
                    val.data
                  )}元</span></div>`;
                }
                htmlStr += str;
              });
              return htmlStr;
            } else {
              return "";
            }
          },
        },
        xAxis: [
          {
            gridIndex: 0,
            show: false,
            type: "value",
            inverse: true,
          },
          {
            gridIndex: 1,
            show: false,
          },
          {
            gridIndex: 2,
            show: false,
            type: "value",
          },
        ],
        yAxis: [
          {
            gridIndex: 0,
            type: "category",
            inverse: true,
            position: "right",
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            data: [],
          },
          {
            gridIndex: 1,
            type: "category",
            inverse: true,
            data: [],
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: "#303133",
                fontSize: 12,
              },
            },
          },
          {
            gridIndex: 2,
            type: "category",
            data: [],
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
          },
        ],
        grid: [
          // 左侧数据
          {
            show: false,
            left: "0",
            width: "42.5%",
            bottom: 0,
            top: "4%",
            containLabel: true,
          },
          // 中间数据
          {
            show: false,
            left: "48%",
            width: 0,
            bottom: 0,
            top: "4%",
            containLabel: true,
          },
          // 右侧数据
          {
            show: false,
            right: "0",
            width: "42.5%",
            bottom: 0,
            top: "4%",
            containLabel: true,
          },
        ],
        series: [],
      },
      barOption: {
        color: ["#F47FAC", "#3E8FF2"],
        tooltip: {
          confine: true,
          // formatter: "{b}：<br>{a0} {c0} 个<br>{a1} {c1} 个",
        },
        legend: {
          icon: "rect",
          orient: "horizontal",
          top: 20,
          itemWidth: 12,
          itemHeight: 12,
          data: ["其他行业", "灵狐承接"],
        },
        grid: {
          left: "30%",
          right: "0",
          bottom: "0",
          top: "20%",
        },
        xAxis: {
          type: "value",
          splitLine: {
            lineStyle: {
              color: "rgba(255, 255, 255, 0.15)",
            },
          },
          splitArea: {
            show: false,
          },
        },
        yAxis: {
          type: "category",
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "#606266",
              fontSize: 12,
            },
          },
          data: [],
        },
        series: [
          {
            name: "其他行业",
            type: "bar",
            stack: "total",
            label: {
              normal: {
                show: false,
              },
            },
            itemStyle: {
              normal: {
                label: {
                  show: false,
                  position: "right",
                  color: "#fff",
                  fontFamily: "Bebas",
                },
              },
            },
            emphasis: {
              focus: "series",
            },
            data: [],
          },
          {
            name: "灵狐承接",
            type: "bar",
            stack: "total",
            label: {
              show: true,
            },
            itemStyle: {
              normal: {
                label: {
                  show: false,
                },
              },
            },
            emphasis: {
              focus: "series",
            },
            data: [],
          },
        ],
      },
      lineOption: {
        legend: {
          top: 20,
          // data: ["今年", "去年"],
        },
        grid: {
          left: "4%",
          right: "0",
          bottom: "13%",
        },
        xAxis: {
          type: "category",
          data: [],
        },
        yAxis: {
          type: "value",
        },
        tooltip: {
          trigger: "axis",
        },
        series: [
          {
            name: "共建费",
            data: [],
            type: "line",
            smooth: true,
            itemStyle: {
              color: "#F47FAC", //小圆点和线的颜色
            },
            lineStyle: {
              width: 2,
              shadowColor: "rgba(0, 0, 0, 0.2)",
              shadowBlur: 3,
              shadowOffsetY: 3,
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
                    color: "rgba(200,77,213, 0.2)",
                  },
                  {
                    offset: 1,
                    color: "rgba(200,77,213, 0)",
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
          {
            name: "市场费",
            data: [],
            type: "line",
            smooth: true,
            itemStyle: {
              color: "#3E8FF2", //小圆点和线的颜色
            },
            lineStyle: {
              width: 2,
              shadowColor: "rgba(0, 0, 0, 0.2)",
              shadowBlur: 2,
              shadowOffsetY: 2,
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
                    color: "rgba(13,107, 208, 0.2)",
                  },
                  {
                    offset: 1,
                    color: "rgba(13,107, 208, 0)",
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
          {
            name: "共建费 + 市场费",
            data: [],
            type: "line",
            smooth: true,
            itemStyle: {
              color: "#11c41b", //小圆点和线的颜色
            },
            lineStyle: {
              width: 2,
              shadowColor: "rgba(0, 0, 0, 0.2)",
              shadowBlur: 2,
              shadowOffsetY: 2,
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
                    color: "rgba(17,197, 27, 0.2)",
                  },
                  {
                    offset: 1,
                    color: "rgba(13,107, 208, 0)",
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
        ],
      },
    };
  },
  watch: {
    activeName: {
      handler(newval, oldval) {},
      immediate: true,
    },
  },
  mounted() {
    const vm = this;
    // 本月
    let zt = dayjs().format("YYYY-MM");
    // 上个月
    let zt_1 = dayjs().subtract(1, "month").format("YYYY-MM");
    // 3个月之前
    let zt_3 = dayjs().subtract(3, "month").format("YYYY-MM");
    // 6个月之前
    let zt_6 = dayjs().subtract(6, "month").format("YYYY-MM");
    // 12个月之前
    let zt_12 = dayjs().subtract(12, "month").format("YYYY-MM");
    vm.date1 = [zt_3, zt];
    vm.date2 = [zt_3, zt];
    vm.date3 = [zt_6, zt];
    vm.getBarData();
    vm.getMidData();
    vm.getLineData();
  },
  methods: {
    getBarData() {
      const vm = this;
      let obj = {
        start_date: vm.date1[0],
        end_date: vm.date1[1],
        search_type: vm.radio1,
      };
      dapanLeimu(obj).then((res) => {
        if (res.data.code === 10000) {
          let result = res.data.data;
          if (result.length > 7) {
            result = result.slice(0, 7);
          }
          vm.barOption.yAxis.data = result.map((val) => {
            return val.category;
          });
          vm.barOption.series[0].data = result.map((val) => {
            return val.total_amount || val.total_count;
          });
          vm.barOption.series[1].data = result.map((val) => {
            return val.lh_amount || val.lh_count;
          });
          vm.handleBar();
        }
      });
    },
    getMidData() {
      const vm = this;
      let obj = {
        start_date: vm.date2[0],
        end_date: vm.date2[1],
        search_type: vm.radio2,
      };
      dapanJingpin(obj).then((res) => {
        if (res.data.code === 10000) {
          vm.midOption.yAxis[0].data = [];
          vm.midOption.yAxis[1].data = [];
          vm.midOption.yAxis[2].data = [];
          vm.midOption.series = [
            {
              name: "总金额",
              type: "bar",
              yAxisIndex: 0,
              xAxisIndex: 0,
              itemStyle: {
                normal: {
                  color: "#909399",
                  opacity: 1,
                },
                emphasis: {
                  opacity: 1,
                },
              },
              data: [],
              showBackground: true,
              backgroundStyle: {
                color: "#f6f6f6",
              },
            },
            {
              name: "类目",
              type: "bar",
              yAxisIndex: 1,
              xAxisIndex: 1,
              label: {
                normal: {
                  show: false,
                },
              },
              data: [],
            },
          ];
          let result = res.data.data;
          let arr = [];
          for (let i in result) {
            vm.midOption.yAxis[0].data.unshift(i);
            vm.midOption.yAxis[1].data.unshift(i);
            vm.midOption.yAxis[2].data.push(i);
            let num = 0;
            for (let j in result[i]) {
              num += result[i][j];
              if (arr.indexOf(j) === -1) {
                arr.push(j);
                vm.midOption.series.push({
                  name: j,
                  type: "bar",
                  stack: "总量",
                  yAxisIndex: 2,
                  xAxisIndex: 2,
                  data: [],
                  showBackground: true,
                  backgroundStyle: {
                    color: "#f6f6f6",
                  },
                });
              }
            }
            vm.midOption.series[0].data.unshift(num);
          }
          for (let i in result) {
            // 印橙科技
            vm.midOption.series.forEach((val, idx) => {
              if (idx !== 0) {
                // ’3C家电零售事业群-家电事业部-小家电POP‘
                if (Object.keys(result[i]).indexOf(val.name) !== -1) {
                  val.data.push(result[i][val.name]);
                } else {
                  val.data.push(0);
                }
              }
            });
          }
          vm.handleMid();
        }
      });
    },
    getLineData() {
      const vm = this;
      let obj = {
        start_date: vm.date3[0],
        end_date: vm.date3[1],
        search_type: vm.radio3,
      };
      let mth_s = dayjs(vm.date3[0]).month();
      let lth = dayjs(vm.date3[1]).diff(vm.date3[0], "month");
      let monthArr = [];
      let midArr = new Array(lth + 1).fill(1);
      midArr.forEach((val, idx) => {
        mth_s += 1;
        monthArr.push(mth_s + "月");
      });
      vm.lineOption.xAxis.data = monthArr;
      vm.lineOption.series[0].data = [];
      vm.lineOption.series[1].data = [];
      vm.lineOption.series[2].data = [];

      dapanQushi(obj).then((res) => {
        if (res.data.code === 10000) {
          let arr = [];
          res.data.data.forEach((val, idx) => {
            let obj = {};
            vm.$set(obj, "month", val.month);
            if (val.program_type === "1") {
              vm.$set(obj, "count_1", val.count || val.amount);
            } else if (val.program_type === "2") {
              vm.$set(obj, "count_2", val.count || val.amount);
            } else if (val.program_type === "3") {
              vm.$set(obj, "count_3", val.count || val.amount);
            }
            arr.push(obj);
          });
          let dataArr = [];
          monthArr.forEach((val, idx) => {
            let obj = {};
            vm.$set(obj, "month", val);
            arr.forEach((val1, idx1) => {
              if (val.indexOf(val1.month) !== -1) {
                if (val1.count_1) {
                  vm.$set(obj, "count_1", val1.count_1);
                }
                if (val1.count_2) {
                  vm.$set(obj, "count_2", val1.count_2);
                }
                if (val1.count_3) {
                  vm.$set(obj, "count_3", val1.count_3);
                }
              }
            });
            dataArr.push(obj);
          });
          dataArr.forEach((val, idx) => {
            vm.lineOption.series[0].data.push(val.count_1 || 0);
            vm.lineOption.series[1].data.push(val.count_2 || 0);
            vm.lineOption.series[2].data.push(val.count_3 || 0);
          });
          vm.handleLine();
        }
      });
    },
    handleLine() {
      const vm = this;
      vm.$nextTick(() => {
        let myChart = vm.$echarts.init(document.getElementById("dapanLineBox"));
        myChart.setOption(vm.lineOption, true);
      });
    },
    handleBar() {
      const vm = this;
      vm.$nextTick(() => {
        let myChart = vm.$echarts.init(document.getElementById("dapanBarBox"));
        myChart.setOption(vm.barOption, true);
      });
    },
    handleMid() {
      const vm = this;
      vm.$nextTick(() => {
        let myChart = vm.$echarts.init(document.getElementById("dapanMidBox"));
        myChart.setOption(vm.midOption, true);
      });
    },
    // 行业类目对比--日期事件
    date1Event() {
      this.getBarData();
    },
    // 行业类目对比--radio事件
    radio1Event() {
      this.getBarData();
    },
    // 竞品项目对比--日期事件
    date2Event() {
      this.getMidData();
    },
    // 竞品项目对比--radio事件
    radio2Event(val) {
      const vm = this;
      vm.midOption.grid[0].width = val === "company" ? "42.%" : "32%";
      vm.midOption.grid[1].left = val === "company" ? "48%" : "37%";
      vm.midOption.grid[2].width = val === "company" ? "42.%" : "32%";
      this.getMidData();
    },
    // 趋势图--日期事件
    date3Event() {
      this.getLineData();
    },
    // 趋势图--radio事件
    radio3Event(val) {
      this.getLineData();
      this.lineOption.grid.left = val === "amount" ? "8%" : "4%";
    },
    numberToCurrencyNo(value) {
      if (!value) return 0;
      // 获取整数部分
      const intPart = Math.trunc(value);
      // 整数部分处理，增加,
      const intPartFormat = intPart
        .toString()
        .replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
      // 预定义小数部分
      let floatPart = "";
      // 将数值截取为小数部分和整数部分
      const valueArray = value.toString().split(".");
      if (valueArray.length === 2) {
        // 有小数部分
        floatPart = valueArray[1].toString(); // 取得小数部分
        return intPartFormat + "." + floatPart;
      }
      return intPartFormat + floatPart;
    },
  },
};
</script>
<style scoped lang="less">
@import "../selfBrand/index.less";
.chartOuter {
  margin: 0 0 40px 20px;
  padding: 40px 60px;
  background-color: #fff;
  box-shadow: 0px 0px 30px rgb(240, 240, 240);
}
.dapanMidBox {
  width: 100%;
  font-size: 18px;
  .lin {
    width: 90%;
    margin: 0 auto;
    // background-color: #ccc;

    .el {
      &-row {
        padding: 10px 0;
        &:first-child {
          background-color: #fff !important;
        }
        &:nth-child(even) {
          background-color: #f9f9f9;
        }
        &:nth-child(odd) {
          background-color: #f1f1f1;
        }
      }
      &-col {
        &.first,
        &.second {
          font-size: 20px;
          line-height: 60px;
          text-align: center;
        }
        &.third {
          display: flex;
          justify-content: space-around;
          p {
            // flex-basis: 33%;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-content: center;
            font-size: 18px;
            line-height: 30px;
            span {
              display: block;
              width: 100%;
              text-align: center;
            }
          }
        }
      }
    }
  }
}
.el {
  &-row {
    margin-bottom: 20px;
  }
  &-col {
    &.w100 {
      div {
        width: 100% !important;
      }
    }
    &.fr {
      text-align: right;
    }
  }
}
</style>
