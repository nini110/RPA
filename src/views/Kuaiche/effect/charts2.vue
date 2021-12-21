<template>
  <div class="chartsBox">
    <div class="chartsBox_btm" style="height: 100%">
      <div v-if="noData" class="imgInfo">
        <img src="@/assets/images/noneData2.png" alt="" />
        <span>数据可视化展示</span>
      </div>
      <div v-else style="height: 100%">
        <div class="left">
          <table v-if="showResult">
            <tr>
              <th></th>
              <th>系统调价</th>
              <th>人工调价</th>
            </tr>
            <tr v-for="(item, idx) in percentList" :key="idx">
              <td>{{ item.label }}</td>
              <td>{{ item.children[0].value | formatPercent(item.label) }}</td>
              <td>{{ item.children[1].value | formatPercent(item.label) }}</td>
            </tr>
          </table>
          <div ref="effecrChart" class="effecrChartBox" id="effecrChart"></div>
        </div>
        <div class="right">
          <div
            ref="effecrChart2"
            class="effecrChartBox effecrChartBox2"
            id="effecrChart2"
          ></div>
        </div>
      </div>
    </div>
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
      noData: true,
      showResult: false,
      percentList: [
        {
          label: "总数",
          children: [
            {
              label: "系统",
              value: "",
            },
            {
              label: "人工",
              value: "",
            },
          ],
        },
        {
          label: "命中率",
          children: [
            {
              label: "系统",
              value: "",
            },
            {
              label: "人工",
              value: "",
            },
          ],
        },
        {
          label: "有效率",
          children: [
            {
              label: "系统",
              value: "",
            },
            {
              label: "人工",
              value: "",
            },
          ],
        },
        {
          label: "准确率",
          children: [
            {
              label: "系统",
              value: "",
            },
            {
              label: "人工",
              value: "",
            },
          ],
        },
      ],
      showFlag: false,
      tabDisable: true,
      tabList: [
        {
          label: "ROI变化",
          name: "1",
        },
        {
          label: "展现量变化",
          name: "2",
        },
        {
          label: "点击量变化",
          name: "3",
        },
        {
          label: "点击率变化",
          name: "4",
        },
        {
          label: "订单量变化",
          name: "5",
        },
        {
          label: "订单金额变化",
          name: "6",
        },
        {
          label: "转化率变化",
          name: "7",
        },
      ],
      activeName: null,
      innerData: [],
      outerData: [],
      nextArr: [],
      options: {
        // backgroundColor: '#2c343c',
        title: {
          text: "Roi数据图示",
          left: "center",
          bottom: "20px",
        },
        // tooltip: {
        //   trigger: "item",
        //   formatter: "酷酷酷酷酷",
        //   enterable: true,
        // },
        legend: {
          show: true,
          orient: "vertical",
          left: 0,
          top: "middle",
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
            上升: true,
            下降: true,
            不变: false,
            "上升:涨价": true,
            "上升:降价": true,
            "上升:未变": true,
            "下降:涨价": true,
            "下降:降价": true,
            "下降:未变": true,
            "不变:涨价": false,
            "不变:降价": false,
            "不变:未变": false,
          },
        },
        series: [
          {
            name: "ROI",
            type: "pie",
            radius: [0, "28%"],
            label: {
              position: "inner",
              fontSize: 14,
              formatter: "{a} \n{b}: {c}",
            },
            // top: 80,
            left: "10%",
            itemStyle: {
              normal: {
                color: function (colors) {
                  var colorList = ["#f56c6c", "#5FC82B", "#FFC851"];
                  return colorList[colors.dataIndex];
                },
              },
            },
            labelLine: {
              show: false,
            },
            data: [],
          },
          {
            name: "ROI",
            type: "pie",
            radius: ["33%", "50%"],
            labelLine: {
              length: 30,
            },
            left: "10%",
            selectedMode: "single",
            selectedOffset: 20,
            label: {
              fontSize: 14,
              lineHeight: 22,
              padding: 5,
              formatter: "{b}\n数量：{c}\n占比：{per|{d}%}  ",
              backgroundColor: "#F6F8FC",
              borderColor: "#8C8D8E",
              borderWidth: 1,
              borderRadius: 4,
              rich: {
                a: {
                  color: "#6E7079",
                  lineHeight: 18,
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
                  fontSize: 12,
                  fontWeight: "bold",
                  lineHeight: 26,
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
      options2: {
        title: {
          text: "调价具体信息",
          // subtext: 'Fake Data',
          left: "center",
          bottom: "20px",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          top: 30,
          data: ["总数", "仅系统", "仅人工", "系统人工"],
        },
        // 工具栏
        // toolbox: {
        // 	show: false,
        // 	feature: {
        // 		dataView: {
        // 			show: true,
        // 			readOnly: false
        // 		},
        // 		magicType: {
        // 			show: true,
        // 			type: ['line', 'bar']
        // 		},
        // 		restore: {
        // 			show: true
        // 		},
        // 		saveAsImage: {
        // 			show: true
        // 		}
        // 	}
        // },
        calculable: true,
        xAxis: [
          {
            type: "category",
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [],
      },
    };
  },
  watch: {
    showDrawerFlag(newval, oldval) {
      this.showFlag = newval;
    },
    getDataFlag(newval, oldval) {
      if (newval) {
        this.getChartsEvent(this.searchVal, this.activeName);
      }
    },
    activeName(newval, oldval) {
      const vm = this;
      vm.$nextTick(() => {
        let myChart = vm.$echarts.init(document.getElementById("effecrChart"));
        let myChart2 = vm.$echarts.init(
          document.getElementById("effecrChart2")
        );
        switch (newval) {
          case "1":
            vm.options.series[0].data = vm.innerData;
            vm.options.series[1].data = vm.outerData;
            break;
        }
        myChart.setOption(vm.options, true);
        myChart.dispatchAction({
          type: "highlight",
          seriesIndex: 1,
          dataIndex: 0,
        }); //设置默认选中高亮部分
        myChart.on("mouseover", function (params) {
          vm.nextArr.forEach((item, idx) => {
            if (item.name === params.name) {
              vm.options2.xAxis[0].data = [item.name];
              let arr = [
                {
                  name: "总数",
                  data: [item.value.总数],
                },
                {
                  name: "仅系统",
                  data: [item.value.仅系统],
                  itemStyle: {
                    color: "#409eff",
                  },
                },
                {
                  name: "仅人工",
                  data: [item.value.仅人工],
                  itemStyle: {
                    color: "#FFF540",
                  },
                },
                {
                  name: "系统人工",
                  data: [item.value.系统人工],
                  itemStyle: {
                    color: "#FF40A9",
                  },
                },
              ];
              arr.forEach((val, idx) => {
                vm.$set(val, "type", "bar");
                if (val.name === "总数") {
                  vm.$set(val, "markLine", {
                    data: [
                      {
                        type: "average",
                        name: "Avg",
                      },
                    ],
                  });
                  vm.$set(val, "itemStyle", item.itemStyle);
                } else {
                  vm.$set(val, "markPoint", {
                    data: [
                      {
                        type: "max",
                        name: "Max",
                      },
                    ],
                  });
                }
              });
              vm.options2.series = arr;
            }
          });
          myChart2.setOption(vm.options2);
        });
        myChart.on('click', function(params) {
          let roi_type;
          let price_type;
          switch (params.name) {
            case "上升:涨价":
              roi_type = "rise";
              price_type = "rise";
              break;
            case "上升:降价":
              roi_type = "rise";
              price_type = "decline";
              break;
            case "上升:未变":
              roi_type = "rise";
              price_type = "constant";
              break;
            // ------
            case "下降:涨价":
              roi_type = "decline";
              price_type = "rise";
              break;
            case "下降:降价":
              roi_type = "decline";
              price_type = "decline";
              break;
            case "下降:未变":
              roi_type = "decline";
              price_type = "constant";
              break;
            // ====
            case "不变:涨价":
              roi_type = "constant";
              price_type = "rise";
              break;
            case "不变:降价":
              roi_type = "constant";
              price_type = "decline";
              break;
            case "不变:未变":
              roi_type = "constant";
              price_type = "constant";
              break;
          }
          if (
            params.name !== "上升" &&
            params.name !== "下降" &&
            params.name !== "不变"
          ) {
            const { href } = vm.$router.resolve({
              path: "/layout2/kuaiche/effect",
              query: {
                roi_type,
                price_type,
                pin: vm.searchVal.pin,
                stDate: vm.searchVal.search_date[0],
                edDate: vm.searchVal.search_date[1],
              },
            });
            window.open(href, "_blank");
          }
        })
        // 图表2的数据
        let initItem = vm.nextArr[0];
        vm.options2.xAxis[0].data = [initItem.name];
        let initArr = [
          {
            name: "总数",
            data: [initItem.value.总数],
            itemStyle: initItem.itemStyle,
          },
          {
            name: "仅系统",
            data: [initItem.value.仅系统],
            itemStyle: {
              color: "#409eff",
            },
          },
          {
            name: "仅人工",
            data: [initItem.value.仅人工],
            itemStyle: {
              color: "#FFF540",
            },
          },
          {
            name: "系统人工",
            data: [initItem.value.系统人工],
            itemStyle: {
              color: "#FF40A9",
            },
          },
        ];
        initArr.forEach((val, idx) => {
          vm.$set(val, "type", "bar");
          if (val.name === "总数") {
            vm.$set(val, "markLine", {
              data: [
                {
                  type: "average",
                  name: "Avg",
                },
              ],
            });
          } else {
            vm.$set(val, "markPoint", {
              data: [
                {
                  type: "max",
                  name: "Max",
                },
              ],
            });
          }
        });
        vm.options2.series = initArr;
        myChart2.setOption(vm.options2);

        console.log(vm.nextArr);

        let currentOp = [vm.nextArr, vm.nextArr];
        currentOp.forEach((item, idx) => {
          let selectTag2 = idx === 0 ? "系统" : "人工";
          let zongshu = 0;
          item.forEach((sub, idx) => {
            zongshu += sub.value[selectTag2];
          });
          // let zongshu = ()
          let mingzhong =
            (item[0].value[selectTag2] + // 上升涨价
              item[1].value[selectTag2] + // 上升降价
              item[3].value[selectTag2] + // 下降涨价
              item[4].value[selectTag2]) / // 下降降价
            (vm.innerData[0].value + // 上升
              vm.innerData[1].value); // 下降
          let youxiao =
            (item[0].value[selectTag2] + // 上升涨价
              item[1].value[selectTag2] + // 上升降价
              item[3].value[selectTag2] + // 下降涨价
              item[4].value[selectTag2]) / // 下降降价
            (item[0].value[selectTag2] + // 总改价数
              item[1].value[selectTag2] +
              item[2].value[selectTag2] +
              item[3].value[selectTag2] +
              item[4].value[selectTag2] +
              item[5].value[selectTag2] +
              item[6].value[selectTag2] +
              item[7].value[selectTag2] +
              item[8].value[selectTag2]);
          let zhunque =
            (item[0].value[selectTag2] + // 上升涨价
              item[4].value[selectTag2]) / // 下降降价
            (item[0].value[selectTag2] + // 上升涨价
              item[1].value[selectTag2] + // 上升降价
              item[3].value[selectTag2] + // 下降涨价
              item[4].value[selectTag2]); // 下降降价

          // 命中率 0系统   1人工
          vm.$set(vm.percentList[0].children[idx], "value", zongshu);
          vm.$set(vm.percentList[1].children[idx], "value", mingzhong);
          // 有效率
          vm.$set(vm.percentList[2].children[idx], "value", youxiao);
          // 准确率
          vm.$set(vm.percentList[3].children[idx], "value", zhunque);
        });
        vm.showResult = true;
      });
    },
  },
  created() {
    const vm = this;
  },
  methods: {
    // 获取图表数据
    getChartsEvent(val, tag) {
      const vm = this;
      // vm.noData = true;
      vm.activeName = null;
      vm.tabDisable = true;
      vm.activeName = null;
      vm.innerData = [];
      vm.outerData = [];
      vm.nextArr = [];
      effectCharts(val).then((res) => {
        if (res.data.code === 10000) {
          let result = res.data.data.ROI变化数量;
          for (let i in result) {
            let midArr = [];
            // 上升  下降   不变
            midArr = [
              result[i].出价上升数量,
              result[i].出价下降数量,
              result[i].出价不变数量,
            ];
            midArr.forEach((val, idx) => {
              let str;
              switch (idx) {
                case 0:
                  str = "涨价";
                  break;
                case 1:
                  str = "降价";
                  break;
                case 2:
                  str = "未变";
                  break;
              }
              vm.nextArr.push({
                value: val,
                name: i + ":" + str,
              });
            });
            for (let j in result[i]) {
              // 出价上升数量   出价下降数量  出价不变数量  总数
              let midObj = {};
              if (j === "总数") {
                // 获取内层对应的数据
                midObj = {
                  value: result[i][j],
                  name: i,
                };
                vm.innerData.push(midObj);
              }
            }
          }
          vm.nextArr.forEach((item, idx) => {
            vm.$set(
              item.value,
              "系统",
              item.value.系统人工 + item.value.仅系统
            );
            vm.$set(
              item.value,
              "人工",
              item.value.系统人工 + item.value.仅人工
            );

            switch (item.name) {
              case "上升:涨价":
                vm.$set(item, "itemStyle", {
                  color: "#F89999",
                });
                break;
              case "上升:降价":
                vm.$set(item, "itemStyle", {
                  color: "#F2B9B9",
                });
                break;
              case "上升:未变":
                vm.$set(item, "itemStyle", {
                  color: "#F4D4D4",
                });
                break;
              case "下降:涨价":
                vm.$set(item, "itemStyle", {
                  color: "#80C160",
                });
                break;
              case "下降:降价":
                vm.$set(item, "itemStyle", {
                  color: "#A6C298",
                });
                break;
              case "下降:未变":
                vm.$set(item, "itemStyle", {
                  color: "#BAC9B3",
                });
                break;
              case "不变:涨价":
                vm.$set(item, "itemStyle", {
                  color: "#F7D07E",
                });
                break;
              case "不变:降价":
                vm.$set(item, "itemStyle", {
                  color: "#F4DDAE",
                });
                break;
              case "不变:未变":
                vm.$set(item, "itemStyle", {
                  color: "#F2E7CF",
                });
                break;
            }
          });
          vm.nextArr.forEach((item, idx) => {
            vm.outerData.push({
              name: item.name,
              value: item.value.总数,
              itemStyle: item.itemStyle,
            });
          });
          vm.noData = false;
          vm.tabDisable = false;
          vm.activeName = "1";
          console.log("+++", vm.nextArr);
        } else {
          vm.$msg({ type: "warning", msg: "暂无数据" });
        }
        vm.$emit("close");
      });
    },
  },
};
</script>

<style scoped lang="less">
@import "./charts.less";
</style>
