import request from "./request.js"

// 数据应用--竞标监控--竞标搜索  ok
export const BiddingSearch = request({
    url:"/apps/bidding/",
    method:'get'
})
// 数据应用--竞标监控--通过竞标id查询活动   ok
export const BidIdQueryActivity = request({
    url:"/apps/activity_list/",
    method:'get',
})
// 数据应用--竞标监控--查找名字   ok
export const getName = request({
    url:'/apps/wx_address_book/',
    method:'get',
})
// 数据应用--竞标监控--列表   ok
export const BidList = request({
    url:'/apps/bidding_list/',
	method:'get',
})
// 数据应用--竞标监控--查看详情  ok
export const viewDetails = request({
    url:'/apps/bidding_details/',
    method:'get',
})
// 数据应用--竞标监控--查看详情--修改   ok
export const detailsToModify = request({
    url:'/apps/update_thresholds/',
    method:'post',
    responseType: 'form'
})
// 数据应用--竞标监控--文件上传  ok
export const immediatelyUpload = request({
    url:"/apps/bidding_excel/",
    method:'post',
    responseType: 'form-data'
})
// 数据应用--竞标监控--竞标列表删除  ok
export const biddingDelete = request({
    url:"/apps/delete_bidding/",
    method:'post',
    responseType: 'form'
})
// 查看详情   ok
export const fxcjviewDetails = request({
    url: "/apps/log_info/",
    method:'get',
})
// 立即上传   ok
export const fxcjupload = request({
    url:"/apps/upload_file/",
    method:'post',
    responseType: 'form-data'
})
// 调用工具接口   ok
export const fxcjtools = request({
    url: "/apps/tools/",
    method:'post',
    responseType: 'form'
})
// 查看   ok
export const fxcjExamine = request({
    url: "/apps/logs/",
    method:'get',
})
// 公共数据获取--活动页面SKU--列表  ok
export const hdskuLookData = request({
    url: "/apps/excel_list/",
    method:'get',
})
// 公共数据获取--活动页面SKU--执行  ok
export const performSku = request({
    url: "/apps/sku_get/",
    method:'post',
    responseType: 'form'
})
// 修改人员详情
export const personnelDetails = request({
    url: "/apps/user_info/",
    method:'get',
})
// 数据应用--竞标监控--修改人员   ok
export const updateUser = request({
    url: "/apps/update_user/",
    method:'post',
    responseType: 'form'
})
// 数据应用--灵鲨制表--选择项目   ok
export const selectItem = request({
    url: "http://tool.afocus.com.cn/tabulation/all_project/get",
    method:'get',
})
// 数据应用--灵鲨制表--数据日期失焦后数据状态    ok
export const dataState = request({
    url: "http://tool.afocus.com.cn/tabulation/data_status/get",
    method:"get",
})
// 数据应用--灵鲨制表--生成报表   ok
export const makeAReport = request({
    url: "http://tool.afocus.com.cn/tabulation/generate_report",
    method:"post",
    responseType: 'form-data'
})
// 数据应用--灵鲨制表--下载报表   ok
export const DownloadReport = request({
    url: "http://tool.afocus.com.cn/tabulation/download_report",
    method:"get",
    responseType: 'blob'
})
// 数据应用--灵鲨制表--选择项目之后获取项目列表信息   ok
export const ObjectList = request({
    url:'http://tool.afocus.com.cn/tabulation/report_info/get',
    method:"get",
})
// 数据应用--灵鲨制表--删除报表   ok
export const DeleteReport = request({
    url: "http://tool.afocus.com.cn/tabulation/report/delete",
    method:"post",
    responseType: 'form'
})
// 数据应用--灵鲨制表--获取报表数据状态   ok
export const ReportStatus = request({
    url:'http://tool.afocus.com.cn/tabulation/report_status/get',
    method:"get",
})
// 巨量千川，音果desk api---------------------------------------------------------
let baseUrl = '114.67.229.243:8002'
// 获取出价策略列表
export const strategyList = request({
    url:"http://"+baseUrl+"/index/bid_strategy/getlist",
    method: 'get',
})
// 创建出价策略   待测
export const addBidStrategy = request({
    url:"http://"+baseUrl+"/index/bid_strategy/add",
    method: 'post',
    responseType: 'form'
})
// 获取出价策略详情   待测
export const compile = request({
    url:"http://"+baseUrl+"/index/bid_strategy/detail",
    method: 'get',
})
// 编辑更新出价策略   待测 
export const updataBidStrategy = request({
    url:"http://"+baseUrl+"/index/bid_strategy/update",
    method: 'post',
    responseType: 'form'
})
// 获取预算策略列表   待测
export const budgetStrategyList = request({
    url:"http://"+baseUrl+"/index/budget_strategy/getlist",
    method: 'get',
})
// 创建预算策略   待测
export const addBudgetStrategy = request({
    url:"http://"+baseUrl+"/index/budget_strategy/add",
    method: 'post',
    responseType: 'form'
})
// 获取预算策略详情   待测
export const detailBudgetStrategy = request({
    url:"http://"+baseUrl+"/index/budget_strategy/detail",
    method: 'get',
})
// 编辑更新预算策略   待测
export const updateBudgetStrategy = request({
    url:"http://"+baseUrl+"/index/budget_strategy/update",
    method: 'post',
})
// 获取计划策略列表   待测
export const planStrategyList = request({
    url:"http://"+baseUrl+"/index/plan_strategy/getlist",
    method: 'get',
})
// 创建计划策略   待测 ？？
export const addPlanStrategy = request({
    url:"http://"+baseUrl+"/index/plan_strategy/add",
    method: 'post',
})
// 获取计划策略详情  待测
export const detailPlanStrategy = request({
    url:"http://"+baseUrl+"/index/plan_strategy/detail",
    method: 'get',
})
// 编辑更新计划策略    待测？？？？
export const updatePlanStrategy = request({
    url:"http://"+baseUrl+"/index/plan_strategy/update",
    method: 'post',
    responseType: 'form'
})
// 创建年龄模板   待测？？？？
export const ageTemplateAdd = request({
    url:"http://"+baseUrl+"/index/age_template/add",
    method:'post',
    responseType: 'form'
})
// 获取年龄模板列表   待测
export const ageTemplateList = request({
    url:"http://"+baseUrl+"/index/age_template/getlist",
    method:'get',
})
// 获取年龄模板详情   待测
export const ageTemplateDetail = request({
    url:"http://"+baseUrl+"/index/age_template/detail",
    method:'get',
})
// 更新年龄模板   待测
export const ageTemplateUpdata = request({
    url:"http://"+baseUrl+"/index/age_template/update",
    method:'post',
    responseType: 'form'
})
// 项目授权账号下拉  待测
export const getSQselect = request({
    url:"http://"+baseUrl+"/index/get_shop_info/",
    method:'get',
})
// 千川账号下拉   待测
export const getThousandsOfSichuan = request({
    url:"http://"+baseUrl+"/index/get_qc_info/",
    method:'get',
})
// 抖音账号下拉  待测
export const getTrill = request({
    url:"http://"+baseUrl+"/index/get_shop_dy_list/",
    method:'get',
})
// 项目创建  待测
export const projectFound = request({
    url:"http://"+baseUrl+"/index/project/add",
    method:'post',
    responseType: 'form'
})
// 获取项目列表  待测
export const projectList = request({
    url:"http://"+baseUrl+"/index/project/",
    method:'get',
})
// // 获取项目详情
// export const projectEdit = request({
//     url:"http://"+baseUrl+"/index/project/"+id+"/",
//     method:'get'
// })
// 获取项目详情
export function projectEdit(id){
	return request({
		url:"http://"+baseUrl+"/index/project/"+id+"/",
		method:'get'
	})
}
// 获取项目中的策略详情  待测
export const Strategies = request({
    url:"http://"+baseUrl+"/index/project/update",
    method:'get',
})
// 编辑更新项目   待测
export const StrategiesUpdate = request({
    url:"http://"+baseUrl+"/index/project/update",
    method:'post',
    responseType: 'form'
})
// 获取项目实时数据 （暂）
export const readTimeData = request({
    url:"http://192.168.90.29:8000/index/real_time_data/getlist",
    method:'get',
})