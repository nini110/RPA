<template>
<div class="lucky">
  <div id="luckysheet" class="lucky_sheet"></div>
  <div class="lucky_footer">
    <el-button @click="closeExcel">返回并清空数据</el-button>
    <el-button type="primary" @click="submitExcel">确 定</el-button>
  </div>
</div>
</template>

<script>
export default {
  props: {
    excelOpt: {
      type: Array,
      default: [],
    },
    toolType: {
      type: String,
      default: "",
    },
    sheetName: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      dialogVisible: true,
    };
  },
  mounted() {
    const vm = this;
    let dataOpt = vm.excelOpt;
    // this.$nextTick(() => {
    $(function () {
      luckysheet.create({
        container: "luckysheet",
        title: "hahah",
        lang: "zh",
        data: dataOpt,
        showinfobar: false,
        sheetRightClick: true,
        showstatisticBarConfig: {
          count: true, // 计数栏
          view: false, // 打印视图
          zoom: true, // 缩放
        },
        showtoolbar: true,
        showtoolbarConfig: {
          undoRedo: true, //撤销重做，注意撤消重做是两个按钮，由这一个配置决定显示还是隐藏
          paintFormat: false, //格式刷
          currencyFormat: true, //货币格式
          percentageFormat: true, //百分比格式
          numberDecrease: false, // '减少小数位数'
          numberIncrease: false, // '增加小数位数
          moreFormats: true, // '更多格式'
          font: false, // '字体'
          fontSize: true, // '字号大小'
          bold: true, // '粗体 (Ctrl+B)'
          italic: false, // '斜体 (Ctrl+I)'
          strikethrough: false, // '删除线 (Alt+Shift+5)'
          underline: false, // '下划线 (Alt+Shift+6)'
          textColor: true, // '文本颜色'
          fillColor: true, // '单元格颜色'
          border: true, // '边框'
          mergeCell: true, // '合并单元格'
          horizontalAlignMode: true, // '水平对齐方式'
          verticalAlignMode: true, // '垂直对齐方式'
          textWrapMode: true, // '换行方式'
          textRotateMode: false, // '文本旋转方式'
          image: false, // '插入图片'
          link: false, // '插入链接'
          chart: false, // '图表'（图标隐藏，但是如果配置了chart插件，右击仍然可以新建图表）
          postil: true, //'批注'
          pivotTable: false, //'数据透视表'
          function: false, // '公式'
          frozenMode: true, // '冻结方式'
          sortAndFilter: false, // '排序和筛选'
          conditionalFormat: true, // '条件格式'
          dataVerification: false, // '数据验证'
          splitColumn: false, // '分列'
          screenshot: false, // '截图'
          findAndReplace: false, // '查找替换'
          protection: false, // '工作表保护'
          print: false, // '打印'
        },
        cellRightClickConfig: {
          copy: true, // 复制
          copyAs: true, // 复制为
          paste: true, // 粘贴
          insertRow: true, // 插入行
          insertColumn: true, // 插入列
          deleteRow: true, // 删除选中行
          deleteColumn: true, // 删除选中列
          deleteCell: true, // 删除单元格
          hideRow: true, // 隐藏选中行和显示选中行
          hideColumn: true, // 隐藏选中列和显示选中列
          rowHeight: true, // 行高
          columnWidth: true, // 列宽
          clear: true, // 清除内容
          matrix: false, // 矩阵操作选区
          sort: false, // 排序选区
          filter: true, // 筛选选区
          chart: false, // 图表生成
          image: false, // 插入图片
          link: false, // 插入链接
          data: false, // 数据验证
          cellFormat: true, // 设置单元格格式
        },
        enableAddRow: false,
      });
    });
  },
  methods: {
    closeExcel() {
      const vm = this;
      window.luckysheet.destroy();
      vm.$emit("close", 0);
    },
    submitExcel() {
      const vm = this;
      window.luckysheet.exitEditMode();
      this.$nextTick(() => {
        let resultObj = [];
        $(function () {
          let results = window.luckysheet.getAllSheets();
          if (vm.toolType === "京东展位") {
            vm.sheetName.forEach((curSheet, curIdx) => {
              for (let val of results) {
                if (val.name === curSheet) {
                  let sheet = {
                    key: val.name,
                    value: [],
                  };
                  // 去除null
                  let outData = vm.deleteNull(val.data)
                  let publicObj = {};
                  outData.forEach((val1, idx1) => {
                    if (val1) {
                      // 获取公共的内容
                      if (idx1 <= 15 && val1[0] && val1[0].v) {
                        if (val1[1] && val1[1].v) {
                          vm.$set(
                            publicObj,
                            val1[0].v,
                            val1[1].v
                          );
                        } else if (val1[1] && !val1[1].v && val1[1].ct && val1[1].ct.s) {
                          let zhi = ''
                          val1[1].ct.s.forEach((item, index) => {
                            zhi += item.v
                          })
                          vm.$set(
                            publicObj,
                            val1[0].v,
                            zhi
                          )
                        } else {
                          vm.$set(
                            publicObj,
                            val1[0].v,
                            ''
                          );
                        }
                      }
                    }
                  });
                  outData.forEach((val1, idx1) => {
                    let obj = {};
                    if (val1) {
                      // 第20行是横向内容
                      if (idx1 > 16) {
                        outData[16].forEach((val2, idx2) => {
                          if (val2) {
                            if (outData[idx1][idx2] && outData[idx1][idx2].v) {
                              vm.$set(
                                obj,
                                val2.v,
                                outData[idx1][idx2].v
                              );
                            } else if (outData[idx1][idx2] && !outData[idx1][idx2].v && outData[idx1][idx2].ct && outData[idx1][idx2].ct.s) {
                              let zhi = ''
                              outData[idx1][idx2].ct.s.forEach((item, index) => {
                                zhi += item.v
                              })
                              vm.$set(
                                obj,
                                val2.v,
                                zhi
                              )
                            } else {
                              vm.$set(
                                obj,
                                val2.v,
                                ''
                              );
                            }

                          }
                        });
                        sheet.value.push({
                          ...publicObj,
                          ...obj,
                        });
                      }
                    }
                  });
                  resultObj[sheet.key] = sheet.value;
                  break;
                }
              }
            })
          } else if (
            vm.toolType === "数坊人群计算" ||
            vm.toolType === "数坊人群圈选"
          ) {
            debugger
            vm.sheetName.forEach((curSheet, curIdx) => {
              for (let val of results) {
                if (val.name === curSheet) {
                  // 去除null
                  let outData = vm.deleteNull(val.data)
                  let rowKey = []
                  let rowValue = []
                  outData.forEach((val1, idx1) => {
                    if (val1) {
                      if (idx1 === 2) {
                        // 处理key值
                        val1.forEach((item, index) => {
                          rowKey.push(item.m)
                        })
                      }
                      if (idx1 > 2) {
                        let dataRowValue = []
                        val1.forEach((item, index) => {
                          if (rowKey[index].indexOf('时间') !== -1 || rowKey[index].indexOf('时期') !== -1 || rowKey[index].indexOf('日期') !== -1) {
                            dataRowValue.push('')
                          } else {
                            dataRowValue.push( item ? (item.m || item.v) : '')
                          }
                        })
                        rowValue.push(dataRowValue)
                      }
                    }
                  });
                  let sheet = {
                    key: val.name,
                    value: {
                      rowKey,
                      rowValue
                    },
                  };
                  resultObj.push(sheet)
                  break;
                }
              }
            })
          } else {
            vm.sheetName.forEach((curSheet, curIdx) => {
              for (let val of results) {
                if (val.name === curSheet) {
                  let sheet = {
                    key: val.name,
                    value: [],
                  };
                  // 去除null
                  let outData = vm.deleteNull(val.data)
                  // 处理数据
                  outData.forEach((val1, idx1) => {
                    if (val1) {
                      if (idx1 !== 0) {
                        // val1是每一行
                        let obj = {};
                        outData[0].forEach((val2, idx2) => {
                          if (val2) {
                            let tg = val2.ct.fa === 'yyyy-MM-dd' ? val2.m : val2.v
                            if (tg.indexOf('流量包设置') !== -1 || tg.indexOf('人群溢价系数') !== -1 ||
                              tg.indexOf('基础出价') !== -1 || tg.indexOf('出价') !== -1 ||
                              tg.indexOf('时期') !== -1 ||
                              tg.indexOf('日期') !== -1 || tg.indexOf('时间') !== -1) {
                              vm.$set(
                                obj,
                                tg,
                                outData[idx1][idx2] && outData[idx1][idx2].m ? outData[idx1][idx2].m : ""
                              );
                            } else if (tg.indexOf('跟单SKU') !== -1 || tg.toUpperCase().indexOf('SKU') !== -1) {
                              vm.$set(
                                obj,
                                tg,
                                outData[idx1][idx2] && outData[idx1][idx2].v ? String(outData[idx1][idx2].v) : ""
                              );
                            } else {
                              if (outData[idx1][idx2] && (outData[idx1][idx2].v || outData[idx1][idx2].v == 0)) {
                                vm.$set(
                                  obj,
                                  tg,
                                  outData[idx1][idx2].v
                                )
                              } else if (outData[idx1][idx2] && !outData[idx1][idx2].v && outData[idx1][idx2].ct && outData[idx1][idx2].ct.s) {
                                let zhi = ''
                                outData[idx1][idx2].ct.s.forEach((item, index) => {
                                  zhi += item.v
                                })
                                vm.$set(
                                  obj,
                                  tg,
                                  zhi
                                )
                              } else {
                                vm.$set(
                                  obj,
                                  tg,
                                  ''
                                )
                              }
                            }

                          }
                        });
                        sheet.value.push(obj);
                      }
                    }
                  });
                  resultObj[sheet.key] = sheet.value;
                  break;
                }
              }
            })
          }
          debugger
          // 保存
          // [resultObj]为提交的数据  results为excel的配置数据
          vm.$emit("close", 1, [resultObj], results);
          window.luckysheet.destroy();
        });
      });
    },
    // 去除空数据
    deleteNull(zhi) {
      const vm = this
      let arr = []
      zhi.forEach((item, index) => {
        item.forEach((item1, index1) => {
          if (item1 && !item1.v && item1.ct && !item1.ct.s) {
            vm.$set(item1, 'v', item1.v == 0 ? '0' : '')
          }
        })
      })
      zhi.forEach((item, index) => {
        let hasData = item.every((item1) => {
          return !item1 || !(item1 && item1.v)
        })
        if (!hasData) arr.push(item)
      })
      return arr
    }
  },
};
</script>

<style lang="less" scoped>
.lucky {
  background-color: #fff;
  position: relative;
  // width: 100%;
  // height: 100%;
  z-index: 11;
  position: absolute;
  left: 0;
  top: 50px;
  bottom: 0;
  right: 0;

  &_sheet {
    position: absolute;
    left: 40px;
    right: 40px;
    top: 80px;
    bottom: 80px;
    box-sizing: border-box;
  }

  &_footer {
    position: fixed;
    bottom: 20px;
    right: 40px;
  }
}
</style>
