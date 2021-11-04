import { Loading } from 'element-ui';
class LoadingMask {
    constructor() {
        this.loadingInstance = null
        this.openTimer = null
        this.closeTimer = null
        this.requestArr = []
        this.options = {
            delay: 300,
            lock: false,
            text: '加载中...', // 加载文本
            spinner: 'el-icon-loading', // icon 类名
            background: 'rgba(0, 0, 0, 0.5)', // 遮罩背景色
        }
    }
    // 打开加载弹层
    show() {
        this.loadingInstance = Loading.service(this.options);
    }
    // 关闭加载弹层
    hide() {
        clearTimeout(this.openTimer)
        this.openTimer = null
        if (this.loadingInstance) {
            this.loadingInstance.close()
        }
    }
    init(service, option = {}) {
        this.options = {
            ...this.options,
            ...option
        }
        service.interceptors.request.use(
            config => {
                this.request(config)
                return config
            },
            (error) => {
                return Promise.reject(error)
            }
        ),

        service.interceptors.response.use(
            res => {
                this.response(res)
                return res
            },
             (error) => {
                this.response(error)
                return Promise.reject(error)
            }
        )
    }
    request(config) {
        try {
            if (this.closeTimer) {
                clearTimeout(this.closeTimer)
                this.closeTimer = null
            } else {
                if (this.requestArr.length === 0) {
                    this.openTimer = setTimeout(() => {
                        this.show()
                    }, this.options.delay)
                }
            }
            this.requestArr.push(1)
        } catch {

        }

    }
    response(res) {
        try {
            this.requestArr.pop()
            if (this.requestArr.length === 0) {
                this.closeTimer = setTimeout(() => {
                    this.hide()
                    clearTimeout(this.closeTimer)
                    this.closeTimer = null
                })
            }
        } catch {

        }
    }
}
export default new LoadingMask()
