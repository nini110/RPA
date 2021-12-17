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
    </div>
    <div class="outerDiv_right">
      <el-form ref="form" :model="form">
        <div v-for="(itemSum, idxSum) in boxDataRight" :key="idxSum">
          <el-divider>{{ itemSum.txt }}</el-divider>
          <el-card>
            <el-row>
              <el-col
                v-for="(item, idx) in itemSum.children"
                :key="idx"
                :span="12"
              >
                <div v-if="btnState.inputFlag">
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
                    :label="item.label"
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
                  <el-form-item
                    :label="item.label"
                    :prop="item.prop"
                    class="detailSpan"
                  >
                    <span v-if="item.prop === 'target_percentage'">{{
                      item.model ? item.model + "%" : "暂无数据"
                    }}</span>
                    <span v-else-if="item.prop === 'inform_times'">{{
                      item.model ? item.model + "次" : "暂无数据"
                    }}</span>
                    <span v-else>{{ item.model || "暂无数据" }}</span>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </el-form>
      <div style="text-align: right">
        <a class="btnnormal btnnormal_down marginR">
          <div class="el-icon-refresh btnSize" @click="resetEvent">重置</div>
        </a>
        <el-button
          v-waves
          class="el-icon-delete"
          type="primary"
          :disabled="btnState.deleteFlag"
          @click="deleteEvent"
          >删除</el-button
        >
        <el-button
          v-waves
          class="el-icon-edit"
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
// import { validPin, validPercent } from "@/validator/validator";
import opt from "../data.js";
export default {
  name: "ALarm",
  mixins: [message],
  data() {
    return {
      currentInfo: {}, // 当前用户 查询类目等信息集合
      form: {},
      btnTxt: "修改",
      btnState: {
        inputFlag: false,
        deleteFlag: true,
        saveFlag: true,
      },
      boxDataLeft: [],
      boxDataRight: [],
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
    this.boxDataLeft = opt.alarmDataLeft;
    this.boxDataRight = opt.alarmDataRight;
    this.getUser();
  },
  methods: {
    editEvent() {
      const vm = this;
      if (vm.btnTxt === "修改") {
        vm.btnState.inputFlag = true
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
          vm.$refs.form1.validate((valid) => {
            if (valid) {
              vm.openMessageBox({
                type: "warning",
                showClose: true,
                tipTitle: `构建账号全量任务耗时较长(约1分钟),请 [ 确定 ] 构建`,
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
            let target = vm.boxDataLeft[0].options;
            target.push({
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
        vm.clearRight();
        vm.btnState = {
          inputFlag: false,
          deleteFlag: true,
          saveFlag: true,
        };
        vm.currentInfo = {};
        for (let i of vm.boxDataLeft) {
          if (i.prop === "password" || i.prop === "product_line") {
            i.disabled = !val;
            i.model = "";
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
            if (!val) {
              i.model = "";
            }
          }
        }
      }
    },
    //获取详情
    getInfo(data) {
      const vm = this;
      alarmDetail(data).then((res) => {
        if (res.data.code === 10000) {
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
          vm.$msg({ type: "warning", msg: "暂无账户预警信息" });
          vm.btnState = {
            inputFlag: true,
            deleteFlag: true,
            saveFlag: false,
          };
        } else {
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
          this.$set(j, "model", "");
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
