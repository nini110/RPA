<template>
  <div>
    <el-upload
      drag
      :auto-upload="false"
      accept=".xlsx"
      :action="UploadUrl()"
      :on-remove="remfile"
      :before-upload="beforeUploadFile"
      :on-change="fileChange"
      :on-success="handleSuccess"
      :on-error="handleError"
      :file-list="fileList"
      style="width: 320px"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">
        请先上传xlsx文件后，再进行执行操作
      </div>
    </el-upload>
    <div style="width: 346px">
      <el-progress
        v-if="!progressPercent"
        :percentage="progressPercent"
      ></el-progress>
      <el-progress
        v-if="progressPercent"
        :percentage="progressPercent"
        status="success"
      ></el-progress>
    </div>
  </div>
</template>
<script>
export default {
  name: "varifyDialog",
  props: {
    progressPercent: {
      default: 0,
      type: Number,
    },
  },
  data() {
    return {
      fileList: []
    };
  },
  methods: {
    // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
    beforeUploadFile(file) {
      let extension = file.name.substring(file.name.lastIndexOf(".") + 1);
      let size = file.size / 1024 / 1024;
      if (extension !== "xlsx") {
        this.$message.warning("只能上传后缀是.xlsx的文件");
      }
      if (size > 50) {
        this.$message.warning("文件大小不得超过50M");
      }
    },
    // 文件状态改变时的钩子
    fileChange(file, fileList) {
      this.fileList.push(file.raw);
    //   this.progressPercent = 0;
      this.$emit('getFile', this.fileList)
    },
    //文件列表移除时的钩子
    remfile(file, fileList) {
      this.fileList.pop("file");
      this.$emit('getFile', this.fileList)
    },
    // 文件上传成功时的钩子
    handleSuccess(res, file, fileList) {
      this.$message.success("文件上传成功");
      this.fileList = [];
      this.$emit('getFile', this.fileList)
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
