// VXEtable组件全部引入
// import 'xe-utils'
// import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
// ----------------------------------------------------
// VXEtable组件按需引入
import Vue from 'vue'
import XEUtils from 'xe-utils'
import {
  // 核心组件
  VXETable,
  Input,
  Header,
  // 功能组件
  Edit,
  // 可选组件
  Toolbar,
  Column,
  Colgroup,
  Button,
  Tooltip,
  Pulldown,
  Table
} from 'vxe-table'
// 表格
Vue.use(Edit)
// 可选
Vue.use(Column).use(Toolbar).use(Colgroup).use(Button).use(Pulldown).use(Header).use(Tooltip).use(Input).use(Table)