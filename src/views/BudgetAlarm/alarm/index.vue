<template>
	<div class="outerDiv">
		<div>
			<div class="form">
				<el-form ref="form" :model="form">
					<div v-for="(itemSum, idxSum) in boxData" :key="idxSum">
						<el-divider>{{itemSum.txt}}</el-divider>
						<el-row>
							<el-col v-for="(item, idx) in itemSum.children" :key="idx" :span="8">
								<el-form-item v-if="item.type==='select'" :label="item.label" :prop="item.prop"
									:rules="item.rules">
									<el-select v-model="item.model" :placeholder="item.placeholder" size="medium"
										:disabled="item.disabled"
										@change="val => {selectChange(val, idxSum, idx, itemSum, item)}" clearable>
										<el-option v-for="val in item.options" :key="val.code" :label="val.name"
											:value="val.code">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item v-if="item.type==='input'" :label="item.label" :prop="item.prop"
									:rules="item.rules">
									<el-input v-model.trim="item.model" size="medium" :placeholder="item.placeholder"
										clearable :disabled="item.disabled" clearable></el-input>
								</el-form-item>
							</el-col>
						</el-row>
					</div>
				</el-form>
				<div style="text-align: right">
					<a class="btnnormal btnnormal_down marginR">
						<div class="el-icon-refresh btnSize" @click="resetEvent">重置</div>
					</a>
					<!-- <el-button v-waves class="el-icon-refresh marginR" type="primary" plain @click="resetEvent"></el-button> -->
					<el-button v-waves class="el-icon-edit" type="primary" disabled>修改</el-button>
					<el-button v-waves class="el-icon-right " type="primary" @click="submitEvent">保存</el-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		alarmSetting,
		alarmUser,
		alarmPlan,
		alarmDetail
	} from '@/api/api'
	import message from "@/mixin/message";
	import {
		validPin,
		validPercent
	} from '@/validator/validator'
	export default {
		name: 'ALarm',
		mixins: [message],
		data() {
			return {
				form: {

				},
				boxData: [{
						txt: '盯盘维度',
						children: [{
								type: 'select',
								model: '',
								prop: 'user_name',
								label: 'PIN',
								placeholder: '请选择PIN',
								options: [],
								rules: {
									required: true,
									validator: validPercent.bind(this, this, 0, 0),
									trigger: 'change'
								},
								disabled: false
							},
							{
								type: 'input',
								model: '',
								prop: 'password',
								label: '密码',
								placeholder: '请输入密码',
								rules: {
									required: true,
									validator: validPercent.bind(this, this, 0, 1),
									trigger: 'blur'
								},
								disabled: true
							},
							{
								type: 'select',
								model: '',
								prop: 'product_line',
								label: '产品线',
								placeholder: '请选择产品线',
								rules: {
									required: true,
									validator: validPercent.bind(this, this, 0, 2),
									trigger: 'change'
								},
								options: [{
										name: '快车',
										code: 'kuaiche'
									},
									{
										name: '购物触点',
										code: 'touchPoint'
									}
								],
								disabled: true
							},
							{
								type: 'input',
								model: '',
								prop: 'plan_id',
								label: '推广计划',
								// rules: {
								// 	required: true,
								// 	validator: validPercent.bind(this, this, 0, 3),
								// 	trigger: 'change'
								// },
								placeholder: '请输入推广计划',
								options: [{
									name: 'example',
									code: '575097395'
								}],
								disabled: true
							},
						]
					},
					{
						txt: '触发条件',
						children: [{
								type: 'select',
								model: '',
								prop: 'data',
								label: '时间',
								placeholder: '请选择时间',
								// rules: {
								// 	required: true,
								// 	validator: validPercent.bind(this, this, 1, 0),
								// 	trigger: 'change'
								// },
								options: [],
								disabled: true
							},
							{
								type: 'select',
								model: '',
								prop: 'zhibiaoTYpe',
								label: '指标类型',
								placeholder: '请输入指标类型',
								// rules: {
								// 	required: true,
								// 	validator: validPercent.bind(this, this, 1, 1),
								// 	trigger: 'change'
								// },
								disabled: true
							},
							{
								type: 'select',
								model: '',
								prop: 'rule',
								label: '规则',
								placeholder: '请选择规则',
								// rules: {
								// 	required: true,
								// 	validator: validPercent.bind(this, this, 1, 2),
								// 	trigger: 'change'
								// },
								options: [],
								disabled: true
							},
							{
								type: 'select',
								model: '',
								prop: 'duibizhibiao',
								label: '对比指标',
								placeholder: '请选择对比指标',
								// rules: {
								// 	required: true,
								// 	validator: validPercent.bind(this, this, 1, 3),
								// 	trigger: 'change'
								// },
								options: [],
								disabled: true
							},
							{
								type: 'input',
								model: '',
								prop: 'target_percentage',
								label: '阈值',
								placeholder: '请输入阈值(0-100的整数)',
								rules: {
									required: true,
									validator: validPercent.bind(this, this, 1, 4),
									trigger: 'blur'
								},
								disabled: false
							},
						]
					},
					{
						txt: '执行操作',
						children: [{
								type: 'select',
								model: '1',
								prop: 'optionType',
								label: '操作类型',
								placeholder: '请选择操作类型',
								// rules: {
								// 	required: true,
								// 	validator: validPercent.bind(this, this, 2, 0),
								// 	trigger: 'change'
								// },
								options: [{
									name: '企业微信发送通知',
									code: '1'
								}],
								disabled: true
							},
							{
								type: 'input',
								model: '',
								prop: 'qywx_id',
								label: '企业微信ID',
								placeholder: '请输入企业微信ID ( 以 | 分割 )',
								rules: {
									required: true,
									validator: validPercent.bind(this, this, 2, 1),
									trigger: 'blur'
								},
								disabled: false
							},
							// {
							// 	type: 'select',
							// 	model: '',
							// 	label: '操作类型',
							// 	placeholder: '请输入指标类型',
							// },
							// {
							// 	type: 'select',
							// 	model: '',
							// 	label: '调整类型',
							// 	placeholder: '请选择规则',
							// 	options: []
							// },
							// {
							// 	type: 'input',
							// 	model: '',
							// 	label: '数值',
							// 	placeholder: '请输入数值',
							// },	

							// {
							// 	type: 'input',
							// 	model: '',
							// 	label: '单位',
							// 	placeholder: '请输入数值',
							// },																													
						]
					},
				]
			}
		},
		created() {
			this.getUser()
		},
		methods: {
			submitEvent() {
				const vm = this;
				let data = {}
				for (let i of vm.boxData) {
					for (let j of i.children) {
						vm.$set(data, j.prop, j.prop === 'target_percentage' ? j.model / 100 : j.model)
					}
				}
				vm.$refs.form.validate((valid) => {
					if (valid) {
						vm.openMessageBox({
							type: "warning",
							showClose: true,
							tipTitle: `构建账号全量任务耗时较长(约1分钟),请 [ 确定 ] 构建`,
							confirmButtonFn: () => {
								alarmSetting(data).then(res => {
									if (res.data.code === 10000) {
										vm.$message.success("预警生成成功");
										vm.resetEvent()
									} else {
										vm.$message.error(res.data.msg);
									}
								})
							}
						});

					}
				})
			},
			getUser() {
				const vm = this;
				alarmUser().then(res => {
					if (res.data.code === 10000) {
						res.data.data.forEach((item, idx) => {
							let target = vm.boxData[0].children[0].options
							target.push({
								name: item,
								code: item
							})
						})
					} else {
						vm.$message.error(res.data.msg)
					}
				})
			},
			getPlan() {
				const vm = this;
				let data = {
					user_name: vm.boxData[0].children[0].model,
					password: vm.boxData[0].children[1].model,
					product_line: vm.boxData[0].children[2].model,
				}
				console.log(data)
				// alarmPlan().then(res => {

				// })
			},
			selectChange(val, idxSum, idx, itemSum, item) {
				const vm = this;
				// idxSum:boxdata第一层index、
				// idx:boxdata第二层index、
				let target = vm.boxData[0].children[0]
				if (item.prop === 'user_name') {
					for (let i of vm.boxData) {
						for (let j of i.children) {
							if (j.prop === 'password' || j.prop === 'product_line') {
								j.disabled = !val
								if (!val) {
									j.model = ''
								}
							}

						}
					}
				}
				if (item.prop === "product_line") {
					let data = {}
					for (let i of vm.boxData) {
						for (let j of i.children) {
							vm.$set(data, j.prop, j.model)
						}
					}
					if (val) {
						alarmDetail(data).then(res => {
							if (res.data.code === 10000) {
								for (let i of vm.boxData) {
									for (let j of i.children) {
										if (j.prop === 'qywx_id') {
											j.model = res.data.data.qywx_id
										}
										if (j.prop === 'target_percentage') {
											j.model = res.data.data.target_percentage * 100
										}
									}
								}
							} else {
								vm.$message.error(res.data.msg)
							}
						})
					}
				}
			},
			resetEvent() {
				const vm = this;
				for (let i of vm.boxData) {
					for (let j of i.children) {
						vm.$set(j, 'model', '')
					}
				}
				vm.$refs.form.resetFields()
			}
		}
	}
</script>

<style lang="less" scoped>
	@import "@/views/index";
</style>
