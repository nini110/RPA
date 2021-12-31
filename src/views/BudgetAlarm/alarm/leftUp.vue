<template>
  <el-form ref="form1" :model="form">
    <el-row>
      <el-col v-for="(item, idx) in boxDataUp" :key="idx" :span="24">
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
        <el-form-item label="添加文件:" v-if="item.type === 'upload'">
          <Upload
            :showPros="false"
            :multiple="false"
            @getFile="getFileEvent"
          ></Upload>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
import Upload from "@/components/upload";
import { validPercent, validPercent2, validTrue } from "@/validator/validator";
import { mapGetters } from "vuex";

export default {
  name: "LeftUp",
  components: {
    Upload,
  },
  watch: {
    pinList: {
      handler(newval, oldval) {
        this.boxDataUp[0].options = JSON.parse(JSON.stringify(newval));
      },
      immediate: true,
    },
  },
  computed: {
    ...mapGetters(["pinList"]),
  },
  data() {
    return {
      form: {},
      boxDataUp: [
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
      fileList: [],
    };
  },
  methods: {
    getFileEvent(val) {
      this.fileList = val;
      // this.errorUpInfo = "";
    },
  },
};
</script>
