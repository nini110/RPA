<template>
	<el-dialog :title="dialogWord" :visible.sync="showFlag" width="40%" :close-on-click-modal="false"
		@close="closeEvent">
		<el-form ref="dialogForm" :model="form" :rules="rules">
			<el-row>
				<el-col :span="24">
					<el-form-item label="项目名称:" prop="project_name">
						<el-input v-model="form.project_name" placeholder="请输入项目名称" clearable></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="账号类型:" prop="type">
						<el-radio v-model="form.type" label="1" @change="typeChangeEve">店铺</el-radio>
						<el-radio v-model="form.type" label="2" @change="typeChangeEve">代理商</el-radio>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="授权账号:" prop="shop_id">
						<el-select v-model="form.shop_id" @change="shopChangeEvent" placeholder="请选择授权账号">
							<el-option v-for="(item, idx) in shopOptions" :key="item.advertiser_id"
								:label="item.advertiser_name" :value="item.advertiser_id">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="千川账号:" prop="quanchuan_id">
						<el-select v-model="form.quanchuan_id" @change="qcChangeEvent" placeholder="请选择千川账号"
							:disabled="quanchuanCan">
							<el-option v-for="item in quanchuanOptions" :key="item.id" :label="item.name"
								:value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="抖音账号:" prop="douyin_id">
						<el-select v-model="form.douyin_id" @change="dyChangeEvent" placeholder="请选择抖音账号"
							:disabled="douyinCan">
							<el-option v-for="item in douyinOptions" :key="item.aweme_id" :label="item.aweme_name"
								:value="item.aweme_id">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="投放时间:" prop="timeData">
						<el-date-picker v-model="timeData" type="datetimerange" format="yyyy-MM-dd HH:mm:ss"
							value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始日期"
							end-placeholder="结束日期">
						</el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="数据获取间隔:" prop="date">
						5分钟
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="绑定策略:" prop="strategy">
						<el-tabs v-model="activeName" @tab-click="tabEvent">
							<el-tab-pane label="出价调整" name="first">
								<el-select v-model="form.bid_id" placeholder="请选择绑定策略">
									<el-option v-for="(item, index) in cjOpt" :key="index" :label="item.name"
										:value="item.id"></el-option>
								</el-select>
							</el-tab-pane>
							<el-tab-pane label="预算调整" name="second">
								<el-select v-model="form.budget_id" placeholder="请选择绑定策略">
									<el-option v-for="(item, index) in ysOpt" :key="index" :label="item.name"
										:value="item.id"></el-option>
								</el-select>
							</el-tab-pane>
							<el-tab-pane label="计划复制" name="third">
								<el-select v-model="form.plan_id" placeholder="请选择绑定策略">
									<el-option v-for="(item, index) in jhOpt" :key="index" :label="item.name"
										:value="item.id"></el-option>
								</el-select>
							</el-tab-pane>
						</el-tabs>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button type="primary" plain @click="closeEvent">取消</el-button>
			<el-button type="primary" @click="updateEvent">{{btnWord}}</el-button>
		</span>
	</el-dialog>
</template>

