<template>
  <div>
    <!-- <div v-if="errorLogs.length>0"> -->
    <el-dialog
      :visible.sync="dialogTableVisible"
      custom-class="dialogEdit"
      title="错误日志"
      width="50%"
      append-to-body
      :close-on-click-modal="false"
      @close="closeEvent"
    >
      <vxe-table
        :data="errorLogs"
        stripe
        round
        :column-config="{ resizable: true }"
        :row-config="{ isCurrent: true, isHover: true }"
        class="mytable-scrollbar drawerTable"
      >
        >
        <template #empty>
          <span></span>
        </template>
        <vxe-column field="keyword" title="错误信息" min-width="15%">
          <template slot-scope="{ row }">
            <div>
              <span class="message-title">信息:</span>
              <span class="message-cot message-cot-danger">{{
                row.err.message
              }}</span>
            </div>
            <br />
            <div>
              <span class="message-title">钩子: </span>
              <span class="message-cot message-cot-info"
                >{{ row.vm.$vnode.tag }} error in {{ row.info }}</span
              >
            </div>
            <br />
            <div>
              <span class="message-title">页面: </span>
              <span class="message-cot message-cot-suc">{{ row.url }}</span>
            </div>
          </template></vxe-column
        >
        <vxe-column field="keyword" title="位置" min-width="15%">
          <template slot-scope="{ row }">
            <p class="message-inf" v-html="row.err.stack"></p> </template
        ></vxe-column>
      </vxe-table>
      <span slot="footer" class="dialog-footer">
        <el-button v-waves type="primary" @click="clearAll">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "ErrorLog",
  props: {
    showLog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialogTableVisible: false,
    };
  },
  watch: {
    showLog(newval, oldval) {
      this.dialogTableVisible = newval;
    },
    errorLogs(newval, oldval) {
      const vm = this;
      newval.forEach((val, idx) => {
        vm.$set(val.err, "stack", val.err.stack.replace(/at /g, "</br>at "));
        // val.err.stack.replace('\n', '</br>')
      });
      console.log(this.errorLogs);
    },
  },
  computed: {
    ...mapGetters(["errorLogs"]),
  },
  methods: {
    closeEvent() {
      this.$emit("close");
    },
    clearAll() {
      this.dialogTableVisible = false;
      // 清空错误信息
      // this.$store.dispatch("errorLog/clearErrorLog");
    },
  },
};
</script>

<style scoped lang="less">
@import "@/views/index.less";

.message {
  &-title {
    display: inline-block;
    width: 10%;
    vertical-align: middle;
    font-size: 14px;
    line-height: 36px;
    color: #606266;
    padding-right: 8px;
  }
  &-inf {
        font-size: 14px;
    line-height: 20px;
  }
  &-cot {
    display: inline-block;
    vertical-align: middle;
    width: 80%;
    border-radius: 5px;
    padding: 5px 10px;
    color: #606266;
    font-size: 18px;
    line-height: 30px;
    &-info {
      background-color: #c0c4cc65;
    }
    &-danger {
      background-color: #f56c6c54 ;
    }
    &-suc {
      background-color: #5cbb7a5e;
    }
  }
}
</style>
