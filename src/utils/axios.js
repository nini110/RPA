import axios from 'axios'
const baseURL = 'http://114.67.229.243:8001';
// const baseURL = 'http://10.102.0.96:8080';
// const baseURL = 'http://192.168.90.25:5000';
export default function request (options){
	// 使用ES6promise实现
	return new Promise((resolve,reject)=>{
		// 创建一个axios实例
		const instance = axios.create({
			baseURL:baseURL,
			// timeout:50000,
			headers:{"Content-type":"application/x-www-form-urlencoded"}
		})
		// 配置请求拦截
		instance.interceptors.request.use(config=>{
			// console.log("请求之前的拦截");
			return config;
		},err=>{
			// console.log("拦截失败");
			if(err && err.response){
				switch (err.response.status){
					case 400:
					err.message = "请求错误";
					break;
					case 500:
					err.message = "服务器错误"
					break;
				}
			}
			return err
		})
		// 响应拦截
		instance.interceptors.response.use(response=>{
			// console.log("响应之前的拦截");
			return response.data;
		},err=>{
			// console.log("拦截失败");
			return err
		})
		instance(options).then(res=>{
			resolve(res);
		}).catch(err=>{
			reject(err);
		})	
	})
	
}