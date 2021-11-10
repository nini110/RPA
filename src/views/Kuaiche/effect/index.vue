<template>
	<div class="DMP outerDiv">
		<div class="content">
			<div class="form">
				<el-form ref="form" :model="form" class="formObj" :rules="rules">
					<div class="formObj_ipt ts">
						<el-form-item label="PIN:" prop="pin">
							<el-input v-model="form.pin" size="medium" placeholder="请选择" clearable></el-input>
						</el-form-item>
						<el-form-item class="tophasBtn" label="日期:" prop="search_date">
							<el-date-picker class="tophasBtn_data" v-model="form.search_date" format="yyyy-MM-dd"
								value-format="yyyy-MM-dd" type="date" placeholder="选择日期">
							</el-date-picker>
							<el-button type="primary" class="tophasBtn_btn btnnormal" @click="searchEvent">查询
							</el-button>
						</el-form-item>
					</div>
				</el-form>
			</div>
			<div ref="tableBox" class="tableBox hasUp4">
				<el-divider></el-divider>
				<div class="tables">
					<!-- :height="tableHeight" -->
					<div class="tableTab" v-show="tableData">
						<el-table class="tableBox" border :data="tableData" ref="table" size="small"
							:highlight-current-row="true" height="0"
							:header-cell-style="{background:'#F5F7FA',color: '#666'}" @sort-change="sortChange"
							style="width: 100%">
							<template slot="empty">
								<span class="iconfont icon-wushuju">暂无数据</span>
							</template>
							<el-table-column type="index" width="100" label="序号" align="center" fixed="left">
							</el-table-column>
							<el-table-column prop="keyword" label="关键词/单元" min-width="150" fixed="left">
							</el-table-column>
							<el-table-column prop="unit_name" label="类型" min-width="150" fixed="left">
							</el-table-column>
							<el-table-column prop="plan_name" label="计划" min-width="150" fixed="left">
							</el-table-column>
							<el-table-column v-for="(item, idx) in topMenuList" :key="idx" :prop="item.prop"
								:label="item.label" :min-width="item.width" :sortable="item.sortable">
							</el-table-column>
							<el-table-column v-if="$route.name==='Record'" label="操作" width="150" fixed="right">
								<template slot-scope="scope">
									<el-button class="el-icon-edit" type="text">调价
									</el-button>
								</template>
							</el-table-column>
						</el-table>
					</div>
					<!-- 分页器 -->
					<div class="block" v-if="total">
						<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
							:current-page.sync="currentPage" :page-size="pagesize" :page-sizes="[10, 20, 50, 100]"
							layout="total, sizes, prev, pager, next, jumper" :total="total">
						</el-pagination>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import {
		effectBox,
		priceBox
	} from '@/api/api'
	export default {
		name: 'Effect',
		data() {
			return {
				rules: {
					pin: [{
						required: true,
						message: '请输入PIN',
						trigger: 'blur'
					}],
					search_date: [{
						required: true,
						message: '请选择日期',
						trigger: 'blur'
					}],
				},
				form: {
					pin: '',
					search_date: '',
					sort_word: ''
				},
				tableData: [],
				topMenuList: [],
				tableHeight: 0,
				//分页器状态
				total: null,
				currentPage: 1,
				pagesize: 100,
			}
		},
		watch: {
			$route: {
				handler(newval, oldval) {
					const vm = this;
					vm.form = {
						pin: '',
						search_date: '',
						sort_word: ''
					}
					vm.total = null;
					vm.tableData = [];
					vm.topMenuList = [];
					switch (newval.name) {
						case 'Effect':
							vm.topMenuList = [{
									prop: 'diff_show',
									label: '展现量变化',
									sortable: 'custom',
									width: '250'
								},
								{
									prop: 'diff_click',
									label: '点击量变化',
									sortable: 'custom',
									width: '250'
								},
								{
									prop: 'diff_click_rate',
									label: '点击率变化',
									sortable: 'custom',
									width: '250'
								},
								{
									prop: 'diff_order_line',
									label: '15天成交订单量变化',
									sortable: 'custom',
									width: '250'
								},
								{
									prop: 'diff_zh_rate',
									label: '转化率变化',
									sortable: 'custom',
									width: '250'
								},
								{
									prop: 'diff_total_cost',
									label: '15天成交订单金额变化',
									sortable: 'custom',
									width: '250'
								},
								{
									prop: 'diff_roi',
									label: '15天成交ROI变化',
									sortable: 'custom',
									width: '250'
								},
							]
							break;
						case 'Record':
							vm.topMenuList = [{
									prop: 'old_price',
									label: '原出价',
									width: '200'
								},
								{
									prop: 'new_price',
									label: '调整后出价',
									width: '200'
								},
								{
									prop: 'khd',
									label: '调整时间',
									width: '200'
								},
							]
							break;
					}
				},
				immediate: true,
				deep: true
			}
		},
		mounted() {
		},
		methods: {
			sortChange(val) {
				const vm = this;
				vm.form.sort_word = val.prop
				vm.getTable()
			},
			searchEvent() {
				const vm = this;
				vm.getTable()
			},
			// 获取效果列表
			getTable(pages, current) {
				const vm = this;
				vm.$refs.form.validate((valid) => {
					if (valid) {
						vm.tableData = [];
						if (vm.$route.name === 'Effect') {
							// 获取效果列表
							effectBox({
								...vm.form,
								limit: vm.pagesize,
								page: vm.currentPage
							}).then(res => {
								if (res.data.code === 10000 && res.data.data.length > 0) {
									vm.tableData = res.data.data;
									vm.total = res.data.count;
								}
							})
						} else {
							// 获取改价列表
							priceBox({
								...vm.form,
								limit: vm.pagesize,
								page: vm.currentPage
							}).then(res => {
								if (res.data.code === 10000 && res.data.data.length > 0) {
									// vm.tableData = res.data.data;
									vm.total = res.data.count;
								}
							})
						}
					}
				})
			},
			//分页器功能
			handleSizeChange(val) {
				this.pagesize = val;
				this.getTable();
			},
			//有接口请求 每点击一页进行一次数据请求 参数页码为动态值：
			handleCurrentChange(page) {
				this.currentPage = page;
				this.getTable();
			},
		},

	}
</script>

<style lang="less" scoped>
	@import '@/views/index';
</style>
