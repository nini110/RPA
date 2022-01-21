<template>
  <!-- 查看详情 -->
  <el-dialog
    title="修改预算"
    :visible.sync="show"
    max-height="400px"
    width="40%"
    @close="closeDialog"
    custom-class="dialogEdit"
    :close-on-click-modal="false"
  >
    <vxe-table
      ref="singleTable"
      :data="xqlist"
      stripe
      round
      :column-config="{ resizable: true }"
      :row-config="{ isCurrent: true, isHover: true }"
      class="mytable-scrollbar"
      auto-resize
      height="500"
    >
      >
      <vxe-column type="seq" title="序号" width="60" fixed="left"></vxe-column>
      <vxe-column field="bidding_id" title="当日预算" min-width="20%">
        <template slot-scope="scope">
          <div class="input-box">
            <el-input
              style="text-align: center"
              size="small"
              @input="changethreshold(scope.row)"
              v-model.trim="scope.row.threshold"
            ></el-input>
          </div> </template
      ></vxe-column>
      <vxe-column field="bidding_date" title="日期" min-width="15%"></vxe-column>
    </vxe-table>
    <span slot="footer" class="dialog-footer">
      <a class="btnnormal btnnormal_down marginR" @click="closeDialog">
        <div class="el-icon-close btnSize">取消</div>
      </a>
      <el-button
        v-waves
        class="el-icon-finished"
        type="primary"
        @click="sendlist"
        >保存</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
import { viewDetails, detailsToModify } from "@/api/api.js";
export default {
  name: "DetailDialog",
  props: {
    row: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      show: true,
      xqlist: [], //查看详情列表
      changelist: [], //修改过后的列表
    };
  },
  created() {
    this.getDetail(this.row);
  },
  methods: {
    // 获取详情
    getDetail(row) {
      const vm = this;
      viewDetails({
        bidding_id: row.bidding_id,
        activity_id: row.activity_id,
      }).then((res) => {
        if (res.data.code == 10000) {
          vm.xqlist = res.data.data;
        } else if (res.data.code == 10000) {
          vm.$msg({ type: "warning", msg: "参数丢失" });
        } else {
          vm.$msg({ type: "error", msg: "出错了" });
        }
      });
    },

    changethreshold(scopeRow) {
      this.changelist.push({
        id: scopeRow.id,
        threshold: scopeRow.threshold,
      });
    },
    //上传修改后的预算数据
    sendlist() {
      const vm = this;
      detailsToModify({
        id_thresholds: vm.changelist,
      }).then((res) => {
        if (res.data.code == 10000) {
          vm.$emit("close", "suc");
          vm.$msg({ msg: "更新成功" });
          vm.$message.success("更新成功");
        } else if (res.data.code == 10001) {
          vm.$msg({ type: "warning", msg: "参数丢失" });
        } else {
          vm.$msg({ type: "error", msg: "出错了" });
        }
      });
    },
    closeDialog() {
      this.$emit("close");
    },
  },
};
</script>
<style scoped>
.detail_body {
  padding: 0 50px;
}
</style>
