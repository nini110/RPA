import request from "./request.js"
// 接口统一管理
let BASEPATH = '';
let BASEPATH2 = '';
let BASEPATH3 = '';
let BASEPATH5 = '';
if (process.env.NODE_ENV === 'production') {
    BASEPATH = 'http://114.67.229.243:8001'
    BASEPATH2 = 'http://tool.afocus.com.cn'
    BASEPATH3 = 'http://114.67.229.243:8002'
    BASEPATH5 = 'http://114.67.229.243:8101'
    // 生产环境
} else {
    // 开发环境
    // BASEPATH = '/host8001'
    // BASEPATH2 = 'http://tool.afocus.com.cn'
    // BASEPATH3 = '/host8002'
    // BASEPATH5 = '/host8101'
    BASEPATH = 'http://114.67.229.243:8001'
    BASEPATH2 = 'http://tool.afocus.com.cn'
    BASEPATH3 = 'http://114.67.229.243:8002'
    BASEPATH5 = 'http://114.67.229.243:8101'
}
// 公告
export const adInfo = request({
    url:`${BASEPATH}/apps/mail_list/`,
    method:'get'
})
// 所有站内信
export const allAdInfo = request({
    url:`${BASEPATH}/apps/history_mail/`,
    method:'get'
})

// 公告-已读
export const readAllInfo = request({
    url:`${BASEPATH}/apps/read_mail/`,
    method:'post'
})
// 公告-已读一条
export const readOneInfo = request({
    url:`${BASEPATH}/apps/read_one_mail/`,
    method:'post',
    responseType: 'form'
})
// 公告-新建
export const addAdInfo = request({
    url:`${BASEPATH}/apps/station_mail/`,
    method:'post',
    responseType: 'form'
})


// 数据应用--竞标监控--竞标搜索  ok
export const BiddingSearch = request({
    url:`${BASEPATH}/apps/bidding/`,
    method:'get'
})
// 数据应用--竞标监控--通过竞标id查询活动   ok
export const BidIdQueryActivity = request({
    url:`${BASEPATH}/apps/activity_list/`,
    method:'get',
})
// 数据应用--竞标监控--查找名字   ok
export const getName = request({
    url:`${BASEPATH}/apps/wx_address_book/`,
    method:'get',
})
// 数据应用--竞标监控--列表   ok
export const BidList = request({
    url:`${BASEPATH}/apps/bidding_list/`,
	method:'get',
})
// 数据应用--竞标监控--查看详情  ok
export const viewDetails = request({
    url:`${BASEPATH}/apps/bidding_details/`,
    method:'get',
})
// 数据应用--竞标监控--查看详情--修改   ok
export const detailsToModify = request({
    url:`${BASEPATH}/apps/update_thresholds/`,
    method:'post',
    responseType: 'form'
})
// 数据应用--竞标监控--文件上传  ok
export const immediatelyUpload = request({
    url:`${BASEPATH}/apps/bidding_excel/`,
    method:'post',
    responseType: 'form'
})
// 数据应用--竞标监控--竞标列表删除  ok
export const biddingDelete = request({
    url:`${BASEPATH}/apps/delete_bidding/`,
    method:'post',
    responseType: 'form'
})
// --------------------------
// 提效工具-直投-保存数据
export const directiveList = request({
    url: `${BASEPATH}/apps/log_list/`,
    method:'get',
})
// 提效工具-直投-保存数据
export const directiveSave = request({
    url: `${BASEPATH}/apps/jdzt/`,
    method:'post',
    responseType: 'form'
})
// 提效工具-直投-实时日志
export const directiveLog = request({
    url: `${BASEPATH}/apps/read_log/`,
    method:'get',
})
// 提质工具--数方
export const sfToolsSave = request({
    url: `${BASEPATH}/apps/sf_online_tool/`,
    method:'post',
    responseType: 'form'
})
// 提质工具--数方 -- 下载
export const sfToolsDown = request({
    url: `${BASEPATH}/apps/sf_online_tool_download/`,
    method:'get',
    responseType: 'blob'
})
// 提质工具--数方 -- 模板下载
export const sfToolsModelDown = request({
    url: `${BASEPATH}/apps/sf_online_tool_modle_download/`,
    method:'get',
    responseType: 'blob'
})

