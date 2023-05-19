import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import VuexPersistence from 'vuex-persist';

Vue.use(Vuex)

const vuexSession = new VuexPersistence({
  key: 'noncar_rb_vuex',
  storage: window.sessionStorage
});
// // https://webpack.js.org/guides/dependency-management/#requirecontext
// const modulesFiles = require.context('./modules', true, /\.js$/)
// // you do not need `import app from './modules/app'`
// // it will auto require all vuex module from modules file
// const modules = modulesFiles.keys().reduce((modules, modulePath) => {
//   // set './app.js' => 'app'
//   const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
//   const value = modulesFiles(modulePath)
//   modules[moduleName] = value.default
//   return modules
// }, {})

const modulesFiles = require.context('./modules', true, /\.js$/)
const path = require('path')
const modules = {}
modulesFiles.keys().forEach((val, idx) => {
  const pathname = path.basename(val, '.js')
  modules[pathname] = modulesFiles(val).default
})

const store = new Vuex.Store({
  modules,
  getters,
  strict: false,
  plugins: [vuexSession.plugin]
});
export default store
