module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    // vxe-table的按需加载  npm install babel-plugin-import -D
    [
      "import",
      {
        "libraryName": "vxe-table",
        "style": true // 样式是否也按需加载
      },
      "@babel/plugin-syntax-dynamic-import" // 路由的动态加载需要
    ],
    // element的按需加载  npm install babel-plugin-component --save-dev
    [
      "component",
      {
        libraryName: "element-ui",
        styleLibraryName: "~element-#287BB5",
      }
    ],
    // echarts的按需加载  npm install babel-plugin-equire -D
    "equire"
  ],
}