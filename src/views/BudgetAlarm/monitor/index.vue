<template>
  <!-- 竞标监控 -->
  <div class="biddingForMonitoring outerDiv">
    <div class="content">
      <div class="content_form">
        <div class="upobtn">
          <div class="lficon"><span class="iconfont icon-device-overview"></span><span>竞标监控</span></div>
          <el-button v-waves class="el-icon-circle-plus-outline" type="primary" @click="upList">新增计划
          </el-button>
        </div>
      </div>
      <div ref="tableBox" class="content_tableBox jiankong">
        <el-divider>列表</el-divider>
        <div class="tables" v-if="tableData">
          <vxe-table ref="singleTable" :data="tableData" stripe round :column-config="{ resizable: true }"
            :row-config="{ isCurrent: true, isHover: true }" class="mytable-scrollbar" auto-resize height="auto">
            >
            <template #empty>
              <img src="@/assets/images/search.png" />
              <span>空空如也</span>
            </template>
            <vxe-column type="seq" title="序号" width="5%" fixed="left"></vxe-column>
            <vxe-column v-for="(item, idx) in tabList" :key="idx" min-width="15%" :field="item.prop" :title="item.label"
              show-overflow="tooltip"></vxe-column>
            <vxe-column title="操作" fixed="right" width="22%">
              <template slot-scope="scope">
                <div v-waves class="btn btn_info" @click="detailEvent(scope.row)">
                  <el-tooltip class="item" effect="light" content="预算" placement="top">
                    <!-- <svg class="icon svg-icon titleicon" aria-hidden="true">
                      <use xlink:href="#icon-bianjiICON"></use>
                    </svg> -->
                    <i class="el-icon-edit"></i>
                  </el-tooltip>
                </div>
                <div v-waves class="btn btn_info" @click="editEvent(scope.row)">
                  <el-tooltip class="item" effect="light" content="人员" placement="top">
                    <!-- <svg class="icon svg-icon titleicon" aria-hidden="true">
                      <use xlink:href="#icon-renyuan"></use>
                    </svg> -->
                    <i class="el-icon-user"></i>
                  </el-tooltip>
                </div>
                <div v-waves class="btn btn_info" @click="editActiveEvent(scope.row)">
                  <el-tooltip class="item" effect="light" content="活动" placement="top">
                    <!-- <svg class="icon svg-icon titleicon" aria-hidden="true">
                      <use xlink:href="#icon-huodong"></use>
                    </svg> -->
                    <i class="el-icon-star-off"></i>
                  </el-tooltip>
                </div>
                <div v-waves class="btn btn_info" @click="deleteEvent(scope.row)">
                  <el-tooltip class="item" effect="light" content="删除" placement="top">
                    <!-- <svg class="icon svg-icon titleicon" aria-hidden="true">
                      <use xlink:href="#icon-shanchu1"></use>
                    </svg> -->
                    <i class="el-icon-circle-close"></i>
                  </el-tooltip>
                </div>
              </template>
            </vxe-column>
          </vxe-table>
        </div>
        <div class="block" v-if="total">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="currpage" :page-size="pagesize" :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
      </div>
    </div>
    <UpDialog v-if="upDialogFlag" @close="closeUpEvent"></UpDialog>
    <DetailDia v-if="detailFlag" :row="tablerow" @close="closeDetailEvent"></DetailDia>
    <EditDia v-if="editFlag" :row="tablerow" @close="closeEditEvent" :editNum="editNum"></EditDia>
  </div>
</template>

<script>
import {
  BidList,
  biddingDelete
} from "@/api/api.js";
import DetailDia from "@/views/DataApplication/child/detailDialog.vue";
import EditDia from "@/views/DataApplication/child/editDialog.vue";
import UpDialog from "@/views/DataApplication/child/uploadDialog.vue";
import message from "@/mixin/message";
export default {
  name: "Monitior",
  components: {
    UpDialog,
    DetailDia,
    EditDia,
  },
  mixins: [message],
  data () {
    return {
      pageHaseItem: 0, // 当前页有多少条数据
      username: "",
      editNum: 1,
      // 弹层flag
      upDialogFlag: false,
      detailFlag: false,
      editFlag: false,
      tabList: [{
        prop: "bidding_name",
        label: "竞标名称",
        width: 140,
      },
      {
        prop: "activity_name",
        label: "活动名称",
        width: 250,
      },
      {
        prop: "budget",
        label: "总预算",
        width: 150,
      },
      {
        prop: "trans_name",
        label: "上传人",
        width: 150,
      },
      ],
      //表格渲染数据
      tableData: [],
      tablerow: "",
      //页码相关
      total: "",
      currpage: 1,
      pagesize: 10,
    };
  },
  created () {
    // this.check();
  },
  mounted () {
    this.username = localStorage.getItem("user_name");
    this.getlist();
  },
  methods: {
    // 查看列表
    getlist () {
      const vm = this
      BidList({
        trans_name: vm.username,
        limit: vm.pagesize,
        page: vm.currpage,
      }).then((res) => {
        if (res.data.code == 10000) {
          vm.tableData = res.data.data;
          vm.total = res.data.count;
          vm.pageHaseItem = vm.tableData.length;
        } else if (res.data.code == 10001) {
          vm.$msg({
            type: "warning",
            msg: res.data.data
          });
        } else {
          vm.$msg({
            type: "error",
            msg: "出错了"
          });
        }
      });
    },
    upList () {
      this.upDialogFlag = true;
    },
    // 关闭详情弹层
    closeDetailEvent (tag) {
      this.detailFlag = false;
      if (tag) {
        this.changelist = [];
        this.getlist();
      }
    },
    // 关闭修改弹层
    closeEditEvent () {
      const vm = this;
      vm.editFlag = false;
      vm.getlist();
    },
    // 关闭上传弹层
    closeUpEvent () {
      const vm = this;
      vm.upDialogFlag = false;
      vm.getlist();
    },
    // 详情按钮
    detailEvent (row) {
      this.detailFlag = true;
      this.tablerow = row;
    },
    // 修改人员按钮
    editEvent (row) {
      this.editFlag = true;
      this.tablerow = row;
      this.editNum = 1;
    },
    // 修改活动按钮
    editActiveEvent (row) {
      this.editFlag = true;
      this.tablerow = row;
      this.editNum = 2;
    },
    // 删除按钮
    deleteEvent (row) {
      const vm = this;
      vm.openMessageBox({
        type: "warning",
        showClose: true,
        showCancelButton: true,
        tipTitle: `确定删除当前监控计划：`,
        curItem: `${row.bidding_name}？`,
        confirmButtonFn: () => {
          // 仅剩一条数据， 下一次查询需要查前一页
          let haspageInt = parseInt(vm.total / vm.pagesize);
          if (vm.pageHaseItem === 1) {
            vm.currpage = haspageInt > 1 ? haspageInt : 1;
          }
          biddingDelete({
            bidding_id: row.bidding_id,
            activity_id: row.activity_id,
          }).then((res) => {
            if (res.data.code === 10000) {
              vm.$msg({
                msg: "删除成功"
              });
              vm.getlist();
            } else {
              vm.$msg({
                type: "error",
                msg: res.data.msg
              });
            }
          });
        },
      });
    },
    //分页器功能
    handleSizeChange (val) {
      this.pagesize = val;
      this.getlist();
    },
    handleCurrentChange (page) {
      this.currpage = page;
      this.getlist();
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../index";
@import "./bidding.less";
</style>
