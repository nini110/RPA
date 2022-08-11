<template>
  <div class="outerDiv">
    <div class="content">
      <div class="ziyou">
        <div class="ziyou_tab">
          <el-tabs v-model="activeName">
            <el-tab-pane label="看板" name="0"></el-tab-pane>
            <el-tab-pane label="列表" name="1"></el-tab-pane>
          </el-tabs>
        </div>
        <div v-show="activeName === '0'" class="ziyou_chart">
          <div class="chart ts2">
            <div class="ts2_box">
              <h2>年度总消耗</h2>
              <div class="ziyou_chart_topleft ts">
                <div id="barBox1" class="ts"></div>
                <p>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="tooltipContent"
                    placement="bottom"
                  >
                    <span class="el-icon-warning-outline infotip"
                      >今年相较去年同比</span
                    >
                  </el-tooltip>
                  <span
                    :class="
                      varietyPercent > 0
                        ? 'el-icon-top top'
                        : 'el-icon-bottom bot'
                    "
                    >{{ Math.abs(varietyPercent) }}%</span
                  >
                </p>
              </div>
            </div>
            <div class="ts2_box2">
              <h2>月度总消耗</h2>
              <div class="ziyou_chart_topright ts">
                <div id="lineBox1"></div>
              </div>
            </div>
          </div>
          <div class="selfBrand outerDiv_table content_tableBox">
            <div
              v-for="(table, index) in tableBox"
              :key="index"
              class="tables tables_two"
            >
              <h3 class="iconfont">{{ table.title }}</h3>
              <div class="tableTab tableTab_two">
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
                    <img src="@/assets/images/noneData4.png" />
                    暂无数据
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
                    v-for="(item, idx) in table.topMenuList"
                    :key="idx"
                    :field="item.prop"
                    :title="item.label"
                    show-overflow="tooltip"
                    :min-width="item.width"
                  >
                    <template #default="{ row }">
                      <span v-if="item.prop === 'cost'">{{
                        row[item.prop] | numberToCurrencyNo
                      }}</span>
                      <span v-else>{{ row[item.prop] }}</span>
                    </template>
                  </vxe-column>
                </vxe-table>
              </div>
            </div>
          </div>
        </div>
        <div v-show="activeName === '1'" class="ziyou_list">
          <listPage></listPage>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { bidItemExpend } from "@/api/api";
