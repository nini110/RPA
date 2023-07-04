import layout from '@/views/layout'

const routes = [{
  path: '/',
  redirect: '/login'
}, {
  path: '/login',
  name: 'login',
  component: () => import(/* webpackChunkName: "R_Login"*/"@/views/Login/index.vue"),
  meta: {
    layout: 'login',
    deep: 1,
    limit: true
  }
},
{
  path: '/layout',
  name: 'layout',
  component: layout,
  meta: {
    deep: 1
  },
  children: [
    {
      path: 'beijingMustPass',
      name: 'BeijingMustPass',
      meta: {
        deep: 2,
        title: '投放提效',
        icon: "icon-xiaolv",
        index: "1",
      },
      component: () => import(/* webpackChunkName: "R_beijingMustPass"*/"@/views/BeijingMustPass"),
      children: [{
        path: 'DMP',
        name: 'DMP',
        meta: {
          title: 'DMP',
          index: "1-1",
          filePath: 'BeijingMustPass'
        },
        component: () => import(/* webpackChunkName: "R_DMP"*/"@/views/BeijingMustPass"),
      },
      {
        path: 'GoShop',
        name: 'GoShop',
        meta: {
          title: '购物触点',
          index: "1-2",
          filePath: 'BeijingMustPass'
        },
        component: () => import(/* webpackChunkName: "R_GOshop"*/"@/views/BeijingMustPass"),
      },
      {
        path: 'Booth',
        name: 'Booth',
        meta: {
          title: '京东展位',
          index: "1-3",
          filePath: 'BeijingMustPass'
        },
        component: () => import(/* webpackChunkName: "R_Booth"*/"@/views/BeijingMustPass"),
      },
      {
        path: 'Direct',
        name: 'Direct',
        meta: {
          title: '京东直投',
          index: "1-4",
          filePath: 'BeijingMustPass'
        },
        component: () => import(/* webpackChunkName: "R_Direct"*/"@/views/BeijingMustPass"),
      },
      {
        path: 'Cube',
        name: 'Cube',
        meta: {
          title: '京腾魔方人群',
          index: "1-5",
          filePath: 'BeijingMustPass'
        },
        component: () => import(/* webpackChunkName: "R_Cube"*/"@/views/BeijingMustPass"),
      },
      {
        path: 'People',
        name: 'People',
        meta: {
          title: '京腾人群定向',
          index: "1-6",
          filePath: 'BeijingMustPass'
        },
        component: () => import(/* webpackChunkName: "R_People"*/"@/views/BeijingMustPass"),
      },

      {
        path: 'Help',
        name: 'Help',
        meta: {
          title: '创意优化助手',
          index: "1-7",
          filePath: 'BeijingMustPass'
        },
        component: () => import(/* webpackChunkName: "R_Help"*/"@/views/BeijingMustPass"),
      },
      ]
    },
    {
      path: 'bigData',
      name: 'BigData',
      meta: {
        deep: 2,
        title: '数坊提效',
        icon: "icon-shufanglogo-",
        index: "2",
      },
      component: () => import(/* webpackChunkName: "R_bigData"*/"../views/BigData"),
      children: [{
        path: 'Caculate',
        name: 'Caculate',
        meta: {
          title: '人群计算',
          index: "2-1",
          filePath: 'BigData'
        },
        component: () => import(/* webpackChunkName: "R_Caculate"*/"@/views/BigData"),
      },
      {
        path: 'Analysis',
        name: 'Analysis',
        meta: {
          title: '洞察分析',
          index: "2-2",
          filePath: 'BigData'
        },
        component: () => import(/* webpackChunkName: "R_Analysis"*/"@/views/BigData"),
      },
      {
        path: 'Select',
        name: 'Select',
        meta: {
          title: '人群圈选',
          index: "2-3",
          filePath: 'BigData'
        },
        component: () => import(/* webpackChunkName: "R_Select"*/"@/views/BigData"),
      },
      {
        path: 'Insight',
        name: 'Insight',
        meta: {
          title: '人群透视分析',
          index: "2-4",
          filePath: 'BigData'
        },
        component: () => import(/* webpackChunkName: "R_Insight"*/"@/views/BigData"),
      },
      {
        path: 'Track',
        name: 'Track',
        meta: {
          title: '营销人群追踪',
          index: "2-5",
          filePath: 'BigData'
        },
        component: () => import(/* webpackChunkName: "R_track"*/"@/views/BigData"),
      },
      {
        path: 'Report',
        name: 'Report',
        meta: {
          title: '营销人群报告',
          index: "2-6",
          filePath: 'BigData'
        },
        component: () => import(/* webpackChunkName: "R_Report"*/"@/views/BigData"),
      },
      ]
    },
    // 数据应用  
    {
      path: 'dataApplication',
      name: 'DataApplication',
      meta: {
        deep: 2,
        title: '数据应用',
        icon: "icon-shujuyingyong1",
        index: "3",
      },
      component: () => import("../views/DataApplication"),
      children: [{
        path: 'tabulation',
        name: 'Tabulation',
        meta: {
          title: '灵鲨制表',
          index: "3-1",
          filePath: 'DataApplication/tabulation'
        },
        component: () => import(/* webpackChunkName: "R_tabulation"*/"@/views/DataApplication/tabulation"),
      },
      {
        path: 'snake',
        name: 'Snake',
        meta: {
          title: '桑吉图数据',
          index: "3-2",
          filePath: 'DataApplication/snake'
        },
        component: () => import(/* webpackChunkName: "R_snake"*/"@/views/DataApplication/snake"),
      },
      {
        path: 'field',
        name: 'Field',
        meta: {
          title: '数据中心-行业大盘',
          index: "3-3",
          filePath: 'DataApplication/field'
        },
        component: () => import(/* webpackChunkName: "R_field"*/"@/views/DataApplication/field"),
      },
      {
        path: 'compete',
        name: 'Compete',
        meta: {
          title: '数据中心-竞争分析',
          index: "3-4",
          filePath: 'DataApplication/compete'
        },
        component: () => import(/* webpackChunkName: "R_compete"*/"@/views/DataApplication/compete"),
      },
      {
        path: 'JDtoHome',
        name: 'JDtoHome',
        meta: {
          title: '京东到家-安卓',
          index: "3-5",
          filePath: 'DataApplication/JDtoHome'
        },
        component: () => import(/* webpackChunkName: "R_compete"*/"@/views/DataApplication/JDtoHome"),
      },
      {
        path: 'JDtoHomeIOS',
        name: 'JDtoHomeIOS',
        meta: {
          title: '京东到家-苹果',
          index: "3-6",
          filePath: 'DataApplication/JDtoHomeIOS'
        },
        component: () => import(/* webpackChunkName: "R_compete"*/"@/views/DataApplication/JDtoHomeIOS"),
      },
      ]
    },
    // 预算预警
    {
      path: 'budgetAlarm',
      name: 'BudgetAlarm',
      meta: {
        deep: 2,
        title: '预算预警',
        icon: "icon-B_yujing_zheng",
        index: "4",
      },
      component: () => import("@/views/BudgetAlarm"),
      children: [
        {
          path: 'monitor',
          name: 'Monitor',
          meta: {
            title: '竞标监控',
            index: "4-1",
            filePath: 'BudgetAlarm/monitor'
          },
          component: () => import(/* webpackChunkName: "R_monitor"*/"@/views/BudgetAlarm/monitor"),
        }, {
          path: 'alarm',
          name: 'Alarm',
          meta: {
            title: '自有预警',
            index: "4-2",
            filePath: 'BudgetAlarm/alarm'
          },
          component: () => import(/* webpackChunkName: "R_budgetAlarm"*/"@/views/BudgetAlarm/alarm"),
        },
        {
          path: 'budget',
          name: 'Budget',
          meta: {
            title: '一键预算',
            index: "4-3",
            filePath: 'BudgetAlarm/budget'
          },
          component: () => import(/* webpackChunkName: "R_budget"*/"@/views/BudgetAlarm/budget"),
        }
      ]
    },
    // 巨量千川
    {
      path: 'qianchuan',
      name: 'Qianchuan',
      meta: {
        deep: 2,
        title: '巨量千川',
        icon: "icon-juliangqianchuan",
        index: "5",
      },
      component: () => import("@/views/Qianchuan"),
      children: [{
        path: 'items',
        name: 'Items',
        meta: {
          title: '项目',
          index: "5-1",
          filePath: 'Qianchuan/items'
        },
        component: () => import(/* webpackChunkName: "R_items"*/"@/views/Qianchuan/items"),
      },
      {
        path: 'strategy',
        name: 'Strategy',
        meta: {
          title: '策略',
          index: "5-2",
          filePath: 'Qianchuan/strategy'
        },
        component: () => import(/* webpackChunkName: "R_strategy"*/"@/views/Qianchuan/strategy")
      },
      {
        path: 'modules',
        name: 'Modules',
        meta: {
          title: '模板',
          index: "5-3",
          filePath: 'Qianchuan/modules'
        },
        component: () => import(/* webpackChunkName: "R_modules"*/"@/views/Qianchuan/modules"),
      },
        // {
        //   path: 'realTime',
        //   name: 'RealTime',
        //   meta: {
        //     title: '实时看板',
        //     deep: 3,
        //     filePath: 'Qianchuan/realTime'
        //   },
        //   component: () => import(/* webpackChunkName: "R_realTime"*/"@/views/Qianchuan/realTime"),
        // },
      ]
    },
    // 快车提质
    {
      path: 'kuaiche',
      name: 'Kuaiche',
      meta: {
        deep: 2,
        title: '快车提质',
        icon: "icon-zhiliang",
        index: "6",
      },
      component: () => import("@/views/Kuaiche"),
      children: [{
        path: 'effect',
        name: 'Effect',
        meta: {
          title: '效果变化',
          index: "6-1",
          filePath: 'Kuaiche/effect'
        },
        component: () => import(/* webpackChunkName: "R_kuaiche"*/"@/views/Kuaiche/effect"),
      },
      {
        path: 'charts',
        name: 'Charts',
        meta: {
          title: '效果图表',
          index: "6-2",
          filePath: 'Kuaiche/effect'
        },
        component: () => import(/* webpackChunkName: "R_charts"*/"@/views/Kuaiche/effect")
      }
      ]
    },
    // 公共数据
    {
      path: 'publicData',
      name: 'PublicData',
      meta: {
        deep: 2,
        title: '公域数据',
        icon: "icon-gongyusiyuquanwangyunwei",
        index: "7",
      },
      component: () => import("../views/PublicData"),
      children: [{
        path: 'bidding',
        name: 'Bidding',
        meta: {
          title: '京东招标',
          index: "7-1",
          filePath: 'PublicData/bidding'
        },
        component: () => import(/* webpackChunkName: "R_publicData"*/"@/views/PublicData/bidding"),

      },
      {
        path: 'market',
        name: 'Market',
        meta: {
          title: '京东市场监控',
          index: "7-2",
          filePath: 'PublicData/market'
        },
        component: () => import(/* webpackChunkName: "R_market"*/"@/views/PublicData/market"),

      },
      ]
    },
    // 驾驶舱
    {
      path: 'expend',
      name: 'Expend',
      meta: {
        deep: 2,
        title: '灵鲨驾驶舱',
        icon: "icon-jiashicang",
        index: "8",
      },
      component: () => import("@/views/Expend"),
      children: [
        {
          path: 'selfBrand',
          name: 'selfBrand',
          meta: {
            title: '自有看板',
            index: "8-1",
            filePath: 'Expend/selfBrand',
          },
          component: () => import( /* webpackChunkName: "R_Expend"*/ "@/views/Expend/selfBrand"),
        },
        {
          path: 'bidItem',
          name: 'bidItem',
          meta: {
            title: '竞标看板',
            index: "8-2",
            filePath: 'Expend/bidItem',
          },
          component: () => import( /* webpackChunkName: "R_bidItem"*/ "@/views/Expend/bidItem"),
        },
        {
          path: 'dapan',
          name: 'dapan',
          meta: {
            title: '大盘看板',
            index: "8-3",
            filePath: 'Expend/dapan',
          },
          component: () => import( /* webpackChunkName: "R_Dapan"*/ "@/views/Expend/dapan"),
        },
        {
          path: 'manage',
          name: 'manage',
          meta: {
            title: '多账号概况管理',
            index: "8-4",
            filePath: 'Expend/manage'
          },
          component: () => import( /* webpackChunkName: "R_Dapan"*/ "@/views/Expend/manage"),
        }
      ]
    },
  ]
},
{
  path: '/403',
  name: '403',
  meta: {
    deep: 1,
    limit: true
  },
  component: () => import(/* webpackChunkName: "R_404"*/"@/views/403"),
},

]
export default routes;