<template>
<!-- 出价 -->
<div class="region strategyNormal">
  <div class="centers">
    <div class="PriceTops">
      <el-form>
        <el-row>
          <el-col :span="10">
            <el-button v-waves type="primary" class="el-icon-plus btnnormal" @click="editFn(1)" size="medium">新建策略
            </el-button>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="searchStatus" placeholder="请选择状态" size="medium" clearable>
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="策略名称">
              <el-input v-model="searchName" placeholder="请输入策略名称" size="medium" class="inp" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <div>
              <el-button v-waves style="margin-left: 10px" class="el-icon-search btnnormal" type="primary" size="medium">查询
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="tabbles pricetable" ref="tabbles">
      <vxe-table ref="multipleTable" :data="tableData" stripeå round :column-config="{ resizable: true }" :row-config="{ isCurrent: true, isHover: true }" class="mytable-scrollbar" auto-resize height="auto">
        >
        <template #empty>
          <img src="@/assets/images/noneData3.png" />
        </template>
        <vxe-column type="seq" title="序号" width="5%" fixed="left"></vxe-column>
        <vxe-column field="count" title="状态" fixed="left" width="15%">
          <template slot-scope="scope">
            <div v-if="scope.row.status" class="statusDiv suc">使用中</div>
            <div v-else class="statusDiv fail">未使用</div>
          </template></vxe-column>
        <vxe-column v-for="(item, idx) in tabList" :key="idx" width="18%" :field="item.prop" :title="item.label" show-overflow="tooltip"></vxe-column>
        <vxe-column title="操作" fixed="right" width="10%">
          <template slot="header">
            操作
            <el-tooltip class="item" effect="dark" content="当状态为使用中时,不可编辑和删除" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <div v-waves class="btn btn_info" :class="{ dis: scope.row.status }" @click="editFn(2, scope.row)">
              <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                <svg class="icon svg-icon titleicon" aria-hidden="true">
                  <use xlink:href="#icon-bianjiICON"></use>
                </svg>
                <i class="el-icon-edit"></i>
              </el-tooltip>
            </div>
            <div v-waves class="btn btn_info" :class="{ dis: scope.row.status }" @click="deleteFn(scope.row)">
              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <i class="el-icon-circle-close"></i>
                <!-- <svg class="icon svg-icon titleicon" aria-hidden="true">
                    <use xlink:href="#icon-shanchu1"></use>
                  </svg> -->
              </el-tooltip>
            </div>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
    <div class="block">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <!-- 出价调整策略弹窗 -->
    <div class="dialog">
      <DialogPrice ref="dialogForm_Price" :username="username" :rowInfo="rowInfo" :editFlag="editFlag" :showFlag="showPriceDialog" @close="closeEvent"></DialogPrice>
      <DialogBudge ref="dialogForm_Budge" :username="username" :rowInfo="rowInfo" :editFlag="editFlag" :showFlag="showBudgeDialog" @close="closeEvent"></DialogBudge>
      <DialogPlan ref="dialogForm_Plan" :username="username" :rowInfo="rowInfo" :editFlag="editFlag" :showFlag="showPlanDialog" @close="closeEvent"></DialogPlan>
    </div>
  </div>
</div>
</template>

<script>
import {
  strategyList,
  budgetStrategyList,
  planStrategyList,
} from "@/api/api.js";
import message from "@/mixin/message";
import opt from "../../option.js";
import DialogPrice from "./dialog_price.vue";
import DialogBudge from "./dialog_budge.vue";
import DialogPlan from "./dialog_plan.vue";
export default {
  components: {
    DialogPrice,
    DialogBudge,
    DialogPlan,
  },
  props: {
    activeTab: {
      type: String,
      default: null,
    },
  },
  mixins: [message],
  data() {
    return {
      username: "",
      showPriceDialog: false,
      showBudgeDialog: false,
      showPlanDialog: false,
      searchStatus: "",
      searchName: "",
      options: [{
          value: "选项1",
          label: "所有",
        },
        {
          value: "选项2",
          label: "执行中",
        },
        {
          value: "选项3",
          label: "闲置",
        },
      ],
      tableData: [],
      tabList: [],
      multipleSelection: [],
      rowInfo: {},
      editFlag: 1, // 新建 更新 标识
      currentPage: 1,
      pagesize: 10,
      total: 0,
    };
  },
  watch: {
    activeTab: {
      handler(newval, oldval) {
        const vm = this;
        vm.getList();
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    // this.getList();
    this.username = localStorage.getItem("user_name");
  },
  mounted() {
    this.tabList = opt.tablist_strategy;
  },
  methods: {
    closeEvent(tag) {
      const vm = this;
      if (vm.activeTab === "first") {
        vm.$refs.dialogForm_Price.form = {
          name: "",
          data: "",
          count: 1,
          condition: "",
          proportion: 1,
          bid_operate: "",
          bid_proportion: 1,
        };
      } else if (vm.activeTab === "second") {
        vm.$refs.dialogForm_Budge.form = {
          name: "",
          proportion: 1,
          budget_operate: "",
          budget_money: 100,
        };
      } else {
        vm.$refs.dialogForm_Plan.form = {
          name: "",
          proportion: "",
          condition: "",
          count: "",
          plan_operate: 1, //计划
        };
      }
      vm.showPriceDialog = false;
      vm.showBudgeDialog = false;
      vm.showPlanDialog = false;
      vm.rowInfo = null;
      vm.currentPage = 1;
      vm.pagesize = 10;
      if (tag) {
        vm.getList();
      }
    },
    // 删除事件
    deleteFn(row) {
      const vm = this;
      if (row.status) {
        return false;
      }
      vm.openMessageBox({
        type: "warning",
        showClose: true,
        showCancelButton: true,
        tipTitle: "确定删除当前策略信息：",
        curItem: `${row.name}？`,
        confirmButtonFn: () => {
          vm.$msg({
            type: "warning",
            msg: "暂无删除接口功能"
          });
        },
      });
    },
    // 编辑按钮
    editFn(tag, row) {
      const vm = this;
      if (row && row.status) {
        return false;
      }
      vm.editFlag = tag;
      if (vm.activeTab === "first") {
        vm.showPriceDialog = true;
      } else if (vm.activeTab === "second") {
        vm.showBudgeDialog = true;
      } else {
        vm.showPlanDialog = true;
      }
      if (tag === 2) {
        // 编辑
        vm.rowInfo = row;
      }
    },
    // 获取列表数据
    getList() {
      const vm = this;
      let params = {
        page: vm.currentPage,
        per_page: vm.pagesize,
      };
      if (vm.activeTab === "first") {
        strategyList(params).then((res) => {
          vm.tableData = res.data.data.data;
          vm.total = res.data.data.total_count;
        });
      } else if (vm.activeTab === "second") {
        budgetStrategyList(params).then((res) => {
          this.tableData = res.data.data.data;
          this.total = res.data.data.total_count;
        });
      } else {
        planStrategyList(params).then((res) => {
          this.tableData = res.data.data.data;
          this.total = res.data.data.total_count;
        });
      }
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/views/index.less";
@import "../index.less";
@import "../../items/index.less";
</style>
