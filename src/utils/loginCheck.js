import axios from 'axios'
function check() {
	const vm = this
	return new Promise((resolve, reject) => {
		axios({
			url: `${vm.DomainName}/platform/authentication`,
			method: 'get',
			params: {
				user_id: localStorage.getItem("wx_userid"),
				user_code: localStorage.getItem("wx_code")
			}
		}).then(res => {
			resolve(res.data.status)
		})
	})
}
export default check