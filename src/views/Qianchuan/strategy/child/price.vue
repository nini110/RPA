<template>
  <!-- 出价 -->
  <div class="PriceAdjustment strategyNormal">
    <div class="centers">
      <div class="PriceTops">
        <div class="btn">
          <el-button
            type="primary"
            class="btnnormal"
            @click="newStrategyFn()"
            size="medium"
            >新建策略</el-button
          >
        </div>
        <div class="search">
          <div class="search_label">状态：</div>
          <div class="selects">
            <el-select
              v-model="value"
              placeholder="请选择"
              size="medium"
              clearable
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div class="search_label">策略名称：</div>
          <el-input
            v-model="input"
            placeholder="请输入策略名称"
            size="medium"
            class="inp"
            clearable
          ></el-input>
          <div>
            <el-button
              style="margin-left: 10px"
              class="btnnormal"
              type="primary"
              size="medium"
              >查询</el-button
            >
          </div>
        </div>
      </div>
      <div class="tabbles pricetable" ref="tabbles">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          :height="tableHeight"
          @cell-click="cellClick"
          @selection-change="handleSelectionChange"
        >
          <el-table-column align="center" type="selection" width="80">
          </el-table-column>
          <el-table-column align="center" label="序号" width="100" type="index">
          </el-table-column>
          <el-table-column prop="count" label="状态" width="120" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.status" class="yes">使用中</div>
              <div v-else class="no">未使用</div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="策略名称" min-width="200">
          </el-table-column>
          <el-table-column
            prop="total_satisfy_count"
            min-width="100"
            label="累计撞线数"
          >
          </el-table-column>
          <el-table-column
            prop="total_project_count"
            min-width="100"
            label="累计项目数"
          >
          </el-table-column>
          <el-table-column
            prop="total_plan_count"
            min-width="100"
            label="累计计划数"
          >
          </el-table-column>
          <el-table-column prop="username" min-width="100" label="创建人">
          </el-table-column>
          <el-table-column prop="address" width="150" label="操作" fixed="right">
            <template slot="header">
              操作
              <el-tooltip
                class="item"
                effect="dark"
                content="当状态为使用中时,不可编辑和删除"
                placement="top"
              >
                <i class="el-icon-question"></i>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <el-button class="el-icon-edit" type="text" v-if="scope.row.status" disabled
                >编辑</el-button
              >
              <el-button class="el-icon-edit" type="text" @click="editFn(scope.row.id)" v-else
                >编辑</el-button
              >
              <el-button class="el-icon-delete" type="text" v-if="scope.row.status" disabled
                >删除</el-button
              >
              <el-button class="el-icon-delete" type="text" v-else @click="deleteFn()">删除</el-button>
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
      <!-- 出价调整策略弹窗 -->
      <div class="dialog">
        <el-dialog
          title="出价调整策略"
          :visible.sync="dialogVisible"
          custom-class="dialogEdit dialogStrategy"
          :close-on-click-modal="false"
        >
          <el-form ref="form" :model="form" :rules="rules">
            <el-form-item label="策略名称:" prop="name">
              <el-input
                v-model="form.name"
                size="medium"
                placeholder="请输入策略名称"
                clearable
              ></el-input>
            </el-form-item>
            <el-divider content-position="left">条件</el-divider>
            <el-form-item label="数据:" prop="data">
                <el-select
                  v-model="form.data"
                  placeholder="请选择"
                  size="medium"
                  clearable
                >
                  <el-option
                    v-for="item in dataOptions1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="次数:" prop="num" class="oneIpt">
              <el-input-number
                v-model="form.num"
                @change="handleChange"
                :min="1"
                label="描述文字"
                size="medium"
                clearable
              >
              </el-input-number>次
            </el-form-item>
            <el-form-item label="条件:" prop="condition" class="twoIpt">
              <el-select
                v-model="form.condition"
                placeholder="请选择"
                size="medium"
                clearable
              >
                <el-option
                  v-for="item in condition"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <el-input-number
                v-model="form.conditionNum"
                @change="handleChange"
                :min="1"
                :max="50"
                size="medium"
                label="描述文字"
                clearable
              ></el-input-number
              >%
            </el-form-item>
            <el-divider content-position="left">操作</el-divider>
            <el-form-item label="出价:" prop="bid" class="twoIpt">
              <el-select
                v-model="form.bid"
                placeholder="请选择"
                size="medium"
                clearable
              >
                <el-option
                  v-for="item in bid"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <el-input-number
                v-model="form.bidNum"
                @change="handleChange"
                :min="1"
                :max="50"
                size="medium"
                label="描述文字"
                clearable
              ></el-input-number
              >%
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button
              class="btnnormal btnnormal_down"
              @click="dialogVisible = false"
              size="medium"
              >取 消</el-button
            >
            <el-button
              class="btnnormal marginL"
              type="primary"
              @click="addBidStrategyFm()"
              size="medium"
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
  strategyList,
  compile,
  addBidStrategy,
  updataBidStrategy,
} from "@/api/api.js";
export default {
  data() {
    return {
      currentPage: 1,
      value: "",
      total: 0,
      pagesize: 10,
      flag: true, // true 为新创建 ， false 为编辑更新
      row: "", //列表信息
      form: {
        name: "",
        username: "",
        data: "",
        num: 1,
        condition: "",
        conditionNum: 1,
        bid: "",
        bidNum: 1,
      },
      rules: {
        name: [{ required: true, message: "请输入策略名称", trigger: "blur" }],
        data: [{ required: true, message: "请选择数据", trigger: "blur" }],
        num: [{ required: true, message: "请选择次数", trigger: "blur" }],
        condition: [{ required: true, message: "请选择条件", trigger: "blur" }],
        bid: [{ required: true, message: "请选择出价条件", trigger: "blur" }],
      },
      options: [
        {
          value: "选项1",
          label: "所有",
        },
        {
          value: "选项2",
          label: "执行中",
        },
        {
          value: "选项3",
          label: "闲置",
        },
      ],
      dialogVisible: false,
      condition: [
        {
          value: 1,
          label: "上涨",
        },
        {
          value: 2,
          label: "下降",
        },
      ],
      bid: [
        {
          value: 1,
          label: "上调",
        },
        {
          value: 2,
          label: "下调",
        },
      ],
      latitude: [
        {
          value: 1,
          label: "增幅",
        },
        {
          value: 2,
          label: "增量",
        },
      ],
      dataOptions1: [
        {
          value: 1,
          label: "消耗差值比",
        },
        {
          value: 2,
          label: "展示量差值比",
        },
        {
          value: 3,
          label: "点击量差值比",
        },
        {
          value: 4,
          label: "转化差值比",
        },
        {
          value: 5,
          label: "成交订单量差值比",
        },
        {
          value: 6,
          label: "成交金额差值比",
        },
        {
          value: 7,
          label: "下单订单差值比",
        },
        {
          value: 8,
          label: "下单金额差值比",
        },
      ],
      dataOptions2: [
        {
          value: 1,
          label: "OR",
        },
        {
          value: 2,
          label: "AND",
        },
      ],
      tableData: [],
      multipleSelection: [],
      btnvalue: false,
      input: "",
      editId: 0,
      tableHeight: 0
    };
  },
    mounted() {
    this.tableHeight = window.getComputedStyle(this.$refs.tabbles).height
  },
  methods: {
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
    // 创建策略 | 更新策略
    addBidStrategyFm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.flag) {
            let data = {
              name: this.form.name,
              username: this.form.username,
              data: this.form.data,
              count: this.form.num,
              condition: this.form.condition,
              proportion: this.form.conditionNum / 100,
              bid_operate: this.form.bid,
              bid_proportion: this.form.bidNum / 100,
            };
            addBidStrategy(data)
              .then((res) => {
                if (res.data.code === 200) {
                  this.dialogVisible = false;
                  this.$message({
                    message: "出价策略创建成功！",
                    type: "success",
                  });
                  this.strategyList();
                } else if (res.data.code === 1) {
                  this.$message.error(res.data.msg);
                }
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            let data = {
              name: this.form.name,
              username: this.form.username,
              data: this.form.data,
              count: this.form.num,
              condition: this.form.condition,
              proportion: this.form.conditionNum / 100,
              bid_operate: this.form.bid,
              bid_proportion: this.form.bidNum / 100,
              strategy_id: this.editId,
            };
            updataBidStrategy(data)
              .then((res) => {
                if (res.data.code === 200) {
                  this.dialogVisible = false;
                  this.$message({
                    message: "出价策略更新成功！",
                    type: "success",
                  });
                  this.strategyList();
                } else if (res.data.code === 1) {
                  this.$message.error(res.data.msg);
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }
      });
    },
    // 取消表单验证
    formValidate() {
      if (this.$refs["form"] !== undefined) {
        this.$refs["form"].clearValidate();
      }
    },
    //新建策略按钮
    newStrategyFn() {
      this.formValidate();
      this.flag = true;
      this.form.name = "";
      this.form.data = "";
      this.form.num = 1;
      this.form.condition = "";
      this.form.conditionNum = 1;
      this.form.bid = "";
      this.form.bidNum = 1;
      this.dialogVisible = true;
    },
    // 编辑按钮
    editFn(id) {
      this.flag = false;
      this.dialogVisible = true;
      this.formValidate();
      this.compile(id);
    },
    cellClick(row) {
      this.editId = row.id;
    },
    // 获取出价策略详情
    compile(id) {
      compile({
        strategy_id: id,
      })
        .then((res) => {
          let result = res.data.data;
          this.form = {
            name: result.name,
            username: localStorage.getItem("user_name"),
            data: result.data,
            num: result.count,
            condition: result.condition,
            conditionNum: result.proportion * 100,
            bid: result.bid_operate,
            bidNum: result.bid_proportion * 100,
          };
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取列表数据
    strategyList() {
      let params = {
        page: this.currentPage,
        per_page: this.pagesize,
      };
      strategyList(params)
        .then((res) => {
          this.tableData = res.data.data.data;
          this.total = res.data.data.total_count;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.strategyList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.strategyList();
    },
    handleChange(value) {},
    onSubmit() {},
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
  created() {
    this.strategyList();
    this.form.username = localStorage.getItem("user_name");
  },
};
</script>

<style lang="less" scoped>
@import "@/views/index.less";
@import "../index.less";
@import "../../items/index.less";
</style>
