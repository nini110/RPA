<template>
  <div class="outerDiv">
    <div class="content">
      <div class="content_form ts">
        <el-form ref="form" :model="form" class="formObj" :rules="rules">
          <div class="formObj_ipt">
            <div class="formObj_ipt_abso">
              <el-result>
                <template slot="icon">
                  <!-- <svg class="icon svg-icon titleicon" aria-hidden="true">
                    <use xlink:href="#icon-qiehuan2"></use>
                  </svg> -->
                  <img :src="picSrc" alt="" />
                </template>
                <template slot="extra">
                  <span>{{ $route.meta.title }}</span>
                </template>
              </el-result>
            </div>
            <div class="formObj_ipt_rt">
              <!-- <el-tabs v-model="activeName">
                <el-tab-pane
                  v-for="(item, idx) in radioOpt"
                  :label="item.txt"
                  :key="idx"
                  :name="item.code"
                ></el-tab-pane>
              </el-tabs> -->
              <el-row :gutter="20">
                <el-col v-if="formMenu === 1" :span="showCookie ? 12 : 24">
                  <el-form-item label="类型" prop="choose">
                    <el-select
                      v-model="form.choose"
                      placeholder="请选择类型"
                      size="large"
                      @change="chooseEvent"
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

                <el-col v-if="form.choose === 1" :span="showCookie ? 12 : 24">
                  <el-form-item label="PIN" prop="pin">
                    <el-select
                      v-model="form.pin"
                      placeholder="请选择PIN"
                      size="medium"
                      filterable
                      clearable
                    >
                      <el-option
                        v-for="item in pinOptions"
                        :key="item"
                        :label="item"
                        :value="item"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col v-else :span="showCookie ? 12 : 24">
                  <el-form-item label="账号" prop="username">
                    <el-input
                      v-model.trim="form.username"
                      size="large"
                      placeholder="请输入账号"
                      clearable
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col v-if="showCookie || formMenu === 2" :span="24">
                  <el-form-item label="Cookie" prop="cookie">
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
          <el-tooltip
            class="item"
            effect="dark"
            content="清空输入框和导入数据"
            placement="top"
          >
            <a class="btnnormal_down marginR inlineButton" @click="resetEvent">
              <div class="el-icon-refresh btnSize">重置</div>
            </a>
          </el-tooltip>
          <el-tooltip
            v-if="toolType !== 'DMP'"
            class="item"
            effect="dark"
            content="Cookie获取视频教学"
            placement="top"
          >
            <a
              class="btnnormal_down marginR inlineButton"
              @click="movieDownEvent(1)"
            >
              <div class="el-icon-video-play btnSize">视频教学</div>
            </a>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="提供可参考的导入数据案例"
            placement="top"
          >
            <a class="btnnormal_down marginR inlineButton" @click="modelEvent">
              <div class="el-icon-download btnSize">模板</div>
            </a>
          </el-tooltip>

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
                    v-if="ifDown && scope.row.log_status === '执行完毕'"
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
    <div class="myplayer" :class="{ absolute: showPlaer }">
      <div class="myplayer_btn">
        <span class="iconFont el-icon-close" @click="movieDownEvent(2)"></span>
      </div>
      <video-player
        ref="myPlayer"
        class="video-player"
        :options="playerOptions"
        :playsinline="true"
      ></video-player>
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
    picSrc: {
      type: String,
      default: "",
    },
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
    ifDown: {
      type: Boolean,
    },
  },
  mixins: [message],
  computed: {
    player() {
      return this.$refs.myPlayer.player;
    },
  },
  watch: {
    activeName(newval, oldval) {
      this.rules.username[0].message =
        newval === "1"
          ? "请输入账号"
          : "京准通登录请输入账号，京牌代理登录请输入pin";
    },
    $route: {
      handler(newval, oldval) {
        const vm = this;
        vm.showCookie =
          vm.formMenu === 1 && newval.fullPath.indexOf("DMP") === -1;
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
      showPlaer: false,
      playerOptions: {
        // videojs options
        muted: false, // false为默认打开声音
        preload: 'auto', 
        language: "zh-CN",
        playbackRates: [0.5, 1.0, 1.5, 2.0],
        sources: [
          {
            type: "video/mp4",
            src: require("../../assets/images/movie.mp4"),
          },
        ],
        poster: "",
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
        },
      },
      showCookie: true,
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
        username: "拜耳对外投放账号",
        password: "",
        cookie: "__jdu=16622939436621705406294; shshshfpb=wQTDFd64amkPsy_unwm1jGg; shshshfpa=e4d2d84f-2e60-8a90-e101-6ce8fb396561-1664521203; unpl=JF8EALRnNSttXEhWUB0FHkAXQggBWwoITR5TbmQHVVtYSAAFTAoaQRR7XlVdXxRKFB9sZRRUWFNPVA4YCysSEXteU11bD00VB2xXVgQFDQ8WUUtBSUt-SVxRWFULSx4Ba2AFZG1bS2QFGjIbFRdIXlxcVQ1JEARsZwNVWV1KUwYTBysTIExtZG5VCUgSA21XBGRcaAkAWRIGHhMVQxBUWVoLSB8BZ2IHU1pbS1IEHwcaFRNDWGRfbQs; areaId=1; ipLoc-djd=1-2800-0-0; PCSYCityID=CN_110000_110100_0; shshshfp=85c4b61927c057ce26ff69a6db66663c; shshshfpx=e4d2d84f-2e60-8a90-e101-6ce8fb396561-1664521203; __jdv=146207855|baidu|-|organic|notset|1677135109586; language=zh_CN; cn_language=zh_CN; ceshi3.com=000; logining=1; pinId=8QLRh2dBwy4hRO0oqI8I0ZKZQlJc-P50tX37H5_fCPs; pin=%E6%8B%9C%E8%80%B3%E5%AF%B9%E5%A4%96%E6%8A%95%E6%94%BE%E8%B4%A6%E5%8F%B7; unick=jd_HGcygOlkrWVq; _tp=Xqgcf4eDOzMlfX2uS6Ryd1siw6qm7ljL%2F8JYB3q24aVfaAP8TJNrdoNG8pd3ATTgXAjbT5Nd78uZZBqCONsupdKMo236RTN9%2BbG6iOE2yEw%3D; _pst=%E6%8B%9C%E8%80%B3%E5%AF%B9%E5%A4%96%E6%8A%95%E6%94%BE%E8%B4%A6%E5%8F%B7; 3AB9D23F7A4B3C9B=DOD6TSJOD3N5LFZQG34CCU76CZXAY3VK2BIPFPIZGZXIHVZPAHFWCZBZBS2EMIRGDGBGMWCON4RH5T2JZE7IGI7ZOI; TrackID=1a8GQVm2XiEEa3aQAMLxytCLQKS55ZbbIQ4R62cgSmIYI0--IQ4rxP5NUlWjVrTz_IX9ydIzV-HDnZfzXEK1Yu2RSTFotd100N5UqQqUwUl7q1nudrak6Kv2Fw2GqJ0AuPanf7QXLmb0UnwDwBMSfoA; thor=62773A26D5E916B8B493B1B84C66F43BCF58665C26A858F3AEF00F9D6E1E90273B476692316ECE370F31FB766EE7FC6439D56F96E65917C46D4975A0AE6E60E3577851C62FA8DAE9BB9C5BF0630D0E661894A10F1ACEBDCEBF3FE9D09E4CAD1BB5F955D1A9406A068C056000131177EEBA0AFE40B8F9EF43F33B8F29F147BD4ECEAC48C51149EAD04586F69A049F6C8A; __jda=146207855.16622939436621705406294.1662293943.1677135110.1677209462.25; __jdc=146207855; __jdb=146207855.6.16622939436621705406294|25.1677209462",
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

      intervalData_dmp: [],
      intervalData_booth: [],
      intervalData_direct: [],
      intervalData_people: [],
      intervalData_cube: [],
      intervalData_goshop: [],
    };
  },
  mounted() {
    const vm = this;
    vm.getPin();
  },
  methods: {
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
        vm.player.src(require("../../assets/images/movie.mp4")); //进度条归零
      }
    },
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
              if (vm.$route.fullPath.indexOf("DMP") !== -1) {
                DMPSave({ ...submitdata }).then((res) => {
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
              } else {
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
              }
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
        link.setAttribute("download", `日志-${vm.toolType}.zip`);
        document.body.appendChild(link);
        link.click();
      });
    },
    // 下载模板
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
        link.setAttribute("download", `模板-${vm.toolType}.xlsx`);
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
    //
    chooseEvent() {
      this.form.pin = "";
      this.form.username = "";
      this.$refs.form.clearValidate(["pin", "username"]);
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
@import "index";
</style>