<script>
	import {
		getProjectDetail,
		getShop,
		getQianchuan,
		getDouyin,
		getStrategies,
		foundItem,
		updateItem,
		strategyList,
		budgetStrategyList,
		planStrategyList
	} from '@/api/api';
	export default {
		name: 'DialogEdit',
		props: {
			dailogFlag: {
				type: Number,
				dafault: 1
			},
			rowID: {
				type: Number,
				dafault: null
			},
		},
		data() {
			return {
				btnWord: '',
				dialogWord: '',
				activeName: 'first',
				rules: {
					project_name: [{
						required: true,
						message: '请输入项目名称',
						trigger: 'blur'
					}],
					type: [{
						required: true,
						message: '请选择账号类型',
						trigger: 'blur'
					}],
					shop_id: [{
						required: true,
						message: '请选择授权账号',
						trigger: 'blur'
					}],
					quanchuan_id: [{
						required: true,
						message: '请选择千川账号',
						trigger: 'blur'
					}],
					douyin_id: [{
						required: true,
						message: '请选择抖音账号',
						trigger: 'blur'
					}],
					// timeData: [{required: true, message: '请选择投放时间', trigger: 'blur'}],
				},
				showFlag: true,
				quanchuanCan: true,
				douyinCan: true,
				timeData: [], // 投放时间
				form: {
					founder: '',
					project_name: '', // 项目名称
					type: '1', // 账号类型
					shop_id: '', // 授权账号
					shop_name: '',
					quanchuan_id: '', // 千川账号
					quanchuan_name: '',
					douyin_id: '', // 抖音账号
					douyin_name: '',
					bid_id: '',
					budget_id: '',
					plan_id: '',
					strategy_id: ''
				},
				shopNum: '', // 所选店铺对应的key
				shopOptions: [],
				quanchuanOptions: [],
				douyinOptions: [],
				cjOpt: [],
				ysOpt: [],
				jhOpt: [],
				submitData: null,
				ifShop: true,
				ifQc: true,
				ifDy: true, // true 表示没有修改过
			}
		},
		computed: {
			shop_id() {
				return this.form.shop_id
			},
			quanchuan_id() {
				return this.form.quanchuan_id
			},
			douyin_id() {
				return this.form.douyin_id
			}
		},
		watch: {
			shop_id: {
				handler(newval, oldval) {
					for (let j of this.shopOptions) {
						if (newval == j.advertiser_id) {
							this.form.shop_name = j.advertiser_name
							return
						}
					}
				},
				immediate: true,
				deep: true
			},
			quanchuan_id: {
				handler(newval, oldval) {
					for (let j of this.quanchuanOptions) {
						if (newval == j.id) {
							this.form.quanchuan_name = j.name
							return
						}
					}
				},
				immediate: true,
				deep: true
			},
			douyin_id: {
				handler(newval, oldval) {
					for (let j of this.douyinOptions) {
						if (newval == j.aweme_id) {
							this.form.douyin_name = j.aweme_name
							return
						}
					}
				},
				immediate: true,
				deep: true
			},
		},
		created() {
			const vm = this;
			vm.btnWord = vm.dailogFlag === 1 ? '保存' : '更新';
			vm.dialogWord = vm.dailogFlag === 1 ? '新增项目' : '编辑项目';
			vm.form.founder = localStorage.getItem("user_name");
			vm.shopOPEvent();
			vm.tabEvent();
			if (vm.dailogFlag === 2) {
				vm.detailEvent(vm.rowID)
			}
		},
		methods: {
			// 获取项目中策略详情
			getItemStrategy(id) {
				const vm = this;
				getStrategies({
					strategy_id: id,
				}).then(res => {
					if (res.data.code === 200) {
						vm.form.bid_id = res.data.data.bid_strategy_data.id || '';
						vm.form.budget_id = res.data.data.budget_strategy_data.id || '';
						vm.form.plan_id = res.data.data.plan_strategy_data.id || '';
					} else {
						vm.$message.error(res.data.msg);
					}

				})
			},
			// 获取项目详情
			detailEvent(id) {
				const vm = this;
				getProjectDetail({
					'haha': ''
				}, id).then(res => {
					vm.submitData = JSON.parse(JSON.stringify(res.data));
					vm.form.project_name = vm.submitData.project_name;
					vm.form.type = vm.submitData.zh_type === '店铺' ? '1' : '2';
					vm.timeData = [vm.submitData.cast_start_time, vm.submitData.cast_end_time];
					vm.form.strategy_id = vm.submitData.strategy_id;
					vm.shopNum = vm.submitData.num;
					vm.form.shop_id = parseFloat(vm.submitData.shop_id);
					vm.form.shop_name = vm.submitData.shop_name
					vm.form.quanchuan_id = parseFloat(vm.submitData.quanchuan_id);
					vm.form.quanchuan_name = vm.submitData.quanchuan_name
					vm.form.douyin_id = parseFloat(vm.submitData.douyin_id);
					vm.form.douyin_name = vm.submitData.douyin_name
					let params1 = {
						shop_id: parseFloat(vm.submitData.shop_id),
						num: vm.shopNum,
					};
					let params2 = {
						advertiser_id: parseFloat(vm.submitData.quanchuan_id),
						num: vm.shopNum,
					};
					vm.getItemStrategy(vm.submitData.strategy_id)
					vm.qcOPEvent(params1)
					vm.dyOPEvent(params2)
				})
			},
			// 新增|| 更新项目
			updateEvent() {
				const vm = this;
				let data = {
					...vm.form,
					cast_start_time: vm.timeData[0],
					cast_end_time: vm.timeData[1],
					interval: "300",
					num: vm.shopNum,
					zh_type: vm.form.type === '1' ? '店铺' : '代理商',
				}
				vm.$refs.dialogForm.validate(valid => {
					if (valid) {
						if (vm.dailogFlag === 1) {
							// 新建
							foundItem(data).then(res => {
								if (res.data.code === 200) {
									vm.$message.success('创建成功');
									vm.closeEvent()
								} else if (res.data.code === 1) {
									vm.$message.error(res.data.msg);
								}
							})
						} else {
							vm.$set(data, 'project_id', vm.submitData.id)
							vm.$set(data, 'strategy_id', vm.submitData.id)
							updateItem(data).then(res => {
								if (res.data.code === 200) {
									vm.$message.success('更新成功');
									vm.closeEvent()
								} else if (res.data.code === 1) {
									vm.$message.error(res.data.msg);
								}
							})
						}
					}
				})
			},
			// 策略列表
			tabEvent(val) {
				const vm = this;
				let data = {
					page: 0
				}
				Promise.all([strategyList(data), budgetStrategyList(data), planStrategyList(data)]).then(res => {
					vm.cjOpt = res[0].data.data.data
					vm.ysOpt = res[1].data.data.data
					vm.jhOpt = res[2].data.data.data
				})
			},
			// 授权账户改变
			shopChangeEvent(val) {
				const vm = this;
				vm.form.quanchuan_id = '';
				vm.form.douyin_id = '';
				vm.ifShop = false;
				for (let j of vm.shopOptions) {
					if (val === j.advertiser_id) {
						vm.shopNum = j.num
					}
				}
				let data = {
					shop_id: val,
					num: vm.shopNum
				}
				// 获取千川账户下拉
				vm.qcOPEvent(data)
			},
			// 千川账户改变
			qcChangeEvent(val) {
				const vm = this;
				vm.form.douyin_id = '';
				vm.ifQc = false;
				let data = {
					advertiser_id: val,
					num: vm.shopNum
				}
				// 获取抖音账户下拉
				vm.dyOPEvent(data)
			},
			// 抖音 账户改变
			dyChangeEvent() {
				const vm = this;
				vm.ifDy = false;
			},
			// 获取授权账户下拉
			shopOPEvent() {
				const vm = this;
				getShop({
					'': ''
				}).then(res => {
					let arr = [];
					let result = res.data.data
					for (let j in result) {
						result[j].map((item) => {
							return vm.$set(item, 'num', j)
						})
						arr.push(result[j])
					}
					for (let i = 0; i < arr.length; i++) {
						for (let k = 0; k < arr[i].length; k++) {
							vm.shopOptions.push(arr[i][k]);
						}
					}
				})
			},
			// 千川下拉
			qcOPEvent(data) {
				const vm = this;
				getQianchuan(data).then(res => {
					vm.quanchuanOptions = res.data.data
					vm.quanchuanCan = false
				})
			},
			// 抖音下拉
			dyOPEvent(data) {
				const vm = this;
				getDouyin(data).then(res => {
					vm.douyinOptions = res.data.data.aweme_id_list
					vm.douyinCan = false
				})
			},
			closeEvent() {
				const vm = this;
				// vm.ifShop = true;
				// vm.ifQc = true;
				// vm.ifDy = true;
				vm.$emit('close')
			},
			// 账号 类型切换事件
			typeChangeEve(val) {
				this.form.shop_id = ''
				this.form.quanchuan_id = ''
				this.form.douyin_id = ''
			}
		}
	}
</script>

<style lang="less" scoped>
	@import './index';
</style>
