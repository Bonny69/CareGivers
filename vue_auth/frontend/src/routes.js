
import {createRouter,createWebHistory} from 'vue-router';
import Log_in from './components/Log_in.vue';
import Sign_Up from './components/Sign_up.vue';
import referenti from './components/referenti.vue';
import memos from './components/memos.vue';
import alert from './components/alert.vue';
import analytics from './components/analytics.vue';
import home from './components/home.vue';


const routes = [{
    path: '/login', component: Log_in, name:"login",},
    {path: '/signup', component: Sign_Up, name:"signUp"},
    {path:'/referenti', component: referenti, name:'referenti'},
    {path: '/memos', component: memos, name: 'memos'},
    {path: '/alert', component: alert, name: 'alert'},
    {path: '/analytics', component: analytics, name:'analytics'},
    {path: '/home', component: home, name:'home'}
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes, 
});

export default router;