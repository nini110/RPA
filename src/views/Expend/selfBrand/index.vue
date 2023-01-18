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
            <el-alert
              :description="description"
              type="warning"
              show-icon
              :closable="false"
            >
            </el-alert>
            <!-- <div class="chartOuter"> -->
            <h2>年度总消耗</h2>
            <div class="chart">
              <div class="ziyou_chart_topleft">
                <div id="barBox"></div>
              </div>
              <div class="ziyou_chart_topright">
                <div id="pieBox"></div>
              </div>
            </div>
            <!-- </div> -->
            <!-- <div class="chartOuter"> -->
            <h2>月度总消耗</h2>
            <div class="chart ts">
              <div id="lineBox"></div>
            </div>
            <!-- </div> -->

            <div class="selfBrand outerDiv_table content_tableBox">
              <div
                v-for="(table, index) in tableBox"
                :key="index"
                class="tables tables_two"
              >
                <h3 class="iconfont">{{ table.title }}</h3>
                <div class="tableTab_two">
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
                      v-for="(item, idx) in topMenuList"
                      :key="idx"
                      :field="item.prop"
                      :title="item.label"
                      show-overflow="tooltip"
                      min-width="14%"
                    >
                      <template #default="{ row }">
                        <span v-if="item.prop === 'consume'">{{
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
          <div v-show="activeName === '1'" class="ziyou_list ts">
            <div>
              <el-alert
                :description="description"
                type="warning"
                show-icon
                :closable="false"
              >
              </el-alert>
            </div>
            <listPage></listPage>
          </div>
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
    const vm = this;
    return {
      description: "",
      activeName: "0",
      tableBox: [
        {
          title: "本年度品牌排行",
          icon: "icon-benniandu",
          tableData: [],
        },
        {
          title: "本月度品牌排行",
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
      barOption2: {
        grid: {
          left: "15%",
          top: "30%",
          right: "20%",
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
            data: [],
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
                // color: "#303133",
                color: function (value, index) {
                  return value > 0 ? "#ff7777" : "#387d2c";
                },
                fontWeight: "bold",
                padding: [6, 10, 6, 10],
                backgroundColor: "#f5f5f5",
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
            symbolSize: ["30%", "250%"], //图形元素的尺寸
            data: [],
          },
          {
            name: "去年",
            type: "pictorialBar",
            barGap: "250%",
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
            symbolSize: ["30%", "250%"], //图形元素的尺寸
            data: [],
          },
        ],
        barCategoryGap: "60%",
      },
      pieOption: {
        // backgroundColor: "#f4f5f6",
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
          show: false,
          trigger: "item",
          formatter: "{a}<br>{b}:{c}({d}%)",
        },
        color: ["#0d6bd0", "#ffc300", "#00e473"],
        grid: {
          top: "6%",
          bottom: "57%",
          left: "44%",
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
        // backgroundColor: "#f4f5f6",
        legend: {
          top: 20,
          data: ["今年", "去年"],
        },
        grid: {
          left: "8%",
          right: "3%",
          bottom: "13%",
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
            if (item[0].value) {
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
              htm = `
              <div style="font-size: 12px"><span style="display: inline-block;border-radius: '50%'; width: 10px;height: 10px;margin-right: 5px;background-color: ${
                item[1].color
              };"></span>${item[1].seriesName}：${vm.numberToCurrencyNo(
                item[1].value
              )}</div>
            `;
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
          this.description =
            "1. 当前消耗数据均为现金消耗\xa0\xa0\xa0\xa0\xa0\xa0\xa02. 数据统计时间截至为当前日期-1\xa0\xa0\xa0\xa0\xa0\xa03. 代理数据自动刷新时间为每天14点，子账号明细数据自动刷新时间为每周二2点";
        } else {
          this.description =
            "1. 当前消耗数据均为现金消耗\xa0\xa0\xa0\xa0\xa0\xa0\xa02. 看板统计时间截至为当前日期-1";
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
        // 柱状图 全年
        // let mth = new Date().getMonth();
        // vm.barOption2.yAxis.data = ["全年", `至${mth}月份`];

        let currentMonth = new Date().getMonth();
        let totalConsum_now = 0;
        let totalConsum_last = 0;
        if (currentMonth === 0) {
          vm.barOption2.yAxis[0].data = ["全年"];
          // 柱状图 今年  全年-到当前月
          vm.barOption2.series[0].data = [bardata.now_year];
          // 柱状图 去年  全年-到当前月
          vm.barOption2.series[1].data = [bardata.last_year];
          // vm.barOption2.yAxis[1].data = [""]; 
        } else {
          vm.barOption2.yAxis[0].data = ["全年", "到当前月"];
          // 柱状图 今年  全年-到当前月
          vm.barOption2.series[0].data = [
            bardata.now_year,
            bardata.now_year_tq,
          ];
          // 柱状图 去年  全年-到当前月
          vm.barOption2.series[1].data = [
            bardata.last_year,
            bardata.last_year_tq,
          ];
          for (let i = 0; i < linedata.length; i++) {
            if (i < currentMonth) {
              totalConsum_now += linedata[i].now;
              totalConsum_last += linedata[i].last;
            }
          }
          vm.varietyPercent =
            Math.round(
              ((totalConsum_now - totalConsum_last) / totalConsum_last) * 10000
            ) / 100;
          vm.barOption2.yAxis[1].data = [vm.varietyPercent, ""]; 
        }

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
        return (
          "{title|" +
          name +
          "(今年)" +
          "}\n{value|" +
          vm.numberToCurrencyNo(objData[name].value) +
          "元}"
        );
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
        myChart.setOption(vm.barOption2, true);
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
          hoverAnimation: true, //鼠标移入变大
          radius: [65 - i * 25 + "%", 75 - i * 25 + "%"],
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
          hoverAnimation: true, //鼠标移入变大
          radius: [65 - i * 25 + "%", 75 - i * 25 + "%"],
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
.chartOuter {
  margin: 0 0 40px 20px;
  padding: 30px;
  background-color: #fff;
  box-shadow: 0px 0px 30px rgb(240, 240, 240);
}
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
