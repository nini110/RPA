import axios from 'axios';
import Qs from 'qs'
import LoadingMask from '@/utils/loading'
import { Message } from 'element-ui'


// const baseURL = 'http://114.67.229.243:8001';
export const service = axios.create({
    // baseURL,
    timeout: 15000
})
const headers = {
    'form': 'application/x-www-form-urlencoded',
    'form-data': 'multipart/form-data',
    'json': 'application/json'
}
LoadingMask.init(service) // 全局遮罩
service.interceptors.request.use(config => {
    if (config.method === 'get') {
        config.headers = {
            'content-type': headers['form']
        },
        config.params = {
            ...config.data
        }
    } else if (config.method === 'post') {
        if (config.responseType === 'form') {
            // 原生form表单格式
            config.headers = {
                'content-type': headers['form']
            }
            let data = config.data;
            for(let i in data) {
                let item = data[i];
                let result = {}
                if (Array.isArray(item) && item.length > 0) {
                    result[i] = JSON.stringify(item)
                    config.data = Qs.stringify(result)
                } else {
                    const data = Qs.parse(config.data)
                    config.data = Qs.stringify({...data})
                }
            }
        } else if (config.responseType === 'form-data') {
            // 上传文件类型
            config.headers = {
                'content-type': headers['form-data']
            }
            let formData = new FormData();
            let data = config.data;
            for (let i in data) {
                let item = data[i];
                if (Array.isArray(item) && item.length > 0) {
                    item.forEach((val, idx) => {
                        formData.append('file', val)
                    })
                } else {
                    formData.append(i, item)
                }
            }
            config.data = formData
        }
    }
    config.headers.uid = localStorage.getItem("wx_userid");
    config.headers.code = localStorage.getItem("wx_code");
    return config
})
service.interceptors.response.use(response => {
    return response
}), error => {
    if (error && error.response) {
        switch (error.response.status) {
            case 404:
              error.message = '网络请求不存在';
              break;
            case 500:
              error.message = '服务器开小差了，请稍后重试';
              break;
            case 502:
              error.message = '抱歉，服务暂时不可用，请稍后重试';
              break;
            case 503:
              error.message = '抱歉，服务暂时不可用，请稍后重试';
              break;
            case 401:
              error.message = '请重新登录！';
              break;
            default:
              error.message = '系统繁忙，请稍后重试';
          }
          Message({
            type: 'error',
            message: error.message,
            duration: 2000,
            offset:200
          })
    } else {
        if (error.message.includes('timeout')) {
          Message({
            type: 'error',
            message: '请求超时，请检查网络是否连接正常',
            duration: 2000,
            offset:200
          })
        } else {
          Message({
            type: 'error',
            message: '请求失败，请检查网络是否已连接',
            duration: 2000,
            offset:200
          })
        }
      }
    return Promise.reject(error)
}
async function axiosHttp(body, parData, config) {
    let { url, method, responseType } = config;
    return await service({
        url: parData? url+parData+'/' : url,
        method,
        responseType,
        data: responseType === 'form-data' ? body : {...JSON.parse(JSON.stringify(body))}
    })
}
export default function request(config, parData) {
    return (body={}, parData='') => {
        return axiosHttp(body, parData, config)
    }
}