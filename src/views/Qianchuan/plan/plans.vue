<template>
  <div class="plans">
    <div class="centers">
      <div class="tables">
        <vxe-table
          ref="table"
          :data="tableData"
          stripe
          round
          :column-config="{ resizable: true }"
          :row-config="{ isCurrent: true, isHover: true }"
          class="mytable-scrollbar"
          auto-resize
          height="auto"
          :sort-config="{
            remote: true,
            trigger: 'cell',
            defaultSort: { field: 'age', order: 'desc' },
            orders: ['desc', 'asc', null],
          }"
          @sort-change="sortChange"
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
            field="name"
            title="计划名称"
            fixed="left"
            width="15%"
            show-overflow="tooltip"
          ></vxe-column>
          <vxe-column
            v-for="(item, idx) in topMenuList"
            :key="idx"
            :width="item.width"
            :field="item.prop"
            :title="item.label"
            sortable
            :filters="[{ label: '去除值为0的元素', value: 0 }]"
            :filter-method="filterTag"
          >
            <template slot-scope="scope">
              <span v-if="$route.name === 'Effect'">{{
                scope.row[`${item.prop}`] | formatPercent
              }}</span>
              <span v-else>{{ scope.row[`${item.prop}`] }}</span>
            </template></vxe-column
          >
        </vxe-table>
      </div>
      <div class="Fpage">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Plans",
  data() {
    return {
      currentPage4: 1,
      topMenuList: [
        {
          prop: "address",
          label: "批次号",
          width: "20%",
        },
        {
          prop: "address",
          label: "计划状态",
          width: "20%",
        },
        {
          prop: "address",
          label: "直播间信息",
          width: "20%",
        },
        {
          prop: "address",
          label: "出价",
          width: "20%",
        },
        {
          prop: "address",
          label: "广告组名称",
          width: "20%",
        },
        {
          prop: "address",
          label: "预算",
          width: "20%",
        },
        {
          prop: "address",
          label: "消耗差值",
          width: "20%",
        },
        {
          prop: "address",
          label: "消耗差值比",
          width: "20%",
        },
        {
          prop: "address",
          label: "展示次数差值",
          width: "20%",
        },
        {
          prop: "address",
          label: "展示次数差值比",
          width: "20%",
        },
        {
          prop: "address",
          label: "点击率差值比",
          width: "20%",
        },
        {
          prop: "address",
          label: "平均千次展现费用差值",
          width: "20%",
        },
        {
          prop: "address",
          label: "平均千次展现费用差值比",
          width: "20%",
        },
        {
          prop: "address",
          label: "点击次数差值",
          width: "20%",
        },
        {
          prop: "address",
          label: "点击次数差值比",
          width: "20%",
        },
        {
          prop: "address",
          label: "转化数差值",
          width: "20%",
        },
        {
          prop: "address",
          label: "转化成本差值",
          width: "20%",
        },
        {
          prop: "address",
          label: "转化成本差值比",
          width: "20%",
        },
        {
          prop: "address",
          label: "转化率差值比",
          width: "20%",
        },
      ],
      tableData: [
        {
          date: "2",
          name: "王小虎",
          address: "金沙江路",
        },
        {
          date: "4",
          name: "王小虎",
          address: "金沙江路",
        },
        {
          date: "1",
          name: "王小虎",
          address: "金沙江路",
        },
      ],
    };
  },
  methods: {
    handleSizeChange() {},
    handleCurrentChange() {},
  },
};
</script>

<style lang="less">
.plans {
  display: flex;
  flex-direction: row-reverse;
  background-color: #fff;
  .centers {
    width: 975px;
    background-color: #fff;
    height: 1300px;
    .Fpage {
      display: flex;
      justify-content: center;
    }
    .tabTops {
      display: flex;

      .tabTopsItem {
        display: flex;
        width: 280px;

        .names {
          width: 120px;
          font-size: 14px;
          text-align: right;
        }
      }
    }
  }
}
</style>
