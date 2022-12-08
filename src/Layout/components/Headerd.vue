<template>
  <div class="header_wrap">
    <!-- 左侧 -->
    <div class="wrap">
      <span class="menu_btn" @click="switchAside">
        <svg-icon iconName="menuBtn" className="icon-menu-svg"></svg-icon>
      </span>
    </div>
    <!-- 右侧 -->
    <div class="wrap">
      <div class="user_info">
        <div class="face_info">
          <img src="../../assets/images/logo-min.png" alt="avater" />
          <span class="name">{{ username }}</span>
        </div>
        <span class="logout" @click="logout">
          <svg-icon iconName="logout" className="icon-logout"></svg-icon>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
const router = useRouter()
const { commit, state, dispatch } = useStore()
const switchAside = () => {
  commit("app/SET_COLLAPSE")
}

const username = ref(state.app.username)

const logout = () => {
  ElMessageBox.confirm("确认退出管理后台?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    showClose: false,
    closeOnClickModal: false,
    type: "warning",
  })
    .then(() => {
      dispatch("app/logoutAction")
        .then((res) => {
          ElMessage({ message: res.message, type: "success", duration: 2000 })
          router.replace("/login")
        })
        .catch((err) => {
          throw new Error(`Logout()接口错误：${err}`)
        })
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消退出",
        duration: 2000,
      })
    })
}
</script>

<style scoped lang="scss">
.header_wrap {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .menu_btn {
    cursor: pointer;
  }

  .user_info {
    display: flex;
    align-items: center;

    .face_info {
      span,
      img {
        display: inline-block;
        vertical-align: middle;
      }

      span {
        margin-left: 15px;
      }
    }

    .logout {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 55px;
      height: 55px;
      cursor: pointer;
    }
  }
}
</style>
