<template>
	<div class="formBoard publicDiv">
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
	@import '../index';
</style>
