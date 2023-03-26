<template>
  <!-- 竞标监控 -->
  <div class="biddingForMonitoring outerDiv">
    <div class="content">
      <div class="content_form">
        <div class="upobtn">
          <el-button v-waves class="el-icon-circle-plus-outline" type="primary" @click="upList">新增计划
          </el-button>
        </div>
      </div>
      <div ref="tableBox" class="content_tableBox jiankong">
        <el-divider>列表</el-divider>
        <div class="tables" v-if="tableData">
          <vxe-table ref="singleTable" :data="tableData" stripe round :column-config="{ resizable: true }" :row-config="{ isCurrent: true, isHover: true }" class="mytable-scrollbar" auto-resize height="auto">
            >
            <template #empty>
              <img src="@/assets/images/search.png" />
              <span>空空如也</span>
            </template>
            <vxe-column type="seq" title="序号" width="5%" fixed="left"></vxe-column>
            
            <vxe-column min-width="14%" field="task_number" title="任务编号" show-overflow="tooltip"></vxe-column>
            <vxe-column min-width="18%" field="username" title="账号 / PIN" show-overflow="tooltip"></vxe-column>
            <vxe-column min-width="12%" field="user_type" title="类型" show-overflow="tooltip"></vxe-column>
            <vxe-column min-width="15%" field="log_status" title="状态" show-overflow="tooltip">
              <template slot-scope="scope">
                <div v-if="scope.row.log_status === '执行有误'" class="statusDiv fail">
                  {{ scope.row.log_status }}
                </div>
                <div v-if="scope.row.log_status === '执行中'" class="statusDiv ing">
                  {{ scope.row.log_status }}
                </div>
                <div v-if="scope.row.log_status === '执行完毕'" class="statusDiv suc">
                  {{ scope.row.log_status }}
                </div>
              </template></vxe-column>
            <vxe-column min-width="15%" field="create_time" title="创建日期" show-overflow="tooltip"></vxe-column>
            <!-- <vxe-column v-for="(item, idx) in tabList" :key="idx" min-width="15%" :field="item.prop" :title="item.label" show-overflow="tooltip"></vxe-column> -->
            <vxe-column title="操作" fixed="right" width="12%">
              <template slot-scope="scope">
                <div v-waves class="btn btn_info" @click="seeEvent(scope.row)">
                  <el-tooltip class="item" effect="dark" content="查看" placement="top">
                    <i class="el-icon-view"></i>
                  </el-tooltip>
                </div>
                <div v-if="scope.row.log_status==='执行完毕'" v-waves class="btn btn_info" @click="downEvent(scope.row)">
                  <el-tooltip class="item" effect="dark" content="下载" placement="top">
                    <i class="el-icon-download"></i>
                  </el-tooltip>
                </div>
              </template>
            </vxe-column>
          </vxe-table>
        </div>
        <div class="block" v-if="total">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currpage" :page-size="pagesize" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
      </div>
    </div>
    <fieldDia :upDialogFlag="upDialogFlag" :row="row" :fromTag="fromTag" @close="closeEvent"></fieldDia>
  </div>
  </template>
  
  <script>
  import {
    dapanonLineList,
    sfToolsDown
  } from "@/api/api.js";
  import fieldDia from "../child/fieldDialog.vue";
  import message from "@/mixin/message";
  export default {
    name: "Monitior",
    components: {
      fieldDia
    },
    mixins: [message],
    data() {
      return {
        fromTag: 1,
        pageHaseItem: 0, // 当前页有多少条数据
        username: "",
        editNum: 1,
        // 弹层flag
        upDialogFlag: false,
        //表格渲染数据
        tableData: [],
        row: null,
        //页码相关
        total: "",
        currpage: 1,
        pagesize: 10,
        timer: null
      };
    },
    created() {},
    mounted() {
      // 2 4 3 1 5 6 x1 x2 7 8  x3 x4 x5
      this.getlist()
    },
    beforeDestroy() {
      const vm = this
      clearInterval(vm.timer)
      vm.timer = null
    },
    methods: {
      // 查看列表
      getlist() {
        const vm = this
        dapanonLineList({
          tool_type: '竞争分析',
          limit: vm.pagesize,
          page: vm.currpage,
        }).then(res => {
          if (res.data.code === 10000) {
            let result = res.data;
            let hasing = result.data.some((item) => {
              return item.log_status === '执行中'
            })
            clearInterval(vm.timer)
            vm.timer = null
            if (hasing) {
              vm.timer = setInterval(() => {
                vm.getlist()
              }, 5000)
            }
            vm.tableData = result.data
            vm.total = result.count
          } else {
            vm.$msg({
              type: "error",
              msg: res.data.data || res.data.msg,
            });
          }
        })
      },
      // 新增
      upList() {
        const vm = this
        vm.fromTag = 1
        vm.upDialogFlag = true
      },
      // 关闭详情弹层
      closeEvent(tag) {
        const vm = this;
        if (tag) {
          vm.getlist()
        }
        vm.fromTag = 1
        vm.upDialogFlag = false
  
      },
      seeEvent(row) {
        this.fromTag = 2
        this.upDialogFlag = true
        this.row = row
      },
      downEvent(row) {
        const vm = this
        sfToolsDown({
          log_id: row.id,
          log_type: '数据中心竞争分析'
        }).then((res) => {
          let data = res.data;
          let url = window.URL.createObjectURL(new Blob([data]));
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", `${row.account_Pin}_${row.create_time}.xlsx`);
          document.body.appendChild(link);
          link.click();
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
  @import "../monitor/bidding.less";
  
  .outer {
    width: 200px;
    height: 200px;
    background-color: aliceblue;
    // margin-top: 50px;
    // padding-top: 1px;
    // overflow: hidden;
    // 高度塌陷 + 边界塌陷
  
    .one {
      width: 100px;
      height: 100px;
      background-color: aquamarine;
      margin-top: 40px;
    }
  }
  .bbbb {
    clear: both;
  }
  </style>
  