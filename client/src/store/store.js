import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        cloudUid: "",
        version: ""
    },
    mutations: {
        increment(state, name) {
            state.name = name
        },
        quit(state) {
            state.cloudUid = '';
            window.localStorage.uid = "";
            window.localStorage.ticket = "";
        },
        cloudUid(state, uid) {
            state.cloudUid = uid;
        },
        version(state, version) {
            state.version = version;
        },
    }
})

export default store