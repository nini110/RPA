import Vue from 'vue'
import NProgress from 'nprogress'
import VueRouter from 'vue-router'
import routes from './routes'

Vue.use(VueRouter)
const router = new VueRouter({
  routes,
  mode: 'hash'
})


NProgress.configure({
  showSpinner: false
})
router.beforeEach(function (to, from, next) {
  if (to.meta.needLogin) {
    if (localStorage.getItem('wx_userid')) {
      next(); //表示已经登录
    } else {
      next({
        name: "login",
        query: {
          redirect: to.meta.redirect
        } //登录后再跳回此页面时要做的配置
      });
      next(); //表示已经登录
    }
  } else {
    next(); //继续往后走
  }
})

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}



export default router