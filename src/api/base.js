import Tips from '@/utils/Tips'
import $api from '@/api'

export default class base {
  static async ajax () {
    let args = arguments
    try {
      return await $api.ajax.apply(this, args)
    } catch (e) {
      if (e && e.status === 500) {
        Tips.toast('服务器异常')
      }
      return Promise.reject(e)
    }
  }

  static async get (url, data, opts = { doException: true }) {
    return await this.ajax({
      method: 'GET',
      url: url,
      data: data,
      doException: opts.doException
    })
  }

  static async post (url, data, opts = { doException: true }) {
    return await this.ajax({
      method: 'POST',
      url: url,
      data: data,
      doException: opts.doException
    })
  }

}
