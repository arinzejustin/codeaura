
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
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
  ],
});

export default router;
