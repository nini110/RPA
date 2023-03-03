import axios from 'axios';
import Qs from 'qs'
import LoadingMask from '@/utils/loading'
import {
    Message,
    MessageBox
} from 'element-ui'

// const baseURL = 'http://114.67.229.243:8001';
export const service = axios.create({
    // baseURL,
    timeout: 150000
})
const $msg = function (options) {
    let iconcls;
    if (options.type === 'error') {
        iconcls = '#icon-cuowu'
    } else if (options.type === 'warning') {
        iconcls = '#icon-jinggao1'
    } else {
        iconcls = '#icon-chenggong'
    }
    const msg = Message({
        dangerouslyUseHTMLString: true, // 将dangerouslyUseHTMLString属性设置为 true，message 就会被当作 HTML 片段处理。
        message: `
		<svg class="icon svg-icon titleicon" aria-hidden="true">
			<use xlink:href="${iconcls}"></use>
		</svg>
		<p class="el-message__content">${options.msg}</p>
		`,
        duration: options.duration || 2000,
        center: true
    })
    return msg
}
const headers = {
    'form': 'application/x-www-form-urlencoded',
    'form-data': 'multipart/form-data',
    'json': 'application/json'
}
LoadingMask.options.whiteList.push(`http://114.67.229.243:8001/apps/read_log/`);
// LoadingMask.options.whiteList.push(`http://114.67.229.243:8001/apps/log_list/`);

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
            config.responseType = ''
            let data = config.data;
            let result = {}
            for (let i in data) {
                let item = data[i];
                if (Array.isArray(item) && item.length > 0) {
                    result[i] = JSON.stringify(item)
                    // config.data = Qs.stringify({...result})
                } else {
                    result[i] = item
                    // const data = Qs.parse(config.data)
                    // config.data = Qs.stringify({
                    //     ...data
                    // })
                }
            }
            config.data = Qs.stringify({
                ...result
            })
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
        } else {
            
        }
    }
    config.headers.uid = localStorage.getItem("wx_userid");
    config.headers.code = localStorage.getItem("wx_code");
    return config
})
service.interceptors.response.use(
    response => {
        if (response.data.code === 99998) {
            $msg({
                type: "warning",
                msg: "登录失效，请进行扫码登入"
            });
            setTimeout(() => {
                localStorage.removeItem("adTag");
                localStorage.removeItem("wx_code");
                localStorage.removeItem("wx_userid");
                localStorage.removeItem("user_name");
                localStorage.removeItem("thumb_avatar");
                window.location.replace('/#/login')
            }, 2000);
            return
        }
        return response
    },
    error => {
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
                default:
                    error.message = '系统繁忙，请稍后重试';
            }
            $msg({
                type: 'error',
                msg: error.message
            })
        } else {
            if (error.message.includes('timeout')) {
                $msg({
                    type: 'error',
                    msg: '请求超时，请检查网络是否连接正常'
                })
            } else {
                $msg({
                    type: 'error',
                    msg: '请求失败，请检查网络是否已连接'
                })
            }
        }
        return Promise.reject(error)
    }
)
async function axiosHttp(body, parData, config) {
    let {
        url,
        method,
        responseType
    } = config;
    return await service({
        url: parData ? url + parData + '/' : url,
        method,
        responseType,
        data: responseType === 'form-data' ? body : {
            ...JSON.parse(JSON.stringify(body))
        }
    })
}
export default function request(config, parData) {
    return (body = {}, parData = '') => {
        return axiosHttp(body, parData, config)
    }
}