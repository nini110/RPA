import request from "../utils/axios.js"

// 竞标搜索接口
export function BiddingSearch(headers,params) {
	return request({
		url:"/apps/bidding/",
		method:'get',
		headers,
		params
	})
} 

// 通过竞标id查询活动 
export function BidIdQueryActivity(headers,params) {
	return request({
		url:"/apps/activity_list/",
		method:'get',
		headers,
		params
	})
}

// 查找名字
export function getName(headers,params) {
	return request({
		url:'/apps/wx_address_book/',
		method:'get',
		headers,
		params
	})
}

// 竞标上传列表 
export function BidList(headers, params) {
	return request({
		url:'/apps/bidding_list/',
		method:'get',
		headers,
		params
	})
}

// 竞标列表查看详情 
export function viewDetails(headers, params) {
	return request({
		url:'/apps/bidding_details/',
		method:'get',
		headers,
		params
	})
}

// 竞标列表详情修改
export function detailsToModify(headers, data) {
	return request({
		url:'/apps/update_thresholds/',
		method:'post',
		headers,
		data
	})
}

// 竞标立即上传
export function immediatelyUpload(headers, data) {
	return request({
		url:"/apps/bidding_excel/",
		method:'post',
		headers,
		data
	})
}

// 竞标列表删除
export function biddingDelete(headers, data) {
	return request({
		url:"/apps/delete_bidding/",
		method:'post',
		headers,
		data
	})
}

//  查看详情
export function fxcjviewDetails(headers, params) {
	return request({
		url: "/apps/log_info/",
		method:'get',
		headers,
		params
	})
}

// 立即上传
export function fxcjupload(headers, data) {
	return request({
		url:"/apps/upload_file/",
		method:'post',
		headers,
		data
	})
}

// 调用工具接口
export function fxcjtools(headers, data) {
	return request({
		url: "/apps/tools/",
		method:'post',
		headers,
		data
	})
}

// 查看
export function fxcjExamine(headers, params) {
	return request({
		url: "/apps/logs/",
		method:'get',
		headers,
		params
	})
}

// hdsku查看
export function hdskuLookData(headers, params){
	return request({
		url: "/apps/excel_list/",
		method:'get',
		headers,
		params
	})
}

// sku执行
export function performSku(headers, data){
	return request({
		url: "/apps/sku_get/",
		method:'post',
		headers,
		data
	})
}
// 修改人员详情
export function personnelDetails(headers, params) {
	return request({
		url: "/apps/user_info/",
		method:'get',
		headers,
		params
	})
}

// 修改竞标监控人
export function updateUser(headers, data) {
	return request({
		url: "/apps/update_user/",
		method:'post',
		headers,
		data
	})
}

// 灵鲨制表
// 选择项目
export function selectItem(headers, params){
	return request({
		url: "http://tool.afocus.com.cn/tabulation/all_project/get",
		method:'get',
		headers,
		params
	})
}

// 数据状态
export function dataState(headers, params){
	return request({
		url: "http://tool.afocus.com.cn/tabulation/data_status/get",
		method:"get",
		headers,
		params
	})
}

// 生成报表
export function makeAReport(headers, data){
	return request({
		url: "http://tool.afocus.com.cn/tabulation/generate_report",
		method:"post",
		headers,
		data
	})
}

// 下载报表
export function DownloadReport(headers, params){
	return request({
		url: "http://tool.afocus.com.cn/tabulation/download_report",
		method:"get",
		headers,
		params,
		responseType: 'blob'
	})
}

//获取项目列表信息
export function ObjectList(headers, params){
	return request({
		url:'http://tool.afocus.com.cn/tabulation/report_info/get',
		method:"get",
		headers,
		params
	})
}

//删除报表
export function DeleteReport(headers, data){
	return request({
		url: "http://tool.afocus.com.cn/tabulation/report/delete",
		method:"post",
		headers,
		data
	})
}

// 获取报表数据状态
export function ReportStatus(headers, params){
	return request({
		url:'http://tool.afocus.com.cn/tabulation/report_status/get',
		method:"get",
		headers,
		params
	})
}

// 巨量千川，音果desk api

// let baseUrl = '192.168.90.29:8000'
let baseUrl = '114.67.229.243:8002'
// 获取出价策略列表
export function strategyList(params){
	return request({
		url:"http://"+baseUrl+"/index/bid_strategy/getlist",
		method: 'get',
		params
	})
}

