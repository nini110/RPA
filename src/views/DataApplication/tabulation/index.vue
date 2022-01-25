<template>
  <!-- 灵鲨制表 -->
  <div class="outerDiv">
    <div class="content">
      <div class="content_form">
        <el-form ref="form" :model="form" class="formObj" :rules="rules">
          <div class="formObj_ipt">
            <el-row>
              <el-col :span="12">
                <el-form-item label="项目:" prop="project_name">
                  <el-select
                    v-model="form.project_name"
                    placeholder="请选择项目"
                    size="medium"
                    clearable
                    @change="selectChang"
                  >
                    <el-option
                      v-for="(item, index) in itemOptions"
                      :key="index"
                      :label="item.project_name"
                      :value="item.project_name"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item class="hasdate" label="数据日期:" prop="date">
                  <el-select
                    v-model="form.type"
                    placeholder="请选择类型"
                    style="width: 130px"
                    size="medium"
                  >
                    <el-option label="日报" value="1"></el-option>
                  </el-select>
                  <el-date-picker
                    v-model="form.date"
                    type="date"
                    size="medium"
                    @change="dateChange"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                    :disabled="dateDis"
                    :picker-options="pickerOptionsStart"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="数据状态:" :error="errorStateInfo">
                  <div class="state stateItem">
                    <i
                      v-show="
                        (!dataState || dataState === '参数错误') &&
                        dataState !== 0
                      "
                      class="info el-icon-minus"
                      >选择项目和日期查询数据状态</i
                    >
                    <i v-show="dataState === 1" class="suc el-icon-check"
                      >数据已准备</i
                    >
                    <i v-show="dataState === 0" class="warn el-icon-loading"
                      >数据准备中</i
                    >
                    <i v-show="dataState === 2" class="dang el-icon-close"
                      >数据未准备</i
                    >
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div v-if="checkedItem.file" class="formObj_upload">
            <el-col :span="8">
              <el-form-item label="" :error="errorUploadInfo">
                <Upload
                  @getFile="getFileEvent"
                ></Upload>
              </el-form-item>
            </el-col>
          </div>
          <div class="formObj_button">
            <el-col :span="24">
              <a class="btnnormal_down marginR inlineButton" @click="reset">
                <div class="el-icon-refresh btnSize">重置</div>
              </a>
              <div v-if="checkedItem.file" class="inlineButton">
                <el-button
                  v-waves
                  type="primary"
                  class="el-icon-right btnnormal"
                  @click="generate()"
                  >生成
                </el-button>
              </div>
              <div v-else class="inlineButton">
                <el-button
                  v-waves
                  type="primary"
                  class="el-icon-right btnnormal"
                  @click="generate()"
                >
                  生成</el-button
                >
              </div>
            </el-col>
          </div>
        </el-form>
      </div>
      <div
        ref="tableBox"
        class="content_tableBox teshu"
        :class="outerTableHeight"
      >
        <el-divider>列表</el-divider>
        <vxe-toolbar perfect>
          <template #buttons>
            <vxe-button
              icon="el-icon-delete"
              status="perfect"
              content="批量删除"
              @click="DeleteReportAll"
            ></vxe-button>
          </template>
        </vxe-toolbar>
        <div class="tables">
          <div class="tableTab">
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
              @checkbox-all="handleSelectionChange"
              @checkbox-change="handleSelectionChange"
            >
              >
              <template #empty>
                <img src="@/assets/images/noneData3.png" />
              </template>
              <vxe-column type="checkbox" width="3%" fixed="left"></vxe-column>
              <vxe-column
                type="seq"
                title="序号"
                width="5%"
                fixed="left"
              ></vxe-column>
              <vxe-column
                min-width="15%"
                field="report_name"
                title="报表名称"
                show-overflow="tooltip"
              ></vxe-column>
              <vxe-column min-width="15%" field="status" title="状态">
                <template slot-scope="scope">
                  <div v-if="scope.row.status === 0" class="statusDiv ing">
                    生成中
                  </div>
                  <div v-if="scope.row.status === 1" class="statusDiv suc">
                    已生成
                  </div>
                  <div v-if="scope.row.status === 2" class="statusDiv fail">
                    生成失败
                  </div>
                </template></vxe-column
              >
              <vxe-column
                min-width="15%"
                field="data_date"
                title="数据日期"
              ></vxe-column>
              <vxe-column
                min-width="15%"
                field="create_time"
                title="创建时间"
              ></vxe-column>
              <vxe-column title="操作" fixed="right" width="10%">
                <template slot-scope="scope">
                  <div
                    v-waves
                    class="btn btn_info"
                    :class="{ dis: scope.row.status !== 1 }"
                    @click="downEvent(scope.row)"
                  >
                    <svg class="icon svg-icon titleicon" aria-hidden="true">
                      <use xlink:href="#icon-download"></use>
                    </svg>
                  </div>
                  <div
                    v-waves
                    class="btn btn_info"
                    :class="{ dis: scope.row.status === 0 }"
                    @click="deleteEvent(scope.row)"
                  >
                    <svg class="icon svg-icon titleicon" aria-hidden="true">
                      <use xlink:href="#icon-lajitong"></use>
                    </svg>
                  </div>
                </template>
              </vxe-column>
            </vxe-table>
          </div>
        </div>
        <!-- 分页器 -->
        <div class="block" v-if="total">
          <el-pagination
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            :current-page.sync="currpage"
            :page-size="pagesize"
            background
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  selectItem,
  dataState,
  makeAReport,
  DownloadReport,
  ObjectList,
  DeleteReport,
  ReportStatus,
} from "@/api/api.js";
import Upload from "@/components/upload";
import message from "@/mixin/message";
export default {
  name: "Tabulation",
  components: {
    Upload,
  },
  mixins: [message],
  data() {
    return {
      errorStateInfo: "",
      errorUploadInfo: "",
      dateDis: true,
      itemOptions: null,
      form: {
        project_name: "",
        type: "1",
        date: "",
      },
      dataState: "", // 数据状态
      checkedItem: {},
      tableData: [],
      fileList: [], // excel文件列表
      outerTableHeight: "cls2",
      pickerOptionsStart: {
        disabledDate: (time) => {
          return time.getTime() >= new Date().getTime();
        },
      },
      rules: {
        project_name: [
          {
            required: true,
            message: "请选择项目",
            trigger: "change",
          },
        ],
        date: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
      },
      multipleSelection: "",
      timer: null,
      pagesize: 10,
      currpage: 1,
      total: null,
    };
  },
  computed: {
    project_name() {
      return this.form.project_name;
    },
  },
  watch: {
    checkedItem: {
      handler(newval, oldval) {
        const vm = this;
        if (newval.file) {
          vm.outerTableHeight = "cls1";
        } else {
          vm.outerTableHeight = "cls2";
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.check();
    this.getSelectItem();
  },
  methods: {
    getFileEvent(val) {
      this.fileList = val;
    },
    // 下载
    downEvent(row) {
      const vm = this;
      if (row.status !== 1) {
        return false;
      }
      vm.multipleSelection = row.id;
      vm.fileName = row.report_name;
      DownloadReport({
        id: vm.multipleSelection,
      }).then((res) => {
        if (res.data.code) {
          alert("错误");
        } else {
          let data = res.data;
          let url = window.URL.createObjectURL(new Blob([data]));
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", vm.fileName);
          document.body.appendChild(link);
          link.click();
        }
      });
    },
    // 获取下拉款项目选项
    getSelectItem() {
      const vm = this;
      selectItem().then((res) => {
        vm.itemOptions = res.data.data.data;
      });
    },
    // 获取表格项目列表信息
    getTableData() {
      const vm = this;
      ObjectList({
        project_name: vm.form.project_name,
        page: vm.currpage,
        per_page: vm.pagesize,
      }).then((res) => {
        if (res.data.msg === "success") {
          vm.tableData = res.data.data.data;
          vm.total = res.data.data.total_count;
        } else {
          vm.tableData = [];
          vm.total = null;
          vm.$msg({ type: "error", msg: res.data.msg });
        }
      });
    },
    // 项目变更事件
    selectChang(val) {
      const vm = this;
      vm.form.date = "";
      vm.dataState = "";
      vm.fileList = [];
      vm.dateDis = true;
      if (val) {
        vm.dateDis = false;
        for (let i of vm.itemOptions) {
          if (i.project_name === val) {
            vm.checkedItem = i;
          }
        }
        vm.getTableData();
      } else {
        vm.checkedItem = {};
        vm.tableData = [];
        vm.total = null;
      }
    },
    // 获取数据状态
    dateChange(val) {
      const vm = this;
      if (val) {
        // 数据状态
        dataState({
          ...vm.form,
        }).then((res) => {
          vm.dataState = res.data.data.status;
          if (res.data.mag === 1) {
            vm.generate();
          }
        });
      } else {
        vm.dataState = "";
      }
    },
    // 生成报表
    generate() {
      const vm = this;
      vm.loading = true;
      vm.$refs.form.validate((valid) => {
        if (valid) {
          if (vm.checkedItem.file) {
            vm.errorUploadInfo =
              vm.fileList && vm.fileList.length !== 0 ? "" : "请上传文件";
            if (!vm.errorUploadInfo && vm.dataState === 1) {
              vm.createRepo();
            }
          } else {
            if (vm.dataState === 1) {
              vm.createRepo();
            }
          }
        }
      });
    },
    // 生成报表接口
    createRepo() {
      const vm = this;
      makeAReport({
        project_name: vm.form.project_name,
        date: vm.form.date,
        file: vm.fileList[0],
        username: localStorage.getItem("user_name"),
      }).then((res) => {
        vm.getTableData();
        if (res.data.msg === "success") {
          vm.$msg({ type: "warning", msg: "生成中" });
        } else {
          vm.$msg({ type: "error", msg: res.data.msg });
        }
        vm.timer = window.setInterval(() => {
          vm.ReportStatus(res.data.data.data);
        }, 5000);
        vm.loading = false;
        if (res.data.msg !== "该报表已生成,请前去下载") {
          vm.tableData.unshift(res.data.data);
        }
      });
    },
    //获取生成的报表数据状态
    ReportStatus(val) {
      const vm = this;
      ReportStatus({
        id: val.id,
      }).then((res) => {
        if (res.data.data.status !== 0) {
          clearInterval(vm.timer);
          vm.getTableData();
        }
      });
    },
    // 删除事件
    delApi() {
      const vm = this;
      console.log(vm.multipleSelection);
      DeleteReport({
        id: vm.multipleSelection,
      }).then((res) => {
        if (res.data.code === 200) {
          vm.$msg({ msg: "删除成功！" });
          vm.multipleSelection = "";
          vm.getTableData();
        } else {
          vm.$msg({ type: "error", msg: res.data.msg });
        }
      });
    },
    // 删除
    deleteEvent(row) {
      const vm = this;
      if (row.status === 0) {
        return false;
      }
      vm.multipleSelection = "";
      vm.openMessageBox({
        type: "warning",
        showClose: true,
        showCancelButton: true,
        tipTitle: `确定删除当前报表信息：`,
        curItem: `${row.report_name}？`,
        confirmButtonFn: () => {
          vm.multipleSelection = row.id;
          vm.delApi();
        },
      });
    },
    // 批量删除
    DeleteReportAll() {
      const vm = this;
      if (vm.multipleSelection) {
        vm.openMessageBox({
          type: "warning",
          showClose: true,
          showCancelButton: true,
          tipTitle: "确定删除所选中的报表？",
          confirmButtonFn: () => {
            vm.delApi();
          },
        });
      } else {
        vm.$msg({ type: "warning", msg: "没有可删除的项目！" });
      }
    },
    // table表格选择项变化时，改变multipleSelection
    handleSelectionChange({ checked, records }) {
      this.multipleSelection = "";
      for (let i = 0; i < records.length; i++) {
        this.multipleSelection += records[i].id + ",";
      }
      this.multipleSelection = this.multipleSelection.substring(
        0,
        this.multipleSelection.length - 1
      );
    },
    // 重置
    reset() {
      const vm = this;
      vm.dateDis = true;
      vm.checkedItem = [];
      vm.dataState = "";
      vm.fileList = [];
      vm.tableData = [];
      vm.total = null;
      vm.$refs.form.resetFields();
    },
    //分页器功能
    handleCurrentChange(page) {
      this.currpage = page;
      this.getTableData();
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.getTableData();
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/views/index";
.deleteAllBtn {
  display: inline-block;
  color: #606266;
  font-size: 12px;
  cursor: pointer;
  margin-bottom: 10px;
}
</style>
