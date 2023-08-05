import router from './router'
import routes from './router/routes'
import { routesRel } from './api/api.js'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import login from './views/Login/index.vue'
// import store from './store/index.js'

import layout from '@/views/layout'
// 获取组件的方法    本地和生产环境的import方法不一样  
const _import = require(`./router/_import_${process.env.NODE_ENV}`)

NProgress.configure({
  showSpinner: false
}) // NProgress Configuration
let getRouter; // 用来获取后台拿到的路由
let flag = true
router.beforeEach(async (to, from, next) => {
  if (to.query.wx_userid) {
    localStorage.setItem("wx_code", to.query.wx_code);
    localStorage.setItem("wx_userid", to.query.wx_userid);
    localStorage.setItem("user_name", to.query.user_name);
    localStorage.setItem("thumb_avatar", to.query.thumb_avatar);
  }
  NProgress.start()
  if (!getRouter) {
    getRouter = await handleRoutes(routes); // 后台拿到路由
    routerGo(to, next)
    NProgress.done()
  } else {
    if (to.name === 'login') {
      if (localStorage.getItem('wx_code')) {
        let toinfo = sessionStorage.getItem("toInfo");
        next(toinfo ? toinfo.slice(1) : '/layout/beijingMustPass/DMP')
      } else {
        next()
        NProgress.done()
      }
    } else {
      sessionStorage.setItem('toInfo', to.fullPath)
      if (localStorage.getItem('wx_code')) {
        if (to.meta.limit) {
          next()
        } else {
          next({
            path: '/403'
          })
        }
        NProgress.done()
      } else {
        next({
          path: '/login'
        })
      }
    }
  }
});
// 动态加入路由元素
async function handleRoutes (menuList) {
  const vm = this
  let target = JSON.parse(JSON.stringify(menuList))
  let ret = [];
  if (!target || target.length <= 0) {
    return
  }
  let apiRes = await routesRel({ aa: 'a' })
  // console.log(apiRes)
  if (apiRes && apiRes.data.code === 10000) {
    let result = apiRes.data.data
    let tagRes = result.reduce((pre, cur) => {
      return cur.status === '1' ? pre.concat(cur.path_name) : pre
    }, [])

    target[2].children.forEach((val, idx) => {
      val.children.forEach((val1, idx1) => {
        val1.meta.limit = tagRes.includes(val1.meta.title)
      })
    })
  }
  // // 开发--临时
  // let whitelist2 = ['1020108', '17379', '19302', '21400']
  // if (userid && whitelist2.indexOf(userid) === -1) {
  //   target[2].children[7].children.map((val, idx) => {
  //     if (idx === 3) {
  //       val.meta.hasLimit = true
  //     }
  //     return val
  //   })
  // }
  ret = [...target]
  return ret
}
// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter (asyncRouterMap) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (route.path !== '/') {
      if (route.meta.deep === 1) {
        if (route.name === 'layout') { // Layout组件特殊处理
          route.component = layout
        } else if (route.name === 'login') { // Layout组件特殊处理
          route.component = login
        } else {
          route.component = _import(route.name)
        }
      } else if (route.meta.deep === 2) {
        route.component = _import(route.name)
      } else {
        route.component = _import(route.meta.filePath)

      }
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children)
      }
    }
    return true
  });

  return accessedRouters
}

function routerGo (to, next) {
  getRouter = filterAsyncRouter(getRouter); // 过滤路由
  // 防止动态添加的路由刷新404问题  需要在添加完之后再加入404，不要写在routes.js中
  getRouter.push({
    path: '*',
    name: '404',
    meta: {
      deep: 1
    },
    component: () => import( /* webpackChunkName: "R_404"*/ "@/views/404"),
  })
  router.selfaddRoutes(getRouter); // 动态添加路由
  global.antRouter = getRouter; // 将路由数据传递给全局变量，做侧边栏菜单渲染工作
  next({
    ...to,
    replace: true
  })
}
router.afterEach(() => {
  NProgress.done()
})