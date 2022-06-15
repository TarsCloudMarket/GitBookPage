<template>
  <div id="app" class="main_width">
    <router-view ref="childView"></router-view>
  </div>
</template>
<script>
export default {
  name: "AppIndex",
  data() {
    return {};
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      let ticket = window.localStorage.ticket;
      if (!ticket) {
        vm.$loginUtil.onLogin(false);
        return;
      }
    });
  },
  methods: {},
  mounted() {},
};
</script>

<style lang="postcss">
/* @import "./assets/css/reset.css"; */
@import "./assets/css/variable.css";

#app {
  display: flex;
  flex-flow: column;
  overflow: hidden;
  position: relative;
  font-size: 14px;
}

.main-width {
  margin: 0 auto;
  padding: 0 var(--gap-small);
}

.icon.iconfont {
  font-size: 10px;
  cursor: pointer;
  vertical-align: 0em;
}

.market_page {
  width: 600px;
  margin: 100px auto;
  text-align: center;
  padding: 20px;
}

.top_txt {
  font-size: 16pt;
  margin: 10px;
}

.captcha_box {
  display: flex;
}

.captcha_code {
  cursor: pointer;
  display: block;
  height: 40px;
  margin-left: 20px;
  border-radius: 3px;
}

.btn_long {
  width: 50%;
  color: #fff;
  height: auto;
  font-size: 16px;
  padding-top: 5px;
  padding-bottom: 5px;
  margin-top: 12px;
  border-radius: 3px;
  margin-bottom: 14px;
}

.sub_menu {
  text-align: center;
}

.sub_menu a {
  cursor: pointer;
  color: rgb(33, 10, 233);
  font-size: 14px;
  float: none !important;
}

.top_txt {
  border-bottom: 1px solid #f3f3f3ba;
  line-height: normal;
}

.top_txt h1 {
  /* margin-top: 5px; */
  font-size: 25px !important;
  border-bottom: none !important;
  line-height: 45px !important;
}

.top_txt div {
  border-bottom: none !important;
  line-height: 45px !important;
}

.top_txt span,
.bot_txt span {
  float: right;
  line-height: 45px;
  font-size: 13px !important;
  color: #666;
}

.bot_txt {
  text-align: center;
}

.bot_txt span {
  text-align: center;
  float: none;
  line-height: 30px;
}
</style>
