<template>
  <div>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <footer class="footer g-flex bg-white u-tx-c f12">
      <div class="g-flex-c">
        <svg class="icon-svg" aria-hidden="true">
          <use xlink:href="#icon-zhuye"></use>
        </svg>
        <div>首页</div>
      </div>
      <div class="g-flex-c">
        <svg class="icon-svg" aria-hidden="true">
          <use xlink:href="#icon-dianhua"></use>
        </svg>
        <div>通讯录</div>
      </div>
      <div class="g-flex-c">
        <svg class="icon-svg" aria-hidden="true">
          <use xlink:href="#icon-wenjianjia"></use>
        </svg>
        <div>发现</div>
      </div>
      <div class="g-flex-c">
        <svg class="icon-svg" aria-hidden="true">
          <use xlink:href="#icon-lianxiren"></use>
        </svg>
        <div>我</div>
      </div>
    </footer>
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
    methods: {},
    components: {}
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .footer
    position fixed
    bottom 0
    width 100%
</style>
