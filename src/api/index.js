import CVal from '@/utils/ConstVal'
import Lang from '@/utils/Lang'
import Tips from '@/utils/Tips'

const baseURL = process.env.NODE_ENV === 'development' ? '/debug_api' : '' // 因为我本地做了反向代理
/**
 * 异常
 */
const handelException = (res) => {
  if (res.description) {
    Tips.toast(res.description)
  }
  Tips.loaded()
}
/**
 * 判断请求是否成功
 */
const isSuccess = res => {
  return res && res.success
}
const ajax = ({method, url, data = {}, type = 'json', doException = true}) => {
  return new Promise((resolve, reject) => {
    let uInfo = Lang.getStorage(CVal.STORE_USER_NAME)
    data = Object.assign(data, {t: new Date().getTime()})
    let token
    if (uInfo) {
      token = uInfo.token
    }
    $.ajax({
      type: method,
      url: url.indexOf('http') === 0 ? url : baseURL + url,
      headers: {
        'Authorization': token
      },
      data: data,
      dataType: type,
      success: function (res) {
        if (type === 'json') {
          if (isSuccess(res)) {
            resolve(res)
          } else {
            console.error('ajax err', url, data, JSON.stringify(res))
            doException && handelException(res)
            reject(res)
          }
        } else {
          resolve(res)
        }
      },
      error: function (err) {
        console.error('ajax err', url, data, JSON.stringify(err))
        if (err.readyState !== 0) {
          reject(err)
        }
      }
    })
  })
}
export default {
  baseURL,
  ajax
}
