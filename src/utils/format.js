let formatPercent = (val) => {
	let res = Number(val*100).toFixed(1) + '%'
	if (res === '0.0%') {
		res = '0'
	}
	return res
}
export default {
	formatPercent
}