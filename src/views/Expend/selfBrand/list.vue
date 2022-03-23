<template>
  <div class="DMP outerDiv">
    <div class="content">
      <div class="content_form">
        <el-form ref="form" :model="form" class="formObj" :rules="rules">
          <div class="formObj_ipt">
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
                    >查询</el-button>
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
              <vxe-column type="seq" title="序号" width="5%" fixed="left"></vxe-column>
              <vxe-column
                v-for="(item, idx) in topMenuList"
                :key="idx"
                :field="item.prop"
                :title="item.label"
              ></vxe-column>
              <vxe-column field="consume" title="总消耗">
                <template #default="{ row }">
                  <span v-if="!row.consume">--</span>
                  <span v-else>{{ row.consume | numberToCurrencyNo }}</span>
                </template>
              </vxe-column>
              <vxe-column field="hb_consume" title="环比">
                <template #default="{ row }">
                  <span v-if="!row.hb_consume">--</span>
                  <span v-else>{{ row.hb_consume | numberToCurrencyNo }}</span>
                </template>
              </vxe-column>
              <vxe-column field="hb_consume" title="环比变化比例">
                <template #default="{ row }">
                  <span v-if="!row.hb_consume">--</span>
                  <div v-else>
                    <span :class="row.hb_icon">{{ row.percent_hb }}</span>
                  </div>
                </template>
              </vxe-column>
              <vxe-column field="tb_consume" title="同比">
                <template #default="{ row }">
                  <span v-if="!row.tb_consume">--</span>
                  <span v-else>{{ row.tb_consume | numberToCurrencyNo }}</span>
                </template>
              </vxe-column>
              <vxe-column field="hb_consume" title="同比变化比例">
                <template #default="{ row }">
                  <span v-if="!row.hb_consume">--</span>
                  <div v-else>
                    <span :class="row.tb_icon">{{ row.percent_tb }}</span>
                  </div>
                </template>
              </vxe-column>
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
  </div>
</template>
<script>
import { selfBrand, selfExpendList } from "@/api/api";
export default {
  name: "ListPage",
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
          prop: "brand",
          label: "品牌",
          align: "right",
          width: "280",
        }
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
    let myday = vm.formaterDate(new Date().getTime());
    let oldday = vm.formaterDate(
      new Date().getTime() - 7 * 24 * 60 * 60 * 1000
    );
    vm.form.search_date = [oldday, myday];
    vm.searchEvent();
  },
  methods: {
    // 处理日期
    formaterDate(val) {
      let Y = new Date(val).getFullYear();
      let M = new Date(val).getMonth() + 1;
      let D = new Date(val).getDate();
      return Y + "-" + M + "-" + D;
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
        let result = res.data.data
        result.forEach((item, index) => {
          let tbP = (item.consume - item.tb_consume) / item.tb_consume
          let hbP = (item.consume - item.hb_consume) / item.hb_consume
          let percent_tb = Math.abs(Math.floor(tbP * 10000) / 100) + '%'
          let percent_hb = Math.abs(Math.floor(hbP * 10000) / 100) + '%'
          vm.$set(item, 'percent_tb', percent_tb)
          vm.$set(item, 'percent_hb', percent_hb)

          vm.$set(item, 'tb_icon', item.tb_consume > item.consume ? 'el-icon-top rise' : 'el-icon-bottom down')
          vm.$set(item, 'hb_icon', item.hb_consume > item.consume ? 'el-icon-top rise' : 'el-icon-bottom down')
        })
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
