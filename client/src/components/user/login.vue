<template>
  <div>
    <!-- 登录 -->
    <el-card class="box-card market_page">
      <div class="top_txt">
        <h1 style="display: inline">
          {{ $t("cloud.login.loginTitle") }}
        </h1>

        <el-select
          style="float: right; width: 100px"
          size="small"
          v-model="locale"
          @change="changeLocale"
        >
          <el-option
            v-for="l in localeMessages"
            :value="l.localeCode"
            :key="l.localeCode"
            :label="l.localeName"
          ></el-option>
        </el-select>
      </div>
      <el-form
        label-width="0"
        ref="ruleFormLogin"
        :model="login"
        :rules="rules"
        autocomplete="on"
      >
        <el-form-item prop="uid">
          <el-input
            v-model="login.uid"
            :placeholder="$t('cloud.login.userName')"
            prefix-icon="el-icon-message"
            autocomplete="on"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            :placeholder="$t('cloud.login.password')"
            v-model="login.password"
            show-password
            prefix-icon="el-icon-lock"
            autocomplete="on"
          >
          </el-input>
        </el-form-item>
        <el-form-item required>
          <div class="captcha_box">
            <el-input
              prefix-icon="el-icon-finished"
              type="text"
              :placeholder="$t('cloud.login.captcha')"
              v-model="login.captcha"
              required
              :required-tip="$t('cloud.login.captchaTips')"
              @keydown.enter="login"
            ></el-input>
            <img
              class="captcha_code"
              :title="$t('cloud.login.refresh')"
              :src="login.captchaUrl"
              @click="reloadCaptcha"
            />
          </div>
        </el-form-item>

        <el-button
          type="primary"
          size="small"
          round
          @click="doLogin"
          class="btn_long"
          >{{ $t("cloud.login.login") }}</el-button
        >

        <br />
        <br />
        <div class="sub_menu">
          <div class="bot_txt">
            <span
              >{{ $t("cloud.login.registerInfo") }}
              <a size="small" round @click="show_registry">{{
                $t("cloud.login.register")
              }}</a>

              {{ $t("cloud.login.and") }}
              <a size="small" round @click="show_active">{{
                $t("cloud.login.activated")
              }}</a>
            </span>
            <br />
            <span
              >{{ $t("cloud.login.forget") }}
              <a size="small" style="float: right" round @click="forget_pass">{{
                $t("cloud.login.findPassword")
              }}</a>
              {{ $t("cloud.login.and") }}
              <a size="small" style="float: right" round @click="reset_pass">{{
                $t("cloud.login.resetPassword")
              }}</a>
              {{ $t("cloud.login.password") }}
            </span>
          </div>
        </div>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import sha1 from "sha1";
import { localeMessages } from "@/locale/i18n";
import { validateEmail, validatePass } from "@/plugins/common";

export default {
  name: "UserLogin",
  data() {
    return {
      locale: this.$cookie.get("locale") || "cn",
      localeMessages: localeMessages,
      login: {
        ticket: "",
        uid: window.localStorage.uid || "",
        captcha: "",
        password: "",
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
      },
    };
  },
  methods: {
    changeLocale() {
      this.$cookie.set("locale", this.locale, { expires: "1Y" });
      location.reload();
    },
    reloadCaptcha() {
      this.$cloud
        .call("cloud-user", "captcha")
        .then((data) => {
          this.login.captchaUrl =
            "data:image/svg+xml;base64," + data.ci.captchaBase64;
          this.login.session = data.ci.session;
        })
        .catch((err) => {
          this.$common.showError("userRet", err);
        });
    },
    forget_pass() {
      this.$router.push({ name: "forget" });
    },
    show_registry() {
      this.$router.push({ name: "register" });
    },
    show_active() {
      this.$router.push({ name: "activate" });
    },
    reset_pass() {
      this.$router.push({ name: "resetPass" });
    },
    doLogin() {
      this.$refs["ruleFormLogin"].validate((valid) => {
        if (valid) {
          this.$cloud
            .call("cloud-user", "login", {
              li: {
                uid: this.login.uid,
                password: sha1(this.login.password),
                captcha: this.login.captcha,
                session: this.login.session,
              },
            })
            .then((data) => {
              if (data.ticket) {
                this.login.ticket = data.ticket;
                this.login.isLogin = true;

                window.localStorage.ticket = data.ticket;
                window.localStorage.uid = this.login.uid;

                this.$store.commit({
                  type: "cloudUid",
                  uid: window.localStorage.uid,
                });

                this.$router.push({ name: "index" });
              } else {
                this.login.ticket = "";
                this.login.isLogin = false;

                window.localStorage.ticket = "";
              }
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
  mounted() {
    this.reloadCaptcha();
    this.$refs["ruleFormLogin"].resetFields();
  },
};
</script>
