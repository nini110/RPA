import Vue from 'vue'
// import 'lib-flexible/flexible.js'
import App from './App.vue'
import store from './store'
import axios from 'axios'
import qs from 'qs'
import ElementUI from 'element-ui';

import format from './utils/format';
import './utils/global'// 全局

import directives from '@/directive'
import './promission'// 这里进行路由后台获取的模拟
import './utils/rem' //px转rem
import '../element-#287BB5/index.css'
import './styles/index.less'
import './assets/fonts/iconfont.css';
import './assets/fonts/iconfont.js';

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
Vue.use(ElementUI);

Vue.prototype.check = check
Vue.prototype.$axios = axios
Vue.prototype.qs = qs
Vue.prototype.$echarts = echarts
Vue.prototype.$msg = function(options) {
	let iconcls;
	if(options.type === 'error') {
		iconcls = '#icon-cuowu'
	} else if(options.type === 'warning'){
		iconcls = '#icon-jinggao1'
	} else {
		iconcls = '#icon-chenggong'
	}
	const msg = this.$message({
		dangerouslyUseHTMLString: true, // 将dangerouslyUseHTMLString属性设置为 true，message 就会被当作 HTML 片段处理。
		message: `
		<svg class="icon svg-icon titleicon" aria-hidden="true">
			<use xlink:href="${iconcls}"></use>
		</svg>
		<p class="el-message__content">${options.msg}</p>
		`,
		duration: options.duration || 2000,
		center: true
	  })
	  return msg
}

Vue.prototype.DomainName = 'http://192.168.90.209:5000';
// Vue.prototype.DomainName = 'http://tool.afocus.com.cn';

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
