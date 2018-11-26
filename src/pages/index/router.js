import Vue from 'vue'
import Router from 'vue-router'

const Home = () => import('./components/home')
const Discover = () => import('./components/discover')
const My = () => import('./components/my')
Vue.use(Router)

const routes = [
  {
    path: '/',
    redirect: 'home'
  },
  {
    path: '/home',
    component: Home
  },
  {
    path: '/discover',
    component: Discover
  },
  {
    path: '/my',
    component: My
  }
]

let router = new Router({
  routes: routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {x: 0, y: 0}
    }
  }
})

export default router
