<template>
  <div class="outerDiv">
    <div class="content">
      <div class="content_form">
        <el-form ref="form" :model="form" class="formObj" :rules="rules">
          <div class="formObj_ipt">
            <el-row>
              <el-col :span="12">
                <el-form-item label="账号:" prop="username">
                  <el-input
                    v-model.trim="form.username"
                    size="medium"
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
                    size="medium"
                    placeholder="请输入密码"
                    clearable
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
                  <el-select v-model="form.choose" placeholder="请选择类型">
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
                <el-form-item label="备注内容:">
                  <el-input
                    v-model.trim="form.pin"
                    size="medium"
                    placeholder="请输入备注内容"
                    clearable
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div class="formObj_upload">
            <el-row>
              <el-col :span="8">
                <el-form-item label="" :error="errorUpInfo">
                  <Upload
                    :progressPercent="progressPercent"
                    @getFile="getFileEvent"
                  ></Upload>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div class="formObj_button">
            <div v-for="(item, idx) in btnBox" :key="idx">
              <a
                class="btnnormal_down marginR"
                :href="item.url"
                :download="item.downName"
              >
                <div class="el-icon-download btnSize">{{ item.btnTxt }}</div>
              </a>
            </div>
            <el-button
              v-waves
              type="primary"
              class="el-icon-upload2 marginR"
              @click="uploadFile"
              >立即上传</el-button
            >
            <el-button
              v-waves
              type="primary"
              class="el-icon-right marginR"
              :disabled="!msg"
              @click="going"
              :loading="loadingbut"
              >{{ loadingbuttext }}</el-button
            >
          </div>
        </el-form>
      </div>
      <div ref="tableBox" class="content_tableBox hasUp">
        <el-divider></el-divider>
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
                <img src="@/assets/images/noneData3.png" />
              </template>
              <vxe-column
                type="seq"
                title="序号"
                width="60"
                fixed="left"
              ></vxe-column>
              <vxe-column
                min-width="15%"
                field="create_time_for"
                title="日期"
                show-overflow="tooltip"
              ></vxe-column>
              <vxe-column
                min-width="15%"
                field="title"
                title="基本信息"
                show-overflow="tooltip"
              ></vxe-column>
              <vxe-column title="操作" fixed="right" width="8%">
                <template slot-scope="scope">
                  <div
                    v-waves
                    class="btn btn_info"
                    @click="detailEvent(scope.row)"
                  >
                    <svg class="icon svg-icon titleicon" aria-hidden="true">
                      <use xlink:href="#icon-xinxi"></use>
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
    <!-- 查看详情弹出框 -->
    <div class="dialog">
      <el-dialog
        title="查看详情"
        :visible.sync="dialogVisible"
        width="500px"
        max-height="600px"
        :close-on-click-modal="false"
      >
        <div class="dialogInfo">
          <p><span>创建人：</span>{{ curInfo.title }}</p>
          <p><span>创建时间：</span>{{ curInfo.create_time }}</p>
          <p><span>信息：</span>{{ curInfo.log }}</p>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  fxcjviewDetails,
  fxcjupload,
  fxcjtools,
  fxcjExamine,
} from "@/api/api.js";
import VarifyDialog from "@/components/varifyDialog";
import Upload from "@/components/upload";

