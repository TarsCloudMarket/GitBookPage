<template>
  <div>
    <!-- 重置密码 -->
    <el-card class="box-card market_page">
      <h1 class="top_txt">{{ $t("cloud.login.resetPass") }}</h1>
      <el-form
        label-width="200px"
        :model="data"
        ref="ruleForm"
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

        <el-form-item
          :label="$t('cloud.login.inputPassword')"
          prop="password"
          required
        >
          <el-input
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
            :placeholder="$t('cloud.login.inputRepeatPassword')"
            v-model="data.checkPass"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('cloud.login.activeCode')"
          prop="activeCode"
          required
        >
          <el-input
            :placeholder="$t('cloud.login.inputActiveCode')"
            v-model="data.activeCode"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item required>
          <div class="captcha_box">
            <el-input
              prefix-icon="el-icon-finished"
              type="text"
              :placeholder="$t('cloud.login.captcha')"
              v-model="data.captcha"
              required
              :required-tip="$t('cloud.login.captchaTips')"
              @keydown.enter="login"
            ></el-input>
            <img
              class="captcha_code"
              :title="$t('cloud.login.refresh')"
              :src="data.captchaUrl"
              @click="reloadCaptcha"
            />
          </div>
        </el-form-item>

        <el-button type="primary" size="small" round @click="resetPass">{{
          $t("cloud.login.resetPass")
        }}</el-button>
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
  name: "ResetPass1",
  data() {
    return {
      data: {
        uid: window.localStorage.uid || "",
        activeCode: "",
        password: "",
        checkPass: "",
        captchaUrl: "",
        session: "",
        captcha: "",
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
              return validatePass2.call(this, ...args);
            },
            trigger: "blur",
          },
        ],
        activeCode: [
          {
            required: true,
            message: this.$t("cloud.login.inputPassword"),
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
    reloadCaptcha() {
      this.$cloud
        .call("cloud-user", "captcha")
        .then((data) => {
          this.data.captchaUrl =
            "data:image/svg+xml;base64," + data.ci.captchaBase64;
          this.data.session = data.ci.session;
        })
        .catch((err) => {
          this.$commonUtil.showError("userRet", err);
        });
    },
    resetPass: function () {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.$cloud
            .call("cloud-user", "resetPassByActiveCode", {
              rp: {
                uid: this.data.uid,
                activeCode: this.data.activeCode,
                password: sha1(this.data.password),
                captcha: this.data.captcha,
                session: this.data.session,
              },
            })
            .then(() => {
              this.$common.showSucc("cloud.login.findPasswordSucc");

              window.localStorage.uid = this.data.uid;

              this.$router.push({ name: "login" });
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
  },
};
</script>
