<template>
  <el-dialog
    :title="editNum === 1 ? '修改人员' : ' 修改活动'"
    :visible.sync="show"
    width="35%"
    custom-class="editDia"
    :close-on-click-modal="false"
    @close="closeDialog"
  >
    <el-form ref="form" class="formObj" :model="form" :rules="rules">
      <el-row :gutter="4">
        <div v-if="editNum === 1" style="width: 100%">
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
                  :key="tag.userid"
                  type=""
                  @close="NameListdeleteitem(tag)"
                  @click="dialogAddPerson(tag)"
                >
                  {{ tag.name }}
                </el-tag>
              </el-scrollbar>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="已选人员" prop="" class="tagBox">
              <el-tag
                v-for="(i, index) in peoplelList"
                :key="index"
                :index="index"
                :closable="peoplelList.length > 1"
                @close="NameListdeleteitem(index)"
                >{{ i.name || i.user_name }}</el-tag
              >
            </el-form-item>
          </el-col>
        </div>
        <div v-else style="width: 100%">
          <el-col :span="24">
            <el-form-item label="" class="action" prop="checkedActions">
              <div v-if="actionList && actionList.length > 0">
                <el-checkbox
                  :indeterminate="form.isIndeterminate"
                  v-model="form.checkAll"
                  @change="editActionEventAll"
                  >全选</el-checkbox
                >
                <el-checkbox-group
                  v-model="form.checkedActions"
                  @change="editActionEvent"
                >
                  <el-checkbox
                    v-for="city in actionList"
                    :label="city"
                    :key="city.id"
                    >{{ city.activityName }}</el-checkbox
                  >
                </el-checkbox-group>
              </div>
              <div v-else>当前监控计划所属竞标下无可选择活动</div>
            </el-form-item>
          </el-col>
        </div>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <a class="btnnormal btnnormal_down marginR" @click="closeDialog()">
        <div class="el-icon-close btnSize">取消</div>
      </a>
      <el-button
        v-waves
        class="el-icon-check"
        type="primary"
        @click="isModification()"
        :disabled="editNum === 2 && (!actionList || actionList.length === 0)"
        >保存</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
import {
  BidIdQueryActivity,
  getName,
  personnelDetails,
  updateUser,
  updateActive,
} from "@/api/api.js";
export default {
  name: "DetailDialog",
  props: {
    row: {
      type: Object,
      default: {},
    },
    editNum: {
      ype: Number,
      default: 1,
    },
  },
  data() {
    const vm = this;
    let validActions = function (rule, value, callback) {
      if (
        vm.actionList &&
        vm.actionList.length > 0 &&
        vm.form.checkedActions.length === 0
      ) {
        callback("请选择活动");
      } else {
        callback();
      }
    };
    return {
      show: true,
      cSubcategoryNo: "",
      peopleOptions: [],
      peoplelList: [],
      actionList: [],
      form: {
        activity_name: "",
        activity_id: "",
        //选中的活动
        checkedActions: [],
        checkAll: false,
        isIndeterminate: false,
      },
      rules: {
        checkedActions: [
          {
            required: true,
            validator: validActions,
            trigger: ["blur", "change"],
          },
        ],
      },
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
          if (newval.length === vm.actionList.length) {
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
        vm.editActionEvent(newval);
      },
      immediate: false,
      deep: true,
    },
  },
  created() {
    this.getDetail(this.row);
  },
  methods: {
    getDetail(row) {
      const vm = this;
      Promise.all([
        personnelDetails({
          bidding_id: row.bidding_id,
          activity_id: row.activity_id,
        }),
        BidIdQueryActivity({
          bidding_id: row.bidding_id,
        }),
      ]).then((res) => {
        vm.peoplelList = res[0].data.data;
        vm.actionList = res[1].data.data;
        if (vm.actionList && vm.actionList.length > 0) {
          if (row.activity_name === "全部") {
            vm.form.checkedActions = vm.actionList;
          } else {
            let mid = row.activity_id.split(",");
            let midArr = [];
            for (let item of mid) {
              for (let item1 of vm.actionList) {
                if (item === item1.id) {
                  midArr.push(item1);
                }
              }
            }
            vm.form.checkedActions = midArr;
          }
        }
      });
    },
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
          for (let i in vm.peoplelList) {
            for (let k in result) {
              if (vm.peoplelList[i].userid === result[k].userid) {
                result.splice(k, 1);
                break;
              }
            }
          }
          vm.peopleOptions = result;
        });
      }
    },
    // 确定修改人员和活动
    isModification() {
      const vm = this;
      vm.$refs.form.validate((valid) => {
        if (valid) {
          let itemListid = "";
          let itemListname = "";
          for (let i of vm.peoplelList) {
            itemListname += (i.user_name || i.name) + ",";
            itemListid += (i.user_id || i.userid) + ",";
          }
          let data;
          if (vm.editNum === 1) {
            // 人员
            data = {
              bidding_id: vm.row.bidding_id,
              activity_id: vm.row.activity_id,
              user_list: itemListid.slice(0, itemListid.length - 1),
              user_name_list: itemListname.slice(0, itemListname.length - 1),
            };
            updateUser(data).then((res) => {
              if (res.data.code === 10000) {
                vm.$emit("close", "suc");
                vm.peopleOptions = [];
                vm.peoplelList = [];
                vm.cSubcategoryNo = "";
                vm.actionList = [];
                vm.$msg({ msg: "修改成功!" });
              }
            });
          } else {
            data = {
              id: vm.row.id,
              activity_id: vm.form.activity_id,
              activity_name: vm.form.activity_name,
            };
            updateActive(data).then((res) => {
              if (res.data.code === 10000) {
                vm.$emit("close", "suc");
                vm.actionList = [];
                vm.$msg({ msg: "修改成功!" });
              } else {
                vm.$msg({ type: "error", msg: res.data.data });
              }
            });
          }
        }
      });
    },
    // 弹层中的点击添加人员
    dialogAddPerson(tag) {
      this.peoplelList.push(tag);
      // 添加后删除以免二次选中
      this.NameListhandleClose(tag);
    },
    NameListhandleClose(tag) {
      let item = this.peopleOptions.indexOf(tag);
      this.peopleOptions.splice(item, 1);
    },
    NameListdeleteitem(index) {
      this.peoplelList.splice(index, 1);
    },
    //修改弹层的多选框--全选
    editActionEventAll(val) {
      this.form.checkedActions = val ? this.actionList : [];
      this.form.isIndeterminate = false;
    },
    //修改弹层的多选框--单选
    editActionEvent(value) {
      let checkedCount = value.length;
      this.form.checkAll = checkedCount === this.actionList.length;
      this.form.isIndeterminate =
        checkedCount > 0 && checkedCount < this.actionList.length;
    },
    closeDialog() {
      this.$emit("close");
    },
  },
};
</script>
<style lang="less">
.editCollapse {
  .el-collapse-item__header {
    color: #666;
    font-size: 12px;
    &:before,
    &:after {
      display: none;
    }
  }
}
</style>
