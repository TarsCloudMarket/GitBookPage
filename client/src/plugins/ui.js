import Vue from 'vue';
// import letUI from 'let-ui';
// import 'let-ui/lib/lib.min.css';
// import VueCookie from 'vue-cookie';

// import '@/assets/css/let-ui.css';
// import Icon from '@/components/icon';
// import TarsFormItem from '@/components/tars-form-item';
// import cn from "let-ui/lib/locale/lang/zh-CN.min";
// import en from "let-ui/lib/locale/lang/en-US.min";

import {
  Loading
} from 'element-ui';

// Vue.use(letUI, {
//   locale: {
//     en,
//     cn
//   } [VueCookie.get('locale') || 'cn'] || cn
// });
// Vue.component(Icon.name, Icon);
// Vue.component(TarsFormItem.name, TarsFormItem);

function UILoading() {
  this.loading = null;
}

UILoading.prototype.show = function (text) {
  if (this.loading) {
    this.hide();
  }

  let loading = Loading.service({
    fullscreen: true,
    text: text || "Loading",
    background: 'rgba(0,0,0,0)',
  });

  this.loading = loading;
  return this;
};

UILoading.prototype.hide = function () {
  if (this.loading) {
    this.loading.close();
    this.loading = null;
  }
  return this;
};

UILoading.show = function (text) {
  if (!UILoading._loading) {
    UILoading._loading = new UILoading();
  }
  return UILoading._loading.show(text);
};

UILoading.hide = function () {
  if (!UILoading._loading) {
    UILoading._loading = new UILoading();
  }
  return UILoading._loading.hide();
};

Object.defineProperty(Vue.prototype, '$Loading', {
  get() {
    if (!this._loading) {
      this._loading = new UILoading();
    }
    return this._loading;
  },
  set() {

  }
});

Object.defineProperty(Vue.prototype, '$loading', {
  get() {
    if (!this._loading) {
      this._loading = new UILoading();
    }
    return this._loading;
  },
  set() {

  }
});

//////////////////////////////////////////////////////////////////////////////////////

let tip = {
  error: (msg) => {
    Vue.prototype.$message({
      message: msg,
      type: "error",
    });
  },
  success: (msg) => {
    Vue.prototype.$message({
      message: msg,
      type: "success",
    });
  },
  warning: (msg) => {
    Vue.prototype.$message({
      message: msg,
      type: "warning",
    });
  }
}
Object.defineProperty(Vue.prototype, '$tip', {
  get() {
    return tip;
  },
  set() {

  }
});