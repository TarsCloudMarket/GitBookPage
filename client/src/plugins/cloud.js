import 'whatwg-fetch';
import Vue from 'vue';

import AjaxUtil from '@/lib/ajax';

let Ajax = new AjaxUtil();

if (process.env.NODE_ENV != "development") {
  Ajax.ServerUrl.set('https://api.k.tarsyun.com/json');
} else {
  Ajax.ServerUrl.set('https://api.dev.tarsyun.com/json');
}

Ajax.ServerUrl.set('https://api.k.tarsyun.com/json');

Ajax.ResultHandler.set((result) => {
  if (result && result.tars_ret === 0) {
    return true;
  }
  return false;
});

Ajax.call = function (obj, func, params) {
  Ajax.Headers.set("X-Token", window.localStorage.ticket || '');

  return Ajax.postJSON(`/${obj}/${func}`, params);
}

Object.defineProperty(Vue.prototype, '$cloud', {
  get() {
    return Ajax;
  },
});


//////////////////////////////////////////////////////////////////////

class LoginUtil {

  constructor(vue) {
    this.vue = vue;
  }

  onLogin(isLogin) {
    if (isLogin) {
      this.vue.$store.commit({
        type: "cloudUid",
        uid: window.localStorage.uid,
      });
    }

    if (!isLogin && !location.hash.startsWith("#/user")) {
      this.vue.$router.push({
        name: 'login'
      });
    } else if (isLogin && location.hash == "#/") {
      this.vue.$router.push({
        name: 'index'
      });
    }
  }

  checkLogin() {
    let ticket = window.localStorage.ticket;
    if (!ticket) {
      this.onLogin(false);
      return;
    }
    this.vue.$cloud
      .call("cloud-user", "isLogin", {
        ticket: ticket,
      })
      .then((data) => {
        if (!data.uid) {
          this.onLogin(false);
        } else {
          window.localStorage.uid = data.uid;
          this.onLogin(true);
        }
      })
      .catch((err) => {
        this.vue.$message({
          message: err,
          type: "error",
        });
      });
  }
}


Object.defineProperty(Vue.prototype, '$loginUtil', {
  get() {
    if (!this.loginUtil) {
      this.loginUtil = new LoginUtil(this);
    }

    return this.loginUtil;
  },
});

export default Ajax