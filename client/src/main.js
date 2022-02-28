import Vue from 'vue';
import store from "./store/store"
import './plugins/ajax';
import './plugins/cloud';
import './plugins/ui';

import indexApp from './App';
import router from './router';

import {
  i18n,
  loadLang
} from './locale/i18n'

import vueResource from "vue-resource";
Vue.use(vueResource);

import ElementUI from 'element-ui';

import $ from 'n-zepto'

import "./assets/theme/element-to-let/index.css"

import 'viewerjs/dist/viewer.css';
import Viewer from 'v-viewer';

Vue.config.productionTip = false;

/* eslint-disable no-new */
loadLang.call(this).then(() => {
  Vue.use(Viewer);

  Vue.use(ElementUI, {
    i18n: (key, value) => i18n.t(key, value)
  });

  new Vue({
    i18n: i18n,
    el: '#app',
    router,
    store,
    components: {
      indexApp
    },
    template: '<indexApp/>'
  });
})