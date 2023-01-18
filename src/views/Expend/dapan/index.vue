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
                    :clearable="false"
                    :picker-options="pickerOptions1"
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
                    :clearable="false"
                    :picker-options="pickerOptions2"
                    @change="date2Event"
                  >
                  </el-date-picker>
                </el-col>
                <el-col :span="12" class="fr">
                  <el-radio-group v-model="radio2" @input="radio2Event">
                    <el-radio-button label="company">公司</el-radio-button>
                    <el-radio-button label="category">类目</el-radio-button>
                  </el-radio-group>
                </el-col>
              </el-row>
              <div class="chart ts ts3">
                <div id="dapanMidBox"></div>
              </div>
            </div>
            <h2>灵狐竞标占比</h2>
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
                    :picker-options="pickerOptions3"
                    :clearable="false"
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
          <div v-show="activeName === '1'" class="tabs_cnt">
            <listPage></listPage>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { dapanLeimu, dapanJingpin, dapanQushi } from "@/api/api";
import listPage from "./list.vue";
import dayjs from "dayjs";

export default {
  name: "SeleBrand",
  components: {
    listPage
  },
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
      pickerOptions1: {
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
              start.setMonth(start.getMonth() - 2);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近半年",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setMonth(start.getMonth() - 5);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一年",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setMonth(start.getMonth() - 11);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
        disabledDate: (time) => {
          let today = dayjs();
          let maxDate = dayjs().add(12, "month");
          let minDate = dayjs().subtract(12, "month");
          if (vm.tdata1) {
            let dateRegionMax = dayjs(vm.tdata1).add(12, "month");;
            let dateRegionMin = dayjs(vm.tdata1).subtract(12, "month");
            if (dateRegionMax.isAfter(today) ) {
              return time.getTime() >= today || time.getTime() < dateRegionMin;
            } else {
              return time.getTime() >= dateRegionMax || time.getTime() < dateRegionMin;
            }
          } else {
            if (maxDate.isAfter(today)) {
              return time.getTime() >= today || time.getTime() < minDate;
            } else {
              return time.getTime() >= maxDate || time.getTime() < minDate;
            }
          }
        },
        onPick(time) {
          //当第一时间选中才设置禁用
          if (time.minDate && !time.maxDate) {
            vm.tdata1 = time.minDate;
          }
        },
      },
      pickerOptions2: {
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
              start.setMonth(start.getMonth() - 2);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近半年",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setMonth(start.getMonth() - 5);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一年",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setMonth(start.getMonth() - 11);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
        disabledDate: (time) => {
          let today = dayjs();
          let maxDate = dayjs().add(12, "month");
          let minDate = dayjs().subtract(12, "month");
          if (vm.tdata2) {
            let dateRegionMax = dayjs(vm.tdata2).add(12, "month");;
            let dateRegionMin = dayjs(vm.tdata2).subtract(12, "month");
            if (dateRegionMax.isAfter(today) ) {
              return time.getTime() >= today || time.getTime() < dateRegionMin;
            } else {
              return time.getTime() >= dateRegionMax || time.getTime() < dateRegionMin;
            }
          } else {
            if (maxDate.isAfter(today)) {
              return time.getTime() >= today || time.getTime() < minDate;
            } else {
              return time.getTime() >= maxDate || time.getTime() < minDate;
            }
          }
        },
        onPick(time) {
          //当第一时间选中才设置禁用
          if (time.minDate && !time.maxDate) {
            vm.tdata2 = time.minDate;
          }
        },
      },
      pickerOptions3: {
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
              start.setMonth(start.getMonth() - 2);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近半年",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setMonth(start.getMonth() - 5);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一年",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setMonth(start.getMonth() - 11);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
        disabledDate: (time) => {
          let today = dayjs();
          let maxDate = dayjs().add(12, "month");
          let minDate = dayjs().subtract(12, "month");
          if (vm.tdata3) {
            let dateRegionMax = dayjs(vm.tdata3).add(12, "month");;
            let dateRegionMin = dayjs(vm.tdata3).subtract(12, "month");
            if (dateRegionMax.isAfter(today) ) {
              return time.getTime() >= today || time.getTime() < dateRegionMin;
            } else {
              return time.getTime() >= dateRegionMax || time.getTime() < dateRegionMin;
            }
          } else {
            if (maxDate.isAfter(today)) {
              return time.getTime() >= today || time.getTime() < minDate;
            } else {
              return time.getTime() >= maxDate || time.getTime() < minDate;
            }
          }
        },
        onPick(time) {
          //当第一时间选中才设置禁用
          if (time.minDate && !time.maxDate) {
            vm.tdata3 = time.minDate;
          }
        },
      },
      tdata1: null,
      tdata2: null,
      tdata3: null,
      midOption: {
        color: ["#5470C6", "#91CC75", "#EE6666"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
          },
          formatter: (params) => {
            let htmlStr = "";
            if (params[0].seriesIndex !== 1) {
              htmlStr = `<div>${params[0].axisValue}</div>`;
              params.forEach((val, idx) => {
                let str = "";
                if (val.data !== 0) {
                  str = `<div style="display:flex;justify-content: space-between"><span style="color: #606266;"><i style="display: inline-block;border-radius: 50%; width: 10px;height: 10px;margin-right: 5px;background-color: ${
                    val.color
                  };"></i>${
                    val.seriesName
                  }</span><span style="margin-left: 10px">${vm.numberToCurrencyNo(
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
        grid: {
          bottom: "20%",
          left: "10%",
          right: "10%",
        },
        dataZoom: [
          {
            show: true,
            maxValueSpan: 7, //显示数据的条数(默认显示10个)
            type: "slider",
            filterMode: "filter",
            // width: 30,
            brushSelect: false, // 不让他框选
            borderColor: "#dcdcdc66",
            showDetail: false,
            // yAxisIndex: 0,
            zoomLock: true,
            throttle: 50,
            // right: 0,
          },
        ],
        xAxis: [
          {
            type: "category",
            axisTick: {
              alignWithLabel: true,
            },
            // axisLabel: {
            //   rotate: 20
            // },
            data: [],
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "类目金额",
            position: "left",
            alignTicks: true,
            axisLine: {
              show: true,
              lineStyle: {
                color: "#5470C6",
              },
            },
            axisLabel: {
              formatter: "{value} 元",
            },
          },
          {
            type: "value",
            name: "总金额",
            position: "right",
            alignTicks: true,
            // offset: 80,
            axisLine: {
              show: true,
              lineStyle: {
                color: "#91CC75",
              },
            },
            axisLabel: {
              formatter: "{value} 元",
            },
          },
        ],
        series: [],
      },
      // midOption: {
      //   backgroundColor: "#fff",
      //   tooltip: {
      //     trigger: "axis",
      //     axisPointer: {
      //       type: "line",
      //       shadowStyle: {
      //         color: "rgba(210,219,238,0.2)",
      //       },
      //     },
      //     textStyle: {
      //       color: "#303133",
      //     },
      //     formatter: (params) => {
      //       let htmlStr = "";
      //       if (params[0].seriesIndex !== 1) {
      //         htmlStr = `<div>${params[0].axisValue}</div>`;
      //         params.forEach((val, idx) => {
      //           let str = "";
      //           if (val.data !== 0) {
      //             str = `<div style="display:flex;justify-content: space-between"><span style="color: #606266;"><i style="display: inline-block;border-radius: 50%; width: 10px;height: 10px;margin-right: 5px;background-color: ${
      //               val.color
      //             };"></i>${
      //               val.seriesName
      //             }</span><span style="margin-left: 10px">${vm.numberToCurrencyNo(
      //               val.data
      //             )}元</span></div>`;
      //           }
      //           htmlStr += str;
      //         });
      //         return htmlStr;
      //       } else {
      //         return "";
      //       }
      //     },
      //   },
      //   dataZoom: [
      //     {
      //       show: true,
      //       maxValueSpan: 5, //显示数据的条数(默认显示10个)
      //       type: "slider",
      //       filterMode: "filter",
      //       width: 30,
      //       brushSelect: false, // 不让他框选
      //       borderColor: "#dcdcdc66",
      //       showDetail: false,
      //       yAxisIndex: [0, 1, 2],
      //       zoomLock: true,
      //       throttle: 50,
      //       right: 0,
      //     },
      //   ],
      //   xAxis: [
      //     {
      //       gridIndex: 0,
      //       show: false,
      //       type: "value",
      //       inverse: true,
      //     },
      //     {
      //       gridIndex: 1,
      //       show: false,
      //     },
      //     {
      //       gridIndex: 2,
      //       show: false,
      //       type: "value",
      //     },
      //   ],
      //   yAxis: [
      //     {
      //       gridIndex: 0,
      //       type: "category",
      //       inverse: true,
      //       // position: "right",
      //       axisLine: {
      //         show: false,
      //       },
      //       axisTick: {
      //         show: false,
      //       },
      //       axisLabel: {
      //         show: false,
      //       },
      //       data: [],
      //     },
      //     {
      //       gridIndex: 1,
      //       type: "category",
      //       inverse: true,
      //       data: [],
      //       axisLine: {
      //         show: false,
      //       },
      //       axisTick: {
      //         show: false,
      //       },
      //       axisLabel: {
      //         show: true,
      //         textStyle: {
      //           color: "#303133",
      //           fontSize: 12,
      //         },
      //       },
      //     },
      //     {
      //       gridIndex: 2,
      //       type: "category",
      //       inverse: true,
      //       data: [],
      //       axisLine: {
      //         show: false,
      //       },
      //       axisTick: {
      //         show: false,
      //       },
      //       axisLabel: {
      //         show: false,
      //       },
      //     },
      //   ],
      //   grid: [
      //     // 左侧数据
      //     {
      //       show: false,
      //       left: "0",
      //       width: "40%",
      //       bottom: 0,
      //       top: "4%",
      //       containLabel: true,
      //     },
      //     // 中间数据
      //     {
      //       show: false,
      //       left: "45%",
      //       width: 0,
      //       bottom: "6%",
      //       top: "4%",
      //       containLabel: true,
      //     },
      //     // 右侧数据
      //     {
      //       show: false,
      //       right: "5%",
      //       width: "40%",
      //       bottom: 0,
      //       top: "4%",
      //       containLabel: true,
      //     },
      //   ],
      //   series: [],
      // },
      barOption: {
        color: ["#F47FAC", "#3E8FF2"],
        tooltip: {
          confine: true,
        },
        dataZoom: [
          {
            show: true,
            maxValueSpan: 5, //显示数据的条数(默认显示10个)
            type: "slider",
            filterMode: "filter",
            width: 30,
            brushSelect: false, // 不让他框选
            borderColor: "#dcdcdc66",
            showDetail: false,
            yAxisIndex: 0,
            zoomLock: true,
            throttle: 50,
            right: 0,
          },
        ],
        legend: {
          icon: "rect",
          orient: "horizontal",
          top: 20,
          itemWidth: 12,
          itemHeight: 12,
          data: ["大盘", "灵狐"],
        },
        grid: {
          left: "30%",
          right: "5%",
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
          inverse: true,
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
            name: "大盘",
            type: "bar",
            stack: "total",
            barMaxWidth: 24,
            label: {
              show: true,
              color: "#303133",
              backgroundColor: '#ececec75',
              borderColor: '#dcdff6',
              borderWidth: 0.5,
              borderType: 'solid',
              padding: [2, 4],
              formatter: function(params) {
                return vm.numberToCurrencyNo(params.data)
              }
            },
            data: [],
            showBackground: true,
            backgroundStyle: {
              color: "#f6f6f6",
            },
          },
          {
            name: "灵狐",
            type: "bar",
            stack: "total",
            barMaxWidth: 24,
            label: {
              show: true,
              color: "#303133",
              backgroundColor: '#ececec75',
              borderColor: '#dcdff6',
              borderWidth: 0.5,
              borderType: 'solid',
              padding: [2, 4],
              formatter: function(params) {
                return vm.numberToCurrencyNo(params.data)
              }
            },
            data: [],
          },
        ],
      },
      lineOption: {
        legend: {
          top: 20,
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
      LineToBarOption: {
        grid: {
          left: "10%",
          right: 0,
          bottom: "13%",
        },
        legend: {
          data: ["共建费", "市场费", "共建费 + 市场费"],
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        xAxis: {
          type: "category",
          axisTick: { show: true },
          data: [],
        },
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "共建费",
            data: [],
            type: "bar",
            emphasis: {
              focus: "series",
            },
            barMaxWidth: 40,
            showBackground: true,
            backgroundStyle: {
              color: "#f6f6f6",
            },
            itemStyle: {
              color: "#F47FAC", //小圆点和线的颜色
            },
          },
          {
            name: "市场费",
            data: [],
            type: "bar",
            barMaxWidth: 40,
            emphasis: {
              focus: "series",
            },
            showBackground: true,
            backgroundStyle: {
              color: "#f6f6f6",
            },
            itemStyle: {
              color: "#3E8FF2", //小圆点和线的颜色
            },
          },
          {
            name: "共建费 + 市场费",
            data: [],
            type: "bar",
            barGap: "20%",
            barMaxWidth: 40,
            itemStyle: {
              color: "#11c41b", //小圆点和线的颜色
            },
            emphasis: {
              focus: "series",
            },
            showBackground: true,
            backgroundStyle: {
              color: "#f6f6f6",
            },
          },
        ],
      },
    };
  },

  mounted() {
    const vm = this;
    // 本月
    let zt = dayjs().format("YYYY-MM");
    // 上个月
    let zt_1 = dayjs().subtract(1, "month").format("YYYY-MM");
    // 3个月之前
    let zt_2 = dayjs().subtract(2, "month").format("YYYY-MM");
    let initDate = [zt_2, zt];
    vm.date1 = [zt_2, zt];
    vm.date2 = [zt_2, zt];
    vm.date3 = [zt_2, zt];
    vm.getBarData(initDate);
    // vm.getMidData();
    vm.getMidData2(initDate);
    vm.getLineData(initDate);
  },
  methods: {
    getBarData(date) {
      const vm = this;
      let obj = {
        start_date: date[0],
        end_date: date[1],
        search_type: vm.radio1,
      };
      dapanLeimu(obj).then((res) => {
        if (res.data.code === 10000) {
          let result = res.data.data;
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
    // getMidData() {
    //   const vm = this;
    //   let obj = {
    //     start_date: vm.date2[0],
    //     end_date: vm.date2[1],
    //     search_type: vm.radio2,
    //   };
    //   dapanJingpin(obj).then((res) => {
    //     if (res.data.code === 10000) {
    //       vm.midOption.yAxis[0].data = [];
    //       vm.midOption.yAxis[1].data = [];
    //       vm.midOption.yAxis[2].data = [];
    //       vm.midOption.series = [
    //         {
    //           name: "总金额",
    //           type: "bar",
    //           yAxisIndex: 0,
    //           xAxisIndex: 0,
    //           barMaxWidth: 28,
    //           label: {
    //             fontWeight: "bold",
    //             show: false,
    //             color: "#303133",
    //           },
    //           itemStyle: {
    //             color: "#3b8eff",
    //             opacity: 1,
    //           },
    //           data: [],
    //           // showBackground: true,
    //           // backgroundStyle: {
    //           //   color: "#f6f6f6",
    //           // },
    //         },
    //         {
    //           name: "类目",
    //           type: "bar",
    //           yAxisIndex: 1,
    //           xAxisIndex: 1,
    //           barMaxWidth: 28,
    //           label: {
    //             normal: {
    //               show: false,
    //             },
    //           },
    //           data: [],
    //         },
    //       ];
    //       let result = res.data.data;
    //       let arr = [];
    //       for (let i in result) {
    //         // debugger
    //         // i: 云逸传媒
    //         vm.midOption.yAxis[0].data.unshift(i);
    //         vm.midOption.yAxis[1].data.unshift(i);
    //         vm.midOption.yAxis[2].data.unshift(i);
    //         let num = 0;
    //         for (let j in result[i]) {
    //           // j: 3C家电零售事业群-电脑数码事业部-POP业务部
    //           num += result[i][j];
    //           if (arr.indexOf(j) === -1) {
    //             arr.push(j);
    //             vm.midOption.series.push({
    //               name: j,
    //               type: "bar",
    //               stack: "总量",
    //               yAxisIndex: 2,
    //               xAxisIndex: 2,
    //               barMaxWidth: 28,
    //               data: [],
    //               showBackground: true,
    //               backgroundStyle: {
    //                 color: "#f6f6f6",
    //               },
    //             });
    //           }
    //         }
    //         vm.midOption.series[0].data.unshift(num);
    //       }
    //       for (let i in result) {
    //         // 印橙科技
    //         vm.midOption.series.forEach((val, idx) => {
    //           if (idx >= 2) {
    //             // ’3C家电零售事业群-家电事业部-小家电POP‘
    //             if (Object.keys(result[i]).indexOf(val.name) !== -1) {
    //               val.data.unshift(result[i][val.name]);
    //             } else {
    //               val.data.unshift(0);
    //             }
    //           }
    //         });
    //       }
    //       // console.log(vm.midOption.series)
    //       vm.handleMid();
    //     }
    //   });
    // },
    getMidData2(date) {
      const vm = this;
      let obj = {
        start_date: date[0],
        end_date: date[1],
        search_type: vm.radio2,
      };
      dapanJingpin(obj).then((res) => {
        if (res.data.code === 10000) {
          vm.midOption.series = [
            {
              name: "总金额",
              type: "line",
              yAxisIndex: 1,
              data: [],
              lineStyle: {
                color: "transparent",
              },
            },
          ];
          vm.midOption.xAxis[0].data = [];

          let result = res.data.data;
          let arr = [];
          result.forEach((val, idx1) => {
            vm.midOption.series[0].data.push(val.total);
            vm.midOption.xAxis[0].data.push(val.item);
            for (let i in val.info) {
              if (arr.indexOf(i) === -1) {
                arr.push(i);
              }
            }
          });
          arr.forEach((val, idx) => {
            vm.midOption.series.push({
              name: val,
              type: "bar",
              stack: "leimu",
              // emphasis: {
              //   focus: "series",
              // },
              barMaxWidth: 40,
              yAxisIndex: 0,
              data: [],
            });
          });
          result.forEach((val, idx) => {
            vm.midOption.series.forEach((val1, idx1) => {
              if (idx1 > 0) {
                if (Object.keys(val.info).indexOf(val1.name) !== -1) {
                  val1.data.push(val.info[val1.name]);
                } else {
                  val1.data.push(0);
                }
              }
            });
          });
          vm.handleMid();
        }
      });
    },
    getLineData(date) {
      const vm = this;
      let obj = {
        start_date: date[0],
        end_date: date[1],
        search_type: vm.radio3,
      };
      let mth_s = dayjs(date[0]).month();
      let lth = dayjs(date[1]).diff(date[0], "month");
      let monthArr = [];
      let midArr = new Array(lth + 1).fill(1);
      midArr.forEach((val, idx) => {
        mth_s += 1;
        monthArr.push(mth_s + "月");
      });
      if (lth === 0) {
        vm.LineToBarOption.xAxis.data = monthArr;
        vm.LineToBarOption.series[0].data = [];
        vm.LineToBarOption.series[1].data = [];
        vm.LineToBarOption.series[2].data = [];
      } else {
        vm.lineOption.xAxis.data = monthArr;
        vm.lineOption.series[0].data = [];
        vm.lineOption.series[1].data = [];
        vm.lineOption.series[2].data = [];
      }
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
            if (lth === 0) {
              vm.LineToBarOption.series[0].data.push(val.count_1 || 0);
              vm.LineToBarOption.series[1].data.push(val.count_2 || 0);
              vm.LineToBarOption.series[2].data.push(val.count_3 || 0);
            } else {
              vm.lineOption.series[0].data.push(val.count_1 || 0);
              vm.lineOption.series[1].data.push(val.count_2 || 0);
              vm.lineOption.series[2].data.push(val.count_3 || 0);
            }
          });
          lth === 0 ? vm.handleLineToBar() : vm.handleLine();
        }
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
    handleLine() {
      const vm = this;
      vm.$nextTick(() => {
        let myChart = vm.$echarts.init(document.getElementById("dapanLineBox"));
        myChart.setOption(vm.lineOption, true);
      });
    },
    handleLineToBar() {
      const vm = this;
      vm.$nextTick(() => {
        let myChart = vm.$echarts.init(document.getElementById("dapanLineBox"));
        myChart.setOption(vm.LineToBarOption, true);
      });
    },
    // 行业类目对比--日期事件
    date1Event(date) {
      this.getBarData(date);
    },
    // 行业类目对比--radio事件
    radio1Event() {
      this.getBarData(this.date1);
    },
    // 竞品项目对比--日期事件
    date2Event(date) {
      this.getMidData2(date);
    },
    // 竞品项目对比--radio事件
    radio2Event() {
      const vm = this;
      this.getMidData2(this.date2);
    },
    // 趋势图--日期事件
    date3Event(date) {
      this.getLineData(date);
    },
    // 趋势图--radio事件
    radio3Event(val) {
      this.LineToBarOption.grid.left = val === "amount" ? "10%" : "4%";
      this.lineOption.grid.left = val === "amount" ? "10%" : "4%";
      this.getLineData(this.date3);
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
