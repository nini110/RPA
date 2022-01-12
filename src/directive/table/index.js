import tables from './table'

const install = function(Vue) {
  Vue.directive('tables', tables)
}

if (window.Vue) {
  window.tables = tables
  Vue.use(install); // eslint-disable-line
}

tables.install = install
export default tables
