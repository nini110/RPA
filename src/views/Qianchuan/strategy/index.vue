<template>
	<div class="strategy publicDiv" style="height: 100%">
		<div class="tabs">
			<el-tabs v-model="activeName" @tab-click="handleClick">
				<el-tab-pane label="出价调整" name="first">
				</el-tab-pane>
				<el-tab-pane label="预算调整" name="second">
				</el-tab-pane>
				<el-tab-pane label="计划复制" name="third">
				</el-tab-pane>
			</el-tabs>
			<PriceAdjustment :activeTab="activeName"></PriceAdjustment>
		</div>
	</div>
</template>
<script>
	import PriceAdjustment from './child/outer.vue'
	export default {
		name: 'Strategy',
		data() {
			return {
				activeName: 'first'
			}
		},
		components:{
			PriceAdjustment
		},
		methods: {
			handleClick(tab, event) {
				
			}
		}
	}
</script>

<style lang="less">
	@import "../index";
</style>
