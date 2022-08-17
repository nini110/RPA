<template>
  <div class="topTtle">
    <div class="topTtle_logo">
      <img src="../../assets/logo.png" alt="" />
    </div>
    <div class="topTtle_login">
      <div class="topTtle_login_tip">
        <!-- <img class="img" src="./assets/logo2Blue.png" alt=""> -->
        <!-- <img class="img" src="../../assets/logo2.png" alt="" /> -->
        <el-popover
          placement="bottom-start"
          title=""
          trigger="hover"
          popper-class="poperNotice"
          content=""
        >
          <el-button
            slot="reference"
            size="mini"
            class="poperBtn iconfont icon-yangshengqi"
            >公告</el-button
          >
          <div class="poperNotice_cnt">
            <div class="down" v-for="(item, idx) in downList" :key="idx">
              <svg
                class="icon svg-icon poperNotice_cnt_icon"
                aria-hidden="true"
              >
                <use :xlink:href="item.icon"></use>
              </svg>
              <span>{{ item.label }}</span>
              <a :href="item.url" target="_blank">点击下载</a>
            </div>
            <el-divider></el-divider>
            <div class="down tool">
              <svg
                class="icon svg-icon poperNotice_cnt_icon"
                aria-hidden="true"
              >
                <use xlink:href="#icon-gongjuxiang"></use>
              </svg>
              <span @click="download">工具下载</span>
            </div>
          </div>
        </el-popover>
      </div>

      <div v-if="$route.name !== 'login'" class="topTtle_login_user">
        <div class="user">
          <el-popover
            content=""
            trigger="hover"
            placement="bottom"
            popper-class="poperNotice"
          >
            <div slot="reference">
              <img class="user_img" :src="user.img" alt="" />
              <span class="user_name">{{ user.name }}</span>
            </div>
            <div style="text-align: center">{{ user.id }}</div>
          </el-popover>
          <span class="logout iconfont icon-tcdl" @click="close"></span>
          <span
            v-if="errorLogs.length > 0"
            :class="{ active: errorLogs.length > 0 }"
            class="bugSpan iconfont icon-bug-report"
            @click="showError"
            >错误</span
          >
        </div>
        <!-- <div id ="togleCol" class="phone iconfont icon-shouji" @click="toggleMode()">移动版</div> -->
      </div>
    </div>
    <EorLog :showLog="showLog" @close="closeLog"></EorLog>
    <div ref="toolRef" class="hidedox" v-html="info"></div>
    <el-drawer
      title="工具下载"
      :visible.sync="downdrawer"
      direction="rtl"
      :before-close="handleClose"
      size="35%"
      append-to-body
    >
      <vxe-table
        ref="multipleTable"
        :data="infoList"
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
          width="10%"
          fixed="left"
        ></vxe-column>
        <vxe-column min-width="25%" title="名称" show-overflow="tooltip">
          <template slot-scope="scope">
            <span class="downSpanSpan" @click="downloadEvent(scope.row)">{{
              scope.row.name
            }}</span>
          </template></vxe-column
        >
        <vxe-column
          min-width="10%"
          field="size"
          title="大小"
          show-overflow="tooltip"
        ></vxe-column>
        <vxe-column
          min-width="15%"
          field="date"
          title="更新日期"
          show-overflow="tooltip"
        ></vxe-column>
        <!-- <vxe-column
          min-width="15%"
          field="time"
          title="时间"
          show-overflow="tooltip"
        ></vxe-column> -->
        <!-- <vxe-column title="操作" fixed="right" width="8%">
          <template slot-scope="scope">
            <div v-waves class="btn btn_info" @click="download(scope.row)">
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
          </template> -->
        <!-- </vxe-column> -->
      </vxe-table>
    </el-drawer>
  </div>
</template>
<script>
import message from "@/mixin/message";
import EorLog from "@/components/errorLog/index.vue";
import { mapGetters } from "vuex";
import { createLinkToClick } from "@/utils/public.js";

