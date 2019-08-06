import Vue from 'vue'
import VueRouter from 'vue-router'
import goods from '@/components/goods/goods'
import seller from '@/components/seller/seller'
import ratings from '@/components/ratings/ratings'

Vue.use(VueRouter)

const routes = [
	{ path: '/', redirect: '/goods' },
	{ path: '/goods', component: goods },
	{ path: '/seller', component: seller },
	{ path: '/ratings', component: ratings }
]

const router = new VueRouter({
	mode: 'history',
	linkActiveClass: 'active',
	routes
})

export default router
