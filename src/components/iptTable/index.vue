<template>
<div class="outerDiv">
  <div v-if="formMenu===3" class="content ts2">
    <div class="outerDiv_left">
      <el-form ref="form" :model="form" :rules="rules" v-loading.fullscreen.lock="showLoading">
        <el-row>
          <el-col :span="24">
            <el-form-item label="类型" prop="choose" class="noborder">
              <el-radio-group v-model="form.choose" @input="chooseEvent">
                <el-radio v-for="item in options" :key="item.value" :label="item.value" border>{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-if="form.choose===2" :span="24">
            <el-form-item label="账号" prop="username" class="noborder">
              <el-input v-model.trim="form.username" placeholder="请输入账号" clearable>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col v-else>
            <el-form-item label="PIN" prop="pin" class="w100">
              <el-select v-model="form.pin" placeholder="请选择PIN" filterable clearable>
                <el-option v-for="item in pinOptions" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col v-if="form.choose===2">
            <el-form-item label="密码:" prop="password">
              <el-input :show-password="true" v-model.trim="form.password" placeholder="请输入密码" clearable :disabled="!form.username"></el-input>
            </el-form-item>
          </el-col> -->
          <el-col style="margin-bottom: 20px" class="flexcol">
            <el-form-item label="添加文件" class="flexcol_lf">
              <el-popover v-if="excelData" placement="bottom" width="180" v-model="propVisable">
                <p>创建空白Excel表格？</p>
                <div class="popverButton">
                  <el-button size="mini" type="text" @click="propVisable = false">取消</el-button>
                  <el-button type="text" size="mini" @click="popverEvent(2)">确定</el-button>
                </div>
                <el-button type="info" class="el-icon-plus" slot="reference">创建</el-button>
              </el-popover>
              <el-button v-else v-waves type="info" class="el-icon-plus" @click="openExcel">创建</el-button>
            </el-form-item>
            <el-form-item label="" class="flexcol_rt">
              <Upload @getFile="getFileEvent" @beforeeve="beforeeve" @openEvent="openExcelAuto" :sheetName="sheetName"></Upload>
            </el-form-item>
            <div v-if="excelName" class="uptxt">
              点击打开「 <span @click="popverEvent(1)">{{ excelName }}</span>」
            </div>
            <div v-else class="uptxt black">
              您可以<span>【创建】</span>空白excel
              或者<span>【导入】</span>excel文件
            </div>
          </el-col>
        </el-row>
        <!-- <ExcelDialog v-if="showExcel" @close="closeEvent" :excelOpt="excelOpt" :toolType="toolType" :sheetName="sheetName"></ExcelDialog> -->
        <div class="footer_btn">
          <a class="btnnormal btnnormal_down" @click="modelEvent">
            <div class="btnSize el-icon-download">模板</div>
          </a>
          <el-button v-waves class="el-icon-check marginL" type="primary" @click="zhixingEvent">提交</el-button>
        </div>
      </el-form>
      <div class="outerDiv_left_info">
        <h3 class="el-icon-info">须知</h3>
        <p v-for="(item, idx) in tipInfo" :key="idx">{{ item }}</p>
      </div>
    </div>
    <div class="outerDiv_right">
      <div style="height: 100%">
        <div class="alarmRight">
          <vxe-table ref="multipleTable" :data="tableData" stripe round :column-config="{ resizable: true }" :row-config="{ isCurrent: true, isHover: true }" class="mytable-scrollbar" auto-resize height="auto">
            >
            <template #empty>
              <img src="@/assets/images/search.png" />
              <span>空空如也</span>
            </template>
            <vxe-column type="seq" title="序号" width="10%" fixed="left"></vxe-column>
            <vxe-column min-width="15%" field="serial" title="编号" show-overflow="tooltip"></vxe-column>
            <vxe-column min-width="13%" field="tool_type" title="工具" show-overflow="tooltip"></vxe-column>
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
            <vxe-column min-width="15%" field="create_time" title="日期" show-overflow="tooltip"></vxe-column>
            <vxe-column title="操作" fixed="right" width="18%">
              <template slot-scope="scope">
                <div v-waves class="btn btn_info" @click="detailEvent(scope.row)">
                  <el-tooltip class="item" effect="dark" content="日志" placement="top">
                    <i class="el-icon-document"></i>
                  </el-tooltip>
                </div>
              </template>
            </vxe-column>
          </vxe-table>
          <div class="block" v-if="total">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currpage" :page-size="pagesize" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="content" v-loading.fullscreen.lock="showLoading" element-loading-text="文件导入中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(46, 46, 46, 0.8)">
    <div class="content_form ts">
      <el-collapse v-if="formMenu===1" v-model="activeNames">
        <el-collapse-item name="1">
          <template slot="title">
            <span class="iconfont icon-xiangmu icon"></span> 功能介绍
          </template>
          <div class="word" v-for="(item,idx) in wordList" :key="idx"><span class="lab">{{ item.lab }}</span>{{ item.word }}</div>
          <div v-if="wordTip" class="word wordTip el-icon-warning-outline">{{wordTip}}</div>
          <div v-if="wordErr" class="word wordErr">
            <p>注意: 本产品并非快车触点创建创意工具</p>
          </div>
        </el-collapse-item>
      </el-collapse>
      <el-form ref="form" :model="form" class="formObj" :rules="rules">
        <div class="formObj_div">
          <div class="formObj_ipt">
            <div class="formObj_ipt_abso">
              <el-result>
                <template slot="icon">
                  <img :src="picSrc" alt="" :class="picClass" />
                </template>
                <template slot="extra">
                  <span>{{ $route.meta.title }}</span>
                </template>
              </el-result>
            </div>
            <div class="formObj_ipt_rt">
              <el-row :gutter="20">
                <div class=""></div>
                <el-col v-if="formMenu === 1" :span="colWidth.choose">
                  <el-form-item label="类型" prop="choose" class="noborder">
                    <el-select v-model="form.choose" placeholder="请选择类型" size="large" @change="chooseEvent">
                      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col v-if="showError" :span="colWidth.eror" class="hasAppend">
                  <el-tooltip effect="dark" placement="bottom">
                    <div slot="content">
                      <p class="ts">🔔 该条件默认关闭，填写区间为1 - 10</p>
                      <p class="ts">✅ 开启时：</p>
                      <p>根据填写的终止条件作为规则，例如填写：5，则会在出错第5次自动终止程序</p>
                      <p class="ts">⛔ 关闭时：</p>
                      <p>程序执行中出现错误会继续向下执行，不会终止，直到执行完毕</p>
                    </div>
                    <div class="el-icon-question"></div>
                  </el-tooltip>
                  <el-form-item label="终止条件" prop="error_num" class="flex w110 noborder">
                    <el-switch v-model="ifErrNum" active-color="#13ce66" inactive-color="#a5a5a5" @change="seitchEvent">
                    </el-switch>
                    <vxe-input v-if="ifErrNum" v-model="form.error_num" placeholder="数值区间为1 - 10" type="number" step="1" min="1" max="10"></vxe-input>
                  </el-form-item>
                </el-col>
                <el-col v-if="form.choose === 1" :span="colWidth.pin">
                  <el-form-item label="PIN" prop="pin" class="noborder">
                    <el-select v-model="form.pin" placeholder="请选择PIN" filterable clearable>
                      <el-option v-for="item in pinOptions" :key="item" :label="item" :value="item">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col v-else :span="colWidth.user">
                  <el-form-item label="账号" prop="username" class="noborder">
                    <el-input v-model.trim="form.username" placeholder="请输入账号" clearable>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col v-if="showCookie || formMenu === 2" :span="colWidth.cookie" class="hasAppend">
                  <el-tooltip v-if="toolType !== 'DMP'" class="item" effect="dark" content="Cookie获取视频教学" placement="bottom">
                    <div class="el-icon-video-play" @click="movieDownEvent(1)"></div>
                  </el-tooltip>
                  <el-form-item label="Cookie" prop="cookie" class="w110 noborder">
                    <el-input v-model.trim="form.cookie" placeholder="请输入Cookie" clearable>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col v-if="toolType === '快车更新创意状态'" :span="24">
                  <el-form-item label="库存条件" prop="tiaojian" class="">
                    <vxe-pulldown ref="refKoujing" v-model="visible1">
                      <template #default>
                        <el-input v-model="form.tiaojian" readonly placeholder="请选择条件" @focus="focusEvent1" class="nbd">
                        </el-input>
                      </template>
                      <template #dropdown>
                        <div class="dropdownbox">
                          <div class="flex">
                            <el-form ref="pullRef" :model="pulldownForm" :rules="rulesPull" class="form">
                              <el-form-item prop="tj_val" class="f100">
                                <el-input placeholder="整数" v-model.trim="pulldownForm.tj_val" class="input-with-select" clearable>
                                  <el-select v-model="tj_lf" slot="prepend" placeholder="请选择" :popper-append-to-body="false" @change="(val) =>tjEvent(1, val)">
                                    <el-option label="大于" value=">"></el-option>
                                    <el-option label="小于" value="<"></el-option>
                                  </el-select>
                                  <template slot="append"><span class="el-icon-video-play play">启动</span></template>
                                </el-input>
                              </el-form-item>
                              <el-form-item prop="tj_val2" class="f100">
                                <el-input placeholder="整数" v-model.trim="pulldownForm.tj_val2" class="input-with-select" clearable>
                                  <el-select v-model="tj_lf2" slot="prepend" placeholder="请选择" :popper-append-to-body="false" @change="(val) =>tjEvent(2, val)">
                                    <el-option label="大于" value=">"></el-option>
                                    <el-option label="小于" value="<"></el-option>
                                  </el-select>
                                  <template slot="append"><span class="el-icon-video-pause pause">暂停</span></template>
                                </el-input>
                              </el-form-item>
                            </el-form>
                          </div>
                        </div>
                      </template>
                    </vxe-pulldown>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="formObj_upload">
            <el-form-item label="">
              <el-popover v-if="excelData" placement="bottom" width="180" v-model="propVisable">
                <p>创建空白Excel表格？</p>
                <div class="popverButton">
                  <el-button size="mini" type="text" @click="propVisable = false">取消</el-button>
                  <el-button type="text" size="mini" @click="popverEvent(2)">确定</el-button>
                </div>
                <el-button type="info" class="el-icon-plus" slot="reference">创建</el-button>
              </el-popover>
              <el-button v-else v-waves type="info" class="el-icon-plus" @click="openExcel">创建</el-button>
            </el-form-item>
            <el-form-item label="">
              <Upload @getFile="getFileEvent" @beforeeve="beforeeve" @openEvent="openExcelAuto" :sheetName="sheetName"></Upload>
            </el-form-item>
            <div v-if="excelName" class="uptxt">
              点击打开「 <span @click="popverEvent(1)">{{ excelName }}</span>」
            </div>
            <div v-else class="uptxt black">
              您可以<span>【创建】</span>空白excel
              或者<span>【导入】</span>excel文件
            </div>
          </div>
        </div>
      </el-form>
      <div class="formObj_button">
        <el-tooltip class="item" effect="light" content="清空输入框和导入数据" placement="bottom">
          <a class="btnnormal_down marginR inlineButton" @click="resetEvent">
            <div class="el-icon-refresh btnSize">重置</div>
          </a>
        </el-tooltip>
        <el-tooltip class="item" effect="light" content="提供可参考的导入数据案例" placement="bottom">
          <a class="btnnormal_down marginR inlineButton" @click="modelEvent">
            <div class="el-icon-download btnSize">模板</div>
          </a>
        </el-tooltip>
        <el-tooltip class="item" effect="light" content="至多同时执行2条任务" placement="bottom">
          <el-button v-waves type="primary" class="el-icon-right marginR" :disabled="disBtn" @click="zhixingEvent">执行</el-button>
        </el-tooltip>
      </div>
    </div>
    <div ref="tableBox" class="content_tableBox hasUp">
      <el-divider>列表</el-divider>
      <div class="tables">
        <div v-if="showVarDia" class="dialog">
          <VarifyDialog :pageJumps="pageJumps" @close="closeDialog"></VarifyDialog>
        </div>
        <div class="tableTab">
          <vxe-table ref="multipleTable" :data="tableData" stripe round :column-config="{ resizable: true }" :row-config="{ isCurrent: true, isHover: true }" class="mytable-scrollbar" auto-resize height="auto">
            >
            <template #empty>
              <img src="@/assets/images/search.png" />
              <span>空空如也</span>
            </template>
            <vxe-column type="seq" title="序号" width="5%" fixed="left"></vxe-column>
            <vxe-column min-width="15%" field="serial" title="编号" show-overflow="tooltip"></vxe-column>
            <vxe-column min-width="15%" field="tool_type" title="工具" show-overflow="tooltip"></vxe-column>
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
            <vxe-column min-width="15%" field="create_time" title="日期" show-overflow="tooltip"></vxe-column>
            <vxe-column title="操作" fixed="right" width="12%">
              <template slot-scope="scope">
                <div v-waves class="btn btn_info" :class="{'one': !ifDown || !scope.row.res_file_path || scope.row.log_status !== '执行完毕'}" @click="detailEvent(scope.row)">
                  <el-tooltip class="item" effect="dark" content="日志" placement="top">
                    <i class="el-icon-document"></i>
                  </el-tooltip>
                </div>
                <div v-if="ifDown && scope.row.res_file_path && scope.row.log_status === '执行完毕'" v-waves class="btn btn_info" @click="downEvent(scope.row)">
                  <el-tooltip class="item" effect="dark" content="下载" placement="top">
                    <i class="el-icon-document"></i>
                    <i class="el-icon-download"></i>
                  </el-tooltip>
                </div>
              </template>
            </vxe-column>
          </vxe-table>
        </div>
      </div>
      <!-- 分页器 -->
      <div class="block" v-if="total">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currpage" :page-size="pagesize" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
  <!-- excel -->
  <ExcelDialog v-if="showExcel" @close="closeEvent" :excelOpt="excelOpt" :toolType="toolType" :sheetName="sheetName"></ExcelDialog>
  <el-dialog title="日志" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="showLogDialog" @close="closeLogEvent" width="40%">
    <div v-if="logVersion" class="infinite ts">
      <div class="infinite_content">
        <vxe-table :data="logData" auto-resize height="auto" border="inner" align="center">
          <template #empty>
              <img src="@/assets/images/nolog.png" />
              <span>空空如也</span>
            </template>
          <vxe-column 
            v-for="(item, index) in logTablett"
            :key="index"
            :field="item.field"
            :title="item.title"
          ></vxe-column>
        </vxe-table>
      </div>
      <div class="infinite_ing">
        <p>
          <span v-if="endingCode === 10010" class="suc el-icon-circle-check"></span>
          <span v-else class="el-icon-loading"></span>{{ endingTxt }}
        </p>
      </div>
    </div>
    <div v-else class="infinite">
      <div class="infinite_content">
        <div v-if="logContent" class="box" v-html="logContent"></div>
        <div v-else class="box img">
          <img src="../../assets/images/loading.png" alt="" />
        </div>
      </div>
      <div class="infinite_ing">
        <p>
          <span v-if="endingCode === 10010" class="suc el-icon-circle-check"></span>
          <span v-else class="el-icon-loading"></span>{{ endingTxt }}
        </p>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="showLogDialog = false">关 闭</el-button>
    </span>
  </el-dialog>
  <div class="myplayer" :class="{ absolute: showPlaer }">
    <div class="myplayer_btn">
      <span class="iconFont el-icon-close" @click="movieDownEvent(2)"></span>
    </div>
    <video-player ref="myPlayer" class="video-player" :options="playerOptions" :playsinline="true"></video-player>
  </div>
</div>
</template>

<script>
import {
  directiveList,
  directiveSave,
  directiveLog,
  sfToolsSave,
  sfToolsDown,
  sfToolsModelDown,
  DMPSave,
  pinSelect,
  optMovie,
  dapanonLineList,
  newBudgetSubmit,
  newBudgetDown
} from "@/api/api.js";
import VarifyDialog from "@/components/varifyDialog";
import ExcelDialog from "@/components/excelDialog";
import Upload from "@/components/upload";
import message from "@/mixin/message";

export default {
  name: "DMP",
  components: {
    VarifyDialog,
    ExcelDialog,
    Upload,
  },
  props: {
    wordList: {
      type: Array
    },
    wordTip: {
      type: String
    },
    wordErr: {
      type: String
    },
    colWidth: {
      type: Object,
      // default: {
      //   choose: 24,
      //   eror: 24,
      //   pin: 24,
      //   cookie: 24,
      //   user: 24,
      //   shufang: 24
      // }
    },
    picSrc: {
      type: String,
      default: "",
    },
    picClass: {
      type: String,
      default: "",
    },
    toolType: {
      type: String,
      default: "",
    },
    sheetName: {
      type: Array,
      default: [],
    },
    excelOptions: {
      type: Array,
      default: [],
    },
    formMenu: {
      type: Number,
    },
    ifDown: {
      type: Boolean,
    },
    tipInfo: {
      type: Array
    }
  },
  mixins: [message],
  computed: {
    player() {
      return this.$refs.myPlayer.player;
    },
    tj_val() {
      return this.pulldownForm.tj_val
    },
    tj_val2() {
      return this.pulldownForm.tj_val2
    },
  },
  watch: {
    activeName(newval, oldval) {
      this.rules.username[0].message =
        newval === "1" ?
        "请输入账号" :
        "京准通登录请输入账号，京牌代理登录请输入pin";
    },
    formMenu: {
      handler(newval, oldval) {
        const vm = this;
        switch (newval) {
          case 1:
            vm.playerOptions.sources[0].src = 'http://tool.afocus.com.cn/file_download/movie/jzt/jzt.m3u8'
            break
          case 2:
            vm.playerOptions.sources[0].src = 'http://tool.afocus.com.cn/file_download/movie/sf/sf.m3u8'
            break
          default:
            vm.playerOptions.sources[0].src = 'http://tool.afocus.com.cn/file_download/movie/jzt/jzt.m3u8'
        }
      },
      immediate: true
    },
    $route: {
      handler(newval, oldval) {
        const vm = this;
        // 离开当前路由清空定时器
        vm.intervalObj.forEach((val, idx) => {
          clearInterval(val.intervalValue);
          vm.$set(val, "intervalValue", null);
        })
        vm.intervalObj = []
        clearInterval(vm.intervalDia);
        vm.intervalDia = null;
        vm.showError = vm.formMenu === 1 && vm.toolType !== '快车更新创意状态'
        vm.showCookie =
          vm.formMenu === 1 && vm.toolType !== 'DMP' && vm.toolType !== '快车更新创意状态';
        vm.getuserlist();
        vm.$nextTick(() => {
          vm.$refs.form.resetFields();
          vm.fileList = [];
          vm.excelName = "";
          vm.excelData = null;
          vm.ifErrNum = false
          // 为了美观
          setTimeout(() => {
            vm.activeNames = '2'
          }, 200);
        });
      },
      immediate: true,
      deep: true,
    },
    tj_val: {
      handler(newval, oldval) {
        let start = ''
        let stop = ''
        if (this.tj_val) start = `启动：${this.tj_lf}${this.tj_val}`
        if (this.tj_val2) stop = `   暂停：${this.tj_lf2}${this.tj_val2}`
        this.form.tiaojian = start + stop
      },
      immediate: true
    },
    tj_val2: {
      handler(newval, oldval) {
        let start = ''
        let stop = ''
        if (this.tj_val) start = `启动：${this.tj_lf}${this.tj_val}`
        if (this.tj_val2) stop = `   暂停：${this.tj_lf2}${this.tj_val2}`
        this.form.tiaojian = start + stop
      },
      immediate: true
    },
    tj_lf: {
      handler(newval, oldval) {
        let start = ''
        let stop = ''
        if (this.tj_val) start = `启动：${this.tj_lf}${this.tj_val}`
        if (this.tj_val2) stop = `   暂停：${this.tj_lf2}${this.tj_val2}`
        this.form.tiaojian = start + stop
      },
      immediate: true
    },
    tj_lf2: {
      handler(newval, oldval) {
        let start = ''
        let stop = ''
        if (this.tj_val) start = `启动：${this.tj_lf}${this.tj_val}`
        if (this.tj_val2) stop = `   暂停：${this.tj_lf2}${this.tj_val2}`
        this.form.tiaojian = start + stop
      },
      immediate: true
    }
  },
  data() {
    const vm = this;
    let chechPin = (rule, value, callback) => {
      if (!value && vm.form.choose === 1) {
        callback(new Error("请选择PIN"));
      } else {
        callback();
      }
    };
    let cktjVal = (rule, value, callback) => {
      this.$refs.pullRef.clearValidate('tj_val2')
      if (!value) {
        callback()
      } else {
        const res = /^\d+$/.test(value)
        if (!res) {
          callback(new Error("请输入数字"));
          this.form.tiaojian = ''
        } else {
          if (this.tj_val2) {
            if (this.tj_lf === '<') {
              // 启动为< 暂停为> 启动的数值需小于暂停的数值
              if (Number(value) > Number(this.tj_val2)) {
                callback(new Error("请检查启动暂停区间是否有效"));
                this.form.tiaojian = ''
              } else {
                callback();
              }
            }
            if (this.tj_lf === '>') {
              if (Number(value) < Number(this.tj_val2)) {
                callback(new Error("请检查启动暂停区间是否有效"));
                this.form.tiaojian = ''
              } else {
                callback();
              }
            }
          } else {
            callback();
          }
        }

      }
    }
    let cktjVal2 = (rule, value, callback) => {
      this.$refs.pullRef.clearValidate('tj_val')
      if (!value) {
        callback();
      } else {
        const res = /^\d+$/.test(value)
        if (!res) {
          callback(new Error("请输入数字"));
          this.form.tiaojian = ''
        } else {
          if (this.tj_val) {
            if (this.tj_lf2 === '<') {
              // 启动为> 暂停为< 启动的数值需大于暂停的数值
              if (Number(value) > Number(this.tj_val)) {
                callback(new Error("请检查启动暂停区间是否有效"));
                this.form.tiaojian = ''
              } else {
                callback();
              }
            }
            if (this.tj_lf2 === '>') {
              if (Number(value) < Number(this.tj_val)) {
                callback(new Error("请检查启动暂停区间是否有效"));
                this.form.tiaojian = ''
              } else {
                callback();
              }
            }
          } else {
            callback();
          }
        }
      }
    }
    return {
      logData: [],
      activeNames: '2',
      showLoading: false,
      iptTimer: null,
      saveCode: null,
      showPlaer: false,
      playerOptions: {
        muted: false, // false为默认打开声音
        preload: "auto",
        language: "zh-CN",
        playbackRates: [0.5, 1.0, 1.5, 2.0],
        // mp4格式
        // sources: [
        //   {
        //     type: "video/mp4",
        //     src: require("../../assets/images/movie.mp4"),
        //   },
        // ],
        // m3u8格式
        sources: [{
          withCredentials: true,
          type: "application/x-mpegURL",
          src: ''
        }],
        poster: "",
        hls: true,
        notSupportedMessage: "此视频暂无法播放，请稍后再试",
        fluid: true,
        controlBar: {
          timeDivider: true, // 当前时间和持续时间的分隔符
          durationDisplay: true, // 显示持续时间
          remainingTimeDisplay: true, // 是否显示剩余时间功能
          currentTimeDisplay: true, // 当前时间
          volumeControl: false, // 声音控制键
          playToggle: true, // 暂停和播放键
          progressControl: true, // 进度条
          fullscreenToggle: true, // 是否显示全屏按钮
        }
      },
      showError: true,
      showCookie: true,
      formSource: 1, // 点击来源 1 新建  2 导入
      excelData: null, // 提交的excel数据
      excelName: "",
      showLogDialog: false,
      propVisable: false,
      logVersion: 0,
      logContent: "",
      endingTxt: "日志正在加载",
      endingCode: "",
      excelOpt: [], // 默认的excel数据
      showExcel: false,
      errorUpInfo: "",
      rules: {
        username: [{
          required: true,
          message: "请输入账号",
          trigger: ['change', "blur"]
        }],
        password: [{
          required: true,
          message: "请输入密码",
          trigger: ['change', "blur"]
        }],
        cookie: [{
          required: true,
          message: "请输入Cookie",
          trigger: ['change', "blur"]
        }],
        choose: [{
          required: true,
          message: "请选择类型",
          trigger: ['change', "blur"]
        }],
        pin: [{
          required: true,
          validator: chechPin,
          trigger: ['change', "blur"]
        }],
        tiaojian: [{
          required: true,
          message: "请选择条件",
          trigger: ['change', "blur"]
        }]
      },
      showVarDia: false,
      options: [{
          label: "京准通",
          value: 2,
        },
        {
          label: "京牌代理",
          value: 1,
        },
      ],
      form: {
        username: "",
        password: "",
        cookie: '',
        error_num: null,
        pin: "",
        choose: 2,
        tiaojian: '',
      },
      pulldownForm: {
        tj_val: '',
        tj_val2: '',
      },
      rulesPull: {
        tj_val: [{
          required: true,
          validator: cktjVal,
          trigger: ['change', "blur"],
        }],
        tj_val2: [{
          required: true,
          validator: cktjVal2,
          trigger: ['change', "blur"],
        }]
      },
      tj_lf: '>',
      tj_lf2: '<',
      visible1: false,
      fileList: [], // excel文件列表
      loadingbut: false,
      loadingbuttext: "执行",
      tableData: [],
      msg: "", //根据上传判断执行条件
      dialogVisible: false,
      //分页器状态
      total: 0,
      currentPage: 1,
      pagesize: 20, //每页的数据条数
      currpage: 1, //默认开始页面
      log: "", //查看详情渲染的log
      intervalObj: [],
      targetItem: null,
      intervalDia: null,
      OPENTAG: false,
      disBtn: false,
      ifErrNum: false
    };
  },
  created() {

  },
  mounted() {
    const vm = this;
    vm.getPin();
  },
  methods: {
    iptClickEvent(newval, oldval) {
      const vm = this
      if (!vm.iptTimer) {
        vm.iptTimer = setTimeout(() => {
          vm.form.error_num = newval
        }, 500)
      } else {
        console.log('old', oldval)
        vm.form.error_num = oldval
        clearTimeout(vm.iptTimer)
        vm.iptTimer = null
      }
    },
    movieEvent() {
      this.showPlaer = true;
    },
    // 视频教学处理
    movieDownEvent(val) {
      const vm = this;
      vm.showPlaer = val === 1;
      if (val === 1) {
        // 在线获取视频方式
        // optMovie({
        //   path: "cookie获取方法.mp4",
        // }).then((res) => {
        //   let bloburl = window.URL.createObjectURL(
        //     new Blob([res.data], { type: "video/mpeg4" })
        //   );
        //   vm.$set(vm.playerOptions.sources[0], "src", bloburl);
        //   // 视频下载
        //   // vm.playerOptions.sources[0].src = bloburl;
        //   // vm.showPlaer = true
        //   // let link = document.createElement("a");
        //   // document.body.appendChild(link);
        //   // link.style.display = "none";
        //   // link.href = bloburl;
        //   // link.setAttribute("download", "xiazai" + Date.now() + ".mp4");
        //   // link.click();
        //   // document.body.removeChild(link);
        //   // window.URL.revokeObjectURL(bloburl);
        // });
      } else {
        vm.player.pause(); //暂停
        switch (vm.formMenu) {
          case 1:
            vm.player.src('http://tool.afocus.com.cn/file_download/movie/jzt/jzt.m3u8'); //进度条归零
            break
          case 2:
            vm.player.src('http://tool.afocus.com.cn/file_download/movie/sf/sf.m3u8'); //进度条归零
            break
        }
      }
    },
    resetEvent() {
      const vm = this;
      vm.$refs.form.resetFields();
      vm.pulldownForm = {
        tj_val: '',
        tj_val2: '',
      }
      vm.tj_lf = '>'
      vm.tj_lf2 = '<'
      vm.excelData = null;
      vm.excelName = "";
      vm.ifErrNum = false
    },
    tabClick() {
      const vm = this;
      vm.$refs.form.resetFields();
    },
    closeDialog() {
      this.showVarDia = false;
    },
    getFileEvent(val) {
      this.showLoading = false
      if (val === 'wrong') return false
      this.showLoading = false
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
    beforeeve() {
      this.showLoading = true
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
    // 获取pin下拉
    getPin() {
      const vm = this;
      pinSelect().then((res) => {
        if (res.data.code === 10000) {
          vm.pinOptions = res.data.data;
        }
      });
    },
    // 执行事件
    zhixingEvent() {
      const vm = this;
      vm.disBtn = true
      // let ingArr = vm.tableData.filter(item => {
      //   return item.log_status === '执行中'
      // })
      // if(ingArr.length >= 2) {
      //   vm.$msg({ type: "error", msg: "最多同时执行两条任务，请稍后" });
      //   vm.disBtn = false
      //   return false
      // }
      let submitdata = {
        ...vm.form,
        config_data: vm.excelData,
        start: vm.tj_val ? vm.tj_lf + vm.tj_val : '',
        stop: vm.tj_val2 ? vm.tj_lf2 + vm.tj_val2 : '',
        tool_type: vm.toolType,
      };

      vm.$refs.form.validate((valid) => {
        if (valid) {
          if (!vm.excelData) {
            vm.$msg({
              type: "error",
              msg: "请先添加表格数据"
            });
            vm.disBtn = false
          } else {
            // 提效
            if (vm.formMenu === 1) {
              if (vm.toolType === 'DMP') {
                vm.api_DMP(submitdata)
              } else {
                vm.api_directive(submitdata)
              }
            } else if (vm.formMenu === 2) {
              if (vm.toolType === '数坊人群圈选') {
                vm.openMessageBox({
                  type: "warning",
                  showClose: true,
                  tipTitle: `当前执行程序为<b>人群圈选</b>，继续执行可能会消耗资源，请知晓!`,
                  showCancelButton: true,
                  confirmButtonFn: () => {
                    vm.api_shufang(submitdata)
                  },
                  cancelButtonFn: () => {
                    vm.disBtn = false
                  }
                });
              } else {
                vm.api_shufang(submitdata)
              }
            } else if (vm.formMenu === 3) {
              // 一键预算
              let mid = submitdata.config_data[0]
              let arr = []
              for (let i in mid) {
                if (mid[i].length !== 0) {
                  arr.push(i)
                }
              }
              vm.openMessageBox({
                type: "warning",
                showClose: true,
                tipTitle: `当前已添加预算Sheet为【${arr.join(' - ')}】，是否确认？`,
                showCancelButton: true,
                confirmButtonFn: () => {
                  vm.api_budget(submitdata)
                },
                cancelButtonFn: () => {
                  vm.disBtn = false
                }
              });
            }
          }
        } else {
          vm.disBtn = false
        }
      });
    },
    // DMP保存接口
    api_DMP(obj) {
      const vm = this
      DMPSave({
        ...obj
      }).then((res) => {
        vm.disBtn = false
        if (res.data.code === 10000) {
          vm.$msg({
            msg: "保存成功"
          });
          vm.OPENTAG = true
          vm.resetEvent()
          vm.getuserlist()
        } else if (res.data.code === 10003) {
          vm.openMessageBox({
            type: "warning",
            showClose: true,
            tipTitle: `账号未授权或授权失效`,
            tipContent: `http://tool.afocus.com.cn/jos/oauth2`,
            auth: true,
            dangerouslyUseHTMLString: true,
            confirmButtonFn: () => {},
          });
        } else {
          vm.$msg({
            type: "error",
            msg: res.data.data || res.data.msg,
          });
        }
      });
    },
    // 直投保存接口
    api_directive(obj) {
      const vm = this
      directiveSave({
        ...obj,
      }).then(res => {
        vm.disBtn = false
        if (res.data.code === 10000) {
          vm.$msg({
            msg: "保存成功"
          });
          vm.OPENTAG = true
          vm.resetEvent()
          vm.getuserlist()
        } else if (res.data.code === 10006) {
          vm.$msg({
            type: "error",
            msg: "请添加正确的Excel文件"
          });
        } else if (res.data.code === 10003) {
          vm.openMessageBox({
            type: "warning",
            showClose: true,
            tipTitle: `账号未授权或授权失效`,
            tipContent: `http://tool.afocus.com.cn/jos/oauth2`,
            auth: true,
            dangerouslyUseHTMLString: true,
            confirmButtonFn: () => {},
          });
        } else {
          vm.$msg({
            type: "error",
            msg: res.data.data || res.data.msg,
          });
        }
      })
    },
    // 数坊保存接口
    api_shufang(obj) {
      const vm = this
      sfToolsSave({
        ...obj
      }).then((res) => {
        vm.disBtn = false
        if (res.data.code === 10000) {
          vm.$msg({
            msg: "保存成功"
          });
          vm.OPENTAG = true
          vm.resetEvent()
          vm.getuserlist()
        } else if (res.data.code === 10006) {
          vm.$msg({
            type: "error",
            msg: "请添加正确的Excel文件"
          });
        } else {
          vm.$msg({
            type: "error",
            msg: res.data.data || res.data.msg,
          });
        }
      });
    },
    // 一键预算保存接口
    api_budget(obj) {
      const vm = this
      newBudgetSubmit({
        ...obj
      }).then((res) => {
        vm.disBtn = false
        if (res.data.code === 10000) {
          vm.$msg({
            msg: "保存成功"
          });
          vm.OPENTAG = true
          vm.resetEvent()
          vm.getuserlist()
        } else if (res.data.code === 10003) {
          vm.openMessageBox({
            type: "warning",
            showClose: true,
            tipTitle: `账号未授权或授权失效`,
            tipContent: `http://tool.afocus.com.cn/jos/oauth2`,
            auth: true,
            dangerouslyUseHTMLString: true,
            confirmButtonFn: () => {},
          });
        } else {
          vm.$msg({
            type: "error",
            msg: res.data.data || res.data.msg,
          });
        }
      });
    },
    //查看列表
    getuserlist() {
      const vm = this;
      if (vm.formMenu === 3) {
        // 预算
        dapanonLineList({
          tool_type: vm.toolType,
          limit: vm.pagesize,
          page: vm.currpage
        }).then((res) => {
          if (res.data.code === 10000) {
            let result = res.data;
            vm.tableData = result.data;
            vm.total = result.count;
            vm.relateInterval(result)
          } else {
            vm.$msg({
              type: "error",
              msg: res.data.msg
            });
          }
        });
      } else {
        // 其他
        directiveList({
          tool_type: vm.toolType,
          limit: vm.pagesize,
          page: vm.currpage
        }).then((res) => {
          if (res.data.code === 10000) {
            let result = res.data;
            vm.tableData = result.data;
            vm.total = result.count;
            vm.relateInterval(result)
          } else {
            vm.$msg({
              type: "error",
              msg: res.data.msg
            });
          }
        });
      }
    },
    // 定时器相关
    relateInterval(result) {
      const vm = this;
      vm.endingTxt = '日志正在加载';
      vm.logContent = '';
      vm.endingCode = 10000
      // 每次新执行完
      // 所有要先清空再删除掉
      if (vm.OPENTAG) {
        vm.detailEvent(vm.tableData[0])
        for (let i of result.data) {
          if (i.log_status === "执行中") {
            for (let k of vm.intervalObj) {
              if (k.intervalName === `interval_${i.serial}`) {
                clearInterval(k.intervalValue);
                vm.$set(k, "intervalValue", null);
                break
              }
            }
          }
        }
        vm.intervalObj = []
      }
      for (let i of result.data) {
        if (i.log_status === "执行中") {
          let obj = {};
          vm.$set(obj, "intervalName", `interval_${i.serial}`);
          vm.$set(
            obj,
            "intervalValue",
            setInterval(() => {
              directiveLog({
                path: i.file_path,
              }).then((resu) => {
                for (let j in result.data) {
                  if (vm.tableData[j].serial === i.serial) {
                    if (resu.data.code === 10000 || resu.data.code === 10010) {
                      // 执行中或者执行完毕
                      vm.$set(vm.tableData[j], "log_status", resu.data.log_status);
                      vm.$set(vm.tableData[j], "res_file_path", resu.data.code === 10000 ? '' : resu.data.res_file_path);
                      vm.$set(obj, "logVersion", resu.data.version);
                      vm.$set(obj, "code", resu.data.code)
                      if (resu.data.version === 1) {
                        // 新版
                        vm.$set(obj, "logData", JSON.parse(JSON.stringify(vm.handleLogStr(resu.data.data))));
                      } else {
                        vm.$set(obj, "html", resu.data.data || "");
                      }
                    }
                    if (resu.data.code === 10000) {
                      vm.$set(
                        obj,
                        "txt",
                        resu.data.data ? "日志持续获取中" : "日志正在加载"
                      );
                    } else if (resu.data.code === 10010) {
                      vm.$set(obj, "txt", "日志加载完毕");
                      for (let k in vm.intervalObj) {
                        if (
                          vm.intervalObj[k].intervalName.indexOf(
                            i.serial
                          ) !== -1
                        ) {
                          clearInterval(vm.intervalObj[k].intervalValue);
                          vm.$set(vm.intervalObj[k], "intervalValue", null);
                          break;
                        }
                      }
                    } else {
                      vm.$msg({
                        type: "error",
                        msg: resu.data.msg
                      });
                      vm.$set(vm.tableData[j], "log_status", '错误');
                      vm.$set(obj, "code", '错误');
                      vm.$set(obj, "html", '错误');
                      vm.$set(obj, "logVersion", 0);
                      vm.$set(obj, "logData", []);
                      vm.$set(
                        obj,
                        "txt",
                        '错误'
                      );
                    }
                    break;
                  }
                }
              });
            }, 6000)
          );
          vm.intervalObj.push(obj);
        }
      }
    },
    //no - 打开日志弹层
    detailEvent(row) {
      const vm = this;
      vm.showLogDialog = true;
      if (row.log_status === '执行完毕' || row.log_status === '执行有误') {
        vm.logEvent(row.file_path);
      } else {
        clearInterval(vm.intervalDia);
        vm.intervalDia = null;
        vm.intervalDia = setInterval(() => {
          for (let i of vm.intervalObj) {
            if (i.intervalName.indexOf(row.serial) !== -1) {
              vm.endingTxt = i.txt || '日志正在加载';
              vm.logContent = i.html;
              vm.endingCode = i.code
              vm.logVersion = i.logVersion
              vm.logData = i.logData
              break
            }
          }
        }, 300);
      }

    },
    //  no - 日志接口
    logEvent(path) {
      const vm = this;
      directiveLog({
        path,
      }).then((res) => {
        vm.logVersion = res.data.version
        vm.endingCode = res.data.code;
        if (vm.logVersion) {
          if (res.data.code === 10000) {
            vm.endingTxt = res.data.data ? "日志持续获取中" : "日志正在加载";
            vm.logData = JSON.parse(JSON.stringify(vm.handleLogStr(res.data.data)))
          } else if (res.data.code === 10010) {
            vm.endingTxt = "日志加载完毕";
            vm.logData = JSON.parse(JSON.stringify(vm.handleLogStr(res.data.data)))
          } else {
            // 错误  清除定时器
            vm.$msg({
              type: "error",
              msg: "日志获取失败"
            });
          }
        } else {
          if (res.data.code === 10000) {
            vm.endingTxt = res.data.data ? "日志持续获取中" : "日志正在加载";
            vm.logContent = res.data.data || "";
          } else if (res.data.code === 10010) {
            vm.endingTxt = "日志加载完毕";
            vm.logContent = res.data.data || "";
          } else {
            // 错误  清除定时器
            vm.$msg({
              type: "error",
              msg: "日志获取失败"
            });
          }
        }
      });
    },
    handleLogStr(targetStr) {
      const vm = this
      // let str = '程序开始@@@姓名|年龄|班级\n张三|10|1\n李四|9|1@@@程序结束'
      let midTab1 = targetStr.split('@@@')
      let midData = midTab1[1].split('$').slice(0, -1)
      let tableRes = []
      midData.forEach((val, idx) => {
        let arr = val.split('|')
        
        if (idx === 0) {
          vm.logTablett = []
          // 表头
          arr.forEach((item, index) => {
            vm.logTablett.push({
              title: item,
              field: 'label' + index
            })
          })
        }
        if (idx > 0) {
          let obj = {}
          arr.forEach((item, index) => {
            vm.$set(obj, 'row', idx)
            vm.$set(obj, 'label' + index, item)
          })
          tableRes.unshift(obj)
        }
      })
      return tableRes
    },
    //  no -关闭日志弹层
    closeLogEvent() {
      const vm = this
      vm.OPENTAG = false
      this.logContent = "";
      this.endingTxt = "日志正在加载";
      this.endingCode = 0;
      clearInterval(vm.intervalDia);
      vm.intervalDia = null;
    },
    // no -下载文件
    downEvent(row) {
      const vm = this;
      if (row.tool_type === 'dmp') {
        sfToolsModelDown({
          name: row.res_file_path
        }).then(res => {
          let data = res.data;
          let url = window.URL.createObjectURL(new Blob([data]));
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", `日志-${vm.toolType}.xlsx`);
          document.body.appendChild(link);
          link.click();
        })
      } else {
        sfToolsDown({
          log_id: row.id,
        }).then((res) => {
          let data = res.data;
          let url = window.URL.createObjectURL(new Blob([data]));
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", `日志-${vm.toolType}.zip`);
          document.body.appendChild(link);
          link.click();
        });
      }
    },
    //  no -下载模板
    modelEvent() {
      const vm = this;
      sfToolsModelDown({
        name: vm.toolType,
      }).then((res) => {
        let data = res.data;
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", `模板-${vm.toolType}${vm.toolType=== 'DMP' ? '.zip' : '.xlsx'}`);
        document.body.appendChild(link);
        link.click();
      });
    },
    //  no -关闭excel
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
    //  no -
    chooseEvent() {
      this.form.pin = "";
      this.form.username = "";
      this.$refs.form.clearValidate(["pin", "username"]);
    },
    seitchEvent(val) {
      const vm = this
      vm.form.error_num = val ? 1 : null
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
    focusEvent1() {
      this.$refs.refKoujing.showPanel()
    },
    // 启动：大小于
    tjEvent(tag, val) {
      if (tag === 1) this.tj_lf2 = val === '>' ? '<' : '>'
      if (tag === 2) this.tj_lf = val === '>' ? '<' : '>'
    }
  },
};
</script>

<style lang="less" scoped>
@import "@/views/index";
@import "index";
@import "../../views/BudgetAlarm/index.less";
</style>
