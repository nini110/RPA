<template>
  <div :class="{ nodata: !hasInfo }" style="height: 100%">
    <el-form v-if="hasInfo" ref="form2" :model="form">
      <div v-for="(itemSum, idxSum) in boxDataRight" :key="idxSum">
        <el-descriptions :title="itemSum.txt" :column="4" size="medium" :colon="false" border>
          <el-descriptions-item v-for="(item, idx) in itemSum.children" :key="idx" :span="item.span || 2">
            <template slot="label">
              <i :class="item.icon"></i>
              {{ item.label }}
            </template>
            <div v-if="btnState.inputFlag">
              <el-form-item v-if="item.type === 'select'" :prop="item.prop" :rules="item.rules">
                <el-select v-model="item.model" :placeholder="item.placeholder" size="medium" :disabled="item.disabled">
                  <el-option v-for="val in item.options" :key="val.code" :label="val.name" :value="val.code">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="item.type === 'input'" :prop="item.prop" :rules="item.rules">
                <el-input v-model.trim="item.model" :placeholder="item.placeholder" clearable
                  :disabled="item.disabled"></el-input>
              </el-form-item>
              <el-form-item v-if="item.type === 'radio'" :prop="item.prop" :rules="item.rules">
                <el-radio-group v-model="warning_type">
                  <el-radio v-for="val in item.options" :label="val.code">{{ val.name }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="item.type === 'radioBD'" :prop="item.prop" :rules="item.rules">
                <el-radio-group v-model="item.model">
                  <el-radio v-for="val in item.options" :label="val.code" :disabled="val.disabled">{{ val.name
                  }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="item.type === 'checkbox'" :prop="item.prop" :rules="item.rules">
                <vxe-pulldown ref="xDown2">
                  <template #default>
                    <vxe-input v-model="ckeckedPlanCn" :placeholder="item.placeholder" :disabled="item.disabled"
                      @focus="focusEvent"></vxe-input>
                  </template>
                  <template #dropdown>
                    <div class="my-dropdown1">
                      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll"
                        @change="handleCheckAllChange">全选</el-checkbox>
                      <div style="margin: 15px 0;"></div>
                      <el-checkbox-group v-model="ckeckedPlan" @change="handleCheckedCitiesChange">
                        <el-checkbox v-for="selOp in planOption" :label="selOp" :key="selOp.code">{{ selOp.name
                        }}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </template>
                </vxe-pulldown>
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
                <span v-else-if="item.prop === 'warning_type'">{{
                  warning_typeCn
                }}</span>
                <span v-else-if="item.prop === 'campaignIds'">{{
                  ckeckedPlanCn || "自动添加当前在投放计划，定时删除未投放计划"
                }}</span>
                <span v-else-if="item.prop === 'handle_type'">{{
                  item.modelCn
                }}</span>
                <span v-else>{{ item.model || "暂无数据" }}</span>
              </el-form-item>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-form>
    <div class="bottomBtn" style="text-align: right">
      <a v-if="ifCancel" class="btnnormal btnnormal_down marginL" @click="backEvent">
        <div class="el-icon-refresh btnSize">取消</div>
      </a>
      <a v-else class="btnnormal btnnormal_down marginL" @click="resetEvent">
        <div class="el-icon-refresh btnSize">重置</div>
      </a>
      <el-button v-waves class="el-icon-delete marginL" type="primary" :disabled="btnState.deleteFlag"
        @click="deleteEvent">删除</el-button>
      <el-button v-waves class="el-icon-edit marginL" type="primary" :disabled="btnState.saveFlag" @click="editEvent">{{
        btnTxt }}</el-button>
    </div>
  </div>
</template>

<script>
import {
  alarmSetting,
  alarmDelete
} from "@/api/api";
import message from "@/mixin/message";
import {
  validPercent,
  validPercent2,
  validTrue
} from "@/validator/validator";
import {
  mapGetters
} from "vuex";
export default {
  name: "Right",
  mixins: [message],
  data () {
    const vm = this
    let validPlan = (ruel, value, callback) => {
      if (vm.warning_type === 1 && vm.ckeckedPlan.length === 0) {
        callback(new Error('请选择推广计划'))
      } else {
        callback()
      }
    }
    return {
      ifCancel: false,
      isIndeterminate: false,
      checkAll: false,
      ckeckedPlan: [],
      ckeckedPlanCn: '',
      ckeckedPlanId: [],
      warning_type: 0,
      warning_typeCn: '',
      form: {},
      btnTxt: "",
      boxDataRight: [{
        txt: "触发条件",
        children: [{
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
        children: [{
          model: 0,
          type: "radio",
          prop: "warning_type",
          icon: "iconfont icon-yujingleixing",
          label: "预警类型:",
          placeholder: "请选择预警类型",
          options: [{
            code: 0,
            name: '智能预警'
          },
          {
            code: 1,
            name: '定向预警'
          }
          ],
          rules: {
            required: true,
            validator: validTrue,
            trigger: "change",
          },
          disabled: false,
        },
        {
          type: "input",
          model: "",
          prop: "inform_times",
          icon: "iconfont icon-yujingcishu",
          label: "预警次数:",
          placeholder: "请输入预警次数",
          rules: {
            required: true,
            validator: validPercent2.bind(this, "boxDataRight", this, 1, 3),
            trigger: "blur",
          },
          disabled: false,
        },
        {
          span: 4,
          type: "checkbox",
          prop: "campaignIds",
          icon: "iconfont icon-tuiguangjihua",
          label: "推广计划:",
          placeholder: "请选择推广计划",
          rules: {
            required: true,
            validator: validPlan,
            trigger: "change",
          },
        },
        {
          span: 4,
          model: 1,
          type: "radioBD",
          prop: "handle_type",
          icon: "iconfont icon-caozuoleixing",
          label: "操作类型:",
          placeholder: "请选择操作类型",
          options: [{
            code: 1,
            name: '企业微信发送通知',
            disabled: false
          },
          {
            code: 2,
            name: '企业微信发送通知 + 22点后停投',
            disabled: false
          }
          ],
          rules: {
            required: true,
            validator: validTrue,
            trigger: "change",
          },
          disabled: false,
        },
        // {
        //   type: "select",
        //   model: 1,
        //   modelCn: '',
        //   prop: "handle_type",
        //   icon: "iconfont icon-caozuoleixing",
        //   label: "操作类型:",
        //   placeholder: "请选择操作类型",
        //   rules: {
        //     required: true,
        //     validator: validTrue,
        //     trigger: "change",
        //   },
        //   options: [{
        //     name: "企业微信发送通知",
        //     code: 1,
        //   }, {
        //     name: "企业微信发送通知 + 22点后停投",
        //     code: 2,
        //   },],
        //   disabled: false,
        // },

        {
          span: 4,
          type: "input",
          model: "",
          prop: "qywx_id",
          icon: "iconfont icon-weixin",
          label: "企业微信ID:",
          placeholder: "请输入企业微信ID ( 以 | 分割 )",
          rules: {
            required: true,
            validator: validPercent2.bind(this, "boxDataRight", this, 1, 4),
            trigger: "blur",
          },
          disabled: false,
        },
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
      "planOption"
    ]),
  },
  watch: {
    currentIfo: {
      handler (newval, oldval) {
        this.boxDataRight[1].children[3].options[1].disabled = newval && newval.product_line === 'zhitou'
      },
      immediate: false,
      deep: true
    },
    warning_type: {
      handler (newval, oldval) {
        this.warning_typeCn = newval === 1 ? '定向预警' : '智能预警'
        this.boxDataRight[1].children[2].disabled = newval === 0
        if (!newval) this.ckeckedPlan = []
      },
      immediate: true,
      deep: true,
    },
    ckeckedPlan: {
      handler (newval, oldval) {
        const vm = this
        let resCode = newval.map((val, idx) => {
          return val.code
        })
        let resName = newval.map((val, idx) => {
          return val.name
        })
        vm.ckeckedPlanId = resCode
        vm.ckeckedPlanCn = resName.join(' | ')
        vm.handleCheckedCitiesChange(newval)
      },
      immediate: false,
      deep: true,
    },
    btnState: {
      handler (newval, oldval) {
        this.btnTxt = newval.inputFlag ? "保存" : "修改";
      },
      immediate: true,
      deep: true,
    },
    // 为true需要清空所有校验
    checkRight (newval, oldval) {
      const vm = this;
      if (vm.hasInfo) {
        vm.$refs.form2.resetFields();
      }
    },
    // 查询结果赋值
    serchRes (newval, oldval) {
      const vm = this;
      if (newval && newval.code === 10000) {
        // 有详情，可以修改删除
        vm.warning_type = newval.data.warning_type;
        // 推广计划
        if (newval.data.warning_type === 1) {
          let arr = []
          for (let i of JSON.parse(newval.data.code)) {
            vm.planOption.forEach((val, idx) => {
              if (val.code === i) {
                arr.push(val)
              }
            })
          }
          vm.ckeckedPlan = arr
        }
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
            if (j.prop === "handle_type") {
              j.model = newval.data.handle_type;
              j.modelCn = newval.data.handle_type === 1 ? '企业微信发送通知' : '企业微信发送通知 + 22点后停投';
            }

          }
        }
      } else {
        vm.ifCancel = false
        vm.warning_type = 0
        for (let i of vm.boxDataRight) {
          for (let j of i.children) {
            if (j.prop === "handle_type") {
              j.model = 1;
              j.modelCn = '企业微信发送通知';
              break
            }
          }
        }
      }
    },
  },
  methods: {
    editEvent () {
      const vm = this;
      if (vm.btnTxt === "修改") {
        vm.btnState.inputFlag = true;
        vm.ifCancel = true
      } else {
        if (vm.btnState.inputFlag) {
          let dataRight = {};
          for (let i of vm.boxDataRight) {
            for (let j of i.children) {
              if (j.prop === 'campaignIds') {
                vm.$set(dataRight, 'campaignIds', vm.ckeckedPlanId);
                vm.$set(dataRight, 'campaignNames', vm.ckeckedPlanCn);
              } else if (j.prop === 'warning_type') {
                vm.$set(dataRight, 'warning_type', vm.warning_type);
              } else {
                vm.$set(
                  dataRight,
                  j.prop,
                  j.prop === "target_percentage" ? j.model / 100 : j.model
                );
              }
            }
          }
          // 校验左侧信息
          if (!vm.currentIfo) {
            // 说明没有做左侧信息
            vm.$msg({
              type: "error",
              msg: "请先选择查询信息"
            });
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
                      vm.$msg({
                        msg: res.data.msg
                      });
                      vm.resetEvent();
                    } else {
                      vm.$msg({
                        type: "error",
                        msg: res.data.msg
                      });
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
    deleteEvent () {
      const vm = this;
      vm.openMessageBox({
        type: "warning",
        showClose: true,
        showCancelButton: true,
        tipTitle: `是否确认删除当前产品线的预警信息？`,
        confirmButtonFn: () => {
          alarmDelete(vm.currentIfo).then((res) => {
            if (res.data.code === 10000) {
              vm.ifCancel = false
              // 预警删除之后，数据为空,可输入，按钮状态：不可删除,可保存，
              vm.$store.commit("pageData/UPDATE_BTNSTATE", {
                //按钮
                inputFlag: true,
                deleteFlag: true,
                saveFlag: false,
              });
              vm.warning_type = 0
              vm.$msg({
                msg: "预警删除成功"
              });
            } else {
              vm.$msg({
                type: "error",
                msg: res.data.msg
              });
            }
          });
        },
      });
    },
    backEvent () {
      const vm = this
      vm.ifCancel = false
      vm.btnState.inputFlag = false;
      let newval = vm.serchRes
      if (newval && newval.code === 10000) {
        // 有详情，可以修改删除
        vm.warning_type = newval.data.warning_type;
        // 推广计划
        if (newval.data.warning_type === 1) {
          let arr = []
          for (let i of JSON.parse(newval.data.code)) {
            vm.planOption.forEach((val, idx) => {
              if (val.code === i) {
                arr.push(val)
              }
            })
          }
          vm.ckeckedPlan = arr
        }
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
            if (j.prop === "handle_type") {
              j.model = newval.data.handle_type
              j.modelCn = newval.data.handle_type === 1 ? '企业微信发送通知' : '企业微信发送通知 + 22点后停投';
            }
          }
        }
      }
    },
    handleCheckAllChange (val) {
      this.ckeckedPlan = val ? this.planOption : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange (value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.planOption.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.planOption.length;
    },
    focusEvent () {
      this.$refs.xDown2[0].showPanel()
    },
    // 重置
    resetEvent () {
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
      vm.warning_type = 0
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.el-descriptions-row {
  i {
    font-weight: bold;

    &:before {
      font-size: 16px;
      margin-right: 4px;
    }

    &.iconfont {
      font-size: 12px;
    }
  }


}
</style>
