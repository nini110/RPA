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
      <el-table
        :data="errorLogs"
        :height="600"
        class="detail_body"
        :highlight-current-row="true"
        :header-cell-style="{ background: '#eef0f1', color: '#606266' }"
      >
        <el-table-column label="Message">
          <template slot-scope="{ row }">
            <div>
              <span class="message-title">信息:</span>
              <el-tag type="danger">
                {{ row.err.message }}
              </el-tag>
            </div>
            <br />
            <div>
              <span class="message-title">钩子: </span>
              <el-tag type="info">
                {{ row.vm.$vnode.tag }} error in {{ row.info }}
              </el-tag>
            </div>
            <br />
            <div>
              <span class="message-title">页面: </span>
              <el-tag>
                {{ row.url }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Stack">
          <template slot-scope="{ row }">
            <p class="message-title" v-html="row.err.stack"></p>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button
          v-waves
          type="primary"
          @click="clearAll"
          >确定</el-button
        >
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
    font-size: 12px;
    color: #606266;
    padding-right: 8px;
  }
}
</style>
