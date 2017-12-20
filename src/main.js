// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

import mui from './js/mui/mui.js';
mui.init();
mui("body").on('tap', 'a', function() {
    var href = this.getAttribute('href');
    if (href)
        location.href = href
})