// 查看详情   ok
export const fxcjviewDetails = request({
    url: `${BASEPATH}/apps/log_info/`,
    method:'get',
})
// 查看   ok
export const fxcjExamine = request({
    url: `${BASEPATH}/apps/logs/`,
    method:'get',
})
// 公共数据获取--活动页面SKU--列表  ok
export const hdskuLookData = request({
    url: `${BASEPATH}/apps/excel_list/`,
    method:'get',
})
// 公共数据获取--活动页面SKU--执行  ok
export const performSku = request({
    url: `${BASEPATH}/apps/sku_get/`,
    method:'post',
    responseType: 'form'
})
// 修改人员详情
export const personnelDetails = request({
    url: `${BASEPATH}/apps/user_info/`,
    method:'get',
})
// 数据应用--竞标监控--修改人员   ok
export const updateUser = request({
    url: `${BASEPATH}/apps/update_user/`,
    method:'post',
    responseType: 'form'
})
// 数据应用--竞标监控--修改活动   ok
export const updateActive = request({
    url: `${BASEPATH}/apps/update_activity/`,
    method:'post',
    responseType: 'form'
})
// 数据应用--灵鲨制表--选择项目   ok
export const selectItem = request({
    url: `${BASEPATH2}/tabulation/all_project/get`,
    method:'get',
})
// 数据应用--灵鲨制表--数据日期失焦后数据状态    ok
export const dataState = request({
    url: `${BASEPATH2}/tabulation/data_status/get`,
    method:"get",
})
// 数据应用--灵鲨制表--生成报表   ok
export const makeAReport = request({
    url: `${BASEPATH2}/tabulation/generate_report`,
    method:"post",
    responseType: 'form-data'
})
// 数据应用--灵鲨制表--下载报表   ok
export const DownloadReport = request({
    url: `${BASEPATH2}/tabulation/download_report`,
    method:"get",
    responseType: 'blob'
})
// 数据应用--灵鲨制表--选择项目之后获取项目列表信息   ok
export const ObjectList = request({
    url:`${BASEPATH2}/tabulation/report_info/get`,
    method:"get",
})
// 数据应用--灵鲨制表--删除报表   ok
export const DeleteReport = request({
    url: `${BASEPATH2}/tabulation/report/delete`,
    method:"post",
    responseType: 'form'
})
// 数据应用--灵鲨制表--获取报表数据状态   ok
export const ReportStatus = request({
    url:`${BASEPATH2}/tabulation/report_status/get`,
    method:"get",
})
// 巨量千川，音果desk api---------------------------------------------------------
// 获取出价策略列表
export const strategyList = request({
    url:`${BASEPATH3}/index/bid_strategy/getlist`,
    method: 'get',
})
// 创建出价策略   待测
export const addBidStrategy = request({
    url:`${BASEPATH3}/index/bid_strategy/add`,
    method: 'post',
    responseType: 'form'
})
// 获取出价策略详情   待测
export const compile = request({
    url:`${BASEPATH3}/index/bid_strategy/detail`,
    method: 'get',
})
// 编辑更新出价策略   待测 
export const updataBidStrategy = request({
    url:`${BASEPATH3}/index/bid_strategy/update`,
    method: 'post',
    responseType: 'form'
})
// 获取预算策略列表   待测
export const budgetStrategyList = request({
    url:`${BASEPATH3}/index/budget_strategy/getlist`,
    method: 'get',
})
// 创建预算策略   待测
export const addBudgetStrategy = request({
    url:`${BASEPATH3}/index/budget_strategy/add`,
    method: 'post',
    responseType: 'form'
})
// 获取预算策略详情   待测
export const detailBudgetStrategy = request({
    url:`${BASEPATH3}/index/budget_strategy/detail`,
    method: 'get',
})
// 编辑更新预算策略   待测
export const updateBudgetStrategy = request({
    url:`${BASEPATH3}/index/budget_strategy/update`,
    method: 'post',
    responseType: 'form'
})
// 获取计划策略列表   待测
export const planStrategyList = request({
    url:`${BASEPATH3}/index/plan_strategy/getlist`,
    method: 'get',
})
// 创建计划策略   待测 ？？
export const addPlanStrategy = request({
    url:`${BASEPATH3}/index/plan_strategy/add`,
    method: 'post',
})
// 获取计划策略详情  待测
export const detailPlanStrategy = request({
    url:`${BASEPATH3}/index/plan_strategy/detail`,
    method: 'get',
})
// 编辑更新计划策略    待测？？？？
export const updatePlanStrategy = request({
    url:`${BASEPATH3}/index/plan_strategy/update`,
    method: 'post',
    responseType: 'form'
})
// 创建年龄模板   待测？？？？
export const ageTemplateAdd = request({
    url:`${BASEPATH3}/index/age_template/add`,
    method:'post',
    responseType: 'form'
})
// 获取年龄模板列表   待测
export const ageTemplateList = request({
    url:`${BASEPATH3}/index/age_template/getlist`,
    method:'get',
})
// 获取年龄模板详情   待测
export const ageTemplateDetail = request({
    url:`${BASEPATH3}/index/age_template/detail`,
    method:'get',
})
// 更新年龄模板   待测
export const ageTemplateUpdata = request({
    url:`${BASEPATH3}/index/age_template/update`,
    method:'post',
    responseType: 'form'
})
// 千川---项目--------------------------------------------------------------
// 项目授权账号下拉  待测
export const getShop = request({
    url:`${BASEPATH3}/index/get_shop_info/`,
    method:'get',
})
// 千川账号下拉   待测
export const getQianchuan = request({
    url:`${BASEPATH3}/index/get_qc_info/`,
    method:'get',
})
// 抖音账号下拉  待测
export const getDouyin = request({
    url:`${BASEPATH3}/index/get_shop_dy_list/`,
    method:'get',
})
// 获取项目列表  待测
export const getProjectList = request({
    url:`${BASEPATH3}/index/project/`,
    method:'get',
})
// // 获取项目详情
export const getProjectDetail = request({
    url:`${BASEPATH3}/index/project/`,
    method:'get'
})
// 获取项目中的策略详情  待测
export const getStrategies = request({
    url:`${BASEPATH3}/index/project/update`,
    method:'get',
})
// 编辑更新项目   待测
export const updateItem = request({
    url:`${BASEPATH3}/index/project/update`,
    method:'post',
    responseType: 'form'
})
// 项目创建  待测
export const foundItem = request({
    url:`${BASEPATH3}/index/project/add`,
    method:'post',
    responseType: 'form'
})
// ----------------------------------------------------------------
// 获取项目实时数据 （暂）
export const readTimeData = request({
    url:`${BASEPATH3}/index/real_time_data/getlist`,
    method:'get',
})

