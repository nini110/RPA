<template>
  <div class="itemsComp">
    <div class="centers">
      <el-button
        type="primary"
        class="btnnormal"
        @click="newStrategyFn()"
        size="medium"
        >新建项目</el-button
      >
      <div class="tables">
        <el-table
          :data="tableDataList"
          style="width: 100%"
          height="800px"
           tooltip-effect="dark"
          @cell-click="cellClick"
        >
          <el-table-column align="center" label="序号" width="120" type="index">
          </el-table-column>
          <el-table-column prop="project_name" label="项目名称" width="180">
          </el-table-column>
          <el-table-column prop="shop_name" label="抖店/代理商" width="180">
          </el-table-column>
          <el-table-column prop="quanchuan_name" label="千川账号" width="180">
          </el-table-column>
          <el-table-column prop="douyin_name" label="抖音账号" width="180">
          </el-table-column>
          <el-table-column prop="address3" label="投放时间" width="180">
            <template slot-scope="scope">
              <div>{{ scope.row.cast_start_time }}</div>
              <div>{{ scope.row.cast_end_time }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="interval" label="数据获取间隔" width="120">
            <template slot-scope="scope">
              <div>{{ scope.row.interval / 60 }}分钟</div>
            </template>
          </el-table-column>
          <el-table-column prop="address6" label="绑定策略数" width="100">
            <template slot-scope="scope">
              <div>1</div>
            </template>
          </el-table-column>
          <el-table-column prop="address7" label="创建时间" width="120">
            <template slot-scope="scope">
              <div>2021-08-27</div>
            </template>
          </el-table-column>
          <el-table-column prop="founder" label="创建者" width="80">
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template slot="header">
              操作
              <el-tooltip effect="dark" content="" placement="top">
                <div slot="content">
                  项目开始前10分钟无法再编辑和删除项目<br />开始前5分钟可以进入实时看板
                </div>
                <i class="el-icon-question"></i>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <el-button type="text" @click="editFn(scope.row.id)"
                >编辑</el-button
              >
              <el-button type="text" @click="deleteFn">删除</el-button>
              <el-button
                type="text"
                @click="routerLink(scope.row.id, scope.row.project_name)"
                >实时看板</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
      <div class="dialog">
        <el-dialog
          title="新建/编辑"
          :visible.sync="dialogVisible"
          width="600px"
          custom-class="dialogEdit"
        >
          <el-form ref="form" :model="form" label-width="140px">
            <el-form-item label="项目名称:" prop="name">
              <el-input
                v-model="form.name"
                placeholder="请输入项目名称"
                size="medium"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="账号类型:" prop="radio">
              <el-radio-group v-model="form.radio" @change="handleclick">
                <el-radio label="1">店铺</el-radio>
                <el-radio label="2">代理商</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="授权账号:">
              <el-select
                v-model="form.authorization"
                placeholder="请选择授权账号"
                size="medium"
                clearable
                @change="handleAuthorization"
              >
                <el-option
                  v-show="form.radio === '1'"
                  v-for="(item, index) in authorizationOption"
                  :key="index"
                  :label="item.advertiser_name"
                  :value="[item.advertiser_id, item.advertiser_name]"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="千川账号:">
              <el-select
                v-model="form.ThousandsOfSichuan"
                placeholder="请选择千川账号"
                size="medium"
                clearable
                @change="handleThousandsOfSichuan"
              >
                <el-option
                  v-for="(item, index) in ThousandsOfSichuanOptions"
                  :key="index"
                  :label="item.name"
                  :value="[item.id, item.name]"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="抖音账号:">
              <el-select
                v-model="form.trill"
                placeholder="请选择抖音账号"
                size="medium"
                clearable
                @change="handleTrill"
              >
                <el-option
                  v-for="(item, index) in trillOptions.aweme_id_list"
                  :key="index"
                  :label="item.aweme_name"
                  :value="[item.aweme_id, item.aweme_name]"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="投放时间:" size="medium">
              <el-date-picker
                v-model="form.timeData"
                type="datetimerange"
                range-separator="---"
                @change="times"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                clearable
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="数据获取间隔:">5分钟</el-form-item>
            <el-form-item label="绑定策略:">
              <el-tabs type="border-card">
                <el-tab-pane label="出价调整">
                  <div class="cjtabbles">
                    <el-select
                      v-model="form.cjstrategy"
                      placeholder="请选择千川账号"
                      size="medium"
                    >
                      <el-option
                        v-for="(item, index) in cjtableData"
                        :key="index"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="预算调整">
                  <div class="ystabbles">
                    <el-select
                      v-model="form.ysstrategy"
                      placeholder="请选择千川账号"
                      size="medium"
                    >
                      <el-option
                        v-for="(item, index) in ystableData"
                        :key="index"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="计划复制">
                  <div class="jhtabbles">
                    <el-select
                      v-model="form.jhstrategy"
                      placeholder="请选择千川账号"
                      size="medium"
                    >
                      <el-option
                        v-for="(item, index) in jhtableData"
                        :key="index"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button class="btnnormal btnnormal_down" @click="dialogVisible = false" size="medium"
              >取 消</el-button
            >
            <el-button class="btnnormal" type="primary" @click="isOk()" size="medium"
              >确 定</el-button
            >
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getSQselect,
  getThousandsOfSichuan,
  getTrill,
  projectFound,
  projectList,
  strategyList,
  budgetStrategyList,
  planStrategyList,
  projectEdit,
  Strategies,
  StrategiesUpdate,
} from "@/api/api.js";
export default {
  name: "itemsComp",
  data() {
    return {
      currentPage: 1,
      pagesize: 10,
      dialogVisible: false,
      form: {
        name: "",
        authorization: "",
        ThousandsOfSichuan: "",
        trill: "",
        radio: "1",
        timeData: [
          new Date(2000, 10, 10, 10, 10),
          new Date(2000, 10, 11, 10, 10),
        ],
        interval: "",
        cjstrategy: "",
        ysstrategy: "",
        jhstrategy: "",
        username: "",
        strategy_id: "",
      },
      trillOptions: [],
      ThousandsOfSichuanOptions: [],
      authorizationOption: [],
      cjtableData: [],
      ystableData: [],
      jhtableData: [],
      tableDataList: [],
      flag: true,
      editId: "",
      total: 0,
      authorizationFlag: true,
      thousandsOfSichuanFlag: true,
      trillFlag: true,
      submitData: [],
    };
  },
  methods: {
    cellClick(row) {
      this.editId = row.id;
    },
    times(cal) {},
    // 编辑更新项目
    StrategiesUpdate() {
      if (
        this.form.cjstrategy ||
        this.form.jhstrategy ||
        this.form.ysstrategy
      ) {
        let data = {
          project_name: this.form.name,
          project_id: this.submitData.id,
          shop_id: this.form.authorization[0],
          shop_name: this.form.authorization[1],
          quanchuan_id: this.form.ThousandsOfSichuan[0],
          quanchuan_name: this.form.ThousandsOfSichuan[1],
          douyin_id: this.form.trill[0],
          douyin_name: this.form.trill[1],
          founder: this.form.username,
          cast_start_time: this.form.timeData[0],
          cast_end_time: this.form.timeData[1],
          interval: "300",
          num: this.form.radio,
          bid_id: this.form.cjstrategy,
          budget_id: this.form.ysstrategy,
          plan_id: this.form.jhstrategy,
          zh_type: "代理商",
          strategy_id: this.form.strategy_id,
        };
        if (this.authorizationFlag) {
          data.shop_id = this.submitData.shop_id;
          data.shop_name = this.submitData.shop_name;
        }
        if (this.thousandsOfSichuanFlag) {
          data.quanchuan_id = this.submitData.quanchuan_id;
          data.quanchuan_name = this.submitData.quanchuan_name;
        }
        if (this.trillFlag) {
          data.douyin_id = this.submitData.douyin_id;
          data.douyin_name = this.submitData.douyin_name;
        }
        StrategiesUpdate(data)
          .then((res) => {
            if (res.data.code === 200) {
              this.dialogVisible = false;
              this.projectList();
            } else if (res.data.code === 1) {
              this.$message.error(res.data.msg);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.$message({
          type: "error",
          message: "请选择策略!",
        });
      }
    },
    // 获取项目详情
    projectEdit(ids) {
      let id = ids;
      projectEdit(id)
        .then((res) => {
          this.submitData = res;
          this.form.name = res.project_name;
          this.form.radio = res.num;
          this.form.authorization = res.shop_name;
          this.form.ThousandsOfSichuan = res.quanchuan_name;
          this.form.trill = res.douyin_name;
          this.form.timeData[0] = res.cast_start_time;
          this.form.timeData[1] = res.cast_end_time;
          this.form.strategy_id = res.strategy_id;
          function group(ss, step) {
            var r = [];
            function doGroup(s) {
              if (!s) return;
              r.push(s.substr(0, step));
              s = s.substr(step);
              doGroup(s);
            }
            doGroup(ss);
            return r;
          }
          let start1 = res.cast_start_time;
          let end1 = res.cast_end_time;
          start1 = start1.split("-");
          let start2 = start1[2].split(":");
          let start3 =
            start1[0] + start1[1] + start2[0] + start2[1] + start2[2];
          let start4 = start3.replace(/\s*/g, "");
          let start5 = group(start4, 2);
          end1 = end1.split("-");
          let end2 = end1[2].split(":");
          let end3 = end1[0] + end1[1] + end2[0] + end2[1] + end2[2];
          let end4 = end3.replace(/\s*/g, "");
          let end5 = group(end4, 2);
          console.log(end5);
          this.form.timeData = [
            new Date(
              parseInt(start5[0] + start5[1]),
              start5[2] - 1,
              start5[3],
              start5[4],
              start5[5],
              start5[6]
            ),
            new Date(
              parseInt(end5[0] + end5[1]),
              end5[2] - 1,
              end5[3],
              end5[4],
              end5[5],
              end5[6]
            ),
          ];
          // timeData: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
          console.log(this.form.timeData);
          this.Strategies(res.id);
          let params1 = {
            shop_id: res.shop_id,
            num: this.form.radio,
          };
          let params2 = {
            advertiser_id: res.quanchuan_id,
            num: this.form.radio,
          };
          this.getSQselect();
          this.getThousandsOfSichuan(params1);
          this.getTrill(params2);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 新建项目按钮
    newStrategyFn() {
      this.flag = true;
      this.dialogVisible = true;
      this.form.name = "";
      this.form.authorization = "";
      this.form.ThousandsOfSichuan = "";
      this.form.trill = "";
      this.form.cjstrategy = "";
      this.form.ysstrategy = "";
      this.form.jhstrategy = "";
      this.strategyList();
      this.budgetStrategyList();
      this.planStrategyList();
    },
    // 弹窗确定按钮
    isOk() {
      if (this.flag) {
        this.projectFound();
      } else {
        this.StrategiesUpdate();
      }
    },
    // 获取项目中策略详情
    Strategies(id) {
      Strategies({
        strategy_id: id,
      })
        .then((res) => {
          console.log(res);
          this.form.cjstrategy = res.data.data.bid_strategy_data.id;
          this.form.ysstrategy = res.data.data.budget_strategy_data.id;
          this.form.jhstrategy = res.data.data.plan_strategy_data.id;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 编辑按钮
    editFn(id) {
      this.flag = false;
      this.dialogVisible = true;
      this.editId = id;
      this.projectEdit(id);
      this.strategyList();
      this.budgetStrategyList();
      this.planStrategyList();
    },
    // 获取项目列表
    projectList() {
      projectList({
        page: this.currentPage,
        page_size: this.pagesize,
      })
        .then((res) => {
          this.tableDataList = res.data.results;
          this.total = res.data.count;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 出价策略列表
    strategyList() {
      strategyList({
        page: 0,
      })
        .then((res) => {
          this.cjtableData = res.data.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 预算策略列表
    budgetStrategyList() {
      let params = {
        page: 0,
      };
      budgetStrategyList(params)
        .then((res) => {
          this.ystableData = res.data.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 计划策略列表
    planStrategyList() {
      let params = {
        page: 0,
      };
      planStrategyList(params)
        .then((res) => {
          this.jhtableData = res.data.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleAuthorization() {
      if (!this.flag) {
        this.authorizationFlag = false;
      }
      this.form.ThousandsOfSichuan = "";
      this.form.trill = "";
      let params = {
        shop_id: this.form.authorization[0],
        num: this.form.radio,
      };
      this.getThousandsOfSichuan(params);
    },
    handleThousandsOfSichuan() {
      if (!this.flag) {
        this.thousandsOfSichuanFlag = false;
      }
      this.form.trill = "";
      let params = {
        advertiser_id: this.form.ThousandsOfSichuan[0],
        num: this.form.radio,
      };
      this.getTrill(params);
    },
    handleTrill() {
      if (!this.flag) {
        this.trillFlag = false;
      }
    },
    handleclick() {
      this.form.authorization = "";
      this.form.ThousandsOfSichuan = "";
      this.form.trill = "";
    },
    // 项目创建
    projectFound() {
      let data = {};
      if (
        this.form.cjstrategy ||
        this.form.jhstrategy ||
        this.form.ysstrategy
      ) {
        if (this.form.radio === "1") {
          data = {
            project_name: this.form.name,
            shop_id: this.form.authorization[0],
            shop_name: this.form.authorization[1],
            quanchuan_id: this.form.ThousandsOfSichuan[0],
            quanchuan_name: this.form.ThousandsOfSichuan[1],
            douyin_id: this.form.trill[0],
            douyin_name: this.form.trill[1],
            founder: this.form.username,
            cast_start_time: this.form.timeData[0],
            cast_end_time: this.form.timeData[1],
            interval: "300",
            num: this.form.radio,
            bid_id: this.form.cjstrategy,
            budget_id: this.form.ysstrategy,
            plan_id: this.form.jhstrategy,
            zh_type: "店铺",
          };
        } else {
          data = {
            project_name: this.form.name,
            shop_id: this.form.authorization[0],
            shop_name: this.form.authorization[1],
            quanchuan_id: this.form.ThousandsOfSichuan[0],
            quanchuan_name: this.form.ThousandsOfSichuan[1],
            douyin_id: this.form.trill[0],
            douyin_name: this.form.trill[1],
            founder: this.form.username,
            cast_start_time: this.form.timeData[0],
            cast_end_time: this.form.timeData[1],
            interval: "300",
            num: this.form.radio,
            bid_id: this.form.cjstrategy,
            budget_id: this.form.ysstrategy,
            plan_id: this.form.jhstrategy,
            zh_type: "代理商",
          };
        }
        projectFound(data)
          .then((res) => {
            if (res.data.code === 200) {
              this.dialogVisible = false;
              this.projectList();
            } else if (res.data.code === 1) {
              this.$message.error(res.data.msg);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.$message({
          type: "error",
          message: "请选择策略!",
        });
      }
    },
    // 抖音账号下拉
    getTrill(params) {
      getTrill(params)
        .then((res) => {
          this.trillOptions = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //授权账号下拉
    getSQselect() {
      let params = {
        "": "",
      };
      let arr = [];
      let topadata = [];
      // getSQselect(params)
      getSQselect()
        .then((res) => {
          console.log(res.data.data[1].length);
          for (var key in res.data.data) {
            arr.push(res.data.data[key]);
          }
          console.log(arr);
          for (let i = 0; i < arr.length; i++) {
            console.log(i);
            for (let k = 0; k < arr[i].length; k++) {
              this.authorizationOption.push(arr[i][k]);
            }
          }
          console.log(topadata);
        })
        .catch((err) => {
          console.log(err);
        });
      console.log(arr);
    },
    // 千川账号获取
    getThousandsOfSichuan(params) {
      getThousandsOfSichuan(params)
        .then((res) => {
          this.ThousandsOfSichuanOptions = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 删除按钮
    deleteFn() {
      this.$confirm("确定删除该策略？", "删除提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.projectList();
    },
    handleCurrentChange(val) {
      this.pagesize = val;
      this.projectList();
    },
    routerLink(ids, names) {
      const { href } = this.$router.resolve({
        name: "RealTime",
        query: {
          id: ids,
          name: names,
        },
      });
      window.open(href, "_blank");
    },
  },
  created() {
    this.form.username = localStorage.getItem("user_name");
    this.getSQselect();
    this.projectList();
  },
};
</script>

<style lang="less" scoped>
@import "@/views/index.less";
@import "./index";
@import "../items/index.less";

</style>
