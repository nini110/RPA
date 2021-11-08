<template>
  <div class="DMP outerDiv">
    <div class="content">
      <div class="form">
        <el-form
          ref="form"
          :model="form"
          class="formObj"
          :rules="rules"
        >
          <div class="formObj_ipt">
            <el-form-item label="账号:" prop="input">
              <el-input
                v-model="form.input"
                size="medium"
                placeholder="请输入账号"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="密码:" prop="pass">
              <el-input
                v-model="form.pass"
                size="medium"
                placeholder="请输入密码"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="类型:" prop="choose">
              <el-select
                v-model="form.choose"
                placeholder="请选择类型"
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
            <el-form-item label="备注内容:">
              <el-input
                v-model="form.pin"
                size="medium"
                placeholder="请输入备注内容"
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
			  v-if="$route.name === 'DMP' || $route.name === 'Booth' || $route.name === 'Cube'"
              class="btnnormal btnnormal_down"
              href="http://tool.afocus.com.cn/file_download/DMP自动化人群包.xlsx"
              download="DMP自动化人群包.xlsx"
              ><div class="btnSize">下载模板</div></a
            >
            <a
			v-if="$route.name === 'Direct'"
              class="btnnormal btnnormal_down"
              href="http://tool.afocus.com.cn/file_download/新版直投-单元创建工具配置.xlsx"
              download="新版直投-单元创建工具配置.xlsx"
              ><div class="btnSizeBig">单元创建工具配置下载</div></a
            >
            <a
			v-if="$route.name === 'Direct'"
              class="btnnormal btnnormal_down marginL"
              href="http://tool.afocus.com.cn/file_download/新版直投-计划创建工具配置.xlsx"
              download="新版直投-计划创建工具配置.xlsx"
              ><div class="btnSizeBig">计划创建工具配置下载</div></a
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
      <div  ref="tableBox" class="tableBox hasUp">
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
              class="tableBox"
              :data="tableData"
              size="small"
              @cell-click="celltable"
              :height="tableHeight"
              :highlight-current-row="true"
            >
              <el-table-column
                type="index"
                width="100"
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
              <el-table-column property="cheack" label="操作" width="150">
                <el-button class="el-icon-reading" type="text" @click="dialogVisible = true"
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
  name: "DMP",
  components: {
    VarifyDialog,
    Upload
  },
  props: {
	toolType: {
		type: String,
		default: ''
	}
  },
  data() {
    return {
      rules: {
        input: [{ required: true, message: "请输入账号", trigger: "blur" }],
        pass: [{ required: true, message: "请输入密码", trigger: "blur" }],
        choose: [{ required: true, message: "请选择类型", trigger: "blur" }],
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
        input: "",
        pass: "",
        pin: "",
        choose: 1,
        progressPercent: 0,
      },
      fileList: [], // excel文件列表
      loadingbut: false,
      loadingbuttext: "执行",
      tableData: [],
      total: "",
      username: "", //用户名
      msg: "", //根据上传判断执行条件
      dialogVisible: false,
      //分页器状态
      currentPage: 1,
      pagesize: 10, //每页的数据条数
      currpage: 1, //默认开始页面
      tablerow: "", //当前选中用户
      id: [], //查看日志的id
      log: "", //查看详情渲染的log
      tableHeight: 0,
    };
  },
  watch: {
  	$route: {
  		handler(newval, oldval) {
  			const vm = this;
  			console.log(newval)
    this.check();
  this.username = localStorage.getItem("user_name");
  this.people = localStorage.getItem("user_name");
  this.getuserlist();
  		},
  		immediate: true,
  		deep: true
  	}
  },
  // created() {
  //   // check方法调用接口,判断用户是否登录!
  //   this.check();
  // },
  // mounted() {
  //   this.username = localStorage.getItem("user_name");
  //   this.people = localStorage.getItem("user_name");
  //   this.getuserlist(1);
  //   this.tableHeight = window.getComputedStyle(this.$refs.tableBox).height
  // },
  methods: {
    closeDialog() {
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
        // tool_type: "0",
		tool_type: this.toolType,
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
            tool_type: this.toolType,
            choose: this.form.choose,
            pin: this.form.pin,
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
@import "@/views/index";
</style>
