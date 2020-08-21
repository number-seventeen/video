import Vue from 'vue'
import Vuex from 'vuex'
import appStore from './appStore/AppStore.js'

Vue.use(Vuex)

const store = new Vuex.Store({
    state:sessionStorage.getItem('state') ? JSON.parse(sessionStorage.getItem('state')): {
        //id
        skillId:'',
        //技能状态
        checkStatus:'',
    },
    
})

 
export default new Vuex.Store({
	modules: { 
		appStore,
	}
})
