<template>
  <!-- 上传竞标 -->
  <el-dialog
    title="上传竞标"
    :visible.sync="show"
    @close="closeDialog"
    width="35%"
    max-height="800px"
    custom-class="dialogJb"
    :close-on-click-modal="false"
  >
    <el-form ref="form" :model="form" class="formObj" :rules="rules">
      <el-row>
        <el-col>
          <el-form-item label="选择竞标" prop="bidId">
            <el-select
              v-model="form.bidId"
              filterable
              placeholder="请输入标名或者项目编号"
              clearable
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
        <el-col>
          <el-form-item label="选择活动">
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
            <div v-else>暂无活动内容</div>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="添加人员" prop="cSubcategoryNo">
            <el-input
              class="inline-input"
              v-model.trim="cSubcategoryNo"
              placeholder="请输入上传人员姓名或关键字失焦查询"
              @change="searchPeople"
              size="medium"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item v-if="peopleOptions.length > 0" label="" class="tagBox">
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
        <el-divider  style="{margin-top: 0}"></el-divider>
        <el-col>
          <el-form-item label="已选人员" prop="">
            <el-tag
              v-for="(i, index) in peoplelist"
              :key="index"
              :index="index"
              closable
              @close="deleteitem(index)"
              >{{ i.name }}</el-tag
            >
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="预算" prop="">
            <div v-for="(item, idx) in budgetJson" :key="idx" class="budgetDiv">
              <el-date-picker
                v-model="item.date"
                type="date"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
              <el-input v-model="item.val" placeholder="请输入预算"></el-input>
              <span
                v-if="idx !== 0"
                class="delicon el-icon-remove"
                @click="delBudgetEvent(item, idx)"
              ></span>
            </div>
            <span
              class="addicon el-icon-circle-plus"
              @click="addBudgetEvent"
            ></span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="send"></div>
    <span slot="footer" class="dialog-footer">
      <el-button
        v-waves
        class="el-icon-upload2"
        type="primary"
        @click="uploadFile"
        >立即上传</el-button
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

export default {
  name: "UpDialog",
  components: {
    Upload,
  },
  props: {},
  data() {
    return {
      show: true,
      form: {
        //搜索的内容
        bidId: "",
        //选中的活动
        checkedActions: [],
        checkAll: false,
        isIndeterminate: false,
      },
      rules: {
        bidId: [
          {
            required: true,
            message: "请选择竞标",
            trigger: "blur",
          },
        ],
        checkedActions: [
          {
            required: true,
            message: "请选择活动",
            trigger: "blur",
          },
        ],
      },
      fileList: [], // excel文件列表
      actionOptions: [],
      bidOptions: [],
      peopleOptions: [],
      cSubcategoryNo: "",
      peoplelist: [], //人员列表
      itemid: [], //上传人员id
      itemname: [], //上传人员姓名
      budgetJson: [
        {
          date: "",
          val: "",
        },
      ],
    };
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
    // 新增预算
    addBudgetEvent() {
      const vm = this;
      vm.budgetJson.push({
        date: "",
        val: "",
      });
    },
    delBudgetEvent(item, idx) {
      const vm = this;
      vm.budgetJson.splice(idx, 1);
    },
    // 选中竞标查询活动
    jbChangeEvent(val) {
      const vm = this;
      if (val) {
        BidIdQueryActivity({
          bidding_id: val,
        }).then((res) => {
          vm.actionOptions = res.data.data;
        });
      } else {
        vm.bidOptions = [];
        vm.actionOptions = [];
      }
    },
    //立即上传
    uploadFile(data) {
      const vm = this;
      vm.$refs.form.validate((valid) => {
        if (valid) {
          let arrName = "";
          let arrId = "";
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
              bidding_threshold: vm.budgetJson,
            };
            if (vm.form.checkAll === true) {
              vm.form.checkedActions = [];
            }
            if (vm.form.checkedActions.length === 0) {
              vm.$set(data, "activity_name", "");
              vm.$set(data, "activity_id", "");
            } else {
              for (let k = 0; k < vm.form.checkedActions.length; k++) {
                arrName += vm.form.checkedActions[k].activityName + ",";
                arrId += vm.form.checkedActions[k].id + ",";
              }
              arrName = arrName.slice(0, arrName.length - 1);
              arrId = arrId.slice(0, arrId.length - 1);
              vm.$set(data, "activity_name", arrName);
              vm.$set(data, "activity_id", arrId);
            }
            console.log(data);
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
      this.form.checkedActions = val;
      this.form.isIndeterminate = false;
    },
    //多选框--单选
    actionEvent(value) {
      let checkedCount = value.length;
      this.form.checkAll = checkedCount === this.actionOptions.length;
      this.form.isIndeterminate =
        checkedCount > 0 && checkedCount < this.actionOptions.length;
    },
    getFileEvent(val) {
      this.fileList = val;
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
