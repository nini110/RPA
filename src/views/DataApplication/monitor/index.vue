<template>
  <!-- 竞标监控 -->
  <div class="biddingForMonitoring outerDiv">
    <div class="content">
      <div class="content_form">
        <div class="upobtn">
          <el-button
            v-waves
            class="el-icon-upload2"
            type="primary"
            @click="upList"
            >上传竞标
          </el-button>
        </div>
      </div>
      <div ref="tableBox" class="content_tableBox jiankong">
        <el-divider>列表</el-divider>
        <div class="tables" v-if="tableData">
          <el-table
            ref="singleTable"
            class="tableBox"
            :data="tableData"
            :highlight-current-row="true"
            :header-cell-style="{ background: '#eef0f1', color: '#606266' }"
          >
            <el-table-column
              type="index"
              width="100"
              label="序号"
              align="center"
              fixed="left"
            >
            </el-table-column>
            <el-table-column
              v-for="(item, idx) in tabList"
              :key="idx"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
            >
            </el-table-column>
            <el-table-column
              property="cheack"
              label="操作"
              fixed="right"
              width="400"
            >
              <template slot-scope="scope">
                <el-button
                  class="btn btn_info el-icon-edit"
                  type="text"
                  @click="detailEvent(scope.row)"
                >
                </el-button>
                <el-button
                  class="btn btn_info iconfont icon-jiaosexiugai"
                  type="text"
                  @click="editEvent(scope.row)"
                >
                </el-button>
                <el-button
                  class="btn btn_info iconfont icon-huodongjilu"
                  type="text"
                  @click="editActiveEvent(scope.row)"
                >
                </el-button>
                <el-button
                  class="btn btn_delete el-icon-delete"
                  type="text"
                  @click="deleteEvent(scope.row)"
                >
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="block" v-if="total">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currpage"
            :page-size="pagesize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
    <UpDialog v-if="upDialogFlag" @close="closeUpEvent"></UpDialog>
    <DetailDia
      v-if="detailFlag"
      :row="tablerow"
      @close="closeDetailEvent"
    ></DetailDia>
    <EditDia
      v-if="editFlag"
      :row="tablerow"
      @close="closeEditEvent"
      :editNum="editNum"
    ></EditDia>
  </div>
</template>

<script>
import { BidList, biddingDelete } from "@/api/api.js";
import DetailDia from "../child/detailDialog.vue";
import EditDia from "../child/editDialog.vue";
import UpDialog from "../child/uploadDialog.vue";
import message from "@/mixin/message";
export default {
  name: "Monitior",
  components: {
    UpDialog,
    DetailDia,
    EditDia,
  },
  mixins: [message],
  data() {
    return {
      username: "",
      editNum: 1,
      // 弹层flag
      upDialogFlag: false,
      detailFlag: false,
      editFlag: false,
      tabList: [
        {
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
  created() {
    this.check();
  },
  mounted() {
    this.username = localStorage.getItem("user_name");
    this.getlist();
  },
  methods: {
    // 查看列表
    getlist() {
      BidList({
        trans_name: this.username,
        limit: this.pagesize,
        page: this.currpage,
      }).then((res) => {
        if (res.data.code == 10000) {
          this.tableData = res.data.data;
          this.total = res.data.count;
        } else if (res.data.code == 10001) {
          this.$msg({ type: "warning", msg: res.data.data });
        } else {
          this.$msg({ type: "error", msg: "出错了" });
        }
      });
    },
    upList() {
      this.upDialogFlag = true;
    },
    // 关闭详情弹层
    closeDetailEvent(tag) {
      this.detailFlag = false;
      if (tag) {
        this.changelist = [];
        this.getlist();
      }
    },
    // 关闭修改弹层
    closeEditEvent() {
      const vm = this;
      vm.editFlag = false;
      vm.getlist();
    },
    // 关闭上传弹层
    closeUpEvent() {
      const vm = this;
      vm.upDialogFlag = false;
      vm.getlist();
    },
    // 详情按钮
    detailEvent(row) {
      this.detailFlag = true;
      this.tablerow = row;
    },
    // 修改人员按钮
    editEvent(row) {
      this.editFlag = true;
      this.tablerow = row;
      this.editNum = 1;
    },
    // 修改活动按钮
    editActiveEvent(row) {
      this.editFlag = true;
      this.tablerow = row;
      this.editNum = 2;
    },
    // 删除按钮
    deleteEvent(row) {
      const vm = this;
      vm.openMessageBox({
        type: "warning",
        showClose: true,
        tipTitle: `确定删除该条竞标信息: ${row.bidding_name}？`,
        confirmButtonFn: () => {
          biddingDelete({
            bidding_id: row.bidding_id,
            activity_id: row.activity_id,
          }).then((res) => {
            if (res.data.code === 10000) {
              vm.$msg({ msg: "删除成功" });
              vm.getlist();
            } else {
              vm.$msg({ type: "error", msg: res.data.msg });
            }
          });
        },
      });
    },
    //分页器功能
    handleSizeChange(val) {
      this.pagesize = val;
      this.getlist();
    },
    handleCurrentChange(page) {
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
