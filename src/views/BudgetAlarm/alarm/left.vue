<template>
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
</template>
<script>
import { validPercent, validPercent2, validTrue } from "@/validator/validator";
import message from "@/mixin/message";
import { alarmPlan, alarmDetail } from "@/api/api";
import { mapGetters } from "vuex";
export default {
  name: "Left",
  mixins: [message],
  data() {
    return {
      form: {},
      currentInfo: {}, // 当前用户 查询类目等信息集合
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
              name: "京东直投",
              code: "zhitou",
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
        {
          type: "upload",
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
    };
  },
  computed: {
    ...mapGetters(["clearLeftTag", "pinList", "btnState", "checkRight"]),
  },
  watch: {
    pinList: {
      handler(newval, oldval) {
        this.boxDataLeft[0].options = JSON.parse(JSON.stringify(newval));
      },
      immediate: true,
      deep: true,
    },
    clearLeftTag(newval, oldval) {
      // 清空左侧所有信息
      if (newval) {
        for (let i of this.boxDataLeft) {
          this.$set(i, "model", "");
          for (let i of this.boxDataLeft) {
            if (i.prop === "password" || i.prop === "product_line") {
              i.disabled = true;
              i.model = "";
            }
          }
        }
        // 状态初始化
        this.$store.commit("pageData/UPDATE_ClRLEFT", false);
      }
    },
  },
  created() {
    this.$store.commit("pageData/UPDATE_ClRLEFT", false); // 清空左侧输入框
  },
  methods: {
    // 左侧
    selectChangeLeft(val, item) {
      const vm = this;
      vm.$store.commit("pageData/UPDATE_CHECKRIGHT", true);
      vm.$store.commit("pageData/UPDATE_HASINFO", false);
      vm.$store.commit("pageData/UPDATE_CURRENTIFO", null);
      if (item.prop === "user_name") {
        // pin改变的时候，重置所有信息
        for (let i of vm.boxDataLeft) {
          if (!val) {
            if (i.prop === "password" || i.prop === "product_line") {
              i.disabled = true;
              i.model = "";
            }
          } else {
            if (i.prop === "password") {
              i.disabled = false;
              i.model = "";
            }
            if (i.prop === "product_line") {
              i.disabled = true;
              i.model = "";
            }
          }
        }
        vm.$store.commit("pageData/UPDATE_BTNSTATE", {
          inputFlag: false,
          deleteFlag: true,
          saveFlag: true,
        });
      }
      // 选择产品线之后查询数据，确定当前currentInfo
      if (item.prop === "product_line") {
        if (val) {
          for (let i of vm.boxDataLeft) {
            vm.$set(vm.currentInfo, i.prop, i.model);
          }
          vm.getInfo(vm.currentInfo);
          vm.$store.commit("pageData/UPDATE_CURRENTIFO", vm.currentInfo); //无数据
        }
      }
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
    inputChangeLeft(val, item) {
      const vm = this;
      if (item.prop === "password") {
        vm.$store.commit("pageData/UPDATE_CURRENTIFO", null);
        vm.$store.commit("pageData/UPDATE_HASINFO", false);
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
        let midHasinfo;
        let midBtnstate;
        if (res.data.code === 10000) {
          midHasinfo = true;
          midBtnstate = {
            inputFlag: false,
            deleteFlag: false,
            saveFlag: false,
          };
        } else if (res.data.code === 10002) {
          vm.$msg({ type: "warning", msg: "暂无账户预警信息" });
          midHasinfo = true;
          midBtnstate = {
            inputFlag: true,
            deleteFlag: true,
            saveFlag: false,
          };
        } else {
          vm.$msg({ type: "error", msg: res.data.msg });
          midHasinfo = false;
          midBtnstate = {
            inputFlag: false,
            deleteFlag: true,
            saveFlag: true,
          };
        }
        vm.$store.commit("pageData/UPDATE_HASINFO", midHasinfo);
        vm.$store.commit("pageData/UPDATE_BTNSTATE", midBtnstate);
        vm.$store.commit("pageData/UPDATE_SEARCHRES", res.data);
      });
    },
  },
};
</script>
