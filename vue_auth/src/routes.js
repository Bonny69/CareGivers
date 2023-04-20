
import {createRouter,createWebHistory} from 'vue-router';
import Log_in from './components/Log_in.vue';
import Sign_Up from './components/Sign_up.vue';
import referenti from './components/referenti.vue';

const routes = [{
    path: '/login', component: Log_in, name:"login",},
    {path: '/signup', component: Sign_Up, name:"signUp"},
    {path:'/referenti', component: referenti, name:'referenti'}
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes, 
});

export default router;