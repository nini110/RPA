<template>
  <div class="layout">
    <el-menu
      :default-active="currentMenu"
      class="el-menu-vertical-demo layout_menu"
      unique-opened
      active-text-color="#2066BD"
    >
      <div v-for="(item, idx) in menuList" :key="idx" class="layout_menu_box">
        <el-submenu v-if="item.children" :index="item.index">
          <template slot="title">
            <i class="iconfont" :class="item.icon"></i>
            <span>{{ item.label }}</span>
          </template>
          <div v-if="item.deep === 3">
            <el-menu-item-group
              v-for="(item1, idx1) in item.children"
              :key="idx1"
            >
              <template slot="title">{{ item1.label }}</template>
              <el-menu-item
                v-for="(item2, idx2) in item1.children"
                :key="idx2"
                :index="item2.index"
                @click="selectEvent(item2)"
                >{{ item2.label }}</el-menu-item
              >
            </el-menu-item-group>
          </div>
          <div v-else>
            <el-menu-item-group>
              <el-menu-item
                v-for="(item1, idx1) in item.children"
                :key="idx1"
                :index="item1.index"
                @click="selectEvent(item1)"
              >
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
      <div class="layout_menu_btmIcon">
        <svg class="icon svg-icon titleicon" aria-hidden="true">
          <use :xlink:href="detailIcon"></use>
        </svg>
      </div>
    </el-menu>
    <div class="layout_menu_right">
      <div class="app-main" id="appMain">
        <router-view class="app-router-view" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "layout",

  data() {
    return {
      detailIcon: "",
      currentMenu: "1-1",
      menuList: [
        {
          label: "提效工具",
          deep: 2,
          icon: "iconfont icon-shouzhi",
          value: "",
          index: "1",
          children: [
            {
              label: "DMP",
              value: "/layout/beijingMustPass/DMP",
              index: "1-1",
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
              label: "京腾魔方",
              value: "/layout/beijingMustPass/Cube",
              index: "1-4",
            },
            {
              label: "京腾人群方向",
              value: "/layout/beijingMustPass/People",
              index: "1-5",
            },
            {
              label: "购物触点",
              value: "/layout/beijingMustPass/GoShop",
              index: "1-6",
            },
          ],
        },
        {
          label: "大数据工具",
          deep: 2,
          icon: "iconfont icon-gongju",
          value: "",
          index: "2",
          children: [
            {
              label: "数坊人群圈选",
              value: "/layout/bigData/Number",
              index: "2-1",
            },
            {
              label: "营销活动人群",
              value: "/layout/bigData/Activity",
              index: "2-2",
            },
            {
              label: "自定义分析创建",
              value: "/layout/bigData/Analysis",
              index: "2-3",
            },
            {
              label: "数坊人群交并差集",
              value: "/layout/bigData/Difference",
              index: "2-4",
            },
            {
              label: "营销人群追踪",
              value: "/layout/bigData/Population",
              index: "2-5",
            },
          ],
        },
        {
          label: "数据应用",
          deep: 2,
          icon: "iconfont icon-shujutongji",
          value: "",
          index: "3",
          children: [
            {
              label: "灵鲨制表",
              icon2: "#icon-jianzhibiaoge",
              value: "/layout/dataApplication/tabulation",
              index: "3-1",
            },
            {
              label: "桑吉图数据",
              icon2: "#icon-sangjitu1",
              value: "/layout/dataApplication/snake",
              index: "3-3",
            },
          ],
        },
        {
          label: "预算预警",
          deep: 2,
          icon: "iconfont icon-yujingfenxi",
          value: "",
          index: "4",
          children: [
            {
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
          ],
        },
        // {
        // 	label: "视频工具",
        // 	deep: 2,
        // 	icon: "iconfont icon-charutupian",
        // 	value: "",
        // 	index: "4",
        // 	children: [{
        // 			label: "图片处理",
        // 			icon2: '#icon-015-file',
        // 			value: "/layout/videoTools/pictureProcessing",
        // 			index: "4-1",
        // 		},
        // 		{
        // 			label: "截取",
        // 			icon2: '#icon-caijiandan',
        // 			value: "/layout/videoTools/cutOut",
        // 			index: "4-2",
        // 		},
        // 		{
        // 			label: "拼合",
        // 			value: "/layout/videoTools/piece",
        // 			index: "4-3",
        // 		},
        // 	],
        // },
        {
          label: "提质工具",
          deep: 3,
          icon: "iconfont icon-xiangmu",
          value: "",
          index: "5",
          children: [
            {
              label: "巨量千川",
              value: "",
              // index: '5-1',
              children: [
                {
                  label: "项目",
                  icon2: "#icon-shangpincanshumoban",
                  value: "/layout/qianchuan/items",
                  index: "5-1",
                },
                {
                  label: "策略",
                  icon2: "#icon-celveshishi",
                  value: "/layout/qianchuan/strategy",
                  index: "5-2",
                },
                {
                  label: "模板",
                  icon2: "#icon-daochumoban",
                  value: "/layout/qianchuan/modules",
                  index: "5-3",
                },
              ],
            },
            {
              label: "快车提质",
              icon: "iconfont icon-xiangmu",
              value: "",
              // index: '5-2',
              children: [
                {
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
                // {
                //   label: "修改记录",
                //   value: "/layout/kuaiche/record",
                //   index: "5-6",
                // },
              ],
            },
          ],
        },

        {
          label: "公共数据获取",
          deep: 2,
          icon: "iconfont icon-gonggongziliao",
          value: "",
          index: "7",
          children: [
            {
              label: "京东招标",
              icon2: "#icon-yusuanzhaobiaoxiangmu",
              value: "/layout/publicData/bidding",
              index: "7-1",
            },
            {
              label: "活动页面SKU",
              icon2: "#icon-huodong",
              value: "/layout/publicData/active",
              index: "7-2",
            },
            {
              label: "京东市场监控",
              icon2: "#icon-shichangjiandu",
              value: "/layout/publicData/market",
              index: "7-3",
            },
            {
              label: "品牌SKU获取",
              icon2: "#icon-pinpai",
              value: "/layout/publicData/brand",
              index: "7-4",
            },
          ],
        },
      ],
    };
  },
  computed: {
    curroutes() {
      return global.antRouter;
    },
  },
  created() {
    const vm = this;
    let res = vm.curroutes[3].children.filter((item) => {
      return item.name === "Expend";
    });
    if (res && res.length > 0) {
      vm.menuList.push({
        label: "灵鲨消耗",
        deep: 2,
        icon: "iconfont icon-zhibiao",
        value: "",
        index: "8",
        children: [
          {
            label: "图表",
            icon2: "#icon-xiaoguofenxi",
            value: "/layout/expend/chart",
            index: "8-1",
          },
        ],
      });
    }
    for (let i of vm.menuList) {
      for (let j of i.children) {
        if (i.deep === 2) {
          if (vm.$route.fullPath === j.value) {
            console.log(j);
            vm.currentMenu = j.index;
            vm.detailIcon = j.icon2;
            break;
          }
        } else if (i.deep === 3) {
          for (let k of j.children) {
            if (vm.$route.fullPath === k.value) {
              vm.currentMenu = k.index;
              vm.detailIcon = k.icon2;
              break;
            }
          }
        }
      }
    }
  },
  methods: {
    selectEvent(item) {
      const vm = this;
      vm.detailIcon = item.icon2;
      vm.$router.push(item.value);
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
