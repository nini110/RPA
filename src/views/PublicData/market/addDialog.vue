<template>
  <!-- 查看详情 -->
  <el-dialog
    :title="dialogTitle"
    :visible.sync="show"
    width="35%"
    @close="closeDialog"
    custom-class="dialogEdit tableDialog1"
    :close-on-click-modal="false"
  >
    <el-form
      ref="form"
      :model="form"
      class="formObj"
      :rules="rules"
      :disabled="pageTag === 3"
    >
      <el-row>
        <el-col class="flexCol">
          <el-form-item label="计划名称:" prop="project_name">
            <el-input
              v-model.trim="form.project_name"
              size="medium"
              placeholder="请输入计划名称"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col class="">
          <el-form-item label="查找方式:">
            <el-radio-group v-model="form.task_type" @change="radioChangeEvent">
              <el-radio border :label="1">三级类目</el-radio>
              <el-radio border :label="2">关键词</el-radio>
              <el-radio border :label="3">SKU</el-radio>
              <el-radio border :label="4">店铺</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="form.task_type === 1">
            <el-form-item label="三级类目:" prop="category_url">
              <el-input
                v-model.trim="form.category_url"
                size="medium"
                placeholder="请输入三级类目列表页链接"
                clearable
              ></el-input>
            </el-form-item>
          </div>
          <div v-if="form.task_type === 2">
            <el-form-item label="关键词:" prop="keywords">
              <el-input
                v-model.trim="form.keywords"
                size="medium"
                placeholder="请输入关键词（品类或品牌的名称）"
                clearable
              ></el-input>
            </el-form-item>
          </div>
          <div v-if="form.task_type === 3">
            <el-form-item label="SKU:" prop="skus">
              <el-input
                v-model.trim="form.skus"
                size="medium"
                placeholder="请输入SKU（多个SKU用英文逗号隔开）"
                clearable
              ></el-input>
            </el-form-item>
          </div>
          <div v-if="form.task_type === 4">
            <el-form-item label="店铺名称:" prop="shops">
              <el-input
                v-model.trim="form.shops"
                size="medium"
                placeholder="请输入店铺名称"
                clearable
              ></el-input>
            </el-form-item>
          </div>

          <div
            v-if="
              form.task_type === 1 ||
              form.task_type === 2 ||
              form.task_type === 4
            "
          >
            <el-form-item label="排序条件:" prop="sorted_type">
              <el-select
                v-model="form.sorted_type"
                placeholder="请选择排序条件"
              >
                <el-option
                  v-for="item in sorted_typeOptions"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="数量:" prop="limit_num">
              <el-input-number
                v-model="form.limit_num"
                :min="1"
                :max="10"
              ></el-input-number>
            </el-form-item>
          </div>
        </el-col>
        <el-col class="flexCol">
          <el-form-item label="提取维度:" prop="checkedActions">
            <el-checkbox
              :indeterminate="form.isIndeterminate"
              v-model="form.checkAll"
              @change="actionEventAll"
              >全选</el-checkbox
            >
            <el-checkbox-group
              v-model="form.checkedActions"
              @change="actionEvent"
            >
              <el-checkbox
                v-for="item in actionOptions"
                :label="item"
                :key="item.id"
              >
                <el-tooltip
                  v-if="item.id === 'activity'"
                  effect="dark"
                  content="包含京东秒杀、优惠券、活动"
                  placement="bottom"
                >
                  <span>{{ item.activityName }} <i class="el-icon-warning"></i> </span>
                </el-tooltip>
                <span v-else>{{ item.activityName }}</span>
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col class="flexCol">
          <el-form-item label="监控周期:" prop="rangedate">
            <el-date-picker
              v-model="form.rangedate"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptionsStart"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="flexCol">
          <el-form-item label="发送邮件:" prop="send_email">
            <el-input
              v-model.trim="form.send_email"
              type="textarea"
              clearable
              size="medium"
              placeholder="请输入邮箱地址（多个邮箱地址用英文逗号隔开）"
            ></el-input>
            <el-tooltip
              class="dateitem"
              effect="dark"
              content="邮件发送时间为每天10点"
              placement="bottom-start"
            >
              <span class="el-icon-warning"></span>
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <span slot="footer" class="dialog-footer" v-if="pageTag !== 3">
      <a class="btnnormal btnnormal_down marginR" @click="closeDialog">
        <div class="el-icon-close btnSize">取消</div>
      </a>
      <el-button
        v-waves
        class="el-icon-finished"
        type="primary"
        @click="saveEvent"
        >保存</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
