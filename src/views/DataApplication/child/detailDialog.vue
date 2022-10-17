<template>
  <!-- 查看详情 -->
  <el-dialog
    title="修改预算"
    :visible.sync="show"
    width="40%"
    @close="closeDialog"
    custom-class="dialogEdit tableDialog1"
    :close-on-click-modal="false"
  >
    <el-form ref="form" :model="form" class="formObj">
      <el-row :gutter="20">
        <el-col :span="19">
          <el-form-item label="生成预算" prop="rangeDate">
            <el-date-picker
              v-model="form.rangeDate"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="daterange"
              :clearable="false"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptionsStart"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button
            type="info"
            plain
            @click="createForm"
            :disabled="form.rangeDate && form.rangeDate.length === 0"
            >生成</el-button
          >
        </el-col>
        <el-col class="flexCol" :span="24">
          <el-form-item
            v-for="(item, idx) in form.budgetJson"
            :key="idx"
            label=""
            :prop="'budgetJson.' + idx + '.val'"
            :rules="rules.budget"
          >
            <el-input
              placeholder="预算"
              v-model.trim="item.val"
              :maxlength="9"
              clearable
            >
              <template slot="prepend">{{ item.date }}</template>
            </el-input>
            <span
              v-if="form.budgetJson.length > 1"
              class="delicon el-icon-delete"
              @click="delBudgetEvent(item, idx)"
            ></span>
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
import dayjs from "dayjs";

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
      }
      callback();
    };
    return {
      pickerOptionsStart: {
        disabledDate: (time) => {
          return time.getTime() <= new Date().getTime() - 24 * 60 * 60 * 1000;
        },
      },
      show: true,
      changelist: [], //修改过后的列表
      initJson: [],
      form: {
        rangeDate: [],
        budgetJson: [],
      },
      rules: {
        budget: {
          required: true,
          validator: checkThreshold,
          trigger: ["blur"],
        },
      },
    };
  },
  created() {
    this.getDetail(this.row);
  },
  computed: {
    alength() {
      return this.form.budgetJson.length;
    },
  },
  watch: {
    alength: {
      handler(newval, oldval) {
        const vm = this;
        vm.form.budgetJson.forEach((val, idx) => {
          vm.initJson.forEach((val2, idx2) => {
            if (val.date === val2.date) {
              val.val = val2.val;
            }
          });
        });
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    // 生成
    createForm() {
      const vm = this;
      if (vm.form.rangeDate && vm.form.rangeDate.length > 0) {
        let starttime = dayjs(vm.form.rangeDate[0]);
        let endtime = dayjs(vm.form.rangeDate[1]);
        let duration = endtime.diff(starttime, "day");
        let arr = new Array(duration).fill("a");
        vm.form.budgetJson = [
          {
            date: vm.form.rangeDate[0],
            val: "",
          },
        ];
        arr.forEach((val, idx) => {
          let res = dayjs(
            dayjs(vm.form.rangeDate[0]).valueOf() +
              (idx + 1) * 1000 * 60 * 60 * 24
          ).format("YYYY-MM-DD");
          vm.form.budgetJson.push({
            date: res,
            val: "",
          });
        });
      }
    },
    // 获取详情
    getDetail(row) {
      const vm = this;
      viewDetails({
        bidding_id: row.bidding_id,
        activity_id: row.activity_id,
      }).then((res) => {
        if (res.data.code == 10000) {
          res.data.data.forEach((val, idx) => {
            vm.$set(val, 'date', val.bidding_date)
            vm.$set(val, 'val', val.threshold)
          })
          vm.form.budgetJson = res.data.data;
          vm.initJson = res.data.data;
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
      vm.$refs.form.validate((valid) => {
        if (valid) {
          detailsToModify({
            bidding_id: vm.row.bidding_id,
            activity_id: vm.row.activity_id,
            bidding_threshold:vm.form.budgetJson,
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
    delBudgetEvent(item, idx) {
      const vm = this;
      vm.form.budgetJson.splice(idx, 1);
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
  padding-left: 30px !important;
}
</style>
