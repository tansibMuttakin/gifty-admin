import { createRouter, createWebHashHistory } from 'vue-router';
import Admin from './pages/Admin.vue';

const routes = [
    {
        path: '/',
        name: 'admin',
        component: Admin,
        meta: {
            requiresAuth: true,
            // middleware: [isAdmin],
        },
        children: [
            {
                path: '',
                name: 'dashboard',
                component: () => import('./components/Dashboard.vue'),
            },
            {
                path: '/users',
                name: 'users',
                component: () => import('./pages/Users.vue'),
            },
            {
                path: 'products',
                name: 'products',
                component: () => import('./pages/Products.vue'),
            },
            {
                path: 'orders',
                name: 'orders',
                component: () => import('./pages/Orders.vue'),
            },
            {
                path: 'order/:id',
                name: 'orderView',
                component: () => import('./pages/OrderView.vue'),
            },
            {
                path: '/accounts',
                name: 'accounts',
                component: () => import('./pages/Accounts.vue'),
            },
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('./pages/Login.vue'),
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('./pages/Register.vue'),
    },
    {
        path: "/:catchAll(.*)",
        name: 'notfound',
        component: () => import('./pages/NotFound.vue'),
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

router.beforeEach(async (to,form,next)=>{
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    let loggedinUser = JSON.parse(window.localStorage.getItem('loggedinUser'));
    if (requiresAuth && loggedinUser) {
        next();
    }
    else if(requiresAuth && !loggedinUser){
        next('/login');
    }
    else{
        next();
    }

})

export default router;
