import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

// 重写路由的push方法
const routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(error => error)
}

const routerReplace = Router.prototype.replace;
Router.prototype.replace = function replace(location) {
    return routerReplace.call(this, location).catch(error => error)
}

import ViewIndex from '@/components/view/index';
import View from '@/components/view/view.vue'

import UserIndex from '@/components/user/index';
import Login from '@/components/user/login';
import Register from '@/components/user/register';
import Activate from '@/components/user/activate';
import Forget from '@/components/user/forget';
import ModifyPass from '@/components/user/modifyPass';
import ResetPass from '@/components/user/resetPass';

export default new Router({
    routes: [{
            path: '/user',
            component: UserIndex,
            children: [{
                path: 'login',
                name: 'login',
                component: Login,
            }, {
                path: 'register',
                name: 'register',
                component: Register,
            }, {
                path: 'activate',
                name: 'activate',
                component: Activate,
            }, {
                path: 'forget',
                name: 'forget',
                component: Forget,
            }, {
                path: 'modifyPass',
                name: 'modifyPass',
                component: ModifyPass,
            }, {
                path: 'resetPass',
                name: 'resetPass',
                component: ResetPass,
            }]
        },
        {
            path: "/",
            name: 'index',
            redirect: '/default-index'
        },
        {
            path: '/',
            name: 'viewIndex',
            component: ViewIndex,
            children: [{
                path: '*',
                component: View,
            }]
        }
    ]
});