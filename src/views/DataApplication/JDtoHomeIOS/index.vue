<template>
  <!-- 竞标监控 -->
  <div class="biddingForMonitoring outerDiv">
    <div class="content">
      <div class="content_form">
        <div class="upobtn">
          <div class="lficon"><span class="iconfont icon-jingdongdaojia"></span><span>京东到家-苹果</span></div>
          <div class="rtForm">
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
                      <el-radio v-for="(item, idx) in opt_zhouqi" :key="idx" :label="item.code">{{ item.label
                      }}</el-radio>
                    </el-radio-group>
                  </div>
                  <div class="radioLine">
                    <span class="radioLine_label">点击/下单口径</span>
                    <el-radio-group class="radioLine_cnt" v-model="form.clickOrOrderCaliber">
                      <el-radio v-for="(item, idx) in opt_koujing" :key="idx" :label="item.code">{{ item.label
                      }}</el-radio>
                    </el-radio-group>
                  </div>
                  <div class="radioLine">
                    <span class="radioLine_label">含赠品/不含赠品</span>
                    <el-radio-group class="radioLine_cnt" v-model="form.giftFlag">
                      <el-radio v-for="(item, idx) in opt_zengpin" :key="idx" :label="item.code">{{ item.label
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
            <el-button v-waves class="el-icon-search" type="primary" @click="upList">查询
            </el-button>
          </div>
        </div>
      </div>
      <div ref="tableBox" class="content_tableBox jiankong">
        <el-divider>列表</el-divider>
        <div class="tables" v-if="tableData">
          <vxe-table ref="singleTable" :data="tableData" stripe round :column-config="{ resizable: true }"
            :row-config="{ isCurrent: true, isHover: true }" class="mytable-scrollbar" auto-resize height="auto">
            >
            <template #empty>
              <img src="@/assets/images/search.png" />
              <span>空空如也</span>
            </template>
            <vxe-column type="seq" title="序号" width="8%" fixed="left"></vxe-column>
            <vxe-column min-width="15%" field="Pin" title="PIN" fixed="left" show-overflow="tooltip"></vxe-column>
            <vxe-column min-width="12%" field="impressions" title="展现量" show-overflow="tooltip"></vxe-column>
            <vxe-column min-width="12%" field="clicks" title="点击量" show-overflow="tooltip"></vxe-column>
            <vxe-column min-width="12%" field="cost" title="消耗" show-overflow="tooltip"></vxe-column>
            <vxe-column min-width="12%" field="totalOrderSum" title="总订单金额" show-overflow="tooltip"></vxe-column>
            <vxe-column min-width="12%" field="totalOrderROI" title="ROI" show-overflow="tooltip"></vxe-column>
            <vxe-column min-width="12%" field="totalCartCnt" title="总购物车数" show-overflow="tooltip"></vxe-column>
          </vxe-table>
        </div>
        <div class="block" v-if="total">
          <el-pagination background @current-change="handleCurrentChange" :current-page="currpage" :page-size="pagesize"
            layout="total, prev, pager, next" :page-sizes="[10, 20, 50, 100]" :total="total"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  JDtoHomeList,
} from "@/api/api.js";
import message from "@/mixin/message";
export default {
  name: "Monitior",
  mixins: [message],
  data () {
    return {
      fromTag: 1,
      pageHaseItem: 0, // 当前页有多少条数据
      username: "",
      form: {
        clickOrOrderDay: 15, // 转化周期
        clickOrOrderCaliber: 0, // 口径
        giftFlag: 0, // 赠品
        orderStatusCategory: 0, // 订单
      },
      visible1: '',
      Data1: '',
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
        },
        {
          code: 0,
          label: '下单订单'
        },
      ],
      //表格渲染数据
      tableData: [],
      row: null,
      //页码相关
      total: null,
      currpage: 1,
      pagesize: 10,
      timer: null
    };
  },
  watch: {
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
      },
      immediate: true,
      deep: true
    }
  },
  created () {
    this.getlist()
  },
  methods: {
    // 查看列表
    getlist () {
      const vm = this
      let obj = {
        user_area: 'chengdu',
        ...vm.form,
        page: vm.currpage
      }
      JDtoHomeList(obj).then(res => {
        let resu = JSON.parse(res.data)
        if (resu.code === 10000) {
          vm.tableData = resu.data
          vm.total = resu.total
        } else {
          vm.$msg({
            type: "error",
            msg: resu.data || resu.msg,
          });
        }
      })
    },
    // 新增
    upList () {
      const vm = this
      clearTimeout(vm.timer)
      vm.timer = null
      vm.timer = setTimeout(() => {
        this.currpage = 1
        this.getlist()
      }, 500)
    },
    focusEvent1 () {
      this.$refs.refKoujing.showPanel()
    },
    //分页器功能
    handleCurrentChange (page) {
      this.currpage = page;
      this.getlist();
    },
  },
};
</script>
  
    
<style lang="less" scoped>
@import "@/views/BudgetAlarm/monitor/bidding.less";
@import "../../index";

.vxe-pulldown {
  width: 80%;
}
</style>
  