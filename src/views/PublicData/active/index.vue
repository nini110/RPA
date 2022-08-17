<template>
  <!-- 活动页面SKU -->
  <div class="activePageSKU outerDiv">
    <div class="content">
      <div class="content_form">
        <el-form ref="form" :model="form" class="formObj">
          <div class="formObj_ipt">
            <el-form-item label="PIN:" prop="pin">
              <el-input
                placeholder="请输入活动页面URL"
                v-model.trim="form.url"
                clearable
              >
                <el-button
                  slot="append"
                  type="primary"
                  :disabled="!form.url"
                  @click="going"
                  >执行</el-button
                >
              </el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="content_tableBox hasUp4">
        <div class="tables">
          <div class="tableTab">
            <vxe-table
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
                v-for="(item, idx) in tabList"
                :key="idx"
                :field="item.prop"
                :title="item.label"
                show-overflow="tooltip"
              ></vxe-column>
              <vxe-column title="操作" fixed="right" width="10%">
                <template slot-scope="scope">
                  <div v-waves class="btn btn_info" @click="lianjie(scope.row)">
                    <svg class="icon svg-icon titleicon" aria-hidden="true">
                      <use xlink:href="#icon-download"></use>
                    </svg>
                  </div>
                </template>
              </vxe-column>
            </vxe-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { hdskuLookData, performSku } from "@/api/api.js";
export default {
  data() {
    return {
      form: {
        url: "",
      },
      //表格数据接受
      tableData: [],
      tabList: [
        {
          label: "时间",
          prop: "c_time",
        },
        {
          label: "查看链接",
          prop: "link",
        },
        {
          label: "Excel表",
          prop: "file_name",
        },
      ],
      //请求传的参数
      userid: "",
      code: "",
      username: "",
      // 当前选中excel
      tablerow: "",
      //下载url
      resurl: true,
    };
  },
  created() {},
  mounted() {
    this.userid = localStorage.getItem("wx_userid");
    this.code = localStorage.getItem("wx_code");
    this.username = localStorage.getItem("user_name");
    this.getuserlist();
  },
  methods: {
    //查看
    getuserlist() {
      const vm = this;
      hdskuLookData({
        trans_name: vm.username,
      }).then((res) => {
        if (res.data.data.length > 0) {
          vm.tableData = res.data.data;
        } else {
          vm.$msg({ type: "warning", msg: "暂无数据" });
        }
      });
    },
    //执行
    going() {
      performSku({
        trans_name: this.username,
        url: this.form.url,
      }).then((res) => {
        if (res.data.code === 10000) {
          this.form.url = "";
          this.getuserlist();
        }
      });
    },
    // 下载
    lianjie(scope) {
      this.$axios({
        url: "http://114.67.229.243:8001/apps/sku_excel_download/",
        method: "get",
        headers: {
          uid: this.userid,
          code: this.code,
          "Content-Type": "application/json",
        },
        responseType: "blob",
        params: {
          file_name: scope.file_name,
        },
      }).then(
        (res) => {
          const blob = new Blob([res.data], {
            type: "application/vnd.ms-excel",
            charset: "utf-8",
            "content-type": "application/octet-stream",
          });
          const objectUrl = URL.createObjectURL(blob);
          window.location.href = objectUrl;
        },
        (err) => {}
      );
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/views/index";
</style>
