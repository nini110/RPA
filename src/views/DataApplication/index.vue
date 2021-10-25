<template>
	<!-- 数据应用 -->
	<div class="DataApplication">
		<router-view/>
	</div>
</template>

<script>
export default {
  name: 'DataApplication',
  data() {
    return {
      itemRoutePath:[
		  {
			  path:'/dataApplication/spiritSharkTabulation',
			  name:'灵鲨制表'
		  },
		  {
			  path:'/dataApplication/biddingForMonitoring',
			  name:'竞标监控'
		  },
		  {
			  path:'/dataApplication/sankey',
			  name:'桑基图数据'
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
