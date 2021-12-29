import router from './router'
import routes from './router/routes'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import login from '@/views/login.vue'
import layout from '@/views/layout'
import layout2 from '@/views/layout/index2.vue'
const _import = require('./router/importFn'); // 获取组件的方法

NProgress.configure({
    showSpinner: false
}) // NProgress Configuration
let getRouter; // 用来获取后台拿到的路由
router.beforeEach((to, from, next) => {
    NProgress.start()
    if (!getRouter) { // 不加这个判断，路由会陷入死循环
        getRouter = handleRoutes(routes); // 后台拿到路由
        if (getRouter) {
            // saveObjArr('router', getRouter) // 存储路由到localStorage
            routerGo(to, next) // 执行路由跳转方法
        }
        NProgress.done()
    } else {
        next();
        NProgress.done()
    }
});

function handleRoutes(menuList) {
    let ret = [];
    if (!menuList || menuList.length <= 0) {
        return
    }
    let whitelist = ['19261', '19302', '20306', '1020108', '21400']
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
                            component: () => import("@/views/Expend/chart"),
                        }]
                    });
                }
            })
            break
        }
    }
    ret = [...menuList]
    return ret
}

function filterAsyncRouter(asyncRouterMap) { // 遍历后台传来的路由字符串，转换为组件对象
    const accessedRouters = asyncRouterMap.filter(route => {
        if (route.meta.deep === 1) {
            if (route.name === 'layout') { // Layout组件特殊处理
                route.component = layout
            } else if (route.name === 'layout2') { // Layout组件特殊处理
                route.component = layout2
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
        return true
    });

    return accessedRouters
}

function routerGo(to, next) {
    getRouter = filterAsyncRouter(getRouter); // 过滤路由
    router.addRoutes(getRouter); // 动态添加路由
    global.antRouter = getRouter; // 将路由数据传递给全局变量，做侧边栏菜单渲染工作
    next({
        ...to,
        replace: true
    })
}
router.afterEach(() => {
    // finish progress bar
    NProgress.done()
})