// 创建出价策略
export function addBidStrategy(data){
	return request({
		url:"http://"+baseUrl+"/index/bid_strategy/add",
		method: 'post',
		data
	})
}

// 获取出价策略详情
export function compile(params){
	return request({
		url:"http://"+baseUrl+"/index/bid_strategy/detail",
		method: 'get',
		params
	})
}

// 编辑更新出价策略
export function updataBidStrategy(data){
	return request({
		url:"http://"+baseUrl+"/index/bid_strategy/update",
		method: 'post',
		data
	})
}

// 获取预算策略列表
export function budgetStrategyList(params){
	return request({
		url:"http://"+baseUrl+"/index/budget_strategy/getlist",
		method: 'get',
		params
	})
}

// 创建预算策略
export function addBudgetStrategy(data){
	return request({
		url:"http://"+baseUrl+"/index/budget_strategy/add",
		method: 'post',
		data
	})
}

// 获取预算策略详情
export function detailBudgetStrategy(params){
	return request({
		url:"http://"+baseUrl+"/index/budget_strategy/detail",
		method: 'get',
		params
	})
}

// 编辑更新预算策略
export function updateBudgetStrategy(data){
	return request({
		url:"http://"+baseUrl+"/index/budget_strategy/update",
		method: 'post',
		data
	})
}

// 获取计划策略列表
export function planStrategyList(params){
	return request({
		url:"http://"+baseUrl+"/index/plan_strategy/getlist",
		method: 'get',
		params
	})
}

// 创建计划策略
export function addPlanStrategy(data){
	return request({
		url:"http://"+baseUrl+"/index/plan_strategy/add",
		method: 'post',
		data
	})
}

// 获取计划策略详情
export function detailPlanStrategy(params){
	return request({
		url:"http://"+baseUrl+"/index/plan_strategy/detail",
		method: 'get',
		params
	})
}

// 编辑更新计划策略
export function updatePlanStrategy(data){
	return request({
		url:"http://"+baseUrl+"/index/plan_strategy/update",
		method: 'post',
		data
	})
}

// 创建年龄模板
export function ageTemplateAdd(data){
	return request({
		url:"http://"+baseUrl+"/index/age_template/add",
		method:'post',
		data
	})
}

// 获取年龄模板列表
export function ageTemplateList(params){
	return request({
		url:"http://"+baseUrl+"/index/age_template/getlist",
		method:'get',
		params
	})
}

// 获取年龄模板详情
export function ageTemplateDetail(params){
	return request({
		url:"http://"+baseUrl+"/index/age_template/detail",
		method:'get',
		params
	})
}

// 更新年龄模板
export function ageTemplateUpdata(data){
	return request({
		url:"http://"+baseUrl+"/index/age_template/update",
		method:'post',
		data
	})
}

// 项目授权账号下拉
export function getSQselect(params){
	return request({
		url:"http://"+baseUrl+"/index/get_shop_info/",
		method:'get',
		params
	})
}

// 千川账号下拉
export function getThousandsOfSichuan(params){
	return request({
		url:"http://"+baseUrl+"/index/get_qc_info/",
		method:'get',
		params
	})
}

// 抖音账号下拉
export function getTrill(params){
	return request({
		url:"http://"+baseUrl+"/index/get_shop_dy_list/",
		method:'get',
		params
	})
}

// 项目创建
export function projectFound(data){
	return request({
		url:"http://"+baseUrl+"/index/project/add",
		method:'post',
		data
	})
}

// 获取项目列表
export function projectList(params){
	return request({
		url:"http://"+baseUrl+"/index/project/",
		method:'get',
		params
	})
}

// 获取项目详情
export function projectEdit(id){
	return request({
		url:"http://"+baseUrl+"/index/project/"+id+"/",
		method:'get'
	})
}

// 获取项目中的策略详情
export function Strategies(params){
	return request({
		url:"http://"+baseUrl+"/index/project/update",
		method:'get',
		params
	})
}

// 编辑更新项目
export function StrategiesUpdate(data){
	return request({
		url:"http://"+baseUrl+"/index/project/update",
		method:'post',
		data
	})
}

// 获取项目实时数据
export function readTimeData(params){
	return request({
		url:"http://192.168.90.29:8000/index/real_time_data/getlist",
		method:'get',
		params
	})
}
