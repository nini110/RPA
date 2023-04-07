<template>
<!-- 京东招标 -->
<div class="biddingForMonitoring outerDiv">
  <div class="content">
    <div class="content_form">
      <div class="upobtn">
        <div class="lficon"><span class="iconfont icon-weibiaoti-"></span><span>京东市场监控</span></div>
        <el-button v-waves class="el-icon-circle-plus-outline" type="primary" @click="watchEvent(1)">新增计划
        </el-button>
      </div>
    </div>
    <div ref="tableBox" class="content_tableBox jiankong">
      <el-divider>列表</el-divider>
      <div class="tables">
        <div class="tableTab" v-show="tableData">
          <vxe-table ref="table" :data="tableData" stripe round class="mytable-scrollbar" auto-resize height="auto">
            >
            <template #empty>
              <img src="@/assets/images/search.png" />
              <span>空空如也</span>
            </template>
            <vxe-column type="seq" title="序号" width="5%" fixed="left"></vxe-column>
            <vxe-column fixed="left" title="计划名称" show-overflow="tooltip">
              <template slot-scope="scope">
                <span class="temInfoSpan" @click="watchEvent(3, scope.row)">{{
                    scope.row.project_name
                  }}</span>
              </template></vxe-column>
            <vxe-column field="status" title="状态">
              <template slot-scope="scope">
                <div class="statusDiv" :class="scope.row.class">
                  {{ scope.row.status }}
                </div>
              </template></vxe-column>
            <vxe-column field="create_date" title="创建时间"> </vxe-column>
            <vxe-column field="" title="操作" fixed="right" width="16%">
              <template slot-scope="scope">
                <div v-waves class="btn btn_info" :class="{ dis: scope.row.status==='已结束' }" @click="watchEvent(2, scope.row)">
                  <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                    <!-- <svg class="icon svg-icon titleicon" aria-hidden="true">
                        <use xlink:href="#icon-bianjiICON"></use>
                      </svg> -->
                    <i class="el-icon-edit"></i>
                  </el-tooltip>
                </div>
                <div v-waves class="btn btn_info" @click="watchEvent(4, scope.row)">
                  <el-tooltip class="item" effect="dark" content="删除" placement="top">
                    <!-- <svg class="icon svg-icon titleicon" aria-hidden="true">
                        <use xlink:href="#icon-shanchu1"></use>
                      </svg> -->
                    <i class="el-icon-circle-close"></i>
                  </el-tooltip>
                </div>
              </template></vxe-column>
          </vxe-table>
        </div>
      </div>
    </div>
  </div>
  <addPage v-if="showAddPage" @close="closeEvent" :pageTag="pageTag" :rowInfo="rowInfo"></addPage>
</div>
</template>

<script>
import addPage from "./addDialog.vue";
import message from "@/mixin/message";
import {
  pbulicList,
  pbulicDelPlan,
  pbulicSeePlan
} from "@/api/api.js";
export default {
  name: "jdBidding",
  components: {
    addPage,
  },
  mixins: [message],
  data() {
    return {
      pageTag: 1,
      pickerOptionsStart: {
        disabledDate: (time) => {
          return time.getTime() >= new Date().getTime();
        },
      },
      showAddPage: false,
      tableData: [],
      rowInfo: null,
      //分页器状态
      total: null,
      currentPage: 1,
      pagesize: 10,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取列表
    getList() {
      const vm = this;
      pbulicList({
        status: "",
      }).then((res) => {
        if (res.data.code === 10000) {
          let result = res.data.data;
          result.forEach((val, idx) => {
            switch (val.status) {
              case "待开始":
                val.class = "fail";
                break;
              case "进行中":
                val.class = "suc";
                break;
              case "已结束":
                val.class = "end";
                break;
            }
          });
          vm.tableData = result;
        } else {
          vm.$msg({
            type: "warning",
            msg: res.data.data
          });
        }
      });
    },
    searchEvent() {},
    reset() {},
    // 新增计划
    addPlanEvent() {
      this.showAddPage = true;
      this.pageTag = 1;
    },
    closeEvent(tag) {
      this.showAddPage = false;
      if (tag) {
        this.getList();
      }
    },
    editEvent() {
      this.showAddPage = true;
      this.pageTag = 2;
    },
    watchEvent(tag, row) {
      const vm = this;
      vm.rowInfo = row || null
      vm.pageTag = tag;
      if (tag === 1) {
        // 新增
        vm.showAddPage = true
      } else if (tag === 2) {
        // 编辑
        if (row.status === '已结束') {
          return
        }
        vm.showAddPage = true;
      } else if (tag === 3) {
        vm.showAddPage = true;
        // 查看
      } else {
        // 删除
        vm.openMessageBox({
          type: "warning",
          showClose: true,
          showCancelButton: true,
          tipTitle: `确定删除当前计划：`,
          curItem: `${row.project_name}？`,
          confirmButtonFn: () => {
            pbulicDelPlan({
              id: row.id,
            }).then((res) => {
              if (res.data.code == 10000) {
                vm.getList();
                vm.$msg({
                  msg: "删除成功"
                });
                vm.showAddPage = false;
              } else {
                vm.$msg({
                  type: "warning",
                  msg: res.data.data
                });
              }
            });
          },
        });
      }
    },
    deleteEvent() {},
    //分页器功能
    handleSizeChange(val) {
      this.pagesize = val;
      this.getTable(this.searchVal);
    },
    //有接口请求 每点击一页进行一次数据请求 参数页码为动态值：
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getTable(this.searchVal);
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/views/index";
@import "../../DataApplication/monitor/bidding.less";
</style>
