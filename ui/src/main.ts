// @ts-ignore
import Vue from 'vue';
import VTooltip from 'v-tooltip';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
// @ts-ignore
import * as interceptor from '@/api/interceptor.js';

Vue.config.productionTip = false;

Vue.use(VTooltip);

/**
 * @summary Sets interceptor for all http requests to catch unauthenticated requests
 */
interceptor.setInterceptors();

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
