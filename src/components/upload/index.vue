<template>
  <div class="upbox">
    <el-upload v-if="btnUpload" ref="btnUpload" accept=".png,.jpg,.jpeg,.JPEG,.PNG,.JPG" :action="UploadUrl()"
      :show-file-list="false" :auto-upload="false" :file-list="fileList" :on-change="fileChangeBtn" :multiple="multiple">
      <el-button size="small" class="el-upload-btn plain">请添加图片</el-button>
    </el-upload>
    <el-upload v-else drag accept=".xlsx,.csv" :auto-upload="false" :show-file-list="showFileList" :action="UploadUrl()"
      :on-remove="remfile" :on-preview="handlePreview" :on-change="fileChange" :on-success="handleSuccess"
      :on-error="handleError" :file-list="fileList" :multiple="multiple" :limit="limit">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将文件拖到此处，或<em>{{ upTxt }}</em>
      </div>
      <div v-if="showPros" class="el-upload__tip" slot="tip">
        {{ txt }}
      </div>
    </el-upload>
  </div>
</template>

<script>
//  npm i -S exceljs file-saver luckyexcel
import LuckyExcel from "luckyexcel";
import message from "@/mixin/message";

export default {
  name: "varifyDialog",
  mixins: [message],
  props: {
    btnUpload: {
      defalut: false,
      type: Boolean
    },
    upTxt: {
      default: "点击导入",
      type: String,
    },
    txt: {
      default: "请先上传xlsx文件后，再进行执行操作",
      type: String,
    },
    multiple: {
      default: false,
      type: Boolean,
    },
    limit: {
      default: 10,
      type: Number,
    },
    showPros: {
      default: false,
      type: Boolean,
    },
    tag: {
      default: "excel",
      type: String,
    },
    sheetName: {
      type: Array,
      // default: [],
    },
    toolType: {
      type: String
    },
    showFileList: {
      default: false,
      type: Boolean,
    },
  },
  data () {
    return {
      fileList: [],
      maxRow: 1000
    };
  },
  watch: {
    toolType: {
      handler (newval, oldval) {
        const vm = this
        switch (newval) {
          case 'DMP':
          case '京东展位':
          case '京东直投':
          case '京腾魔方人群定向':
          case '京腾魔方人群':
          case '购物触点':
            vm.maxRow = 1500
            break
          case '快车更新创意状态':
            vm.maxRow = 5000
            break
          case '数坊人群计算':
            vm.maxRow = 1000
            break
          case '数坊人群圈选':
            vm.maxRow = 1000
            break
          case '创意上传':
            vm.maxRow = 1000
            break
          default:
            vm.maxRow = 3000
            break
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted () {
    // console.log(Window.LuckyExcel)
  },
  methods: {
    // 文件状态改变时的钩子
    fileChangeBtn (file, fileList) {
      const vm = this;
      console.log('????')
      vm.$msgClose()
      vm.$emit('beforeeve')
      let extension = file.name.substring(file.name.lastIndexOf(".") + 1);
      let size = file.size / 1024 / 1024;
      let extArr = ['JPG', 'JPEG', 'PNG']
      if (!extArr.includes(extension.toUpperCase())) {
        vm.$msg({
          type: "error",
          msg: `图片【${file.name}】添加失败，请检查图片格式`
        });
        vm.$emit('closeLoading')
        return;
      }
      if (size > 0.5) {
        vm.$msg({
          type: "warning",
          msg: `图片【${file.name}】添加失败，请检查图片大小`
        });
        vm.$emit('closeLoading')
        return;
      }
      let url = window.URL.createObjectURL(file.raw); // 得到bolb对象路径，可当成普通的文件路径一样使用，赋值给src;
      let imgObj = new Image();
      imgObj.src = url
      imgObj.onload = function () {
        vm.fileList = [];
        if (imgObj.width !== 350 || imgObj.height !== 350) {
          vm.$msg({
            type: "warning",
            msg: `图片【${file.name}】添加失败，请检查图片尺寸`
          });
          vm.$emit('closeLoading')
          return;
        }
        vm.fileList.push(file.raw);
        vm.$emit("getFile", vm.fileList);
      }
    },
    fileChange (file, fileList) {
      const vm = this;
      vm.$emit('beforeeve')
      let extension = file.name.substring(file.name.lastIndexOf(".") + 1);
      let size = file.size / 1024 / 1024;
      vm.fileList = [];
      let extArr = ['XLSX', 'XLS', 'CSV']
      if (!extArr.includes(extension.toUpperCase())) {
        vm.$msg({
          type: "error",
          msg: "只能上传excel文件"
        });
        return;
      }
      if (vm.tag === "excel" && size > 3) {
        vm.$msg({
          type: "warning",
          msg: "文件大小不得超过3M"
        });
        return;
      } else if (size > 50) {
        vm.$msg({
          type: "warning",
          msg: "文件大小不得超过50M"
        });
        return
      }
      if (vm.tag === "excel") {
        debugger
        let target_sheets = [];
        let sheetArr = []
        let sheetInfoBox = []
        LuckyExcel.transformExcelToLucky(
          file.raw,
          (exportJson, luckysheetfile) => {
            debugger
            for (let val of exportJson.sheets) {
              if (vm.sheetName.indexOf(val.name) !== -1) {
                sheetArr.push(val.name)
                val.celldata.forEach((item, index) => {
                  if (item.v && item.v.ct && item.v.ct.fa === 'm/d/yy') {
                    item.v.ct.fa = 'yyyy-MM-dd'
                  }
                })
                // 限制读取最大行数
                let maxIdx = val.celldata[val.celldata.length - 1].r
                if (maxIdx > vm.maxRow) {
                  sheetInfoBox.push({
                    stName: val.name,
                    stMax: maxIdx
                  })
                  let idxArr = []
                  for (let i in val.celldata) {
                    if (val.celldata[i].r === vm.maxRow) {
                      idxArr.push(Number(i))
                    }
                  }
                  val.celldata = val.celldata.slice(0, idxArr[idxArr.length - 1] + 1)
                }
                val.index = parseInt(val.index);
                val.order = parseInt(val.order);
                val.status = parseInt(val.status);
                val.showGridLines = parseInt(val.showGridLines);
                target_sheets.push(val)
              }
            }
            window.luckysheet.destroy();
            if (sheetArr.length === 0) {
              vm.$msg({
                type: "warning",
                msg: " 无适配sheet"
              });
              vm.$emit("getFile", 'wrong');
              return
            }
            if (sheetInfoBox.length > 0) {
              // if (maxIdx > vm.maxRow) {
              vm.openMessageBox({
                type: "warning",
                showClose: true,
                tipTitle: `检测到数据过多!`,
                tipContent: `【确定】所有Sheet都将仅处理前${vm.maxRow}条数据，【取消】将取消操作!`,
                showCancelButton: true,
                confirmButtonFn: () => {
                  vm.$emit("openEvent", target_sheets);
                  vm.fileList.push(file.raw);
                  vm.$emit("getFile", vm.fileList);
                },
                cancelButtonFn: () => {
                  vm.$emit("close", 0);
                }
              });
            } else {
              vm.$emit("openEvent", target_sheets);
              vm.fileList.push(file.raw);
              vm.$emit("getFile", vm.fileList);
            }
          }
        );
      } else {
        vm.fileList.push(file.raw);
        vm.$emit("getFile", vm.fileList);
      }
    },
    // 点击文件列表文件名的时候
    handlePreview (file) {
      const vm = this;
    },
    //文件列表移除时的钩子
    remfile (file, fileList) {
      this.fileList.pop("file");
      this.$emit("getFile", this.fileList);
    },
    // 自动上传开启 -- 文件上传成功时的钩子
    handleSuccess (res, file, fileList) {
      this.$message.success("文件上传成功");
      this.fileList = [];
      this.$emit("getFile", this.fileList);
    },
    // 自动上传开启 --  文件上传失败时的钩子
    handleError (err, file, fileList) {
      this.$message.error("文件上传失败");
    },
    UploadUrl: function () {
      // 因为action参数是必填项，我们使用二次确认进行文件上传时，直接填上传文件的url会因为没有参数导致api报404，所以这里将action设置为一个返回为空的方法就行，避免抛错
      return "";
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/views/index";

.upbox {
  height: 100%;
  line-height: 1;

  div:first-child {
    height: 100%;
  }
}
</style>
