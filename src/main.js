import Vue from 'vue'
// import 'lib-flexible/flexible.js'
import App from './App.vue'
import store from './store'
import axios from 'axios'
import qs from 'qs'
import ElementUI from 'element-ui';
import './utils/rem'  //px转rem
import 'element-ui/lib/theme-chalk/index.css';
import './styles/index.less'
import './assets/fonts/iconfont.css';
// import less from 'less'
import router from './router'

import * as echarts from 'echarts';

// Vue.use(less)

import check from '@/utils/loginCheck.js';
Vue.prototype.check = check
Vue.prototype.$axios = axios
Vue.prototype.qs = qs
Vue.prototype.$echarts = echarts
Vue.use(ElementUI);
// Vue.prototype.DomainName = 'http://192.168.90.35:5005';
Vue.prototype.DomainName = 'http://tool.afocus.com.cn:5005';

Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
