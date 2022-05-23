// VXEtable组件全部引入
// import 'xe-utils'
// import VXETable from 'vxe-table'
// import 'vxe-table/lib/style.css'
// ----------------------------------------------------
// VXEtable组件按需引入
import Vue from 'vue'
import XEUtils from 'xe-utils'
import {
    // 核心组件
    VXETable,
    Header,
    // 可选组件
    Toolbar,
    Column,
    Colgroup,
    Button,
    Table,
    Tooltip
} from 'vxe-table'
Vue.use(Toolbar).use(Colgroup).use(Button).use(Header).use(Column).use(Tooltip).use(Table)