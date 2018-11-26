<template>
  <div>
    这是一个新页面
  </div>
</template>

<script>
  import 'css/iconfont'
  import 'css/app.styl'
  import baseVue from 'pages/base'

  export default {
    extends: baseVue,
    data () {
      return {
      }
    },
    mixins: [],
    computed: {},
    created: async function () {
      this.appLoaded()
    },
    mounted: function () {
    },
    methods: {
    },
    components: {}
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../css/const.styl"

</style>
