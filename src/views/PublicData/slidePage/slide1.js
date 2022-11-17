class SlideFactory {
    constructor() {
        this.ys_slide = null; // slide
        this.ys_slide_rtBtn = null; // 目标btn
        this.ys_slide_lfBtn = null; //滑动btn
        this.ys_slide_btn = null; // 滑动手柄
        this.max_offset = 0; // 最大可滑动距离
        this.mouse_x = 0 // 鼠标初始位置
        this.move_x = 0 // 鼠标移动距离
    }
    // 初始化事件
    init() {
        this.ys_slide = document.querySelector('.slide')
        this.ys_slide_rtBtn = document.querySelector('.slide_rtBtn')
        this.ys_slide_lfBtn = document.querySelector('.slide_lfBtn')
        this.ys_slide_btn = document.querySelector('.slide_btn')
        this.max_offset = this.ys_slide.offsetWidth - this.ys_slide_btn.offsetWidth
        console.log('滑动框的宽度', this.ys_slide.offsetWidth)
        console.log('滑块的宽度', this.ys_slide_btn.offsetWidth)
        console.log('可滑动的距离', this.max_offset)
        // 注册鼠标按下事件
        document.addEventListener('mousedown', this.mousedown)
    }
    // 鼠标按下事件
    mousedown(event) {
        // 记录鼠标初始位置
        this.mouse_x = event.clientX
        // 开启鼠标移动和鼠标松开事件
        document.addEventListener('mousemove', this.mousemove)
        document.addEventListener('mouseup', this.mouseup)
    }
    // 鼠标移动事件
    mousemove(event) {
        console.log('hhaha')
        let leftValue;
        console.log('初始位置', this.mouse_x)
        console.log('鼠标实时位置', event.clientX)
        // 移动的距离
        this.move_x = event.clientX - this.mouse_x
        if (this.move_x <= 0) {
            // 往左移
            leftValue = 0
        }
        if (this.move_x > this.max_offset) {
            // 往左移
            leftValue = this.max_offset
        }
        console.log('移动的距离', this.move_x)
        this.ys_slide_lfBtn.style.left = leftValue + 'px'
        this.ys_slide_btn.style.left = leftValue + 'px'
    }
    // 鼠标抬起事件
    mouseup() {
        // 同时移除移动和松开的事件，否则会影响二次滑动
        document.removeEventListener('mousemove', this.mousemove);
        document.removeEventListener('mouseup', this.mouseup);
    }
}
export default new SlideFactory()