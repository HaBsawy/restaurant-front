import Vue from 'vue';
import VueRouter from 'vue-router';
import WebsiteView from '../views/website/WebsiteView.vue';
import DashboardView from '../views/dashboard/DashboardView.vue';
import LoginView from '../views/dashboard/LoginView.vue';
import dashboard from './dashboard';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'website',
    component: WebsiteView,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    children: dashboard,
  },
  {
    path: '/dashboard/login',
    name: 'login',
    component: LoginView,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
