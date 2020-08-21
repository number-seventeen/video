import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import './theme/element-variables.scss';
import 'font-awesome/css/font-awesome.css';
import './style/index.css';
import './plugins/axios'
import router from './router';
import store from './store';
import App from './App.vue';
import Vuex from 'vuex';

import axios from 'axios'
Vue.use(Vuex)
	


Vue.prototype.$http = axios

console.log("%c ====================== VideoBatches 0.0.0=========================","color:#f00;font-size:20px;");

Vue.use(ElementUI);

Vue.config.productionTip = false;
// Vue.prototype.$App = new $App();
// Vue.winSearch = window.location.search;

window.AppVue = new Vue({
	render: h => h(App),
	router,
	store
}).$mount('#app')

