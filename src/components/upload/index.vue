<template>
  <div class="upbox">
    <!--   accept=".xlsx,.xls,.csv"-->
    <el-upload
      drag
      accept=".xlsx,.csv"
      :auto-upload="false"
      :show-file-list="showFileList"
      :action="UploadUrl()"
      :on-remove="remfile"
      :on-preview="handlePreview"
      :on-change="fileChange"
      :on-success="handleSuccess"
      :on-error="handleError"
      :file-list="fileList"
      :multiple="multiple"
    >
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
export default {
  name: "varifyDialog",
  props: {
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
    showPros: {
      default: false,
      type: Boolean,
    },
    tag: {
      default: "excel",
      type: String,
    },
    sheetName: {
      default: "Sheet1",
      type: String,
    },
    showFileList: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      fileList: [],
    };
  },
  mounted() {
    console.log(Window.LuckyExcel)

  },
  methods: {
    // 文件状态改变时的钩子
    fileChange(file, fileList) {
      const vm = this;
      vm.fileList = [];
      let extension = file.name.substring(file.name.lastIndexOf(".") + 1);
      let size = file.size / 1024 / 1024;
      if (extension !== "xlsx" && extension !== "xls" && extension !== "csv") {
        vm.$msg({ type: "error", msg: "只能上传excel文件" });
        return;
      }
      if (size > 3) {
        vm.$msg({ type: "warning", msg: "文件大小不得超过3M" });
        return;
      }
      if (vm.tag === "excel") {
        let target_sheets = [];
        let sheetArr = []
        LuckyExcel.transformExcelToLucky(
          file.raw,
          (exportJson, luckysheetfile) => {
            for (let val of exportJson.sheets ) {
              if (val.name === vm.sheetName) {
                sheetArr.push(val.name)
                val.index = parseInt(val.index);
                val.order = parseInt(val.order);
                val.status = parseInt(val.status);
                val.showGridLines = parseInt(val.showGridLines);
                target_sheets.push(val)
                break
              }
            }
            window.luckysheet.destroy();
            if (sheetArr.length === 0) {
              vm.$msg({ type: "warning", msg: " 无适配sheet" });
              return
            }
            vm.$emit("openEvent", target_sheets);
            vm.fileList.push(file.raw);
            vm.$emit("getFile", vm.fileList);
          }
        );
      }

    },
    // 点击文件列表文件名的时候
    handlePreview(file) {
      const vm = this;
    },
    //文件列表移除时的钩子
    remfile(file, fileList) {
      this.fileList.pop("file");
      this.$emit("getFile", this.fileList);
    },
    // 自动上传开启 -- 文件上传成功时的钩子
    handleSuccess(res, file, fileList) {
      this.$message.success("文件上传成功");
      this.fileList = [];
      this.$emit("getFile", this.fileList);
    },
    // 自动上传开启 --  文件上传失败时的钩子
    handleError(err, file, fileList) {
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
