<template>
	<!-- 视频工具 -->
	<div class="VideoTools">
		<navModule></navModule>
		<router-view/>
	</div>
</template>

<script>
	import navModule from './nav/nav.vue'
export default {
  name: 'VideoTools',
  data() {
    return {
      itemRoutePath:[
		  {
			  path:'/videoTools/pictureProcessing',
			  name:'图片处理'
		  },
		  {
			  path:'/videoTools/cutOut',
			  name:'截取'
		  },
		  {
			  path:'/videoTools/piece',
			  name:'拼合'
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
