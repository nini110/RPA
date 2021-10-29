<template>
  <!-- 活动页面SKU -->
  <div class="activePageSKU outerDiv">
    <div class="content">
      <div class="form">
        <div class="formObj">
          <div class="topContent">
            <el-input
              placeholder="请输入活动页面URL"
              v-model="input"
              class="input-with-select"
			  clearable
            >
              <el-button
                slot="append"
                type="primary"
                :disabled="this.input == '' ? true : false"
                @click="going"
                >执行</el-button
              >
            </el-input>
          </div>
          <div
            class="tableTab"
            style="width: 100%; margin-top: 20px"
            v-if="tableData"
          >
            <el-table
              ref="singleTable"
              :data="tableData"
              height="540"
              :highlight-current-row="true"
              :cell-style="timeStyle"
            >
              <!-- 表格日期 -->
              <el-table-column
                property="c_time"
                label="时间"
                width="150"
                align="center"
              >
                <template slot-scope="scope">
                  <div>
                    {{ scope.row.c_time }}
                  </div>
                </template>
              </el-table-column>

              <!-- 查看链接 -->
              <el-table-column
                property="link"
                label="查看链接"
                width="300"
                align="center"
              >
                <template slot-scope="scope">
                  <div>
                    {{ scope.row.link }}
                  </div>
                </template>
              </el-table-column>

              <!-- excel表 -->
              <el-table-column
                property="file_name"
                label="Excel表"
                width="280"
                align="center"
              >
                <template slot-scope="scope">
                  <div>
                    {{ scope.row.file_name }}
                  </div>
                </template>
              </el-table-column>

              <!-- 操作 -->
              <el-table-column
                property="download"
                label="下载"
                width="150"
                align="center"
              >
                <template slot-scope="scope">
                  <div>
                    <button @click="lianjie(scope)">
                      <a id="download" type="primary">下载</a>
                    </button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
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
      //表格数据接受
      tableData: [],
      //输入skuURl
      input: "",
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
  created() {
    // check方法调用接口,判断用户是否登录!
    this.check();
  },
  methods: {
    timeStyle() {
      return "height:50px;padding:0;";
    },
    //查看
    getuserlist() {
      hdskuLookData({
        trans_name: this.username,
      })
        .then((res) => {
          this.tableData = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //执行
    going() {
      performSku({
        trans_name: this.username,
        url: this.input,
      })
        .then((res) => {})
        .catch((err) => {
          console.log(err);
        });
      // let sku = new FormData();
      // sku.append("trans_name",this.username)
      // sku.append("url",this.input);
      // this.$axios({
      //   url:"http://114.67.229.243:5005/apps/sku_get/",
      //   method:"post",
      //   headers: { uid: this.userid, code: this.code },
      //   data: sku,
      // }).then((data)=>{
      //   if(data.data.code=="10000"){
      //     console.log(data.data.code)
      //     this.input = "";
      //     this.getuserlist()
      //   }

      // },(err)=>{
      //   console.log(err)
      // })
    },
    // 下载
    lianjie(scope) {
      console.log(scope.row.file_name);
      this.$axios({
        url: "http://114.67.229.243:8001/apps/sku_excel_download/",
        method: "get",
        headers: {
          uid: this.userid,
          code: this.code,
          "Content-Type": "application/json",
        },
        responseType: "blob",
        params: { file_name: scope.row.file_name },
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
        (err) => {
          console.log(err);
        }
      );
    },
  },
  mounted() {
    this.userid = localStorage.getItem("wx_userid");
    this.code = localStorage.getItem("wx_code");
    this.username = localStorage.getItem("user_name");
    this.getuserlist();
  },
};
</script>

<style lang="less" scoped>
@import "../../index";
.activePageSKU {
  .content {
    .form {
      .formObj {
        width: 900px;
        margin: 0 auto;
        .topContent {
          display: flex;
        }
      }
    }
  }
}
</style>
