<template>
  <!-- <div class="DMP outerDiv"> -->
  <div class="content tsts">
    <div class="content_form" style="padding-top: 10px">
      <el-form ref="form" :model="form" class="formObj" :rules="rules">
        <div class="formObj_ipt expend">
          <el-row>
            <el-col :span="12">
              <el-form-item label="品牌:" prop="brand">
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
            <el-col :span="10">
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
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <div class="tophasBtn_btn_div">
                <el-button
                  v-waves
                  type="primary"
                  class="el-icon-search marginL"
                  @click="searchEvent(serchVal)"
                  >查询</el-button
                >
              </div>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
    <div ref="tableBox" class="content_tableBox hasUp6">
      <div class="tables">
        <div class="tableTab" v-show="tableData">
          <vxe-table
            :data="tableData"
            stripe
            round
            :column-config="{ resizable: true }"
            :row-config="{ isCurrent: true, isHover: true }"
            :tooltip-config="{
              showAll: true,
              enterable: true,
              contentMethod: showTooltipMethod,
            }"
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
              width="5%"
              fixed="left"
            ></vxe-column>
            <vxe-column
              title="品牌"
              width="12%"
              field="brand"
              fixed="left"
            ></vxe-column>
            <vxe-column
              min-width="12%"
              field="jd_consume"
              title="京牌代理消耗"
              :title-help="{
                icon: 'el-icon-question',
                message: '包含站内数据：快车、触点、展位，站外数据：直投',
              }"
            >
              <template #default="{ row }">
                <span v-if="!row.jd_consume">--</span>
                <span v-else>{{ row.jd_consume | numberToCurrencyNo }}</span>
              </template>
            </vxe-column>
            <vxe-column
              min-width="12%"
              field="pin_consume"
              title="子账号明细消耗"
              :title-help="{
                icon: 'el-icon-question',
                message: '各个自有账号下数据，包含数据：海投、京速推、直投',
              }"
            >
              <template #default="{ row }">
                <span v-if="!row.pin_consume">--</span>
                <span v-else>{{ row.pin_consume | numberToCurrencyNo }}</span>
              </template>
            </vxe-column>
            <vxe-column min-width="12%" field="consume" title="总消耗">
              <template #default="{ row }">
                <span v-if="!row.total_consume">--</span>
                <span v-else>{{ row.total_consume | numberToCurrencyNo }}</span>
              </template>
            </vxe-column>
            <vxe-column min-width="12%" field="tb_consume" title="同比">
              <template #default="{ row }">
                <span v-if="!row.tb_consume">--</span>
                <span v-else>{{ row.tb_consume | numberToCurrencyNo }}</span>
              </template>
            </vxe-column>
            <vxe-column min-width="12%" field="hb_consume" title="同比变化比例">
              <template #default="{ row }">
                <span v-if="!row.tb_consume">--</span>
                <div v-else>
                  <span :class="row.tb_icon">{{ row.percent_tb }}</span>
                </div>
              </template>
            </vxe-column>
            <vxe-column min-width="12%" field="consume" title="站内返点消耗">
              <template #default="{ row }">
                <span v-if="!row.zn_fd">--</span>
                <span v-else>{{ row.zn_fd | numberToCurrencyNo }}</span>
              </template>
            </vxe-column>
            <vxe-column min-width="12%" field="consume" title="站外返点消耗">
              <template #default="{ row }">
                <span v-if="!row.zw_fd">--</span>
                <span v-else>{{ row.zw_fd | numberToCurrencyNo }}</span>
              </template>
            </vxe-column>
            <vxe-column min-width="12%" field="consume" title="其他非返点消耗">
              <template #default="{ row }">
                <span v-if="!row.zw_nfd">--</span>
                <span v-else>{{ row.zw_nfd | numberToCurrencyNo }}</span>
              </template>
            </vxe-column>
            <!--  -->
          </vxe-table>
        </div>
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
        ></el-pagination>
      </div>
    </div>
  </div>
  <!-- </div> -->
</template>
<script>
import { selfBrand, selfExpendList } from "@/api/api";
import dayjs from "dayjs";
export default {
  name: "ListPage",
  data() {
    return {
      pickerOptionsStart: {
        disabledDate: (time) => {
          return time.getTime() >= new Date().getTime() - 24 * 60 * 60 * 1000;
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
    let myday = dayjs().subtract(1, "day").format("YYYY-MM-DD");
    let oldday = dayjs().subtract(8, "day").format("YYYY-MM-DD");
    vm.form.search_date = [oldday, myday];
    vm.searchEvent();
  },
  methods: {
    showTooltipMethod({ type, column, row, items, _columnIndex }) {
      const { property } = column;
      // 重写默认的提示内容
      if (property === "jd_consume" || property === "pin_consume") {
        if (type === "header") {
          return column.titleHelp.message;
        }
        return "";
      } else {
        // 返回空字符串，控制单元格不显示提示内容
        return "";
      }
      // 其余的单元格使用默认行为
      // return null;
    },
    // 获取品牌列表
    getBrand() {
      const vm = this;
      selfBrand({
        a: "",
      }).then((res) => {
        vm.pinOptions = res.data.data;
      });
    },
    // 获取列表
    getListData(val) {
      const vm = this;
      selfExpendList({ ...val }).then((res) => {
        let result = res.data.data;
        result.forEach((item, index) => {
          vm.$set(
            item,
            "percent_tb",
            Math.abs(item.tb_proportion * 100).toFixed(2) + "%"
          );
          vm.$set(
            item,
            "percent_hb",
            Math.abs(item.hb_proportion * 100).toFixed(2) + "%"
          );

          vm.$set(
            item,
            "tb_icon",
            item.tb_consume < item.total_consume
              ? "el-icon-top rise"
              : "el-icon-bottom down"
          );
        });
        vm.tableData = result;
        vm.total = res.data.count;
      });
    },
    searchEvent() {
      const vm = this;
      let data = {
        start_date: vm.form.search_date[0],
        end_date: vm.form.search_date[1],
      };
      vm.serchVal = {
        ...data,
        brand: vm.form.brand,
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
.rise {
  color: red;
}
.down {
  color: green;
}
</style>