// 提质--效果列表
export const effectBox = request({
    url:`${BASEPATH}/apps/dimensional_change/`,
    method:'get',
})
// 提质--改价记录列表
export const priceBox = request({
    url:`${BASEPATH}/apps/kc_log/`,
    method:'post',
    responseType: 'form'
})
// 提质--提质变化总览
export const effectCharts = request({
    url:`${BASEPATH}/apps/change_overview/`,
    method:'get',
})
// 预算预警
export const alarmSetting = request({
    url:`${BASEPATH5}/tools/set_monitoring`,
    method:'post',
})
// 预算预警-获取所有用户
export const alarmUser = request({
    url:`${BASEPATH5}/tools/get_all_user`,
    method:'get',
})
// 预算预警-获取所有已授权的用户
export const alarmUserAuthor = request({
    url:`${BASEPATH5}/tools/get_all_user_authorization`,
    method:'get',
})
// 预算预警-获取所有推广计划
export const alarmPlan = request({
    url:`${BASEPATH5}/tools/get_all_plan_id`,
    method:'get',
})
// 预算预警-获取详情
export const alarmDetail = request({
    url:`${BASEPATH5}/tools/get_target_percentage`,
    method:'post',
})
// 预算预警-删除预警
export const alarmDelete = request({
    url:`${BASEPATH5}/tools/del_monitoring`,
    method:'post',
})
// 预算预警-下载模板（日）
export const alarmModuleDay = request({
    url:`${BASEPATH5}/tools/download_budget_model_by_day`,
    method:'get',
})
// 预算预警- 批量设置
export const alarmModuleSet = request({
    url:`${BASEPATH5}/tools/set_budget_by_day`,
    method:'post',
    responseType: 'form-data'
})
// 小V消耗图表
export const expendDate = request({
    url:`${BASEPATH2}/tabulation/jzt_cost/get`,
    method:'get',
})
// 自有消耗图表
export const selfExpend = request({
    url:`${BASEPATH}/myselfwork/myself_consume/`,
    method:'post',
    responseType: 'form-data'
})
// 自有消耗图表--饼图
export const selfExpendPie = request({
    url:`${BASEPATH}/myselfwork/myself_sector/`,
    method:'post',
    responseType: 'form-data'
})
// 自有品牌列表
export const selfBrand = request({
    url:`${BASEPATH}/myselfwork/brand_list/`,
    method:'get'
})
// 自有消耗排行
export const selfExpendPH = request({
    url:`${BASEPATH}/myselfwork/myself_brand_consume/`,
    method:'post',
    responseType: 'form-data'
})
// 自有同环比列表
export const selfExpendList = request({
    url:`${BASEPATH}/myselfwork/brand_consume_effect/`,
    method:'post',
    responseType: 'form-data'
})
// 竞标项目图表
export const bidItemExpend = request({
    url:`${BASEPATH5}/report/jingbiao_lhhb_index`,
    method:'get',
})
// 竞标项目结果列表
export const bidItemList = request({
    url:`${BASEPATH5}/report/jingbiao_lhhb_report`,
    method:'get',
})
// 竞标项目列表
export const bidItem = request({
    url:`${BASEPATH5}/report/jingbiao_lhhb_name`,
    method:'get'
})

