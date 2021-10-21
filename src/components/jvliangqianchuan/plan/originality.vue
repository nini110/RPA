<template>
	<div class="originality">
		<div class="centers">
			<div class="tables">
				<el-table :data="tableData" style="width: 100%">
					<el-table-column align="centercenter" prop="date" label="序号" width="80">
					</el-table-column>
					<el-table-column align="center" prop="name" label="创意名称" width="180">
					</el-table-column>
					<el-table-column align="center" prop="address" label="状态">
					</el-table-column>
					<el-table-column align="center" prop="address" label="创意类型">
					</el-table-column>
					<el-table-column align="center" prop="address" label="计划">
					</el-table-column>
					<el-table-column align="center" prop="address" label="项目">
					</el-table-column>
					<el-table-column align="center" prop="address" label="抖音号">
					</el-table-column>
					<el-table-column align="center" prop="address" label="账号">
					</el-table-column>
				</el-table>
			</div>
			<div class="Fpage">
				<el-pagination background layout="prev, pager, next" :total="1000">
				</el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				tableData: [{
					date: '2016-05-02',
					name: '王小虎',
					address: '金沙江路'
				}, {
					date: '2016-05-04',
					name: '王小虎',
					address: '金沙江路'
				}, {
					date: '2016-05-01',
					name: '王小虎',
					address: '金沙江路'
				}]
			}
		}
	}
</script>

<style lang="less">
	.originality{
		display: flex;
		flex-direction: row-reverse;
		.centers {
			width: 975px;
			background-color: #fff;
			height: 1300px;
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
			.Fpage{
				display: flex;
				justify-content: center;
			}
		}
	}
</style>
