<template>
  <div>
    <div class="main-mn">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
    <footer class="footer g-flex bg-white u-tx-c f12">
      <div class="g-flex-c tab-itm" :class="{'sel': tabIdx === 0}" @click="changeRoute(0,'/home')">
        <svg class="icon-svg" aria-hidden="true">
          <use xlink:href="#icon-zhuye"></use>
        </svg>
        <div>首页</div>
      </div>
      <div class="g-flex-c tab-itm" :class="{'sel': tabIdx === 1}" @click="changeRoute(1,'/discover')">
        <svg class="icon-svg" aria-hidden="true">
          <use xlink:href="#icon-wenjianjia"></use>
        </svg>
        <div>发现</div>
      </div>
      <div class="g-flex-c tab-itm" :class="{'sel': tabIdx === 2}" @click="changeRoute(2,'/my')">
        <svg class="icon-svg" aria-hidden="true">
          <use xlink:href="#icon-lianxiren"></use>
        </svg>
        <div>我</div>
      </div>
    </footer>
    <div class="footer-p"></div>
  </div>
</template>

<script>
  import 'css/iconfont'
  import 'css/app.styl'
  import baseVue from 'pages/base'

  const routerKeys = ['/home', '/discover', '/my']
  export default {
    extends: baseVue,
    data () {
      return {
        tabIdx: 0
      }
    },
    mixins: [],
    computed: {},
    created: async function () {
      this.tabIdx = routerKeys.indexOf(location.href.substring(location.href.indexOf('#') + 1))
      this.tabIdx === -1 && (this.tabIdx = 0)
      this.appLoaded()
    },
    mounted: function () {
    },
    methods: {
      changeRoute (idx, route) {
        this.tabIdx = idx
        this.$router.push({path: route})
      }
    },
    components: {}
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../css/const.styl"
  .main-mn
    min-height calc(100vh - 90px)

  .footer-p
    height 90px

  .footer
    position fixed
    bottom 0
    width 100%
    height 90px
    max-width max_bd_w; /*no*/
    .tab-itm
      opacity .6

      &.sel
        color: #dd4026
        opacity 1

</style>
