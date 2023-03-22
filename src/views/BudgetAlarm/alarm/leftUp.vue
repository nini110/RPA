<template>
  <el-form ref="form1" :model="form" :rules="rules">
    <el-row>
      <el-col :span="24">
        <el-form-item label="PIN:" prop="userName">
          <el-select
            v-model="form.userName"
            placeholder="请选择PIN"
            size="medium"
            filterable
            clearable
            @change="userChange"
          >
            <el-option
              v-for="val in options"
              :key="val.code + Math.random()"
              :label="val.name"
              :value="val.code"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="密码:" prop="passWord">
          <el-input
            :show-password="true"
            v-model.trim="form.passWord"
            size="medium"
            placeholder="请输入密码"
            clearable
            :disabled="disPwd"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="企业微信:" prop="askWho">
          <el-input
            v-model.trim="form.askWho"
            autosize
            size="medium"
            placeholder="请输入企业微信ID（以 | 分割）"
            clearable
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col style="margin-bottom: 20px">
        <el-form-item label="添加文件:" prop="file">
          <Upload
            :showPros="false"
            :multiple="false"
            :showFileList="true"
            @getFile="getFileEvent"
          ></Upload>
        </el-form-item>
      </el-col>
    </el-row>
    <div class="footer_btn">
      <a class="btnnormal btnnormal_down" @click="down">
        <div class="btnSize el-icon-download">模板</div>
      </a>
      <el-button
        v-waves
        class="el-icon-check marginL"
        type="primary"
        @click="submitEvent"
        >提交</el-button
      >
    </div>
  </el-form>
</template>
<script>
import Upload from "@/components/upload";
import { mapGetters } from "vuex";
import { alarmModuleDay, alarmModuleSet } from "@/api/api";
import { createLinkToClick } from "@/utils/public.js";
import message from "@/mixin/message";

export default {
  name: "LeftUp",
  mixins: [message],
  components: {
    Upload,
  },
  watch: {
    pinList: {
      handler(newval, oldval) {
        this.options = JSON.parse(JSON.stringify(newval));
      },
      immediate: true,
    },
    fileList(newval, oldval) {
      if (newval) {
        this.$refs.form1.validateField("file");
      }
    },
  },
  computed: {
    ...mapGetters(["pinList"]),
  },
  data() {
    const vm = this;
    const validFile = function (rule, value, callback) {
      if (vm.fileList && vm.fileList.length > 0) {
        return callback();
      } else {
        return callback(new Error("请选择文件"));
      }
    };
    return {
      form: {
        userName: "",
        passWord: "",
        askWho: '',
        file: "",
      },
      disPwd: true,
      rules: {
        userName: [{ required: true, message: "请选择PIN", trigger: "blur" }],
        passWord: [{ required: true, message: "请输入密码", trigger: "blur" }],
        askWho:  [{ required: true, message: "请输入企业微信ID", trigger: "blur" }],
        file: [{ required: true, validator: validFile, trigger: "blur" }],
      },
      fileList: [],
    };
  },
  methods: {
    getFileEvent(val) {
      this.fileList = val;
    },
    down(val) {
      const vm = this;
      alarmModuleDay().then((res) => {
        if (res.data.code === 10000) {
          createLinkToClick("http://106.14.107.148:8001" + res.data.data);
        } else {
          vm.$msg({ type: "error", msg: res.data.msg });
        }
      });
    },
    submitEvent() {
      const vm = this;
      vm.$refs.form1.validate((valid) => {
        if (valid) {
          alarmModuleSet({
            ...vm.form,
            file: vm.fileList[0],
          }).then((res) => {
            if (res.data.code === 0) {
              vm.openMessageBox({
                type: "info",
                showClose: true,
                tipTitle: res.data.msg,
                confirmButtonFn: () => {
                  
                },
              });
              // 上传完之后重置状态
              vm.$emit('close')
            }
          });
        }
      });
    },
    userChange(val) {
      const vm = this;
      vm.disPwd = val ? false : true;
      if (!val) {
        vm.form.passWord = "";
      }
    },
  },
};
</script>
<style scoped lang="less">
@import "@/views/index";
.footer_btn {
  margin-top: 30px;
  text-align: right;
}
</style>
