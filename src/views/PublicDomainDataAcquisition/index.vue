<template>
	<!-- 公共数据获取 -->
	<div class="PublicDomainDataAcquisition">
		<router-view/>
	</div>
</template>

<script>
export default {
  name: 'PublicDomainDataAcquisition',
  data() {
    return {
      itemRoutePath:[
		  {
			  path:'/publicDomainDataAcquisition/jingdongBidding',
			  name:'京东招标'
		  },
		  {
			  path:'/publicDomainDataAcquisition/activePageSKU',
			  name:'活动页面SKU'
		  },
		  {
			  path:'/publicDomainDataAcquisition/howToMonitor',
			  name:'京东市场监控'
		  },
		  {
			  path:'/publicDomainDataAcquisition/brandSKUAcquisition',
			  name:'品牌SKU获取'
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
