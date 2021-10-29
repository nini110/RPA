<template>
  <!-- 竞标监控 -->
  <div class="biddingForMonitoring outerDiv">
    <div class="content">
      <div class="form">
        <div style="width: 126px; margin: 0 auto">
          <div class="btnSizeBig" @click="upList()">上传竞标按钮</div>
        </div>
      </div>
      <div class="tableBox">
        <el-divider>列表</el-divider>
        <div class="tables" v-if="tableData">
          <el-table
            ref="singleTable"
            :data="tableData"
            height="900"
            @cell-click="celltable"
            :highlight-current-row="true"
            :cell-style="timeStyle"
          >
            <el-table-column
              type="index"
              width="50"
              label="序号"
              align="center"
            >
            </el-table-column>
            <el-table-column
              property="bidding_name"
              label="竞标名称"
              width="250"
            >
            </el-table-column>
            <el-table-column
              property="activity_name"
              label="活动名称"
              width="150"
            >
            </el-table-column>
            <el-table-column property="budget" label="总预算" width="150">
            </el-table-column>
            <el-table-column property="trans_name" label="上传人" width="150">
            </el-table-column>
            <el-table-column
              property="cheack"
              label="操作"
              fixed="right"
              width="180"
            >
              <el-button type="text" @click="lookxq = true">查看详情</el-button>
              <el-button type="text" @click="centerDialogVisible = true"
                >修改</el-button
              >
              <el-button type="text" @click="biddingDelete()">删除</el-button>
            </el-table-column>
          </el-table>
          <div class="block" v-if="total">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currpage"
              :page-size="pagesize"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!-- 上传竞标 -->
    <el-dialog
      title="上传竞标"
      :visible.sync="dialogVisible"
      @close="clearlist"
      width="600px"
      max-height="600px"
      custom-class="dialogJb"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" label-width="90px" class="formObj">
        <el-form-item label="选择竞标:">
          <el-select
            v-model="content"
            filterable
            remote
            reserve-keyword
            placeholder="请输入标名或者项目编号"
            :remote-method="search"
            :loading="loading"
            :popper-append-to-body="false"
            clearable
            @change="jbChangeEvent"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="`编号:${item.pro_num}——标名：${item.pro_name}`"
              :value="item.pro_num"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择活动:">
          <el-collapse-transition>
            <div v-if="cities && cities.length > 0">
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="handleCheckAllChange"
                >全选</el-checkbox
              >
              <el-checkbox-group
                v-model="checkedCities"
                @change="handleCheckedCitiesChange"
              >
                <el-checkbox
                  v-for="city in cities"
                  :label="city"
                  :key="city.id"
                  >{{ city.activityName }}</el-checkbox
                >
              </el-checkbox-group>
            </div>
            <div v-else>暂无活动内容</div>
          </el-collapse-transition>
        </el-form-item>
        <el-form-item label="添加人员:">
          <el-input
            class="inline-input"
            v-model="cSubcategoryNo"
            placeholder="请输入上传人员姓名或关键字"
            @input="chaz"
            size="medium"
            clearable
          ></el-input>
        </el-form-item>
        <el-collapse-transition>
          <el-form-item v-if="restaurants.length > 0" label="" class="tagBox">
            <el-scrollbar style="height: 100%">
              <el-tag
                v-for="tag in restaurants"
                :disable-transitions="false"
                :key="tag.userid"
                type=""
                style="margin-left: 8px; margin-bottom: 5px"
                @close="handleClose(tag)"
                @click="tianjia(tag)"
                >{{ tag.name }}</el-tag
              >
            </el-scrollbar>
          </el-form-item>
        </el-collapse-transition>
        <el-divider></el-divider>
        <div class="send" style="display: flex; margin-bottom: 20px">
          <div class="namelist">
            <el-scrollbar style="height: 100%">
              <ul style="list-style: none">
                <li
                  v-for="(i, index) in peoplelist"
                  :key="index"
                  :index="index"
                  style="margin-bottom: 5px"
                  @dblclick="deleteitem(index)"
                >
                  <el-tag>{{ i.name }}</el-tag>
                </li>
              </ul>
            </el-scrollbar>
          </div>
          <div class="上传" style="flex: 1">
            <Upload
              class="tes"
              txt="请上传xlsx文件，通过搜索添加上传人员，双击上传人员可删除"
              :progressPercent="form.progressPercent"
              @getFile="getFileEvent"
            ></Upload>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <a
          class="btnnormal btnnormal_down"
          href="http://tool.afocus.com.cn/file_download/预算监控模板.xlsx"
          download="预算监控模板.xlsx"
          ><div class="btnSize">下载模板</div></a
        >
        <el-button
          class="btnnormal marginL"
          type="primary"
          :disabled="
            this.fileList.length == 0 ||
            this.content == '' ||
            this.peoplelist.length == 0
              ? true
              : false
          "
          @click="uploadFile"
          >立即上传</el-button
        >
      </span>
    </el-dialog>
    <!-- 查看详情 -->
    <el-dialog
      title="查看详情"
      :visible.sync="lookxq"
      width="750px"
      max-height="600px"
      @close="clear"
      custom-class="dialogEdit"
      :close-on-click-modal="false"
    >
      <el-table
        class="detail_body"
        ref="singleTable"
        :data="xqlist"
        height="540"
        :highlight-current-row="true"
        :cell-style="timeStyle"
      >
        <el-table-column
          type="index"
          width="100"
          size="small"
          label="序号"
          align="center"
        ></el-table-column>
        <el-table-column property="bidding_id" label="当日预算" align="center">
          <template slot-scope="scope">
            <div class="input-box">
              <el-input
                style="text-align: center"
                size="small"
                @input="changethreshold(scope.row)"
                v-model="scope.row.threshold"
              ></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          property="bidding_date"
          size="small"
          label="日期"
          align="center"
        >
        </el-table-column>
      </el-table>
      <div class="detail_btn">
        <el-button
          size="small"
          type="primary"
          class="btnnormal marginL"
          :disabled="this.changelist == '' ? true : false"
          @click="sendlist"
          >确定修改</el-button
        >
        <el-button
          class="btnnormal btnnormal_down"
          @click="guanbi"
          size="small"
          type="danger"
          >取消</el-button
        >
      </div>
    </el-dialog>
    <!-- 修改人员 -->
    <el-dialog
      title="修改人员"
      :visible.sync="centerDialogVisible"
      width="30%"
      center
      custom-class="dialogJb editDia"
      :close-on-click-modal="false"
    >
      <el-form class="formObj" label-width="80px">
        <div class="formObj_ipt">
          <el-form-item label="添加人员:" prop="input">
            <el-input
              class="inline-input"
              v-model="cSubcategoryNo"
              placeholder="请输入上传人员姓名或关键字"
              @input="chaz"
              clearable
            ></el-input>
          </el-form-item>
          <el-collapse-transition>
            <el-form-item v-if="restaurants.length > 0" label="" class="tagBox">
              <el-scrollbar style="height: 100%">
                <el-tag
                  v-for="tag in restaurants"
                  :key="tag.userid"
                  type=""
                  @close="NameListhandleClose(tag)"
                  @click="Nametianjia(tag)"
                  style="margin-left: 10px; margin-top: 5px"
                >
                  {{ tag.name }}
                </el-tag>
              </el-scrollbar>
            </el-form-item>
          </el-collapse-transition>
          <div>
            <el-form-item label="人员列表:" prop="input">
              <div class="namelist">
                <el-scrollbar style="height: 100%">
                  <ul style="list-style: none">
                    <li
                      v-for="(i, index) in personnelList"
                      :key="index"
                      :index="index"
                      @dblclick="NameListdeleteitem(index)"
                    >
                      <el-tag v-if="i.user_name" style="margin-left: 10px">{{
                        i.user_name
                      }}</el-tag
                      ><el-tag v-if="i.name" style="margin-left: 10px">{{
                        i.name
                      }}</el-tag>
                    </li>
                  </ul>
                </el-scrollbar>
              </div>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          class="btnnormal marginL"
          type="primary"
          @click="isModification()"
          >确 定</el-button
        >
        <el-button
          class="btnnormal btnnormal_down"
          @click="centerDialogVisible = false"
          >取 消</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
