import Lang from '@/utils/Lang'
import CVal from '@/utils/ConstVal'
import Tips from '@/utils/Tips'
import $api from '@/api'
import AppApi from 'libs/apicloud/app_api'

export default class base {
  static async ajax () {
    var that = this
    let args = arguments
    try {
      return await $api.ajax.apply(this, args)
    } catch (e) {
      if (e && e.status === 401) {
        let authOpts = Lang.getStorage(CVal.STORE_AUTH_NAME)
        if (authOpts.logType === 'a_auth') {
          Tips.toast('APP令牌失效，请返回重试')
          setTimeout(function () {
            AppApi.sendAppEvent('AuthInvalid')
          }, 1000)
        }
        await that.login()
        return await $api.ajax.apply(this, args)
      } else if (e && e.status === 500) {
        Tips.toast('网络不给力,请稍后再试')
        return Promise.reject(e)
      } else if (e.errorCode === 10600) {
        location.replace(process.env.PROJECT_NAME +
          '/html/missUrl.html')
        return Promise.reject(e)
      } else {
        return Promise.reject(e)
      }
    }
  }

  static async get (url, data, opts = {doException: true}) {
    return await this.ajax({
      method: 'GET',
      url: url,
      data: data,
      doException: opts.doException
    })
  }

  static async post (url, data, opts = {doException: true}) {
    return await this.ajax({
      method: 'POST',
      url: url,
      data: data,
      doException: opts.doException
    })
  }

  static async getText (url, data, opts = {doException: true}) {
    return await this.ajax({
      method: 'GET',
      url: url,
      data: data,
      type: 'text',
      doException: opts.doException
    })
  }

  /**
   * 普通登录
   * @returns {Promise.<*>}
   */
  static async commonLogin (username, password) {
    let ret = null
    try {
      ret = await this.post('/member/login/login.do', {
        username: username,
        password: password
      })
    } catch (e) {
      console.error(e)
      // 用户不存在
      if (e.errorCode === 10021) {
        Tips.toast('该用户不存在')
        Lang.cleanStorage()
      }
      if (e.errorCode === 10020) {
        Lang.cleanStorage()
      }
      await base.openLogin()
    }
    if (ret.success) {
      let authInfo = {
        logType: 'c_auth',
        password: password
      }
      Lang.updateStorage(CVal.STORE_AUTH_NAME, authInfo)
      common.updateUserInfo(ret.data)
    } else {
      await Tips.toast(ret.description || '登录失败')
    }
    return ret
  }

  /**
   * app授权登录
   * @param token
   * @returns {Promise.<void>}
   */
  static async loginByToken (token) {
    Lang.updateStorage(CVal.STORE_USER_NAME, {token: token})
    let ret = await this.post('/member/login/getLoginMember.do')
    if (ret.success) {
      let authInfo = {
        logType: 'a_auth'
      }
      Lang.setStorage(CVal.STORE_USER_NAME, ret.data)
      Lang.updateStorage(CVal.STORE_AUTH_NAME, authInfo)
    }
  }

  /**
   * 获取微信授权链接
   * @returns {Promise.<*>}
   */
  static async getAuthUrl (url, orgId) {
    return await this.get('/wechat/wechat/getBaseOathorizeUrl.do', {
      redirectUri: url,
      memberId: orgId
    })
  }

  /**
   * 授权登录
   * @returns {Promise.<*>}
   */
  static async tpLogin (userInfo = {
    openId: '',
    logo: '',
    realname: '',
    unionId: ''
  }) {
    let authOpts = Lang.getStorage('authOpts')
    let ret = await this.post('/member/login/tp_login.do', {
      openId: userInfo.openId,
      type: 3,
      logo: userInfo.logo,
      realname: userInfo.realname,
      unionId: userInfo.unionId,
      merchantId: authOpts.orgId
    })
    if (ret.success) {
      Object.assign(authOpts, {
        logType: 'w_auth',
        password: '',
        userAppId: authOpts.appId
      })
      Lang.setStorage(CVal.STORE_AUTH_NAME, authOpts)
      common.updateUserInfo(ret.data)
    } else {
      Tips.toast('登录失败')
      Lang.cleanStorage()
    }
    return ret
  }

  /**
   * code to accessToken
   * @returns {Promise.<*>}
   */
  static async code2accessToken (code, orgId) {
    return await this.get('/wechat/wechat/getOpenId2.do', {
      code: code,
      memberId: orgId
    })
  }

  /**
   * 获取微信用户信息
   * @returns {Promise.<*>}
   */
  static async getWxUserInfo (openId, accessToken) {
    return await this.get('/wechat/wechat/userInfo.do', {
      openId: openId,
      accessToken: accessToken
    })
  }

  /**
   * 是否之前登录过 因为有多商户信息的存在 切换了公众号之后有可能isLogin已经不能判断
   * @returns {boolean}
   */
  static isBeforeLogin () {
    let authOpts = Lang.getStorage(CVal.STORE_AUTH_NAME)
    var appId = authOpts.appId// 获取当前需要登录的机构的appId；
    var openId = orgKeys[appId] || ''// 获取 keys里的 openId
    if (openId) {
      return true
    }
    return false
  }

