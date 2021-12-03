import Vue from 'vue'
// import 'lib-flexible/flexible.js'
import App from './App.vue'
import store from './store'
import axios from 'axios'
import qs from 'qs'
import ElementUI from 'element-ui';
import format from './utils/format';
import './utils/rem' //px转rem
import '../element-#287BB5/index.css'
import './styles/index.less'
import './assets/fonts/iconfont.css';
// import less from 'less'
import router from './router'
import * as echarts from 'echarts';

// Vue.use(less)

import check from '@/utils/loginCheck.js';
import Darkmode from 'darkmode-js';


const options = {
	bottom: 'unset', // default: '32px'
	right: 'unset', // default: '32px'
	left: 'unset', // default: 'unset'
	time: '0.5s', // default: '0.3s'
	mixColor: '#fff', // default: '#fff'
	backgroundColor: '#fff', // default: '#fff'
	buttonColorDark: '#fff', // default: '#100f2c'
	buttonColorLight: '#fff', // default: '#fff'
	saveInCookies: true, // default: true,
	label: '🌓', // default: ''
	// label: '切换主题', // default: ''
	autoMatchOsTheme: true // default: true
}
// const darkmode = new Darkmode(options);
// darkmode.showWidget();

Vue.prototype.check = check
Vue.prototype.$axios = axios
Vue.prototype.qs = qs
Vue.prototype.$echarts = echarts
Vue.use(ElementUI);
// Vue.prototype.DomainName = 'http://192.168.90.35:5005';
Vue.prototype.DomainName = 'http://tool.afocus.com.cn:5005';

Object.keys(format).forEach(key => {
	Vue.filter(key, format[key])
})
Vue.config.productionTip = false
new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
