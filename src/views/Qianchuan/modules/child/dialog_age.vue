<template>
  <el-dialog
    :title="diaTxt"
    :visible.sync="dialogVisible"
    custom-class="dialogStrategy ageDialog"
    :close-on-click-modal="false"
    width="30%"
    @close="closeEvent"
  >
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item label="模板名称:" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入模板名称"
          size="medium"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="年龄:" prop="age">
        <el-checkbox-group
          v-model="form.age"
          @change="handleCheckedCitiesChange"
        >
          <el-checkbox
            v-for="item in ageOptions"
            :label="item.value"
            :key="item.value"
          >
            {{ item.lable }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <a class="btnnormal btnnormal_down marginR" @click="closeEvent">
        <div class="el-icon-close btnSize">取消</div>
      </a>
      <el-button
        v-waves
        class="el-icon-check"
        type="primary"
        @click="saveEvent"
        size="medium"
        >{{ btnTxt }}
      </el-button>
    </span>
  </el-dialog>
</template>
<script>
import opt from "../../option.js";
import {
  ageTemplateAdd,
  ageTemplateDetail,
  ageTemplateUpdata,
} from "@/api/api.js";
export default {
  props: {
    showFlag: {
      type: Boolean,
      default: false,
    },
    username: {
      type: String,
      default: "",
    },
    editFlag: {
      type: Number,
      default: 1,
    },
    rowInfo: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      diaTxt: "",
      btnTxt: "",
      dialogVisible: false,
      ageOptions: null,
      form: {
        name: "",
        age: [],
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入模板名称",
            trigger: "blur",
          },
        ],
        age: [
          {
            required: true,
            message: "请选择年龄范围",
            trigger: "blur",
          },
        ],
      },
    };
  },
  watch: {
    editFlag: {
      handler(newval, oldval) {
        const vm = this;
        switch (newval) {
          case 1:
            vm.diaTxt = "新建年龄模板";
            vm.btnTxt = "保存";
            break;
          case 2:
            vm.diaTxt = "编辑年龄模板";
            vm.btnTxt = "更新";
            break;
        }
      },
      immediate: true,
      deep: true,
    },
    showFlag(newval, oldval) {
      this.dialogVisible = this.showFlag;
      // 更新
      if (newval && this.editFlag === 2) {
        this.getDetail(this.rowInfo.id);
      }
    },
  },
  mounted() {
    this.ageOptions = opt.ageOptions;
  },
  methods: {
    // 关闭弹窗
    closeEvent() {
      const vm = this;
      vm.$emit("close");
    },
    // 获取详情
    getDetail(id) {
      ageTemplateDetail({
        template_id: id,
      }).then((res) => {
        let str = res.data.data.age;
        let arr = [];
        str = str.split(",");
        for (let i = 0; i < str.length; i++) {
          arr.push(parseInt(str[i]));
        }
        this.form.name = res.data.data.name;
        this.form.age = arr;
      });
    },
    // 新增 - 编辑
    saveEvent() {
      const vm = this;
      let age = "";
      for (let i = 0; i < vm.form.age.length; i++) {
        age += vm.form.age[i] + ",";
      }
      age = age.slice(0, age.length - 1);
      let data = {
        name: vm.form.name,
        age,
        username: vm.username,
      };
      vm.$refs.form.validate((valid) => {
        if (valid) {
          if (vm.editFlag === 1) {
            ageTemplateAdd(data).then((res) => {
              if (res.data.code === 200) {
                vm.$emit("close", true);
                vm.$msg({ msg: "年龄模板创建成功！" });
              } else if (res.data.code === 1) {
                vm.$msg({ type: "error", msg: res.data.msg });
              }
            });
          } else {
            data = {
              ...data,
              template_id: vm.rowInfo.id,
            };
            ageTemplateUpdata(data).then((res) => {
              if (res.data.code === 200) {
                vm.$emit("close", true);
                vm.$msg({ msg: "年龄模板更新成功！" });
              } else if (res.data.code === 1) {
                vm.$msg({ type: "error", msg: res.data.msg });
              }
            });
          }
        }
      });
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.ageOptions.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.ageOptions.length;
      // 如果选择包含了：不限
      if (value[value.length - 1] === 0) {
        this.form.age = [0];
      } else {
        for (let i = 0; i < value.length; i++) {
          if (value[i] === 0) {
            value.splice(i, 1);
          }
        }
      }
    },
  },
};
</script>
