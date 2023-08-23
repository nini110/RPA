<template>
  <el-dialog title="提示" :visible.sync="dialogVisible" fullscreen width="80%" @close="cancelEvent">
    <div class="pdf pdf-preview-out">
      <div class="scroll-box">
        <pdf ref="myPdfComponent" :src="src" :page="currentPage" @num-pages="pageCount = $event"
          @page-loaded="currentPage = $event" @loaded="loadPdfHandler">
        </pdf>
      </div>
    </div>
    <div class="pgeBox">
      <div class="pgeBox__select">
        <span>选择页码</span>
        <el-select v-model="ckPage" multiple placeholder="请选择页码" collapse-tags>
          <el-option v-for="item in pageOptions" :key="item.value" :label="item.label" :value="item.value"
            :disabled="item.dis">
          </el-option>
        </el-select>
      </div>
      <el-pagination background @current-change="handleCurrentChange" :current-page.sync="currentPage"
        layout="total, prev, pager, next, jumper" :page-size="1" :total="pageCount">
      </el-pagination>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelEvent">取 消</el-button>
      <el-button type="primary" @click="saveEvent">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import pdf from 'vue-pdf'
export default {
  name: "PDfDia",
  components: {
    pdf
  },
  props: {
    showPdf: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    dialogVisible () {
      return this.showPdf
    }
  },
  data () {
    return {
      currentPage: 0, // pdf文件页码
      pageCount: 0, // pdf文件总页数
      pdfurl: '/static/2023年开年电商速览--一面数据.pdf', // pdf文件地址
      src: '',
      ckPage: [],
      pageOptions: []
    };
  },
  created () {
    this.src = encodeURI(this.pdfurl)
    // 有时PDF文件地址会出现跨域的情况,这里最好处理一下
    // this.src = require(pdf.createLoadingTask(this.src))
  },
  methods: {
    // pdf加载时
    loadPdfHandler (e) {
      console.log(this.pageCount)
      let num = 1
      let arr = []
      while (num <= this.pageCount) {
        let obj = {
          label: `第${num}页`,
          value: num,
          dis: false
        }
        arr.push(obj)
        num++
      }
      this.pageOptions = arr
      this.currentPage = 1 // 加载的时候先加载第一页
    },
    cancelEvent () {
      this.$emit('close')
    },
    saveEvent () {
      if (this.ckPage.length === 0) {
        this.$msg({
          type: "error",
          msg: "请选择页码"
        });
        return false
      }
      this.ckPage = []
      this.$emit('close', this.ckPage)
    },
    //有接口请求 每点击一页进行一次数据请求 参数页码为动态值：
    handleCurrentChange (page) {
      this.currentPage = page;
    },
  }
}
</script>
<style lang="less">
.el-dialog {
  &__body {
    height: calc(100% - 180px);
  }
}

.pdf {
  position: relative;
  height: calc(100% - 50px);
}

.pdf-preview-out {

  // 高度为占满父组件中的外层容器(若不需要在父组件中设置高度 也可以在本组件中直接设置为所需值)
  &,
  div {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  // 滚动容器
  .scroll-box {
    // 高度按比例 溢出滚动
    height: calc(100% - 30px);
    overflow: auto;
    border: 2px solid #c0d8f3;
    border-bottom: none;
    border-radius: 6px;
    background-color: #eeeeee;

    // 滚动条样式
    &::-webkit-scrollbar {
      width: 10px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #c0d8f3;
      border-radius: 6px;
    }

    &::-webkit-scrollbar-track {
      background-color: transparent;
      border-radius: 6px;
    }

    // 用于缩放后截取掉不需要的空白的容器
    .pdf-box {
      overflow: hidden;
      padding: 24px;
      // border: 1px solid rgb(165, 11, 236);
    }

    // pdf预览区容器
    .pdf-scale-box {
      box-shadow: 0px 0px 20px 5px #666565;
      // border: 2px solid #090;
      // 设置缩放的中心点
      transform-origin: center top;
      transition: .2s;
    }
  }

  .bottom-tools {
    height: 50px;
    line-height: 50px;
    background-color: #c0d8f3;
    border: 1px solid #5caaf8;
    border-radius: 6px;
    display: flex;
    padding: 0px 24px;

    .page {
      color: #636a70;
      flex-grow: 1;

      span {
        margin-right: 20px;
      }
    }

    .scale {
      text-align: right;
    }
  }
}

.pgeBox {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #f7f7f7;
  padding: 10px 0;

  &__select {
    display: flex;
    align-items: center;

    .el-select {
      margin-left: 20px;
    }
  }
}
</style>