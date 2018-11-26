<template>
  <div>
    首页
    <button @click="openAnotherPage">打开另一个页面</button>
  </div>
</template>

<script>
  import 'css/iconfont'
  import 'css/app.styl'

  export default {
    data () {
      return {}
    },
    mixins: [],
    computed: {},
    created: async function () {
    },
    mounted: function () {
    },
    methods: {
      openAnotherPage () {
        window.open('./new_page.html', '_self')
      }
    },
    components: {}
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