import { pbulicAddPlan, pbulicSeePlan, pbulicEditPlan } from "@/api/api.js";
export default {
  name: "DetailDialog",
  props: {
    pageTag: {
      type: Number,
    },
    rowInfo: {
      type: Object,
    },
  },
  data() {
    const vm = this;
    const validActions = function (rule, value, callback) {
      if (
        vm.actionOptions &&
        vm.actionOptions.length > 0 &&
        vm.form.checkedActions.length === 0
      ) {
        callback("请选择提取维度");
      } else {
        callback();
      }
    };
    return {
      dialogTitle: "",
      pickerOptionsStart: {
        disabledDate: (time) => {
          return time.getTime() <= new Date().getTime() - 24*60*60*1000;
        },
      },
      show: true,
      need_list: [],
      form: {
        project_name: "",
        task_type: 1,
        skus: "",
        shops: "",
        category_url: "",
        keywords: "",
        sorted_type: 1,
        limit_num: "",
        rangedate: "",
        send_email: "",
        isIndeterminate: false,
        checkAll: false,
        checkedActions: [],
      },
      sorted_typeOptions: [
        {
          id: 1,
          label: "销量",
        },
        {
          id: 2,
          label: "评价",
        },

        {
          id: 3,
          label: "价格",
        },
      ],
      actionOptions: [
        {
          id: "sku",
          activityName: "SKU",
        },
        {
          id: "sku_name",
          activityName: "商品名称",
        },
        {
          id: "sku_price",
          activityName: "商品价格",
        },
        {
          id: "sku_describe",
          activityName: "商品描述",
        },
        {
          id: "shop_name",
          activityName: "店铺名称",
        },
        {
          id: "frist_category",
          activityName: "一级类目",
        },
        {
          id: "second_category",
          activityName: "二级类目",
        },
        {
          id: "third_category",
          activityName: "三级类目",
        },
        {
          id: "brand",
          activityName: "品牌",
        },
        {
          id: "model",
          activityName: "型号",
        },
        {
          id: "activity",
          activityName: "商品活动",
        },
        {
          id: "comment",
          activityName: "评论数",
        },
      ],
      rules: {
        project_name: { required: true, message: "请输入计划名称" },
        skus: { required: true, message: "请输入SKU（多个SKU用英文逗号隔开）" },
        shops: { required: true, message: "请输入店铺名称" },
        category_url: { required: true, message: "请输入三级类目列表页链接" },
        keywords: {
          required: true,
          message: "请输入关键词（品类或品牌的名称）",
        },
        sorted_type: { required: true, message: "请选择排序条件" },
        limit_num: { required: true, message: "请输入数量" },
        checkedActions: { required: true, validator: validActions },
        rangedate: { required: true, message: "请选择监控周期" },
        send_email: {
          required: true,
          message: "请输入邮箱地址（多个邮箱地址用英文逗号隔开）",
        },
      },
    };
  },
  computed: {
    checkedAction() {
      return this.form.checkedActions;
    },
  },
  watch: {
    pageTag: {
      handler(newval, oldval) {
        switch (newval) {
          case 1:
            this.dialogTitle = "新增";
            break;
          case 2:
            this.dialogTitle = "编辑";
            break;
          case 3:
            this.dialogTitle = "查看";
            break;
        }
      },
      immediate: true,
    },
    checkedAction: {
      handler(newval, oldval) {
        const vm = this;
        vm.need_list = [];
        if (newval.length > 0) {
          newval.forEach((val, idx) => {
            vm.need_list.push(val.id);
          });
        }
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    const vm = this;
    if (vm.pageTag === 2 || vm.pageTag === 3) {
      vm.getDetail();
    }
  },
  methods: {
    // 获取详情
    getDetail() {
      const vm = this;
      pbulicSeePlan({
        id: vm.rowInfo.id,
      }).then((res) => {
        if (res.data.code == 10000) {
          let result = res.data.data;
          vm.form.project_name = result.project_name;
          vm.form.task_type = Number(result.task_type);
          vm.form.skus = result.skus;
          vm.form.shops = result.shops;
          vm.form.category_url = result.category_url;
          vm.form.keywords = result.keywords;
          vm.form.sorted_type = Number(result.sorted_type);
          vm.form.limit_num = Number(result.limit_num);
          vm.form.rangedate = [result.start_date, result.end_date];
          vm.form.send_email = result.send_email;
          // -----------
          result.need_list.forEach((val, idx) => {
            for (let i in vm.actionOptions) {
              if (val === vm.actionOptions[i].id) {
                vm.form.checkedActions.push(vm.actionOptions[i]);
                break;
              }
            }
          });
          let lgth = vm.form.checkedActions.length;
          vm.form.isIndeterminate = lgth > 0 && lgth < vm.actionOptions.length;
          vm.form.checkAll = lgth === vm.actionOptions.length;
        } else {
          vm.$msg({ type: "warning", msg: res.data.data });
        }
      });
    },
    closeDialog() {
      this.$emit("close");
    },
    saveEvent() {
      const vm = this;
      vm.$refs.form.validate((valid) => {
        if (valid) {
          let data = {
            ...vm.form,
            need_list: vm.need_list,
            start_date: vm.form.rangedate[0],
            end_date: vm.form.rangedate[1],
          };
          if (vm.pageTag === 1) {
            // 新增
            pbulicAddPlan(data).then((res) => {
              if (res.data.code == 10000) {
                vm.$emit("close", "suc");
                vm.$msg({ msg: "保存成功" });
              } else {
                vm.$msg({ type: "warning", msg: res.data.data });
              }
            });
          }
          if (vm.pageTag === 2) {
            // 编辑
            pbulicEditPlan({
              ...data,
              id: vm.rowInfo.id,
            }).then((res) => {
              if (res.data.code == 10000) {
                vm.$emit("close", "suc");
                vm.$msg({ msg: "保存成功" });
              } else {
                vm.$msg({ type: "warning", msg: res.data.data });
              }
            });
          }
        }
      });
    },
    // 单选切换
    radioChangeEvent() {
      const vm = this;
      vm.form.skus = "";
      vm.form.keywords = "";
      vm.form.category_url = "";
      vm.form.shops = "";
      vm.$refs.form.clearValidate([
        "skus",
        "shops",
        "category_url",
        "keywords",
        "limit_num",
        "sorted_type"
      ]);
    },
    //多选框--全选
    actionEventAll(val) {
      this.form.checkedActions = val ? this.actionOptions : [];
      this.form.isIndeterminate = false;
    },
    //多选框--单选
    actionEvent(value) {
      let checkedCount = value.length;
      this.form.checkAll = checkedCount === this.actionOptions.length;
      this.form.isIndeterminate =
        checkedCount > 0 && checkedCount < this.actionOptions.length;
    },
  },
};
</script>
<style lang="less" scoped>
.el-radio-group {
  .el-radio {
    margin-right: 1px;
  }
}
.dateitem {
  position: absolute;
  top: 37%;
  transform: translateY(-50%);
  left: -100px;
}
</style>
