<template>
  <div>
    <!-- 修改密码 -->
    <el-card class="box-card market_page">
      <h1 class="top_txt">{{ $t("cloud.login.modifyPass") }}</h1>
      <el-form
        label-width="200px"
        :model="data"
        ref="ruleForm"
        label-position="left"
        :rules="rules"
      >
        <el-form-item
          :label="$t('cloud.login.inputOldPass')"
          prop="oldPassword"
          required
        >
          <el-input
            :placeholder="$t('cloud.login.passwordInfo')"
            v-model="data.oldPassword"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('cloud.login.inputNewPass')"
          prop="newPassword"
          required
        >
          <el-input
            :placeholder="$t('cloud.login.passwordInfo')"
            v-model="data.newPassword"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('cloud.login.repeatInputNewPass')"
          prop="checkPass"
          required
        >
          <el-input
            :placeholder="$t('cloud.login.repeatInputNewPass')"
            v-model="data.checkPass"
            show-password
          ></el-input>
        </el-form-item>
        <el-button
          class="btn_long"
          type="primary"
          size="small"
          round
          @click="modifyPass"
          >{{ $t("cloud.login.modifyPass") }}</el-button
        >

        <br />
        <br />
        <div class="sub_menu">
          <a size="small" round @click="back">{{ $t("cloud.login.back") }}</a>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import sha1 from "sha1";
import { validateEmail, validatePass, validatePass2 } from "@/plugins/common";
export default {
  name: "ModifyPass",
  data() {
    return {
      data: {
        newPassword: "",
        oldPassword: "",
        checkPass: "",
      },
      rules: {
        newPassword: [
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
        oldPassword: [
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
      },
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    modifyPass() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.$cloud
            .call("cloud-user", "resetPass", {
              ticket: window.localStorage.ticket,
              oldPassword: sha1(this.data.oldPassword),
              newPassword: sha1(this.data.newPassword),
            })
            .then(() => {
              this.$common.showSucc("cloud.login.modifySucc");
              this.$router.push({ name: "index" });
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
};
</script>
