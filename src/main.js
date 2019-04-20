import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import myDirective from './components/MyDirective'
import style from './style/style.scss';

Vue.config.productionTip = false;
Vue.use(myDirective)


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
