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
            name: "创建人群", //工作表名称
            color: "", //工作表颜色
            index: "renqun", //工作表索引
            status: 1, //激活状态
            hide: 0, //是否隐藏
            row: 1000, //行数
            column: 15, //列数
            defaultRowHeight: 40, //自定义行高
            defaultColWidth: 150, //自定义列宽
            celldata: [
              {
                r: 0,
                c: 0,
                v: {
                  ct: { fa: "@", t: "s" }, // 格式类型
                  m: "一级分类", // 显示值
                  v: "一级分类", // 原始值
                  bl: 1,
                  tb: 2,
                  vt: 0,
                  ht: 0,
                },
              },
              {
                r: 0,
                c: 1,
                v: {
                  ct: { fa: "@", t: "s" },
                  m: "二级分类",
                  v: "二级分类",
                  bl: 1,
                  vt: 0,
                  ht: 0,
                },
              },
              {
                r: 0,
                c: 2,
                v: {
                  ct: { fa: "@", t: "s" },
                  m: "三级分类",
                  v: "三级分类",
                  bl: 1,
                  vt: 0,
                  ht: 0,
                  ps: {
                    //批注
                    width: 91, //批注框宽度
                    height: 48, //批注框高度
                    value:
                      "三级分类现支持5种：1、类目 2、品牌商品 3、店铺内商品 4、自定义商品 5、合作方数据", //批准内容
                    isshow: false, //批注框为显示状态
                  },
                },
              },
              {
                r: 0,
                c: 3,
                v: {
                  ct: { fa: "@", t: "s" },
                  m: "标签名称",
                  v: "标签名称",
                  bl: 1,
                  vt: 0,
                  ht: 0,
                },
              },
              {
                r: 0,
                c: 4,
                v: {
                  ct: { fa: "@", t: "s" },
                  m: "分类级别",
                  v: "分类级别",
                  bl: 1,
                  vt: 0,
                  ht: 0,
                },
              },
              {
                r: 0,
                c: 5,
                v: {
                  ct: { fa: "@", t: "s" },
                  m: "sku",
                  v: "sku",
                  bl: 1,
                  vt: 0,
                  ht: 0,
                },
              },
              {
                r: 0,
                c: 6,
                v: {
                  ct: { fa: "@", t: "s" },
                  m: "人群包名称",
                  v: "人群包名称",
                  bl: 1,
                  vt: 0,
                  ht: 0,
                },
              },
            ], //初始化使用的单元格数据
            isPivotTable: false, //是否数据透视表
            zoomRatio: 1, // 缩放比例
            showGridLines: 1, //是否显示网格线
          },
          {
            name: "更新合作方数据", //工作表名称
            color: "hezuofang", //工作表颜色
            index: 1, //工作表索引
            status: 0, //激活状态
            hide: 0, //是否隐藏
            row: 1000, //行数
            column: 18, //列数
            defaultRowHeight: 40, //自定义行高
            defaultColWidth: 150, //自定义列宽
            celldata: [
              {
                r: 0,
                c: 0,
                v: {
                  ct: { fa: "@", t: "s" }, // 格式类型
                  m: "一级分类", // 显示值
                  v: "一级分类", // 原始值
                  bl: 1,
                  vt: 0,
                  ht: 0,
                },
              },
              {
                r: 0,
                c: 1,
                v: {
                  ct: { fa: "@", t: "s" },
                  m: "二级分类",
                  v: "二级分类",
                  vt: 0,
                  ht: 0,
                  bl: 1,
                },
              },
              {
                r: 0,
                c: 2,
                v: {
                  ct: { fa: "@", t: "s" },
                  m: "三级分类",
                  v: "三级分类",
                  bl: 1,
                  vt: 0,
                  ht: 0,
                  ps: {
                    //批注
                    width: 91, //批注框宽度
                    height: 48, //批注框高度
                    value:
                      "在更新合作方数据sheet中，三级分类现只支持合作方数据", //批准内容
                    isshow: false, //批注框为显示状态
                  },
                },
              },
              {
                r: 0,
                c: 3,
                v: {
                  ct: { fa: "@", t: "s" },
                  m: "标签名称",
                  v: "标签名称",
                  bl: 1,
                  vt: 0,
                  ht: 0,
                  ps: {
                    //批注
                    width: 91, //批注框宽度
                    height: 48, //批注框高度
                    value: "此处填写的是人群包原有的标签名称", //批准内容
                    isshow: false, //批注框为显示状态
                  },
                },
              },
              {
                r: 0,
                c: 4,
                v: {
                  ct: { fa: "@", t: "s" },
                  m: "人群包名称",
                  v: "人群包名称",
                  bl: 1,
                  vt: 0,
                  ht: 0,
                },
              },
              {
                r: 0,
                c: 5,
                v: {
                  ct: { fa: "@", t: "s" },
                  m: "更新标签名称",
                  v: "更新标签名称",
                  bl: 1,
                  vt: 0,
                  ht: 0,
                  ps: {
                    //批注
                    width: 91, //批注框宽度
                    height: 48, //批注框高度
                    value: "此处填写的是人群包需要更新的标签名称", //批准内容
                    isshow: false, //批注框为显示状态
                  },
                },
              },
              {
                r: 0,
                c: 6,
                v: {
                  ct: { fa: "@", t: "s" },
                  m: "更新人群包名称",
                  v: "更新人群包名称",
                  bl: 1,
                  vt: 0,
                  ht: 0,
                  ps: {
                    //批注
                    width: 91, //批注框宽度
                    height: 48, //批注框高度
                    value:
                      "此处填写的是更新的人群包名称，不填写默认为原人群包名称", //批准内容
                    isshow: false, //批注框为显示状态
                  },
                },
              },
              {
                r: 1,
                c: 2,
                v: {
                  ct: { fa: "@", t: "s" },
                  m: "合作方数据",
                  v: "合作方数据",
                  bg: "gold",
                  vt: 0,
                  ht: 0,
                },
              },
            ], //初始化使用的单元格数据
            isPivotTable: false, //是否数据透视表
            zoomRatio: 1, // 缩放比例
            showGridLines: 1, //是否显示网格线
            dataVerification: {
              "1_2": {
                type: "dropdown",
                type2: null,
                value1: "合作方数据",
                value2: "",
                checked: false,
                remote: false,
                prohibitInput: false,
                hintShow: false,
                hintText: "",
              },
            },
          },
          {
            name: "新增标签", //工作表名称
            color: "biaoqian", //工作表颜色
            index: 2, //工作表索引
            status: 0, //激活状态
            hide: 0, //是否隐藏
            row: 1000, //行数
            column: 18, //列数
            defaultRowHeight: 40, //自定义行高
            defaultColWidth: 150, //自定义列宽
            celldata: [
              {
                r: 0,
                c: 0,
                v: {
                  ct: { fa: "@", t: "s" }, // 格式类型
                  m: "一级分类", // 显示值
                  v: "一级分类", // 原始值
                  bl: 1,
                  vt: 0,
                  ht: 0,
                },
              },
              {
                r: 0,
                c: 1,
                v: {
                  ct: { fa: "@", t: "s" },
                  m: "二级分类",
                  v: "二级分类",
                  bl: 1,
                  vt: 0,
                  ht: 0,
                },
              },
              {
                r: 0,
                c: 2,
                v: {
                  ct: { fa: "@", t: "s" },
                  m: "三级分类",
                  v: "三级分类",
                  bl: 1,
                  vt: 0,
                  ht: 0,
                  ps: {
                    //批注
                    width: 91, //批注框宽度
                    height: 48, //批注框高度
                    value:
                      "三级分类现支持4种：1类目 2品牌商品 3店铺内商品 4自定义商品", //批准内容
                    isshow: false, //批注框为显示状态
                  },
                },
              },
              {
                r: 0,
                c: 3,
                v: {
                  ct: { fa: "@", t: "s" },
                  m: "新增标签名称",
                  v: "新增标签名称",
                  bl: 1,
                  vt: 0,
                  ht: 0,
                  ps: {
                    //批注
                    width: 91, //批注框宽度
                    height: 48, //批注框高度
                    value:
                      "填写已存在人群需要新增的标签名，该标签在人群包中必须是未存在的", //批准内容
                    isshow: false, //批注框为显示状态
                  },
                },
              },
              {
                r: 0,
                c: 4,
                v: {
                  ct: { fa: "@", t: "s" },
                  m: "分类级别",
                  v: "分类级别",
                  bl: 1,
                  vt: 0,
                  ht: 0,
                },
              },
              {
                r: 0,
                c: 5,
                v: {
                  ct: { fa: "@", t: "s" },
                  m: "SKU",
                  v: "SKU",
                  bl: 1,
                  vt: 0,
                  ht: 0,
                },
              },
              {
                r: 0,
                c: 6,
                v: {
                  ct: { fa: "@", t: "s" },
                  m: "人群包名称",
                  v: "人群包名称",
                  bl: 1,
                  vt: 0,
                  ht: 0,
                  ps: {
                    //批注
                    width: 91, //批注框宽度
                    height: 48, //批注框高度
                    value: "在DMP中存在的人群包名称", //批准内容
                    isshow: false, //批注框为显示状态
                  },
                },
              },
              {
                r: 0,
                c: 7,
                v: {
                  ct: { fa: "@", t: "s" },
                  m: "更新人群包名称",
                  v: "更新人群包名称",
                  bl: 1,
                  vt: 0,
                  ht: 0,
                  ps: {
                    //批注
                    width: 91, //批注框宽度
                    height: 48, //批注框高度
                    value:
                      "添加完标签后，需要更新的人群包名称，不填写默认为原名称", //批准内容
                    isshow: false, //批注框为显示状态
                  },
                },
              },
            ], //初始化使用的单元格数据
            isPivotTable: false, //是否数据透视表
            zoomRatio: 1, // 缩放比例
            showGridLines: 1, //是否显示网格线
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
