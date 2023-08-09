<template>
  <div class="strategyNormal">
    <div class="centers">
      <div class="PriceTops">
        <el-form>
          <el-row type="flex" justify="space-between">
            <el-col :span="8">
              <el-form-item class="hasnolab cnt100">
                <el-radio-group v-model="selectTab" fill="#E6A23C" @input="radioEvent">
                  <el-radio-button v-for="(item, idx) in radioOpt" :key="idx" :label="item.label">
                    {{ item.label }}
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="cnt100">
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
                          <el-radio v-for="(item, idx) in opt_zhouqi" :key="idx" :label="item.code">{{ item.label
                          }}</el-radio>
                        </el-radio-group>
                      </div>
                      <div class="radioLine">
                        <span class="radioLine_label">点击/下单口径</span>
                        <el-radio-group class="radioLine_cnt" v-model="form.clickOrOrderCaliber">
                          <el-radio v-for="(item, idx) in opt_koujing" :key="idx" :label="item.code">{{ item.label
                          }}</el-radio>
                        </el-radio-group>
                      </div>
                      <div class="radioLine">
                        <span class="radioLine_label">含赠品/不含赠品</span>
                        <el-radio-group class="radioLine_cnt" v-model="form.giftFlag">
                          <el-radio v-for="(item, idx) in opt_zengpin" :key="idx" :label="item.code">{{ item.label
                          }}</el-radio>
                        </el-radio-group>
                      </div>
                      <div class="radioLine">
                        <span class="radioLine_label">成交/下单订单</span>
                        <el-radio-group class="radioLine_cnt" v-model="form.orderStatusCategory">
                          <el-radio v-for="(item, idx) in opt_order" :key="idx" :label="item.code">{{ item.label
                          }}</el-radio>
                        </el-radio-group>
                      </div>
                    </div>
                  </template>
                </vxe-pulldown>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="hasnolab cnt100">
                <el-date-picker v-model="form.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期"
                  end-placeholder="结束日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"
                  :picker-options="pickerOptionsStart" @blur="dateBlur" :clearable="false">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="ts">
              <el-form-item>
                <el-button v-waves class="el-icon-refresh-right" type="primary" @click="refreshEve">刷新
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-divider content-position="left">项目列表</el-divider>
      <vxe-toolbar ref="toolbarRef">
        <template #tools>
          <el-tooltip effect="light" placement="bottom">
            <div slot="content" class="titleBox">
              <div class="titleBox_group">
                <el-checkbox-group v-model="checkedItems" @change="titleCKEvent" :min="5" :max="15">
                  <el-checkbox v-for="item in tableList" border :label="item.field" :key="item.field">{{ item.title
                  }}</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <div class="el-icon-setting titleBox_out">设置</div>
          </el-tooltip>
          <el-button v-waves type="warning" round class="el-icon-plus btnnormal" @click="addProjEvent">新增项目
          </el-button>
        </template>
      </vxe-toolbar>
      <div class="tabbles pricetable ts" ref="tabbles">
        <vxe-table ref="xTable" border keep-source :column-config="{ resizable: true }" :edit-rules="validRules"
          :edit-config="{ trigger: 'manual', mode: 'row', showStatus: true, autoClear: false }" :expand-config="{
            accordion: true,
            trigger: 'cell',
            iconOpen: 'el-icon-folder-opened', iconClose: 'el-icon-folder',
            toggleMethod: toggleExpandMethod,
          }" class="mytable-scrollbar" auto-resize height="auto" :data="tableData">
          <template #empty>
            <img src="@/assets/images/noneData3.png" />
          </template>
          <vxe-column type="seq" title="序号" width="80"></vxe-column>
          <vxe-column type="expand" title="详情" width="80">
            <template #content="{ row, rowIndex }">
              <div class="expand-wrapper">
                <vxe-table border ref="xTableChild" class="childTable" :data="childTableData" show-footer
                  :row-config="{ isHover: true }" :footer-method="footerMethod" footer-cell-class-name="footerCell">
                  <vxe-column field="account" title="账户" width="25%" fixed="left"></vxe-column>
                  <vxe-column v-for="(item, idx) in childTableList" :field="item.field" :title="item.title"
                    min-width="12%">
                    <template #default="{ row }">
                      <span v-if="item.type === 'per'">{{ Math.abs(row[item.field]) | numberToCurrencyNo }}%</span>
                      <span v-else>{{
                        Math.abs(row[item.field]) | numberToCurrencyNo
                      }}</span>
                    </template></vxe-column>
                  <vxe-column fixed="right" width="9%">
                    <template slot="header">
                    </template>
                    <template slot-scope="scope">
                      <div v-waves class="btn btn_info" @click="deleteAct(scope.row)">
                        <el-tooltip class="item" effect="light" content="删除" placement="top">
                          <i class="el-icon-circle-close"></i>
                        </el-tooltip>
                      </div>
                    </template>
                  </vxe-column>
                </vxe-table>
              </div>
            </template>
          </vxe-column>
          <vxe-column field="project_name" title="项目" width="20%" :edit-render="{}">
            <template #edit="scope">
              <el-input v-model="scope.row.project_name" placeholder="请输入项目名" type="text"
                @input="$refs.xTable.updateStatus(scope)" @clear="" clearable></el-input>
            </template>
          </vxe-column>
          <vxe-column :field="fileldName" title="账号(数量)" width="30%" :edit-render="{}">
            <template #default="{ row }">
              <span>{{ row.num }}</span>
            </template>
            <template #edit="scope">
              <el-select v-model="scope.row.ckAct" reserve-keyword collapse-tags filterable multiple placeholder="请选择账号"
                :multiple-limit="10" clearable @change="changeEvent(scope)">
                <el-option-group label="">
                  <el-option disabled value="34567">
                    <span class="">输入框内可关键字搜索，单次至多选择10项</span>
                  </el-option>
                </el-option-group>
                <el-option v-for="item in accoutOptions" :key="item.account" :label="item.account" :value="item.account">
                </el-option>
              </el-select>
            </template>
          </vxe-column>
          <vxe-column field="create_time" title="创建日期">
          </vxe-column>
          <vxe-column title="操作" fixed="right" width="15%">
            <template #default="{ row }">
              <template v-if="$refs.xTable.isActiveByRow(row)">
                <div v-waves class="btn btn_info " @click="saveItem(row)">
                  <i class="btn_info_wordi btn_info_wordi_save">保存</i>
                </div>
                <div v-waves class="btn btn_info" @click="cancelItem(row)">
                  <i class="btn_info_wordi btn_info_wordi_canc">取消</i>
                </div>
                <div v-waves class="btn btn_info" @click="deleteItem(row)">
                  <el-tooltip class="item" effect="light" content="删除当前项目" placement="top">
                    <i class="el-icon-circle-close"></i>
                  </el-tooltip>
                </div>
              </template>
              <template v-else>
                <div v-waves class="btn btn_info" @click="editItem(row)">
                  <el-tooltip class="item" effect="light" content="编辑" placement="top">
                    <i class="el-icon-edit"></i>
                  </el-tooltip>
                </div>
                <div v-waves class="btn btn_info" @click="outputItem(row)">
                  <el-tooltip class="item" effect="light" content="导出" placement="top">
                    <i class="el-icon-download"></i>
                  </el-tooltip>
                </div>
                <div v-waves class="btn btn_info" @click="deleteItem(row)">
                  <el-tooltip class="item" effect="light" content="删除当前项目" placement="top">
                    <i class="el-icon-circle-close"></i>
                  </el-tooltip>
                </div>
              </template>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
    </div>
    <div class="block">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog title="新增项目" :visible.sync="showDialog" width="35%" max-height="800px" custom-class="dialogJb"
      :close-on-click-modal="false" @close="closeEvent(false)">
      <el-form ref="account" :model="acForm" class="formObj" :rules="rules">
        <el-row :gutter="20">
          <el-col :span="22" class="flexCol">
            <el-form-item label="项目" prop="project_name">
              <el-input v-model.trim="acForm.project_name" placeholder="请输入项目名" clearable>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="账号" prop="accounts">
              <el-select v-model="acForm.accounts" reserve-keyword collapse-tags filterable multiple placeholder="请选择账号"
                :multiple-limit="10">
                <el-option-group label="">
                  <el-option disabled value="34567">
                    <span class="el-icon-search">输入框内可关键字搜索，单次至多选择10项</span>
                  </el-option>
                </el-option-group>
                <el-option v-for="item in accoutOptions" :key="item.account" :label="item.account" :value="item.account">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <a class="btnnormal btnnormal_down marginR" @click="closeEvent(false)">
          <div class="el-icon-close btnSize">取消</div>
        </a>
        <el-button v-waves class="el-icon-check" type="primary" @click="saveEvent">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
  
