/**
 * @description 日期格式化工具
 * @params {String} value 时间的值
 * @params {String} type date对应年月日；time对应年月日时分秒；默认为完成日期时间
 * @aprams {Boolean} br true为换行；false默认值：不换行
 */

export function getData(params) {
  const newDate = params.value ? new Date(params.value) : new Date()
  // 年
  let year = newDate.getFullYear()
  // 月
  let month = newDate.getMonth() + 1
  // 日
  let day = newDate.getDate()
  // 时
  let hh = newDate.getHours()
  // 分
  let mm = newDate.getMinutes()
  // 秒
  let ss = newDate.getSeconds()

  if (month < 10) {
    month = `0${month}`
  }
  if (day < 10) {
    day = `0${day}`
  }
  if (hh < 10) {
    hh = `0${hh}`
  }
  if (mm < 10) {
    mm = `0${mm}`
  }
  if (ss < 10) {
    ss = `0${ss}`
  }
  // 连接符
  const conn = params.conn || "-"
  // 格式化
  const br = params.br ? "<br />" : " "
  const date = `${year}${conn}${month}${conn}${day}`
  const time = `${hh}:${mm}:${ss}`
  // 判断并返回指定格式
  if (params.type === "date") {
    return date
  }
  if (params.type === "time") {
    return time
  }
  // 默认
  return `${date}${br}${time}`
}
