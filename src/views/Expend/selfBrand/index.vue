<template>
  <div class="outerDiv">
    <div class="content" >
      <div class="ziyou">
        <div class="ziyou_tab">
          <el-tabs v-model="activeName">
            <el-tab-pane label="看板" name="0"></el-tab-pane>
            <el-tab-pane label="列表" name="1"></el-tab-pane>
          </el-tabs>
        </div>
        <div v-show="activeName==='0'" class="ziyou_chart">
          <h2>年度总消耗</h2>
          <div class="chart">
            <div class="ziyou_chart_topleft">
              <div id="barBox"></div>
              <p>
                <span>今年相较去年同比</span>
                <span
                  :class="varietyPercent > 0 ? 'el-icon-top top' : 'el-icon-bottom bot'"
                  >{{  Math.abs(varietyPercent) * 100}}%</span
                >
              </p>
            </div>
            <div class="ziyou_chart_topright">
              <div id="pieBox"></div>
            </div>
          </div>
          <h2>月度总消耗</h2>
          <div class="chart ts">
            <div id="lineBox"></div>
          </div>
          <div class="selfBrand outerDiv_table content_tableBox">
            <div
              v-for="(table, index) in tableBox"
              :key="index"
              class="tables tables_two"
            >
              <h3 class="iconfont">{{ table.title }}</h3>
              <div class="tableTab">
                <vxe-table
                  ref="table"
                  :data="table.tableData"
                  stripe
                  round
                  border="inner"
                  :column-config="{ resizable: true }"
                  class="mytable-scrollbar"
                  auto-resize
                >
                  >
                  <template #empty>
                    <img src="@/assets/images/noneData3.png" />
                  </template>
                  <vxe-column
                    field="icon"
                    title="排名"
                    width="10%"
                    align="center"
                  >
                    <template #default="{ row }">
                      <svg v-if="row.num === 1" aria-hidden="true">
                        <use xlink:href="#icon-paihang1" />
                      </svg>
                      <svg v-else-if="row.num === 2" aria-hidden="true">
                        <use xlink:href="#icon-paihang2" />
                      </svg>
                      <svg v-else-if="row.num === 3" aria-hidden="true">
                        <use xlink:href="#icon-paihang" />
                      </svg>
                      <span v-else>{{ row.num }}</span>
                    </template>
                  </vxe-column>
                  <vxe-column
                    v-for="(item, idx) in topMenuList"
                    :key="idx"
                    :field="item.prop"
                    :title="item.label"
                  />
                </vxe-table>
              </div>
            </div>
          </div>
        </div>
        <div v-show="activeName==='1'" class="ziyou_list">
          <listPage></listPage>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { selfExpend, selfExpendPie, selfExpendPH } from "@/api/api";
