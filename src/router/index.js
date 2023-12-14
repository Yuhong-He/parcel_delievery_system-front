import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/Home/HomeView.vue'
import LoginView from "@/views/LoginView.vue"
import ParcelView from "@/views/ParcelView.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/parcel',
    name: 'parcel',
    redirect: '/'
  },
  {
    path: '/parcel/:id',
    name: 'parcel_detail',
    component: ParcelView
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
