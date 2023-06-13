<template>
  <!-- 出价 -->
  <div class="strategyNormal">
    <div class="centers">
      <div class="PriceTops">
        <el-form class="flexTopRow one">
          <el-form-item style="position: relative;">
            <el-tooltip class="fixtool" effect="light" content="个人账号绑定上限数量为50个" placement="top">
              <span class="el-icon-warning-outline"></span>
            </el-tooltip>
            <el-button v-waves type="primary" class="el-icon-plus btnnormal" @click="editFn">新增账号
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="tabbles pricetable" ref="tabbles">
        <vxe-table ref="multipleTable" :data="tableData" stripe round :column-config="{ resizable: true }"
          :row-config="{ isCurrent: true, isHover: true }" class="mytable-scrollbar" auto-resize height="auto">
          >
          <template #empty>
            <img src="@/assets/images/noneData3.png" />
          </template>
          <vxe-column type="seq" title="序号" width="5%" fixed="left"></vxe-column>
          <vxe-column v-for="(item, idx) in tabList" :key="idx" :field="item.prop" :title="item.label"
            show-overflow="tooltip"></vxe-column>
          <vxe-column title="操作" fixed="right" width="10%">
            <template slot="header">
              操作
            </template>
            <template slot-scope="scope">
              <div v-waves class="btn btn_info one" @click="deleteFn(scope.row)">
                <el-tooltip class="item" effect="dark" content="解绑" placement="top">
                  <i class="iconfont icon-jiebang"></i>
                </el-tooltip>
              </div>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
      <div class="block">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
      <!-- 出价调整策略弹窗 -->
      <div class="dialog">
        <AddDialog ref="markDia" :showFlag="showFlag" @close="closeEvent"></AddDialog>
      </div>
    </div>
  </div>
</template>
  
<script>
import { multiAccList, multiAccDel } from "@/api/api.js";
import message from "@/mixin/message";
import AddDialog from "./addDialog.vue";
export default {
  components: {
    AddDialog,
  },
  props: {
    activeTab: {
      type: String,
      default: null,
    },
  },
  mixins: [message],
  data () {
    return {
      tableData: [],
      tabList: [
        {
          label: "账号",
          prop: "account",
        },
        {
          label: "账号类型",
          prop: "account_typeCn",
        },
        {
          label: "主账号",
          prop: "primary_account",
        },
        {
          label: "状态",
          prop: "statusCn",
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
      handler (newval, oldval) {

      },
      immediate: true,
      deep: true,
    },
  },
  created () {
    this.getList()
  },
  mounted () { },
  methods: {
    closeEvent (tag) {
      const vm = this;
      vm.showFlag = false;
      vm.currentPage = 1;
      vm.pagesize = 10;
      if (tag) {
        vm.getList();
      }
    },
    // 删除事件
    deleteFn (row) {
      const vm = this;
      vm.openMessageBox({
        type: "warning",
        showClose: true,
        showCancelButton: true,
        tipTitle: "确定解绑当前账号：",
        curItem: `${row.account}？`,
        confirmButtonFn: () => {
          vm.api_del(row.id)
        },
      });
    },
    // 新增
    editFn () {
      const vm = this;
      vm.showFlag = true;
    },
    // 
    api_del (id) {
      const vm = this
      multiAccDel({
        id
      }).then(res => {
        if (res.data.code === 10000) {
          vm.$msg({
            type: 'success',
            msg: "解绑成功"
          });
          vm.getList();
        } else {
          vm.$msg({
            type: "error",
            msg: res.data.data || res.data.msg,
          });
        }
      })
    },
    // 获取列表数据
    getList () {
      const vm = this;
      let params = {
        page: vm.currentPage,
        page_size: vm.pagesize,
      };
      multiAccList(params).then(res => {
        if (res.data.code === 10000) {
          vm.total = res.data.total
          let result = res.data.data
          result.forEach((val, idx) => {
            vm.$set(val, 'account_typeCn', val.account_type === 1 ? '代理' : '京准通')
            vm.$set(val, 'statusCn', val.status === 1 ? '正常' : '授权异常')
          })
          vm.tableData = result
        } else {
          vm.$msg({
            type: "error",
            msg: res.data.data || res.data.msg,
          });
        }
      })

    },
    handleSizeChange (val) {
      this.pagesize = val;
      this.getList();
    },
    handleCurrentChange (val) {
      this.currentPage = val;
      this.getList();
    },
  },
};
</script>
  
<style lang="less" scoped>
@import "@/views/index.less";
@import "@/views/Qianchuan/index.less";
@import "@/views/Qianchuan/strategy/index.less";
@import "@/views/Qianchuan/items/index.less";

.fixtool {
  position: absolute;
  left: -30px;
  top: 50%;
  transform: translateY(-50%);

  &:before {
    font-size: 20px;
  }
}
</style>
  