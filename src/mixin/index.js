export  default {
    data() {
        return {
            resizeFlag: null,
            tableHeight: 300
        }
    },
    mounted() {
        const vm = this;
        vm.getTableHeight()

        window.onresize = () => {
         if (vm.resizeFlag) {
           clearTimeout(vm.resizeFlag)
         }
         vm.resizeFlag = setTimeout(() => {
           vm.getTableHeight()
           vm.resizeFlag = null
         }, 100)
       }
      },
       // 注销window.onresize事件
     beforeRouteLeave(to, from, next) {
       //离开组件的时候触发
       window.onresize = null
     },
     methods: {
        getTableHeight() {
            let innerHeight = window.innerHeight
            if (innerHeight >= 1300) {
              this.tableHeight = 540
            } else {
              this.tableHeight = innerHeight - 700
            }
          }
     }
}