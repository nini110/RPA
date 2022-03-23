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
let numberToCurrencyNo = (value) => {
    if (!value) return 0
    // 获取整数部分
    const intPart = Math.trunc(value)
    // 整数部分处理，增加,
    const intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
    // 预定义小数部分
    let floatPart = ''
    // 将数值截取为小数部分和整数部分
    const valueArray = value.toString().split('.')
    if (valueArray.length === 2) { // 有小数部分
      floatPart = valueArray[1].toString() // 取得小数部分
      return intPartFormat + '.' + floatPart
    }
    return intPartFormat + floatPart
  }
export default {
	formatPercent,
	formatPercent2,
	numberToCurrencyNo
}