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
			// this.$msg({
			// 	type: "error",
			// 	msg: '登录失效，请重新登录'
			// });
			setTimeout(() => {
				this.$router.push({
					path: "/login",
				});
				localStorage.removeItem('wx_code')
				localStorage.removeItem('wx_userid')
				localStorage.removeItem('user_name')
				localStorage.removeItem('thumb_avatar')
			}, 2000)
		}
	})
}
export default check