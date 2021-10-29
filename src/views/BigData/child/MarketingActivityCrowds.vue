<template>
  <!-- 营销活动人群 -->
  <div class="marketingActivityCrowds outerDiv">
    <div class="content">
      <div class="form">
        <el-form
          ref="form"
          :model="form"
          label-width="100px"
          class="formObj"
          :rules="rules"
        >
          <div class="formObj_ipt">
            <el-form-item label="账号:" prop="input">
              <el-input
                v-model="form.input"
                size="medium"
                class="w320"
                placeholder="请输入账号"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="密码:" prop="pass">
              <el-input
                v-model="form.pass"
                size="medium"
                class="w320"
                placeholder="请输入密码"
                clearable
              ></el-input>
            </el-form-item>
          </div>
          <div class="formObj_upload">
            <el-form-item label="">
              <Upload
                :progressPercent="form.progressPercent"
                @getFile="getFileEvent"
              ></Upload>
            </el-form-item>
          </div>
          <div class="formObj_button">
            <a
              class="btnnormal btnnormal_down"
              href="http://tool.afocus.com.cn/file_download/营销活动.xlsx"
              download="营销活动.xlsx"
              ><div class="btnSize">下载模板</div></a
            >
            <el-button
              type="primary"
              class="btnnormal marginL"
              :disabled="this.fileList == '' ? true : false"
              @click="uploadFile"
              >立即上传</el-button
            >
            <el-button
              type="primary"
              class="btnnormal marginL"
              :disabled="this.msg == '' ? true : false"
              @click="going"
              :loading="loadingbut"
              >{{ loadingbuttext }}</el-button
            >
          </div>
        </el-form>
      </div>
      <div class="tableBox">
        <el-divider></el-divider>
        <div class="tables">
          <div v-if="showVarDia" class="dialog">
            <VarifyDialog
              :pageJumps="pageJumps"
              @close="closeDialog"
            ></VarifyDialog>
          </div>
          <div class="tableTab" v-if="tableData">
            <el-table
              ref="singleTable"
              class="tableBox"
              :data="tableData"
              height="580"
              size="small"
              @cell-click="celltable"
              :highlight-current-row="true"
              :cell-style="timeStyle"
            >
              <el-table-column
                type="index"
                width="50"
                label="序号"
                align="center"
              ></el-table-column>
              <el-table-column
                property="create_time"
                label="日期"
                min-width="200"
              >
              </el-table-column>
              <el-table-column
                property="title"
                label="基本信息"
                min-width="200"
              >
              </el-table-column>
              <el-table-column property="cheack" label="操作" width="120">
                <el-button type="text" @click="dialogVisible = true"
                  >查看详情</el-button
                >
              </el-table-column>
            </el-table>
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
          <!-- 查看详情弹出框 -->
          <div class="dialog">
            <el-dialog
              title="查看详情"
              :visible.sync="dialogVisible"
              width="500px"
              max-height="600px"
              :close-on-click-modal="false"
            >
              <div>详情信息：{{ log }}</div>
            </el-dialog>
          </div>
        </div>
      </div>
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
import Upload from "@/components/upload"

export default {
  name: "MarketingActivityCrowds",
  components: {
    VarifyDialog,
    Upload
  },
  data() {
    return {
      rules: {
        input: [{ required: true, message: "请输入账号", trigger: "blur" }],
        pass: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      showVarDia: false,
      form: {
        input: "",
        pass: "",
        pin: "",
        progressPercent: 0,
      },
      switchText: "",
      fileList: [], // excel文件列表
      activeName: "first",
      loadingbut: false,
      loadingbuttext: "执行",
      tableData: [],
      total: "",
      exc: "",
      userid: "",
      code: "",
      username: "", //用户名
      rizhi: "", //日志内容
      msg: "", //根据上传判断执行条件
      dialogVisible: false,
      verification: false,
      //分页器状态
      currentPage: 1,
      pagesize: 10, //每页的数据条数
      currpage: 1, //默认开始页面
      tablerow: "", //当前选中用户
      id: [], //查看日志的id
      idT: "", //查看详情渲染的idT
      title: "", //查看详情渲染的title
      log: "", //查看详情渲染的log
      choose: "", //传值为1或2
    };
  },
  created() {
    // check方法调用接口,判断用户是否登录!
    this.check();
  },
  mounted() {
    this.username = localStorage.getItem("user_name");
    this.people = localStorage.getItem("user_name");
    this.getuserlist(1);
  },
  methods: {
    timeStyle() {
      return "height:50px;padding:0;";
    },
    closeDialog(val) {
      this.showVarDia = false;
    },
    getFileEvent(val) {
      this.fileList = val;
    },    
    //点击选中的用户 查看详情
    celltable(row) {
      this.tablerow = row;
      fxcjviewDetails({ id: this.tablerow.id })
        .then((res) => {
          if (res.data.code == 10000) {
            this.idT = res.data.data.id;
            this.title = res.data.data.title;
            this.log = res.data.data.log;
          } else if (res.data.code == 10001) {
            this.$message.warning("是否忘记传参");
          } else if (res.data.code == 10002) {
            this.$message.warning("您传入的id有误");
          } else {
            this.$message.error("查看失败");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //立即上传 并判断上传文件是否为空if () {
    uploadFile(data) {
      fxcjupload({
        trans_name: this.username,
        file: this.fileList,
      })
        .then((res) => {
          if (res.data.code == 10000) {
            this.form.progressPercent = 100;
            this.msg = res.data.code;
            this.fileList = [];
            this.$message.success("上传成功");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //查看
    getuserlist() {
      fxcjExamine({
        tool_type: "6",
        limit: this.pagesize,
        page: this.currpage,
      })
        .then((res) => {
          let result = res.data;
          this.tableData = result.data;
          this.total = result.count;
        })
        .catch((err) => {
          console.log(err);
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
          fxcjtools({
            username: this.form.input,
            password: this.form.pass,
            trans_name: this.username,
            tool_type: "6",
            choose: "3",
          })
            .then((res) => {
              if (res.data.code == "10000") {
                this.getuserlist();
                this.$message.success("执行成功");
                this.loadingbuttext = "执行";
                this.loadingbut = false;
              } else if (res.data.code == "10001") {
                this.$message.warning("未上传cookie或tool type或trans_name");
                this.loadingbuttext = "执行";
                this.loadingbut = false;
              } else if (res.data.code == "10003") {
                this.$message.error("内部错误");
                this.loadingbuttext = "执行";
                this.loadingbut = false;
              } else if (res.data.code == "10004") {
                this.$message.warning("请求受限");
                this.loadingbuttext = "执行";
                this.loadingbut = false;
              } else if (res.data.code == "10005") {
                if (res.data.msg === "账号或密码错误") {
                  this.$message.warning("请检查用户密码是否正确");
                } else {
                  this.pageJumps = res.data.msg.substring(14);
                  this.showVarDia = true;
                }
                this.loadingbuttext = "执行";
                this.loadingbut = false;
              } else {
                this.$message.error("执行失败");
              }
            })
            .catch((err) => {
              console.log(err);
            });
          this.msg = "";
          this.fileList = [];
          this.form.progressPercent = 0;
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
@import "../../index";
</style>