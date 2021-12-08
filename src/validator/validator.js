export const validPercent = (zhi, outerIdx, innerIdx, rule, value, callback) => {
	let iptVale = zhi.boxData[outerIdx].children[innerIdx].model
	let iptPlaceHolder = zhi.boxData[outerIdx].children[innerIdx].placeholder
	if(iptVale) {
		return callback()
	} else {
		return callback(new Error(iptPlaceHolder))
	}
}