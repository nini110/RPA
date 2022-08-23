<template>
  <!-- 上传竞标 -->
  <el-dialog
    title="新建监控计划"
    :visible.sync="show"
    @close="closeDialog"
    width="45%"
    max-height="800px"
    custom-class="dialogJb"
    :close-on-click-modal="false"
  >
    <el-form ref="form" :model="form" class="formObj" :rules="rules">
      <el-row :gutter="4">
        <el-col :span="24">
          <el-form-item label="选择竞标" prop="bidId">
            <el-select
              v-model="form.bidId"
              filterable
              placeholder="请输入标名或者项目编号"
              popper-class="tsselect"
              @change="jbChangeEvent"
            >
              <el-option
                v-for="item in bidOptions"
                :key="item.value"
                :label="`${item.pro_num} ~ ${item.pro_name}`"
                :value="item.pro_num"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="选择活动" prop="checkedActions">
            <div v-if="actionOptions && actionOptions.length > 0">
              <el-checkbox
                :indeterminate="form.isIndeterminate"
                v-model="form.checkAll"
                @change="actionEventAll"
                >全选</el-checkbox
              >
              <el-checkbox-group
                v-model="form.checkedActions"
                @change="actionEvent"
              >
                <el-checkbox
                  v-for="item in actionOptions"
                  :label="item"
                  :key="item.id"
                >
                  {{ item.activityName }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
            <div v-else>
              <span
                v-if="form.bidId && actionOptions.length === 0"
                style="color: red"
                >当前竞标无活动，将无法创建监控计划</span
              >
              <span v-else>请先选择竞标</span>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="添加人员" prop="cSubcategoryNo">
            <el-input
              class="inline-input"
              v-model.trim="cSubcategoryNo"
              placeholder="请输入上传人员姓名或关键字"
              @input="searchPeople"
              size="medium"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            v-if="peopleOptions.length > 0"
            label=""
            class="tagBox ts"
          >
            <el-scrollbar style="height: 100%">
              <el-tag
                v-for="tag in peopleOptions"
                :disable-transitions="false"
                :key="tag.userid"
                type=""
                @close="handleClose(tag)"
                @click="addPerson(tag)"
                >{{ tag.name }}</el-tag
              >
            </el-scrollbar>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="已选人员" prop="" class="tagBox">
            <el-tag
              v-for="(i, index) in peoplelist"
              :key="index"
              :index="index"
              :closable="peoplelist.length > 1"
              @close="deleteitem(index)"
              >{{ i.name }}</el-tag
            >
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="生成预算" prop="rangeDate">
            <el-date-picker
              v-model="form.rangeDate"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="daterange"
              :clearable="false"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptionsStart"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button
            type="info"
            plain
            @click="createForm"
            :disabled="form.rangeDate && form.rangeDate.length === 0"
            >生成</el-button
          >
        </el-col>
        <el-col class="flexCol">
          <!-- <el-scrollbar style="height: 100%"> -->
          <el-form-item
            v-for="(item, idx) in form.budgetJson"
            :key="idx"
            label=""
            :prop="'budgetJson.' + idx + '.val'"
            :rules="rules.budget"
          >
            <el-input
              placeholder="请输入预算"
              v-model.trim="item.val"
              :maxlength="9"
              clearable
            >
              <template slot="prepend">{{ item.date }}</template>
            </el-input>
            <span
              v-if="form.budgetJson.length > 1"
              class="delicon el-icon-delete"
              @click="delBudgetEvent(item, idx)"
            ></span>
          </el-form-item>
          <!-- </el-scrollbar> -->
        </el-col>
      </el-row>
    </el-form>
    <div class="send"></div>
    <span slot="footer" class="dialog-footer">
      <a class="btnnormal btnnormal_down marginR" @click="closeDialog()">
        <div class="el-icon-close btnSize">取消</div>
      </a>
      <el-button
        v-waves
        class="el-icon-finished"
        type="primary"
        @click="uploadFile"
        >保存</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
import {
  BiddingSearch,
  BidIdQueryActivity,
  getName,
  immediatelyUpload,
} from "@/api/api.js";
import Upload from "@/components/upload";
import dayjs from "dayjs";

export default {
  name: "UpDialog",
  components: {
    Upload,
  },
  props: {},
  data() {
    const vm = this;
    const validActions = function (rule, value, callback) {
      if (
        vm.actionOptions &&
        vm.actionOptions.length > 0 &&
        vm.form.checkedActions.length === 0
      ) {
        callback("请选择活动");
      } else {
        callback();
      }
    };
    const checkThreshold = (rule, value, callback) => {
      let res = Number(value);
      if (!res) {
        callback(new Error("预算为数字类型"));
        return;
      }
      callback();
    };    
    return {
      pickerOptionsStart: {
        disabledDate: (time) => {
          return time.getTime() <= new Date().getTime() - 24 * 60 * 60 * 1000;
        },
      },
      show: true,
      form: {
        //搜索的内容
        bidId: "",
        //选中的活动
        checkedActions: [],
        checkAll: false,
        isIndeterminate: false,
        budgetJson: [],
        rangeDate: [],
        activity_name: "",
        activity_id: "",
      },
      rules: {
        bidId: [
          {
            required: true,
            message: "请选择竞标",
            trigger: ["blur", "change"],
          },
        ],
        checkedActions: [
          {
            required: true,
            validator: validActions,
            trigger: ["blur", "change"],
          },
        ],
        rangeDate: [
          {
            required: true,
            message: "请生成预算表单",
            trigger: "blur",
          },
        ],
        budget: [
          {
            type: "number",
            validator: checkThreshold,
            trigger: "change",
          },
        ],
      },
      actionOptions: [],
      bidOptions: [],
      peopleOptions: [],
      cSubcategoryNo: "",
      peoplelist: [], //人员列表
      itemid: [], //上传人员id
      itemname: [], //上传人员姓名
    };
  },
  computed: {
    checkedActivity() {
      return this.form.checkedActions;
    },
  },
  watch: {
    checkedActivity: {
      handler(newval, oldval) {
        const vm = this;
        if (newval.length === 0) {
          vm.form.activity_name = "";
          vm.form.activity_id = "";
        } else {
          if (vm.form.checkAll || newval.length === vm.actionOptions.length) {
            vm.form.activity_name = "";
            vm.form.activity_id = "";
          } else {
            let arrName = "";
            let arrId = "";
            for (let k = 0; k < newval.length; k++) {
              arrName += newval[k].activityName + ",";
              arrId += newval[k].id + ",";
            }
            arrName = arrName.slice(0, arrName.length - 1);
            arrId = arrId.slice(0, arrId.length - 1);
            vm.form.activity_name = arrName;
            vm.form.activity_id = arrId;
          }
        }
      },
      immediate: true,
      deep: true,
    },
  },
  created() {},
  mounted() {
    //设置请求头
    this.userid = localStorage.getItem("wx_userid");
    this.username = localStorage.getItem("user_name");
    this.peoplelist = [
      {
        name: this.username,
        userid: this.userid,
      },
    ];
    this.searchEvent();
  },
  methods: {
    // 查找人员
    searchPeople() {
      const vm = this;
      if (vm.cSubcategoryNo == "") {
        vm.peopleOptions = [];
      } else {
        getName({
          search: vm.cSubcategoryNo,
        }).then((res) => {
          vm.peopleOptions = [];
          let result = res.data.data;
          // 二次同字段搜索的时候去重
          for (let i in vm.peoplelist) {
            for (let k in result) {
              if (vm.peoplelist[i].userid === result[k].userid) {
                result.splice(k, 1);
                break;
              }
            }
          }
          vm.peopleOptions = result;
        });
      }
    },
    // 查询竞标
    searchEvent() {
      const vm = this;
      BiddingSearch({
        aa: "",
      }).then((res) => {
        if (res.data.code == "10000" && res.data.data.length) {
          let result = res.data.data;
          vm.bidOptions = result;
        } else {
          vm.bidOptions = [];
        }
      });
    },
    // 生成
    createForm() {
      const vm = this;
      if (vm.form.rangeDate && vm.form.rangeDate.length > 0) {
        let starttime = dayjs(vm.form.rangeDate[0]);
        let endtime = dayjs(vm.form.rangeDate[1]);
        let duration = endtime.diff(starttime, "day");
        let arr = new Array(duration).fill("a");
        vm.form.budgetJson = [
          {
            date: vm.form.rangeDate[0],
            val: "",
          },
        ];
        arr.forEach((val, idx) => {
          let res = dayjs(
            dayjs(vm.form.rangeDate[0]).valueOf() +
              (idx + 1) * 1000 * 60 * 60 * 24
          ).format("YYYY-MM-DD");
          vm.form.budgetJson.push({
            date: res,
            val: "",
          });
        });
      }
    },
    delBudgetEvent(item, idx) {
      const vm = this;
      vm.form.budgetJson.splice(idx, 1);
    },
    // 选中竞标查询活动
    jbChangeEvent(val) {
      const vm = this;
      vm.$refs.form.clearValidate('checkedActions')
      if (val) {
        BidIdQueryActivity({
          bidding_id: val,
        }).then((res) => {
          let result = res.data.data;
          vm.actionOptions = result;
        });
      } else {
        vm.bidOptions = [];
        vm.actionOptions = [];
      }
    },
    //立即上传
    uploadFile(data) {
      const vm = this;
      if(vm.form.bidId && vm.actionOptions.length === 0) {
        vm.$msg({ type: "warning", msg: '当前竞标无活动，将无法创建监控计划' });
        return
      }
      vm.$refs.form.validate((valid) => {
        if (valid && vm.form.budgetJson.length > 0) {
          //上传时需要的人员id
          vm.itemid = "";
          vm.itemname = "";
          //上传时需要竞标name
          let jbname = "";
          for (let item of vm.bidOptions) {
            if (item.pro_num === vm.form.bidId) {
              jbname = item.pro_name;
              break;
            }
          }
          for (let k = 0; k < vm.peoplelist.length; k++) {
            vm.itemid += vm.peoplelist[k].userid + ",";
            vm.itemname += vm.peoplelist[k].name + ",";
          }
          vm.itemid = vm.itemid.slice(0, vm.itemid.length - 1);
          vm.itemname = vm.itemname.slice(0, vm.itemname.length - 1);
          if (vm.form.bidId == "") {
            vm.$msg({ type: "warning", msg: "请输入标名或者项目编号" });
          } else {
            let data = {
              user_list: vm.itemid,
              user_name_list: vm.itemname,
              trans_name: vm.username,
              bidding_id: vm.form.bidId,
              bidding_name: jbname,
              bidding_threshold: vm.form.budgetJson,
              activity_name: vm.form.activity_name,
              activity_id: vm.form.activity_id,
            };
            immediatelyUpload(data).then((res) => {
              if (res.data.code == 10000) {
                vm.$emit("close", "suc");
                vm.$msg({ msg: "上传成功" });
              } else {
                vm.$msg({ type: "warning", msg: res.data.data });
              }
            });
          }
        }
      });
    },
    // 点击添加人员
    addPerson(tag) {
      this.peoplelist.push(tag);
      this.itemid.push(tag.id);
      // 添加后删除以免二次选中
      this.handleClose(tag);
    },
    //多选栏中的删除
    handleClose(tag) {
      let item = this.peopleOptions.indexOf(tag);
      this.peopleOptions.splice(item, 1);
    },
    //多选框--全选
    actionEventAll(val) {
      this.form.checkedActions = val ? this.actionOptions : [];
      this.form.isIndeterminate = false;
    },
    //多选框--单选
    actionEvent(value) {
      let checkedCount = value.length;
      this.form.checkAll = checkedCount === this.actionOptions.length;
      this.form.isIndeterminate =
        checkedCount > 0 && checkedCount < this.actionOptions.length;
    },
    // 双击删除列表
    deleteitem(index) {
      this.peoplelist.splice(index, 1);
    },
    closeDialog() {
      this.$emit("close");
    },
  },
};
</script>
<style lang="less" scoped>
@import "../monitor/bidding.less";
</style>
