import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element'
import './plugins/fontawesome'
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/reset.css'
import api from './api'
import 'babel-polyfill';

Vue.config.productionTip = false
Vue.prototype.$api = api;

router.afterEach(() => {
  window.scrollTo(0, 0);
})

const isDebug_mode = process.env.NODE_ENV !== 'production';
Vue.config.debug = isDebug_mode;
Vue.config.devtools = isDebug_mode;
Vue.config.productionTip = isDebug_mode;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
