<template>
  <el-dialog
    :title="editNum === 1 ? '修改人员' : ' 修改活动'"
    :visible.sync="show"
    width="35%"
    custom-class="editDia"
    :close-on-click-modal="false"
    @close="closeDialog"
  >
    <el-form class="formObj">
      <div class="formObj_ipt">
        <el-collapse-transition>
          <el-form-item v-if="peopleOptions.length > 0" label="" class="tagBox">
            <el-scrollbar style="height: 100%">
              <el-tag
                v-for="tag in peopleOptions"
                :key="tag.userid"
                type=""
                @close="NameListdeleteitem(tag)"
                @click="dialogAddPerson(tag)"
                style="margin-left: 10px; margin-top: 5px"
              >
                {{ tag.name }}
              </el-tag>
            </el-scrollbar>
          </el-form-item>
        </el-collapse-transition>
        <div class="editCollapse">
          <el-collapse v-model="activeNames">
            <el-collapse-item v-if="editNum === 1" title="人员列表:" name="1">
              <div class="namelist">
                <ul style="list-style: none">
                  <li
                    v-for="(i, index) in peoplelList"
                    :key="index"
                    :index="index"
                    @dblclick="NameListdeleteitem(index)"
                  >
                    <el-tag v-if="i.user_name" style="margin-left: 10px">{{
                      i.user_name
                    }}</el-tag
                    ><el-tag v-if="i.name" style="margin-left: 10px">{{
                      i.name
                    }}</el-tag>
                  </li>
                </ul>
              </div>
            </el-collapse-item>
            <el-collapse-item v-else title="活动列表:" name="1">
              <div v-if="actionList && actionList.length > 0">
                <el-checkbox
                  :indeterminate="isIndeterminate"
                  v-model="checkAll"
                  @change="editActionEventAll"
                  >全选</el-checkbox
                >
                <el-checkbox-group
                  v-model="checkedActions"
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
              <div v-else>暂无活动内容</div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <a class="btnnormal btnnormal_down marginR" @click="closeDialog()">
        <div class="el-icon-close btnSize">取消</div>
      </a>
      <el-button
        v-waves
        class="el-icon-finished"
        type="primary"
        @click="isModification()"
        >确 定</el-button
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
    return {
      activeNames: "1",
      show: true,
      cSubcategoryNo: "",
      peopleOptions: [],
      peoplelList: [],
      actionList: [],
      //修改弹层选中的活动
      checkedActions: [],
      checkAll: false,
      isIndeterminate: false,
    };
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
        let mid = row.activity_id.split(",");
        let midArr = [];
        for (let item of mid) {
          for (let item1 of vm.actionList) {
            if (item === item1.id) {
              midArr.push(item1);
            }
          }
        }
        vm.checkedActions = midArr;
        vm.editActionEvent(midArr);
      });
    },
    // 查找人员
    searchPeople() {
      if (this.cSubcategoryNo == "") {
        this.peopleOptions = [];
      } else {
        getName({
          search: this.cSubcategoryNo,
        }).then((res) => {
          this.peopleOptions = res.data.data;
        });
      }
    },
    // 确定修改人员和活动
    isModification() {
      const vm = this;
      let itemListid = "";
      let itemListname = "";
      let activeLabel = "";
      let activeId = "";
      for (let i of vm.peoplelList) {
        itemListname += (i.user_name || i.name) + ",";
        itemListid += (i.user_id || i.userid) + ",";
      }
      for (let i of vm.checkedActions) {
        activeLabel += i.activityName + ",";
        activeId += i.id + ",";
      }
      let data;
      if (this.editNum === 1) {
        // 人员
        data = {
          bidding_id: this.row.bidding_id,
          activity_id: this.row.activity_id,
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
          id: this.row.id,
          activity_id: activeId.slice(0, activeId.length - 1),
          activity_name: activeLabel.slice(0, activeLabel.length - 1),
        };
        updateActive(data).then((res) => {
          if (res.data.code === 10000) {
            vm.$emit("close", "suc");
            vm.actionList = [];
            vm.$msg({ msg: "修改成功!" });
          }
        });
      }
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
      this.checkedActions = val;
      this.isIndeterminate = false;
    },
    //修改弹层的多选框--单选
    editActionEvent(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.actionList.length;
      this.isIndeterminate =
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
