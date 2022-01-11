import Vue from 'vue'
import store from '@/store'
import { isString, isArray } from '../../validator/validator.js'
import settings from '@/settings'

// you can set in settings.js
// errorLog:'production' | ['production', 'development']
const { errorLog: needErrorLog } = settings

function checkNeed() {
  const env = process.env.NODE_ENV
  if (isString(needErrorLog)) {
    return env === needErrorLog
  }
  if (isArray(needErrorLog)) {
    return needErrorLog.includes(env)
  }
  return false
}

// if (checkNeed()) {
  Vue.config.errorHandler = function(err, vm, info, a) {
      // store.commit('errorLog/ADD_ERROR_LOG', {
      //   err,
      //   vm,
      //   info,
      //   url: window.location.href
      // })
      store.dispatch('errorLog/addErrorLog', {
        err,
        vm,
        info,
        url: window.location.href
      })
      console.warn('ss')
      console.warn(err, info)
  }
// }
