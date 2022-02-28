<template>
  <div>
    <router-view ref="childView"></router-view>
  </div>
</template>
<script>
export default {
  name: "GitBookIndex",
  data() {
    return {};
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      let ticket = window.localStorage.ticket;
      if (!ticket) {
        vm.$loginUtil.onLogin(false);
      } else {
        vm.$loginUtil.onLogin(true);
      }
    });
  },
  methods: {},
  mounted() {},
};
</script>
