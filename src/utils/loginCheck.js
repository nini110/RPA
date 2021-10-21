import axios from 'axios'
function check() {
	axios({
		// url: 'http://192.168.90.33:5005/platform/authentication',
		url: 'http://114.67.229.243:5005/platform/authentication',
		method: 'get',
		params: {
			user_id: localStorage.getItem("wx_userid"),
			user_code: localStorage.getItem("wx_code")
		}
	}).then((data) => {
		if (data.data.status == true) {
		} else if (data.data.status == false) {
			// location.href = "http://192.168.90.33:5005/platform/login";
			location.href = "http://114.67.229.243:5005/platform/login";
		} else {
			this.$message({
				message: '信息丢失试试重新登入',
				type: "warring"
			})
		}
	}, (err) => {
		console.log(err)
	})
}
export default check