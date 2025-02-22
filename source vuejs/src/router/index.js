import { createRouter, createWebHistory } from "vue-router";
// import Layout from "../components/App/Layout.vue";
import Authen from "../views/Authen.vue";
import User from "../views/User.vue";
import Campaign from "../views/Campaign.vue";

import { useAuthStore } from "@/stores/auth";

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: () => import("../views/Home.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/404",
    name: "404",
    component: () => import("../views/404.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("../views/404.vue"),
  },
  {
    path: "/403",
    name: "403",
    component: () => import("../views/403.vue"),
  },
  {
    path: "/Authen",
    name: "Authen",
    component: Authen,
    props: { default: true, menu: true, type: "default" },
  },

  {
    path: "/Campaign",
    name: "Campaign",
    component: Campaign,
    meta: { requiresAuth: true, accessLevel: "Campaign" },
  },
  {
    path: "/User",
    name: "User",
    component: User,
    meta: { requiresAuth: true, accessLevel: "User" },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
// if (token) {
//   try {
//     const userData = await authStore.getUserFromToken(token);
//   } catch (error) {
//     authStore.logout();
//   }
// }
const clearData = (authStore) => {
  authStore.setToken(null);
  authStore.setUser(null);
};
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  if (to.name === "Authen" && authStore.token) {
    if (!authStore.user) {
      try {
        let userData = await authStore.getUserFromToken(authStore.token);
        if (userData) {
          next({ name: "Dashboard" });
          return;
        }
        clearData(authStore);
        return next();
      } catch (error) {
        clearData(authStore);
        return next();
      }
    } else {
      return next({ name: "Dashboard" });
    }
  }

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    console.log("REQUEST AUTHEN");
    console.log(authStore.user);
    if (!authStore.token) {
      clearData(authStore);
      return next({ name: "Authen" });
    }
    if (!authStore.user) {
      try {
        await authStore.getUserFromToken(authStore.token);
        // return next();
      } catch (error) {
        clearData(authStore);
        return next({ name: "Authen" });
      }
    }

    return next();

    const userAccess = authStore.user?.access;
    if (!userAccess) {
      return next({ name: "403" });
    } else {
      if (to.meta.accessLevel) {
        if (userAccess && userAccess[to.meta.accessLevel] !== "none") {
          return next();
        } else {
          return next({ name: "403" });
        }
      } else {
        return next();
      }
    }
  } else {
    return next();
  }
});

export default router;
