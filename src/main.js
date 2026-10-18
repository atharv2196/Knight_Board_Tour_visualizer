import "chessboard-element"
import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"

const redirect = sessionStorage.redirect
delete sessionStorage.redirect
if (redirect && redirect !== location.href) {
  const path = redirect.replace(location.origin, "")
  router.replace(path)
}

const app = createApp(App)
app.use(router)
app.use(store)
app.mount("#app")
