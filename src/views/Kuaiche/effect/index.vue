<template>
	<div class="DMP outerDiv">
		<div class="content">
			<div class="form">
				<el-form ref="form" :model="form" class="formObj">
					<div class="formObj_ipt">
						<el-form-item label="PIN:" prop="pin">
							<el-input v-model="form.pin" size="medium" placeholder="请选择" clearable></el-input>
						</el-form-item>
						<el-form-item label="日期:" prop="date">
							<el-select v-model="form.date" placeholder="请选择日期">
								<el-option v-for="item in options" :key="item.code" :label="item.label"
									:value="item.code">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="关键词/单元:" prop="keywords">
							<el-input v-model="form.keywords" size="medium" placeholder="请输入关键词/单元" clearable>
							</el-input>
						</el-form-item>
					</div>
					<div class="formObj_button">
						<el-button type="primary" class="btnnormal marginR">查询
						</el-button>
					</div>
				</el-form>
			</div>
			<div ref="tableBox" class="tableBox hasUp3">
				<el-divider></el-divider>
				<div class="tables">
					<div class="tableTab" v-if="tableData">
						<el-table class="tableBox" ref="table" :data="tableData" size="small" :height="tableHeight"
							tooltip-effect="dark" :highlight-current-row="true" :header-cell-style="{background:'#F5F7FA',color: '#666'}">
							<template slot="empty">
								<span class="iconfont icon-wushuju">暂无数据</span>
							</template>
							<el-table-column type="index" width="100" label="序号" align="center" fixed="left">
							</el-table-column>
							<el-table-column v-for="(item, idx) in topMenuList" :key="idx" :prop="item.prop"
								:fixed="item.fixed" :label="item.label" :min-width="item.width">
							</el-table-column>
							<el-table-column v-if="$route.name ==='Record'" label="操作" width="150" fixed="right">
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
							:current-page.sync="currpage" :page-size="pagesize" :page-sizes="[10, 20, 50, 100]"
							layout="total, sizes, prev, pager, next, jumper" :total="total">
						</el-pagination>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Effect',
		data() {
			return {
				form: {
					pin: '',
					date: '',
					keywords: ''
				},
				options: [{
						label: '昨天VS前天',
						code: 1
					},
					{
						label: '过去3天VS过去4~6天',
						code: 2
					},
					{
						label: '过去7天VS过去8~14天',
						code: 3
					},
				],
				tableData: null,
				topMenuList: null,
				tableHeight: 0,
				//分页器状态
				total: 20,
				currentPage: 1,
				pagesize: 10, //每页的数据条数
				currpage: 1, //默认开始页面
			}
		},
		watch: {
			$route: {
				handler(newval, oldval) {
					const vm = this;
					// vm.tableData = null;
					// vm.topMenuList = null;

					switch (newval.name) {
						case 'Effect':
							vm.tableData = [{
									key: '热水器',
									type: 'ECPA',
									danyuan: '类目词',
									plan: '热水器',
									zhan: '+13%',
									dian: '+20%',
									lv: '+6%',
									cheng: '+19%',
									zghuan: '+2%',
									jine: '+5%',
									roi: '0'
								},
								{
									key: '热水器',
									type: 'ECPA',
									danyuan: '类目词',
									plan: '热水器',
									zhan: '+13%',
									dian: '+20%',
									lv: '+6%',
									cheng: '+19%',
									zghuan: '+2%',
									jine: '+5%',
									roi: '0'
								}
							]
							vm.topMenuList = [{
									prop: 'key',
									label: '关键词/单元',
									fixed: 'left',
									width: '150'
								},
								{
									prop: 'type',
									label: '类型',
									fixed: 'left',
									width: '150'
								},
								{
									prop: 'danyuan',
									label: '单元',
									fixed: 'left',
									width: '150'
								},
								{
									prop: 'plan',
									label: '计划',
									fixed: 'left',
									width: '150'
								},
								{
									prop: 'zhan',
									label: '展现量变化',
									width: '200'
								},
								{
									prop: 'dian',
									label: '点击量变化',
									width: '200'
								},
								{
									prop: 'lv',
									label: '点击率变化',
									width: '200'
								},
								{
									prop: 'cheng',
									label: '15天成交订单量变化',
									width: '200'
								},
								{
									prop: 'zghuan',
									label: '转化率变化',
									width: '200'
								},
								{
									prop: 'jine',
									label: '15天成交订单金额变化',
									width: '200'
								},
								{
									prop: 'roi',
									label: '15天成交ROI变化',
									width: '200'
								},
							]
							break;
						case 'Record':
							vm.tableData = [{
									key: '热水器',
									type: 'ECPA',
									danyuan: '类目词',
									plan: '热水器',
									zhan: '1.7',
									dian: '1.8',
									lv: '2021-11-08',
								},
								{
									key: '热水器',
									type: 'ECPA',
									danyuan: '类目词',
									plan: '热水器',
									zhan: '1.7',
									dian: '1.8',
									lv: '2021-11-08',
								}
							]
							vm.topMenuList = [{
									prop: 'key',
									label: '关键词/单元',
									fixed: 'left',
									width: '150'
								},
								{
									prop: 'type',
									label: '类型',
									fixed: 'left',
									width: '150'
								},
								{
									prop: 'danyuan',
									label: '单元',
									fixed: 'left',
									width: '150'
								},
								{
									prop: 'plan',
									label: '计划',
									fixed: 'left',
									width: '150'
								},
								{
									prop: 'zhan',
									label: '原出价',
									width: '200'
								},
								{
									prop: 'dian',
									label: '调整后出价',
									width: '200'
								},
								{
									prop: 'lv',
									label: '调整时间',
									width: '200'
								},
							]
							break;
					}
					this.$nextTick(() => {
						this.$refs.table.doLayout()
					})
				},
				immediate: true,
				deep: true
			}
		},
		created() {

		},
		methods: {
			//分页器功能
			handleSizeChange(val) {
				this.pagesize = val;
				// this.getuserlist(this.pagesize);
			},
			//有接口请求 每点击一页进行一次数据请求 参数页码为动态值：
			handleCurrentChange(page) {
				this.currpage = page;
				// this.getuserlist(this.currpage);
			},
		},

	}
</script>

<style lang="less" scoped>
	@import '@/views/index';
</style>
