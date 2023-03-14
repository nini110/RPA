<template>
<!-- 上传竞标 -->
<el-dialog title="新增计划" :visible.sync="show" width="35%" max-height="800px" custom-class="dialogJb" :close-on-click-modal="false" @close="closeEvent(0)">
  <el-form v-if="ifFirst" ref="account" :model="account" class="formObj dapan" :rules="rules">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form-item label="账号" prop="username">
          <el-input v-model.trim="account.username" placeholder="请输入账号" clearable>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="Cookie" prop="cookie">
          <el-input v-model.trim="account.cookie" type="textarea" :autosize="{ minRows: 10, maxRows: 14}" placeholder="请输入Cookie" clearable>
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
  <el-form v-else ref="form" :model="form" class="formObj dapan" :rules="rules" :disabled="formDisable">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form-item label="日期" prop="rangeDate" class="ts">
          <el-select v-model="form.dataType" placeholder="请选择类型" style="width: 130px" @change="dateChange">
            <el-option label="周期" :value="0"></el-option>
            <el-option label="分日" :value="1"></el-option>
            <el-option label="分月" :value="2"></el-option>
          </el-select>
          <el-date-picker v-model="form.rangeDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="daterange" :clearable="false" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptionsStart">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="数据口径" prop="Data1">
          <vxe-pulldown ref="refKoujing" v-model="visible1">
            <template #default>
              <el-input v-model="Data1" readonly placeholder="请选择数据口径" @focus="focusEvent1">
              </el-input>
            </template>
            <template #dropdown>
              <div class="dropdownbox">
                <div class="radioLine">
                  <span class="radioLine_label">转化周期</span>
                  <el-radio-group class="radioLine_cnt" v-model="form.clickOrOrderDay">
                    <el-radio v-for="(item, idx) in opt_zhouqi" :key="idx" :label="item.code">{{ item.label }}</el-radio>
                  </el-radio-group>
                </div>
                <div class="radioLine">
                  <span class="radioLine_label">点击/下单口径</span>
                  <el-radio-group class="radioLine_cnt" v-model="form.clickOrOrderCaliber">
                    <el-radio v-for="(item, idx) in opt_koujing" :key="idx" :label="item.code">{{ item.label }}</el-radio>
                  </el-radio-group>
                </div>
                <div class="radioLine">
                  <span class="radioLine_label">含赠品/不含赠品</span>
                  <el-radio-group class="radioLine_cnt" v-model="form.isGift">
                    <el-radio v-for="(item, idx) in opt_zengpin" :key="idx" :label="item.code">{{ item.label }}</el-radio>
                  </el-radio-group>
                </div>
                <div class="radioLine">
                  <span class="radioLine_label">下单/成交订单</span>
                  <el-radio-group class="radioLine_cnt" v-model="form.orderStatusCategory">
                    <el-radio v-for="(item, idx) in opt_order" :key="idx" :label="item.code">{{ item.label }}</el-radio>
                  </el-radio-group>
                </div>
              </div>
            </template>
          </vxe-pulldown>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="产品线" prop="businessType">
          <vxe-pulldown ref="refQudao" v-model="visible2">
            <template #default>
              <el-input v-model="Data2" readonly placeholder="请选择产品线" @focus="focusEvent2">
              </el-input>
            </template>
            <template #dropdown>
              <div class="dropdownbox">
                <div class="ckBoxLine">
                  <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                  <el-checkbox-group class="ckBoxLine_cnt" v-model="form.businessType" @change="handleCheckChange">
                    <el-checkbox v-for="(item, idx) in opt_qudao" :key="idx" :label="item">{{item }}</el-checkbox>
                  </el-checkbox-group>
                  <span class="ckBoxLine_label el-icon-warning-outline">海投数据可在京速推下的全店海投场景/活动促销场景/商品成长-测款计划中查看</span>
                </div>
              </div>
            </template>
          </vxe-pulldown>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="行业范围" prop="cid3">
          <el-input v-if="fromTag===2 " v-model="form.cid3_name"></el-input>
          <el-cascader v-else ref="casder" v-model="form.cid3" :options="options" :props="{expandTrigger: 'hover', value: 'id', label: 'name',}" @change="casaderEvent"></el-cascader>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="模块需求" prop="model">
          <el-checkbox :indeterminate="isIndeterminate2" v-model="checkAll2" @change="handleCheckAllChange2">全选</el-checkbox>
          <el-checkbox-group v-model="form.model" @change="handleCheckChange2">
            <el-checkbox v-for="(item, idx) in opt_model" :key="idx" :label="item.code">{{item.label }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
  <div class="send"></div>
  <span slot="footer" class="dialog-footer">
    <div v-if="ifStep">
      <a v-if="fromTag=== 1" class="btnnormal btnnormal_down marginR" @click="nextEvent">
        <div class="el-icon-bottom btnSize">下一步</div>
      </a></div>
    <div v-else>
      <a v-if="fromTag=== 1" class="btnnormal btnnormal_down marginR" @click="closeEvent(0)">
        <div class="el-icon-close btnSize">取消</div>
      </a>
      <el-button v-if="fromTag=== 1" v-waves class="el-icon-finished" type="primary" @click="saveEvent">保存</el-button>
      <el-button v-else v-waves class="el-icon-close" type="primary" @click="closeEvent(0)">关闭</el-button>
    </div>
  </span>
</el-dialog>
</template>

<script>
import {
  dapanRange,
  dapanOnline
} from "@/api/api.js";
import Upload from "@/components/upload";
import dayjs from "dayjs";

export default {
  name: "UpDialog",
  components: {
    Upload,
  },
  props: {
    fromTag: {
      type: Number
    },
    row: {
      type: Object,
    },
    upDialogFlag: {
      type: Boolean,
      default: false
    },
  },
  data() {
    const vm = this;
    const validateData1 = (rule, value, callback) => {
      callback();
    };
    return {
      ifStep: true,
      ifFirst: true,
      pickerOptionsStart: {
        disabledDate: (time) => {
          let day = dayjs()
          let year1 = dayjs().subtract(1, 'year')
          return time.getTime() <= year1 || time.getTime() >= day
        },
        onPick(time) {
          //当第一时间选中才设置禁用
          if (time.minDate && !time.maxDate) {
            vm.selectDay = time.minDate;
          }
        },
      },
      selectDay: null,
      show: false,
      rangeDate: [],
      account: {
        username: '',
        cookie: ''
      },
      cid3_name_arr: [],
      form: {
        rangeDate: [],
        cid3: [],
        cid3_name: '',
        isGift: 0,
        clickOrOrderDay: 0,
        clickOrOrderCaliber: 0,
        orderStatusCategory: 0,
        businessType: [],
        dataType: 0,
        model: []
      },
      Data1: '',
      Data2: '',
      visible1: true,
      visible2: false,
      opt_zhouqi: [{
          code: 0,
          label: '当天'
        },
        {
          code: 1,
          label: '1天'
        },
        {
          code: 3,
          label: '3天'
        },
        {
          code: 7,
          label: '7天'
        },
        {
          code: 15,
          label: '15天'
        },
        {
          code: 30,
          label: '30天'
        }
      ],
      opt_koujing: [{
          code: 0,
          label: '点击'
        },
        {
          code: 1,
          label: '下单'
        }
      ],
      opt_zengpin: [{
          code: 1,
          label: '含赠品'
        },
        {
          code: 0,
          label: '不含赠品'
        },
      ],
      opt_order: [{
          code: 0,
          label: '下单订单'
        },
        {
          code: 1,
          label: '成交订单'
        },
      ],
      opt_qudao: ['京东展位', '京东快车', '京速推', '购物触点', '京东直投'],
      opt_model: [{
          code: 0,
          label: '行业整体看板-卡片'
        },
        {
          code: 1,
          label: '行业整体看板-趋势图'
        },
        {
          code: 2,
          label: '流量看板-趋势图'
        },
        {
          code: 3,
          label: '流量看板-品牌流量排行榜'
        },
        {
          code: 4,
          label: '花费看板-趋势图'
        },
      ],
      rules: {
        username: [{
          required: true,
          message: "请输入账号",
          trigger: "blur",
        }],
        cookie: [{
          required: true,
          message: "请输入Cookie",
          trigger: "blur",
        }],
        cid3: [{
          required: true,
          message: "请选择行业范围",
          trigger: ["blur", "change"],
        }],
        Data1: [{
          required: true,
          validator: validateData1,
          trigger: ["blur", "change"],
        }],
        businessType: [{
          required: true,
          message: "请选择产品线",
          trigger: ["blur", "change"],
        }],
        model: [{
          required: true,
          message: "请选择模块需求",
          trigger: ["blur", "change"],
        }],
      },
      formDisable: false,
      options: null,
      checkAll: false,
      isIndeterminate: false,
      checkAll2: false,
      isIndeterminate2: false,
    };
  },
  computed: {
    busType() {
      return this.form.businessType
    },
    formData() {
      return this.form
    }
  },
  watch: {
    upDialogFlag: {
      handler(newval, oldval) {
        this.show = newval
      },
      immediate: true
    },
    formData: {
      handler(newval, oldval) {
        this.Data1 = ''
        let ckZQ = this.opt_zhouqi.filter(val => {
          return val.code === newval.clickOrOrderDay
        })[0].label
        let ckKJ = this.opt_koujing.filter(val => {
          return val.code === newval.clickOrOrderCaliber
        })[0].label
        let ckGF = this.opt_zengpin.filter(val => {
          return val.code === newval.isGift
        })[0].label
        let ckOD = this.opt_order.filter(val => {
          return val.code === newval.orderStatusCategory
        })[0].label
        this.Data1 = `${ckZQ} - ${ckKJ} - ${ckGF} - ${ckOD}`
      },
      immediate: true,
      deep: true
    },
    busType: {
      handler(newval, oldval) {
        this.Data2 = ''
        newval.forEach((val, idx) => {
          this.Data2 += val + ' - '
        })
        this.Data2 = this.Data2.slice(0, -2)
      },
      // immediate: true,
      deep: true
    },
    fromTag: {
      handler(newval, oldval) {
        const vm = this
        // 查看
        if (newval === 2) {
          vm.ifFirst = false
          vm.ifStep = false
          vm.formDisable = true
          vm.form.cid3 = JSON.parse(vm.row.cid3)
          vm.form.cid3_name = vm.row.cid3_name
          vm.form.isGift = Number(vm.row.isGift)
          vm.form.clickOrOrderDay = Number(vm.row.clickOrOrderDay)
          vm.form.clickOrOrderCaliber = Number(vm.row.clickOrOrderCaliber)
          vm.form.orderStatusCategory = Number(vm.row.orderStatusCategory)
          vm.form.businessType = JSON.parse(vm.row.businessType)
          vm.form.dataType = Number(vm.row.dataType)
          vm.form.model = JSON.parse(vm.row.model)
          vm.form.rangeDate = [vm.row.startDate, vm.row.endDate]

          vm.checkAll2 = vm.form.model.length === vm.opt_model.length;
          vm.isIndeterminate2 = vm.form.model.length > 0 && vm.form.model.length < vm.opt_model.length;
        }
      },
      immediate: true
    },
    selectDay: {
      handler(newval, oldval) {
        const vm = this
        let fn;
        let day = dayjs()
        let year1 = dayjs().subtract(1, 'year')
        switch (vm.form.dataType) {
          case 0:
            fn = function (time) {
              return time.getTime() <= year1 || time.getTime() >= day
            }
            break;
          case 1:
            fn = function (time) {
              return time.getTime() <= year1 ||
                time.getTime() >= day ||
                time.getTime() <= dayjs(newval).subtract(7, 'day') ||
                time.getTime() >= dayjs(newval).add(7, 'day')
            }
            break;
          case 2:
            fn = function (time) {
              return time.getTime() <= year1 ||
                time.getTime() >= day ||
                time.getTime() <= dayjs(newval).subtract(5, 'month') ||
                time.getTime() >= dayjs(newval).add(5, 'month')
            }
            break;
        }
        vm.pickerOptionsStart.disabledDate = fn
      },
      immediate: true
    }
  },
  created() {
    const vm = this
    // 查看
  },
  mounted() {},
  methods: {
    // 获取范围
    getRange(acc) {
      const vm = this
      dapanRange({
        ...acc
      }).then(res => {
        if (res.data.code === 10000) {
          vm.options = res.data.data
          vm.ifFirst = false
          vm.ifStep = false
        } else {
          vm.$msg({
            type: "error",
            msg: res.data.data || res.data.msg,
          });
        }
      })
    },
    closeDialog() {
      this.$emit("close");
    },
    saveEvent() {
      const vm = this
      let obj = {
        ...vm.account,
        ...vm.form,
        startDate: vm.form.rangeDate[0],
        endDate: vm.form.rangeDate[1],
      }
      vm.$refs.form.validate(valid => {
        if (valid) {
          dapanOnline({
            ...obj
          }).then(res => {
            if (res.data.code === 10000) {
              vm.$msg({
                msg: '保存成功'
              });
              vm.closeEvent(1)
            } else {
              vm.$msg({
                type: "error",
                msg: res.data.data || res.data.msg,
              });
            }
          })
        }
      })
    },
    closeEvent(tag) {
      const vm = this
      vm.$emit('close', tag)
      // vm.$refs.account.resetFields()
      vm.$refs.form.resetFields()
      vm.account = {
        username: '',
        cookie: ''
      }
      vm.form = {
        startDate: "",
        endDate: '',
        cid3: [],
        cid3_name: '',
        isGift: 0,
        clickOrOrderDay: 0,
        clickOrOrderCaliber: 0,
        orderStatusCategory: 0,
        businessType: [],
        dataType: 0,
        model: []
      }
      vm.cid3_name_arr = []
      vm.Data1 = ''
      vm.Data2 = ''
      vm.visible1 = ''
      vm.visible2 = ''
      vm.checkAll = false
      vm.isIndeterminate = false
      vm.checkAll2 = false
      vm.isIndeterminate2 = false
      vm.ifFirst = true
      vm.ifStep = true
      vm.formDisable = false
    },
    // 口径
    focusEvent1() {
      this.$refs.refKoujing.showPanel()
    },
    focusEvent2() {
      this.$refs.refQudao.showPanel()
    },
    handleCheckAllChange(val) {
      const vm = this;
      vm.isIndeterminate = false;
      vm.form.businessType = val ? vm.opt_qudao : []
    },
    handleCheckChange(val) {
      let checkedCount = val.length;
      this.checkAll = checkedCount === this.opt_qudao.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.opt_qudao.length;
    },
    handleCheckAllChange2(val) {
      const vm = this;
      vm.isIndeterminate2 = false;
      let arr = []
      vm.opt_model.forEach((item) => {
        arr.push(item.code)
      })
      vm.form.model = val ? arr : []
    },
    handleCheckChange2(val) {
      let checkedCount = val.length;
      this.checkAll2 = checkedCount === this.opt_model.length;
      this.isIndeterminate2 = checkedCount > 0 && checkedCount < this.opt_model.length;
    },
    dateChange() {
      this.form.rangeDate = []
    },
    nextEvent() {
      const vm = this;
      vm.$refs.account.validate(valid => {
        if (valid) {
          vm.getRange(vm.account)
        }
      })
    },
    casaderEvent(cheked) {
      const vm = this
      let cknodes = vm.$refs.casder.getCheckedNodes()[0]
      vm.repeat(cknodes)
    },
    repeat(target) {
      this.cid3_name_arr.unshift(target.label)
      if (target.parent) {
        this.repeat(target.parent)
      } else {
        this.form.cid3_name = this.cid3_name_arr.join('/')
      }
    }
  },
};
</script>

<style lang="less" scoped>
@import "../monitor/bidding.less";

/deep/.dapan {
  .is-disabled {

    input,
    .el-checkbox__label {
      color: #909399 !important;
    }

    .el-checkbox__inner {
      border-color: #7596cc;

      &:before {
        background-color: #0664ff;
      }

      &:after {
        border-color: #0664ff;
        border-width: 2px;
      }
    }

  }
}
</style>
