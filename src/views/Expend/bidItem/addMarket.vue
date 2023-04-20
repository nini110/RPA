<template>
  <el-dialog
    title="新增市场费账号"
    :visible.sync="dialogVisible"
    custom-class="dialogEdit dialogStrategy"
    :close-on-click-modal="false"
    width="30%"
    @close="closeEvent"
  >
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item label="项目ID:" prop="bidding_id">
        <el-input
          v-model.trim="form.bidding_id"
          size="medium"
          placeholder="请输入项目ID"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="项目名称:" prop="bidding_name">
        <el-input
          v-model.trim="form.bidding_name"
          size="medium"
          placeholder="请输入项目名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="PIN:" prop="account">
        <el-input
          v-model.trim="form.account"
          size="medium"
          placeholder="请输入PIN"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="类目:" prop="category">
        <el-input
          v-model.trim="form.category"
          size="medium"
          placeholder="请输入类目"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="日期:" prop="date" class="w100">
        <el-date-picker
          class="tophasBtn_data"
          v-model="form.date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <el-alert
      v-if="needVarify"
      :title="alertInfo"
      show-icon
      type="error"
      close-text="去授权"
      @close="gotoCheck"
    >
    </el-alert>
    <span slot="footer" class="dialog-footer">
      <a class="btnnormal btnnormal_down marginR" @click="closeEvent">
        <div class="el-icon-close btnSize">取消</div>
      </a>
      <el-button
        v-waves
        class="el-icon-check"
        type="primary"
        @click="saveEvent()"
        size="medium"
        >保存
      </el-button>
    </span>
  </el-dialog>
</template>
  
  <script>
import { addMarketID } from "@/api/api.js";
import { createLinkToClick } from "@/utils/public.js";
export default {
  name: "DialogBudge",
  props: {
    showFlag: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    showFlag(newval, oldval) {
      this.dialogVisible = this.showFlag;
    },
  },
  data() {
    return {
      dialogVisible: false,
      needVarify: false,
      alertInfo: "",
      form: {
        bidding_id: "",
        bidding_name: "",
        account: "",
        date: [],
        category: ''
      },
      rules: {
        bidding_id: [
          {
            required: true,
            message: "请输入项目ID",
            trigger: "blur",
          },
        ],
        bidding_name: [
          {
            required: true,
            message: "请输入项目名称",
            trigger: "blur",
          },
        ],
        account: [
          {
            required: true,
            message: "请输入PIN",
            trigger: "blur",
          },
        ],
        date: [
          {
            required: true,
            message: "请选择日期",
            trigger: "blur",
          },
        ],
        category: [
          {
            required: true,
            message: "请输入类目",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {},
  methods: {
    // 关闭弹窗
    closeEvent() {
      const vm = this;
      vm.needVarify = false;
      vm.$refs.form.resetFields()
      vm.$emit("close");
    },
    // 新增账号
    saveEvent() {
      const vm = this;
      vm.$refs.form.validate((valid) => {
        if (valid) {
          let data = {
            ...vm.form,
            start_time: vm.form.date[0],
            end_time: vm.form.date[1],
          };
          addMarketID(data).then((res) => {
            if (res.data.code === 10000) {
              vm.needVarify = false;
              vm.$emit("close", true);
              vm.$msg({ msg: "市场费账号新增成功！" });
            } else if (res.data.code === 40000) {
              vm.needVarify = true;
              vm.alertInfo = res.data.msg;
            } else {
              vm.needVarify = false;
              vm.$msg({ type: "error", msg: res.data.msg });
            }
          });
        }
      });
    },
    // 去授权
    gotoCheck() {
      this.needVarify = false;
      createLinkToClick(
        "https://open-oauth.jd.com/oauth2/to_login?app_key=8C210C04FA487F242E4FF455A2156E24&response_type=code&redirect_uri=http://114.67.229.243:8101/tools/get_access_token&state=20180416&scope=snsapi_base"
      );
    },
  },
};
</script>
  
  <style lang="less" scoped>
</style>
  