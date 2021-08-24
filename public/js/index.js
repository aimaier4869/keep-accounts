const Home = httpVueLoader('../components/Home.vue');
const HomePage = httpVueLoader('../components/HomePage.vue');
const BrowseAll = httpVueLoader('../components/BrowseAll.vue');
const Setting = httpVueLoader('../components/Setting.vue');
const AddLog = httpVueLoader('../components/AddLog.vue');

const NotFound = {
    template: '<div>404 Not Fount</div>'
}

const routes = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home/',
        component: Home,
        children: [
            {
                path: '',
                component: HomePage,
                alias: 'homepage'
            },
            {
                path: 'addlog',
                component: AddLog
            },
            {
                path: 'browseall',
                component: BrowseAll
            },
            {
                path: 'setting',
                component: Setting
            }
        ]
    },
    {
        path: '*',
        component: NotFound
    }
]

const router = new VueRouter({
    mode: 'hash',
    routes
})

router.beforeEach((to, from, next) => {
    if(from.fullPath !== to.fullPath){
        next();
    }
})

new Vue({
    el: '#app',
    router,
})