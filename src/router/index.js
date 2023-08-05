import Vue from 'vue'
import NProgress from 'nprogress'
import VueRouter from 'vue-router'
import routes from './routes'

Vue.use(VueRouter)
const router = new VueRouter({
  routes,
  mode: 'hash'
})

router.selfaddRoutes = function (params) {
  router.matcher = new VueRouter().matcher;
  router.addRoutes(params)
}

NProgress.configure({
  showSpinner: false
})

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}



export default router