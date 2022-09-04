<template>
  <!-- 京准通工具 -->
  <div style="height: 100%">
    <IptComp :toolType="toolType" :excelOptions="excelOptions"></IptComp>
  </div>
</template>

<script>
import IptComp from "@/components/iptTable/index.vue";
export default {
  name: "BeijingMustPass",
  components: {
    IptComp,
  },
  data() {
    return {
      toolType: "0",
      excelOptions: [],
    };
  },
  watch: {
    $route: {
      handler(newval, oldval) {
        const vm = this;
        switch (newval.name) {
          case "DMP":
            this.toolType = "0";
            break;
          case "Booth":
            this.toolType = "9";
            break;
          case "Direct":
            this.toolType = "5";
            break;
          case "People":
            this.toolType = "13";
            break;
          case "Cube":
            this.toolType = "1";
            break;
          case "Mail":
            this.toolType = "4";
            break;
          case "GoShop":
            this.toolType = "14";
            break;
        }
        vm.excelOptions = [
          {
            name: "Cell", //工作表名称
            color: "", //工作表颜色
            index: 0, //工作表索引
            status: 1, //激活状态
            order: 0, //工作表的下标
            hide: 0, //是否隐藏
            row: 36, //行数
            column: 18, //列数
            defaultRowHeight: 40, //自定义行高
            defaultColWidth: 150, //自定义列宽
            celldata: [
              {
                r: 0,
                c: 0,
                v: {
                  ct: { fa: "@", t: "s" },  // 格式类型
                  m: "一级分类", // 显示值
                  v: "一级分类", // 原始值
                },
              },
              {
                r: 0,
                c: 1,
                v: {
                  ct: { fa: "@", t: "s" },
                  m: "二级分类",
                  v: "二级分类",
                },
              },
              {
                r: 0,
                c: 2,
                v: {
                  ct: { fa: "@", t: "s" },
                  m: "三级分类",
                  v: "三级分类",
                },
              },
              {
                r: 0,
                c: 3,
                v: {
                  ct: { fa: "@", t: "s" },
                  m: "标签名称",
                  v: "标签名称",
                },
              },
              {
                r: 0,
                c: 4,
                v: {
                  ct: { fa: "@", t: "s" },
                  m: "分类级别",
                  v: "分类级别",
                },
              },
              {
                r: 0,
                c: 5,
                v: {
                  ct: { fa: "@", t: "s" },
                  m: "sku",
                  v: "sku",
                },
              },
              {
                r: 0,
                c: 6,
                v: {
                  ct: { fa: "@", t: "s" },
                  m: "人群包名称",
                  v: "人群包名称",
                },
              },
            ], //初始化使用的单元格数据
            config: {
              merge: {}, //合并单元格
              rowlen: {}, //表格行高
              columnlen: {}, //表格列宽
              rowhidden: {}, //隐藏行
              colhidden: {}, //隐藏列
              borderInfo: {}, //边框
              authority: {}, //工作表保护
            },
            scrollLeft: 0, //左右滚动条位置
            scrollTop: 0, //上下滚动条位置
            luckysheet_select_save: [], //选中的区域
            calcChain: [], //公式链
            isPivotTable: false, //是否数据透视表
            pivotTable: {}, //数据透视表设置
            filter_select: {}, //筛选范围
            filter: null, //筛选配置
            luckysheet_alternateformat_save: [], //交替颜色
            luckysheet_alternateformat_save_modelCustom: [], //自定义交替颜色
            luckysheet_conditionformat_save: {}, //条件格式
            frozen: {}, //冻结行列配置
            chart: [], //图表配置
            zoomRatio: 1, // 缩放比例
            image: [], //图片
            showGridLines: 1, //是否显示网格线
            dataVerification: {}, //数据验证配置
          },
        ];
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {},
  created() {},
};
</script>

<style lang="less" scoped>
</style>
