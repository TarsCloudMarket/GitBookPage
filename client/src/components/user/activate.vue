<template>
  <div>
    <el-card class="box-card market_page">
      <el-alert
        :title="$t('cloud.login.registerSucc')"
        type="success"
      ></el-alert>

      <div>
        <h1 class="top_txt">
          {{ $t("cloud.login.activing") }}
        </h1>
      </div>

      <el-form
        label-width="150px"
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

        <el-form-item
          :label="$t('cloud.login.activeCode')"
          prop="activeCode"
          required
        >
          <el-input
            v-model="login.activeCode"
            :placeholder="$t('cloud.login.inputActiveCode')"
            prefix-icon="el-icon-bell"
          ></el-input>
        </el-form-item>

        <el-button
          class="btn_long btn_submit"
          type="primary"
          size="small"
          round
          @click="activate"
          >{{ $t("cloud.login.activated") }}</el-button
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
  name: "UserActivate",
  data() {
    return {
      login: {
        uid: window.localStorage.uid || "",
        activeCode: "",
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
        activeCode: [
          {
            required: true,
            message: this.$t("cloud.login.inputActiveCode"),
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    this.login.activeCode = this.$route.params.uid;
  },
  methods: {
    show_login() {
      this.$router.push({ name: "login" });
    },
    activate: function () {
      this.$cloud
        .call("cloud-user", "activate", {
          uid: this.login.uid,
          activeCode: this.login.activeCode,
        })
        .then(() => {
          this.$common.showSucc("cloud.login.activateSuccAndRedirect");

          setTimeout(() => {
            this.$router.push({ name: "login" });
          }, 1000);
        })
        .catch((err) => {
          this.$common.showError("userRet", err);
        });
    },
  },
};
</script>
