// 选哟由小数变为百分比
let formatPercent = (val, tag) => {
	let res;
	if(tag==='总数') {
		res = val
	} else {
		res = Math.round(val*10000)/100 +'%'
	}
	// let res = Number(val*100).toFixed(1) + '%'
	if (res === '0.0%' || !val) {
		res = '0'
	}
	return res
}
// 直接就是百分比的数字，加%就行
let formatPercent2 = (val) => {
	let res = Math.round(val*100)/100 +'%'
	if (res === '0.0%' || !val) {
		res = '0'
	}
	return res
}
export default {
	formatPercent,
	formatPercent2
}