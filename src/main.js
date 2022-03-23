import Vue from 'vue'
// import 'lib-flexible/flexible.js'
import App from './App.vue'
import store from './store'
import axios from 'axios'
import qs from 'qs'
import router from './router'
// 全屏滚动
import VueFullPage  from 'vue-fullpage.js'
// import "./styles/fullpage.min.css"
import 'fullpage.js/vendors/scrolloverflow'
//ElementUI按需引入
import '@/moduleSet/elementui.js';
// VXEtable组件
import '@/moduleSet/vxetable.js';
// echarts按需引入
import '@/moduleSet/echarts.js'
import './utils/global'// 全局
// 自定义指令文件
import directives from '@/directive'
// 格式化文件、
import format from './utils/format';
// 权限 路由文件
import './promission'
// px转rem
import './utils/rem'
// elementui主题文件和iconfont
import '../element-#287BB5/index.css'
import './assets/fonts/iconfont.css';
import './assets/fonts/iconfont.js';
import './styles/index.less'
// 接口校验文件
import check from '@/utils/loginCheck.js';
// error log
import './components/errorLog/index.js'

Vue.prototype.check = check
Vue.prototype.$axios = axios
Vue.prototype.qs = qs
Vue.use(VueFullPage )

// Vue.prototype.DomainName = 'http://192.168.90.209:5000';
Vue.prototype.DomainName = 'http://tool.afocus.com.cn';
Object.keys(format).forEach(key => {
	Vue.filter(key, format[key])
})

Object.keys(directives).forEach(key => {
	Vue.directive(key, directives[key])
})
Vue.config.productionTip = false
new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
