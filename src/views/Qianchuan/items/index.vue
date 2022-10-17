<template>
  <div class="publicDiv outerDiv">
    <div class="content">
      <div class="content_form">
        <div class="upobtn">
          <el-button
            v-waves
            type="primary"
            class="el-icon-plus btnnormal"
            @click="createEvent(1)"
            >新建项目
          </el-button>
        </div>
      </div>
      <div class="content_tableBox jiankong">
        <el-divider>列表</el-divider>
        <div class="tables" ref="tabbles">
          <vxe-table
            ref="xtable"
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
              field="project_name"
              title="项目名称"
              fixed="left"
              width="15%"
              show-overflow="tooltip"
            ></vxe-column>
            <vxe-column
              v-for="(item, idx) in tabList"
              :key="idx"
              width="18%"
              :field="item.prop"
              :title="item.label"
              show-overflow="tooltip"
            ></vxe-column>
            <vxe-column field="castTime" title="投放时间" width="20%">
              <template slot-scope="scope">
                <div>{{ scope.row.castTime[0] }}</div>
                <div>{{ scope.row.castTime[1] }}</div>
              </template></vxe-column
            >
            <vxe-column title="操作" fixed="right" width="12%">
              <template slot-scope="scope">
                <div
                  v-waves
                  class="btn btn_info"
                  @click="createEvent(2, scope.row.id)"
                >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="编辑"
                    placement="top"
                  >
                    <svg class="icon svg-icon titleicon" aria-hidden="true">
                      <use xlink:href="#icon-13edit"></use>
                    </svg>
                  </el-tooltip>
                </div>
                <div
                  v-waves
                  class="btn btn_info"
                  @click="routerLink(scope.row.id, scope.row.project_name)"
                >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="看板"
                    placement="top"
                  >
                    <svg class="icon svg-icon titleicon" aria-hidden="true">
                      <use xlink:href="#icon-yewukanban"></use>
                    </svg>
                  </el-tooltip>
                </div>
                <div
                  v-waves
                  class="btn btn_info"
                  @click="deleteEvent(scope.row)"
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
            :page-size="pageSize"
            :current-page="currentPage"
            :pager-count="5"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <DialodEdit
      v-if="showDialog"
      :dailogFlag="dailogFlag"
      :rowID="rowID"
      @close="dialogCloseEvent"
    ></DialodEdit>
  </div>
</template>

<script>
import { getProjectList } from "@/api/api";
import DialodEdit from "./dialogEdit.vue";
import opt from "../option.js";
import message from "@/mixin/message";
// import getWidth from "@/mixin/getWidth";

export default {
  name: "Items",
  components: {
    DialodEdit,
  },
  mixins: [message],
  data() {
    return {
      subTitle: "",
      subBtnTitle: "",
      showDialog: false,
      total: 0,
      currentPage: 1,
      pageSize: 10,
      tabList: [],
      tableData: [],
      dailogFlag: 1, // 新建/更新标识
    };
  },
  created() {
    const vm = this;
    vm.getList();
  },
  mounted() {
    const vm = this;
    vm.tabList = opt.tablist_items;
  },
  methods: {
    // 获取项目列表
    getList() {
      const vm = this;
      getProjectList({
        page: vm.currentPage,
        page_size: vm.pageSize,
      }).then((res) => {
        if (res.data.count > 0) {
          vm.tableData = res.data.results;
          for (let i of vm.tableData) {
            vm.$set(i, "castTime", [i.cast_start_time, i.cast_end_time]);
          }
          vm.total = res.data.count;
        }
      });
    },
    handleSizeChange(val) {
      const vm = this;
      vm.pageSize = val;
      vm.getList(val);
    },
    handleCurrentChange(val) {
      const vm = this;
      vm.currentPage = val;
      vm.getList(val);
    },
    createEvent(val, id) {
      const vm = this;
      // val 1为新建  2为更新
      vm.dailogFlag = val;
      vm.rowID = id;
      vm.showDialog = true;
    },
    // 删除事件
    deleteEvent(row) {
      const vm = this;
      vm.openMessageBox({
        type: "warning",
        showClose: true,
        showCancelButton: true,
        tipTitle: "确定删除当前项目信息：",
        curItem: `${row.project_name}？`,
        confirmButtonFn: () => {
          vm.$msg({ type: "warning", msg: "暂无删除接口功能" });
        },
      });
    },
    dialogCloseEvent() {
      const vm = this;
      vm.showDialog = false;
      vm.getList();
    },
    routerLink(ids, names) {
      const { href } = this.$router.resolve({
        path: "/layout/qianchuan/realTime",
        query: {
          id: ids,
          name: names,
        },
      });
      window.open(href, "_blank");
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/views/index.less";
@import "@/views/DataApplication/monitor/bidding.less";
@import "./index";
</style>
