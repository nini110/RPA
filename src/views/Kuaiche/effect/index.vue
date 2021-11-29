<template>
  <div class="DMP outerDiv">
    <div class="content">
      <div class="form">
        <el-form ref="form" :model="form" class="formObj" :rules="rules">
          <div class="formObj_ipt ts">
            <el-form-item label="PIN:" prop="pin">
              <el-select v-model="form.pin" placeholder="请选择">
                <el-option
                  v-for="item in pinOptions"
                  :key="item.label"
                  :label="item.label"
                  :value="item.label"
                  clearable
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="tophasBtn" label="日期:" prop="search_date">
              <el-date-picker
               :class="{'tophasBtn_data2': $route.name === 'Charts'}"
                class="tophasBtn_data"
                v-model="form.search_date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
              <div class="tophasBtn_btn_div">
                <el-button
                  type="primary"
                  class="tophasBtn_btn btnnormal marginL"
                  @click="searchEvent"
                  >查询
                </el-button>
                <el-button
                  v-if="$route.name === 'Charts'"
                  type="primary"
                  class="tophasBtn_btn btnnormal marginL"
                  :disabled="openDis"
                  @click="openEvent"
                  >OPEN
                </el-button>
              </div>
            </el-form-item>
            <el-form-item
              v-if="$route.name !== 'Charts'"
              label="关键词:"
              prop="search_keyword"
            >
              <el-input
                v-model="form.search_keyword"
                size="medium"
                placeholder="请输入关键词"
                clearable
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div ref="tableBox" class="tableBox hasUp4">
        <el-divider></el-divider>
        <Chart
          v-if="$route.name === 'Charts'"
          :getDataFlag="getDataFlag"
          :showDrawerFlag="showDrawerFlag"
          @close="chartReset"
          :searchVal="searchVal"
        ></Chart>
        <div v-else class="tables">
          <!-- :height="tableHeight" -->
          <div class="tableTab" v-show="tableData">
            <el-table
              class="tableBox"
              border
              :data="tableData"
              ref="table"
              highlight-current-row
              height="0"
              :header-cell-style="{ background: '#F5F7FA', color: '#666' }"
              @sort-change="sortChange"
              style="width: 100%"
            >
              <template slot="empty">
                <span class="iconfont icon-wushuju">暂无数据</span>
              </template>
              <el-table-column
                type="index"
                width="80"
                label="序号"
                align="center"
                fixed="left"
              ></el-table-column>
              <el-table-column
                prop="keyword"
                label="关键词"
                min-width="180"
                fixed="left"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span
                    class="temInfoSpan"
                    @click="showInfoDarwer(scope.row)"
                    >{{ scope.row.keyword }}</span
                  >
                </template>
              </el-table-column>
              <el-table-column
                prop="unit_name"
                label="单元"
                show-overflow-tooltip
                min-width="180"
                fixed="left"
              >
              </el-table-column>
              <el-table-column
                prop="plan_name"
                label="计划"
                show-overflow-tooltip
                min-width="180"
                fixed="left"
              >
              </el-table-column>
              <el-table-column
                v-for="(item, idx) in topMenuList"
                :key="idx"
                :prop="item.prop"
                :column-key="item.prop"
                :label="item.label"
                :width="item.width"
                :sortable="item.sortable"
                :align="item.align"
                :filters="[{ text: '去除值为0的元素', value: 0 }]"
                :filter-method="filterTag"
              >
                <template slot-scope="scope">
                  <span v-if="$route.name === 'Effect'">{{
                    scope.row[`${item.prop}`] | formatPercent
                  }}</span>
                  <span v-else>{{ scope.row[`${item.prop}`] }}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="$route.name === 'Record'"
                label="操作"
                width="150"
                fixed="right"
              >
                <template slot-scope="scope">
                  <el-button class="el-icon-edit" type="text">调价</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 分页器 -->
          <div class="block" v-if="total">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              :page-size="pagesize"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <Drawer
      :showDrawer="showDrawer"
      :openDrawerInfo="openDrawerInfo"
      @close="closeDrawer"
    ></Drawer>
  </div>