// 市场费账号
export const addMarketID = request({
    url:`${BASEPATH5}/report/jingbiao_market_map`,
    method:'post'
})
// 市场费账号列表
export const marketIDList = request({
    url:`${BASEPATH5}/report/jingbiao_market_map_list`,
    method:'get'
})
// 删除市场费账号
export const delMarketID = request({
    url:`${BASEPATH5}/report/del_map_data`,
    method:'post'
})
// 大盘--类目对比
export const dapanLeimu = request({
    url:`${BASEPATH}/zhaobiao/industry_diff/`,
    method:'post',
    responseType: 'form'
})
// 大盘--竞品项目对比
export const dapanJingpin = request({
    url:`${BASEPATH}/zhaobiao/competitors_diff/`,
    method:'post',
    responseType: 'form'
})
// 大盘--灵狐趋势
export const dapanQushi = request({
    url:`${BASEPATH}/zhaobiao/trend/`,
    method:'post',
    responseType: 'form'
})
// 公域数据---------------------------------------------------------------------
// 获取列表
export const pbulicList = request({
    url:`${BASEPATH}/public/task_list/`,
    method:'get'
})
// 新增
export const pbulicAddPlan = request({
    url:`${BASEPATH}/public/add_task/`,
    method:'post',
    responseType: 'form'
})
// 删除
export const pbulicDelPlan = request({
    url:`${BASEPATH}/public/delete_task/`,
    method:'post',
    responseType: 'form'
})
// 查看
export const pbulicSeePlan = request({
    url:`${BASEPATH}/public/get_task/`,
    method:'get',
})
// 编辑
export const pbulicEditPlan = request({
    url:`${BASEPATH}/public/update_task/`,
    method:'post',
    responseType: 'form'
})



