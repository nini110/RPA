<template>
  <div class="outerDiv publicDiv">
    <div class="content">
      <div class="itemsComp">
        <div class="tabs">
          <el-tabs v-model="activeName">
            <el-tab-pane label="概况列表" name="0"></el-tab-pane>
            <el-tab-pane label="账号管理" name="1"></el-tab-pane>
          </el-tabs>
          <div v-if="activeName === '0'" class="tabs_cnt">
            <div class="strategyNormal">
              <div class="centers">
                <div class="PriceTops">
                  <el-form style="margin: 0">
                    <el-row type="flex" justify="space-between">
                      <el-col :span="8">
                        <el-form-item class="hasnolab cnt100">
                          <el-radio-group v-model="selectTab" @input="radioEvent">
                            <el-radio-button v-for="(item, idx) in radioOpt" :key="idx" :label="item.label">{{
                              item.label
                            }}</el-radio-button>
                          </el-radio-group>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item class="cnt100">
                          <vxe-pulldown ref="refKoujing" v-model="visible1">
                            <template #default>
                              <el-input v-model="Data1" readonly placeholder="请选择数据口径" @focus="focusEvent1">
                              </el-input>
                            </template>
                            <template #dropdown>
                              <div class="dropdownbox">
                                <div class="radioLine">
                                  <span class="radioLine_label">转化周期</span>
                                  <el-radio-group class="radioLine_cnt" v-model="form.clickOrOrderDay">
                                    <el-radio v-for="(item, idx) in opt_zhouqi" :key="idx" :label="item.code">{{
                                      item.label
                                    }}</el-radio>
                                  </el-radio-group>
                                </div>
                                <div class="radioLine">
                                  <span class="radioLine_label">点击/下单口径</span>
                                  <el-radio-group class="radioLine_cnt" v-model="form.clickOrOrderCaliber">
                                    <el-radio v-for="(item, idx) in opt_koujing" :key="idx" :label="item.code">{{
                                      item.label
                                    }}</el-radio>
                                  </el-radio-group>
                                </div>
                                <div class="radioLine">
                                  <span class="radioLine_label">含赠品/不含赠品</span>
                                  <el-radio-group class="radioLine_cnt" v-model="form.giftFlag">
                                    <el-radio v-for="(item, idx) in opt_zengpin" :key="idx" :label="item.code">{{
                                      item.label
                                    }}</el-radio>
                                  </el-radio-group>
                                </div>
                                <div class="radioLine">
                                  <span class="radioLine_label">成交/下单订单</span>
                                  <el-radio-group class="radioLine_cnt" v-model="form.orderStatusCategory">
                                    <el-radio v-for="(item, idx) in opt_order" :key="idx" :label="item.code">{{ item.label
                                    }}</el-radio>
                                  </el-radio-group>
                                </div>
                              </div>
                            </template>
                          </vxe-pulldown>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item class="hasnolab cnt100">
                          <el-date-picker v-model="form.dateRange" type="daterange" range-separator="至"
                            start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy 年 MM 月 dd 日"
                            value-format="yyyy-MM-dd" :picker-options="pickerOptionsStart" @blur="dateBlur"
                            :clearable="false">
                          </el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span="2" class="ts">
                        <el-form-item>
                          <el-button v-waves class="el-icon-refresh-right" type="primary" @click="refreshEve">刷新
                          </el-button>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </div>
                <!-- <el-divider content-position="left">广告概况</el-divider> -->
                <div class="tabbles pricetable">
                  <vxe-table ref="xTable" border :column-config="{ resizable: true }" :expand-config="{
                    accordion: true,
                    iconOpen: 'el-icon-folder-opened', iconClose: 'el-icon-folder'
                  }" :row-config="{ isCurrent: true, isHover: true }" class="mytable-scrollbar" auto-resize
                    height="auto" :data="card">
                    <vxe-column type="seq" title="序号" width="80"></vxe-column>
                    <vxe-column type="expand" title="详细" width="80">
                      <template #content="{ row, rowIndex }">
                        <div class="expand-wrapper">
                          <vxe-table border :data="row.resData">
                            <vxe-column v-for="(item, idx) in subTableList" :field="item.code"
                              :title="item.label"></vxe-column>
                          </vxe-table>
                        </div>
                      </template>
                    </vxe-column>
                    <vxe-column field="name" title="账户"></vxe-column>
                    <vxe-column field="money" title="金额"></vxe-column>
                  </vxe-table>
                </div>
                <div class="block">
                  <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pagesize"
                    layout="total, sizes, prev, pager, next, jumper" :total="total">
                  </el-pagination>
                </div>
              </div>
            </div>
          </div>
          <div v-if="activeName === '1'" class="tabs_cnt">
            <listPage></listPage>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import dayjs from "dayjs";
