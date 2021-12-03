<template>
	<div class="formBoard">
		<div class="tabs">
			<el-tabs v-model="activeName">
				<el-tab-pane label="地域模板" name="first">
				</el-tab-pane>
				<el-tab-pane label="年龄模板" name="second">
				</el-tab-pane>
			</el-tabs>
			<Outer :activeTab="activeName"></Outer>
		</div>
	</div>
</template>
<script>
	import Outer from './child/outer.vue'
	export default {
		name: 'Modules',
		data() {
			return {
				activeName: 'first'
			}
		},
		components:{
			Outer
		},
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
		 box-sizing: border-box;
	 }
 }
</style>
