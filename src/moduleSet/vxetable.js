// VXEtable组件全局引入
import Vue from 'vue'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
Vue.use(VXETable)

// // VXEtable组件按需引入
// // import 'xe-utils'
// // import VXETable from 'vxe-table'
// // ----------------------------------------------------
// import Vue from 'vue'
// import XEUtils from 'xe-utils'
// import 'vxe-table/lib/style.css'
// import {
//   // 核心组件
//   VXETable,
//   Input,
//   // 功能组件
//   Edit,
//   // 可选组件
//   Toolbar,
//   Column,
//   Colgroup,
//   Button,
//   Tooltip,
//   Pulldown,
//   Table
// } from 'vxe-table'
// let comp = {
//   // 核心组件
//   VXETable,
//   // 表格功能组件
//   Edit,
//   // 可选组件
//   Toolbar,
//   Column,
//   Colgroup,
//   Button,
//   Pulldown,
//   Tooltip,
//   Input,
//   Table,
// }

// Object.keys(comp).forEach(key => {
//   Vue.use(comp[key])
// })