import listPage from "./list.vue";
export default {
  name: "SeleBrand",
  components: {
    listPage,
  },
  data() {
    const vm = this;
    return {
      tooltipContent: "",
      activeName: "0",
      tableBox: [
        {
          title: "项目月度排行",
          icon: "icon-benniandu",
          tableData: [],
          topMenuList: [
            {
              prop: "biddingName",
              label: "项目",
              width: "30%",
            },
            {
              prop: "category",
              label: "类目",
              width: "30%",
            },
            {
              prop: "cost",
              label: "总消耗",
              width: "10%",
            },
          ],
        },
        {
          title: "类目月度排行",
          icon: "icon-yuedubaogao",
          tableData: [],
          topMenuList: [
            {
              prop: "category",
              label: "类目",
              width: "30%",
            },
            {
              prop: "bidName",
              label: "项目",
              width: "30%",
            },
            {
              prop: "cost",
              label: "总消耗",
              width: "10%",
            },
          ],
        },
      ],
      varietyPercent: 0,
      barOption: {
        // backgroundColor: "#f4f5f6",
        grid: {
          left: "5%",
          right: "5%",
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
                return vm.numberToCurrencyNo(value) + " 元";
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
                color: "#F72B07",
              },
            },
            symbol: "rich", //图形类型，带圆角的矩形
            symbolMargin: "1", //图形垂直间隔
            symbolRepeat: true, //图形是否重复
            symbolSize: [2, 20], //图形元素的尺寸
            barWidth: 30,
            data: [],
          },
          {
            name: "背景",
            type: "bar",
            barWidth: 30,
            barGap: "-100%",
            data: [],
            itemStyle: {
              normal: {
                color: "rgba(240,240,240, .8)",
              },
            },
          },
        ],
      },
      lineOption: {
        // backgroundColor: "#f4f5f6",
        legend: {
          top: 10,
          data: ["今年", "去年"],
        },
        grid: {
          left: "15%",
          right: "3%",
          bottom: "15%",
          top: "18%",
        },
        xAxis: {
          type: "category",
          data: [
            "一月",
            "二月",
            "三月",
            "四月",
            "五月",
            "六月",
            "七月",
            "八月",
            "九月",
            "十月",
            "十一月",
            "十二月",
          ],
        },
        yAxis: {
          type: "value",
        },
        tooltip: {
          trigger: "axis",
          formatter: function (item) {
            let htm;
            if (item[0].value && item[1] && item[1].value) {
              let zhi = Math.abs(
                Math.round(
                  ((item[0].value - item[1].value) / item[1].value) * 10000
                ) / 100
              );
              let txt;
              let iconclass;
              if (item[0].value > item[1].value) {
                iconclass = "red";
                txt = `增长：${zhi}%`;
              } else if (item[0].value === item[1].value) {
              } else {
                iconclass = "green";
                txt = `下降：${zhi}%`;
              }
              htm = `
              <div style="font-size: 12px"><span style="display: inline-block;border-radius: '50%'; width: 10px;height: 10px;margin-right: 5px;background-color: ${
                item[0].color
              };"></span>${item[0].seriesName}：${vm.numberToCurrencyNo(
                item[0].value
              )}</div>
              <div style="font-size: 12px"><span style="display: inline-block;border-radius: '50%'; width: 10px;height: 10px;margin-right: 5px;background-color: ${
                item[1].color
              };"></span>${item[1].seriesName}：${vm.numberToCurrencyNo(
                item[1].value
              )}</div>
              <div style="font-size: 12px; color: ${iconclass}"><span style="display: inline-block;border-radius: '50%'; width: 10px;height: 10px;margin-right: 5px;background-color: ${iconclass};"></span></span>${txt}</div>
            `;
            } else {
              if (item[0] && item[0].value) {
                htm = `
              <div style="font-size: 12px"><span style="display: inline-block;border-radius: '50%'; width: 10px;height: 10px;margin-right: 5px;background-color: ${
                item[0].color
              };"></span>${item[0].seriesName}：${vm.numberToCurrencyNo(
                  item[0].value
                )}</div>
            `;
              } else if (item[0] && item[1].value) {
                htm = `
              <div style="font-size: 12px"><span style="display: inline-block;border-radius: '50%'; width: 10px;height: 10px;margin-right: 5px;background-color: ${
                item[1].color
              };"></span>${item[1].seriesName}：${vm.numberToCurrencyNo(
                  item[1].value
                )}</div>
            `;
              }
            }
            return htm;
          },
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
    const vm = this;
    vm.getData();
  },
  methods: {
    getData() {
      const vm = this;
      bidItemExpend().then((res) => {
        let bardata = res.data.data.cost_by_year;
        let linedata = res.data.data.cost_by_month;
        // 柱状图
        vm.barOption.series[0].data = [bardata.this_year, bardata.last_year];
        vm.barOption.series[1].data =
          bardata.this_year > bardata.last_year
            ? [bardata.this_year, bardata.this_year]
            : [bardata.last_year, bardata.last_year];
        vm.barOption.yAxis[1].data = [bardata.this_year, bardata.last_year];
        // 计算比例
        let currentMonth = new Date().getMonth();
        let totalConsum_now = 0;
        let totalConsum_last = 0;
        for (let i = 0; i < linedata.this_year.length; i++) {
          if (i < currentMonth) {
            totalConsum_now += linedata.this_year[i].cost;
          }
        }
        for (let i = 0; i < linedata.last_year.length; i++) {
          if (i < currentMonth) {
            totalConsum_last += linedata.last_year[i].cost;
          }
        }
        vm.tooltipContent = `比较周期为【1月】 至 【${currentMonth}月】`;
        vm.varietyPercent =
          Math.round(
            ((totalConsum_now - totalConsum_last) / totalConsum_last) * 10000
          ) / 100;

        // 折线图
        linedata.this_year.forEach((val, idx) => {
          vm.lineOption.series[0].data.push(val.cost);
        });
        linedata.last_year.forEach((val, idx) => {
          vm.lineOption.series[1].data.push(val.cost);
        });
        // 排行
        let itemPH = res.data.data.bidding_rank;
        let leimuPH = res.data.data.leimu_rank;
        leimuPH.forEach((val, idx) => {
          let str = ''
          val.biddingName.forEach((val1, idx1) => {
            str += val1
          })
          val.bidName = str.slice(0, str.length - 1)
        })
        let arr = [itemPH, leimuPH];
        arr.forEach((item, indx) => {
          item.forEach((val, idx) => {
            vm.$set(val, "num", idx + 1);
          });
        });
        vm.tableBox[0].tableData = itemPH;
        vm.tableBox[1].tableData = leimuPH;
        vm.handleBar();
        vm.handleLine();
      });
    },
    handleLine() {
      const vm = this;
      vm.$nextTick(() => {
        let myChart = vm.$echarts.init(document.getElementById("lineBox1"));
        myChart.setOption(vm.lineOption, true);
      });
    },
    handleBar(val) {
      const vm = this;
      vm.$nextTick(() => {
        let myChart = vm.$echarts.init(document.getElementById("barBox1"));
        myChart.setOption(vm.barOption, true);
      });
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
@import "index";
@import "../selfBrand/index";
@import "@/views/index";
/deep/.vxe-table {
  &.is--empty {
    .vxe-table--empty-placeholder {
      height: 83% !important;
    }
    .vxe-table--empty-content {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
    }
    .vxe-table--empty-block {
      display: flex;
      justify-content: center;
      align-content: center;
    }
  }
}
</style>
