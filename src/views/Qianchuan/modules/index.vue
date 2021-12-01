<template>
	<div class="formBoard">
		<div class="tabs">
			<el-tabs v-model="activeName" @tab-click="handleClick">
				<el-tab-pane label="地域模板" name="first">
					<region></region>
				</el-tab-pane>
				<el-tab-pane label="年龄模板" name="second">
					<age></age>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>
<script>
	import age from './child/age.vue'
	import region from './child/region.vue'
	export default {
		name: 'Modules',
		data() {
			return {
				activeName: 'first'
			}
		},
		components:{
			age,
			region
		},
		methods: {
			handleClick(tab, event) {
				
			}
		}
	}
</script>

<style lang="less">
	@import '@/views/index.less';
	@import './index';
 .formBoard{
	 display: flex;
	 flex-direction: row-reverse;
	 height: 100%;
	 width: 100%;
	 .tabs{
		 width: 100%;
		 height: 100%;
		 padding: 110px 120px 20px 120px;
		 // background-color: #fff;
		 box-sizing: border-box;
		 .el-tabs {
			 height: 100%;
			 &__content {
		 		height: calc( 100% - 60px)!important;
				 .el-tab-pane {
					 height: 100%;
				 }
			 }
		 }
	 }
 }
</style>
