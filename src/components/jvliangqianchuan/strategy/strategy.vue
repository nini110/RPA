<template>
	<div class="strategy" style="height: 100%">
		<div class="tabs">
			<el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
				<el-tab-pane label="出价调整" name="first">
					<PriceAdjustment></PriceAdjustment>
				</el-tab-pane>
				<el-tab-pane label="预算调整" name="second">
					<budgetAdjustment></budgetAdjustment>
				</el-tab-pane>
				<el-tab-pane label="计划复制" name="third">
					<plantocopy></plantocopy>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>
<script>
	import plantocopy from './PlanToCopy.vue'
	import PriceAdjustment from './PriceAdjustment.vue'
	import budgetAdjustment from './budgetAdjustment.vue'
	export default {
		name: 'strategy',
		data() {
			return {
				activeName: 'first'
			}
		},
		components:{
			PriceAdjustment,
			plantocopy,
			budgetAdjustment
		},
		methods: {
			handleClick(tab, event) {
				
			}
		}
	}
</script>

<style lang="less">
 .strategy{
	 display: flex;
	 flex-direction: row-reverse;
	 .tabs{
		 width: 935px;
		 padding: 20px;
		 padding-top: 130px;
		 background-color: #fff;
	 }
 }
</style>
