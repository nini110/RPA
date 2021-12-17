import axios from 'axios'

function check() {
	axios({
		url: 'http://192.168.90.209:5000/platform/authentication',
		// url: 'http://114.67.229.243:5005/platform/authentication',
		method: 'get',
		params: {
			user_id: localStorage.getItem("wx_userid"),
			user_code: localStorage.getItem("wx_code")
		}
	}).then((data) => {
		if (!data.data.status) {
			this.$msg({
				type: "error",
				msg: '登录失效'
			});
			setTimeout(() => {
				location.href = "http://192.168.90.209:5000/platform/login";
				// location.href = "http://114.67.229.243:5005/platform/login";
			}, 2000)
		}
	})
}
export default check