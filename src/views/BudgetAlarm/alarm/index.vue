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
                :placeholder="item.placeholder"
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
                <div v-if="inputFlag">
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
        <!-- <el-button v-waves class="el-icon-refresh marginR" type="primary" plain @click="resetEvent"></el-button> -->
        <el-button
          v-waves
          class="el-icon-delete"
          type="primary"
          :disabled="deleteFlag"
          @click="deleteEvent"
          >删除</el-button
        >
        <el-button
          v-waves
          class="el-icon-edit"
          type="primary"
          :disabled="btnDisabled"
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
      currentInfo: {}, // 当前用户 查询类目等信息
      btnTxt: "修改",
      form: {},
      deleteFlag: true,
      btnDisabled: true,
      inputFlag: false,
      boxDataLeft: [],
      boxDataRight: [],
    };
  },
  watch: {
    inputFlag(newval, oldval) {
      const vm = this;
      if (newval) {
        vm.btnTxt = "保存";
      } else {
        vm.btnTxt = "修改";
      }
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
        vm.inputFlag = true;
      } else {
        let dataLeft = {};
        for (let i of vm.boxDataLeft) {
          vm.$set(dataLeft, i.prop, i.model);
        }
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
                  ...dataLeft,
                  ...dataRight,
                }).then((res) => {
                  if (res.data.code === 10000) {
                    vm.$msg({ msg: "预警生成成功" });
                    vm.getInfo(vm.currentInfo);
                    vm.inputFlag = false;
                    vm.deleteFlag = false;
                    vm.btnDisabled = false;
                    // vm.resetEvent();
                  } else {
                    vm.$msg({ type: "error", msg: res.data.msg });
                  }
                });
              },
            });
          }
        });
      }
    },
    deleteEvent() {
      const vm = this;
      let data = {};
      for (let i of vm.boxDataLeft) {
        vm.$set(data, i.prop, i.model);
      }
      vm.openMessageBox({
        type: "warning",
        showClose: true,
        tipTitle: `是否确认删除当前产品线的预警信息`,
        confirmButtonFn: () => {
          alarmDelete(data).then((res) => {
            if (res.data.code === 10000) {
              vm.$msg({ msg: "预警删除成功" });
              vm.deleteFlag = true;
              vm.inputFlag = true;
              for (let i of vm.boxDataRight) {
                for (let j of i.children) {
                  vm.$set(j, "model", "");
                }
              }
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
    selectChangeLeft(val, item) {
      const vm = this;
      if (item.prop === "user_name") {
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
          vm.getInfo(vm.currentInfo);
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
          vm.btnDisabled = false;
          vm.deleteFlag = false;
          vm.inputFlag = false;
        } else if (res.data.code === 10002) {
          // 没有配置过，需要去配置
          vm.inputFlag = true;
        } else {
          vm.$msg({ type: "error", msg: res.data.msg });
          // vm.btnDisabled = true;
          // vm.deleteFlag = true;
          // vm.inputFlag = false;
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
    resetEvent() {
      const vm = this;
      for (let i of vm.boxDataLeft) {
        vm.$set(i, "model", "");
      }
      for (let i of vm.boxDataRight) {
        for (let j of i.children) {
          vm.$set(j, "model", "");
        }
      }
      vm.currentInfo = {};
      vm.deleteFlag = true;
      vm.btnDisabled = true;
      vm.inputFlag = false;
      // vm.$refs.form.resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/views/index";
</style>
