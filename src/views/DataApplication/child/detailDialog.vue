<template>
  <!-- 查看详情 -->
  <el-dialog
    title="修改预算"
    :visible.sync="show"
    width="35%"
    @close="closeDialog"
    custom-class="dialogEdit tableDialog1"
    :close-on-click-modal="false"
  >
    <el-form ref="form" :model="form" class="formObj">
      <el-row>
        <el-col class="flexCol">
          <el-form-item
            v-for="(item, idx) in form.budgetJson"
            :key="idx"
            label=""
            :prop="'budgetJson.' + idx + '.threshold'"
            :rules="rules.budget"
          >
            <el-input
              placeholder="预算"
              v-model.trim="item.threshold"
              :maxlength="9"
              clearable
            >
              <template slot="prepend">{{ item.bidding_date }}</template>
            </el-input>
            <!-- <span
          v-if="form.budgetJson.length > 1"
          class="delicon el-icon-delete"
          @click="delBudgetEvent(item, idx)"
        ></span> -->
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <a class="btnnormal btnnormal_down marginR" @click="closeDialog">
        <div class="el-icon-close btnSize">取消</div>
      </a>
      <el-button
        v-waves
        class="el-icon-finished"
        type="primary"
        @click="sendlist"
        >保存</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
import { viewDetails, detailsToModify } from "@/api/api.js";
export default {
  name: "DetailDialog",
  props: {
    row: {
      type: Object,
      default: {},
    },
  },
  data() {
    const checkThreshold = (rule, value, callback) => {
      let res = Number(value);
      if (!res) {
        callback(new Error("预算为数字类型"));
        return;
      }
      callback();
    };
    return {
      show: true,
      changelist: [], //修改过后的列表
      form: {
        budgetJson: [],
      },
      rules: {
        budget: { required: true, validator: checkThreshold },
      },
    };
  },
  created() {
    this.getDetail(this.row);
  },
  methods: {
    // 获取详情
    getDetail(row) {
      const vm = this;
      viewDetails({
        bidding_id: row.bidding_id,
        activity_id: row.activity_id,
      }).then((res) => {
        if (res.data.code == 10000) {
          vm.form.budgetJson = res.data.data;
        } else if (res.data.code == 10000) {
          vm.$msg({ type: "warning", msg: "参数丢失" });
        } else {
          vm.$msg({ type: "error", msg: "出错了" });
        }
      });
    },
    //上传修改后的预算数据
    sendlist() {
      const vm = this;
      console.log(vm.changelist);
      vm.$refs.form.validate((valid) => {
        if (valid) {
          detailsToModify({
            id_thresholds: vm.form.budgetJson,
          }).then((res) => {
            if (res.data.code == 10000) {
              vm.$emit("close", "suc");
              vm.$msg({ msg: "更新成功" });
              vm.$message.success("更新成功");
            } else if (res.data.code == 10001) {
              vm.$msg({ type: "warning", msg: "参数丢失" });
            } else {
              vm.$msg({ type: "error", msg: "出错了" });
            }
          });
        }
      });
    },
    closeDialog() {
      this.$emit("close");
    },
  },
};
</script>
<style lang="less" scoped>
@import "../monitor/bidding.less";

.detail_body {
  padding: 0 50px;
}
/deep/.tableDialog1 {
  .el-dialog__body {
    max-height: 500px;
  }
}
.flexCol {
  padding-left: 0 !important;
  .el-form-item {
    flex-basis: 46%;
    &:nth-child(even) {
      padding-right: 0;
    }
  }
}
</style>
