<template>
<!-- 京准通工具 -->
<div style="width: 100%; height: 100%">
  <IptComp ref="iptcomp" :tipInfo="tipInfo" :formMenu="3" :picSrc="picSrc" :picClass="picClass" :ifDown="ifDown" :colWidth="colWidth" :toolType="toolType" :wordList="wordList" :wordTip="wordTip" :sheetName="sheetName" :excelOptions="excelOptions">
  </IptComp>
</div>
</template>

<script>
import IptComp from "@/components/iptTable/index.vue";
import dayjs from "dayjs";

export default {
  name: "Budget",
  components: {
    IptComp,
  },
  data() {
    return {
      toolType: "一键预算",
      sheetName: ['京东快车', '京东展位', '购物触点', '京速推'],
      excelOptions: [],
      picSrc: "",
      picClass: '',
      ifDown: false,
      colWidth: {},
      wordList: [],
      wordTip: '',
      tipInfo: [
        "1、使用该系统更新预算的时间段为当日起往后顺延30日（同京准通平台可设置时间段一致）",
        "2、建议按照下载模板格式上传，否则可能会解析失败",
        "3、有任何使用问题请联系开发人员，企业微信工号：21400",
      ]
    };
  },
  methods: {

  },
  created() {
    const vm = this;
    let today = dayjs().format('YYYY-MM-DD')
    let arr = new Array(29).fill(1)
    let dateArr = [today]
    arr.forEach((val, idx) => {
      let current = dayjs().add(idx + 1, 'day').format('YYYY-MM-DD')
      dateArr.push(current)
    })
    let preArr = ['计划名称', '计划ID']
    let targetArr1 = preArr.concat(dateArr)
    let targetArr2 = preArr.concat('日预算')
    let mapArr = [targetArr1, targetArr1, targetArr1, targetArr2]
    mapArr.forEach((val, idx) => {
      let cellArr = []
      let obj = {
        name: vm.sheetName[idx], //工作表名称
        color: "", //工作表颜色
        index: "renqun", //工作表索引
        status: 1, //激活状态
        hide: 0, //是否隐藏
        row: 1000, //行数
        column: 15, //列数
        defaultRowHeight: 40, //自定义行高
        defaultColWidth: 150, //自定义列宽
        celldata: null, //初始化使用的单元格数据
        isPivotTable: false, //是否数据透视表
        zoomRatio: 1, // 缩放比例
        showGridLines: 1, //是否显示网格线
      }
      val.forEach((map, mapIdx) => {

        let ob = {
          r: 0,
          c: mapIdx,
          v: {
            ct: {
              fa: "@",
              t: "s"
            },
            m: map,
            v: map,
            bl: 1,
            vt: 0,
            ht: 0,
          },
        }
        cellArr.push(ob)
      })
      obj.celldata = JSON.parse(JSON.stringify(cellArr))
      vm.excelOptions[idx] = obj
    })
  },
};
</script>

<style lang="less" scoped>
// @import "../index";
</style>
