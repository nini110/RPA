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
      <el-row>
        <el-col>
          <el-form-item label="策略名称:" prop="name">
            <el-input
              v-model="form.name"
              size="medium"
              placeholder="请输入策略名称"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-divider content-position="left">条件</el-divider>
        <el-col>
          <el-form-item label="数据:" prop="data">
            <el-select
              v-model="form.data"
              placeholder="请选择"
              size="medium"
              clearable
            >
              <el-option
                v-for="item in dataOptions1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="次数:" prop="count" class="oneIpt">
            <el-input-number
              v-model="form.count"
              :min="1"
              label="描述文字"
              size="medium"
              clearable
            >
            </el-input-number>
            次
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="条件:" prop="condition" class="twoIpt">
            <el-select
              v-model="form.condition"
              placeholder="请选择"
              size="medium"
              clearable
            >
              <el-option
                v-for="item in conditionOpt"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-input-number
              v-model="form.proportion"
              :min="1"
              :max="50"
              size="medium"
              label="描述文字"
              clearable
            ></el-input-number>
            %
          </el-form-item>
        </el-col>
        <el-divider content-position="left">操作</el-divider>
        <el-col>
          <el-form-item label="出价:" prop="bid_operate" class="twoIpt">
            <el-select
              v-model="form.bid_operate"
              placeholder="请选择"
              size="medium"
              clearable
            >
              <el-option
                v-for="item in bidOpt"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-input-number
              v-model="form.bid_proportion"
              :min="1"
              :max="50"
              size="medium"
              label="描述文字"
              clearable
            >
            </el-input-number>
            %
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button v-waves type="primary" plain @click="closeEvent" size="medium"
        >取 消
      </el-button>
      <el-button v-waves type="primary" @click="saveEvent()" size="medium"
        >{{ btnTxt }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { compile, addBidStrategy, updataBidStrategy } from "@/api/api.js";
import opt from "../../option.js";
export default {
  name: "DialogPrice",
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
            vm.diaTxt = "新建出价策略";
            vm.btnTxt = "保 存";
            break;
          case 2:
            vm.diaTxt = "编辑出价策略";
            vm.btnTxt = "更 新";
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
        data: "",
        count: 1,
        condition: "",
        proportion: 1,
        bid_operate: "",
        bid_proportion: 1,
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入策略名称",
            trigger: "blur",
          },
        ],
        data: [
          {
            required: true,
            message: "请选择数据",
            trigger: "blur",
          },
        ],
        count: [
          {
            required: true,
            message: "请选择次数",
            trigger: "blur",
          },
        ],
        condition: [
          {
            required: true,
            message: "请选择条件",
            trigger: "blur",
          },
        ],
        bid_operate: [
          {
            required: true,
            message: "请选择出价条件",
            trigger: "blur",
          },
        ],
      },
      conditionOpt: [
        {
          value: 1,
          label: "上涨",
        },
        {
          value: 2,
          label: "下降",
        },
      ],
      bidOpt: [
        {
          value: 1,
          label: "上调",
        },
        {
          value: 2,
          label: "下调",
        },
      ],
      dataOptions1: [],
      dataOptions2: [],
    };
  },
  mounted() {
    this.dataOptions1 = opt.dataOptions1;
    this.dataOptions2 = opt.dataOptions2;
  },
  methods: {
    // 关闭弹窗
    closeEvent() {
      const vm = this;
      vm.$emit("close");
    },
    // 获取详情
    getDetail(id) {
      const vm = this;
      compile({
        strategy_id: id,
      }).then((res) => {
        let result = res.data.data;
        this.form = {
          name: result.name,
          data: result.data,
          count: result.count,
          condition: result.condition,
          proportion: result.proportion * 100,
          bid_operate: result.bid_operate,
          bid_proportion: result.bid_proportion * 100,
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
            bid_proportion: vm.form.bid_proportion / 100,
          };
          if (vm.editFlag === 1) {
            addBidStrategy(data).then((res) => {
              if (res.data.code === 200) {
                vm.$emit("close", true);
                vm.$msg({ msg: "出价策略创建成功！" });
              } else if (res.data.code === 1) {
                vm.$msg({ type: "error", msg: res.data.msg });
              }
            });
          } else {
            data = {
              ...data,
              strategy_id: vm.rowInfo.id,
            };
            updataBidStrategy(data).then((res) => {
              if (res.data.code === 200) {
                vm.$emit("close", true);
                vm.$msg({ msg: "出价策略更新成功！" });
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
