<template>
	<div class="navigation">
		<el-menu
		  class="el-menu-vertical-demo w200"
		  @open="handleOpen"
		  @close="handleClose"
		  router
		  >
		  <el-menu-item v-for="item in pathData" :index="item.path" @click="routerLink(item.path)" :class="$route.path === item.path?'active':''">
		  			<span slot="title">{{item.name}}</span>
		  </el-menu-item>
		</el-menu>
	</div>
</template>

<script>
export default {
	props:['pathData'],
  name: 'itemNav',
  data() {
	return {
	  isCollapse: true
	};
  },
  methods:{
	  routerLink(routers){
		  this.$router.replace(routers,()=>{},()=>{})
	  },
	  handleOpen(key, keyPath) {
	  	
	  },
	  handleClose(key, keyPath) {
	  	
	  }  
  },
  created() {
	
  }
}
</script>

<style lang="less" scoped>
	.navigation{
		width: 136px;
		// height: 1000px;
		color: #000;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		// position: fixed;
		// top: 80px;
		// left: 65px;
		// display: none;
		.w200{
			width: 155px;
			// height: 1000px;
			color: #000;
			// position: fixed;
			// top: 80px;
			// left: 65px;
			.active{
				color: #0051B3;
			}
		}
	}
</style>
