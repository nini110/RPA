<template>
  <div class="outerDiv">
    <div class="outerDiv_left">
      <el-divider>盯盘维度</el-divider>
      <el-form ref="form1" :model="form">
        <el-row>
          <el-col v-for="(item, idx) in boxDataLeft" :key="idx" :span="24">
            <el-form-item
              v-if="item.type === 'select'"
              :label="item.label"
              :prop="item.prop"
              :rules="item.rules"
            >
              <el-select
                v-model="item.model"
                :placeholder="item.placeholder"
                size="medium"
                filterable
                :disabled="item.disabled"
                @change="
                  (val) => {
                    selectChangeLeft(val, item);
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
              :label="item.label"
              :prop="item.prop"
              :rules="item.rules"
            >
              <el-input
                v-model.trim="item.model"
                size="medium"
                :show-password="item.prop === 'password'"
                :placeholder="item.placeholder"
                @input="
                  (val) => {
                    inputChangeLeft(val, item);
                  }
                "
                clearable
                :disabled="item.disabled"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="outerDiv_left_info">
        <h3 class="el-icon-info">须知</h3>
        <p>1、每天有四次刷新推广计划ID，早上8点，中午12点，下午18点，晚上24点，刷新时刻点不是正在投放状态的ID，将不纳入本轮次监控，直到下次任务刷新。</p>
        <p>2、临近设置阈值的5%内，每10分钟企业微信通知预警一次，直到通知次数耗尽。</p>
        <p>3、如果有新上的计划ID，想立即被监控，可通过修改预警信息的方式，手动刷新自己账号的监控列表。</p>
      </div>
    </div>
    <div class="outerDiv_right">
      <el-form ref="form2" :model="form" :class="{ nodata: !hasInfo }">
        <div v-if="hasInfo">
          <div v-for="(itemSum, idxSum) in boxDataRight" :key="idxSum">
            <el-descriptions
              :title="itemSum.txt"
              :column="2"
              size="medium"
              border
            >
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
        </div>
      </el-form>
      <div class="bottomBtn" style="text-align: right">
        <a class="btnnormal btnnormal_down marginL">
          <div class="el-icon-refresh btnSize" @click="resetEvent">重置</div>
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
  </div>
</template>

<script>
import {
  alarmSetting,
  alarmUser,
  alarmPlan,
  alarmDetail,
  alarmDelete,
} from "@/api/api";
import message from "@/mixin/message";
import { validPercent, validPercent2, validTrue } from "@/validator/validator";
export default {
  name: "ALarm",
  mixins: [message],
  data() {
    return {
      hasInfo: false,
      currentInfo: {}, // 当前用户 查询类目等信息集合
      form: {},
      btnTxt: "修改",
      timeout: null,
      btnState: {
        inputFlag: false,
        deleteFlag: true,
        saveFlag: true,
      },
      boxDataLeft: [
        {
          type: "select",
          model: "",
          prop: "user_name",
          label: "PIN:",
          placeholder: "请选择PIN",
          options: [],
          rules: {
            required: true,
            validator: validPercent.bind(this, "boxDataLeft", this, 0),
            trigger: "change blur",
          },
          disabled: false,
        },
        {
          type: "input",
          model: "",
          prop: "password",
          label: "密码:",
          placeholder: "请输入密码",
          rules: {
            required: true,
            validator: validPercent.bind(this, "boxDataLeft", this, 1),
            trigger: "change blur",
          },
          disabled: true,
        },
        {
          type: "select",
          model: "",
          prop: "product_line",
          label: "产品线:",
          placeholder: "请选择产品线",
          rules: {
            required: true,
            validator: validPercent.bind(this, "boxDataLeft", this, 2),
            trigger: "change blur",
          },
          options: [
            {
              name: "京东快车",
              code: "kuaiche",
            },
            {
              name: "京东展位",
              code: "zhanwei",
            },
            {
              name: "购物触点",
              code: "touchPoint",
            },
          ],
          disabled: true,
        },
        {
          type: "input",
          model: "",
          prop: "plan_id",
          label: "推广计划:",
          rules: {
            required: true,
            validator: validTrue,
            trigger: "change",
          },
          placeholder: "请输入推广计划",
          options: [
            {
              name: "example",
              code: "575097395",
            },
          ],
          disabled: true,
        },
      ],
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
    inputFlag() {
      return this.btnState.inputFlag;
    },
  },
  watch: {
    inputFlag(newval, oldval) {
      this.btnTxt = newval ? "保存" : "修改";
    },
  },
  created() {
    this.getUser();
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
          let validLeft;
          let validRight;
          vm.$refs.form1.validate((valid) => {
            validLeft = valid;
            return validLeft;
          });
          vm.$refs.form2.validate((valid) => {
            validRight = valid;
            return validRight;
          });
          if (validLeft && validLeft) {
            vm.$refs.form2.validate((valid2) => {
              if (valid2) {
                vm.openMessageBox({
                  type: "warning",
                  showClose: true,
                  tipTitle: `构建账号全量任务耗时较长, 请 [ 确定 ] 构建`,
                  confirmButtonFn: () => {
                    alarmSetting({
                      ...vm.currentInfo,
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
      }
    },
    // 删除预警
    deleteEvent() {
      const vm = this;
      vm.openMessageBox({
        type: "warning",
        showClose: true,
        tipTitle: `是否确认删除当前产品线的预警信息？`,
        confirmButtonFn: () => {
          alarmDelete(vm.currentInfo).then((res) => {
            if (res.data.code === 10000) {
              vm.$msg({ msg: "预警删除成功" });
              // 预警删除之后，数据为空,可输入，按钮状态：不可删除,可保存，
              vm.btnState = {
                inputFlag: true,
                deleteFlag: true,
                saveFlag: false,
              };
              vm.clearRight();
            } else {
              vm.$msg({ type: "error", msg: res.data.msg });
            }
          });
        },
      });
    },
    // 获取所有PIN
    getUser() {
      const vm = this;
      alarmUser().then((res) => {
        if (res.data.code === 10000) {
          res.data.data.forEach((item, idx) => {
            vm.boxDataLeft[0].options.push({
              name: item,
              code: item,
            });
          });
        } else {
          vm.$msg({ type: "error", msg: res.data.msg });
        }
      });
    },
    // 获取推广计划
    getPlan() {
      const vm = this;
      let data = {
        user_name: vm.boxData[0].children[0].model,
        password: vm.boxData[0].children[1].model,
        product_line: vm.boxData[0].children[2].model,
      };
      // alarmPlan().then(res => {

      // })
    },

    // 左侧
    selectChangeLeft(val, item) {
      const vm = this;
      if (item.prop === "user_name") {
        // pin改变的时候，重置所有信息
        vm.hasInfo = false;
        vm.clearRight();
        vm.btnState = {
          inputFlag: false,
          deleteFlag: true,
          saveFlag: true,
        };
        vm.currentInfo = {};
        for (let i of vm.boxDataLeft) {
          if (!val) {
            if (i.prop === "password" || i.prop === "product_line") {
              i.disabled = true;
              i.model = "";
            }
          } else {
            if (i.prop === "password") {
              i.disabled = false;
            }
          }
        }
      }
      if (item.prop === "product_line") {
        if (val) {
          for (let i of vm.boxDataLeft) {
            vm.$set(vm.currentInfo, i.prop, i.model);
          }
          vm.clearRight();
          vm.getInfo(vm.currentInfo);
        }
      }
    },
    inputChangeLeft(val, item) {
      const vm = this;
      if (item.prop === "password") {
        for (let i of vm.boxDataLeft) {
          if (i.prop === "product_line") {
            i.disabled = !val;
            i.model = "";
          }
        }
      }
    },
    //获取详情
    getInfo(data) {
      const vm = this;
      alarmDetail(data).then((res) => {
        if (res.data.code === 10000) {
          vm.hasInfo = true;
          // 有详情，可以修改删除
          for (let i of vm.boxDataRight) {
            for (let j of i.children) {
              if (j.prop === "qywx_id") {
                j.model = res.data.data.qywx_id;
              }
              if (j.prop === "target_percentage") {
                j.model = res.data.data.target_percentage * 100;
              }
              if (j.prop === "inform_times") {
                j.model = res.data.data.inform_times;
              }
            }
          }
          vm.btnState = {
            inputFlag: false,
            deleteFlag: false,
            saveFlag: false,
          };
        } else if (res.data.code === 10002) {
          vm.hasInfo = true;
          vm.$msg({ type: "warning", msg: "暂无账户预警信息" });
          vm.btnState = {
            inputFlag: true,
            deleteFlag: true,
            saveFlag: false,
          };
        } else {
          vm.hasInfo = false;
          vm.$msg({ type: "error", msg: res.data.msg });
          vm.btnState = {
            inputFlag: false,
            deleteFlag: true,
            saveFlag: true,
          };
        }
      });
    },
    selectChange(val, idxSum, idx, itemSum, item) {
      const vm = this;
      // if (item.prop === "product_line") {
      //   if (val) {
      //     let data = {};
      //     for (let i of vm.boxData) {
      //       for (let j of i.children) {
      //         vm.$set(data, j.prop, j.model);
      //       }
      //     }
      //     alarmDetail(data).then((res) => {
      //       if (res.data.code === 10000) {
      //         for (let i of vm.boxData) {
      //           for (let j of i.children) {
      //             if (j.prop === "qywx_id") {
      //               j.model = res.data.data.qywx_id;
      //             }
      //             if (j.prop === "target_percentage") {
      //               j.model = res.data.data.target_percentage * 100;
      //             }
      //           }
      //         }
      //         vm.detailFlag = true;
      //       } else {
      //         vm.$msg({ type: "error", msg: res.data.msg });
      //       }
      //     });
      //   }
      // }
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
    // 清空左侧所有信息
    clearLeft() {
      for (let i of this.boxDataLeft) {
        this.$set(i, "model", "");
        for (let i of this.boxDataLeft) {
          if (i.prop === "password" || i.prop === "product_line") {
            i.disabled = true;
            i.model = "";
          }
        }
      }
    },
    resetEvent() {
      const vm = this;
      vm.clearLeft();
      vm.clearRight();
      vm.currentInfo = {};
      vm.hasInfo = false;
      vm.btnState = {
        inputFlag: false,
        deleteFlag: true,
        saveFlag: true,
      };
      // vm.$refs.form.resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/views/index";
</style>
