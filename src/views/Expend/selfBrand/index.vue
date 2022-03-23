<template>
  <div class="outerDiv">
    <div class="slideTip">
      <svg class="titleicon" aria-hidden="true">
        <use xlink:href="#icon-gunlunjian" />
      </svg>滚
      <br />动
      <br />查
      <br />看
      <br />更
      <br />多
      <br />内
      <br />容
    </div>
    <full-page ref="fullpage" :options="options" id="fullpage">
      <div class="section">
        <div class="selfBrand outerDiv_charts">
          <div class="top">
            <div class="top_txt">灵鲨自有客户消耗看板</div>
            <div id="pieBox"></div>
            <div id="barBox"></div>
          </div>
        </div>
        <div class="selfBrand outerDiv_table content_tableBox">
          <div v-for="(table, index) in tableBox" :key="index" class="tables tables_two">
            <h3 class="iconfont" :class="table.icon">{{ table.title }}</h3>
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
                <vxe-column field="icon" title="排名" width="10%" align="center">
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
      <div class="section">
        <listPage></listPage>
      </div>
    </full-page>
  </div>
</template>
<script>
import { selfExpend, selfExpendPH } from "@/api/api";
import listPage from "./list.vue";
export default {
  name: "SeleBrand",
  components: {
    listPage,
  },
  data() {
    const vm = this
    return {
      options: {
        licenseKey: "OPEN-SOURCE-GPLV3-LICENSE",
        scrollBar: false,
        normalScrollElements: ".normalScroll",
      },
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
      piedata: {},
      pieOption: {
        title: {
          text: "年度总消耗",
          left: "center",
          top: 30,
          textStyle: {
            color: "#606266",
          },
        },
        tooltip: {
          trigger: "item",
          backgroundColor: "#303133",
          borderColor: "#909399",
          textStyle: {
            color: "#fff",
          },
          formatter: function (params) {
            console.log(params);
            let percent = (params.name === "今年" ? (vm.piedata.now_proportion) : vm.piedata.last_proportion) * 100
            let target = Math.abs(percent) + '%'
            let txt = percent > 0 ? '上升' : '下降'
            let str = `
              <div><span style="color: ${params.color}">${params.name}：</span>${params.value}</div>
              <div style="color: gold"><span >同比${txt}：${target}</div>
            `
            return str
          }
        },
        legend: {
          orient: "horizontal",
          left: "center",
          bottom: 20,
        },
        series: [
          {
            name: "年总消耗",
            type: "pie",
            radius: "50%",
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
            tooltip: {
              trigger: "item",
              backgroundColor: "#303133",
              borderColor: "#909399",
              textStyle: {
                color: "#fff",
              },
            },
          },
        ],
      },
      barOption: {
        title: {
          text: "月度总消耗",
          left: "center",
          top: 30,
          textStyle: {
            color: "#606266",
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          backgroundColor: "#303133",
          borderColor: "#909399",
          textStyle: {
            color: "#fff",
          },
          formatter: function (params) {
            console.log(params);
            let bili;
            let percent;
            let txt;
            if (params[0].value === 0) {
              txt = '';
              percent = ''
            } else {
              txt = params[0].value > params[1].value ? '上升：' : '下降：'
              bili = (params[0].value - params[1].value) / params[1].value
              percent = Math.abs(Math.floor(bili * 100)) + '%'
            }
            let str = `
              <div><span style="color: ${params[0].color}">${params[0].seriesName}：</span>${params[0].value}</div>
              <div><span style="color: ${params[1].color}">${params[1].seriesName}：</span>${params[1].value}</div>
              <div style="color: gold"><span >${txt}${percent}</div>
            `
            return str
          }
        },
        legend: {
          orient: "horizontal",
          left: "center",
          bottom: 20,
        },
        grid: {
          top: 80,
          bottom: 100,
        },
        xAxis: { type: "category", data: [] },
        yAxis: {},
        series: [
          {
            type: "bar",
            name: "今年",
            data: [],
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgba(109,212,0,1)",
                  },
                  {
                    offset: 1,
                    color: "rgba(104,208,185, .3)",
                  },
                ]),
                barBorderRadius: [8, 8, 0, 0], //圆角大小
                shadowColor: "rgba(68,215,182,1)",
                shadowBlur: 2,
              },
            },
          },
          {
            type: "bar",
            name: "去年",
            data: [],
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgba(234,153,153,1)",
                  },
                  {
                    offset: 1,
                    color: "rgba(239,117,117,.3)",
                  },
                ]),
                barBorderRadius: [8, 8, 0, 0], //圆角大小
                shadowColor: "rgba(239,117,117,1)",
                shadowBlur: 2,
              },
            },
          },
        ],
      },
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
        selfExpendPH({
          time_type: "year",
        }),
        selfExpendPH({
          time_type: "month",
        }),
      ]).then((res) => {
        let piedata = res[0].data.data;
        let bardata = res[1].data.data;
        let yearPH = res[2].data.data;
        let monthPH = res[3].data.data;
        let arr = [yearPH, monthPH];
        arr.forEach((item, indx) => {
          item.forEach((val, idx) => {
            vm.$set(val, "num", idx + 1);
          });
        });
        vm.tableBox[0].tableData = yearPH.slice(0, 5);
        vm.tableBox[1].tableData = monthPH.slice(0, 5);
        vm.handlePie(piedata);
        vm.handleBar(bardata);
      });
    },
    handlePie(val) {
      const vm = this;
      vm.pieOption.series[0].data = [
        {
          name: "今年",
          value: val['now_year'],
          itemStyle: {
            color: {
              colorStops: vm.colorList[1],
            },
          },
        },
        {
          name: "去年",
          value: val['last_year'],
          itemStyle: {
            color: {
              colorStops: vm.colorList[0],
            },
          },
        }
      ]
      vm.piedata = {
        now_proportion: val.now_proportion,
        last_proportion: val.last_proportion
      }
      vm.$nextTick(() => {
        let myChart = vm.$echarts.init(document.getElementById("pieBox"));
        myChart.setOption(vm.pieOption, true);
      });
    },
    handleBar(val) {
      const vm = this;
      vm.barOption.xAxis.data = [];
      vm.barOption.series[0].data = [];
      vm.barOption.series[0].data = [];
      val.forEach((item, idx) => {
        vm.barOption.xAxis.data.push(item.month);
        vm.barOption.series[0].data.push(item.now || 0);
        vm.barOption.series[1].data.push(item.last);
      });
      vm.$nextTick(() => {
        let myChart = vm.$echarts.init(document.getElementById("barBox"));
        myChart.setOption(vm.barOption, true);
      });
    },
  },
};
</script>
<style scoped lang="less">
@import "index";
@import "@/views/index";
</style>
