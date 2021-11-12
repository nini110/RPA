<template>
  <!-- 上传竞标 -->
  <el-dialog
    title="上传竞标"
    :visible.sync="show"
    @close="closeDialog"
    max-height="800px"
    custom-class="dialogJb"
    :close-on-click-modal="false"
  >
    <el-form ref="form" :model="form" class="formObj">
      <el-form-item label="选择竞标:">
        <el-select
          v-model="form.bidId"
          filterable
          remote
          reserve-keyword
          placeholder="请输入标名或者项目编号"
          :remote-method="searchEvent"
          :loading="loading"
          :popper-append-to-body="false"
          clearable
          @change="jbChangeEvent"
        >
          <el-option
            v-for="item in bidOptions"
            :key="item.value"
            :label="`编号:${item.pro_num}——标名：${item.pro_name}`"
            :value="item.pro_num"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择活动:">
        <el-collapse-transition>
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
                >{{ item.activityName }}</el-checkbox
              >
            </el-checkbox-group>
          </div>
          <div v-else>暂无活动内容</div>
        </el-collapse-transition>
      </el-form-item>
      <el-form-item label="添加人员:">
        <el-input
          class="inline-input"
          v-model="cSubcategoryNo"
          placeholder="请输入上传人员姓名或关键字"
          @input="searchPeople"
          size="medium"
          clearable
        ></el-input>
      </el-form-item>
      <el-collapse-transition>
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
      </el-collapse-transition>
      <el-divider></el-divider>
      <div class="send">
        <div class="namelist">
          <el-scrollbar style="height: 100%">
            <ul style="list-style: none">
              <li
                v-for="(i, index) in peoplelist"
                :key="index"
                :index="index"
                style="margin-bottom: 5px"
                @dblclick="deleteitem(index)"
              >
                <el-tag>{{ i.name }}</el-tag>
              </li>
            </ul>
          </el-scrollbar>
        </div>
        <div class="上传" style="flex: 1">
          <Upload
            class="tes"
            txt="请上传xlsx文件，通过搜索添加上传人员，双击上传人员可删除"
            :progressPercent="form.progressPercent"
            @getFile="getFileEvent"
          ></Upload>
        </div>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <a
        class="btnnormal btnnormal_down"
        href="http://tool.afocus.com.cn/file_download/预算监控模板.xlsx"
        download="预算监控模板.xlsx"
        ><div class="btnSize">下载模板</div></a
      >
      <el-button
        class="btnnormal marginL"
        type="primary"
        :disabled="
          this.fileList.length == 0 ||
          this.form.bidId == '' ||
          this.peoplelist.length == 0
            ? true
            : false
        "
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
        progressPercent: 0,
      },
      loading: false,
      fileList: [], // excel文件列表
      actionOptions: [],
      bidOptions: [],
      peopleOptions: [],
      cSubcategoryNo: "",
      peoplelist: [], //人员列表
            itemid: [], //上传人员id
      itemname: [], //上传人员姓名

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
    searchEvent(val) {
      const vm = this;
      vm.loading = true;
      BiddingSearch({
        search: val,
      }).then((res) => {
        vm.loading = false;
        if (res.data.code == "10000" && res.data.data.length) {
          vm.bidOptions = res.data.data;
        } else {
          vm.bidOptions = [];
        }
      });
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
        vm.$message.warning("请输入标名或者项目编号");
      } else if (vm.fileList.length === 0) {
        vm.$message.warning("请选择要上传的excel文件");
      } else {
        console.log(vm.form.bidId);
        let data = {
          file: vm.fileList,
          user_list: vm.itemid,
          user_name_list: vm.itemname,
          trans_name: vm.username,
          bidding_id: vm.form.bidId,
          bidding_name: jbname,
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
        immediatelyUpload(data).then((res) => {
          if (res.data.code == 10000) {
            vm.form.progressPercent = 100;
            vm.handleSuccess();
            vm.$emit('close', 'suc')
            vm.$message.success('上传成功');
          } else {
            vm.$message.warning(res.data.data);
          }
        });
      }
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
      console.log(this.form.checkedActions);
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
    // 文件上传成功时的钩子
    handleSuccess(res, file, fileList) {
      this.$message.success("文件上传成功");
      this.fileList = [];
      this.peoplelist = [];
      this.itemid = [];
      this.upDialogFlag = false;
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
// @import "../comps/bidding.less";
</style>