import { multiGailan } from "@/api/api";
import listPage from './list.vue'
import { numberToCurrencyNo } from '../../../utils/format.js'
export default {
  name: "SeleBrand",
  components: {
    listPage
  },
  data () {
    const vm = this
    return {
      tableData: [],
      hasinfo: false,
      activeName: "0",
      selectTab: '账户汇总',
      form: {
        clickOrOrderDay: 15, // 转化周期
        clickOrOrderCaliber: 1, // 口径
        giftFlag: 0, // 赠品
        orderStatusCategory: 1, // 订单
        dateRange: [dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
      },
      visible1: '',
      Data1: '',
      pickerOptionsStart: {
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            const end = dayjs().format('YYYY-MM-DD');
            const start = dayjs().format('YYYY-MM-DD');
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '昨天',
          onClick (picker) {
            const start = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
            picker.$emit('pick', [start, start]);
          }
        }, {
          text: '最近7天',
          onClick (picker) {
            const end = dayjs().format('YYYY-MM-DD');
            const start = dayjs().subtract(6, 'day').format('YYYY-MM-DD');
            picker.$emit('pick', [start, end]);
          }
        },
        {
          text: '最近15天',
          onClick (picker) {
            const end = dayjs().format('YYYY-MM-DD');
            const start = dayjs().subtract(14, 'day').format('YYYY-MM-DD')
            picker.$emit('pick', [start, end]);
          }
        },
        {
          text: '最近30天',
          onClick (picker) {
            const end = dayjs().format('YYYY-MM-DD');
            const start = dayjs().subtract(29, 'day').format('YYYY-MM-DD')
            picker.$emit('pick', [start, end]);
          }
        }],
        disabledDate: (time) => {
          let today = dayjs();
          let orgDate = dayjs('2021-06-01')
          let maxDate = dayjs().add(2, "month");
          let minDate = dayjs().subtract(2, "month");
          if (vm.tdata1) {
            let dateRegionMax = dayjs(vm.tdata1).add(2, "month");;
            let dateRegionMin = dayjs(vm.tdata1).subtract(2, "month");
            if (dateRegionMax.isAfter(today)) {
              return time.getTime() >= today || time.getTime() < dateRegionMin || time.getTime() < orgDate;
            } else {
              return time.getTime() >= dateRegionMax || time.getTime() < dateRegionMin || time.getTime() < orgDate;
            }
          } else {
            if (maxDate.isAfter(today)) {
              return time.getTime() >= today || time.getTime() < orgDate
            } else {
              return time.getTime() >= maxDate || time.getTime() < orgDate
            }
          }
        },
        onPick (time) {
          //当第一时间选中才设置禁用
          if (time.minDate && !time.maxDate) {
            vm.tdata1 = time.minDate;
          } else {
            vm.tdata1 = null
          }
        },
      },
      tdata1: null,
      card: [],
      subTableList: [
        {
          code: 'CPC',
          label: '平均点击成本'
        },
        {
          code: 'CPM',
          label: '平均千次展示成本'
        },
        {
          code: 'CTR',
          label: '点击率'
        },
        {
          code: 'clicks',
          label: '点击数'
        },
        {
          code: 'cost',
          label: '花费'
        },
        {
          code: 'impressions',
          label: '展示数'
        },
        {
          code: 'totalOrderCVS',
          label: '转化率'
        },
        {
          code: 'totalOrderCnt',
          label: '总订单行'
        },
        {
          code: 'totalOrderROI',
          label: 'ROI'
        },
        {
          code: 'totalOrderSum',
          label: '总订单金额'
        },
      ],
      radioOpt: [
        {
          code: 'cardBoxHuizong',
          label: '账户汇总'
        },
        {
          code: 'cardBoxZhanwai',
          label: '站外广告'
        },
        {
          code: 'cardBoxCar',
          label: '快车'
        },
        {
          code: 'cardBoxTuijian',
          label: '推荐广告'
        },
        {
          code: 'cardBoxZhineng',
          label: '智能投放'
        },
      ],
      opt_zhouqi: [{
        code: 0,
        label: '当天'
      },
      {
        code: 1,
        label: '1天'
      },
      {
        code: 3,
        label: '3天'
      },
      {
        code: 7,
        label: '7天'
      },
      {
        code: 15,
        label: '15天'
      },
      {
        code: 30,
        label: '30天'
      }
      ],
      opt_koujing: [{
        code: 0,
        label: '点击'
      },
      {
        code: 1,
        label: '下单'
      }
      ],
      opt_zengpin: [{
        code: 1,
        label: '含赠品'
      },
      {
        code: 0,
        label: '不含赠品'
      },
      ],
      opt_order: [
        {
          code: 1,
          label: '成交订单'
        }, {
          code: 0,
          label: '下单订单'
        },
      ],
      currentInfo: {},
      currentPage: 1,
      pagesize: 10,
      total: 0,
    };
  },
  watch: {
    activeName: {
      handler (newval, oldval) {
        if (newval === '0') {
          this.currentPage = 1
          this.currentInfo = {}
          this.selectTab = '账户汇总'
          this.getData()
        }
      },
      immediate: false,
      deep: true
    },
    form: {
      handler (newval, oldval) {
        const vm = this;
        let a = vm.opt_zhouqi.filter((val, idx) => {
          return val.code === newval.clickOrOrderDay
        })[0].label
        let b = vm.opt_koujing.filter((val, idx) => {
          return val.code === newval.clickOrOrderCaliber
        })[0].label
        let c = vm.opt_zengpin.filter((val, idx) => {
          return val.code === newval.giftFlag
        })[0].label
        let d = vm.opt_order.filter((val, idx) => {
          return val.code === newval.orderStatusCategory
        })[0].label
        vm.Data1 = `${a} / ${b} / ${c} / ${d}`
        vm.getData();
      },
      immediate: true,
      deep: true
    }
  },
  created () {

  },
  methods: {
    refreshEve () {
      this.getData()
    },
    getData () {
      const vm = this;
      multiGailan({
        ...vm.form,
        start_data: vm.form.dateRange[0],
        end_data: vm.form.dateRange[1],
        page: vm.currentPage,
        page_size: vm.pagesize
      }).then(res => {
        vm.hasinfo = res.data.code === 10000
        if (res.data.code === 10000) {
          let result = res.data.data
          vm.total = res.data.total
          vm.card = []
          for (let i in result) {
            let obj = {
              name: i,
              money: result[i]['账户余额'],
              resData: null
            }
            for (let j in result[i]) {
              if (i !== '账户余额') {
                vm.$set(obj, j, result[i][j])
              }
            }
            vm.card.push(obj)
          }
          vm.hasinfo = vm.card.length > 0
          vm.radioEvent(vm.selectTab)
        }
      })
    },
    radioEvent (tag) {
      const vm = this
      vm.card.forEach((item, idx) => {
        item.resData = [JSON.parse(JSON.stringify(item[tag]))]
      })
    },
    focusEvent1 () {
      this.$refs.refKoujing.showPanel()
    },
    dateBlur (val) {
      this.tdata1 = null
    },
    handleSizeChange (val) {
      this.pagesize = val;
      this.getData();
    },
    handleCurrentChange (val) {
      this.currentPage = val;
      this.getData();
    },
  },
};
</script>
<style scoped lang="less">
@import 'index';
@import "@/views/BudgetAlarm/monitor/bidding.less";
@import "@/views/Qianchuan/index.less";
@import "@/views/Qianchuan/strategy/index.less";
@import "@/views/Qianchuan/items/index.less";

/deep/.el {
  &-col {
    &.ts {
      .el-form-item__content {
        width: 100%;
        display: flex;
        flex-direction: row-reverse;
      }

      .el-button {
        min-width: auto;
        width: 100%;
      }
    }
  }

  &-radio-group {
    width: 100%;
    display: flex;

    label {
      flex: 1;
    }
  }

  &-radio-button__inner {
    width: 100%;
  }
}


.vxe-pulldown {
  width: 100%;
}
</style>
