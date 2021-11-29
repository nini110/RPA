<template>
  <el-drawer
    :title="'当前关键词： ' + openDrawerInfo.keyword"
    :visible.sync="drawer"
    direction="rtl"
    @close="closeEvent"
  >
    <div
      class="drawerTable"
      v-for="(item, idx) in table"
      :key="idx"
    >
      <el-divider><i :class="item.icon">{{item.txt}}</i></el-divider>
      <el-table :data="item.drawerData">
        <template slot="empty">
          <span class="iconfont icon-wushuju">暂无数据</span>
        </template>
        <el-table-column
          v-for="(item1, idx1) in item.tabList"
          :key="idx1"
          :prop="item1.prop"
          align="center"
          :label="item1.label"
          :min-width="item1.width"
        >
        </el-table-column>
      </el-table>
    </div>
      <el-divider><i class="el-icon-edit-outline">调价</i></el-divider>
正在开发
  </el-drawer>  
</template>
<script>
export default {
  name: "Drawer",
  props: {
    openDrawerInfo: {
      type: Object,
      default: null,
    },
    showDrawer: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    showDrawer(newval, oldval) {
      this.drawer = newval
    }
  },
  data() {
    return {
      drawer: true,
      table: [
        {
          txt: '信息',
          icon: 'el-icon-chat-line-round',
          drawerData: null,
          tabList: [
            {
              prop: "khd",
              label: "类型",
              width: "110",
            },
            {
              prop: "initial",
              label: "初始价格",
              width: "110",
            },
            {
              prop: "final",
              label: "最终价格",
              width: "110",
            },
            {
              prop: "autoNum",
              label: "算法改价次数",
              width: "130",
            },
            {
              prop: "dayNum",
              label: "人工改价天数",
              width: "130",
            },
          ],
        },
        {
          txt: '调价详情',
          icon: 'el-icon-date',
          drawerData: [
            {
              changeDta: "2021-11-17",
              changeInfo: "1.3 -  1.4",
            },
            {
              changeDta: "2021-11-28",
              changeInfo: "1.4 -  1.5",
            },
            {
              changeDta: "2021-11-19",
              changeInfo: "1.5 -  1.6",
            }
          ],
          tabList: [
            {
              prop: "changeDta",
              label: "日期",
              width: "120",
            },
            {
              prop: "changeInfo",
              label: "调价详情",
              width: "200",
            },
          ],
        }
      ],
    };
  },
  created() {},
  methods: {
    closeEvent() {
      const vm = this;
      vm.$emit("close");
    },
  },
};
</script>
<style lang="less" scoped>
.drawerTable {
  height: 28%;
  .el-table {
      height: calc(100% - 50px)!important;
      &:before {
          display: none;
      }
  }
}
</style>