<script>
import dayjs from "dayjs";
import { projAccount, projOutput, projAdd, projList, projToAccount, projDelete, projActDelete, projEdit, projAddAct } from "@/api/api.js";
import message from "@/mixin/message";
export default {
  components: {
  },
  mixins: [message],
  data () {
    const vm = this
    const accountsValid = ({ cellValue, row }) => {
      if (!row.ckAct || row.ckAct.length === 0) {
        return new Error('请选择账号')
      }
    }
    return {
      fileldName: 'num',
      currentExpend: null,
      currentExpendTT: null,
      currentRow: null,
      selectTab: '账户汇总',
      tableData: [],
      childTableData: [],
      childTableList: [],
      // 总费用、展现、点击、点击率、CPM、CPC、直接订单行、直接订单金额、间接订单行、间接订单金额、总订单行、总订单金额、预售订单行、预售订单金额、点击转化率、ROI、总购物车数、CPA（下单成本）、下单新客数、访客数
      tableList: [
        {
          field: 'impressions',
          title: '展示数',
        },
        {
          field: 'clicks',
          title: '点击数',
        },
        {
          field: 'CTR',
          title: '点击率',
          type: 'per'
        },
        {
          field: 'cost',
          title: '花费',
        },
        {
          field: 'CPM',
          title: '平均千次展示成本',
        },
        {
          field: 'CPC',
          title: '平均点击成本',
        },
        {
          field: 'directOrderCnt',
          title: '直接订单行',
        },
        {
          field: 'directOrderSum',
          title: '直接订单金额',
        },
        {
          field: 'indirectOrderCnt',
          title: '间接订单行',
        },
        {
          field: 'indirectOrderSum',
          title: '间接订单金额',
        },
        {
          field: 'totalOrderCnt',
          title: '总订单行',
        },
        {
          field: 'totalOrderSum',
          title: '总订单金额',
        },
        {
          field: 'totalPresaleOrderCnt',
          title: '预售订单行',
        },
        {
          field: 'totalPresaleOrderSum',
          title: '预售订单金额',
        },
        {
          field: 'totalOrderCVS',
          title: '转化率',
          type: 'per'
        },
        {
          field: 'totalOrderROI',
          title: 'ROI',
        },
        {
          field: 'totalCartCnt',
          title: '总购物车数',
        },
        {
          field: 'CPA',
          title: 'CPA',
        },
        {
          field: 'newCustomersCnt',
          title: '下单新客数',
        },
        {
          field: 'visitorCnt',
          title: '访客数',
        },
      ],
      checkedItems: [
        'CPA', 'CPM', 'totalOrderCnt', 'indirectOrderCnt', 'totalOrderROI'
      ],
      form: {
        clickOrOrderDay: 15, // 转化周期
        clickOrOrderCaliber: 1, // 口径
        giftFlag: 0, // 赠品
        orderStatusCategory: 1, // 订单
        dateRange: [dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
      },
      acForm: {
        project_name: '',
        accounts: []
      },
      showDialog: false,
      accoutOptions: null,
      visible1: '',
      rules: {
        project_name: [{ required: true, message: '请输入项目名', trigger: ['change', 'blur'] }],
        accounts: [{ required: true, message: '请选择账号', trigger: ['change', 'blur'] }]
      },
      validRules: {
        project_name: [
          { required: true, message: '请输入项目名' },
        ],
        ckAct: [
          { required: true, message: '请选择账号' },
          { validator: accountsValid }
        ],
        num: [
          { required: true, message: '请输入账号' },
        ],
      },
      Data1: '',
      pickerOptionsStart: {
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            const end = dayjs().format('YYYY-MM-DD');
            const start = dayjs().format('YYYY-MM-DD');
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '昨天',
          onClick (picker) {
            const start = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
            picker.$emit('pick', [start, start]);
          }
        }, {
          text: '最近7天',
          onClick (picker) {
            const end = dayjs().format('YYYY-MM-DD');
            const start = dayjs().subtract(6, 'day').format('YYYY-MM-DD');
            picker.$emit('pick', [start, end]);
          }
        },
        {
          text: '最近15天',
          onClick (picker) {
            const end = dayjs().format('YYYY-MM-DD');
            const start = dayjs().subtract(14, 'day').format('YYYY-MM-DD')
            picker.$emit('pick', [start, end]);
          }
        },
        {
          text: '最近30天',
          onClick (picker) {
            const end = dayjs().format('YYYY-MM-DD');
            const start = dayjs().subtract(29, 'day').format('YYYY-MM-DD')
            picker.$emit('pick', [start, end]);
          }
        }],
        disabledDate: (time) => {
          let today = dayjs();
          let orgDate = dayjs('2021-06-01')
          let maxDate = dayjs().add(1, "month");
          let minDate = dayjs().subtract(1, "month");
          if (vm.tdata1) {
            let dateRegionMax = dayjs(vm.tdata1).add(1, "month");;
            let dateRegionMin = dayjs(vm.tdata1).subtract(1, "month");
            if (dateRegionMax.isAfter(today)) {
              return time.getTime() >= today || time.getTime() < dateRegionMin || time.getTime() < orgDate;
            } else {
              return time.getTime() >= dateRegionMax || time.getTime() < dateRegionMin || time.getTime() < orgDate;
            }
          } else {
            if (maxDate.isAfter(today)) {
              return time.getTime() >= today || time.getTime() < orgDate
            } else {
              return time.getTime() >= maxDate || time.getTime() < orgDate
            }
          }
        },
        onPick (time) {
          //当第一时间选中才设置禁用
          if (time.minDate && !time.maxDate) {
            vm.tdata1 = time.minDate;
          } else {
            vm.tdata1 = null
          }
        },
      },
      tdata1: null,
      card: [],
      radioOpt: [
        {
          code: 'cardBoxHuizong',
          label: '账户汇总'
        },
        {
          code: 'cardBoxZhanwai',
          label: '站外广告'
        },
        {
          code: 'cardBoxCar',
          label: '快车'
        },
        {
          code: 'cardBoxTuijian',
          label: '推荐广告'
        },
        {
          code: 'cardBoxZhineng',
          label: '智能投放'
        },
      ],
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
      opt_order: [
        {
          code: 1,
          label: '成交订单'
        }, {
          code: 0,
          label: '下单订单'
        },
      ],
      currentPage: 1,
      pagesize: 10,
      total: 0,
    };
  },
  watch: {
    checkedItems: {
      handler (newval, oldval) {
        this.childTableList = this.tableList.filter(val => {
          return newval.includes(val.field)
        })
      },
      immediate: true,
      deep: true
    },
    form: {
      handler (newval, oldval) {
        const vm = this;
        let a = vm.opt_zhouqi.filter((val, idx) => {
          return val.code === newval.clickOrOrderDay
        })[0].label
        let b = vm.opt_koujing.filter((val, idx) => {
          return val.code === newval.clickOrOrderCaliber
        })[0].label
        let c = vm.opt_zengpin.filter((val, idx) => {
          return val.code === newval.giftFlag
        })[0].label
        let d = vm.opt_order.filter((val, idx) => {
          return val.code === newval.orderStatusCategory
        })[0].label
        vm.Data1 = `${a} / ${b} / ${c} / ${d}`
        if (vm.currentRow) {
          vm.toggleExpandMethod({
            expanded: true,
            row: vm.currentRow
          })
        }
      },
      immediate: true,
      deep: true
    }
  },
  created () {
    let storage = localStorage.getItem('tilteRule')
    if (storage) {
      this.checkedItems = JSON.parse(storage)
    }
  },
  mounted () {
    const vm = this
    vm.getProjList()
    vm.getAccoutList()
  },
  methods: {
    radioEvent () {
      const vm = this
      let res = JSON.parse(JSON.stringify(vm.currentExpend))
      vm.childTableData = []
      for (let i in res) {
        for (let j in res[i]) {
          if (j !== '账户余额') {
            vm.$set(res[i][j], 'account', i)
            vm.$set(res[i][j], 'project_name', vm.currentRow.project_name)
            vm.$set(res[i][j], 'project_id', vm.currentRow.id || vm.currentRow.project_id)
          }
        }
      }
      for (let i in res) {
        vm.childTableData.push(res[i][vm.selectTab])
      }
    },
    // 获取账号
    getAccoutList () {
      const vm = this;
      projAccount().then(res => {
        if (res.data.code === 10000) {
          vm.accoutOptions = res.data.data
        } else {
          vm.$msg({
            type: "error",
            msg: res.data.data || res.data.msg,
          });
        }
      })
    },
    closeEvent (tag) {
      const vm = this;
      vm.showDialog = false
      vm.currentPage = 1;
      vm.pagesize = 10;
      vm.$refs.account.resetFields()
      if (tag) {
        vm.getProjList()
      }
    },
    // 新增项目
    saveEvent () {
      const vm = this;
      let accounts = vm.accoutOptions.filter(val => {
        return vm.acForm.accounts.includes(val.account)
      })
      vm.$refs.account.validate(valid => {
        if (valid) {
          projAdd({
            ...vm.acForm,
            accounts
          }).then(res => {
            if (res.data.code === 10000) {
              vm.$msg({
                msg: "项目新增成功"
              });
              vm.closeEvent(true)
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
    // 获取项目列表
    getProjList () {
      const vm = this
      projList({
        page: vm.currentPage,
        page_size: vm.pagesize
      }).then(res => {
        if (res.data.code === 10000) {
          vm.tableData = res.data.data
          vm.total = res.data.total
        } else {
          vm.$msg({
            type: "error",
            msg: res.data.data || res.data.msg,
          });
        }
      })
    },
    toggleExpandMethod ({ expanded, row }) {
      const vm = this
      vm.currentExpend = null
      vm.currentExpendTT = null
      vm.childTableData = []
      if (expanded) {
        return projToAccount({
          ...vm.form,
          project_name: row.project_name,
          start_data: vm.form.dateRange[0],
          end_data: vm.form.dateRange[1],
        }).then(res => {
          if (res.data.code === 10000) {
            vm.currentRow = row
            vm.currentExpend = res.data.data
            vm.currentExpendTT = res.data.total
            vm.radioEvent()
            return true
          }
        })
      }
    },
    refreshEve () {
      this.getProjList()
      this.currentRow = null
    },
    titleCKEvent (value) {
      const $table = this.$refs.xTableChild
      if ($table)
        $table.updateFooter()
      localStorage.setItem('tilteRule', JSON.stringify(value))
    },
    footerMethod ({ columns, data }) {
      const vm = this
      let sums = []
      columns.forEach((column, columnIndex) => {
        if (columnIndex === 0) {
          sums.push('合计')
        } else {
          if (vm.currentExpendTT) {
            sums.push(vm.currentExpendTT[vm.selectTab][column.field])
          } else {
            sums.push('')
          }
        }
      })
      // 返回一个二维数组的表尾合计
      return [sums]
    },
    // 
    editItem (row) {
      const vm = this
      vm.fileldName = 'ckAct'
      const $table = this.$refs.xTable
      $table.clearRowExpand()
      $table.setActiveRow(row)
      projToAccount({
        ...vm.form,
        project_name: row.project_name,
        start_data: vm.form.dateRange[0],
        end_data: vm.form.dateRange[1],
      }).then(async res => {
        if (res.data.code === 10000) {
          let result = Object.keys(res.data.data)
          row.ckAct = result.map((val, idx) => {
            if (val.includes('(')) {
              let start = val.indexOf('(')
              let end = val.indexOf(')')
              return val.slice(start + 1, end)
            } else {
              return val
            }
          })
        }
      })
    },
    changeEvent (scope) {
      const vm = this;
      if (scope.row.ckAct.length === 0) {
        scope.row.ckAct = null
      }
      vm.$refs.xTable.updateStatus(scope)
    },
    selectevent (val) {
    },
    async saveItem (row) {
      const vm = this
      const $table = this.$refs.xTable
      const errMap = await $table.fullValidate().catch(errMap => errMap)
      console.log(errMap)
      if (!errMap) {
        let accounts = vm.accoutOptions.filter(val => {
          return row.ckAct.includes(val.account)
        })
        row.loading = true
        $table.clearActived().then(() => {
          projEdit({
            id: row.id,
            project_name: row.project_name,
            accounts,
          }).then(res => {
            if (res.data.code === 10000) {
              row.loading = false
              vm.getProjList()
              vm.$msg({
                msg: '修改成功'
              });
              vm.fileldName = 'num'
            } else {
              vm.$msg({
                type: "error",
                msg: res.data.data || res.data.msg,
              });
            }
          })
        })
      }
    },
    cancelItem () {
      const $table = this.$refs.xTable
      $table.revertData()
      $table.clearActived()
    },
    // 导出
    outputItem (row) {
      const vm = this;
      projOutput({
        ...vm.form,
        project_name: row.project_name,
        start_data: vm.form.dateRange[0],
        end_data: vm.form.dateRange[1],
      }).then(res => {
        let data = res.data;
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", `多账号概况-${row.project_name}.xlsx`);
        document.body.appendChild(link);
        link.click();
      })
    },
    // 删除项目
    deleteItem (row) {
      const vm = this;
      vm.openMessageBox({
        type: "warning",
        showClose: true,
        showCancelButton: true,
        tipTitle: "确定删除当前项目：",
        curItem: `${row.project_name}？`,
        confirmButtonFn: () => {
          vm.api_del_proj(row)
        },
      });
    },
    // 删除项目下账号
    deleteAct (row) {
      const vm = this;
      vm.openMessageBox({
        type: "warning",
        showClose: true,
        showCancelButton: true,
        tipTitle: `是否从项目【${row.project_name}】下删除账号：`,
        curItem: `${row.account}？`,
        confirmButtonFn: () => {
          vm.api_del_act(row)
        },
      });
    },
    api_del_proj (row) {
      const vm = this
      projDelete({
        project_name: row.project_name,
      }).then(res => {
        if (res.data.code === 10000) {
          vm.$msg({
            msg: '删除成功'
          });
          vm.getProjList()
        } else {
          vm.$msg({
            type: "error",
            msg: res.data.data || res.data.msg,
          });
        }
      })
    },
    api_del_act (row) {
      const vm = this
      projActDelete({
        account_name: row.account,
        project_name: row.project_name,
      }).then(async res => {
        if (res.data.code === 10000) {
          let result = await projList({
            page: vm.page,
            page_size: vm.page_size
          })
          if (result.data.code === 10000) {
            vm.tableData = result.data.data
            vm.total = result.data.total
            // 获取当前展开第几行
            for (let i in vm.tableData) {
              if (vm.tableData[i].project_name === row.project_name) {
                vm.$refs.xTable.toggleRowExpand(vm.tableData[i])
                break
              }
            }
          }
          vm.$msg({
            msg: '删除成功'
          });
        } else {
          vm.$msg({
            type: "error",
            msg: res.data.data || res.data.msg,
          });
        }
      })
    },
    // 新增
    addProjEvent () {
      this.showDialog = true
    },
    dateBlur (val) {
      this.tdata1 = null
    },
    focusEvent1 () {
      this.$refs.refKoujing.showPanel()
    },
    // 
    handleSizeChange (val) {
      this.pagesize = val;
      this.getProjList();
    },
    handleCurrentChange (val) {
      this.currentPage = val;
      this.getProjList();
    },
  },
};
</script>
  
<style lang="less" scoped>
@import "index.less";
@import "@/views/index.less";
@import "@/views/Qianchuan/strategy/index.less";



.expand-wrapper {
  padding: 20px;
}

/deep/.vxe-custom {
  &--option-wrapper {
    width: 500px;
  }

  &--body {
    display: flex;
    flex-wrap: wrap;

    li {
      min-width: auto !important;
      max-width: auto !important;
      flex-basis: 33% !important;
      margin: 3px 0;
    }

  }
}

/deep/.childTable .footerCell {
  background: #dcdcdc;
}

.fixtool {
  position: absolute;
  left: -30px;
  top: 50%;
  transform: translateY(-50%);

  &:before {
    font-size: 20px;
  }
}
</style>
  