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
	import age from './age.vue'
	import region from './region.vue'
	export default {
		name: 'FormBoard',
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

<style lang="less" scoped>
 .formBoard{
	 display: flex;
	 flex-direction: row-reverse;
	 .tabs{
		 width: 935px;
		 padding: 20px;
		 padding-top: 100px;
		 background-color: #fff;
	 }
 }
</style>
