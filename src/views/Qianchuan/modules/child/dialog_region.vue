<template>
  <el-dialog
    :title="diaTxt"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    custom-class="dialogStrategy"
    width="30%"
    @close="closeEvent"
  >
    <el-form ref="form" :model="form">
      <el-form-item label="模板名称:">
        <el-input
          v-model="form.name"
          placeholder="请输入模板名称"
          size="medium"
          clearable
        ></el-input>
      </el-form-item>
      <el-tabs class="tabsbox">
        <el-tab-pane label="不限"></el-tab-pane>
        <el-tab-pane label="按省市">
          <div class="provinceAndCity">
            <div class="search" style="display: flex">
              <el-input
                size="medium"
                placeholder="省市搜索不支持按拼音、拼音首字母"
              ></el-input>
              <el-button
                v-waves
                slot="append"
                icon="el-icon-search"
                size="medium"
                >搜索</el-button
              >
            </div>
            <div class="tabsItem">
              <el-tabs
                v-model="nowActive"
                @tab-click="handleClick"
                style="width: 100%"
              >
                <el-tab-pane label="地理划分" name="first">
                  <div class="block1">
                    <el-cascader-panel
                      :options="optionsCity"
                      :show-all-levels="false"
                      ref="cascader"
                      size="medium"
                      :props="props"
                      @change="pitchVal"
                    >
                    </el-cascader-panel>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="发展划分" name="second">
                  <div class="block1">
                    <el-cascader-panel
                      :options="optionsDevelop"
                      :show-all-levels="false"
                      ref="cascader"
                      size="medium"
                      :props="props"
                      @change="pitchVal"
                    >
                    </el-cascader-panel>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
          <div class="radioBox">
            <el-radio v-model="radio" label="1">正在该地区的用户</el-radio>
            <el-radio v-model="radio" label="2">居住在该地区的用户</el-radio>
            <el-radio v-model="radio" label="3">到该地区旅行的用户</el-radio>
            <el-radio v-model="radio" label="4">该地区内的所有用户</el-radio>
          </div>
        </el-tab-pane>
        <el-tab-pane label="按区县">
          <div class="block1">
            <el-cascader-panel
              :options="optionsCounty"
              :show-all-levels="false"
              ref="cascader"
              size="medium"
              :props="props"
              @change="pitchVal"
            ></el-cascader-panel>
          </div>
          <div class="radioBox">
            <el-radio v-model="radio" label="1">正在该地区的用户</el-radio>
            <el-radio v-model="radio" label="2">居住在该地区的用户</el-radio>
            <el-radio v-model="radio" label="3">到该地区旅行的用户</el-radio>
            <el-radio v-model="radio" label="4">该地区内的所有用户</el-radio>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <a class="btnnormal btnnormal_down marginR" @click="closeEvent">
        <div class="el-icon-close btnSize">取消</div>
      </a>
      <el-button
        v-waves
        class="el-icon-finished"
        type="primary"
        @click="saveEvent"
        size="medium"
        >{{ btnTxt }}
      </el-button>
    </span>
  </el-dialog>
</template>
<script>
import { city, develop, county } from "../../city.js";
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
      nowActive: "1",
      diaTxt: "",
      btnTxt: "",
      dialogVisible: false,
      form: {
        name: "",
      },
      radio: "1",
      props: {
        multiple: true,
        value: "id",
        label: "name",
      },
      optionsCity: [], //地理划分
      optionsDevelop: [], //发展划分
      optionsCounty: [],
    };
  },
  watch: {
    editFlag: {
      handler(newval, oldval) {
        const vm = this;
        switch (newval) {
          case 1:
            vm.diaTxt = "新建地域模板";
            vm.btnTxt = "保存";
            break;
          case 2:
            vm.diaTxt = "编辑地域模板";
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
  created() {
    this.optionsCity = city;
    this.optionsDevelop = develop;
    this.optionsCounty = county;
  },
  methods: {
    // 关闭弹窗
    closeEvent() {
      const vm = this;
      vm.$emit("close");
    },
    // 获取详情
    getDetail(id) {},
    // 新增 - 编辑
    saveEvent() {},
    handleClick(tab, event) {},
    pitchVal(val) {},
  },
};
</script>
