<template>
  <div class="realTime outerDiv">
    <div class="content">
      <div class="centerTop">
        <div class="item">项目名称：{{ $route.query.name }}</div>
        <div class="item">项目ID：{{ $route.query.id }}</div>
        <div class="item">
          <el-button type="text" @click="routerFn()">查看数据变化值</el-button>
        </div>
      </div>
      <div class="form">
        <el-form ref="form" :model="form" class="formObj">
          <div class="formObj_ipt">
            <el-form-item label="策略名称:">
              <el-input
                v-model="input"
                size="medium"
                placeholder="请输入策略名称"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="策略类型:">
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
            </el-form-item>

            <el-form-item label="计划名称:">
              <el-input
                v-model="input"
                size="medium"
                placeholder="请输入计划名称"
                clearable
              ></el-input>
            </el-form-item>
          </div>
          <div class="formObj_button">
            <el-button
              type="primary"
              class="btnnormal"
              size="small"
              >查询</el-button
            >
          </div>
        </el-form>
      </div>
      <div ref="tableBox" class="tableBox">
        <el-divider></el-divider>
        <div class="tables">
          <div class="dialog">
            <el-dialog
              title="更换模板"
              :visible.sync="dialogVisible"
              width="30%"
              :close-on-click-modal="false"
            >
              <el-form ref="form" :model="form" label-width="120px">
                <el-form-item label="计划名称:">
                  <el-input
                    v-model="form.name"
                    placeholder="请输入计划名称"
                    size="medium"
                    class="w240"
                  ></el-input>
                </el-form-item>
                <el-form-item label="地域模板:">
                  <el-select
                    v-model="form.region"
                    placeholder="请选择活动区域"
                    size="medium"
                    class="w240"
                  >
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="年龄模板">
                  <el-select
                    v-model="form.age"
                    placeholder="请选择活动区域"
                    size="medium"
                    class="w240"
                  >
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" size="medium"
                  >取 消</el-button
                >
                <el-button
                  type="primary"
                  @click="dialogVisible = false"
                  size="medium"
                  >确 定</el-button
                >
              </span>
            </el-dialog>
          </div>
          <div class="tableTab">
            <el-table
              class="tableBox"
              :data="tableData"
              :height="tableHeight"
            >
              <el-table-column
                type="index"
                label="序号"
                width="100"
                align="center"
                header-align="center"
              >
              </el-table-column>
              <el-table-column
                prop="create_time"
                label="策略执行时间"
                width="180"
                align="center"
                header-align="center"
              >
              </el-table-column>
              <el-table-column
                prop="strategy_name"
                label="撞线策略"
                align="center"
                width="180"
                header-align="center"
              >
              </el-table-column>
              <el-table-column
                prop="address1"
                label="类型"
                align="center"
                header-align="center"
              >
                <template slot-scope="scope">
                  <div v-if="scope.row.status === 0">撤回</div>
                  <div v-else-if="scope.row.status === 1">已撤回</div>
                  <div v-else-if="scope.row.status === 2">撤回失败</div>
                  <div v-else-if="scope.row.status === 3">复制</div>
                  <div v-else-if="scope.row.status === 4">复制成功</div>
                  <div v-else-if="scope.row.status === 5">复制失败</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="plan_name"
                label="计划名称"
                align="center"
                width="260"
                header-align="center"
              >
                <template slot="header">
                  计划名称
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="目前暂不支持拉取开启“计划托管”功能的广告计划数据"
                    placement="top"
                  >
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column
                prop="batch_number"
                label="批次编号"
                align="center"
                heade-align="center"
              >
              </el-table-column>
              <el-table-column
                prop="address4"
                label="调整内容"
                align="center"
                width="120"
                header-align="center"
              >
                <template slot-scope="scope">
                  {{ scope.row.old_price }}→{{ scope.row.new_price }}
                </template>
              </el-table-column>
              <el-table-column
                prop="address"
                label="操作"
                width="130"
                align="center"
                header-align="center"
                fixed="right"
              >
                <template slot-scope="scope">
                  <el-button type="text" @click="withdrawFn()">撤回</el-button>
                  <el-button type="text" @click="dialogVisible = true"
                    >复制</el-button
                  >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="Left Center 提示文字"
                    placement="left"
                  >
                    <el-button type="text" style="color: #e1e1e1"
                      >不成功</el-button
                    >
                  </el-tooltip>
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
              :page-sizes="[10, 20, 30, 40, 50]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { readTimeData } from "../../../api/api.js";
export default {
  name: "RealTime",
  data() {
    return {
      currentPage: 1,
      value: "",
      pageSize: 10,
      total: 0,
      dialogVisible: false,
      options: [
        {
          value: "选项1",
          label: "所有",
        },
        {
          value: "选项2",
          label: "出价调整",
        },
        {
          value: "选项3",
          label: "预算调整",
        },
        {
          value: "选项4",
          label: "计划复制",
        },
      ],
      form: {
        name: "8.20直播大促初始—复制计划1",
        region: "",
        age: "",
      },
      input: "",
      tableData: [],
      tableHeight: 0,
    };
  },
  mounted() {
    this.tableHeight = window.getComputedStyle(this.$refs.tableBox).height
  },
  methods: {
    // 实时数据
    readTimeData() {
      let params = {
        page: this.currentPage,
        per_page: this.pageSize,
        project_id: this.$route.query.id,
      };
      console.log(params);
      readTimeData(params)
        .then((res) => {
          this.tableData = res.data.data;
          this.total = res.data.total_count;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 删除按钮
    withdrawFn() {
      this.$confirm("确定撤回该策略？", "撤回提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "撤回成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消撤回",
          });
        });
    },
    handleCurrentChange() {},
    handleSizeChange() {},
    routerFn() {
      const { href } = this.$router.resolve({
        name: "Plan",
      });
      window.open(href, "_blank");
    },
  },
  created() {
    this.readTimeData();
  },
};
</script>


<style lang="less" scoped>
@import "@/views/index";
@import "../items/index.less";
.w320 {
  width: 320px;
  height: 34px;
}
.tableBox {
height: calc(100% - 295px);
}

</style>
