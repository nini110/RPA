<template>
  <div class="itemsComp publicDiv">
    <div class="centers">
      <el-button
        v-waves
        type="primary"
        class="el-icon-plus btnnormal"
        style="margin-bottom: 20px"
        @click="createEvent(1)"
        >新建项目
      </el-button>
      <div class="tabbles itemtable" ref="tabbles">
        <el-table
          class="tableBox"
          :data="tableData"
          highlight-current-row
          :header-cell-style="{ background: '#eef0f1', color: '#606266' }"
          stripe
        >
          <el-table-column type="selection" align="center" width="100">
          </el-table-column>
          <el-table-column label="序号" type="index" fixed="left" width="100">
          </el-table-column>
          <el-table-column
            prop="project_name"
            label="项目名称"
            fixed="left"
            show-overflow-tooltip
            min-width="200"
          >
          </el-table-column>
          <el-table-column
            v-for="(item, idx) in tabList"
            :key="idx"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="castTime"
            label="投放时间"
            min-width="220"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div>{{ scope.row.castTime[0] }}</div>
              <div>{{ scope.row.castTime[1] }}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            min-width="260"
            class="caozuo"
          >
            <template slot-scope="scope">
              <div v-waves class="btn btn_info" @click="createEvent(2, scope.row.id)">
                <svg class="icon svg-icon titleicon" aria-hidden="true">
                  <use xlink:href="#icon-13edit"></use>
                </svg>
              </div>
              <div v-waves class="btn btn_info" @click="routerLink(scope.row.id, scope.row.project_name)">
                <svg class="icon svg-icon titleicon" aria-hidden="true">
                  <use xlink:href="#icon-yewukanban"></use>
                </svg>
              </div>
              <div v-waves class="btn btn_info" @click="deleteEvent">
                <svg class="icon svg-icon titleicon" aria-hidden="true">
                  <use xlink:href="#icon-lajitong"></use>
                </svg>
              </div>
            </template>
          </el-table-column>
        </el-table>
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
    deleteEvent() {
      const vm = this;
      vm.openMessageBox({
        type: "warning",
        showClose: true,
        tipTitle: "是否确认删除当前项目？",
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
        path: '/layout2/qianchuan/realTime',
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
@import "./index";
// @import "../items/index.less";
@import "../index";
</style>
