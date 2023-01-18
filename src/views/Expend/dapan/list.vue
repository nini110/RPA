<template>
  <!-- <div class="DMP outerDiv"> -->
  <div class="strategyNormal">
    <div class="centers">
      <div class="PriceTops">
        <!-- <el-form ref="form" :model="form" class="formObj" :rules="rules">
          <el-row :gutter="20">
            <el-col :span="11">
              <el-form-item label="品牌:">
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
                  :clearable="false"
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
              <div class="">
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
        </el-form> -->
      </div>
      <div ref="tableBox" class="tabbles pricetable">
        <vxe-table
          :data="tableData"
          stripe
          round
          ref="xTable"
          :column-config="{ resizable: true }"
          :row-config="{ isCurrent: true, isHover: true }"
          :edit-config="{ trigger: 'manual', mode: 'row', autoClear: false }"
          keep-source
          class="mytable-scrollbar normalScroll"
          auto-resize
          height="auto"
        >
          >
          <template #empty>
            <img src="@/assets/images/search.png" />
          </template>
          <vxe-column
            type="seq"
            title="序号"
            width="5%"
            fixed="left"
          ></vxe-column>
          <vxe-column
            min-width="6%"
            field="pro_num"
            title="项目编号"
            fixed="left"
          >
          </vxe-column>
          <vxe-column
            min-width="14%"
            field="pro_name"
            title="项目名称"
            show-overflow="tooltip"
            fixed="left"
          >
          </vxe-column>
          <vxe-column
            min-width="6%"
            field="real_money"
            title="中标金额"
            :edit-render="{ autofocus: '.vxe-input--inner', enabled: true }"
          >
            <template #edit="{ row }">
              <vxe-input v-model="row.real_money" type="text"></vxe-input>
            </template>
            <template #default="{ row }">
              <span>{{ row.real_money | numberToCurrencyNo }}</span>
            </template>
          </vxe-column>
          <vxe-column
            min-width="24%"
            field="bid_proxy"
            title="中标公司"
            show-overflow="tooltip"
          >
          </vxe-column>
          <vxe-column min-width="12%" field="create_date" title="中标日期">
          </vxe-column>
          <vxe-column title="操作" width="160">
            <template #default="{ row }">
              <template v-if="$refs.xTable.isActiveByRow(row)">
                <vxe-button @click="saveRowEvent(row)">保存</vxe-button>
                <vxe-button @click="cancelRowEvent(row)">取消</vxe-button>
              </template>
              <template v-else>
                <vxe-button @click="editRowEvent(row)">编辑</vxe-button>
              </template>
            </template>
          </vxe-column>
        </vxe-table>
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
  <!-- </div> -->
</template>
<script>
import { dapanList, dapanEdit } from "@/api/api";
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
    vm.getListData();
  },
  methods: {
    // 获取列表
    getListData(val) {
      const vm = this;
      dapanList().then((res) => {
        let result = res.data.data;
        vm.tableData = result;
        vm.total = res.data.count;
      });
    },
    // 编辑按钮
    editRowEvent(row) {
      const $table = this.$refs.xTable;
      $table.setActiveRow(row);
    },
    // 保存
    saveRowEvent(row) {
      const vm = this;
      const $table = this.$refs.xTable;
      dapanEdit({
        pro_num: row.pro_num,
        real_money: vm.numberToNo(row.real_money),
      }).then((res) => {
        if (res.data.code === 10000) {
          $table.clearActived().then(() => {
            vm.$msg({ msg: "金额修改成功！" });
          });
        } else {
          vm.$msg({ type: "error", msg: res.data.data });
        }
      });
    },
    // 取消
    cancelRowEvent(row) {
      const vm = this;
      const $table = this.$refs.xTable;
      $table.clearActived().then(() => {
        // 还原行数据
        $table.revertData(row);
        // vm.getListData()
      });
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
    numberToNo(value) {
      if (!value) return 0;
      // 获取整数部分
      const intPart = Math.trunc(value);
      // 整数部分处理，增加,
      const intPartFormat = intPart
        .toString()
        .replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
      // 预定义小数部分
      let floatPart = "";
      // 将数值截取为小数部分和整数部分
      const valueArray = value.toString().split(".");
      if (valueArray.length === 2) {
        // 有小数部分
        floatPart = valueArray[1].toString(); // 取得小数部分
        return intPartFormat + "." + floatPart;
      }
      return intPartFormat + floatPart;
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../Qianchuan/strategy/index.less";
.PriceTops {
  margin-top: 22px;
}
.rise {
  color: red;
}
.down {
  color: green;
}
</style>
