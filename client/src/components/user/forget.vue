<template>
  <div>
    <!-- 找回密码 -->
    <el-card class="box-card market_page">
      <h1 class="top_txt">
        {{ $t("cloud.login.findPasswordTitle") }}
      </h1>

      <el-form
        label-width="80px"
        :model="login"
        ref="ruleForgetForm"
        label-position="left"
        :rules="rules"
      >
        <el-form-item :label="$t('cloud.login.userName')" prop="uid" required>
          <el-input
            v-model="login.uid"
            :placeholder="$t('cloud.login.inputUserName')"
            prefix-icon="el-icon-message"
          ></el-input>
        </el-form-item>

        <el-button
          class="btn_long btn_submit"
          type="primary"
          size="small"
          round
          @click="forget"
          >{{ $t("cloud.login.submit") }}</el-button
        >
        <br />
        <br />
        <div class="sub_menu">
          <a size="small" round @click="show_login">{{
            $t("cloud.login.back")
          }}</a>
        </div>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { validateEmail } from "@/plugins/common";
export default {
  name: "UserForget",
  data() {
    return {
      login: {
        ticket: "",
        uid: window.localStorage.uid || "",
      },
      rules: {
        uid: [
          {
            required: true,
            message: this.$t("cloud.login.inputUserName"),
            trigger: "blur",
          },
          { message: this.$t("cloud.login.userNameRegTips"), trigger: "blur" },
          {
            validator: (...args) => {
              return validateEmail.call(this, ...args);
            },
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    show_login() {
      this.$router.push({ name: "login" });
    },
    forget() {
      this.$refs["ruleForgetForm"].validate((valid) => {
        if (valid) {
          this.$cloud
            .call("cloud-user", "forget", {
              uid: this.login.uid,
              origin: window.location.origin,
            })
            .then(() => {
              this.$common.showSucc("cloud.login.findPasswordSucc");
              window.localStorage.uid = this.login.uid;

              this.$router.push({ name: "resetPass" });
            })
            .catch((err) => {
              this.$common.showError("userRet", err);
            });
        } else {
          return false;
        }
      });
    },
  },
  mounted() {},
};
</script>
