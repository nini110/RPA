export default {
  methods: {
    openMessageBox (options) {
      let vm = this;
      vm.$msgbox({
        title: options.title || '温馨提示',
        lockScroll: false,
        dangerouslyUseHTMLString: true,
        showClose: options.showClose || false,
        closeOnPressEscape: false,
        closeOnClickModal: false,
        callback: options.callback,
        customClass: options.customClass || 'el-message-box1',
        confirmButtonClass: options.confirmButtonClass || 'el-button--solid w90',
        cancelButtonClass: options.cancelButtonClass || 'el-button--text',
        showCancelButton: options.showCancelButton || false,
        message:
          `<div class='tips-box'>
						<div class='tips-box-tit'>
							<i class="el-message-box__icon el-icon-${options.type || 'warning'}"></i>
							<span class='tips-box-title'>${options.tipTitle || ''}<span style="color:#f56c6c">${options.curItem || ''}</span></span>
						</div>
						<div class="tips-box-txt ${options.auth ? `a` : ''}">
							${options.auth ? `<a target="_blank" href="${options.tipContent}">点击跳转授权</a>` : options.tipContent ? `<div>${options.tipContent}</div>` : ''
          }
						</div>
                 	</div>`,
        confirmButtonText: options.confirmButtonText || '确 定',
        cancelButtonText: options.cancelButtonText || '取 消'
      }).then(action => {
        if (typeof options.confirmButtonFn === 'function') {
          options.confirmButtonFn();
        }
      }).catch(action => {
        if (typeof options.cancelButtonFn === 'function') {
          options.cancelButtonFn();
        }
      });
    },
  }
}
