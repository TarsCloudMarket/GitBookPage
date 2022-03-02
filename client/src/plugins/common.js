import Vue from 'vue';

function validateEmail(rule, value, callback) {
  const mailReg = /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
  if (!value) {
    return callback(new Error(this.$t("cloud.login.userNameRegTips")));
  }

  setTimeout(() => {
    if (mailReg.test(value)) {
      callback();
    } else {
      console.log(this);

      callback(new Error(this.$t("cloud.login.userNameRegTips")));
    }
  }, 100);

}

function validatePass(rule, value, callback) {
  if (value.length < 8) {
    callback(new Error(this.$t("cloud.login.passwordInfo")));
  } else {
    callback();
  }
}

function validatePass2(rule, value, callback) {
  if (value === "") {
    callback(new Error(this.$t("cloud.login.inputPasswordAgain")));
  } else if (value !== this.data.checkPass) {
    callback(new Error(this.$t("cloud.login.passwordDiff")));
  } else {
    callback();
  }
}


class CommonUtil {

  constructor(vue) {
    this.vue = vue;
  }

  showError(kind, err) {
    this.vue.$message({
      message: this.vue.$t(
        `cloud.${kind}.${err ? err.tars_ret || "-1" : "-1"}`
      ),
      showClose: true,
      type: "error",
    });
  }

  showSucc(succ) {
    this.vue.$message({
      message: this.vue.$t(succ),
      showClose: true,
      type: "success",
    });
  }
}

Object.defineProperty(Vue.prototype, '$common', {
  get() {
    if (!this.commonUtil) {
      this.commonUtil = new CommonUtil(this);
    }

    return this.commonUtil;
  },
});

export {
  validateEmail,
  validatePass,
  validatePass2
}