import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import Login from '../views/login/Login.vue';
import PageSource from '../views/source/PageSource.vue';
import PageEdit from '../views/edit/PageEdit.vue';
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
		path: '/source',
		name: 'source',
		component: PageSource,
		// redirect:'/login',
	},{
		path: '/edit',
		name: 'edit',
		component: PageEdit,
		// redirect:'/login',
	}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router
