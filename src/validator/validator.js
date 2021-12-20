export const validPercent = (tag, zhi, outerIdx, rule, value, callback) => {
	let target =  zhi[tag][outerIdx]
	let iptVale = target.model;
	let iptPlaceHolder = target.placeholder;
	if(iptVale) {
		return callback()
	} else {
		return callback(new Error(iptPlaceHolder))
	}
}
export const validPercent2 = (tag, zhi, outerIdx, innerIdx, rule, value, callback) => {
	let target = zhi[tag][outerIdx].children[innerIdx]
	let iptVale = target.model;
	let iptPlaceHolder = target.placeholder;
	if(iptVale) {
		return callback()
	} else {
		return callback(new Error(iptPlaceHolder))
	}
}
export const validTrue = (rule, value, callback) => {
	return callback()
}