</template>
<script>
import { effectBox, priceBox } from "@/api/api";
import Chart from "./charts2.vue";
import Drawer from "./drawer.vue";
export default {
  name: "Effect",
  components: {
    Chart,
    Drawer,
  },
  data() {
    return {
      openDrawerInfo: null,
      showDrawer: false,
      showDrawerFlag: false,
      openDis: true,
      getDataFlag: false,
      searchVal: null, // 传给图表组件的查询条件
      pinOptions: [
        { label: "方太灵狐广告代理" },
        { label: "小米灵狐代投1" },
        { label: "oppozydt1" },
        { label: "2021中兴手机代理投放" },
        { label: "一加手机灵狐投放" },
      ],
      rules: {
        pin: [
          {
            required: true,
            message: "请输入PIN",
            trigger: "blur",
          },
        ],
        search_date: [
          {
            required: true,
            message: "请选择日期",
            trigger: "blur",
          },
        ],
      },
      form: {
        pin: "",
        search_date: [],
        sort_word: "",
        sort_line: "",
        search_keyword: "",
      },
      tableData: [],
      topMenuList: [
        {
          prop: "diff_roi",
          label: "15天成交ROI变化",
          sortable: "custom",
          align: "right",
          width: "220",
        },
        {
          prop: "diff_total_cost",
          label: "15天成交订单金额变化",
          sortable: "custom",
          align: "right",
          width: "250",
        },
        {
          prop: "diff_order_line",
          label: "15天成交订单量变化",
          sortable: "custom",
          align: "right",
          width: "250",
        },
        {
          prop: "diff_zh_rate",
          label: "转化率变化",
          sortable: "custom",
          align: "right",
          width: "220",
        },
        {
          prop: "diff_click_rate",
          label: "点击率变化",
          sortable: "custom",
          align: "right",
          width: "220",
        },
        {
          prop: "diff_click",
          label: "点击量变化",
          sortable: "custom",
          align: "right",
          width: "220",
        },
        {
          prop: "diff_show",
          label: "展现量变化",
          sortable: "custom",
          align: "right",
          width: "220",
        },
      ],
      tableHeight: 0,
      //分页器状态
      total: null,
      currentPage: 1,
      pagesize: 10,
    };
  },
  watch: {
    $route: {
      handler(newval, oldval) {
        const vm = this;
        vm.getDataFlag = false;
        vm.form = {
          pin: "",
          search_date: [],
          sort_word: "",
          search_keyword: "",
        };
        vm.total = null;
        vm.tableData = [];
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {},
  methods: {
    openEvent() {
      this.showDrawerFlag = true;
    },
    // 抽屉详情
    showInfoDarwer(val) {
      const vm = this;
      vm.openDrawerInfo = val;
      vm.showDrawer = true;
    },
    closeDrawer() {
      const vm = this;
      vm.showDrawer = false;
    },
    chartReset() {
      this.getDataFlag = false;
      this.showDrawerFlag = false;
      this.openDis = false
    },
    // 过滤
    filterTag(value, row, column) {
      return row[column.columnKey] !== value;
    },
    // 排序
    sortChange(val) {
      const vm = this;
      vm.form.sort_word = val.prop;
      vm.form.sort_line = val.order === "descending" ? "DESC" : "ASC";
      vm.getTable();
    },
    searchEvent() {
      const vm = this;
      vm.$refs.form.validate((valid) => {
        if (valid) {
          if (vm.$route.name !== "Charts") {
            vm.getTable();
          } else {
            vm.searchVal = {
              ...vm.form,
              start_date: vm.form.search_date[0],
              end_date: vm.form.search_date[1],
            };
            vm.getDataFlag = true;
          }
        }
      });
    },
    // 获取效果列表
    getTable(pages, current) {
      const vm = this;
      vm.tableData = [];
      if (vm.$route.name === "Effect") {
        // 获取效果列表
        effectBox({
          ...vm.form,
          start_date: vm.form.search_date[0],
          end_date: vm.form.search_date[1],
          limit: vm.pagesize,
          page: vm.currentPage,
        }).then((res) => {
          if (res.data.code === 10000 && res.data.data.length > 0) {
            vm.tableData = res.data.data;
            vm.total = res.data.count;
          } else if (res.data.code === 10004) {
            vm.$message.warning(res.data.data);
          } else {
            vm.$message.warning("暂无数据");
          }
        });
      } else {
        // 获取改价列表
        priceBox({
          ...vm.form,
          start_date: vm.form.search_date[0],
          end_date: vm.form.search_date[1],
          limit: vm.pagesize,
          page: vm.currentPage,
        }).then((res) => {
          if (res.data.code === 10000 && res.data.data.length > 0) {
            vm.tableData = res.data.data;
            vm.total = res.data.count;
          } else {
            vm.$message.warning("暂无数据");
          }
        });
      }
    },
    //分页器功能
    handleSizeChange(val) {
      this.pagesize = val;
      this.getTable();
    },
    //有接口请求 每点击一页进行一次数据请求 参数页码为动态值：
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getTable();
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/views/index";
.temInfoSpan {
  cursor: pointer;
  color: #287bb5;
}
</style>
