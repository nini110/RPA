<template>
  <div class="layout">
    <Header></Header>
    <div class="layout_left">
      <el-menu v-if="hasMenu" :default-active="currentMenu" class="el-menu-vertical-demo layout_menu" unique-opened
        active-text-color="#2066BD">
        <div v-for="(item, idx) in menuList" :key="idx" class="layout_menu_box">
          <el-submenu v-if="item.children" :index="item.index">
            <template slot="title">
              <svg class="icon svg-icon titleicon" aria-hidden="true">
                <use :xlink:href="item.icon"></use>
              </svg>
              <span>{{ item.label }}</span>
            </template>
            <div v-if="item.deep === 3">
              <el-menu-item-group v-for="(item1, idx1) in item.children" :key="idx1">
                <template slot="title">{{ item1.label }}</template>
                <el-menu-item v-for="(item2, idx2) in item1.children" :key="idx2" :index="item2.index"
                  @click="selectEvent(item2)">{{ item2.label }}</el-menu-item>
              </el-menu-item-group>
            </div>
            <div v-else>
              <el-menu-item-group>
                <el-menu-item v-for="(item1, idx1) in item.children" :key="idx1" :index="item1.index"
                  @click="selectEvent(item1)">
                  {{ item1.label }}
                </el-menu-item>
              </el-menu-item-group>
            </div>
          </el-submenu>
          <el-menu-item v-else :index="item.index" @click="selectEvent(item)">
            <i class="el-icon-menu"></i>
            <span slot="title">{{ item.label }}</span>
          </el-menu-item>
        </div>
      </el-menu>
    </div>
    <div class="layout_right">
      <div class="app-main" id="appMain">
        <transition name="el-fade-in-linear">
          <router-view class="app-router-view" />
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header";
export default {
  name: "layout",
  components: {
    Header,
  },
  data () {
    return {
      hasMenu: true,
      currentMenu: "1-1",
      menuList: [{
        label: "投放提效",
        deep: 2,
        icon: "#icon-xiaoshuai",
        value: "",
        index: "1",
        children: [{
          label: "DMP",
          value: "/layout/beijingMustPass/DMP",
          index: "1-1",
        },
        {
          label: "购物触点",
          value: "/layout/beijingMustPass/GoShop",
          index: "1-6",
        },
        {
          label: "京东展位",
          value: "/layout/beijingMustPass/Booth",
          index: "1-2",
        },
        {
          label: "京东直投",
          value: "/layout/beijingMustPass/Direct",
          index: "1-3",
        },
        {
          label: "京腾魔方人群",
          value: "/layout/beijingMustPass/Cube",
          index: "1-4",
        },
        {
          label: "京腾人群定向",
          value: "/layout/beijingMustPass/People",
          index: "1-5",
        },
        {
          label: "创意优化助手",
          value: "/layout/beijingMustPass/Help",
          index: "1-7",
        },
        ],
      },
      {
        label: "数坊提效",
        deep: 2,
        icon: "#icon-gengduoyingyong",
        value: "",
        index: "2",
        children: [{
          label: "人群计算",
          value: "/layout/bigData/Caculate",
          index: "2-1",
        },
        {
          label: "洞察分析",
          value: "/layout/bigData/Analysis",
          index: "2-2",
        },
        {
          label: "人群圈选",
          value: "/layout/bigData/Select",
          index: "2-3",
        },
        {
          label: "人群透视分析",
          value: "/layout/bigData/Insight",
          index: "2-4",
        },
        {
          label: "营销人群追踪",
          value: "/layout/bigData/Track",
          index: "2-5",
        },
        {
          label: "营销人群报告",
          value: "/layout/bigData/Report",
          index: "2-6",
        },
        ],
      },
      {
        label: "数据应用",
        deep: 2,
        icon: "#icon-jiancedashujuyingyong",
        value: "",
        index: "3",
        children: [{
          label: "灵鲨制表",
          icon2: "#icon-jianzhibiaoge",
          value: "/layout/dataApplication/tabulation",
          index: "3-1",
        },
        {
          label: "桑吉图数据",
          icon2: "#icon-sangjitu1",
          value: "/layout/dataApplication/snake",
          index: "3-2",
        },
        {
          label: "数据中心-行业大盘",
          icon2: "#icon-jianzhibiaoge",
          value: "/layout/dataApplication/field",
          index: "3-3",
        },
        {
          label: "数据中心-竞争分析",
          icon2: "#icon-jianzhibiaoge",
          value: "/layout/dataApplication/compete",
          index: "3-4",
        },
        {
          label: "京东到家-安卓",
          icon2: "#icon-jianzhibiaoge",
          value: "/layout/dataApplication/JDtoHome",
          index: "3-5",
        },
        {
          label: "京东到家-苹果",
          icon2: "#icon-jianzhibiaoge",
          value: "/layout/dataApplication/JDtoHomeIOS",
          index: "3-6",
        },
        ],
      },
      {
        label: "预算预警",
        deep: 2,
        icon: "#icon-icon_zhongdashixiangyujing",
        value: "",
        index: "4",
        children: [{
          label: "竞标监控",
          icon2: "#icon-monitor-tv-svgrepo-com",
          value: "/layout/dataApplication/monitor",
          index: "4-1",
        },
        {
          label: "自有预警",
          icon2: "#icon-jinggao",
          value: "/layout/budgetAlarm/alarm",
          index: "4-2",
        },
        {
          label: "一键预算",
          icon2: "#icon-jinggao",
          value: "/layout/budgetAlarm/budget",
          index: "4-3",
        },
        ],
      },
      {
        label: "提质工具",
        deep: 3,
        icon: "#icon-zhugehuodonggongju",
        value: "",
        index: "5",
        children: [{
          label: "巨量千川",
          value: "",
          // index: '5-1',
          children: [{
            label: "项目",
            value: "/layout/qianchuan/items",
            index: "5-1",
          },
          {
            label: "策略",
            value: "/layout/qianchuan/strategy",
            index: "5-2",
          },
          {
            label: "模板",
            value: "/layout/qianchuan/modules",
            index: "5-3",
          },
          ],
        },
        {
          label: "快车提质",
          icon: "#icon-gengduoyingyong",
          value: "",
          // index: '5-2',
          children: [{
            label: "效果变化",
            icon2: "#icon-xiaoguofenxi",
            value: "/layout/kuaiche/effect",
            index: "5-4",
          },
          {
            label: "效果图表",
            icon2: "#icon--bingzhuangtu",
            value: "/layout/kuaiche/charts",
            index: "5-5",
          },
          ],
        },
        ],
      },
      {
        label: "公域数据",
        deep: 2,
        icon: "#icon--wenjian",
        value: "",
        index: "7",
        children: [{
          label: "京东招标",
          icon2: "#icon-yusuanzhaobiaoxiangmu",
          value: "/layout/publicData/bidding",
          index: "7-1",
        },
        {
          label: "京东市场监控",
          icon2: "#icon-shichangjiandu",
          value: "/layout/publicData/market",
          index: "7-2",
        },
        ],
      },
      {
        label: "灵鲨驾驶舱",
        deep: 2,
        icon: "#icon-shujushiti",
        value: "",
        index: "8",
        children: [{
          label: "自有看板",
          value: "/layout/expend/selfBrand",
          index: "8-1",
        },
        {
          label: "竞标看板",
          value: "/layout/expend/bidItem",
          index: "8-2",
        },
        {
          label: "大盘看版",
          value: "/layout/expend/dapan",
          index: "8-3",
        },
        {
          label: "多账号概况管理",
          value: "/layout/expend/manage",
          index: "8-4",
        },
        ],
      }
      ],
    };
  },
  computed: {
    curroutes () {
      return global.antRouter;
    },
  },
  watch: {
    $route: {
      handler (newval, oldval) { },
      immediate: true,
      deep: true,
    },
  },
  created () {
    const vm = this;
    if (vm.$route.query.roi_type || vm.$route.name === "RealTime") {
      vm.hasMenu = false;
    } else {
      vm.hasMenu = true;
      for (let i of vm.menuList) {
        for (let j of i.children) {
          if (i.deep === 2) {
            if (vm.$route.fullPath === j.value) {
              vm.currentMenu = j.index;
              break;
            }
          } else if (i.deep === 3) {
            for (let k of j.children) {
              if (vm.$route.fullPath === k.value) {
                vm.currentMenu = k.index;
                break;
              }
            }
          }
        }
      }
    }
  },
  mounted () {
    const vm = this;
    window.addEventListener("hashchange", function (target) {
      let idx = target.newURL.search("#");
      let path = target.newURL.slice(idx + 1);
      for (let i of vm.menuList) {
        for (let j of i.children) {
          if (i.deep === 2) {
            if (j.value === path) {
              vm.currentMenu = j.index;
              break;
            }
          } else if (i.deep === 3) {
            for (let k of j.children) {
              if (k.value === path) {
                vm.currentMenu = k.index;
                break;
              }
            }
          }
        }
      }
    });
  },
  deatroyed () {
    window.removeEventListener("hashchange");
  },
  methods: {
    selectEvent (item) {
      this.$router.push(item.value);
    },
  },
};
</script>

<style lang="less" scoped>
@import "index";

.app-main {
  height: 100%;
}
</style>
