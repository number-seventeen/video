import Vue from 'vue'
import Vuex from 'vuex'
import appStore from './appStore/AppStore.js'

Vue.use(Vuex)

export default new Vuex.Store({
	modules: { 
		appStore,
	}
})
