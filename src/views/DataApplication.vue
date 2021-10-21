<template>
	<!-- 数据应用 -->
	<div class="DataApplication">
		<navModule></navModule>
		<router-view/>
	</div>
</template>

<script>
	import navModule from './nav/nav.vue'
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
  components:{
	navModule
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
