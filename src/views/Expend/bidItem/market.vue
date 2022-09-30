<template>
  <!-- 出价 -->
  <div class="strategyNormal">
    <div class="centers">
      <div class="PriceTops">
        <el-form>
          <el-row>
            <el-col :span="10">
              <el-form-item>
                <el-button
                  v-waves
                  type="primary"
                  class="el-icon-plus btnnormal"
                  @click="editFn"
                  >新增市场费账号
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="tabbles pricetable" ref="tabbles">
        <vxe-table
          ref="multipleTable"
          :data="tableData"
          stripe
          round
          :column-config="{ resizable: true }"
          :row-config="{ isCurrent: true, isHover: true }"
          class="mytable-scrollbar"
          auto-resize
          height="auto"
        >
          >
          <template #empty>
            <img src="@/assets/images/noneData3.png" />
          </template>
          <vxe-column
            type="seq"
            title="序号"
            width="5%"
            fixed="left"
          ></vxe-column>
          <vxe-column
            v-for="(item, idx) in tabList"
            :key="idx"
            :field="item.prop"
            :title="item.label"
            show-overflow="tooltip"
          ></vxe-column>
          <vxe-column title="操作" fixed="right" width="10%">
            <template slot="header">
              操作
              <el-tooltip
                class="item"
                effect="dark"
                content="当状态为使用中时,不可编辑和删除"
                placement="top"
              >
                <i class="el-icon-question"></i>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <div
                v-waves
                class="btn btn_info"
                :class="{ dis: scope.row.status }"
                @click="deleteFn(scope.row)"
              >
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="删除"
                  placement="top"
                >
                  <svg class="icon svg-icon titleicon" aria-hidden="true">
                    <use xlink:href="#icon-lajitong"></use>
                  </svg>
                </el-tooltip>
              </div>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
      <div class="block">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
      <!-- 出价调整策略弹窗 -->
      <div class="dialog">
        <DialogMarket ref="markDia" :showFlag="showFlag" @close="closeEvent"></DialogMarket>
      </div>
    </div>
  </div>
</template>
  
  <script>
import { marketIDList, delMarketID } from "@/api/api.js";
import message from "@/mixin/message";
import DialogMarket from "./addMarket.vue";
export default {
  components: {
    DialogMarket,
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
      tableData: [],
      tabList: [
        {
          label: "项目ID",
          prop: "biddingId",
        },
        {
          label: "项目名称",
          prop: "biddingName",
        },
        {
          label: "指标",
          prop: "account",
        },
        {
          label: "日期",
          prop: "date",
        },
      ],
      showFlag: false,
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
    this.username = localStorage.getItem("user_name");
    this.getList();
  },
  mounted() {},
  methods: {
    closeEvent(tag) {
      const vm = this;
      vm.$refs.markDia.form.bidding_id = ''
      vm.$refs.markDia.form.bidding_name = ''
      vm.$refs.markDia.form.account = ''
      vm.$refs.markDia.form.date = []
      vm.showFlag = false;
      vm.currentPage = 1;
      vm.pagesize = 10;
      if (tag) {
        vm.getList();
      }
    },
    // 删除事件
    deleteFn(row) {
      const vm = this;
      vm.openMessageBox({
        type: "warning",
        showClose: true,
        showCancelButton: true,
        tipTitle: "确定删除当前市场费账号：",
        curItem: `${row.biddingName}？`,
        confirmButtonFn: () => {
          vm.delMarketID(row.id);
        },
      });
    },
    // 新增
    editFn() {
      const vm = this;
      vm.showFlag = true;
    },
    // 删除
    delMarketID(id) {
      const vm = this;
      delMarketID({
        id,
      }).then((res) => {
        if (res.data.code === 10000) {
          vm.$msg({ msg: "删除成功！" });
          vm.getList();
        } else {
          vm.$msg({ type: "error", msg: res.data.msg });
        }
      });
    },
    // 获取列表数据
    getList() {
      const vm = this;
      let params = {
        page: vm.currentPage,
        limit: vm.pagesize,
      };
      marketIDList(params).then((res) => {
        let result = res.data.data;
        result.forEach((val, idx) => {
          vm.$set(val, "date", `${val.start_time} 至 ${val.end_time}`);
        });
        vm.tableData = result;
        vm.total = res.data.count;
      });
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
  },
};
</script>
  
  <style lang="less" scoped>
@import "@/views/index.less";
@import "../../Qianchuan/strategy/index.less";
@import "../../Qianchuan/items/index.less";
</style>
  