<template>
	<!-- 京准通工具 -->
	<div class="BeijingMustPass">
		<navModule></navModule>
		<router-view/>
	</div>
</template>

<script>
	import navModule from './nav/nav.vue'
export default {
  name: 'BeijingMustPass',
  data() {
    return {
      itemRoutePath:[
		  {
			  path:'/beijingMustPass/DMP',
			  name:'DMP'
		  },
		  // {
			 //  path:'/beijingMustPass/directMail',
			 //  name:'定向直投'
		  // },
		  {
			  path:'/beijingMustPass/jingdongBooth',
			  name:'京东展位'
		  },
		  {
			  path:'/beijingMustPass/jingdongDirectInvestment',
			  name:'京东直投'
		  },
		  {
		  	  path:'/beijingMustPass/peopleOriented',
		  			  name:'京腾人群定向'
		  },
		  {
			  path:'/beijingMustPass/rubiksCube',
			  name:'京腾魔方'
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
