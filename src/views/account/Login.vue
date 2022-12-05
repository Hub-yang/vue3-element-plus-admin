<template>
  <div id="login">
    <div class="form-wrap">
      <ul class="menu-tab">
        <li @click="toggleMenu(item.type)" :class="{ current: item.type == data.current_menu }"
          v-for="(item, index) in data.tab_menu" :key="item.type">
          {{ item.label }}</li>
      </ul>
      <el-form ref="form" :model="data.form" :rules="data.form_rules">
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
              <el-button class="el-button-block" type="success" @click="handlerGetCode">获取验证码</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" class="el-button-block" disabled>登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue"
import { validate_email, validate_password, validate_code } from "../../utils/validate"
import { GetCode } from "../../api/common"

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
    code: ""
  },
  // 校验规则
  form_rules: {
    username: [
      { validator: validate_name_rules, trigger: "change" }
    ],
    password: [
      { validator: validate_password_rules, trigger: "change" }
    ],
    passwords: [
      { validator: validate_passwords_rules, trigger: "change" }
    ],
    code: [
      { validator: validate_code_rules, trigger: "change" }
    ]
  },

  code: "",
  tab_menu: [
    { type: "login", label: "登录" },
    { type: "register", label: "注册" },
  ],
  current_menu: "login"
})



const toggleMenu = ((type) => {
  data.current_menu = type
})

// 获取验证码
const handlerGetCode = () => {
  GetCode()
}
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
          background-color: rgba(0, 0, 0, .1);
        }
      }
    }

    .form-label {
      display: block;
      color: '#fff';
      font-size: 14px;
    }

    :deep(.el-row) {
      width: 100%;
    }

  }
}
</style>