import axios from 'axios';
import Qs from 'qs'
// const baseURL = 'http://114.67.229.243:8001';
export const service = axios.create({
    // baseURL,
    timeout: 150000
})
const headers = {
    'form': 'application/x-www-form-urlencoded',
    'form-data': 'multipart/form-data',
    'json': 'application/json'
}
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
    return err
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