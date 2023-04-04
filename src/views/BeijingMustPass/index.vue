<template>
<!-- 京准通工具 -->
<div style="height: 100%">
  <IptComp ref="iptcomp" 
  :formMenu="1" 
  :picSrc="picSrc" 
  :ifDown="ifDown" 
  :colWidth="colWidth" 
  :toolType="toolType" 
  :wordList="wordList"
  :wordTip="wordTip" 
  :sheetName="sheetName" 
  :excelOptions="excelOptions">
  </IptComp>
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
      sheetName: "",
      excelOptions: [],
      picSrc: "",
      ifDown: false,
      colWidth: {},
      wordList: [],
      wordTip: ''
    };
  },
  watch: {
    $route: {
      handler(newval, oldval) {
        const vm = this;
        vm.wordTip = ''
        vm.colWidth = {
          choose: 12,
          eror: 12,
          pin: 12,
          user: 12,
          cookie: 12,
        }
        let arr = new Array(1000).fill(1);
        let col2 = {};
        arr.forEach((val, idx) => {
          if (idx !== 0) {
            vm.$set(col2, `${idx}_2`, {
              type: "text_content",
              type2: null,
              value1: "合作方数据",
              value2: "",
              checked: false,
              remote: false,
              prohibitInput: false,
              hintShow: true,
              hintText: "只允许输入：合作方数据",
            });
          }
        });
        switch (newval.name) {
          case "DMP":
            vm.toolType = "DMP";
            vm.sheetName = "创建人群";
            vm.ifDown = true
            vm.colWidth = {
              choose: 12,
              eror: 12,
              user: 24,
            }
            vm.wordList = [{
                lab: '1· 创建人群sheet：',
                word: '支持用户行为（新版）、用户属性和合作方数据标签创建人群（具体可下载模板参考）；'
              },
              {
                lab: '2· 更新合作方数据：',
                word: '支持已有人群更新合作方数据；'
              },
              {
                lab: '3· 新增标签：',
                word: '支持已有人群追加标签功能，范围为用户行为（新版）、用户属性和合作方数据；'
              }
            ]
            vm.picSrc = require("../../assets/images/DMP.png");
            vm.excelOptions = [{
              name: "创建人群", //工作表名称
              color: "", //工作表颜色
              index: "renqun", //工作表索引
              status: 1, //激活状态
              hide: 0, //是否隐藏
              row: 1000, //行数
              column: 15, //列数
              defaultRowHeight: 40, //自定义行高
              defaultColWidth: 150, //自定义列宽
              celldata: [{
                  r: 0,
                  c: 0,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    }, // 格式类型
                    m: "三级分类", // 显示值
                    v: "三级分类", // 原始值
                    bl: 1,
                    tb: 2,
                    vt: 0,
                    ht: 0,
                    ps: {
                      //批注
                      width: 91, //批注框宽度
                      height: 48, //批注框高度
                      value: "温馨提示，三级分类现支持有4种：,1. 类目, 2. 品牌, 3. 店铺, 4. 商品（只有商品行为）", //批准内容
                      isshow: false, //批注框为显示状态
                    },
                  },
                },
                {
                  r: 0,
                  c: 1,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "标签名称",
                    v: "标签名称",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                  },
                },
                {
                  r: 0,
                  c: 2,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "筛选项",
                    v: "筛选项",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                    ps: {
                      //批注
                      width: 91, //批注框宽度
                      height: 48, //批注框高度
                      value: "三级分类：行为类型-时间范围-类目场景, 非三级分类:行为类型-时间范围", //批准内容
                      isshow: false, //批注框为显示状态
                    },
                  },
                },
                {
                  r: 0,
                  c: 3,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "sku",
                    v: "sku",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                    ps: {
                      //批注
                      width: 91, //批注框宽度
                      height: 48, //批注框高度
                      value: "注：多个SKU时必须先把单元格式设置为文本，同时SKU之间的逗号需要是英文状态下的逗号", //批准内容
                      isshow: false, //批注框为显示状态
                    },
                  },
                },
                {
                  r: 0,
                  c: 4,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "用户属性三级分类",
                    v: "用户属性三级分类",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                  },
                },
                {
                  r: 0,
                  c: 5,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "用户属性标签名称",
                    v: "用户属性标签名称",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                  },
                },
                {
                  r: 0,
                  c: 6,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "用户属性筛选项",
                    v: "用户属性筛选项",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                    ps: {
                      //批注
                      width: 91, //批注框宽度
                      height: 48, //批注框高度
                      value: "YY:多个筛选项之间用英文逗号隔开", //批准内容
                      isshow: false, //批注框为显示状态
                    },
                  },
                },
                {
                  r: 0,
                  c: 7,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "交并差组合",
                    v: "交并差组合",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                    ps: {
                      //批注
                      width: 91, //批注框宽度
                      height: 48, //批注框高度
                      value: "不填写默认全交集,填写时则自动选择交并差，存在三个可选项：组合1、组合2、排除组合", //批准内容
                      isshow: false, //批注框为显示状态
                    },
                  },
                },
                {
                  r: 0,
                  c: 8,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "组合1方式",
                    v: "组合1方式",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                    ps: {
                      //批注
                      width: 91, //批注框宽度
                      height: 48, //批注框高度
                      value: "该列可不填，默认交集, 填写时可选择 交集、并集", //批准内容
                      isshow: false, //批注框为显示状态
                    },
                  },
                },
                {
                  r: 0,
                  c: 9,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "组合2方式",
                    v: "组合2方式",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                    ps: {
                      //批注
                      width: 91, //批注框宽度
                      height: 48, //批注框高度
                      value: "该列可不填，默认交集, 填写时可选择 交集、并集", //批准内容
                      isshow: false, //批注框为显示状态
                    },
                  },
                },
                {
                  r: 0,
                  c: 10,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "组合1和2方式",
                    v: "组合1和2方式",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                    ps: {
                      //批注
                      width: 91, //批注框宽度
                      height: 48, //批注框高度
                      value: "该列可不填，默认交集, 填写时可选择 交集、并集", //批准内容
                      isshow: false, //批注框为显示状态
                    },
                  },
                },
                {
                  r: 0,
                  c: 11,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "排除组合方式",
                    v: "排除组合方式",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                    ps: {
                      //批注
                      width: 91, //批注框宽度
                      height: 48, //批注框高度
                      value: "该列可不填，默认交集, 填写时可选择 交集、并集", //批准内容
                      isshow: false, //批注框为显示状态
                    },
                  },
                },
                {
                  r: 0,
                  c: 12,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
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
            }, ];
            break;
            // 展位 Sheet1
          case "Booth":
            vm.toolType = "京东展位";
            vm.picSrc = require("../../assets/images/Booth.png");
            vm.ifDown = false
            vm.wordList = [{
              lab: '创建人群sheet：',
              word: '支持批量化创建京东展位单元；'
            }, ]
            vm.sheetName = "Sheet1";
            vm.excelOptions = [{
              name: "Sheet1", //工作表名称
              color: "", //工作表颜色
              index: "renqun", //工作表索引
              status: 1, //激活状态
              hide: 0, //是否隐藏
              row: 1000, //行数
              column: 15, //列数
              defaultRowHeight: 40, //自定义行高
              defaultColWidth: 400, //自定义列宽
              celldata: [
                // 活动名称
                {
                  r: 0,
                  c: 0,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    }, // 格式类型
                    m: "活动名称", // 显示值
                    v: "活动名称", // 原始值
                    bl: 1,
                    tb: 2,
                    vt: 0,
                    ht: 0,
                    ps: {
                      //批注
                      width: 91, //批注框宽度
                      height: 48, //批注框高度
                      value: "寻找计划是会自动添加-无线首焦或-PC首焦", //批准内容
                      isshow: false, //批注框为显示状态
                    },
                  },
                },
                // 活动简称
                {
                  r: 1,
                  c: 0,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "活动简称",
                    v: "活动简称",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                  },
                },
                // 投放目标
                {
                  r: 3,
                  c: 0,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "投放目标",
                    v: "投放目标",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                  },
                },
                // 出价方式
                {
                  r: 4,
                  c: 0,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "出价方式",
                    v: "出价方式",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                  },
                },
                // 统一目标日消耗
                {
                  r: 6,
                  c: 0,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "统一目标日消耗",
                    v: "统一目标日消耗",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                  },
                },
                // 调价偏好
                {
                  r: 7,
                  c: 0,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "调价偏好",
                    v: "调价偏好",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                  },
                },
                // 通投出价
                {
                  r: 8,
                  c: 0,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "通投出价",
                    v: "通投出价",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                  },
                },
                // 溢价系数
                {
                  r: 9,
                  c: 0,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "溢价系数",
                    v: "溢价系数",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                  },
                },
                // 成本上限
                {
                  r: 10,
                  c: 0,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "成本上限",
                    v: "成本上限",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                  },
                },
                // 是否开启对照实验
                {
                  r: 11,
                  c: 0,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "是否开启对照实验",
                    v: "是否开启对照实验",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                  },
                },
                // PC首焦
                {
                  r: 12,
                  c: 0,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "PC首焦",
                    v: "PC首焦",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                  },
                },
                // 无线首焦
                {
                  r: 13,
                  c: 0,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "无线首焦",
                    v: "无线首焦",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                  },
                },
                // 竖版首焦
                {
                  r: 14,
                  c: 0,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "竖版首焦",
                    v: "竖版首焦",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                  },
                },
                // 店铺id
                {
                  r: 15,
                  c: 0,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "店铺id",
                    v: "店铺id",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                  },
                },
                // 创意优选
                {
                  r: 16,
                  c: 0,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "创意优选",
                    v: "创意优选",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                  },
                },
                // 智能定向人群
                {
                  r: 17,
                  c: 0,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "智能定向人群",
                    v: "智能定向人群",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                  },
                },
                // 人群名称
                {
                  r: 19,
                  c: 0,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "人群名称",
                    v: "人群名称",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                    ps: {
                      //批注
                      width: 91, //批注框宽度
                      height: 48, //批注框高度
                      value: "多个人群名称之间用/隔开", //批准内容
                      isshow: false, //批注框为显示状态
                    },
                  },
                },
                // 创意名称
                {
                  r: 19,
                  c: 1,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "创意名称",
                    v: "创意名称",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                  },
                },
                // 单元名称
                {
                  r: 19,
                  c: 2,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "单元名称",
                    v: "单元名称",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                  },
                },
              ], //初始化使用的单元格数据
              isPivotTable: false, //是否数据透视表
              zoomRatio: 1, // 缩放比例
              showGridLines: 1, //是否显示网格线
            }, ];
            break;
            // 直投 Sheet1
          case "Direct":
            vm.picSrc = require("../../assets/images/Direct.png");
            vm.toolType = "京东直投";
            vm.ifDown = false
            vm.sheetName = "Sheet1";
            vm.wordList = [{
                lab: '1· ',
                word: '支持批量化创建所有媒体渠道单元并同时绑定创意（不同媒体渠道填写范围不同，具体可下载模板参考）；'
              },
              {
                lab: '2· ',
                word: '支持单独绑定已有单元创意；'
              },
            ]
            vm.excelOptions = [{
              name: "Sheet1", //工作表名称
              color: "", //工作表颜色
              index: "renqun", //工作表索引
              status: 1, //激活状态
              hide: 0, //是否隐藏
              row: 1000, //行数
              column: 15, //列数
              defaultRowHeight: 40, //自定义行高
              defaultColWidth: 150, //自定义列宽
              celldata: [
                // 单元名称
                {
                  r: 0,
                  c: 0,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    }, // 格式类型
                    m: "单元名称", // 显示值
                    v: "单元名称", // 原始值
                    bl: 1,
                    tb: 2,
                    vt: 0,
                    ht: 0,
                  },
                },
                // 单元备注
                {
                  r: 0,
                  c: 1,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "单元备注",
                    v: "单元备注",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                  },
                },
                // 媒体类型
                {
                  r: 0,
                  c: 2,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "媒体类型",
                    v: "媒体类型",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                  },
                },
                // 计划名称
                {
                  r: 0,
                  c: 3,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "计划名称",
                    v: "计划名称",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                    ps: {
                      //批注
                      width: 91, //批注框宽度
                      height: 48, //批注框高度
                      value: "内容不能为空", //批准内容
                      isshow: false, //批注框为显示状态
                    },
                  },
                },
                // 资源位
                {
                  r: 0,
                  c: 4,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "资源位",
                    v: "资源位",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                    ps: {
                      //批注
                      width: 91, //批注框宽度
                      height: 48, //批注框高度
                      value: "内容不能为空", //批准内容
                      isshow: false, //批注框为显示状态
                    },
                  },
                },
                // 智能定向人群
                {
                  r: 0,
                  c: 5,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "智能定向人群",
                    v: "智能定向人群",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                    ps: {
                      //批注
                      width: 91, //批注框宽度
                      height: 48, //批注框高度
                      value: "是否开启智能定向人群：是/否", //批准内容
                      isshow: false, //批注框为显示状态
                    },
                  },
                },
                // 人群名称
                {
                  r: 0,
                  c: 6,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "人群名称",
                    v: "人群名称",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                    ps: {
                      //批注
                      width: 91, //批注框宽度
                      height: 48, //批注框高度
                      value: "1.目前默认只支持DMP自建人群 2. 多个人群的话需要使用‘｜’隔开", //批准内容
                      isshow: false, //批注框为显示状态
                    },
                  },
                },
                // 操作类型
                {
                  r: 0,
                  c: 7,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "操作类型",
                    v: "操作类型",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                    ps: {
                      //批注
                      width: 91, //批注框宽度
                      height: 48, //批注框高度
                      value: "1.只替换创意时此项必填 2.默认为空，即为新增单元  3.当更新创意时单元名称、媒体类型、计划名称、创意名称必填，其他不填写", //批准内容
                      isshow: false, //批注框为显示状态
                    },
                  },
                },
                // 创意名称
                {
                  r: 0,
                  c: 8,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "创意名称",
                    v: "创意名称",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                    ps: {
                      //批注
                      width: 91, //批注框宽度
                      height: 48, //批注框高度
                      value: "1.不能为空 2.可填写多个，多个创意名称必须使用‘｜’隔开， 例如：创意1｜创意2", //批准内容
                      isshow: false, //批注框为显示状态
                    },
                  },
                },
                // 出价
                {
                  r: 0,
                  c: 9,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "出价",
                    v: "出价",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                    ps: {
                      //批注
                      width: 91, //批注框宽度
                      height: 48, //批注框高度
                      value: "该列应该为文本格式，设置成功时，左上角带三角", //批准内容
                      isshow: false, //批注框为显示状态
                    },
                  },
                },
                // 起止时间
                {
                  r: 0,
                  c: 10,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "起止时间",
                    v: "起止时间",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                    ps: {
                      //批注
                      width: 91, //批注框宽度
                      height: 48, //批注框高度
                      value: "1.只有腾讯资源，且非京东定向必填  2.落地页类型及跟单SKU必填", //批准内容
                      isshow: false, //批注框为显示状态
                    },
                  },
                },
                // 落地页类型
                {
                  r: 0,
                  c: 11,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "落地页类型",
                    v: "落地页类型",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                    ps: {
                      //批注
                      width: 91, //批注框宽度
                      height: 48, //批注框高度
                      value: "目前只支持京东落地页 -自定义", //批准内容
                      isshow: false, //批注框为显示状态
                    },
                  },
                },
                // 落地页链接
                {
                  r: 0,
                  c: 12,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "落地页链接",
                    v: "落地页链接",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                  },
                },
                // 跟单SKU
                {
                  r: 0,
                  c: 13,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "跟单SKU",
                    v: "跟单SKU",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                  },
                },
                // 出价策略
                {
                  r: 0,
                  c: 14,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "出价策略",
                    v: "出价策略",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                  },
                },
                // 营销诉求
                {
                  r: 0,
                  c: 15,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "营销诉求",
                    v: "营销诉求",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                    ps: {
                      //批注
                      width: 91, //批注框宽度
                      height: 48, //批注框高度
                      value: "填写转化或引流或不填", //批准内容
                      isshow: false, //批注框为显示状态
                    },
                  },
                },
                // 自动扩量
                {
                  r: 0,
                  c: 16,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "自动扩量",
                    v: "自动扩量",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                    ps: {
                      //批注
                      width: 91, //批注框宽度
                      height: 48, //批注框高度
                      value: "开启或不填", //批准内容
                      isshow: false, //批注框为显示状态
                    },
                  },
                }, // 一键起量
                {
                  r: 0,
                  c: 17,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "一键起量",
                    v: "一键起量",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                  },
                }, // 广告预算
                {
                  r: 0,
                  c: 18,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "广告预算",
                    v: "广告预算",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                  },
                }, // 京东装机定向
                {
                  r: 0,
                  c: 19,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "京东装机定向",
                    v: "京东装机定向",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                    ps: {
                      //批注
                      width: 91, //批注框宽度
                      height: 48, //批注框高度
                      value: "如果需要填写开启，不需要空着即可", //批准内容
                      isshow: false, //批注框为显示状态
                    },
                  },
                }, // 投放目标
                {
                  r: 0,
                  c: 20,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "投放目标",
                    v: "投放目标",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                  },
                }, // 控制方式
                {
                  r: 0,
                  c: 21,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "控制方式",
                    v: "控制方式",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                  },
                }, // 出价方式
                {
                  r: 0,
                  c: 22,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "出价方式",
                    v: "出价方式",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                    ps: {
                      //批注
                      width: 91, //批注框宽度
                      height: 48, //批注框高度
                      value: "填写点击出价或按目标转化出价或按展示出价", //批准内容
                      isshow: false, //批注框为显示状态
                    },
                  },
                },
                // 媒体资源
                {
                  r: 0,
                  c: 23,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "媒体资源",
                    v: "媒体资源",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                    ps: {
                      //批注
                      width: 91, //批注框宽度
                      height: 48, //批注框高度
                      value: "填写微信-朋友圈；抖音；京东联盟等， 如计划属于头条新京东定向，这里填写今日头条（新）或 抖音（新）", //批准内容
                      isshow: false, //批注框为显示状态
                    },
                  },
                },
                // 展示场景
                {
                  r: 0,
                  c: 24,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "展示场景",
                    v: "展示场景",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                    ps: {
                      //批注
                      width: 91, //批注框宽度
                      height: 48, //批注框高度
                      value: "当媒体资源为京东联盟时需要填写展示场景", //批准内容
                      isshow: false, //批注框为显示状态
                    },
                  },
                },
                // 优化目标
                {
                  r: 0,
                  c: 25,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "优化目标",
                    v: "优化目标",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                    ps: {
                      //批注
                      width: 91, //批注框宽度
                      height: 48, //批注框高度
                      value: "填写到达;点击;展示;下单;成交", //批准内容
                      isshow: false, //批注框为显示状态
                    },
                  },
                },
                // 衍生创意
                {
                  r: 0,
                  c: 26,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "衍生创意",
                    v: "衍生创意",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                    ps: {
                      //批注
                      width: 91, //批注框宽度
                      height: 48, //批注框高度
                      value: "需要开启则填开启，不需要空着即可", //批准内容
                      isshow: false, //批注框为显示状态
                    },
                  },
                }, // 深度目标
                {
                  r: 0,
                  c: 27,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "深度目标",
                    v: "深度目标",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                    ps: {
                      //批注
                      width: 91, //批注框宽度
                      height: 48, //批注框高度
                      value: "需要时填写确切数值，不需要空着即可", //批准内容
                      isshow: false, //批注框为显示状态
                    },
                  },
                }, // 精选流量包
                {
                  r: 0,
                  c: 28,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "精选流量包",
                    v: "精选流量包",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                  },
                },
              ], //初始化使用的单元格数据
              isPivotTable: false, //是否数据透视表
              zoomRatio: 1, // 缩放比例
              showGridLines: 1, //是否显示网格线
            }, ];
            arr.forEach((val, idx) => {
              if (idx !== 0) {
                // 第十列： 出价 设置为文本格式
                vm.excelOptions[0].celldata.push({
                  r: idx,
                  c: 9,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "",
                    v: "",
                    bg: "",
                    vt: 0,
                    ht: 0,
                  },
                });
              }
            });
            break;
            // 人群 京腾魔方人群定向
          case "People":
            vm.picSrc = require("../../assets/images/Cube1.png");
            vm.toolType = "京腾魔方人群定向";
            vm.sheetName = "京腾魔方人群定向";
            vm.ifDown = false
            vm.wordList = [{
              lab: '',
              word: '支持批量化创建腾讯渠道下京腾魔方人群定向；'
            }, ]
            vm.excelOptions = [{
              name: "京腾魔方人群定向", //工作表名称
              color: "", //工作表颜色
              index: "renqun", //工作表索引
              status: 1, //激活状态
              hide: 0, //是否隐藏
              row: 1000, //行数
              column: 15, //列数
              defaultRowHeight: 40, //自定义行高
              defaultColWidth: 150, //自定义列宽
              celldata: [
                // 人群名称
                {
                  r: 0,
                  c: 0,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    }, // 格式类型
                    m: "人群名称", // 显示值
                    v: "人群名称", // 原始值
                    bl: 1,
                    tb: 2,
                    vt: 0,
                    ht: 0,
                  },
                },
                // 引用人群
                {
                  r: 0,
                  c: 1,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "引用人群",
                    v: "引用人群",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                  },
                },
                // 排除人群
                {
                  r: 0,
                  c: 2,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "排除人群",
                    v: "排除人群",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                  },
                },
              ], //初始化使用的单元格数据
              isPivotTable: false, //是否数据透视表
              zoomRatio: 1, // 缩放比例
              showGridLines: 1, //是否显示网格线
            }, ];
            break;
            // 魔方 Sheet1
          case "Cube":
            vm.picSrc = require("../../assets/images/Cube1.png");
            vm.toolType = "京腾魔方人群";
            vm.sheetName = "Sheet1";
            vm.ifDown = false
            vm.wordList = [{
              lab: '',
              word: '支持批量化创建腾讯渠道下京腾魔方人群；'
            }, ]
            vm.excelOptions = [{
              name: "Sheet1", //工作表名称
              color: "", //工作表颜色
              index: "renqun", //工作表索引
              status: 1, //激活状态
              hide: 0, //是否隐藏
              row: 1000, //行数
              column: 15, //列数
              defaultRowHeight: 40, //自定义行高
              defaultColWidth: 260, //自定义列宽
              celldata: [
                // 一级
                {
                  r: 0,
                  c: 0,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    }, // 格式类型
                    m: "一级", // 显示值
                    v: "一级", // 原始值
                    bl: 1,
                    tb: 2,
                    vt: 0,
                    ht: 0,
                  },
                },
                // 二级
                {
                  r: 0,
                  c: 1,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "二级",
                    v: "二级",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                  },
                },
                // 三级
                {
                  r: 0,
                  c: 2,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "三级",
                    v: "三级",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                  },
                },
                // SKU
                {
                  r: 0,
                  c: 3,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "SKU",
                    v: "SKU",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                  },
                },
                // 行为
                {
                  r: 0,
                  c: 4,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "行为",
                    v: "行为",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                  },
                },
                // 时间
                {
                  r: 0,
                  c: 5,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "时间",
                    v: "时间",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                  },
                },
                // 常用下单途径
                {
                  r: 0,
                  c: 6,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "常用下单途径",
                    v: "常用下单途径",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                    ps: {
                      //批注
                      width: 91, //批注框宽度
                      height: 48, //批注框高度
                      value: "填写pc或者微信或者手Q或者app&m或者其他，选择多个时用/隔开", //批准内容
                      isshow: false, //批注框为显示状态
                    },
                  },
                },
                // 人群名称
                {
                  r: 0,
                  c: 7,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "人群名称",
                    v: "人群名称",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                  },
                },
              ], //初始化使用的单元格数据
              isPivotTable: false, //是否数据透视表
              zoomRatio: 1, // 缩放比例
              showGridLines: 1, //是否显示网格线
            }, ];
            break;
            // 购物触点 Sheet1
          case "GoShop":
            vm.picSrc = require("../../assets/images/GoShop.png");
            vm.toolType = "购物触点";
            vm.ifDown = false
            vm.wordList = [{
              lab: '',
              word: '支持批量化创建购物触点单元（支持范围：计划类型为活动），并同时绑定单元活动；'
            }, ]
            vm.wordTip = '目前购物触点&展位正在逐步融合中，建议触点单元创建后进行检查，如遇无法创建等问题可及时联系产品部人员；'
            vm.sheetName = "Sheet1";
            vm.excelOptions = [{
              name: "sheet1", //工作表名称
              color: "", //工作表颜色
              index: "renqun", //工作表索引
              status: 1, //激活状态
              hide: 0, //是否隐藏
              row: 1000, //行数
              column: 15, //列数
              defaultRowHeight: 40, //自定义行高
              defaultColWidth: 150, //自定义列宽
              celldata: [{
                  r: 0,
                  c: 0,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    }, // 格式类型
                    m: "计划名称", // 显示值
                    v: "计划名称", // 原始值
                    bl: 1,
                    tb: 2,
                    vt: 0,
                    ht: 0,
                  },
                },
                // 单元名称
                {
                  r: 0,
                  c: 1,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "单元名称",
                    v: "单元名称",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                  },
                },
                // 活动链接
                {
                  r: 0,
                  c: 2,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "活动链接",
                    v: "活动链接",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                  },
                },
                // 主活动标题
                {
                  r: 0,
                  c: 3,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "主活动标题",
                    v: "主活动标题",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                  },
                },
                // 活动名称
                {
                  r: 0,
                  c: 4,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "活动名称",
                    v: "活动名称",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                  },
                },
                // 引流SKU智能抓取
                {
                  r: 0,
                  c: 5,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "引流SKU智能抓取",
                    v: "引流SKU智能抓取",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                  },
                },
                // 添加SKU
                {
                  r: 0,
                  c: 6,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "添加SKU",
                    v: "添加SKU",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                    ps: {
                      //批注
                      width: 91, //批注框宽度
                      height: 48, //批注框高度
                      value: "1.sku之间用/隔开 2.暂时废弃sku这一功能，需要手动去编辑添加", //批准内容
                      isshow: false, //批注框为显示状态
                    },
                  },
                },
                // 地域设置
                {
                  r: 0,
                  c: 7,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "地域设置",
                    v: "地域设置",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                  },
                },
                // 基础出价
                {
                  r: 0,
                  c: 8,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "基础出价",
                    v: "基础出价",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                  },
                },
                // 流量包设置
                {
                  r: 0,
                  c: 9,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "流量包设置",
                    v: "流量包设置",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                    ps: {
                      //批注
                      width: 91, //批注框宽度
                      height: 48, //批注框高度
                      value: "用/隔开，前面为购物前，后面为购物后，20代表20%", //批准内容
                      isshow: false, //批注框为显示状态
                    },
                  },
                },
                // DMP自建人群
                {
                  r: 0,
                  c: 10,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "DMP自建人群",
                    v: "DMP自建人群",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                    ps: {
                      //批注
                      width: 91, //批注框宽度
                      height: 48, //批注框高度
                      value: "不同人群之间用/隔开", //批准内容
                      isshow: false, //批注框为显示状态
                    },
                  },
                },
                // 人群溢价系数
                {
                  r: 0,
                  c: 11,
                  v: {
                    ct: {
                      fa: "@",
                      t: "s"
                    },
                    m: "人群溢价系数",
                    v: "人群溢价系数",
                    bl: 1,
                    vt: 0,
                    ht: 0,
                    ps: {
                      //批注
                      width: 91, //批注框宽度
                      height: 48, //批注框高度
                      value: "溢价系数之间用/隔开，和dmp人群一一对应", //批准内容
                      isshow: false, //批注框为显示状态
                    },
                  },
                },
              ], //初始化使用的单元格数据
              isPivotTable: false, //是否数据透视表
              zoomRatio: 1, // 缩放比例
              showGridLines: 1, //是否显示网格线
            }, ];
            break;
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {

  },
  created() {},
};
</script>

<style lang="less" scoped>
</style>
