"use strict";

import Vue from 'vue';
import axios from "axios";

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
// baseURL: process.env.baseURL || process.env.apiUrl || ""
// timeout: 60 * 1000, // Timeout
// withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
	function(config) {
		// Do something before request is sent
		return config;
	},
	function(error) {
		// Do something with request error
		return Promise.reject(error);
	}
	);

	// Add a response interceptor
	_axios.interceptors.response.use(
	function(response) {
		// Do something with response data
		if (response.status == 200) {
			return response.data;
			// let code = response.data.returnCode;
			// if(code == undefined){
			// 	code = response.data.code;
			// }
			// if(code == 0 || code === '0000'){
			// 	return response.data.returnData || response.data.data;
			// }else {
			// 	if(response.data instanceof ArrayBuffer){
			// 		return response.data;
			// 	}
			// 	else if(response.data instanceof Blob){
			// 		return response.data;
			// 	}
			// 	else if(typeof response.data == 'string' || typeof response.data == 'object'){
			// 		return response.data;
			// 	}
			// 	else{
			// 		return Promise.reject(response.data.returnDesc)
			// 	}
			// }
		}
		else{
			return Promise.reject('error')
		}
	},
	function(error) {
		// Do something with response error
		return Promise.reject(error);
	}
);

Plugin.install = function(Vue, options) {
	Vue.axios = _axios;
	window.axios = _axios;
	Object.defineProperties(Vue.prototype, {
		axios: {
			get() {
				return _axios;
			}
		},
		$axios: {
			get() {
				return _axios;
			}
		},
	});
};

Vue.use(Plugin)

export default Plugin;
