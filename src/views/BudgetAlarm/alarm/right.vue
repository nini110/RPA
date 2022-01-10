<template>
  <div :class="{ nodata: !hasInfo }" style="height: 100%">
    <el-form v-if="hasInfo" ref="form2" :model="form">
      <div v-for="(itemSum, idxSum) in boxDataRight" :key="idxSum">
        <el-descriptions :title="itemSum.txt" :column="2" size="medium" border>
          <el-descriptions-item
            v-for="(item, idx) in itemSum.children"
            :key="idx"
          >
            <template slot="label">
              <i :class="item.icon"></i>
              {{ item.label }}
            </template>
            <div v-if="btnState.inputFlag">
              <el-form-item
                v-if="item.type === 'select'"
                :prop="item.prop"
                :rules="item.rules"
              >
                <el-select
                  v-model="item.model"
                  :placeholder="item.placeholder"
                  size="medium"
                  :disabled="item.disabled"
                  @change="
                    (val) => {
                      selectChange(val, idxSum, idx, itemSum, item);
                    }
                  "
                  clearable
                >
                  <el-option
                    v-for="val in item.options"
                    :key="val.code"
                    :label="val.name"
                    :value="val.code"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                v-if="item.type === 'input'"
                :prop="item.prop"
                :rules="item.rules"
              >
                <el-input
                  v-model.trim="item.model"
                  size="medium"
                  :placeholder="item.placeholder"
                  clearable
                  :disabled="item.disabled"
                ></el-input>
              </el-form-item>
            </div>
            <div v-else>
              <el-form-item :prop="item.prop" class="detailSpan">
                <span v-if="item.prop === 'target_percentage'">{{
                  item.model ? item.model + "%" : "暂无数据"
                }}</span>
                <span v-else-if="item.prop === 'inform_times'">{{
                  item.model ? item.model + "次" : "暂无数据"
                }}</span>
                <span v-else>{{ item.model || "暂无数据" }}</span>
              </el-form-item>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-form>
    <div class="bottomBtn" style="text-align: right">
      <a class="btnnormal btnnormal_down marginL" @click="resetEvent">
        <div class="el-icon-refresh btnSize">重置</div>
      </a>
      <el-button
        v-waves
        class="el-icon-delete marginL"
        type="primary"
        :disabled="btnState.deleteFlag"
        @click="deleteEvent"
        >删除</el-button
      >
      <el-button
        v-waves
        class="el-icon-edit marginL"
        type="primary"
        :disabled="btnState.saveFlag"
        @click="editEvent"
        >{{ btnTxt }}</el-button
      >
    </div>
  </div>
