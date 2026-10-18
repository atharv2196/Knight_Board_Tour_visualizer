import { createRouter, createWebHistory } from "vue-router"
import store from "@/store"

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Home.vue")
  },
  {
    path: "/about",
    name: "About",
    component: () => import("@/views/About.vue")
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/"
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((_to, _from, next) => {
  store.dispatch("updateBoardState", "unready")
  next()
})

export default router