let cityOptions = [];
import {
  BiddingSearch,
  BidIdQueryActivity,
  getName,
  BidList,
  viewDetails,
  detailsToModify,
  immediatelyUpload,
  biddingDelete,
  personnelDetails,
  updateUser,
} from "@/api/api.js";
import Upload from "@/components/upload";

export default {
  name: "BiddingForMonitoring",
  components: {
    Upload,
  },
  data() {
    return {
      loading: false,
      form: {},
      personnelList: [],
      centerDialogVisible: false,
      checkAll: false,
      checkedCities: [],
      isIndeterminate: false,
      cities: cityOptions,
      flag: false,
      isOptValue: [],
      //上传按钮弹出
      dialogVisible: false,
      //查看详情弹出
      lookxq: false,
      //数据总数
      total: "",
      //表格渲染数据
      tableData: [],
      //竞标搜索开关
      openkey: false,
      //输入关键词的双向绑定
      search_item: "",
      timeout: null,
      //上传Excel
      input: "",
      //搜索的内容
      content: "",
      //名字搜索的内容
      peoplename: "",
      //实时搜索
      result: "",
      //请求头
      userid: "",
      username: "",
      code: "",
      //默认开始页面
      currpage: 1,
      // 竞标id
      jbid: "",
      jbname: "",
      //每页的数据条数
      pagesize: 10,
      //下拉框
      options: [],
      fileList: [], // excel文件列表
      progressPercent: 0,
      // 上传人员数据
      restaurants: [],
      cSubcategoryNo: "",
      selected: [], // 获得value值
      selectedValue: [], //获得code值
      peoplelist: [], //人员列表
      quchonglist: [], //去重后的
      itemid: [], //上传人员id
      itemname: [], //上传人员姓名
      tablerow: "", //容器
      log: "", //详情内容
      xqlist: [], //查看详情列表
      changelist: [], //修改过后的列表
    };
  },
  created() {
    // check方法调用接口,判断用户是否登录!
    this.check();
  },
  mounted() {
    //设置请求头
    this.userid = localStorage.getItem("wx_userid");
    this.code = localStorage.getItem("wx_code");
    this.username = localStorage.getItem("user_name");
    this.peoplelist = [
      {
        name: this.username,
        userid: this.userid,
      },
    ];
    //调用查看列表
    this.getlist();
  },
  methods: {
    timeStyle() {
      return "height:50px;padding:0;";
    },
    upList() {
      this.dialogVisible = true;
    },
    getFileEvent(val) {
      this.fileList = val;
    },
    isModification() {
      let itemListid = "";
      let itemListname = "";
      for (let k = 0; k < this.personnelList.length; k++) {
        if (this.personnelList[k].userid) {
          itemListid += this.personnelList[k].userid + ",";
          itemListname += this.personnelList[k].name + ",";
        } else if (this.personnelList[k].user_id) {
          itemListid += this.personnelList[k].user_id + ",";
          itemListname += this.personnelList[k].user_name + ",";
        }
      }
      itemListid = itemListid.slice(0, itemListid.length - 1);
      itemListname = itemListname.slice(0, itemListname.length - 1);

      updateUser({
        bidding_id: this.tablerow.bidding_id,
        activity_id: this.tablerow.activity_id,
        user_list: itemListid,
        user_name_list: itemListname,
      })
        .then((res) => {
          if (res.data.code === 10000) {
            this.cSubcategoryNo = "";
            this.restaurants = [];
            this.centerDialogVisible = false;
            this.$message({
              type: "success",
              message: "修改成功!",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //竞标监控列表修改
    modification() {
      personnelDetails({
        bidding_id: this.tablerow.bidding_id,
      })
        .then((res) => {
          console.log(res);
          this.personnelList = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 竞标列表删除
    biddingDelete() {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log(this.tablerow);
          biddingDelete({
            bidding_id: this.tablerow.bidding_id,
            activity_id: this.tablerow.activity_id,
          })
            .then((res) => {
              console.log(res);
              if (res.data.code === 10000) {
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
              }
              this.getlist();
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //多选框事件
    handleCheckAllChange(val) {
      console.log(this.checkedCities);
      this.checkedCities = val ? cityOptions : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length;
    },
    // 查询竞标
    search(val) {
      const vm = this;
      vm.loading = true;
      BiddingSearch({
        search: val,
      }).then((res) => {
        vm.loading = false;
        if (res.data.code == "10000" && res.data.data.length) {
          vm.options = res.data.data;
        } else {
          vm.options = [];
        }
      });
      // }
    },

    // 选中竞标查询活动
    jbChangeEvent(val) {
      const vm = this;
      for (let item of vm.options) {
        if (item.pro_num === val) {
          vm.jbname = item.pro_name;
          break;
        }
      }
      if (val) {
        BidIdQueryActivity({
          bidding_id: val,
        }).then((res) => {
          cityOptions = res.data.data;
          vm.cities = res.data.data;
        });
      } else {
        vm.options = [];
        vm.cities = [];
      }
    },
    //分页器功能
    handleSizeChange(val) {
      this.pagesize = val;
      this.getlist();
    },
    handleCurrentChange(page) {
      this.currpage = page;
      this.getlist();
    },
    tianjia(tag) {
      this.peoplelist.push(tag);
      this.itemid.push(tag.id);
      // 添加后删除以免二次选中
      this.handleClose(tag);
    },
    Nametianjia(tag) {
      this.personnelList.push(tag);
      this.NameListhandleClose(tag);
    },

    // 文件上传成功时的钩子
    handleSuccess(res, file, fileList) {
      this.$message.success("文件上传成功");
      this.fileList = [];
      this.peoplelist = [];
      this.itemid = [];
      this.dialogVisible = false;
    },
    //立即上传
    uploadFile(data) {
      let arrName = "";
      let arrId = "";
      //上传时需要的人员id
      this.itemid = "";
      this.itemname = "";
      for (let k = 0; k < this.peoplelist.length; k++) {
        this.itemid += this.peoplelist[k].userid + ",";
        this.itemname += this.peoplelist[k].name + ",";
      }
      this.itemid = this.itemid.slice(0, this.itemid.length - 1);
      this.itemname = this.itemname.slice(0, this.itemname.length - 1);
      if (this.content == "") {
        this.$message.warning("请输入标名或者项目编号");
      } else if (this.fileList.length === 0) {
        this.$message.warning("请选择要上传的excel文件");
      } else {
        console.log(this.content);
        let data = {
          file: this.fileList,
          user_list: this.itemid,
          user_name_list: this.itemname,
          trans_name: this.username,
          bidding_id: this.content,
          bidding_name: this.jbname,
        };
        if (this.checkAll === true) {
          this.checkedCities = [];
        }
        if (this.checkedCities.length === 0) {
          this.$set(data, "activity_name", "");
          this.$set(data, "activity_id", "");
        } else {
          for (let k = 0; k < this.checkedCities.length; k++) {
            arrName += this.checkedCities[k].activityName + ",";
            arrId += this.checkedCities[k].id + ",";
          }
          arrName = arrName.slice(0, arrName.length - 1);
          arrId = arrId.slice(0, arrId.length - 1);
          this.$set(data, "activity_name", arrName);
          this.$set(data, "activity_id", arrId);
        }
        immediatelyUpload(data)
          .then((res) => {
            console.log(res);
            if (res.data.code == 10000) {
              this.progressPercent = 100;
              this.handleSuccess();
              this.getlist();
              this.msg = res.data.data.msg;
            } else {
              // this.handleError();
              this.$message.warning(res.data);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },

    //多选栏中的删除
    handleClose(tag) {
      let item = this.restaurants.indexOf(tag);
      this.restaurants.splice(item, 1);
    },
    NameListhandleClose(tag) {
      let item = this.restaurants.indexOf(tag);
      this.restaurants.splice(item, 1);
    },
    // 查找名字
    chaz() {
      if (this.cSubcategoryNo == "") {
        this.restaurants = [];
      } else {
        getName({
          search: this.cSubcategoryNo,
        })
          .then((res) => {
            console.log(res);
            this.restaurants = res.data.data;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    // 双击删除列表
    deleteitem(index) {
      this.peoplelist.splice(index, 1);
    },
    NameListdeleteitem(index) {
      this.personnelList.splice(index, 1);
    },
    // 查看列表
    getlist() {
      BidList({
        trans_name: this.username,
        limit: this.pagesize,
        page: this.currpage,
      })
        .then((res) => {
          if (res.data.code == 10000) {
            this.tableData = res.data.data;
            this.total = res.data.count;
          } else if (res.data.code == 10001) {
            this.$message.warning("参数丢失");
          } else if (res.data.code == 10002) {
            console.log("db error");
          } else {
            console.log("未知情况");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 查看详情
    celltable(row) {
      this.tablerow = row;
      console.log(row);
      viewDetails({
        bidding_id: this.tablerow.bidding_id,
        activity_id: this.tablerow.activity_id,
      })
        .then((res) => {
          if (res.data.code == 10000) {
            this.xqlist = res.data.data;
          } else if (res.data.code == 10000) {
            console.log("参数丢失");
          } else if (res.data.code == 10002) {
            console.log("db erroe");
          } else {
            console.log("未知情况");
          }
        })
        .catch((err) => {
          console.log(err);
        });
      if (this.centerDialogVisible === true) {
        this.modification();
      }
    },
    changethreshold(scopeRow) {
      this.changelist.push({
        id: scopeRow.id,
        threshold: scopeRow.threshold,
      });
    },
    //关闭弹出框清空追加
    clear() {
      this.changelist = [];
    },
    guanbi() {
      this.lookxq = false;
    },
    //上传修改后的预算数据
    sendlist() {
      detailsToModify({
        id_thresholds: this.changelist,
      })
        .then((res) => {
          console.log(res);
          if (res.data.code == 10000) {
            this.$message.success("更新成功");
            this.lookxq = false;
            this.changelist = [];
            this.getlist();
          } else if (res.data.code == 10001) {
            this.$message.warning("参数丢失");
          } else {
            console.log("未知错误");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //清空搜索词
    clearlist() {
      this.content = "";
      this.cSubcategoryNo = "";
      this.restaurants = [];
      this.progressPercent = 0;
      this.cities = [];
      this.isIndeterminate = false;
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../index";
@import "./bidding.less";
</style>
