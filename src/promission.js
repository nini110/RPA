import router from './router'
import routes from './router/routes'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import login from '@/views/Login/index.vue'

import layout from '@/views/layout'
// 获取组件的方法    本地和生产环境的import方法不一样  
const _import = require('./router/_import_' + process.env.NODE_ENV)

NProgress.configure({
    showSpinner: false
}) // NProgress Configuration
let getRouter; // 用来获取后台拿到的路由
let flag = true
router.beforeEach((to, from, next) => {
    let userid = localStorage.getItem('wx_userid')
    NProgress.start()
    // 不加这个判断，路由会陷入死循环、
    // 注：因为routerGo方法中next方法具有参数，即中断当前导航，执行新导航，而不是放行的意思，所以会无线循环下去，next()为放行
    if (!getRouter) {
        getRouter = handleRoutes(routes); // 后台拿到路由
        routerGo(to, next)
        NProgress.done()
    } else if (getRouter && userid && flag) { // userid拿到之后，重新处理路由，将flag变为false，避免无限定向
        flag = false
        getRouter = handleRoutes(routes); // 后台拿到路由
        routerGo(to, next)
    } else {
        next();
        NProgress.done()
    }
});
// 动态加入路由元素
function handleRoutes(menuList) {
    let ret = [];
    if (!menuList || menuList.length <= 0) {
        return
    }
    let whitelist = ['19261', '19302', '20306', '1020108', '21400', '14026', '15443', '18179', '15056', '18327', '21129', '21027', '1020076', '1022002']
    let userid = localStorage.getItem('wx_userid')
    for (let i in whitelist) {
        if (whitelist[i] === userid) {
            menuList.forEach((val, idx) => {
                if (val.name === 'layout') {
                    val.children.push({
                        path: 'expend',
                        name: 'Expend',
                        meta: {
                            deep: 2
                        },
                        component: () => import("@/views/Expend"),
                        children: [{
                                path: 'chart',
                                name: 'chart',
                                meta: {
                                    title: '消耗图表',
                                    deep: 3,
                                    filePath: 'Expend/chart'
                                },
                                component: () => import( /* webpackChunkName: "R_Expend"*/ "@/views/Expend/chart"),
                            },
                            {
                                path: 'selfBrand',
                                name: 'selfBrand',
                                meta: {
                                    title: '自有品牌',
                                    deep: 3,
                                    filePath: 'Expend/selfBrand'
                                },
                                component: () => import( /* webpackChunkName: "R_Expend"*/ "@/views/Expend/selfBrand"),
                            },
                            {
                                path: 'bidItem',
                                name: 'bidItem',
                                meta: {
                                    title: '竞标项目',
                                    deep: 3,
                                    filePath: 'Expend/bidItem'
                                },
                                component: () => import( /* webpackChunkName: "R_Expend"*/ "@/views/Expend/bidItem"),
                            }
                        ]
                    });
                }
            })
            break
        }
    }
    ret = [...menuList]
    return ret
}
// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap) {
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

function routerGo(to, next) {
    getRouter = filterAsyncRouter(getRouter); // 过滤路由
    // router.selfaddRoutes(getRouter); // 动态添加路由
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