<template>
  <div>
    <el-upload
      drag
      :auto-upload="true"
      accept=".xlsx,.csv"
      :action="UploadUrl()"
      :on-remove="remfile"
      :before-upload="beforeUploadFile"
      :on-change="fileChange"
      :on-success="handleSuccess"
      :on-error="handleError"
      :file-list="fileList"
      :multiple="multiple"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div v-if="showPros" class="el-upload__tip" slot="tip">
        {{ txt }}
      </div>
    </el-upload>
  </div>
</template>
<script>
//  npm i -S exceljs file-saver luckyexcel
import LuckyExcel from "luckyexcel";
import { exportExcel } from "../excelDialog/export";
export default {
  name: "varifyDialog",
  props: {
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
  },
  data() {
    return {
      fileList: [],
    };
  },
  methods: {
    // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
    beforeUploadFile(file) {
      const vm = this;
      let extension = file.name.substring(file.name.lastIndexOf(".") + 1);
      let size = file.size / 1024 / 1024;
      if (extension !== "xlsx") {
        vm.$message.warning("只能上传后缀是.xlsx的文件");
      }
      if (size > 50) {
        vm.$message.warning("文件大小不得超过50M");
      }
      if (vm.tag === "excel") {
        let whiteList = ["创建人群", "更新合作方数据", "新增标签"];
        LuckyExcel.transformExcelToLucky(file, (exportJson, luckysheetfile) => {
          if (exportJson.sheets === null || exportJson.sheets.length === 0) {
            vm.$message.error("无法读取excel文件的内容，当前不支持xls文件！");
            return;
          }
          exportJson.sheets.forEach((val, idx) => {
            val.index = parseInt(val.index);
            val.order = parseInt(val.order);
            val.status = parseInt(val.status);
            val.showGridLines = parseInt(val.showGridLines);
            // val.hide = whiteList.indexOf(val.name) === -1 ? 1 : 0
          });
          window.luckysheet.destroy();
          vm.$emit("openEvent", exportJson.sheets);
        });
      }
    },
    // 文件状态改变时的钩子
    fileChange(file, fileList) {
      this.fileList = [];
      this.fileList.push(file.raw);
      this.$emit("getFile", this.fileList);
    },
    //文件列表移除时的钩子
    remfile(file, fileList) {
      this.fileList.pop("file");
      this.$emit("getFile", this.fileList);
    },
    // 文件上传成功时的钩子
    handleSuccess(res, file, fileList) {
      this.$message.success("文件上传成功");
      this.fileList = [];
      this.$emit("getFile", this.fileList);
    },
    // 文件上传失败时的钩子
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
</style>
