<template>
  <div class="layout">
    <Header></Header>
    <div class="layout_left">
      <el-menu v-if="hasMenu" :default-active="currentMenu" class="el-menu-vertical-demo layout_menu" unique-opened
        active-text-color="#2066BD">
        <div v-for="(item, idx) in menuList" :key="idx" class="layout_menu_box">
          <el-submenu v-if="item.children" :index="item.index">
            <template slot="title">
              <!-- <span class="tticon iconfont" :class="item.icon">{{ item.title }}</span> -->
              <svg class="tticon icon svg-icon" aria-hidden="true">
                <use :xlink:href="'#' + item.icon"></use>
              </svg>
              {{ item.title }}
            </template>
            <div>
              <el-menu-item-group>
                <el-menu-item v-for="(item1, idx1) in item.children" :key="idx1" :index="item1.index" v-if="item1.limit"
                  @click="selectEvent(item1)">
                  {{ item1.title }}
                </el-menu-item>
              </el-menu-item-group>
            </div>
          </el-submenu>
          <el-menu-item v-else :index="item.index" @click="selectEvent(item)">
            <i class="el-icon-menu"></i>
            <span slot="title">{{ item.title }}</span>
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
      menuList: [],
    };
  },
  computed: {
    curroutes () {
      return global.antRouter;
    },
  },
  watch: {
    curroutes: {
      handler (newval, oldval) {
        const vm = this
        vm.menuList = []
        newval[2].children.forEach((val, idx) => {
          let obj = JSON.parse(JSON.stringify(val.meta))
          let arr = []
          val.children.forEach((val1, idx1) => {
            vm.$set(val1.meta, 'value', `/layout/${val.path}/${val1.path}`)
            arr.push(val1.meta)
          })
          vm.$set(obj, 'children', arr)
          vm.menuList.push(obj)
        })
      },
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
