import Vue from 'vue'
import Router from 'vue-router'

import userList from '@/components/user/userList.vue'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/user',
      name: 'user',
      component: userList
    },
    {
      path: '*',
      redirect: '/user',
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    return {
      x: 0,
      y: 0
    }
  }
})