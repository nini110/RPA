<template>
  <div class="chartsBox">
    <div class="chartsBox_btm" style="height: 100%">
      <div v-if="noData" class="imgInfo">
        <img src="@/assets/images/noneData3.png" alt="" />
        <span>数据可视化展示</span>
      </div>
      <div v-else style="height: 100%">
        <div class="left">
          <table v-if="showResult">
            <tr>
              <th>系统调价</th>
              <th></th>
              <th>人工调价</th>
            </tr>
            <tr v-for="(item, idx) in percentList" :key="idx">
              <td>{{ item.children[0].value | formatPercent(item.label) }}</td>
              <td>{{ item.label }}</td>
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
    const vm = this;
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
      total: 0,
      options: {
        backgroundColor: "#303133",
        legend: [
          {
            bottom: "45",
            left: "center", // 图例距离左侧距离(此处水平居中)
            textStyle: {
              color: "#fff",
            },
            selectedMode: true, //图例点击失效
            data: ["涨价", "降价"],
            selected: {
              涨价: true,
              降价: true,
            },
          },
        ],
        tooltip: {
          // 提示框
          show: true,
          trigger: "axis",
          axisPointer: {
            type: "shadow", // 'line' 直线指示器;'shadow' 阴影指示器.
          },
          enterable: true,
          position: function (point, params, dom, rect, size) {
            return [point[0] - 40, point[1] - 40];
          },
          backgroundColor: "#303133",
          borderColor: "#fff",
          padding: [8, 20],
          textStyle: {
            color: "#fff",
          },
          formatter: function (params) {
            const fullScreenColor = `<span style="display:inline-block;margin-right:8px;border-radius:10px;width:10px;height:10px;background-color:#ef7575;"></span>`; // 全彩屏颜色
            const doubleScreenColor = `<span style="display:inline-block;margin-right:8px;border-radius:10px;width:10px;height:10px;background-color:#6DD400;"></span>`; // 双基色屏颜色
            const fullScreen = params[0]; // 涨价
            const doubleScreen = params[1]; // 降价
            const titleDiv = `
              <span style="display:inline-block;color: #CFDFF1">${fullScreen.name}</span> 
            `;
            let html = `<div style="cursor:pointer" onclick="crtdetailevent('${params[0].axisValue}')">
              ${titleDiv}</br>
              ${fullScreenColor}${fullScreen.seriesName}：${fullScreen.value}</br>
              ${doubleScreenColor}${doubleScreen.seriesName}：${doubleScreen.value}</br>
              </div>`;
            return html;
          },
        },
        grid: [
          {
            // 左边
            show: false,
            left: "2%",
            top: 20,
            bottom: 60,
            containLabel: true,
            width: "42%",
          },
          {
            // 中间
            show: false,
            left: "50%",
            top: 20,
            bottom: 60,
            width: "0",
          },
          {
            // 右边
            show: false,
            right: "2%",
            top: 20,
            bottom: 60,
            containLabel: true,
            width: "42%",
          },
        ],
        // X轴线配置
        xAxis: [
          {
            // 左侧区域
            gridIndex: 0, // x 轴所在的 grid 的索引，默认位于第一个 grid。[ default: 0 ]
            type: "value", // 轴线类型: 数值轴
            position: "top", // 轴线位置(此处位于顶部)
            inverse: true, // 是否是反向坐标轴.[ default: false ]
            axisLine: {
              show: false, // 轴线不显示
            },
            axisTick: {
              show: false, // 轴线刻度不显示
            },
            axisLabel: {
              // 轴线刻度标签
              show: false, // 显示刻度标签
            },
            splitLine: {
              // 垂直于X轴的分隔线
              show: true, // 显示分隔线
              lineStyle: {
                // 分隔线样式
                color: "#4243445b",
                width: 1,
                type: "solid",
              },
            },
          },
          {
            // 中间区域
            gridIndex: 1,
            show: true, // 中间部分不显示X轴
          },
          {
            // 右侧区域
            gridIndex: 2,
            type: "value",
            position: "top",
            inverse: false, // 是否是反向坐标轴.[ default: false ]
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#4243445b",
                width: 1,
                type: "solid",
              },
            },
          },
        ],
        // Y轴线配置
        yAxis: [
          {
            // 左侧区域
            gridIndex: 0, // y 轴所在的 grid 的索引，默认位于第一个 grid。[ default: 0 ]
            type: "category", // 轴线类型: 类目轴
            // 类目轴中 boundaryGap 可以配置为 true 和 false。默认为 true，这时候刻度只是作为分隔线，标签和数据点都会在两个刻度之间的带(band)中间。
            boundaryGap: true, // 坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样。
            inverse: true, // 是否是反向坐标轴.[ default: false ]
            position: "left", // y轴的位置。'left' or 'right'
            axisLine: {
              show: false, // y轴线不显示
            },
            axisTick: {
              show: false, // y轴线刻度不显示
              lineStyle: {
                // 刻度线样式
                color: "#11356D",
              },
            },
            axisLabel: {
              show: false, // 刻度标签不显示
            },
            data: ["系统-ROI上升", "系统-ROI下降", "系统-ROI未变"], // Y轴(这里是类目轴)的类目数据
          },
          {
            gridIndex: 1, // 中间区域
            type: "category",
            inverse: true,
            position: "left", // y轴的位置。'left' or 'right'
            offset: -30,
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: true, // 显示中间部分的Y轴刻度标签(中间的文字)
              textStyle: {
                // 标签样式
                color: "#fff",
                fontSize: 12,
              },
            },
            data: ["ROI上升", "ROI下降", "ROI未变"],
          },
          {
            // 右侧区域
            gridIndex: 2,
            type: "category",
            boundaryGap: true,
            inverse: true,
            position: "left",
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
              lineStyle: {
                // 刻度线样式
                color: "#153D7D",
              },
            },
            axisLabel: {
              show: false,
            },
            data: ["人工-ROI上升", "人工-ROI下降", "人工-ROI未变"],
          },
        ],
        series: [
          {
            name: "涨价", // 系列名称
            type: "bar",
            barWidth: 60, // 柱子宽度
            xAxisIndex: 0, // 对应在X轴的grid索引
            yAxisIndex: 0, // 对应在Y轴的grid索引
            stack: "1", // 相同就是堆叠
            backgroundStyle: {
              color: "rgba(180, 180, 180, 0.05)",
            },
            showBackground: true,
            label: {
              show: true,
              position: "top",
              color: "#F59A3F",
              fontSize: 16,
            },
            data: [], // 系列中的数据内容数组
          },
          {
            name: "降价", // 系列名称
            type: "bar",
            barWidth: 60, // 柱子宽度
            xAxisIndex: 0, // 对应在X轴的grid索引
            yAxisIndex: 0, // 对应在Y轴的grid索引
            stack: "1", // 相同就是堆叠
            backgroundStyle: {
              color: "rgba(180, 180, 180, 0.05)",
            },
            showBackground: true,
            label: {
              show: true,
              position: "top",
              color: "#F2C751",
              fontSize: 16,
            },
            data: [], // 系列中的数据内容数组
          },
          {
            name: "涨价", // 系列名称
            type: "bar",
            barWidth: 60, // 柱子宽度
            xAxisIndex: 2, // 对应在X轴的grid索引
            yAxisIndex: 2, // 对应在Y轴的grid索引
            stack: "2", // 相同就是堆叠
            backgroundStyle: {
              color: "rgba(180, 180, 180, 0.05)",
            },
            showBackground: true,
            label: {
              show: true,
              position: "top",
              color: "#F59A3F",
              fontSize: 16,
            },
            data: [], // 系列中的数据内容数组
          },
          {
            name: "降价", // 系列名称
            type: "bar",
            barWidth: 60, // 柱子宽度
            xAxisIndex: 2, // 对应在X轴的grid索引
            yAxisIndex: 2, // 对应在Y轴的grid索引
            stack: "2", // 相同就是堆叠
            backgroundStyle: {
              color: "rgba(180, 180, 180, 0.05)",
            },
            showBackground: true,
            label: {
              show: true,
              position: "top",
              color: "#F2C751",
              fontSize: 16,
            },
            data: [], // 系列中的数据内容数组
          },
        ],
      },
      rengong: null,
      xitong: null,
      xitongData: {},
      rengongData: {},
      options2: {
        backgroundColor: "#303133",
        legend: {
          orient: "horizontal",
          show: true,
          left: "center",
          bottom: 45,
          icon: "pin",
          itemGap: 30,
          textStyle: {
            color: "#FFFFFF",
            fontSize: 12,
            lineHeight: 20,
          },
        },
        tooltip: {
          show: true,
          backgroundColor: "#303133",
          borderColor: "#fff",
          padding: [8, 20],
          textStyle: {
            color: "#fff",
          },
          formatter: function (params) {
            const fullScreenColor = `<span style="display:inline-block;margin-right:8px;border-radius:10px;width:10px;height:10px;background-color:${params.color.colorStops[1].color};"></span>`; // 全彩屏颜色
            let html = `
              ${fullScreenColor}${params.name}：${params.percent}%</br>
              </div>`;
            return html;
          },
        },
        series: [
          // 最外层圆
          {
            type: "pie",
            radius: ["70%", "50%"],
            center: ["50%", "50%"],
            hoverAnimation: false,
            data: [
              {
                value: 30,
                name: "涨价",
                itemStyle: {
                  color: {
                    colorStops: [],
                  },
                },
              },
              {
                value: 30,
                name: "降价",
                itemStyle: {
                  color: {
                    colorStops: [],
                  },
                },
              },
              {
                value: 40,
                name: "未变",
                itemStyle: {
                  color: {
                    colorStops: [],
                  },
                },
              },
            ],
            label: {
              show: true,
              position: "outside",
              fontSize: 14,
              alignTo: "edge",
              margin: 30,
              formatter: function (params) {
                return `${params.name}:${params.value}`;
              },
              color: "#FFFFFF",
            },
            labelLine: {
              normal: {
                length: 20,
                lineStyle: {
                  width: 1,
                },
              },
            },
          },
          // 内圆 + 中间文字
          {
            type: "pie",
            radius: ["50%", "30%"],
            center: ["50%", "50%"],
            hoverAnimation: false,
            z: 10,
            label: {
              position: "center",
              formatter: function (params) {
                return this.innerTxt;
              },
              rich: {
                total: {
                  fontSize: 24,
                  color: "#FFFFFF",
                },
              },
              color: "#FFFFFF",
              fontSize: 14,
              lineHeight: 30,
            },
            data: [
              {
                value: 30,
                name: "涨价",
                itemStyle: {
                  color: {
                    colorStops: [],
                  },
                  opacity: 0.5,
                },
              },
              {
                value: 30,
                name: "降价",
                itemStyle: {
                  color: {
                    colorStops: [],
                  },
                  opacity: 0.5,
                },
              },
              {
                value: 40,
                name: "未变",
                itemStyle: {
                  color: {
                    colorStops: [],
                  },
                  opacity: 0.5,
                },
              },
            ],
            labelLine: {
              show: false,
            },
          },
        ],
      },
      chartsInnertxt: "",
      colorList: [
        [
          { offset: 0, color: "#ea9999" },
          { offset: 1, color: "#ef7575" },
        ],
        [
          { offset: 0, color: "#44D7B6" },
          { offset: 1, color: "#6DD400" },
        ],
        [
          { offset: 0, color: "#FFA600" },
          { offset: 1, color: "#FEDB65" },
        ],
      ],
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
        // 图例点击事件
        myChart2.on("click", function (params) {
          let roi_type;
          let price_type;
          switch (params.dataIndex) {
            case 0: //涨价
              price_type = "rise";
              break;
            case 1: // 降价
              price_type = "decline";
              break;
            case 2: //未变
              price_type = "constant";
              break;
          }
          if (vm.chartsInnertxt.indexOf('上升') !== -1) {
              roi_type = "rise";
          } else if (vm.chartsInnertxt.indexOf('下降') !== -1) {
              roi_type = "decline";
          } else {
              roi_type = "constant";
          }
          const { href } = vm.$router.resolve({
            path: "/layout/kuaiche/effect",
            query: {
              roi_type,
              price_type,
              pin: vm.searchVal.pin,
              stDate: vm.searchVal.search_date[0],
              edDate: vm.searchVal.search_date[1],
            },
          });
          window.open(href, "_blank");
        });
        vm.options.series.forEach((val, idx) => {
          switch (idx) {
            case 0:
              val.data = vm.xitongData.涨价;
              val.itemStyle = {
                color: { type: "linear", colorStops: vm.colorList[0] },
              };
              break;
            case 1:
              val.data = vm.xitongData.降价;
              val.itemStyle = {
                color: { type: "linear", colorStops: vm.colorList[1] },
              };
              break;
            case 2:
              val.data = vm.rengongData.涨价;
              val.itemStyle = {
                color: { type: "linear", colorStops: vm.colorList[0] },
              };
              break;
            case 3:
              val.data = vm.rengongData.降价;
              val.itemStyle = {
                color: { type: "linear", colorStops: vm.colorList[1] },
              };
              break;
          }
        });
        vm.options2.series.forEach((val, idx) => {
          val.data.forEach((val1, idx1) => {
            switch (idx1) {
              case 0:
                val1.value = vm.xitong.上升.出价上升数量;
                val1.itemStyle.color.colorStops = vm.colorList[0];
                break;
              case 1:
                val1.value = vm.xitong.上升.出价下降数量;
                val1.itemStyle.color.colorStops = vm.colorList[1];
                break;
              case 2:
                val1.value = vm.xitong.上升.出价不变数量;
                val1.itemStyle.color.colorStops = vm.colorList[2];
                break;
            }
          });
        });

        vm.options2.series[1].label.formatter = function () {
          vm.chartsInnertxt = "系统-ROI上升";
          let label = "系统-ROI上升";
          let value = vm.xitong.上升.总数;
          return label + "\n" + "总数:" + value;
        };
        myChart.setOption(vm.options, true);
        myChart2.setOption(vm.options2, true);
        vm.showResult = true;
      });
    },
  },
  created() {
    const vm = this;
    window.crtdetailevent = vm.crtdetailevent;
  },
  methods: {
    // 获取图表数据
    getChartsEvent(val, tag) {
      const vm = this;
      // vm.noData = true;
      vm.tabDisable = true;
      vm.activeName = null;

      effectCharts(val).then((res) => {
        if (res.data.code === 10000) {
          let result = res.data.data;
          vm.xitong = result.系统;
          vm.rengong = result.人工;
          let dataArr = [vm.xitong, vm.rengong];
          dataArr.forEach((val, idx) => {
            let midZJArr = []; // 涨价
            let midJJArr = []; // 降价
            let midBBArr = []; // 不变
            let midZSArr = []; // 总数
            for (let i in val) {
              // i 的顺序是上升下降不变
              for (let j in val[i]) {
                switch (j) {
                  case "出价上升数量":
                    midZJArr.push(val[i][j]);
                    break;
                  case "出价下降数量":
                    midJJArr.push(val[i][j]);
                    break;
                  case "出价不变数量":
                    midBBArr.push(val[i][j]);
                    break;
                  case "总数":
                    midZSArr.push(val[i][j]);
                    break;
                }
              }
            }
            if (idx === 0) {
              vm.xitongData = {
                涨价: midZJArr,
                降价: midJJArr,
                未变: midBBArr,
                总数: midZSArr,
              };
            } else {
              vm.rengongData = {
                涨价: midZJArr,
                降价: midJJArr,
                未变: midBBArr,
                总数: midZSArr,
              };
            }
            let zongshu = val.上升.总数 + val.下降.总数 + val.不变.总数;
            let mingzhong =
              (val.上升.出价上升数量 + // 上升涨价
                val.上升.出价下降数量 + // 上升降价
                val.下降.出价上升数量 + // 下降涨价
                val.下降.出价下降数量) / // 下降降价
              (val.上升.总数 + // 上升
                val.下降.总数); // 下降
            let youxiao =
              (val.上升.出价上升数量 + // 上升涨价
                val.上升.出价下降数量 + // 上升降价
                val.下降.出价上升数量 + // 下降涨价
                val.下降.出价下降数量) / // 下降降价
              (val.上升.总数 + // 总改价数
                val.下降.总数 +
                val.不变.总数);
            let zhunque =
              (val.上升.出价上升数量 + // 上升涨价
                val.下降.出价下降数量) / // 下降降价
              (val.上升.出价上升数量 + // 上升涨价
                val.上升.出价下降数量 + // 上升降价
                val.下降.出价上升数量 + // 下降涨价
                val.下降.出价下降数量); // 下降降价
            // 命中率 0系统   1人工
            vm.$set(vm.percentList[0].children[idx], "value", zongshu);
            vm.$set(vm.percentList[1].children[idx], "value", mingzhong);
            // 有效率
            vm.$set(vm.percentList[2].children[idx], "value", youxiao);
            // 准确率
            vm.$set(vm.percentList[3].children[idx], "value", zhunque);
          });
          // console.log(vm.xitongData);
          // console.log(vm.rengongData);
          // 获取命中率等相关信息

          vm.noData = false;
          vm.tabDisable = false;
          vm.activeName = "1";
        } else {
          vm.$msg({ type: "warning", msg: res.data.msg });
        }
        vm.$emit("close");
      });
    },
    crtdetailevent(parname) {
      // console.log(parname);
      const vm = this;
      vm.chartsInnertxt = parname;
      let myChart2 = vm.$echarts.init(document.getElementById("effecrChart2"));
      let middata;
      switch (parname) {
        case "系统-ROI上升":
          middata = vm.xitong.上升;
          break;
        case "系统-ROI下降":
          middata = vm.xitong.下降;
          break;
        case "系统-ROI未变":
          middata = vm.xitong.不变;
          break;
        case "人工-ROI上升":
          middata = vm.rengong.上升;
          break;
        case "人工-ROI下降":
          middata = vm.rengong.下降;
          break;
        case "人工-ROI未变":
          middata = vm.rengong.不变;
          break;
      }
      vm.options2.series.forEach((val, idx) => {
        val.data.forEach((val1, idx1) => {
          switch (idx1) {
            case 0:
              val1.value = middata.出价上升数量;
              break;
            case 1:
              val1.value = middata.出价下降数量;
              break;
            case 2:
              val1.value = middata.出价不变数量;
              break;
          }
          if (idx === 1) {
            val.label.formatter = function () {
              return parname + "\n" + "总数:" + middata.总数;
            };
          }
        });
      });
      myChart2.setOption(vm.options2, true);
    },
  },
};
</script>

<style scoped lang="less">
@import "./charts.less";
</style>
