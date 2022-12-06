import { createRouter, createWebHashHistory } from "vue-router"

const routes = [
  // Home
  {
    path: "/",
    redirect: "Login",
    hidden: true,
  },
  // Login
  {
    path: "/login",
    name: "Login",
    hidden: true,
    component: () => import("../views/account/Login.vue"),
  },
  {
    path: "/home",
    name: "Home",
    meta: {
      title: "控制台",
    },
    component: () => import("../Layout/Index.vue"),
    children: [
      {
        path: "/console",
        name: "Console",
        meta: {
          title: "首页",
        },
        component: () => import("../views/console/Index.vue"),
      },
    ],
  },
  {
    path: "/news",
    name: "News",
    meta: {
      title: "信息管理",
    },
    component: () => import("../Layout/Index.vue"),
    children: [
      {
        path: "/newsIndex",
        name: "NewsIndex",
        meta: {
          title: "信息列表",
        },
        component: () => import("../views/info/Index.vue"),
      },
      {
        path: "/newsCategory",
        name: "NewsCategory",
        meta: {
          title: "信息分类",
        },
        component: () => import("../views/info/Category.vue"),
      },
      {
        path: "/newsDetailed",
        name: "NewsDetailed",
        hidden: true,
        meta: {
          title: "信息详情",
        },
        component: () => import("../views/info/Detailed.vue"),
      },
    ],
  },
  {
    path: "/user",
    name: "User",
    meta: {
      title: "用户管理",
    },
    component: () => import("../Layout/Index.vue"),
    children: [
      {
        path: "/userIndex",
        name: "UserIndex",
        meta: {
          title: "用户列表",
        },
        component: () => import("../views/user/Index.vue"),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
