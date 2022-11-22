<template>
  <div class="outerDiv">
    <div class="content">
      <div class="content_form ts">
        <el-form ref="form" :model="form" class="formObj" :rules="rules">
          <div class="formObj_ipt">
            <div class="formObj_ipt_abso">
              <el-result>
                <template slot="icon">
                  <svg class="icon svg-icon titleicon" aria-hidden="true">
                    <use xlink:href="#icon-qiehuan2"></use>
                  </svg>
                </template>
                <template slot="extra">
                  <el-radio-group v-model="activeName">
                    <el-radio
                      v-for="(item, idx) in radioOpt"
                      :label="item.code"
                      :key="idx"
                      >{{ item.txt }}</el-radio
                    >
                  </el-radio-group>
                </template>
              </el-result>
            </div>
            <div class="formObj_ipt_rt" v-if="activeName === '1'">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="账号:" prop="username">
                    <el-input
                      v-model.trim="form.username"
                      size="large"
                      placeholder="请输入账号"
                      clearable
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="密码:" prop="password">
                    <el-input
                      v-model.trim="form.password"
                      size="large"
                      placeholder="请输入密码"
                      clearable
                      show-password
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col
                  :span="12"
                  v-if="$route.fullPath.indexOf('beijingMustPass') !== -1"
                >
                  <!-- 只有京准通里有类型选择 -->
                  <el-form-item label="类型:" prop="choose">
                    <el-select
                      v-model="form.choose"
                      placeholder="请选择类型"
                      size="large"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="PIN:" prop="pin">
                    <el-input
                      v-model.trim="form.pin"
                      size="large"
                      placeholder="请输入PIN"
                      clearable
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div class="formObj_ipt_rt" v-if="activeName === '2'">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="账号:" prop="username">
                    <el-input
                      v-model.trim="form.username"
                      size="large"
                      placeholder="京准通登录请输入账号，京牌代理登录请输入pin"
                      clearable
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="Cookie:" prop="cookie">
                    <el-input
                      v-model.trim="form.cookie"
                      placeholder="请输入Cookie"
                      clearable
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="formObj_upload">
            <el-form-item label="" :error="errorUpInfo">
              <el-popover
                v-if="excelData"
                placement="bottom"
                width="180"
                v-model="propVisable"
              >
                <p>创建空白Excel表格？</p>
                <div class="popverButton">
                  <el-button
                    size="mini"
                    type="text"
                    @click="propVisable = false"
                    >取消</el-button
                  >
                  <el-button type="text" size="mini" @click="popverEvent(2)"
                    >确定</el-button
                  >
                </div>
                <el-button type="info" class="el-icon-plus" slot="reference"
                  >创建</el-button
                >
              </el-popover>
              <el-button
                v-else
                v-waves
                type="info"
                class="el-icon-plus"
                @click="openExcel"
                >创建</el-button
              >
            </el-form-item>
            <el-form-item label="" :error="errorUpInfo">
              <Upload
                @getFile="getFileEvent"
                @openEvent="openExcelAuto"
                :sheetName="sheetName"
              ></Upload>
            </el-form-item>
            <div v-if="excelName" class="uptxt">
              点击打开「 <span @click="popverEvent(1)">{{ excelName }}</span
              >」
            </div>
            <div v-else class="uptxt black">
              您可以<span>【创建】</span>空白excel
              或者<span>【导入】</span>excel文件
            </div>
          </div>
        </el-form>
        <div class="formObj_button">
          <a class="btnnormal_down marginR inlineButton" @click="resetEvent">
            <div class="el-icon-refresh btnSize">重置</div>
          </a>
          <el-button
            v-waves
            type="primary"
            class="el-icon-right marginR"
            @click="zhixingEvent"
            >执行</el-button
          >
        </div>
      </div>
      <div ref="tableBox" class="content_tableBox hasUp">
        <el-divider>列表</el-divider>
        <div class="tables">
          <div v-if="showVarDia" class="dialog">
            <VarifyDialog
              :pageJumps="pageJumps"
              @close="closeDialog"
            ></VarifyDialog>
          </div>
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
            >
              >
              <template #empty>
                <img src="@/assets/images/search.png" />
                <span>空空如也</span>
              </template>
              <vxe-column
                type="seq"
                title="序号"
                width="5%"
                fixed="left"
              ></vxe-column>
              <vxe-column
                min-width="15%"
                field="serial"
                title="编号"
                show-overflow="tooltip"
              ></vxe-column>
              <vxe-column
                min-width="15%"
                field="tool_type"
                title="工具"
                show-overflow="tooltip"
              ></vxe-column>
              <vxe-column
                min-width="15%"
                field="log_status"
                title="状态"
                show-overflow="tooltip"
              >
                <template slot-scope="scope">
                  <div
                    v-if="scope.row.log_status === '执行有误'"
                    class="statusDiv fail"
                  >
                    {{ scope.row.log_status }}
                  </div>
                  <div
                    v-if="scope.row.log_status === '执行中'"
                    class="statusDiv ing"
                  >
                    {{ scope.row.log_status }}
                  </div>
                  <div
                    v-if="scope.row.log_status === '执行完毕'"
                    class="statusDiv suc"
                  >
                    {{ scope.row.log_status }}
                  </div>
                </template></vxe-column
              >
              <vxe-column
                min-width="15%"
                field="create_time"
                title="日期"
                show-overflow="tooltip"
              ></vxe-column>
              <vxe-column title="操作" fixed="right" width="8%">
                <template slot-scope="scope">
                  <div
                    v-waves
                    class="btn btn_info"
                    @click="detailEvent(scope.row)"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="日志"
                      placement="top"
                    >
                      <svg class="icon svg-icon titleicon" aria-hidden="true">
                        <use xlink:href="#icon-xuexijilu-"></use>
                      </svg>
                    </el-tooltip>
                  </div>
                  <div
                    v-if="formMenu === 2 && scope.row.log_status === '执行完毕'"
                    v-waves
                    class="btn btn_info"
                    @click="downEvent(scope.row)"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="下载"
                      placement="top"
                    >
                      <svg class="icon svg-icon titleicon" aria-hidden="true">
                        <use xlink:href="#icon-download"></use>
                      </svg>
                    </el-tooltip>
                  </div>
                </template>
              </vxe-column>
            </vxe-table>
          </div>
        </div>
        <!-- 分页器 -->
        <div class="block" v-if="total">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currpage"
            :page-size="pagesize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- excel -->
    <ExcelDialog
      v-if="showExcel"
      @close="closeEvent"
      :excelOpt="excelOpt"
      :toolType="toolType"
      :sheetName="sheetName"
    ></ExcelDialog>
    <el-dialog
      title="日志"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="showLogDialog"
      @close="closeLogEvent"
      width="40%"
    >
      <div class="infinite" style="overflow: auto">
        <div class="infinite_content">
          <div v-if="logContent" class="box" v-html="logContent"></div>
          <div v-else class="box img">
            <img src="../../assets/images/loading.png" alt="" />
          </div>
        </div>
        <div class="infinite_ing">
          <p>
            <span
              v-if="endingCode === 10010"
              class="suc el-icon-circle-check"
            ></span
            ><span v-else class="el-icon-loading"></span>{{ endingTxt }}
          </p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showLogDialog = false"
          >关 闭</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  directiveList,
  directiveSave,
  directiveLog,
  sfToolsSave,
  sfToolsDown,
} from "@/api/api.js";
import VarifyDialog from "@/components/varifyDialog";
import ExcelDialog from "@/components/excelDialog";
import Upload from "@/components/upload";
import dayjs from "dayjs";

