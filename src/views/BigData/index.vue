<template>
	<!-- 大数据工具 -->
	<div class="BigData">
		<router-view/>
	</div>
</template>

<script>
export default {
  name: 'BigData',
  data() {
    return {
      itemRoutePath:[
		  {
			  path:'/bigData/numberOfLaneCrowd',
			  name:'数坊人群圈选'
		  },
		  {
			  path:'/bigData/marketingActivityCrowds',
			  name:'营销活动人群'
		  },
		  {
			  path:'/bigData/customAnalysisCreation',
			  name:'自定义分析创建'
		  },
		  {
			  path:'/bigData/crowdCrossAndMergeDifferenceSet',
			  name:'数坊人群交并差集'
		  },
		  {
			  path:'/bigData/marketingPopulationTracking',
			  name:'营销人群追踪'
		  }
	  ]
    };
  },
  methods:{
	
  },
  created() {
	// console.log(this.$route)
  }
}
</script>

<style lang="less">

</style>
