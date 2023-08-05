<template>
  <!-- 第三方工具 -->
  <div class="BeijingMustPass" style="height: 100%">
    <transition name="el-fade-in-linear">
      <router-view />
    </transition>
    <!-- pdf -->
    <!-- <div class="pdf pdf-preview-out" v-show="fileType === 'pdf'">
      <div class="scroll-box">
        <p class="arrow">
          <span @click="changePdfPage(0)" class="turn" :class="{ grey: currentPage == 1 }">Preview</span>
          {{ currentPage }} / {{ pageCount }}
          <span @click="changePdfPage(1)" class="turn" :class="{ grey: currentPage == pageCount }">Next</span>
        </p>
        <pdf :src="src" :page="currentPage" @num-pages="pageCount = $event" @page-loaded="currentPage = $event"
          @loaded="loadPdfHandler">
        </pdf>
      </div>
    </div> -->
  </div>
</template>

<script>
import { getPDF } from '@/api/api'
// import pdf from 'vue-pdf'
export default {
  name: "ThirdPartyTools",
  // components: { pdf },
  data () {
    return {
      currentPage: 0, // pdf文件页码
      pageCount: 0, // pdf文件总页数
      fileType: 'pdf', // 文件类型
      // pdfurl: '/static/阿里大佬.pdf', // pdf文件地址
      src: ''
    };
  },
  created () {
    // this.src = encodeURI(this.pdfurl)
    // // 有时PDF文件地址会出现跨域的情况,这里最好处理一下
    // this.src = require(pdf.createLoadingTask(this.src))
  },
  methods: {
    // 改变PDF页码,val传过来区分上一页下一页的值,0上一页,1下一页
    changePdfPage (val) {
      if (val === 0 && this.currentPage > 1) {
        this.currentPage--
      }
      if (val === 1 && this.currentPage < this.pageCount) {
        this.currentPage++
      }
    },

    // pdf加载时
    loadPdfHandler (e) {
      this.currentPage = 1 // 加载的时候先加载第一页
    }
  }
};
</script>

<style lang="less" >
@import "@/views/index.less";
@import "@/views/Qianchuan/index.less";
@import "@/views/Qianchuan/items/index.less";

.pdf {
  position: relative;
  margin-top: 60px;
  height: calc(100% - 60px);
}

.arrow {
  position: absolute;
  left: 50%;
  bottom: 10px;
  transform: translateX(-50%);
  z-index: 99;
  font-size: 26px;
  font-weight: bold;
  background-color: #409eff;
  padding: 10px 40px;

  span {
    display: inline-block;
    margin: 0 40px;
    cursor: pointer;
    color: #fff;
  }
}

.linkAnnotation {
  display: none;
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
    height: calc(100% - 80px);
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

      // border: 1px solid #909;
      span {
        margin-right: 20px;
      }
    }

    .scale {
      // border: 1px solid #909;
      text-align: right;
    }
  }
}
</style>