export default {
  name: "DMP",
  components: {
    VarifyDialog,
    ExcelDialog,
    Upload,
  },
  props: {
    toolType: {
      type: String,
      default: "",
    },
    sheetName: {
      type: String,
      default: "Sheet1",
    },
    excelOptions: {
      type: Array,
      default: [],
    },
    formMenu: {
      type: Number,
    },
  },
  computed: {
    requireCse() {
      return this.form.choose;
    },
  },
  watch: {
    formMenu: {
      handler(newval, oldval) {
        const vm = this;
        switch (newval) {
          case 1:
            vm.activeName = "1";
            vm.radioOpt = [
              {
                code: "1",
                txt: "密码登陆",
              },
              {
                code: "2",
                txt: "Cookie登录",
              },
            ];
            break;
          case 2:
            vm.activeName = "2";
            vm.radioOpt = [
              {
                code: "2",
                txt: "Cookie登录",
              },
            ];
            break;
        }
      },
      immediate: true,
    },
    activeName(newval, oldval) {
      this.rules.username[0].message =
        newval === "1"
          ? "请输入账号"
          : "京准通登录请输入账号，京牌代理登录请输入pin";
    },
    $route: {
      handler(newval, oldval) {
        const vm = this;
        vm.activeName = vm.formMenu === 1 ? "1" : "2";
        vm.getuserlist();
        vm.username = localStorage.getItem("user_name");
        vm.people = localStorage.getItem("user_name");
        vm.$nextTick(() => {
          vm.$refs.form.resetFields();
          vm.fileList = [];
          vm.excelName = "";
          vm.excelData = null;
        });
      },
      immediate: true,
      deep: true,
    },
    requireCse: {
      handler(newval, oldval) {
        const vm = this;
        switch (newval) {
          case 1:
            vm.rules.pin[0].required = true;
            break;
          case 2:
            vm.rules.pin[0].required = false;
            break;
        }
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    const vm = this;
    let chechPin = (rule, value, callback) => {
      if (!value && vm.form.choose === 1) {
        callback(new Error("请输入pin"));
      } else {
        callback();
      }
    };
    return {
      activeName: "1",
      radioOpt: [],
      formSource: 1, // 点击来源 1 新建  2 导入
      excelData: null, // 提交的excel数据
      excelName: "",
      showLogDialog: false,
      propVisable: false,
      logContent: "",
      endingTxt: "日志正在加载",
      endingCode: "",
      logInterval: null,
      excelOpt: [], // 默认的excel数据
      showExcel: false,
      errorUpInfo: "",
      rules: {
        username: [
          {
            required: true,
            message: "请输入账号",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
        ],
        cookie: [
          {
            required: true,
            message: "请输入Cookie",
            trigger: "blur",
          },
        ],
        choose: [
          {
            required: true,
            message: "请选择类型",
            trigger: "blur",
          },
        ],
        pin: [
          {
            required: true,
            validator: chechPin,
            trigger: "blur",
          },
        ],
      },
      showVarDia: false,
      options: [
        {
          label: "京准通",
          value: 2,
        },
        {
          label: "京牌代理",
          value: 1,
        },
      ],
      form: {
        username: "13530531565",
        password: "",
        cookie: "",
        pin: "",
        choose: 2,
      },
      fileList: [], // excel文件列表
      loadingbut: false,
      loadingbuttext: "执行",
      tableData: [],
      username: "", //用户名
      msg: "", //根据上传判断执行条件
      dialogVisible: false,
      //分页器状态
      total: 0,
      currentPage: 1,
      pagesize: 10, //每页的数据条数
      currpage: 1, //默认开始页面
      log: "", //查看详情渲染的log
    };
  },
  created() {
    const vm = this;
  },
  methods: {
    resetEvent() {
      const vm = this;
      vm.excelData = null;
      vm.excelName = "";
      vm.$refs.form.resetFields();
    },
    tabClick() {
      const vm = this;
      vm.$refs.form.resetFields();
    },
    closeDialog() {
      this.showVarDia = false;
    },
    closeLogEvent() {
      this.logContent = "";
      this.endingTxt = "日志正在加载";
      this.endingCode = 0;
      this.getuserlist();
    },
    getFileEvent(val) {
      this.fileList = val;
      this.excelName = val[0].name;
      this.errorUpInfo = "";
    },
    // 打开空白excel
    openExcel() {
      const vm = this;
      vm.excelOpt = JSON.parse(JSON.stringify(vm.excelOptions));
      vm.showExcel = true;
      vm.formSource = 1;
    },
    // 导入并打开excel
    openExcelAuto(opt) {
      const vm = this;
      vm.excelOpt = opt;
      vm.showExcel = true;
      vm.formSource = 2;
    },
    // 弹出框
    popverEvent(tag) {
      const vm = this;
      vm.propVisable = false;
      if (tag === 1) {
        // 取消
        vm.showExcel = true;
      } else {
        // 保存
        vm.excelData = null;
        vm.excelName = "";
        vm.openExcel();
      }
    },
    // 执行事件
    zhixingEvent() {
      const vm = this;
      let submitdata = {
        ...vm.form,
        config_data: vm.excelData,
        tool_type: vm.toolType,
      };
      vm.$refs.form.validate((valid) => {
        if (valid) {
          if (!vm.excelData) {
            vm.$msg({ type: "error", msg: "请先添加表格数据" });
          } else {
            if (vm.formMenu === 1) {
              directiveSave({
                ...submitdata,
              }).then((res) => {
                if (res.data.code === 10000) {
                  vm.$msg({ msg: "保存成功" });
                  vm.excelData = null;
                  vm.excelName = "";
                  vm.logEvent(res.data.data);
                  vm.logInterval = setInterval(() => {
                    vm.logEvent(res.data.data);
                  }, 3000);
                  vm.showLogDialog = true;
                  vm.$refs.form.resetFields();
                } else if (res.data.code === 10006) {
                  vm.$msg({ type: "error", msg: "请添加正确的Excel文件" });
                } else {
                  vm.$msg({
                    type: "error",
                    msg: res.data.data || res.data.msg,
                  });
                }
              });
            } else {
              sfToolsSave({ ...submitdata }).then((res) => {
                if (res.data.code === 10000) {
                  vm.$msg({ msg: "保存成功" });
                  vm.excelData = null;
                  vm.excelName = "";
                  vm.logEvent(res.data.data);
                  vm.logInterval = setInterval(() => {
                    vm.logEvent(res.data.data);
                  }, 3000);
                  vm.showLogDialog = true;
                  vm.$refs.form.resetFields();
                } else if (res.data.code === 10006) {
                  vm.$msg({ type: "error", msg: "请添加正确的Excel文件" });
                } else {
                  vm.$msg({
                    type: "error",
                    msg: res.data.data || res.data.msg,
                  });
                }
              });
            }
          }
        }
      });
    },
    //立即上传 并判断上传文件是否为空if () {
    uploadFile(data) {
      const vm = this;
      vm.showExcel = true;
    },
    //查看列表
    getuserlist() {
      const vm = this;
      directiveList({
        tool_type: vm.toolType,
        limit: vm.pagesize,
        page: vm.currpage,
      }).then((res) => {
        if (res.data.code === 10000) {
          let result = res.data;
          vm.tableData = result.data;
          vm.total = result.count;
        } else {
          vm.$msg({ type: "error", msg: res.data.msg });
        }
      });
    },
    // 查看详情按钮
    detailEvent(row) {
      const vm = this;
      clearInterval(vm.logInterval);
      vm.logInterval = null;
      vm.$nextTick(() => {
        vm.logEvent(row.file_path);
        vm.logInterval = setInterval(() => {
          vm.logEvent(row.file_path);
        }, 3000);
        vm.showLogDialog = true;
      });
    },
    // 下载文件
    downEvent(row) {
      const vm = this;
      sfToolsDown({
        log_id: row.id,
      }).then((res) => {
        let data = res.data;
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        let fileName = `${localStorage.getItem('wx_userid')}-${dayjs().format("YYYY/MM/DD HH:mm:ss")}`
        console.log(fileName)
        link.setAttribute("download", `${fileName}.zip`);
        document.body.appendChild(link);
        link.click();
      });
    },
    // 关闭excel
    closeEvent(tag, val, opt) {
      const vm = this;
      vm.showExcel = false;
      // 保存
      if (tag === 1) {
        vm.excelData = val;
        vm.excelOpt = opt;
        vm.excelName = vm.formSource === 1 ? "已创建的Excel文件" : vm.excelName;
      } else {
        vm.excelName = "";
        vm.excelData = null;
      }
    },
    // 日志接口
    logEvent(path) {
      const vm = this;
      directiveLog({
        path,
      }).then((res) => {
        vm.endingCode = res.data.code;
        if (res.data.code === 10000) {
          vm.endingTxt = res.data.data ? "日志持续获取中" : "日志正在加载";
          vm.logContent = res.data.data || "";
        } else if (res.data.code === 10010) {
          vm.endingTxt = "日志加载完毕";
          vm.logContent = res.data.data || "";
          clearInterval(vm.logInterval);
          vm.logInterval = null;
          if (!vm.showLogDialog) {
            vm.getuserlist();
          }
        } else {
          // 错误  清除定时器
          clearInterval(vm.logInterval);
          vm.logInterval = null;
          vm.$msg({ type: "error", msg: "日志获取失败" });
          if (!vm.showLogDialog) {
            vm.getuserlist();
          }
        }
      });
    },
    //分页器功能
    handleSizeChange(val) {
      this.pagesize = val;
      this.getuserlist(this.pagesize);
    },
    //有接口请求 每点击一页进行一次数据请求 参数页码为动态值：
    handleCurrentChange(page) {
      this.currpage = page;
      this.getuserlist(this.currpage);
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/views/index";
.infinite {
  background-color: #f1f8ff;
  height: 400px;
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
  &_content {
    flex-basis: 100%;
    height: 300px;
    padding: 20px 20px 0 20px;
    overflow: auto;
    .box {
      text-align: center;
      line-height: 34px;
      &.img {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        img {
          height: 100%;
        }
      }
    }
  }
  &_ing {
    flex-basis: 100%;
    padding: 20px 0;
    text-align: center;
    font-weight: bold;
    font-size: 16px;
    background-color: #e8f0f7;
    .suc {
      color: #67c23a;
    }
  }
}
</style>
