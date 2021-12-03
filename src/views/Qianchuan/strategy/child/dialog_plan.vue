<template>
	<el-dialog :title="diaTxt" :visible.sync="dialogVisible" custom-class="dialogEdit dialogStrategy"
		:close-on-click-modal="false" width="30%" @close="closeEvent">
		<el-form ref="form" :model="form" :rules="rules">
			<el-form-item label="策略名称:" prop="name">
				<el-input v-model="form.name" size="medium" placeholder="请输入策略名称" clearable></el-input>
			</el-form-item>
			<el-divider content-position="left">条件</el-divider>
			<el-form-item label="取数次数:" prop="count" class="oneIpt">
				<el-input-number v-model="form.count" :min="1" :max="50" size="medium" label="描述文字" clearable>
				</el-input-number>次
			</el-form-item>
			<el-form-item label="判断依据:" prop="condition" class="twoIpt">
				<el-select v-model="form.condition" placeholder="请选择" size="medium" clearable>
					<el-option v-for="item in judgeOptions" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
				<!-- ≥ -->
				<el-input-number v-model="form.proportion" :min="1" :max="50" size="medium" label="描述文字">
				</el-input-number>%
			</el-form-item>
			<el-divider content-position="left">操作</el-divider>
			<el-form-item label="计划:"> 复制 </el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button class="btnnormal btnnormal_down" @click="closeEvent" size="medium">取 消
			</el-button>
			<el-button class="btnnormal marginL" type="primary" @click="saveEvent()" size="medium">{{btnTxt}}
			</el-button>
		</span>
	</el-dialog>
</template>

<script>
	import {
		detailPlanStrategy,
		addPlanStrategy,
		updatePlanStrategy
	} from "@/api/api.js";
	export default {
		name: 'DialogPlan',
		props: {
			showFlag: {
				type: Boolean,
				default: false
			},
			username: {
				type: String,
				default: ''
			},
			editFlag: {
				type: Number,
				default: 1
			},
			rowInfo: {
				type: Object,
				default: {}
			}
		},
		watch: {
			editFlag: {
				handler(newval, oldval) {
					const vm = this;
					switch (newval) {
						case 1:
							vm.diaTxt = "新建计划策略";
							vm.btnTxt = '保 存';
							break;
						case 2:
							vm.diaTxt = "编辑计划策略";
							vm.btnTxt = '更 新';
							break;
					}
				},
				immediate: true,
				deep: true
			},
			showFlag(newval, oldval) {
				this.dialogVisible = this.showFlag
				// 更新
				if (newval && this.editFlag === 2) {
					this.getDetail(this.rowInfo.id)
				}
			}
		},
		data() {
			return {
				diaTxt: '',
				btnTxt: '',
				dialogVisible: false,
				form: {
					name: "",
					proportion: "",
					condition: "",
					count: "",
					plan_operate: 1, //计划
				},
				rules: {
					name: [{
						required: true,
						message: "请输入策略名称",
						trigger: "blur"
					}],
					count: [{
						required: true,
						message: "请选择抽取次数",
						trigger: "blur"
					}, ],
					judge: [{
						required: true,
						message: "请选择判断依据",
						trigger: "blur"
					}],
				},
				judgeOptions: [{
						value: 1,
						label: "成交订单增量贡献度",
					},
					{
						value: 2,
						label: "成交金额增量贡献度",
					},
					{
						value: 3,
						label: "下单订单增量贡献度",
					},
					{
						value: 4,
						label: "下单金额增量贡献度",
					},
				],
			}
		},
		mounted() {

		},
		methods: {
			// 关闭弹窗
			closeEvent() {
				const vm = this;
				vm.$emit('close')
			},
			// 获取详情
			getDetail(id) {
				const vm = this;
				detailPlanStrategy({
						strategy_id: id,
					})
					.then((res) => {
						let result = res.data.data;
						this.form = {
							name: result.name,
							proportion: result.proportion * 100,
							condition: result.condition,
							count: result.count,
							plan: result.plan_operate,
						};
					})
			},
			// 创建策略 | 更新策略
			saveEvent() {
				const vm = this;
				vm.$refs.form.validate((valid) => {
					if (valid) {
						let data = {
							...vm.form,
							username: vm.username,
							proportion: vm.form.proportion / 100
						}
						if (vm.editFlag === 1) {
							addPlanStrategy(data)
								.then((res) => {
									if (res.data.code === 200) {
										vm.$emit('close', true)
										vm.$message({
											message: "计划策略创建成功！",
											type: "success",
										});
									} else if (res.data.code === 1) {
										vm.$message.error(res.data.msg);
									}
								})
						} else {
							data = {
								...data,
								strategy_id: vm.rowInfo.id
							}
							updatePlanStrategy(data)
								.then((res) => {
									if (res.data.code === 200) {
										vm.$emit('close', true)
										vm.$message({
											message: "计划策略更新成功！",
											type: "success",
										});
									} else if (res.data.code === 1) {
										vm.$message.error(res.data.msg);
									}
								})
						}
					}
				});
			},
		}
	}
</script>

<style lang="less" scoped>
	@import '../index';
</style>
