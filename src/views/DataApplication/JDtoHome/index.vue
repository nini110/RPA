<template>
  <!-- 竞标监控 -->
  <div class="biddingForMonitoring outerDiv">
    <div class="content">
      <div class="content_form">
        <div class="upobtn">
          <div class="lficon"><span class="iconfont icon-jingdongdaojia"></span><span>京东到家-安卓</span></div>
          <el-button v-waves class="el-icon-refresh-right" type="primary" @click="upList">刷新
          </el-button>
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
            :page-sizes="[10, 20, 50, 100]" layout="total, prev, pager, next" :total="total"></el-pagination>
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
  created () {
    this.getlist()
  },
  methods: {
    // 查看列表
    getlist () {
      const vm = this
      let obj = {
        user_area: 'beijing',
        clickOrOrderDay: 15,
        clickOrOrderCaliber: 1,
        giftFlag: 0,
        orderStatusCategory: 1,
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
    //分页器功能
    handleCurrentChange (page) {
      this.currpage = page;
      this.getlist();
    },
  },
};
</script>
  
    
<style lang="less" scoped>
@import "../../index";
@import "../monitor/bidding.less";

.bbbb {
  clear: both;
}
</style>
  