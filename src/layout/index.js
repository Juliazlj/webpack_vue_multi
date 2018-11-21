const layout = require('./index.ejs') // 整个页面布局的模板文件，主要是用来统筹各个公共组件的结构
const header = require('./header.ejs') // 页头的模板
const footer = require('./footer.ejs') // 页脚的模板

/* 整理渲染公共部分所用到的模板变量 */
const pf = {
  pageTitle: '', // 页面标题
  pageName: '', // 页面名称
  module: '', // 模块名称
  anasInitByOrg: false, // 用户行为分析 是否等待机构id回来再执行初始化
  extraScript: '' // 其他要引入的js文件
}

const moduleExports = {
  /* 处理各个页面传入而又需要在公共区域用到的参数 */
  init ({pageTitle, pageName, module, anasInitByOrg, extraScript}) {
    pf.pageTitle = pageTitle // 比如说页面名称，会在<title>或面包屑里用到
    pf.pageName = pageName || pageTitle
    pf.module = module
    pf.anasInitByOrg = anasInitByOrg
    pf.extraScript = extraScript
    return this
  },

  /* 整合各公共组件和页面实际内容，最后生成完整的HTML文档 */
  run (content) {
    const componentRenderData = Object.assign({}, pf) // 页头组件需要加载css/js等，因此需要比较多的变量
    const renderData = {
      header: header(componentRenderData),
      footer: footer(componentRenderData),
      content
    }
    return layout(renderData)
  }
}

module.exports = moduleExports
