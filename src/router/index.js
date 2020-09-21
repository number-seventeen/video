import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import Login from '../views/login/Login.vue';
import PageSource from '../views/source/PageSource.vue';
import PageEdit from '../views/edit/PageEdit.vue';
import Playprograss from '../views/edit/Playprograss.vue'
import Sort from '../views/edit/Sort.vue'
Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		// name: 'Login',
		// component: Login,
		redirect:'/login',
	},
	{
		path: '/Login',
		name: 'Login',
		component: Login,
		// redirect:'/',
	},
	{
		path: '/Sort',
		name: 'Sort',
		component: Sort,
		// redirect:'/',
	},
	{
		path: '/source',
		name: 'source',
		component: PageSource,
		// redirect:'/login',
	},
	{
		path: '/edit',
		name: 'edit',
		component: PageEdit,
		// redirect:'/login',
		chridern:[
			{
				
				path:'playprograss',
				component:Playprograss
			},
						
			
			
		]
	},
		
	
	
	

]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router