export default {
  name: "Header",
  components: {
    EorLog,
  },
  mixins: [message],
  data() {
    return {
      downdrawer: false,
      info: "",
      infoList: [],
      showLog: false,
      user: {
        name: "",
        img: "",
      },
      options: {
        bottom: "unset", // default: '32px'
        right: "220px", // default: '32px'
        left: "unset", // default: 'unset'
        time: "0.5s", // default: '0.3s'
        mixColor: "#fff", // default: '#fff'
        backgroundColor: "#fff", // default: '#fff'
        buttonColorDark: "#100f2c", // default: '#100f2c'
        buttonColorLight: "#fff", // default: '#fff'
        saveInCookies: false, // default: true,
        label: "🌓", // default: ''
        // label: '切换主题', // default: ''
        autoMatchOsTheme: true, // default: true
      },
      downList: [
        {
          icon: "#icon-Windows",
          label: "工具驱动配置文档(win)",
          url: "http://tool.afocus.com.cn/file_download/工具驱动配置文档(win).docx",
        },
        {
          icon: "#icon-apple",
          label: "工具驱动配置文档(mac)",
          url: "http://tool.afocus.com.cn/file_download/工具驱动配置文档(mac).docx",
        },
        {
          icon: "#icon-qudongjingling",
          label: "小工具驱动下载地址",
          // url: "https://npm.taobao.org/mirrors/chromedriver/",
          url: "http://chromedriver.storage.googleapis.com/index.html",
        },
        {
          icon: "#icon-a-Group269-4",
          label: "自有客户通用日报模板",
          url: "http://tool.afocus.com.cn/file_download/自有客户通用日报模板.xlsx",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["errorLogs"]),
  },
  created() {
    const vm = this;
    //如果本地存储为空，跳回登入页 单方面前端开发时 注销此项
    if (
      localStorage.getItem("wx_userid") &&
      localStorage.getItem("wx_code") &&
      localStorage.getItem("user_name")
    ) {
      vm.user = {
        name: localStorage.getItem("user_name"),
        id: "工号： " + localStorage.getItem("wx_userid"),
        img: localStorage.getItem("thumb_avatar"),
      };
      vm.user.name = localStorage.getItem("user_name");
      vm.check().then((res) => {
        if (!res) {
          // vm.$msg({ type: "warning", msg: "登录失效，请进行扫码登入" });
          setTimeout(() => {
            vm.$router.push({
              path: "/login",
            });
            localStorage.removeItem("wx_code");
            localStorage.removeItem("wx_userid");
            localStorage.removeItem("user_name");
            localStorage.removeItem("thumb_avatar");
          }, 2000);
        }
      });
    } else {
      vm.$msg({ type: "warning", msg: "请进行扫码登入" });
      vm.user.name = "未登入";
      vm.$router.push({
        path: "/login",
      });
    }
  },
  mounted() {
    const vm = this;
    vm.$axios({
      // 后端服务器端口路径
      url: "http://tool.afocus.com.cn/tool_set/",
      params: {
        key: "no",
      },
      method: "get",
      dataType: "html",
      headers: { "content-type": "application/x-www-form-urlencoded" },
    }).then((res) => {
      vm.info = res.data;
      vm.$nextTick(() => {
        vm.info = res.data;
        let target = vm.$refs.toolRef.childNodes[5].childNodes;
        let midData1 = [];
        let midData2 = [];
        for (let i of target) {
          if (i.nodeName === "#text") {
            let targetStr = i.nodeValue.trim();
            midData1.push({
              date: targetStr.slice(0, 11),
              time: targetStr.slice(11, 18),
              size: targetStr.slice(targetStr.length - 3, targetStr.length),
            });
          }
          if (i.nodeName === "A") {
            midData2.push({
              name: i.innerText,
              url: i.pathname,
            });
          }
        }
        midData1.forEach((val, idx) => {
          if (idx !== 0) {
            vm.infoList.push({
              date: val.date,
              time: val.time,
              size: val.size,
              name: midData2[idx].name,
              url: midData2[idx].url,
            });
          }
        });
      });
    });
  },
  methods: {
    handleClose() {
      this.downdrawer = false;
    },
    download() {
      this.downdrawer = true;
      // createLinkToClick(`http://tool.afocus.com.cn/tool_set/${item.url}`);
    },
    downloadEvent(item) {
      createLinkToClick(`http://tool.afocus.com.cn/tool_set/${item.url}`);
    },
    showError() {
      this.showLog = true;
    },
    closeLog() {
      this.showLog = false;
    },
    toggleMode() {},
    // 退出登录
    close() {
      const vm = this;
      let userid = localStorage.getItem("wx_userid");
      let code = localStorage.getItem("wx_code");
      let username = localStorage.getItem("user_name");
      vm.openMessageBox({
        type: "warning",
        showClose: true,
        tipTitle: `是否 [ 确定 ] 退出当前帐号？`,
        showCancelButton: true,
        confirmButtonFn: () => {
          vm.$axios({
            // 后端服务器端口路径
            url: `${this.DomainName}/platform/logout`,
            method: "get",
            params: {
              wx_userid: userid,
              wx_code: code,
            },
          }).then((response) => {
            if (response.data.code == 1) {
              vm.$msg({ type: "error", msg: "退出失败" });
            } else {
              localStorage.clear();
              // location.href = `${this.DomainName}/platform/login`;
              // location.href = `${this.DomainName}/#/login`;
              this.$router.push({
                path: "/login",
              });
            }
          });
        },
      });
    },
  },
};
</script>
<style lang="less">
@import "./index";
.hidedox {
  display: none;
}
.downSpanSpan {
  color: #2779b4;
  cursor: pointer;
}
</style>
