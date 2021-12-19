import axios from 'axios'

function check() {
	axios({
		url: `${this.DomainName}/platform/authentication`,
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
				location.href = `${this.DomainName}/platform/login`;
			}, 2000)
		}
	})
}
export default check