<template>
  <div class="outerDiv publicDiv">
    <div class="content">
      <div class="itemsComp">
        <div class="tabs">
          <el-tabs v-model="activeName">
            <el-tab-pane label="看板" name="0"></el-tab-pane>
            <el-tab-pane label="列表" name="1"></el-tab-pane>
            <el-tab-pane label="市场费" name="2"></el-tab-pane>
          </el-tabs>
          <div v-show="activeName === '0'" class="ziyou_chart">
            <el-alert
              :description="description"
              type="warning"
              show-icon
              :closable="false"
            >
            </el-alert>
            <div class="chart ts2">
              <div class="ts2_box">
                <h2>年度总消耗</h2>
                <div class="ziyou_chart_topleft ts">
                  <div id="barBox1" class="ts"></div>
                  <p>
                    <span class="infotip"
                      >今年相较去年{{ tooltipContent }}同比</span
                    >
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
                      <span>暂无数据</span>
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
          <div v-show="activeName === '1'" class="tabs_cnt">
            <listPage></listPage>
          </div>
          <div v-show="activeName === '2'" class="tabs_cnt">
            <MarketPage></MarketPage>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { bidItemExpend } from "@/api/api";
import listPage from "./list.vue";
import MarketPage from "./market.vue";
export default {
  name: "SeleBrand",
  components: {
    listPage,
    MarketPage,
  },
  data() {
    const vm = this;
    return {
      description: "",
      tooltipContent: "",
      activeName: "0",
      tableBox: [
        {
          title: "本月度项目排行",
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
          title: "本月度类目排行",
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
      barOption2: {
        // backgroundColor: '#a18dff',
        grid: {
          left: "20%",
          top: "30%",
          right: "5%",
          bottom: "10%",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          formatter: function (item) {
            let htm;
            let zhi;
            if (item.length > 1) {
              zhi = Math.abs(
                Math.round(
                  ((item[0].data - item[1].data) / item[1].data) * 10000
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
                item[0].data
              )}</div>
              <div style="font-size: 12px"><span style="display: inline-block;border-radius: '50%'; width: 10px;height: 10px;margin-right: 5px;background-color: ${
                item[1].color
              };"></span>${item[1].seriesName}：${vm.numberToCurrencyNo(
                item[1].data
              )}</div>
              <div style="font-size: 12px; color: ${iconclass}"><span style="display: inline-block;border-radius: '50%'; width: 10px;height: 10px;margin-right: 5px;background-color: ${iconclass};"></span></span>${txt}</div>
            `;
            } else {
              htm = `
              <div style="font-size: 12px"><span style="display: inline-block;border-radius: '50%'; width: 10px;height: 10px;margin-right: 5px;background-color: ${
                item[0].color
              };"></span>${item[0].seriesName}：${vm.numberToCurrencyNo(
                item[0].data
              )}</div>
            `;
            }

            return htm;
          },
        },
        legend: {
          data: ["今年", "去年"],
          left: "center",
          top: 20,
          textStyle: {
            //文字样式
            color: "#606266",
            fontSize: "12",
          },
        },
        xAxis: {
          type: "value",
          show: false,
        },
        yAxis: {
          type: "category",
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          data: ["全年", "到当前月"],
          axisLabel: {
            textStyle: {
              color: "#606266",
              // fontSize: 12,
            },
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: "rgba(98, 162, 205, 0.2)",
            },
          },
        },
        series: [
          {
            name: "今年",
            type: "pictorialBar",
            itemStyle: {
              normal: {
                barBorderRadius: 0,
                color: "#F47FAC",
              },
            },
            symbol: "rich", //图形类型，带圆角的矩形
            symbolMargin: "1", //图形垂直间隔
            symbolRepeat: true, //图形是否重复
            symbolSize: ["25%", "200%"], //图形元素的尺寸
            data: [],
          },
          {
            name: "去年",
            type: "pictorialBar",
            barGap: "150%",
            itemStyle: {
              normal: {
                barBorderRadius: 0,
                color: "#3E8FF2",
              },
            },
            symbol: "rich", //图形类型，带圆角的矩形
            symbolMargin: "1", //图形垂直间隔
            symbolRepeat: true, //图形是否重复
            // symbolSize: [2, 13], //图形元素的尺寸
            symbolSize: ["25%", "200%"], //图形元素的尺寸
            data: [],
          },
        ],
        barCategoryGap: "60%",
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
  watch: {
    activeName: {
      handler(newval, oldval) {
        if (newval === "1") {
          this.description = "";
        } else {
          this.description =
            "数据自动更新时间为每天10点，统计日期上限为当前日期-1";
        }
      },
      immediate: true,
    },
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
        // 柱状图 全年
        let mth = new Date().getMonth();
        let total_this = 0;
        let total_last = 0;
        for (let i in linedata.this_year) {
          if (parseInt(i) < mth) {
            total_this += linedata.this_year[i].cost;
          }
        }
        for (let i in linedata.last_year) {
          if (parseInt(i) < mth) {
            total_last += linedata.last_year[i].cost;
          }
        }

        vm.barOption2.yAxis.data = ["全年", `至${mth}月份`];
        // 柱状图 今年
        vm.barOption2.series[0].data = [bardata.this_year, total_this];
        // 柱状图 去年
        vm.barOption2.series[1].data = [bardata.last_year, total_last];
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
        vm.tooltipContent = `（1月至${currentMonth}月区间）`;
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
          let str = "";
          val.biddingName.forEach((val1, idx1) => {
            str += val1;
          });
          val.bidName = str.slice(0, str.length);
        });
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
        myChart.setOption(vm.barOption2, true);
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
@import "../selfBrand/index.less";
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
