<template>
    <div class="layout">
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo layout_menu"
          unique-opened
          active-text-color="#276ce6"
          >
          <div v-for="(item, idx) in menuList" :key="idx">
            <el-submenu
             v-if="item.children" 
             :index="item.index" >
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{item.label}}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item v-for="(item1, idx1) in item.children" :key="idx1" :index="item1.index" @click="selectEvent(item1)">
                  {{item1.label}}
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item v-else index="2">
                <i class="el-icon-menu"></i>
                <span slot="title">{{item.label}}</span>
            </el-menu-item>
          </div>
        </el-menu>
        <div>
          <div class="app-main" id="appMain">
            <router-view class="app-router-view" />
          </div>
        </div>
    </div>
</template>
<script>

export default {
    name: 'layout',
    components: {
    },
    data() {
        return {
            menuList: [
                {
                    label: '京准通工具',
                    value: '',
                    index: '1',
                    children: [
                        {
                            label: 'DMP',
                            value: '/layout/beijingMustPass/DMP',
                            index: '1-1'
                        },
                        {
                            label: '京东展位',
                            value: '/layout/beijingMustPass/JingdongBooth',
                            index: '1-2'
                        },
                        {
                            label: '京东直投',
                            value: '/layout/beijingMustPass/jingdongDirectInvestment',
                            index: '1-3'
                        },
                        {
                            label: '京腾魔方',
                            value: '/layout/beijingMustPass/rubiksCube',
                            index: '1-4'
                        },
                        {
                            label: '京腾人群方向',
                            value: '/layout/beijingMustPass/peopleOriented',
                            index: '1-5'
                        }                                                                                             
                    ]
                },
                {
                    label: '大数据工具',
                    value: '',
                    index: '2',
                    children: [
                        {
                            label: '数坊人群圈选',
                            value: '/bigData/numberOfLaneCrowd',
                            index: '2-1'
                        },
                        {
                            label: '营销活动人群',
                            value: '/bigData/MarketingActivityCrowds',
                            index: '2-2'
                        },
                        {
                            label: '自定义分析创建',
                            value: '/bigData/CustomAnalysisCreation',
                            index: '2-3'
                        },
                        {
                            label: '数坊人群交并差集',
                            value: '/bigData/CrowdCrossAndMergeDifferenceSet',
                            index: '2-4'
                        },
                        {
                            label: '营销人群追踪',
                            value: '/bigData/MarketingPopulationTracking',
                            index: '2-5'
                        }                                                                                             
                    ]
                },
                {
                  label: '数据应用',
                  value: '',
                  index: '3',
                  children: [
                      {
                          label: '灵鲨制表',
                          value: '/dataApplication/spiritSharkTabulation',
                          index: '3-1'
                      },
                      {
                          label: '竞标监控',
                          value: '/dataApplication/biddingForMonitoring',
                          index: '3-2'
                      },
                      {
                          label: '桑吉图数据',
                          value: '/dataApplication/sankey',
                          index: '3-3'
                      }                                                                                         
                  ]
                },
                {
                    label: '视频工具',
                    value: '',
                    index: '4',
                    children: [
                        {
                            label: '图片处理',
                            value: '/videoTools/pictureProcessing',
                            index: '4-1'
                        },
                        {
                            label: '截取',
                            value: '/videoTools/cutOut',
                            index: '4-2'
                        },
                        {
                            label: '拼合',
                            value: '/videoTools/piece',
                            index: '4-3'
                        }                                                                                         
                    ]
                },
                {
                    label: '巨量千川',
                    value: '',
                    index: '5',
                    children: [
                        {
                            label: '项目',
                            value: '/thirdPartyTools/item',
                            index: '5-1'
                        },
                        {
                            label: '策略',
                            value: '/thirdPartyTools/homeitem',
                            index: '5-2'
                        },
                        {
                            label: '模板',
                            value: '/thirdPartyTools/formBoard',
                            index: '5-3'
                        }                                                                                          
                    ]
                },
                {
                    label: '公共数据获取',
                    value: '',
                    index: '6',
                    children: [
                        {
                            label: '京东招标',
                            value: '/publicDomainDataAcquisition/jingdongBidding',
                            index: '6-1'
                        },
                        {
                            label: '活动页面SKU',
                            value: '/publicDomainDataAcquisition/activePageSKU',
                            index: '6-2'
                        },
                        {
                            label: '京东市场监控',
                            value: '/publicDomainDataAcquisition/howToMonitor',
                            index: '6-3'
                        },
                        {
                            label: '品牌SKU获取',
                            value: '/publicDomainDataAcquisition/brandSKUAcquisition',
                            index: '6-4'
                        }                                                                                                               
                    ]
                }                                                                  
            ]
        }
    },
    methods: {
      selectEvent (item) {
        const vm = this;
        vm.$router.push(item.value)
      }
    }
}
</script>
<style lang="less" scoped>
  @import 'index';
</style>
