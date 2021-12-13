<template>
	<!-- 查看详情 -->
	<el-dialog title="修改预算" :visible.sync="show" max-height="400px" width="40%" @close="closeDialog"
		custom-class="dialogEdit" :close-on-click-modal="false">
		<el-table class="detail_body" ref="singleTable" :data="xqlist" height="540" :highlight-current-row="true">
			<el-table-column type="index" width="100" size="small" label="序号" align="center"></el-table-column>
			<el-table-column property="bidding_id" label="当日预算" align="center">
				<template slot-scope="scope">
					<div class="input-box">
						<el-input style="text-align: center" size="small" @input="changethreshold(scope.row)"
							v-model.trim="scope.row.threshold"></el-input>
					</div>
				</template>
			</el-table-column>
			<el-table-column property="bidding_date" size="small" label="日期" align="center">
			</el-table-column>
		</el-table>
		<span slot="footer" class="dialog-footer">
			<el-button v-waves type="primary" plain @click="closeDialog">取消</el-button>
			<el-button v-waves type="primary" class="marginL" @click="sendlist">确定</el-button>
		</span>
	</el-dialog>
</template>
<script>
	import {
		viewDetails,
		detailsToModify
	} from "@/api/api.js";
	export default {
		name: "DetailDialog",
		props: {
			row: {
				type: Object,
				default: {},
			},
		},
		data() {
			return {
				show: true,
				xqlist: [], //查看详情列表
				changelist: [], //修改过后的列表
			};
		},
		created() {
			this.getDetail(this.row);
		},
		methods: {
			// 获取详情
			getDetail(row) {
				const vm = this;
				viewDetails({
					bidding_id: row.bidding_id,
					activity_id: row.activity_id,
				}).then((res) => {
					if (res.data.code == 10000) {
						vm.xqlist = res.data.data;
					} else if (res.data.code == 10000) {
						vm.$message.warning("参数丢失");
					} else {
						vm.$message.warning("出错了");
					}
				});
			},

			changethreshold(scopeRow) {
				this.changelist.push({
					id: scopeRow.id,
					threshold: scopeRow.threshold,
				});
			},
			//上传修改后的预算数据
			sendlist() {
				const vm = this;
				detailsToModify({
					id_thresholds: vm.changelist,
				}).then((res) => {
					if (res.data.code == 10000) {
						vm.$emit("close", "suc");
						vm.$message.success("更新成功");
					} else if (res.data.code == 10001) {
						vm.$message.warning("参数丢失");
					} else {
						vm.$message.warning("出错了");
					}
				});
			},
			closeDialog() {
				this.$emit("close");
			},
		},
	};
</script>
<style scoped>
	.detail_body {
		padding: 0 50px;
	}
</style>
