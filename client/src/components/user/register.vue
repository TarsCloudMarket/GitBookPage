<template>
  <div>
    <!-- 注册 -->
    <el-card class="box-card market_page">
      <h1 class="top_txt">
        {{ $t("cloud.login.register") }}
      </h1>

      <el-form
        label-width="200px"
        :model="data"
        ref="ruleRegisterForm"
        label-position="left"
        :rules="rules"
      >
        <el-form-item :label="$t('cloud.login.userName')" prop="uid" required>
          <el-input
            v-model="data.uid"
            :placeholder="$t('cloud.login.inputUserName')"
            prefix-icon="el-icon-message"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('cloud.login.password')" prop="password">
          <el-input
            prefix-icon="el-icon-key"
            :placeholder="$t('cloud.login.passwordInfo')"
            v-model="data.password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('cloud.login.repeatPassword')"
          prop="checkPass"
          required
        >
          <el-input
            prefix-icon="el-icon-key"
            :placeholder="$t('cloud.login.inputRepeatPassword')"
            v-model="data.checkPass"
            show-password
          ></el-input>
        </el-form-item>
        <el-button
          class="btn_long"
          type="primary"
          size="small"
          round
          @click="register"
          >{{ $t("cloud.login.register") }}</el-button
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
import sha1 from "sha1";
import { validateEmail, validatePass, validatePass2 } from "@/plugins/common";

export default {
  name: "UserRegister",
  data() {
    return {
      data: {
        ticket: "",
        uid: window.localStorage.uid || "",
        captcha: "",
        password: "",
        checkPass: "",
        captchaUrl: "",
        session: "",
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
        password: [
          {
            required: true,
            message: this.$t("cloud.login.inputPassword"),
            trigger: "blur",
          },
          {
            min: 8,
            max: 16,
            message: this.$t("cloud.login.passwordInfo"),
            trigger: "blur",
          },
          {
            validator: (...args) => {
              return validatePass.call(this, ...args);
            },
            trigger: "blur",
          },
        ],
        checkPass: [
          {
            required: true,
            message: this.$t("cloud.login.inputPassword"),
            trigger: "blur",
          },
          {
            min: 8,
            max: 16,
            message: this.$t("cloud.login.passwordInfo"),
            trigger: "blur",
          },
          {
            validator: (...args) => {
              return validatePass.call(this, ...args);
            },
            trigger: "blur",
          },
          {
            validator: (...args) => {
              return validatePass2.call(this, ...args);
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
    show_activate() {
      this.$router.push({ name: `activate` });
    },
    register: function () {
      this.$refs["ruleRegisterForm"].validate((valid) => {
        if (valid) {
          this.$cloud
            .call("cloud-user", "register", {
              uid: this.data.uid,
              password: sha1(this.data.password),
              origin: window.location.origin,
            })
            .then(() => {
              window.localStorage.uid = this.data.uid;
              this.show_activate();
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
