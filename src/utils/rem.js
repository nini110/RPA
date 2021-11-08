// rem等比适配配置文件
// 基准大小
const baseSize = 12
let scale
// 设置 rem 函数
function setRem () {
	var UA = navigator.userAgent;
	var ipad = !!(UA.match(/(iPad).*OS\s([\d_]+)/)),
	    isIphone = !!(!ipad && UA.match(/(iPhone\sOS)\s([\d_]+)/)),
	    isAndroid = !!(UA.match(/(Android)\s+([\d.]+)/)),
	    isMobile = !!(isIphone || isAndroid);
	if(isMobile) {
		scale = document.documentElement.clientWidth / 740
	} else {
		scale = document.documentElement.clientWidth / 1920
	}
  // 当前页面宽度相对于 1920宽的缩放比例，可根据自己需要修改。
  // 设置页面根节点字体大小（“Math.min(scale, 2)” 指最高放大比例为2，可根据实际业务需求调整）
  document.documentElement.style.fontSize = baseSize * Math.min(scale, 2) + 'px'
}
// 初始化
setRem()
// 改变窗口大小时重新设置 rem
window.onresize = function () {
  setRem()
}