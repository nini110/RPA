<template>
<!-- 上传竞标 -->
<el-dialog title="新增计划" :visible.sync="show" width="35%" max-height="800px" custom-class="dialogJb" :close-on-click-modal="false" @close="closeEvent(0)">
  <el-form v-if="ifFirst" ref="account" :model="account" class="formObj dapan" :rules="rules">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form-item label="账号类型" prop="user_type">
          <el-radio-group v-model="account.user_type" @input="readioEvent">
            <el-radio label="京准通" border></el-radio>
            <el-radio label="京牌代理" border></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <!-- <el-form-item v-if="account.user_type==='京牌代理'" label="账号">
          <span style="color: #909399">灵狐科技股份有限公司</span>
        </el-form-item> -->
        <el-form-item v-if="account.user_type==='京牌代理'" label="PIN" prop="username">
          <el-select v-model="account.username" placeholder="请选择PIN" filterable clearable>
            <el-option v-for="item in pinOptions" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-else label="账号" prop="username">
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
          <el-select v-model="form.dataType" placeholder="请选择类型" @change="dateChange">
            <el-option label="周期" :value="0"></el-option>
            <el-option label="分日" :value="1"></el-option>
            <el-option label="分月" :value="2"></el-option>
          </el-select>
          <el-date-picker v-model="form.rangeDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable @blur="dateBlurEvent" :picker-options="pickerOptionsStart">
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
          <el-cascader v-else ref="casder" v-model="form.cid3" :options="options" :show-all-levels="false" :props="{expandTrigger: 'hover', value: 'id', label: 'name', multiple: true, emitPath: false}" @change="casaderEvent"></el-cascader>
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
  dapanOnline,
  pinSelect
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
      pinOptions: null,
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
          } else {
            vm.selectDay = null
          }
        },
      },
      selectDay: null,
      show: false,
      rangeDate: [],
      account: {
        user_type: '京准通',
        username: '',
        cookie: ''
        // username: 'Samsung-BF',
        // cookie: 'language=zh_CN; cn_language=zh_CN; __jdu=16774677218671515249824; retina=1; cid=9; webp=1; visitkey=8445909280438123745; mba_muid=16774677218671515249824; __wga=1677832318047.1677832318047.1677832318047.1677832318047.1.1; sc_width=1708; _gia_s_local_fingerprint=ed92b19585a94899e8d8014533371d2e; equipmentId=H5A323YXNVOVAM4P3XQQAGCT5AFKZLCGNUIQWORAMAMJTG6USMSFOFSE7MXCGEO5PCLZDKR7WAKANCD5IIQEOIWX7Y; fingerprint=ed92b19585a94899e8d8014533371d2e; deviceVersion=110.0.0.0; deviceOS=; deviceOSVersion=; deviceName=Chrome; shshshfp=c5bddfd350cb7dc24a80bd423fcb2a33; shshshfpa=81eae257-8598-e87e-2be1-b0ea9951b48e-1677832319; shshshfpx=81eae257-8598-e87e-2be1-b0ea9951b48e-1677832319; _gia_s_e_joint={"eid":"H5A323YXNVOVAM4P3XQQAGCT5AFKZLCGNUIQWORAMAMJTG6USMSFOFSE7MXCGEO5PCLZDKR7WAKANCD5IIQEOIWX7Y","ma":"","im":"","os":"Windows 10","ip":"218.244.52.190","ia":"","uu":"","at":"5"}; shshshfpb=lTJD1Sug3sUleJdNirrygbA; pinId=1jCpN6r6DTyJFA3cGm3mwQ; pin=Samsung-BF; unick=Samsung-BF; _tp=PHCuVjMa4QlP%2FBgMMf0RDA%3D%3D; _pst=Samsung-BF; __jdv=146207855|baidu|-|organic|notset|1678775377049; ceshi3.com=000; logining=1; 3AB9D23F7A4B3C9B=H5A323YXNVOVAM4P3XQQAGCT5AFKZLCGNUIQWORAMAMJTG6USMSFOFSE7MXCGEO5PCLZDKR7WAKANCD5IIQEOIWX7Y; TrackID=15DCGYlBa5VMP2cSiNopq1vZHWP9X38p1mSmUBtoWbEaxa9MPFafNE3RJgBlndmoLgFgjnkTEDcaZpRi-dS7ay1Cb15NzLfczcDEJs3XjRFg; thor=D721CB7F333FD47AAEC0097C1F3D549C7240BE3C89A1C354A629539DC530AAB5293FB8D4C03285885D985DE0D627547E0399E48C69E4983D352707A2467391842F02040FA9810002AFC327AA56055A60A7391B56B9CFE54C41A937C4FE4E595D275AE9CF48A70DEB7DE203CC9A2B9CE09F14B00878BA92F1837822DA4F7237084C3A8CF6F7FD031B5BFC8FA6E0C3A8DB; __jda=146207855.16774677218671515249824.1677467722.1678946869.1678953686.24; __jdb=146207855.6.16774677218671515249824|24.1678953686; __jdc=146207855'
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
        user_type: [{
          required: true,
          message: "请选择账号类型",
          trigger: "blur",
        }],
        rangeDate: [{
          required: true,
          message: "请选择日期",
          trigger: "blur",
        }],
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
    Data2() {
      return this.form.businessType.join(' -- ')
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
        this.Data1 = `${ckZQ} -- ${ckKJ} -- ${ckGF} -- ${ckOD}`
      },
      immediate: true,
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
          vm.form.user_type = vm.row.user_type
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
        if (newval) {
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
        } else {
          fn = function (time) {
            return time.getTime() <= year1 || time.getTime() >= day
          }
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
  mounted() {
    this.getPin()
  },
  methods: {
    // 获取pin下拉
    getPin() {
      const vm = this;
      pinSelect().then((res) => {
        if (res.data.code === 10000) {
          vm.pinOptions = res.data.data;
        }
      });
    },
    // 获取范围
    getRange(acc) {
      const vm = this
      dapanRange({
        ...acc
      }).then(res => {
        if (res.data.code === 10000) {
          let result = res.data.data
          // 
          result.forEach((val, idx) => {
            this.$set(val, 'disabled', false)
          })
          vm.options = result
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
      // vm.$refs.form.resetFields()
      vm.account = {
        user_type: '京准通',
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
    readioEvent() {
      this.account.username = ''
      this.account.cookie = ''
    },
    dateBlurEvent() {
      const vm = this
      // 日期失焦需要重新调整禁选日期
      let day = dayjs()
      let year1 = dayjs().subtract(1, 'year')
      if (vm.selectDay) {
        let fn = function (time) {
          return time.getTime() <= year1 || time.getTime() >= day
        }
        vm.pickerOptionsStart.disabledDate = fn
      }
    },
    casaderEvent(cheked) {
      const vm = this
      let str = ''
      let cknodes = vm.$refs.casder.getCheckedNodes(true)
      let parentCode;
      let fn = function (item) {
        if (item.parent) {
          fn(item.parent)
        } else {
          parentCode = item.value
        }
      }
      if (cknodes.length > 0) {
        fn(cknodes[0])
        vm.options.forEach((val, idx) => {
          if (val.id !== parentCode) {
            val.disabled = 'disabled'
          }
        })
      } else {
        vm.options.forEach((val, idx) => {
          this.$set(val, 'disabled', false)
        })
      }
      for (let i of cknodes) {
        str += i.label + ' -- '
      }
      vm.form.cid3_name = str.slice(0, -3)
    },
  },
};
</script>

<style lang="less" scoped>
@import "../monitor/bidding.less";

/deep/.dapan {
  .el-cascader__tags {
    left: 4px;
  }

  .el-radio {

    &.is-bordered {
      margin-right: 10px;
    }
  }

  .is-disabled {

    input,
    .el-radio__label,
    .el-checkbox__label {
      color: #909399 !important;
    }

    &.is-checked .el-radio__inner {
      border-color: #7596cc;
      background-color: #0664ff;

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
