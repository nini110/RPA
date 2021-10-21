<template>
	<div class="plans">
		<div class="centers">
			<div class="tables">
				<el-table :data="tableData" style="width: 100%">
					<el-table-column align="center" type="index" label="序号" width="50">
					</el-table-column>
					<el-table-column align="center" prop="name" label="计划名称" width="150">
					</el-table-column>
					<el-table-column align="center" prop="address" label="批次号">
					</el-table-column>
					<el-table-column align="center" prop="address" label="计划状态">
					</el-table-column>
					<el-table-column align="center" prop="address" width="120" label="直播间信息">
					</el-table-column>
					<el-table-column align="center" prop="address" label="出价">
					</el-table-column>
					<el-table-column align="center" prop="address" label="预算">
					</el-table-column>
					<el-table-column align="center" prop="address" width="120" label="广告组名称">
					</el-table-column>
					<el-table-column align="center" prop="address" width="120" label="消耗差值">
					</el-table-column>
					<el-table-column align="center" prop="address" width="120" label="消耗差值比">
					</el-table-column>
					<el-table-column align="center" prop="address" width="130" label="展示次数差值">
					</el-table-column>
					<el-table-column align="center" prop="address" width="130" label="展示次数差值比">
					</el-table-column>
					<el-table-column align="center" prop="address" width="120" label="点击率差值比">
					</el-table-column>
					<el-table-column align="center" prop="address" width="150" label="平均千次展现费用差值">
						<template slot="header">
							平均千次展现费用<br>差值
						</template>
					</el-table-column>
					<el-table-column align="center" prop="address" width="150" label="平均千次展现费用差值比">
						<template slot="header">
							平均千次展现费用<br>差值比
						</template>
					</el-table-column>
					<el-table-column align="center" prop="address" width="150" label="点击次数差值">
					</el-table-column>
					<el-table-column align="center" prop="address" width="150" label="点击次数差值比">
					</el-table-column>
					<el-table-column align="center" prop="address" width="120" label="转化数差值">
					</el-table-column>
					<el-table-column align="center" prop="address" width="120" label="转化数差值比">
					</el-table-column>
					<el-table-column align="center" prop="address" width="130" label="转化成本差值">
					</el-table-column>
					<el-table-column align="center" prop="address" width="130" label="转化成本差值比">
					</el-table-column>
					<el-table-column align="center" prop="address" width="120" label="转化率差值比">
					</el-table-column>
					<el-table-column align="center" prop="address" width="150" label="成交订单数量差值">
						<template slot="header">
							成交订单数量<br>差值
						</template>
					</el-table-column>
					<el-table-column align="center" prop="address" width="150" label="成交订单数量差值比">
						<template slot="header">
							成交订单数量<br>差值比
						</template>
					</el-table-column>
					<el-table-column align="center" prop="address" width="160" label="成交订单金额差值">
						<template slot="header">
							成交订单金额<br>差值
						</template>
					</el-table-column>
					<el-table-column align="center" prop="address" width="160" label="成交订单金额差值比">
						<template slot="header">
							成交订单金额<br>差值比
						</template>
					</el-table-column>
					<el-table-column align="center" prop="address" width="130" label="成交ROI差值">
					</el-table-column>
					<el-table-column align="center" prop="address" width="130" label="成交ROI差值比">
					</el-table-column>
					<el-table-column align="center" prop="address" width="150" label="下单订单数量差值">
						<template slot="header">
							下单订单数量<br>差值
						</template>
					</el-table-column>
					<el-table-column align="center" prop="address" width="150" label="下单订单数量差值比">
						<template slot="header">
							下单订单数量<br>差值比
						</template>
					</el-table-column>
					<el-table-column align="center" prop="address" width="160" label="下单订单金额差值">
						<template slot="header">
							下单订单金额<br>差值
						</template>
					</el-table-column>
					<el-table-column align="center" prop="address" width="160" label="下单订单金额差值比">
						<template slot="header">
							下单订单金额<br>差值比
						</template>
					</el-table-column>
					<el-table-column align="center" prop="address" width="130" label="下单ROI差值">
					</el-table-column>
					<el-table-column align="center" prop="address" width="130" label="下单ROI差值比">
					</el-table-column>
					<el-table-column align="center" prop="address" width="150" label="新增粉丝数差值">
					</el-table-column>
					<el-table-column align="center" prop="address" width="150" label="新增粉丝数差值比">
					</el-table-column>
				</el-table>
			</div>
			<div class="Fpage">
				<el-pagination
					  background
				      @size-change="handleSizeChange"
				      @current-change="handleCurrentChange"
				      :current-page="currentPage4"
				      :page-sizes="[100, 200, 300, 400]"
				      :page-size="100"
				      layout="total, sizes, prev, pager, next, jumper"
				      :total="400">
				    </el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name:'Plans',
		data() {
			return {
				currentPage4:1,
				tableData: [{
					date: '2',
					name: '王小虎',
					address: '金沙江路'
				}, {
					date: '4',
					name: '王小虎',
					address: '金沙江路'
				}, {
					date: '1',
					name: '王小虎',
					address: '金沙江路'
				}]
			}
		},
		methods:{
			handleSizeChange(){
				
			},
			handleCurrentChange(){
				
			}
		}
	}
</script>

<style lang="less">
	.plans{
		display: flex;
		flex-direction: row-reverse;
		background-color: #fff;
		.centers {
			width: 975px;
			background-color: #fff;
			height: 1300px;
			.Fpage{
				display: flex;
				justify-content: center;
			}
			.tabTops {
				display: flex;
		
				.tabTopsItem {
					display: flex;
					width: 280px;
		
					.names {
						width: 120px;
						font-size: 14px;
						text-align: right;
					}
				}
			}
		}
	}
</style>
