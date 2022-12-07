import Cookies from "js-cookie"

const tokenKey = "tokenAdmin"
const userNameKey = "username"

export const getToken = () => Cookies.get(tokenKey)

export const setToken = (value) => Cookies.set(tokenKey, value)

export const removeToken = () => Cookies.remove(tokenKey)

export const getUsername = () => Cookies.get(userNameKey)

export const setUsername = (value) => Cookies.set(userNameKey, value)

export const removeUsername = () => Cookies.remove(userNameKey)
