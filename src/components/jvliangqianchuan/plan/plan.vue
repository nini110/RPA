<template>
	<div class="plan">
		<div class="tabs">
			<el-tabs v-model="activeName" @tab-click="handleClick">
				<el-tab-pane label="计划" name="first">
					<plans></plans>
				</el-tab-pane>
				<el-tab-pane label="创意" name="second">
					<originality></originality>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>
<script>
	import plans from './plans.vue'
	import originality from './originality.vue'
	export default {
		name: 'Plan',
		data() {
			return {
				activeName: 'first'
			}
		},
		components:{
			originality,
			plans
			
		},
		methods: {
			handleClick(tab, event) {
				
			}
		}
	}
</script>

<style lang="less" scoped>
 .plan{
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
