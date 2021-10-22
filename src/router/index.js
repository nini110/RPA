import Vue from 'vue'
import NProgress from 'nprogress'
import nprogress from 'nprogress/nprogress.css'
import VueRouter from 'vue-router'
import routes from './routes'
Vue.use(VueRouter)

const router = new VueRouter({
  routes,
  mode:'hash'
})

NProgress.configure({ showSpinner:false })
router.beforeEach(function (to, from, next) {
	// if(to.path != '/login') {
	// 	// check方法调用接口,判断用户是否登录!
	// 	check();
	// }
  if (to.meta.needLogin) {
    //从cookie中获取用户信息，判断是否已登录
    if (localStorage.getItem('wx_userid')) {
      next(); //表示已经登录
    } else {
      //未登录
      // next可以传递一个路由对象作为参数 表示需要跳转到的页面
      next({
        name: "login",
        query: {redirect: to.meta.redirect} //登录后再跳回此页面时要做的配置
      });
	next(); //表示已经登录
    }
  } else {
    //表示不需要登录
    next(); //继续往后走
  }
})

router.beforeEach((to,from,next)=>{
  //开始
  NProgress.start()
  //继续路由
  next()
})
router.afterEach((transition)=>{
  //结束进度条
  NProgress.done()
})

export default router
