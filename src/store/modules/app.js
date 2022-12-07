import {
  setToken,
  setUsername,
  getToken,
  getUsername,
  removeToken,
  removeUsername,
} from "@/utils/cookies"
import { Login, Logout } from "../../api/account"
const state = {
  collapse: JSON.parse(sessionStorage.getItem("collapse")) || false,
  token: "" || getToken(),
  username: "" || getUsername(),
}
const getters = {}
const mutations = {
  SET_COLLAPSE(state) {
    state.collapse = !state.collapse
    // 存储状态
    sessionStorage.setItem("collapse", JSON.stringify(state.collapse))
  },
  // 设置token
  SET_TOKEN(state, value) {
    state.token = value
    // value存在时写入缓存
    value && setToken(value)
  },
  // 设置用户名
  STE_USERNAME(state, value) {
    state.username = value
    // value存在时写入缓存
    value && setUsername(value)
  },
}
const actions = {
  // 登录
  loginAction({ commit }, requestData) {
    return new Promise((resolve, reject) => {
      Login(requestData)
        .then((res) => {
          // 写入cookies
          commit("SET_TOKEN", res.data.token)
          commit("STE_USERNAME", res.data.username)
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  // 退出登录
  logoutAction({ commit }) {
    return new Promise((resolve, reject) => {
      Logout()
        .then((res) => {
          // 清除cookie，重置state
          removeToken()
          removeUsername()
          commit("SET_TOKEN", "")
          commit("STE_USERNAME", "")
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
