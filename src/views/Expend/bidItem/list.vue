<template>
  <div class="content tsts">
    <div class="content_form" style="padding-top: 10px">
      <el-form ref="form" :model="form" class="formObj" :rules="rules">
        <div class="formObj_ipt">
          <el-row>
            <el-col :span="12">
              <el-form-item label="项目:" prop="brand">
                <el-select
                  v-model="form.brand"
                  class="normalScroll"
                  placeholder="请选择"
                  clearable
                  filterable
                  :popper-append-to-body="false"
                >
                  <el-option
                    v-for="item in pinOptions"
                    :key="item.brand"
                    :label="item.brand"
                    :value="item.brand"
                    clearable
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="tophasBtn" label="日期:" prop="search_date">
                <el-date-picker
                  class="tophasBtn_data"
                  v-model="form.search_date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptionsStart"
                ></el-date-picker>
                <div class="tophasBtn_btn_div">
                  <el-button
                    v-waves
                    type="primary"
                    class="el-icon-search marginL"
                    @click="searchEvent(serchVal)"
                    >查询</el-button
                  >
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
    <div ref="tableBox" class="content_tableBox hasUp6">
      <div class="tables">
        <div class="tableTab" v-show="tableData">
          <vxe-table
            ref="table"
            :data="tableData"
            stripe
            round
            :column-config="{ resizable: true }"
            :row-config="{ isCurrent: true, isHover: true }"
            class="mytable-scrollbar normalScroll"
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
              width="5%"
              fixed="left"
            ></vxe-column>
            <vxe-column
              field="brandName"
              title="项目名称"
              width="30%"
              fixed="left"
              show-overflow="tooltip"
            ></vxe-column>
            <vxe-column
              field="category"
              title="类目"
              width="30%"
              show-overflow="tooltip"
            ></vxe-column>
            <vxe-column
              v-for="(item, idx) in topMenuList"
              :key="idx"
              :field="item.prop"
              :title="item.label"
              show-overflow="tooltip"
              min-width="14%"
            >
              <template #default="{ row }">
                <span v-if="item.type === 'num'">{{
                  Math.abs(row[item.prop] * 100).toFixed(2) | numberToCurrencyNo
                }}</span>
                <span v-else-if="item.type === 'per'"
                  >{{
                    Math.abs(row[item.prop] * 100).toFixed(2)
                      | numberToCurrencyNo
                  }}%</span
                >
                <span v-else>{{ row[item.prop] }}</span>
              </template>
            </vxe-column>
          </vxe-table>
        </div>
      </div>
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
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { bidItem, bidItemList } from "@/api/api";
import dayjs from "dayjs";
export default {
  name: "BidItem",
  components: {},
  data() {
    return {
      pickerOptionsStart: {
        disabledDate: (time) => {
          return time.getTime() >= new Date().getTime();
        },
      },
      pinOptions: [],
      rules: {
        brand: [
          {
            required: true,
            message: "请选择品牌",
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
      serchVal: null,
      form: {
        brand: "",
        search_date: [],
      },
      tableData: [],
      topMenuList: [
        {
          prop: "impressions",
          label: "展现量",
          width: "280",
          type: "num",
        },
        {
          prop: "clicks",
          label: "点击量",
          align: "right",
          width: "240",
          type: "num",
        },
        {
          prop: "clicks_csv",
          label: "点击率",
          align: "right",
          width: "240",
          type: "per",
        },
        {
          prop: "cost",
          label: "总消耗",
          align: "right",
          width: "240",
          type: "num",
        },
        {
          prop: "cpc",
          label: "CPC",
          align: "right",
          width: "240",
          type: "per",
        },
        {
          prop: "thousand_impressions",
          label: "千次展示成本",
          align: "right",
          width: "240",
          type: "num",
        },
        {
          prop: "per_customer",
          label: "客单价",
          align: "right",
          width: "240",
          type: "num",
        },
        {
          prop: "roi",
          label: "ROI",
          width: "240",
          type: "per",
        },
      ],
      tableHeight: 0,
      //分页器状态
      total: null,
      currentPage: 1,
      pagesize: 10,
    };
  },
  mounted() {
    const vm = this;
    vm.getBrand();
    let myday = dayjs().format("YYYY-MM-DD");
    let oldday = dayjs().subtract(7, "day").format("YYYY-MM-DD");
    vm.form.search_date = [oldday, myday];
    vm.searchEvent();
  },
  methods: {
    // 获取品牌列表
    getBrand() {
      const vm = this;
      bidItem().then((res) => {
        vm.pinOptions = res.data.data;
      });
    },
    // 获取列表
    getListData(val) {
      const vm = this;
      bidItemList({ ...val }).then((res) => {
        if (res.data.count !== 0) {
          vm.tableData = res.data.data;
          vm.total = res.data.count;
        } else {
          vm.$msg({
            type: "warning",
            msg: "暂未查到相关数据",
          });
        }
      });
    },
    searchEvent() {
      const vm = this;
      let data = {
        start_data: vm.form.search_date[0],
        end_data: vm.form.search_date[1],
        brand_name: vm.form.brand,
      };
      vm.serchVal = {
        ...data,
        limit: vm.pagesize,
        page: vm.currentPage,
      };
      vm.getListData(vm.serchVal);
    },
    //分页器功能
    handleSizeChange(val) {
      this.pagesize = val;
      this.searchEvent();
    },
    //有接口请求 每点击一页进行一次数据请求 参数页码为动态值：
    handleCurrentChange(page) {
      this.currentPage = page;
      this.searchEvent();
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

.el-divider {
  margin-top: 0;
}
</style>