import listPage from "./list.vue";
export default {
  name: "SeleBrand",
  components: {
    listPage,
  },
  data() {
    return {
      activeName: "0",
      tableBox: [
        {
          title: "本年度排行",
          icon: "icon-benniandu",
          tableData: [],
        },
        {
          title: "本月度排行",
          icon: "icon-yuedubaogao",
          tableData: [],
        },
      ],
      varietyPercent: 0,
      topMenuList: [
        {
          prop: "brand",
          label: "品牌",
        },
        {
          prop: "consume",
          label: "总消耗",
        },
      ],
      piedata: null,
      barOption: {
        backgroundColor: "#f4f5f6",
        grid: {
          left: "10%",
          right: "15%",
          bottom: "5%",
          top: "10%",
          containLabel: true,
        },
        xAxis: {
          show: false,
          type: "value",
        },
        yAxis: [
          {
            type: "category",
            inverse: true,
            axisLabel: {
              show: true,
              textStyle: {
                color: "#333",
              },
              fontSize: 14,
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            data: ["今年", "去年"],
          },
          {
            type: "category",
            inverse: true,
            axisTick: "none",
            axisLine: "none",
            show: true,
            axisLabel: {
              textStyle: {
                color: "#333",
                fontSize: "14",
              },
              formatter: function (value) {
                return value + " 元";
              },
            },
            data: [],
          },
        ],
        series: [
          {
            name: "年度总消耗",
            type: "pictorialBar",
            zlevel: 1,
            itemStyle: {
              normal: {
                barBorderRadius: 0,
                color: "#270dd8",
              },
            },
            symbol: "rich", //图形类型，带圆角的矩形
            symbolMargin: "3", //图形垂直间隔
            symbolRepeat: true, //图形是否重复
            symbolSize: [5, 20], //图形元素的尺寸
            barWidth: 50,
            data: [60, 90],
          },
          {
            name: "背景",
            type: "bar",
            barWidth: 30,
            barGap: "-100%",
            data: [100, 100],
            itemStyle: {
              normal: {
                color: "rgba(255,255,255, .8)",
                barBorderRadius: 4,
              },
            },
          },
        ],
      },
      pieOption: {
        backgroundColor: "#f4f5f6",
        legend: {
          show: true,
          top: "center",
          right: "10%",
          data: [],
          itemWidth: 30,
          itemHeight: 15,
          width: 40,
          padding: [0, 5],
          itemGap: 25,
          textStyle: {
            rich: {
              title: {
                fontSize: 12,
                lineHeight: 18,
                color: "rgba(0,0,0,.45)",
              },
              value: {
                fontSize: 14,
                lineHeight: 20,
                color: "rgba(0,0,0,.85)",
              },
            },
          },
        },
        tooltip: {
          show: true,
          trigger: "item",
          formatter: "{a}<br>{b}:{c}({d}%)",
        },
        color: ["#0d6bd0", "#ffc300", "#00e473"],
        grid: {
          top: "2%",
          bottom: "62%",
          left: "43%",
          containLabel: false,
        },
        yAxis: [
          {
            type: "category",
            inverse: true,
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              interval: 0,
              inside: true,
              lineHeight: 12,
              height: 12,
              align: "right",
              verticalAlign: "top",
              color: "#000",
              fontSize: 12,
              show: true,
            },
            data: [],
          },
        ],
        xAxis: [
          {
            show: false,
          },
        ],
        series: [],
      },
      lineOption: {
        backgroundColor: "#f4f5f6",
        legend: {
          top: 20,
          data: ["今年", "去年"],
        },
        grid: {
          left: "8%",
          right: "3%",
        },
        xAxis: {
          type: "category",
          data: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月', '十二月'],
        },
        yAxis: {
          type: "value",
        },
        tooltip: {
          trigger: "axis",
        },
        series: [
          {
            name: "今年",
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
            name: "去年",
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
        ],
      },
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      const vm = this;
      Promise.all([
        selfExpend({
          time_type: "year",
        }),
        selfExpend({
          time_type: "month",
        }),
        selfExpendPie(),
        selfExpendPH({
          time_type: "year",
        }),
        selfExpendPH({
          time_type: "month",
        }),
      ]).then((res) => {
        let bardata = res[0].data.data;
        let linedata = res[1].data.data;
        let respie = res[2].data.data;
        // 柱状图
        vm.barOption.yAxis[1].data = [bardata.now_year, bardata.last_year];
        vm.varietyPercent = bardata.now_proportion
        // 饼图
        vm.piedata = [
          {
            name: "站内返点消耗",
            value: respie.zn_consume,
          },
          {
            name: "站外返点消耗",
            value: respie.zw_fd,
          },
          {
            name: "其他非返点消耗",
            value: respie.zw_nfd,
          },
        ];
        // 折线图
        linedata.forEach((val, idx) => {
          // vm.lineOption.xAxis.data.push(val.month);
          vm.lineOption.series[0].data.push(val.now);
          vm.lineOption.series[1].data.push(val.last);
        });
        // 排行
        let yearPH = res[3].data.data;
        let monthPH = res[4].data.data;
        let arr = [yearPH, monthPH];
        arr.forEach((item, indx) => {
          item.forEach((val, idx) => {
            vm.$set(val, "num", idx + 1);
          });
        });
        vm.tableBox[0].tableData = yearPH.slice(0, 5);
        vm.tableBox[1].tableData = monthPH.slice(0, 5);

        vm.handleBar();
        vm.handlePie();
        vm.handleLine();
      });
    },
    handlePie(val) {
      const vm = this;
      vm.pieOption.legend.data = vm.getArrayValue(vm.piedata, "name");
      let objData = vm.array2obj(vm.piedata, "name");
      vm.pieOption.legend.formatter = function (name) {
        return "{title|" + name + "}\n{value|" + objData[name].value + "元}";
      };
      let optionData = vm.chuliData(vm.piedata);
      vm.pieOption.yAxis[0].data = optionData.yAxis;
      vm.pieOption.series = optionData.series;
      vm.$nextTick(() => {
        let myChart = vm.$echarts.init(document.getElementById("pieBox"));
        myChart.setOption(vm.pieOption, true);
      });
    },
    handleLine() {
      const vm = this;
      vm.$nextTick(() => {
        let myChart = vm.$echarts.init(document.getElementById("lineBox"));
        myChart.setOption(vm.lineOption, true);
      });
    },
    handleBar(val) {
      const vm = this;
      vm.$nextTick(() => {
        let myChart = vm.$echarts.init(document.getElementById("barBox"));
        myChart.setOption(vm.barOption, true);
      });
    },
    getArrayValue(array, key2) {
      let key = key2 || "value";
      let res = [];
      if (array) {
        array.forEach(function (t) {
          res.push(t[key]);
        });
      }
      return res;
    },
    array2obj(array, key) {
      let resObj = {};
      for (let i = 0; i < array.length; i++) {
        resObj[array[i][key]] = array[i];
      }
      return resObj;
    },
    chuliData(dataval) {
      const vm = this;
      let arrValue = vm.getArrayValue(dataval, "value");
      let sumValue = eval(arrValue.join("+"));

      let res = {
        series: [],
        yAxis: [],
      };
      for (let i = 0; i < dataval.length; i++) {
        res.series.push({
          name: "今年",
          type: "pie",
          clockWise: false, //顺时加载
          hoverAnimation: false, //鼠标移入变大
          radius: [85 - i * 25 + "%", 72 - i * 25 + "%"],
          center: ["36%", "50%"],
          label: {
            show: false,
          },
          itemStyle: {
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            borderWidth: 5,
          },
          data: [
            {
              value: dataval[i].value,
              name: dataval[i].name,
            },
            {
              value: sumValue - dataval[i].value,
              name: "",
              itemStyle: {
                color: "rgba(0,0,0,0)",
                borderWidth: 0,
              },
              tooltip: {
                show: false,
              },
              hoverAnimation: false,
            },
          ],
        });
        res.series.push({
          name: "",
          type: "pie",
          silent: true,
          z: 1,
          clockWise: false, //顺时加载
          hoverAnimation: false, //鼠标移入变大
          radius: [85 - i * 25 + "%", 72 - i * 25 + "%"],
          center: ["36%", "50%"],
          label: {
            show: false,
          },
          itemStyle: {
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            borderWidth: 5,
          },
          data: [
            {
              value: 7.5,
              itemStyle: {
                color: "#E3F0FF",
                borderWidth: 0,
              },
              tooltip: {
                show: false,
              },
              hoverAnimation: false,
            },
            {
              value: 2.5,
              name: "",
              itemStyle: {
                color: "rgba(0,0,0,0)",
                borderWidth: 0,
              },
              tooltip: {
                show: false,
              },
              hoverAnimation: false,
            },
          ],
        });
        res.yAxis.push(((dataval[i].value / sumValue) * 100).toFixed(2) + "%");
      }
      return res;
    },
  },
};
</script>
<style scoped lang="less">
@import "index";
@import "@/views/index";
</style>