</template>
<script>
import { alarmSetting, alarmDelete } from "@/api/api";
import message from "@/mixin/message";
import { validPercent, validPercent2, validTrue } from "@/validator/validator";
import { mapGetters } from "vuex";
export default {
  name: "Right",
  mixins: [message],
  data() {
    return {
      form: {},
      btnTxt: "",
      boxDataRight: [
        {
          txt: "触发条件",
          children: [
            {
              type: "select",
              model: "",
              prop: "data",
              label: "时间:",
              icon: "el-icon-date",
              placeholder: "请选择时间",
              rules: {
                required: true,
                validator: validTrue,
                trigger: "change",
              },
              options: [],
              disabled: true,
            },
            {
              type: "select",
              model: "",
              prop: "zhibiaoTYpe",
              icon: "iconfont icon-zhibiao",
              label: "指标类型:",
              placeholder: "请输入指标类型",
              rules: {
                required: true,
                validator: validTrue,
                trigger: "change",
              },
              disabled: true,
            },
            {
              type: "select",
              model: "",
              prop: "rule",
              icon: "el-icon-s-operation",
              label: "规则:",
              placeholder: "请选择规则",
              rules: {
                required: true,
                validator: validTrue,
                trigger: "change",
              },
              options: [],
              disabled: true,
            },
            {
              type: "select",
              model: "",
              prop: "duibizhibiao",
              icon: "iconfont icon-duibi",
              label: "对比指标:",
              placeholder: "请选择对比指标",
              rules: {
                required: true,
                validator: validTrue,
                trigger: "change",
              },
              options: [],
              disabled: true,
            },
            {
              type: "input",
              model: "",
              prop: "target_percentage",
              icon: "el-icon-stopwatch",
              label: "阈值:",
              placeholder: "请输入阈值(0-100的整数)",
              rules: {
                required: true,
                validator: validPercent2.bind(this, "boxDataRight", this, 0, 4),
                trigger: "blur",
              },
              disabled: false,
            },
          ],
        },
        {
          txt: "执行操作",
          children: [
            {
              type: "select",
              model: "企业微信发送通知",
              prop: "optionType",
              icon: "el-icon-setting",
              label: "操作类型:",
              placeholder: "请选择操作类型",
              rules: {
                required: true,
                validator: validTrue,
                trigger: "change",
              },
              options: [
                {
                  name: "企业微信发送通知",
                  code: "1",
                },
              ],
              disabled: true,
            },
            {
              type: "input",
              model: "",
              prop: "inform_times",
              icon: "iconfont icon-yujing",
              label: "预警通知次数:",
              placeholder: "请输入预警通知次数",
              rules: {
                required: true,
                validator: validPercent2.bind(this, "boxDataRight", this, 1, 1),
                trigger: "blur",
              },
              disabled: false,
            },
            {
              type: "input",
              model: "",
              prop: "qywx_id",
              icon: "iconfont icon-weixin1",
              label: "企业微信ID:",
              placeholder: "请输入企业微信ID ( 以 | 分割 )",
              rules: {
                required: true,
                validator: validPercent2.bind(this, "boxDataRight", this, 1, 2),
                trigger: "blur",
              },
              disabled: false,
            },

            // {
            // 	type: 'select',
            // 	model: '',
            // 	label: '调整类型',
            // 	placeholder: '请选择规则',
            // 	options: []
            // },
            // {
            // 	type: 'input',
            // 	model: '',
            // 	label: '数值',
            // 	placeholder: '请输入数值',
            // },

            // {
            // 	type: 'input',
            // 	model: '',
            // 	label: '单位',
            // 	placeholder: '请输入数值',
            // },
          ],
        },
      ],
    };
  },
  computed: {
    ...mapGetters([
      "currentIfo",
      "btnState",
      "serchRes",
      "hasInfo",
      "checkLeft",
      "checkRight",
    ]),
  },
  watch: {
    btnState: {
      handler(newval, oldval) {
        this.btnTxt = newval.inputFlag ? "保存" : "修改";
      },
      immediate: true,
      deep: true,
    },
    // 为true需要清空所有校验
    checkRight(newval, oldval) {
      const vm = this;
      if (vm.hasInfo) {
        vm.$refs.form2.resetFields();
      }
    },
    // 查询结果赋值
    serchRes(newval, oldval) {
      const vm = this;
      if (newval && newval.code === 10000) {
        // 有详情，可以修改删除
        for (let i of vm.boxDataRight) {
          for (let j of i.children) {
            if (j.prop === "qywx_id") {
              j.model = newval.data.qywx_id;
            }
            if (j.prop === "target_percentage") {
              j.model = newval.data.target_percentage * 100;
            }
            if (j.prop === "inform_times") {
              j.model = newval.data.inform_times;
            }
          }
        }
      }
    },
    currentIfo(newval, oldval) {},
  },
  methods: {
    editEvent() {
      const vm = this;
      if (vm.btnTxt === "修改") {
        vm.btnState.inputFlag = true;
      } else {
        if (vm.btnState.inputFlag) {
          let dataRight = {};
          for (let i of vm.boxDataRight) {
            for (let j of i.children) {
              vm.$set(
                dataRight,
                j.prop,
                j.prop === "target_percentage" ? j.model / 100 : j.model
              );
            }
          }
          // 校验左侧信息
          if (!vm.currentIfo) {
            // 说明没有做左侧信息
            vm.$msg({ type: "error", msg: "请先选择查询信息" });
            return false;
          }
          // 校验右侧信息
          vm.$refs.form2.validate((valid2) => {
            if (valid2) {
              vm.openMessageBox({
                type: "warning",
                showClose: true,
                showCancelButton: true,
                tipTitle: `构建账号全量任务耗时较长, 请 [ 确定 ] 构建`,
                confirmButtonFn: () => {
                  alarmSetting({
                    ...vm.currentIfo,
                    ...dataRight,
                  }).then((res) => {
                    if (res.data.code === 10000) {
                      vm.$msg({ msg: res.data.msg });
                      vm.resetEvent();
                    } else {
                      vm.$msg({ type: "error", msg: res.data.msg });
                    }
                  });
                },
              });
            }
          });
        }
      }
    },
    // 删除预警
    deleteEvent() {
      const vm = this;
      vm.openMessageBox({
        type: "warning",
        showClose: true,
        showCancelButton: true,
        tipTitle: `是否确认删除当前产品线的预警信息？`,
        confirmButtonFn: () => {
          alarmDelete(vm.currentIfo).then((res) => {
            if (res.data.code === 10000) {
              // 预警删除之后，数据为空,可输入，按钮状态：不可删除,可保存，
              vm.$store.commit("pageData/UPDATE_BTNSTATE", {
                //按钮
                inputFlag: true,
                deleteFlag: true,
                saveFlag: false,
              });
              vm.clearRight();
              vm.$msg({ msg: "预警删除成功" });
            } else {
              vm.$msg({ type: "error", msg: res.data.msg });
            }
          });
        },
      });
    },
    // 清空右侧所有信息
    clearRight() {
      for (let i of this.boxDataRight) {
        for (let j of i.children) {
          this.$set(
            j,
            "model",
            j.prop === "optionType" ? "企业微信发送通知" : ""
          );
        }
      }
    },
    // 重置
    resetEvent() {
      const vm = this;
      vm.$store.commit("pageData/UPDATE_HASINFO", false); //无数据
      vm.$store.commit("pageData/UPDATE_BTNSTATE", {
        //按钮
        inputFlag: false,
        deleteFlag: true,
        saveFlag: true,
      });
      vm.$store.commit("pageData/UPDATE_CURRENTIFO", null); //查询项
      vm.$store.commit("pageData/UPDATE_SEARCHRES", null); //结果
      vm.$store.commit("pageData/UPDATE_ClRLEFT", true); // 清空左侧输入框
      vm.clearRight();
    },
  },
};
</script>