  /**
   * 是否登录
   * @returns {boolean}
   */
  static isLogin () {
    let authOpts = Lang.getStorage(CVal.STORE_AUTH_NAME) || {}
    let orgKeys = Lang.getStorage(CVal.STORE_ORGKEY_NAME) || {}
    let curuser = Lang.getStorage(CVal.STORE_USER_NAME)
    var flag = false
    var appId = authOpts.appId// 获取当前需要登录的机构的appId；
    var userAppId = authOpts.userAppId// 当前用户的appId，与appId的值可能不同，说明切换了授权公众号
    var openId = orgKeys[appId] || ''// 获取 keys里的 openId
    if (curuser) {
      if (authOpts.password) { // 用户密码登录
        flag = true
      } else if (authOpts.logType == 'a_auth') { // app登录
        flag = true
      } else { // 微信登录
        if (appId == userAppId && openId) {
          flag = true
        }
      }
    }
    return flag
  }

  static async weChatLogin () {
    var that = this
    let curuser = Lang.getStorage(CVal.STORE_USER_NAME) || {}
    let authOpts = Lang.getStorage(CVal.STORE_AUTH_NAME) || {}
    let orgKeys = Lang.getStorage(CVal.STORE_ORGKEY_NAME) || {}
    var wxCode = Lang.getParameter('code', window.document.location.href) ||
      ''
    // 微信授权会话码;

    var orgId = authOpts.orgId || ''
    // 机构memberId，获取当前登录的是哪个机构的公众号；

    var appId = authOpts.appId
    // 获取当前需要登录的机构的appId；

    var openId = orgKeys[appId] || '' // 获取 keys里的 openId
    // 判断是否需要跳转授权
    if (!openId && !wxCode) {
      let ret = await that.getAuthUrl(window.constant.projectUrl +
        '/html/login_loading.html?bUrl=' + encodeURIComponent(location.href), orgId)
      Lang.setStorage('loginBackUrl', location.href)
      location.replace(ret.data.url)
      throw new Error('打开微信授权')
    } else {
      // openId不为空表示之前已经登陆过了
      if (openId) {
        await that.tpLogin({
          openId: openId,
          logo: curuser.logo || '',
          realname: curuser.realname || '',
          unionId: ''
        })
      } else {
        let accessData = await that.code2accessToken(wxCode, orgId)
        console.log('code2accessToken', accessData)
        if (accessData.data.access_token && accessData.data.openid) {
          let wxUserInfo = await that.getWxUserInfo(accessData.data.openid,
            accessData.data.access_token)
          wxUserInfo = wxUserInfo.data
          console.log('getWxUserInfo', wxUserInfo)
          orgKeys[appId] = wxUserInfo.openid
          authOpts.openId = wxUserInfo.openid
          Lang.setStorage(CVal.STORE_ORGKEY_NAME, orgKeys)
          Lang.setStorage(CVal.STORE_AUTH_NAME, authOpts)
          await that.tpLogin({
            openId: wxUserInfo.openid,
            unionId: wxUserInfo.unionid,
            logo: wxUserInfo.headimgurl,
            realname: wxUserInfo.nickname
          })
        }
      }
    }
  }

  /**
   * 通用登录方法
   * @returns {Promise.<void>}
   */
  static async login () {
    var that = this
    if (that.isLogin()) {
      let authOpts = Lang.getStorage(CVal.STORE_AUTH_NAME)
      let curuser = Lang.getStorage(CVal.STORE_USER_NAME)
      if (authOpts.password) { // 普通登陆
        if (curuser.mobile || curuser.username) {
          await that.commonLogin(curuser.username || curuser.mobile,
            authOpts.password)
        } else {
          Lang.printLog('warn', '登陆错误，没有发现用户名')
          Lang.cleanStorage()
          location.reload()
        }
      } else if (Lang.browserVersion().weixin) { // 授权登陆
        await that.weChatLogin()
      } else if (curuser.token) {
        await that.loginByToken(curuser.token)
      }
    } else {
      await that.openLogin()
    }
    document.dispatchEvent(new Event('txzLoginSucc', {'bubbles': true, 'cancelable': false}))
  }

  /**
   * 打开登录
   */
  static async openLogin () {
    if (Lang.browserVersion().weixin) {
      await this.weChatLogin()
    } else {
      if (location.href.indexOf('/login.html') === -1) {
        Lang.setStorage('loginBackUrl', location.href)
        window.openWindow('_self', window.constant.projectUrl +
          '/html/login.html')
      }
      throw new Error('打开登录')
    }
  }

  /**
   * 登出
   * @returns {Promise.<void>}
   */
  static logout () {
    this.post('/member/login/logout.do')
    Lang.cleanStorage()
    let url = Lang.parseUrl(location.href, {v: new Date().getTime()})
    location.replace(url)
  }

  /**
   * 处理用户的权限状态
   * @param statusList 需要判断的权限 数组
   */
  static async handelUserStatus (statusList) {
    var that = this
    let curuser = Lang.getStorage(CVal.STORE_USER_NAME)
    return new Promise(async (resolve, reject) => {
      for (var i = 0; i < statusList.length; i++) {
        if (statusList[i] === 'login') {
          if (!that.isLogin()) {
            await that.login()
          }
        } else if (statusList[i] === 'noPartner') {
          if (curuser && curuser.isPartner == 1) {
            Tips.toast('您现在使用的是合作商账号，请退出后重新进行操作。')
            reject()
          }
        }
      }
      resolve()
    })
  }
}
