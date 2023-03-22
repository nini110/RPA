<template>
  <el-dialog
    :title="diaTxt"
    :visible.sync="dialogVisible"
    custom-class="dialogEdit dialogStrategy"
    :close-on-click-modal="false"
    width="30%"
    @close="closeEvent"
  >
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item label="策略名称:" prop="name">
        <el-input
          v-model="form.name"
          size="medium"
          placeholder="请输入策略名称"
        ></el-input>
      </el-form-item>
      <el-divider content-position="left">条件</el-divider>
      <el-form-item label="消耗:" prop="proportion" class="oneIpt">
        <!-- <el-col :span="2"> ≥ </el-col> -->
        <el-input-number
          v-model="form.proportion"
          :min="1"
          :max="50"
          size="medium"
          label="描述文字"
        >
        </el-input-number
        >%
      </el-form-item>
      <el-divider content-position="left">操作</el-divider>
      <el-form-item label="预算:" prop="budget_operate" class="twoIpt">
        <el-select
          v-model="form.budget_operate"
          placeholder="请选择"
          size="medium"
        >
          <el-option
            v-for="item in budgetOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-input-number
          v-model="form.budget_money"
          :min="100"
          :max="2000"
          size="medium"
          label="描述文字"
        >
        </el-input-number
        >元
      </el-form-item>
    </el-form>
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
        >{{ btnTxt }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  detailBudgetStrategy,
  addBudgetStrategy,
  updateBudgetStrategy,
} from "@/api/api.js";
export default {
  name: "DialogBudge",
  props: {
    showFlag: {
      type: Boolean,
      default: false,
    },
    username: {
      type: String,
      default: "",
    },
    editFlag: {
      type: Number,
      default: 1,
    },
    rowInfo: {
      type: Object,
      default: {},
    },
  },
  watch: {
    editFlag: {
      handler(newval, oldval) {
        const vm = this;
        switch (newval) {
          case 1:
            vm.diaTxt = "新建预算策略";
            vm.btnTxt = "保存";
            break;
          case 2:
            vm.diaTxt = "编辑预算策略";
            vm.btnTxt = "更新";
            break;
        }
      },
      immediate: true,
      deep: true,
    },
    showFlag(newval, oldval) {
      this.dialogVisible = this.showFlag;
      // 更新
      if (newval && this.editFlag === 2) {
        this.getDetail(this.rowInfo.id);
      }
    },
  },
  data() {
    return {
      diaTxt: "",
      btnTxt: "",
      dialogVisible: false,
      form: {
        name: "",
        proportion: 1,
        budget_operate: "",
        budget_money: 100,
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入策略名称",
            trigger: "blur",
          },
        ],
        proportion: [
          {
            required: true,
            message: "请选择消耗比例",
            trigger: "blur",
          },
        ],
        budget_operate: [
          {
            required: true,
            message: "请选择预算条件",
            trigger: "blur",
          },
        ],
      },
      budgetOptions: [
        {
          value: 1,
          label: "上调",
        },
        {
          value: 2,
          label: "警告",
        },
      ],
    };
  },
  mounted() {},
  methods: {
    // 关闭弹窗
    closeEvent() {
      const vm = this;
      vm.$emit("close");
    },
    // 获取详情
    getDetail(id) {
      const vm = this;
      detailBudgetStrategy({
        strategy_id: id,
      }).then((res) => {
        this.form = {
          name: res.data.data.name,
          proportion: res.data.data.proportion * 100,
          budget_operate: res.data.data.budget_operate,
          budget_money: res.data.data.budget_money,
        };
      });
    },
    // 创建策略 | 更新策略
    saveEvent() {
      const vm = this;
      vm.$refs.form.validate((valid) => {
        if (valid) {
          let data = {
            ...vm.form,
            username: vm.username,
            proportion: vm.form.proportion / 100,
          };
          if (vm.editFlag === 1) {
            addBudgetStrategy(data).then((res) => {
              if (res.data.code === 200) {
                vm.$emit("close", true);
                vm.$msg({ msg: "预算策略创建成功！" });
              } else if (res.data.code === 1) {
                vm.$msg({ type: "error", msg: res.data.msg });
              }
            });
          } else {
            data = {
              ...data,
              strategy_id: vm.rowInfo.id,
            };
            updateBudgetStrategy(data).then((res) => {
              if (res.data.code === 200) {
                vm.$emit("close", true);
                vm.$msg({ msg: "预算策略更新成功！" });
              } else if (res.data.code === 1) {
                vm.$msg({ type: "error", msg: res.data.msg });
              }
            });
          }
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import "../index";
</style>
