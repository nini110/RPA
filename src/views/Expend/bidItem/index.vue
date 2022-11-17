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
        // backgroundColor: new this.$echarts.graphic.LinearGradient(1, 0, 0, 1, [
        //   {
        //     offset: 0,
        //     color: "#000",
        //   },
        //   {
        //     offset: 1,
        //     color: "#909399",
        //   },
        // ]),
        grid: {
          left: "15%",
          top: "30%",
          right: "22%",
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
          top: 30,
          textStyle: {
            //文字样式
            color: "#303133",
            fontSize: "12",
          },
        },
        xAxis: {
          type: "value",
          show: false,
        },
        yAxis: [
          {
            type: "category",
            splitLine: {
              show: true,
            },
            axisTick: {
              show: false,
            },
            data: ["全年", "到当前月"],
            axisLabel: {
              textStyle: {
                color: "#303133",
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
          {
            type: "category",
            inverse: true,
            offset: 0,
            axisTick: "none",
            axisLine: "none",
            show: true,
            axisLabel: {
              textStyle: {
                color: function(value, index) {
                  return value > 0 ? "#ff7777" : '#387d2c'
                },
                fontWeight: 'bold',
                padding: [6, 10, 6, 10],
                backgroundColor: '#f5f5f5',
                fontSize: "12",
              },
              formatter: (param) => {
                let index;
                if (param) {
                  index = param > 0 ? 1 : 2;
                  return `{img${index}|}{value|${param}%}`;
                } else {
                  return "";
                }
              },
              rich: {
                // 上升
                img1: {
                  height: 25,
                  backgroundColor: {
                    image:
                      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAexJREFUWEftlj9IG1Ecx7+/y1FBxcEjCQqC3t3kYGkuIDqIDh2cGhBxEsFFcNDN1XZ0KJRCl0JBnKRDN1F00EWKmD9QsVC400GJ3AMXB8Wo+ZVCFAm55L0LNIO59b6/7/fzvu8e7wgNfqjefLbtFnLd27A+dQEIxzoFYBDzx2j25EMYiNAApfDex1BmnohnT36oQoQCEI75HaDJ52EE5ItcHI9nT3+pQCgD+I75hUDzlUKIcQjWU9Hcn7wshBKASJqzYPpWzZzB24VXhVTPz/MbGQhpAP9N32to2g4BUQnjtVjGm5HQQQpA9Pe3o7WwAeYRGdOSZjGW8T7X0ssBONYqAKkVPQu80QlvO9PefjWImgB+wnxPRMu1VhLwPhfR8M449M6C5qsCiIQ1BcJ6yPDSGO3c4zrVnclfVzw5QeZ+om9AI22Tge76AAAmfI2nvTklAOFYuwBG6w1/nI/o1GMcuOflfoFbIBx7ksCfQjawVxZ0FMt4C0oNVBJfJO3RCPMWgJagZh6IxrrSbjlAYJE1T0H5pHAsD4DZSICq38b/aKAJ0Gyg2UCzgRfegJ+wVoiw1LC7wE/a08S8FnC1Hms6DRsH7pXsf4TybXg5aHfc32EI4AGA256CSBN6EXtGzv0tG/5PpwygYi6j/QuNY80hJ6JoYwAAAABJRU5ErkJggg==",
                  },
                },
                // 下降
                img2: {
                  height: 25,
                  backgroundColor: {
                    image:
                      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAetJREFUWEftlTFo1GAUx/8vtLVFWkdHLRaUJgfCgZe2OLSgFAqCooKbLi7ieg4mdxe+tNCOIoKTjqUFETt0EKHQwS/oIDSpS4dOdq443ND7nuTKLcddLl/uzjpc1rz3//++f973Qjjjh3T954pXx0/ODS0R07Xm3mFVe7u78vNIR1MbwHat7wDyrU34vRTRk34DcHsDPpQimjxDAECKUCtVreL4ZLZrJSQwABgkMEhgkMB/kMCo8Wdsxzuspl3HWpuwUJ6aIDV6nCTOBpuBF+33BcB2px8DxrtkcVqTYu9F1wAFx9wgogdphRLrGBXph16rmrafwHatAwBXegHAzJuBHz3UApgpWXeZ8aEnAOBHgYjWtQBOf725VYCL3UAQ6PlXsfe6nUbiLcg/zQ+PXKx+YdDNTBAMT/phJam34zWcLU9fV8r4COCSJsSWFOGdTj0dAWKBG465YBDFEOOdBE/f0y821K00+yAVQCxZcMz7RLSZBoAThq65PzVAfShLlg/Gy8RNCH4WiOhNGtB6VmkLG3W2m9sGeLFlH8ORfriso6kNMOPmcgz1CaDLTUafpQhv65hnSiBumnXMBUW0DWCkYchG9ULgHfz+JwD1eXCseyC8YuC8qqn5byv7P3TNMyeQxSjTJuylUTutv8R3siHwOq4+AAAAAElFTkSuQmCC",
                  },
                },
              },
            },
            data: [],
          },
        ],
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
            symbolMargin: "0.5", //图形垂直间隔
            symbolRepeat: true, //图形是否重复
            symbolSize: ["20%", "220%"], //图形元素的尺寸
            data: [],
          },
          {
            name: "去年",
            type: "pictorialBar",
            barGap: "220%",
            itemStyle: {
              normal: {
                barBorderRadius: 0,
                color: "#3E8FF2",
              },
            },
            symbol: "rich", //图形类型，带圆角的矩形
            symbolMargin: "0.5", //图形垂直间隔
            symbolRepeat: true, //图形是否重复
            // symbolSize: [2, 13], //图形元素的尺寸
            symbolSize: ["20%", "220%"], //图形元素的尺寸
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
          left: "20%",
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
        vm.varietyPercent =
          Math.round(
            ((totalConsum_now - totalConsum_last) / totalConsum_last) * 10000
          ) / 100;
          vm.barOption2.yAxis[1].data = [vm.varietyPercent, ""];

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
