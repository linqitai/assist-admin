import Vue from 'vue';
import App from './App.vue';
import router from './router';
//import store from './store/index'; //引入store
// import axios from 'axios';
import ajax from '@/components/api/ajax';
import api from '@/components/api/index';
import config from '@/assets/js/config';
import utils from '@/assets/js/utils';
import reg from '@/assets/js/reg';
import * as filters from '@/assets/js/filters';
import VueResource from 'vue-resource'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import './assets/css/icon.css';
import '@/assets/scss/iconfont.scss';
import './components/common/directives';
import "babel-polyfill";

Vue.config.productionTip = false
Vue.use(ElementUI, {
    size: 'medium'
});
Vue.use(VueResource)
// Vue.prototype.$axios = axios;
Vue.prototype.$ajax = ajax;
Vue.prototype.$api = api;
Vue.prototype.$config = config;
Vue.prototype.$utils = utils;
Vue.prototype.$reg = reg;

// 全局注册过滤器
Object.keys(filters).forEach((key) => {
	// console.log(filters[key]);
	Vue.filter(key, filters[key]);
});

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
