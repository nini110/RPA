const getters = {
  pinList: state => state.pageData.pinList,  //预警 pin下拉框
  clearLeftTag: state => state.pageData.clearLeftTag,  //是否清空左侧内容标识
  btnState: state => state.pageData.btnState,  //页面按钮状态
  hasInfo: state => state.pageData.hasInfo,  // 控制页面右侧无数据状态
  currentIfo: state => state.pageData.currentIfo,  // 当前查询的pin
  serchRes: state => state.pageData.serchRes,  // 当前查询的结果
  checkLeft: state => state.pageData.checkLeft,  // 是否需要校验左侧信息
  checkRight: state => state.pageData.checkRight,  // 是否需要校验右侧信息
}
export default getters
