<template>
  <el-form ref="form1" :model="form">
    <el-row>
      <el-col :span="24">
        <el-form-item label="登录方式" prop="choose" class="noborder">
          <el-radio-group v-model="activeName" @input="commandEvent">
            <el-radio v-for="item in radioOpt" :key="item.code" :label="item.code" border>{{ item.txt }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col v-for="(item, idx) in boxDataLeft" :key="idx" :span="24">
        <el-form-item v-if="item.type === 'select'" :label="item.label" :prop="item.prop" :rules="item.rules"
          class="w100">
          <el-select v-model="item.model" :placeholder="item.placeholder" filterable :disabled="item.disabled" @change="(val) => {
            selectChangeLeft(val, item);
          }
            ">
            <el-option v-for="val in item.options" :key="val.code + Math.random()" :label="val.name" :value="val.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="item.type === 'input'" :label="item.label" :prop="item.prop" :rules="item.rules">
          <el-input v-model.trim="item.model" :show-password="item.prop === 'password'" :placeholder="item.placeholder"
            @input="(val) => {
              selectChangeLeft(val, item);
            }
              " clearable :disabled="item.disabled"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import {
  validPercent,
  validPercent2,
  validTrue
} from "@/validator/validator";
import message from "@/mixin/message";
import {
  alarmPlan,
  alarmDetail,
} from "@/api/api";
import {
  mapGetters
} from "vuex";
export default {
  name: "Left",
  mixins: [message],
  data () {
    return {
      activeName: 0,
      loginTXT: "帐密登陆",
      radioOpt: [{
        code: 0,
        txt: "帐密登陆",
      },
      {
        code: 1,
        txt: "授权登录",
      },
      ],
      form: {},
      currentInfo: {}, // 当前用户 查询类目等信息集合
      boxDataLeft: [],
    };
  },
  computed: {
    ...mapGetters([
      "clearLeftTag",
      "pinList",
      "pinListAuthor",
      "btnState",
      "checkRight",
      "planOption"
    ]),
  },
  watch: {
    activeName: {
      handler (newval, oldval) {
        const vm = this;
        let midHasinfo = false;
        let midBtnstate = {
          inputFlag: false,
          deleteFlag: true,
          saveFlag: true,
        };
        vm.$store.commit("pageData/UPDATE_HASINFO", midHasinfo);
        vm.$store.commit("pageData/UPDATE_BTNSTATE", midBtnstate);
        vm.loginTXT = newval === 1 ? "授权登录" : "帐密登陆";
        vm.$set(vm.currentInfo, "type", newval);
        vm.$nextTick(() => {
          switch (newval) {
            case 0:
              vm.boxDataLeft = [{
                type: "input",
                model: "",
                prop: "user_name",
                label: "PIN:",
                placeholder: "请输入PIN",
                options: JSON.parse(JSON.stringify(vm.pinList)),
                rules: {
                  required: true,
                  validator: validPercent.bind(this, "boxDataLeft", this, 0),
                  trigger: "change blur",
                },
                disabled: false,
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
                options: [{
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
              ];
              break;
            case 1:
              vm.boxDataLeft = [{
                type: "select",
                model: "",
                prop: "user_name",
                label: "PIN:",
                placeholder: "请选择PIN",
                options: JSON.parse(JSON.stringify(vm.pinListAuthor)),
                rules: {
                  required: true,
                  validator: validPercent.bind(this, "boxDataLeft", this, 0),
                  trigger: "change blur",
                },
                disabled: false,
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
                options: [{
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
              ];
              break;
          }
        });
      },
      immediate: true,
      deep: true,
    },
    clearLeftTag (newval, oldval) {
      // 清空左侧所有信息
      if (newval) {
        this.activeName = 0;
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
  created () {
    this.$store.commit("pageData/UPDATE_ClRLEFT", false); // 清空左侧输入框
    this.$store.commit("pageData/UPDATE_HASINFO", false);
  },
  methods: {
    // 左侧
    async selectChangeLeft (val, item) {
      const vm = this;
      vm.$store.commit("pageData/UPDATE_CHECKRIGHT", true);
      vm.$store.commit("pageData/UPDATE_HASINFO", false);
      vm.$store.commit("pageData/UPDATE_CURRENTIFO", null);
      if (item.prop === "user_name") {
        // pin改变的时候，重置所有信息
        for (let i of vm.boxDataLeft) {
          if (i.prop === "product_line") {
            i.disabled = val ? false : true
            i.model = "";
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
    getPlan () {
      const vm = this;
      let data = {
        user_name: vm.boxDataLeft[0].model,
        product_line: vm.boxDataLeft[1].model,
        type: vm.activeName
      };
      return alarmPlan(data)
    },
    //获取详情
    getInfo (data) {
      const vm = this;
      alarmDetail(data).then(async (res) => {
        let midHasinfo;
        let midBtnstate;
        if (res.data.code === 10000) {
          let res = await vm.getPlan()
          if (res.data.code === 10000)
            vm.$store.commit("pageData/UPDATE_PLANOPTION", JSON.parse(JSON.stringify(res.data.data))); //无数据
          midHasinfo = true;
          midBtnstate = {
            inputFlag: false,
            deleteFlag: false,
            saveFlag: false,
          };
        } else if (res.data.code === 10002) {
          vm.$msg({
            type: "warning",
            msg: "当前PIN-产品线下无预警信息！"
          });
          midHasinfo = true;
          midBtnstate = {
            inputFlag: true,  // 编辑状态
            deleteFlag: true, // 不可删除
            saveFlag: false, // 可保存
          };
        } else if (res.data.code === 10003) {
          midHasinfo = false;
          midBtnstate = {
            inputFlag: false, // 重置
            deleteFlag: true, // 不可删除
            saveFlag: true, // 不可保存
          };
          vm.openMessageBox({
            type: "warning",
            showClose: true,
            tipTitle: `账号未授权或授权失效`,
            tipContent: `http://tool.afocus.com.cn/jos/oauth2`,
            auth: true,
            dangerouslyUseHTMLString: true,
            confirmButtonFn: () => {

            },
          });
        } else {
          vm.$msg({
            type: "error",
            msg: res.data.msg
          });
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
    commandEvent (val) {
      this.activeName = val;
    },
  },
};
</script>

<style lang="less" scoped>
.dropdown {
  margin: 15px 0 15px 50px;
}
</style>
