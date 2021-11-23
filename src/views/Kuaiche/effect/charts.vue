<template>
  <div id="effecrChart"></div>
</template>
<script>
export default {
  name: "Charts",
  data() {
    return {
      // ROI提升
      data_up: [
        { value: 400, name: "涨价" },
        { value: 50, name: "降价" },
        { value: 150, name: "未变" },
      ],
      // ROI下降
      data_down: [
        { value: 180, name: "涨价" },
        { value: 10, name: "降价" },
        { value: 10, name: "未变" },
      ],
      // ROI未变
      data_keep: [
        { value: 10, name: "涨价" },
        { value: 30, name: "降价" },
        { value: 60, name: "未变" },
      ],
      //   options: {
      //     series: {
      //       type: "sunburst",
      //       data: data,
      //       radius: [60, "90%"],
      //       itemStyle: {
      //         borderRadius: 7,
      //         borderWidth: 2,
      //       },
      //       label: {
      //         show: false,
      //       },
      //     },
      //   },
      options: {
        title: {
            text: '图表展示',
            top: 20,
            left: 'center',
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          type: "plain",
          show: true,
          orient: "vertival",
          top: 10,
          left: 40,
          data: ["提升", "下降", "保持", "Roi提升-涨价", "Roi提升-降价", "Roi提升-未变", "Roi下降-涨价", "Roi下降-降价", "Roi下降-未变", "Roi保持-涨价", "Roi保持-降价", "Roi保持-未变"],
        },
        series: [
          {
            name: "ROI",
            type: "pie",
            colorBy: "data",
            clockwise: false,
            // selectedMode: "single",
            itemStyle: {
              normal: {
                color: function (colors) {
                  var colorList = ["#5FC82B", "#f56c6c", "#FFC851"];
                  return colorList[colors.dataIndex];
                },
              },
            },
            radius: [0, "30%"],
            label: {
              position: "inner",
              fontSize: 12,
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: 600, name: "提升"},
              { value: 200, name: "下降" },
              { value: 100, name: "保持" },
            ],
            emptyCircleStyle: {
              color: "#e6a23c",
              shadowColor: "rgba(150, 0, 0, 1)",
              shadowBlur: 23,
            },
          },
          {
            name: "价格",
            type: "pie",
            // roseType: 'radius',
            clockwise: false,
            radius: ["34%", "60%"],
            labelLine: {
              length: 30,
            },
            label: {
              formatter: "{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ",
              backgroundColor: "#F6F8FC",
              borderColor: "#8C8D8E",
              borderWidth: 1,
              borderRadius: 4,
              rich: {
                a: {
                  color: "#6E7079",
                  lineHeight: 22,
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
                  fontSize: 14,
                  fontWeight: "bold",
                  lineHeight: 33,
                },
                per: {
                  color: "#fff",
                  backgroundColor: "#4C5058",
                  padding: [3, 4],
                  borderRadius: 4,
                },
              },
            },
            data: [
              {
                value: 400,
                name: "Roi提升-涨价",
                itemStyle: {
                  color: "#80C160",
                },
              },
              {
                value: 50,
                name: "Roi提升-降价",
                itemStyle: {
                  color: "#A6C298",
                },
              },
              {
                value: 150,
                name: "Roi提升-未变",
                itemStyle: {
                  color: "#BAC9B3",
                },
              },
              //   -----
              {
                value: 180,
                name: "Roi下降-涨价",
                itemStyle: {
                  color: "#F89999",
                },
              },
              {
                value: 10,
                name: "Roi下降-降价",
                itemStyle: {
                  color: "#F2B9B9",
                },
              },
              {
                value: 10,
                name: "Roi下降-未变",
                itemStyle: {
                  color: "#F4D4D4",
                },
              },
              //   --
              {
                value: 10,
                name: "Roi保持-涨价",
                itemStyle: {
                  color: "#F7D07E",
                },
              },
              {
                value: 30,
                name: "Roi保持-降价",
                itemStyle: {
                  color: "#F4DDAE",
                },
              },
              {
                value: 60,
                name: "Roi保持-未变",
                itemStyle: {
                  color: "#F2E7CF",
                },
              },
            ],
          },
        ],
      },
    };
  },
  mounted() {
    const vm = this;
    let myChart = vm.$echarts.init(document.getElementById("effecrChart"));
    myChart.setOption(vm.options);
    // myChart.on("click", function (params) {
    //   let opt = myChart.getOption();
    //   switch (params.name) {
    //     case "提升":
    //       opt.series[1].data = vm.data_up;
    //       break;
    //     case "下降":
    //       opt.series[1].data = vm.data_down;
    //       break;
    //     case "保持":
    //       opt.series[1].data = vm.data_keep;
    //       break;
    //   }
    //   myChart.setOption(opt, true);
    // });
  },
  methods: {},
};
</script>

<style scoped>
#effecrChart {
  height: 100%;
}
</style>