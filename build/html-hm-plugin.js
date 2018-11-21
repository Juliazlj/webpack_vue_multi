function HtmlHmPlugin (options) {
  // Configure your plugin with options...
  this.options = options.options
}
HtmlHmPlugin.prototype.apply = function (compiler) {
  compiler.hooks.compilation.tap('HtmlHmPlugin', (compilation) => {
    // console.log('The compiler is starting a new compilation...');
    compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync(
      'HtmlHmPlugin',
      (data, cb) => {
        data.html = data.html.toString().
            split('</head>')[0] +
          `<script>
            var _hmt = _hmt || [];
            (function() {
              var hm = document.createElement("script");
              hm.src = "https://hm.baidu.com/hm.js?6c10d149afd652f17905dd9b00aca04e";
              var s = document.getElementsByTagName("script")[0]; 
              s.parentNode.insertBefore(hm, s);
            })();
            </script>
            ` +
          data.html.toString().split('</head>')[1]
        cb(null, data)
      }
    )
  })
}

module.exports = HtmlHmPlugin