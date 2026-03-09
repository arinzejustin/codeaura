import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";

const isExtension = import.meta.env.VITE_VSCODE_EXT === 'true';

const router = createRouter({
  history: isExtension ? createWebHashHistory() : createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("./App.vue"),
    },
    {
      path: "/s/:code",
      name: "share-viewer",
      component: () => import("./views/ShareView.vue"),
    },
    {
      path: "/auth/callback",
      name: "auth-callback",
      component: () => import("./views/AuthCallback.vue"),
    },
    {
      path: "/auth/vscode-login",
      name: "vscode-login",
      component: () => import("./views/VscodeLogin.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

export default router;
