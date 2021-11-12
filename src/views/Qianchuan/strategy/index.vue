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
	import plantocopy from './child/plan.vue'
	import PriceAdjustment from './child/price.vue'
	import budgetAdjustment from './child/budge.vue'
	export default {
		name: 'Strategy',
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
	 width: 100%;
	 flex-direction: row-reverse;
	 .tabs{
		 width: 100%;
		 height: 100%;
		 box-sizing: border-box;
		 padding: 20px;
		 padding-top: 130px;
		 // background-color: #fff;
		 .el-tabs {
			 height: 100%;
			 &__content {
		 		height: calc( 100% - 80px);
				 .el-tab-pane {
					 height: 100%;
				 }
			 }
		 }
	 }
 }
</style>