export default {
  name: "DMP",
  components: {
    VarifyDialog,
    Upload,
  },
  props: {
    toolType: {
      type: String,
      default: "",
    },
  },
  watch: {
    $route: {
      handler(newval, oldval) {
        const vm = this;
        vm.check();
        vm.username = localStorage.getItem("user_name");
        vm.people = localStorage.getItem("user_name");
        vm.getuserlist();
        switch (newval.name) {
          case "DMP":
            vm.btnBox = [
              {
                url: "http://tool.afocus.com.cn/file_download/DMP自动化人群包.xlsx",
                downName: "DMP自动化人群包.xlsx",
                btnTxt: "下载模板",
              },
            ];
            break;
          case "Booth":
            vm.btnBox = [
              {
                url: "http://tool.afocus.com.cn/file_download/京东展位.xlsx",
                downName: "京东展位.xlsx",
                btnTxt: "下载模板",
              },
            ];
            break;
          case "Direct":
            vm.btnBox = [
              {
                url: "http://tool.afocus.com.cn/file_download/新版直投-单元创建工具配置.xlsx",
                downName: "新版直投-单元创建工具配置.xlsx",
                btnTxt: "单元创建工具配置下载",
              },
              {
                url: "http://tool.afocus.com.cn/file_download/新版直投-计划创建工具配置.xlsx",
                downName: "新版直投-计划创建工具配置.xlsx",
                btnTxt: "计划创建工具配置下载",
              },
            ];
            break;
          case "Cube":
            vm.btnBox = [
              {
                url: "http://tool.afocus.com.cn/file_download/京腾魔方人群.xlsx",
                downName: "京腾魔方人群.xlsx",
                btnTxt: "下载模板",
              },
            ];
            break;
          case "Number":
            vm.btnBox = [
              {
                url: "http://tool.afocus.com.cn/file_download/数坊人群圈选.xlsx",
                downName: "数坊人群圈选.xlsx",
                btnTxt: "下载模板",
              },
            ];
            break;
          case "Activity":
            vm.btnBox = [
              {
                url: "http://tool.afocus.com.cn/file_download/营销活动.xlsx",
                downName: "营销活动.xlsx",
                btnTxt: "下载模板",
              },
            ];
            break;
          case "Analysis":
            vm.btnBox = [
              {
                url: "http://tool.afocus.com.cn/file_download/数坊自定义分析-分析配置项.xlsx",
                downName: "数坊自定义分析-分析配置项.xlsx",
                btnTxt: "分析配置项下载",
              },
              {
                url: "http://tool.afocus.com.cn/file_download/数坊自定义分析-新建分析.xlsx",
                downName: "数坊自定义分析-新建分析.xlsx",
                btnTxt: "新建分析项下载",
              },
            ];
            break;
          case "Difference":
            vm.btnBox = [
              {
                url: "http://tool.afocus.com.cn/file_download/数坊已有人群集合.xlsx",
                downName: "数坊已有人群集合.xlsx",
                btnTxt: "下载模板",
              },
            ];
            break;
          case "Population":
            vm.btnBox = [
              {
                url: "http://tool.afocus.com.cn/file_download/数坊自动化报告.xlsx",
                downName: "数坊自动化报告.xlsx",
                btnTxt: "下载模板",
              },
            ];
            break;
          default:
            vm.btnBox = null;
            break;
        }
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    return {
      curInfo: {},
      errorUpInfo: "",
      btnBox: null,
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
        choose: [
          {
            required: true,
            message: "请选择类型",
            trigger: "blur",
          },
        ],
      },
      showVarDia: false,
      options: [
        {
          label: "京牌代理",
          value: 1,
        },
        {
          label: "京准通",
          value: 2,
        },
      ],
      form: {
        username: "",
        password: "",
        pin: "",
        choose: 1,
      },
      progressPercent: 0,
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
  methods: {
    closeDialog() {
      this.showVarDia = false;
    },
    getFileEvent(val) {
      this.fileList = val;
      this.errorUpInfo = "";
    },
    //立即上传 并判断上传文件是否为空if () {
    uploadFile(data) {
      const vm = this;
      if (!vm.fileList || vm.fileList.length === 0) {
        vm.errorUpInfo = "请上传文件";
        return false;
      }
      fxcjupload({
        trans_name: vm.username,
        file: vm.fileList,
      }).then((res) => {
        if (res.data.code == 10000) {
          vm.errorUpInfo = "";
          vm.progressPercent = 100;
          vm.msg = res.data.code;
          vm.fileList = [];
          vm.$msg({ msg: "上传成功" });
        }
      });
    },
    //查看列表
    getuserlist() {
      const vm = this;
      function format(value) {
        if (value < 10) {
          return "0" + value;
        } else {
          return value;
        }
      }
      fxcjExamine({
        tool_type: vm.toolType,
        limit: vm.pagesize,
        page: vm.currpage,
      }).then((res) => {
        if (res.data.code === 10000) {
          let result = res.data;
          vm.tableData = result.data;
          result.data.forEach((val, idx) => {
            let time = new Date(val.create_time);
            let y = time.getFullYear();
            let m = format(time.getMonth() + 1);
            let d = format(time.getDate());
            let h = format(time.getHours());
            let mm = format(time.getMinutes());
            let s = format(time.getSeconds());
            let resTime = y + "-" + m + "-" + d + " " + h + ":" + mm + ":" + s;
            vm.$set(val, "create_time_for", resTime);
          });
          vm.total = result.count;
        } else {
          vm.$msg({ type: "error", msg: res.data.msg });
        }
      });
    },
    // 查看详情按钮
    detailEvent(row) {
      const vm = this;
      fxcjviewDetails({
        id: row.id,
      }).then((res) => {
        if (res.data.code == 10000) {
          vm.curInfo = res.data.data;
          // vm.log = res.data.data.log;
          vm.dialogVisible = true;
        } else {
          vm.$msg({ type: "error", msg: "查看失败" });
        }
      });
    },
    //执行
    going() {
      //调用大数据工具请求
      const vm = this;
      vm.$refs.form.validate((valid) => {
        if (valid) {
          this.loadingbut = true;
          this.loadingbuttext = "审核中...";
          let data = {
            ...vm.form,
            trans_name: vm.username,
            tool_type: vm.toolType,
            choose:
              vm.$route.fullPath.indexOf("beijingMustPass") !== -1
                ? vm.form.choose
                : "3",
          };
          fxcjtools(data).then((res) => {
            if (res.data.code == "10000") {
              vm.getuserlist();
              vm.$msg({ msg: "执行成功" });
              vm.loadingbuttext = "执行";
              vm.loadingbut = false;
            } else if (res.data.code == "10005") {
              if (res.data.msg === "账号或密码错误") {
                vm.$msg({ type: "error", msg: "请检查用户密码是否正确" });
              } else {
                vm.pageJumps = res.data.msg.substring(14);
                vm.showVarDia = true;
              }
            } else {
              vm.$msg({ type: "error", msg: res.data.msg });
            }
          });
          vm.msg = "";
          vm.fileList = [];
          vm.progressPercent = 0;
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
</style>
