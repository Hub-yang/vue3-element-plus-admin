<template>
  <div id="login">
    <div class="form-wrap">
      <ul class="menu-tab">
        <li @click="toggleMenu(item.type)" :class="{ current: item.type == data.current_menu }"
          v-for="item in data.tab_menu" :key="item.type">
          {{ item.label }}
        </li>
      </ul>
      <el-form ref="account_form" :model="data.form" :rules="data.form_rules">
        <el-form-item prop="username">
          <label class="form-label">用户名</label>
          <el-input v-model="data.form.username" />
        </el-form-item>
        <el-form-item prop="password">
          <label class="form-label">密码</label>
          <el-input v-model="data.form.password" />
        </el-form-item>
        <el-form-item prop="passwords" v-if="data.current_menu == 'register'">
          <label class="form-label">确认密码</label>
          <el-input v-model="data.form.passwords" />
        </el-form-item>
        <el-form-item prop="code">
          <label class="form-label">验证码</label>
          <el-row :gutter="10">
            <el-col :span="14">
              <el-input v-model="data.form.code"></el-input>
            </el-col>
            <el-col :span="10">
              <el-button class="el-button-block" type="success" :disabled="data.code_button_disabled"
                :loading="data.code_button_loading" @click="handlerGetCode">{{ data.code_button_text }}</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" class="el-button-block" :disabled="data.submit_button_disabled"
            :loading="data.submit_button_loading" @click="submitForm">
            {{ data.current_menu === "login" ? "登录" : "注册" }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import {
  validate_email,
  validate_password,
  validate_code,
} from "../../utils/validate"
import { GetCode, Register, Login, ErrorHttp } from "../../api/account"
import { ElMessage } from "element-plus";

const account_form = ref(null)
// 自定义校验规则
const validate_name_rules = (rule, value, callback) => {
  const regEmail = validate_email(value)
  if (value === "") {
    callback(new Error("请输入邮箱"))
  } else if (!regEmail) {
    callback(new Error("邮箱格式不正确"))
  } else {
    callback()
  }
}

const validate_password_rules = (rule, value, callback) => {
  const regPassword = validate_password(value)
  if (value === "") {
    callback(new Error("请输入密码"))
  } else if (!regPassword) {
    callback(new Error("请输入>=6并且<=20位的密码，包含数字、字母"))
  } else {
    callback()
  }
}

const validate_passwords_rules = (rule, value, callback) => {
  const regPassword = validate_password(value)
  // 获取密码
  const passwordValue = data.form.password
  if (value === "") {
    callback(new Error("请输入密码"))
  } else if (!regPassword) {
    callback(new Error("请输入>=6并且<=20位的密码，包含数字、字母"))
  } else if (passwordValue && passwordValue !== value) {
    callback(new Error("两次密码不一致"))
  } else {
    callback()
  }
}

const validate_code_rules = (rule, value, callback) => {
  const regCode = validate_code(value)
  // 根据验证码校验结果更新提交按钮状态
  data.submit_button_disabled = !regCode
  if (value === "") {
    callback(new Error("请输入验证码"))
  } else if (!regCode) {
    callback(new Error("请输入6位验证码"))
  } else {
    callback()
  }
}

const data = reactive({
  form: {
    username: "",
    password: "",
    passwords: "",
    code: "",
  },
  // 校验规则
  form_rules: {
    username: [{ validator: validate_name_rules, trigger: "change" }],
    password: [{ validator: validate_password_rules, trigger: "change" }],
    passwords: [{ validator: validate_passwords_rules, trigger: "change" }],
    code: [{ validator: validate_code_rules, trigger: "change" }],
  },
  tab_menu: [
    { type: "login", label: "登录" },
    { type: "register", label: "注册" },
  ],
  current_menu: "login",
  // 获取验证码按钮状态相关
  code_button_disabled: false,
  code_button_loading: false,
  code_button_text: "获取验证码",
  code_button_timer: null,
  // 提交按钮状态相关
  submit_button_disabled: true,
  submit_button_loading: false,
})

// 登录注册切换
const toggleMenu = (type) => {
  data.current_menu = type
}

// 获取验证码
const handlerGetCode = () => {
  const username = data.form.username
  const password = data.form.password
  const passwords = data.form.passwords
  // 校验用户名
  if (!validate_email(username)) {
    ElMessage({
      message: "用户名不能为空或格式不正确",
      type: "error",
      duration: 2000,
    })
    return false
  }
  // 校验密码
  if (!validate_password(password)) {
    ElMessage({
      message: "密码不能为空或格式不正确",
      type: "error",
      duration: 2000,
    })
    return false
  }
  // 注册时校验两次密码
  if (data.current_menu === "register" && password !== passwords) {
    ElMessage({ message: "两次密码不一致", type: "error", duration: 2000 })
    return false
  }
  // 接口参数
  const requestData = {
    username: data.form.username,
    module: "register",
  }
  // 切换状态
  data.code_button_loading = true
  data.code_button_text = "发送中..."
  // 获取验证码接口
  GetCode(requestData)
    .then((res) => {
      // 用户名存在
      if (res.resCode === 1024) {
        ElMessage.error(res.message)
        return false
      }
      ElMessage({ message: res.message, type: "success", duration: 4000 })
      // 执行倒计时
      countDown(10)
    })
    .catch((err) => {
      data.code_button_loading = false
      data.code_button_text = "获取验证码"
      throw new Error(`GetCode()接口错误:${err}`)
    })
}

// 验证码计时器
const countDown = (time) => {
  // 默认时间
  let second = time || 30
  data.code_button_loading = false
  data.code_button_disabled = true
  data.code_button_text = `倒计时${second}秒`
  if (data.code_button_timer) {
    clearInterval(data.code_button_timer)
  }
  // 开启定时器
  data.code_button_timer = setInterval(() => {
    second--
    data.code_button_text = `倒计时${second}秒`
    if (second <= 0) {
      data.code_button_disabled = false
      data.code_button_text = "重新获取"
      clearInterval(data.code_button_timer)
    }
  }, 1000)
}

// 表单提交
const submitForm = () => {
  account_form.value.validate((valid) => {
    if (valid) {
      // 判断执行的方法
      data.current_menu === "login" ? login() : register()
    } else {
      return false
    }
  })
}

const register = () => {
  data.submit_button_loading = true
  // 请求参数
  const requestData = {
    username: data.form.username,
    password: data.form.password,
    code: data.form.code
  }
  // 注册接口
  Register(requestData).then(res => {
    ElMessage({ message: res.message, type: "success", duration: 2000 })
    // 注册成功重置
    reset()
  }).catch(err => {
    data.submit_button_loading = false
    throw new Error("Register()接口错误:" + err)
  })
}

const login = () => {
  data.submit_button_loading = true
  // 请求参数
  const requestData = {
    username: data.form.username,
    password: data.form.password,
    code: data.form.code
  }
  Login(requestData).then(res => {
    ElMessage({ message: res.message, type: "success", duration: 2000 })
    // 重置
    reset()
  }).catch(err => {
    data.submit_button_loading = false
    throw new Error(`Login()接口错误：${err}`)
  })
}

// 表单重置
const reset = () => {
  account_form.value.resetFields()
  // 切回登录状态
  data.current_menu = "login"
  // 删除定时器
  data.code_button_timer && clearInterval(data.code_button_timer)
  data.code_button_text = "获取验证码"
  data.code_button_disabled = false
  data.submit_button_disabled = true
  data.submit_button_loading = false
}

onBeforeUnmount(() => {
  clearInterval(data.code_button_timer)
})
</script>

<style lang="scss" scoped>
#login {
  height: 100vh;
  background-color: #344a5f;

  .form-wrap {
    width: 320px;
    padding-top: 100px;
    margin: auto;

    .menu-tab {
      text-align: center;

      li {
        display: inline-block;
        padding: 10px 24px;
        margin: 0 10px;
        color: #fff;
        font-size: 14px;
        border-radius: 5px;
        cursor: pointer;

        &.current {
          background-color: rgba(0, 0, 0, 0.1);
        }
      }
    }

    .form-label {
      display: block;
      color: "#fff";
      font-size: 14px;
    }

    :deep(.el-row) {
      width: 100%;
    }
  }
}
</style>
