<template>
  <div class="app_index__header">
    <div class="main-width">
      <el-row :gutter="24">
        <el-col :span="4">
          <div class="logo-wrap">
            <a :class="{ active: true }" href="/"
              ><img class="logo" :src="getLogo()"
            /></a>
          </div>
        </el-col>
        <el-col :span="14">
          <div class="search-wrap">
            <el-input :placeholder="$t('index.search')" v-model="query">
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="search"
              ></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="2">
          <div class="language-wrap">
            <el-select v-model="locale" @change="changeLocale">
              <el-option
                v-for="l in localeMessages"
                :value="l.localeCode"
                :key="l.localeCode"
                :label="l.localeName"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="user-wrap">
            <el-dropdown
              style="display: block !important"
              @command="handleCommand"
            >
              <span class="el-dropdown-link">
                {{ cloudUid }}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="modifyPass">{{
                  $t("header.modifyPass")
                }}</el-dropdown-item>
                <el-dropdown-item command="quit">{{
                  $t("header.logout")
                }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { localeMessages } from "@/locale/i18n";
export default {
  name: "ViewHeader",
  data() {
    return {
      // 图标
      locale: this.$cookie.get("locale") || "cn",
      uid: "--",
      enableLogin: false,
      localeMessages: localeMessages,
      query: "",
    };
  },
  computed: {
    cloudUid() {
      return this.$store.state.cloudUid.uid;
    },
  },
  methods: {
    getLogo() {
      if (this.locale == "en") {
        return "/images/TARS-en-blue.png";
      } else {
        return "/images/TARS-cn-blue.png";
      }
    },
    changeLocale() {
      if (this.locale == "en") {
        this.logo = "/images/TARS-en-blue.png";
      } else {
        this.logo = "/images/TARS-cn-blue.png";
      }
      this.$cookie.set("locale", this.locale, { expires: "1Y" });
      location.reload();
    },

    handleCommand(command) {
      if (command == "modifyPass") {
        this.$router.push({ name: "modifyPass" });
      } else if (command == "quit") {
        this.$store.commit({
          type: "quit",
        });

        this.$router.push({ name: "login" });
      }
    },
    search() {
      this.$emit("search", this.query);
    },
  },
  mounted() {},
};
</script>

<style lang="postcss">
@import "../../assets/css/variable.css";

.app_index__header {
  height: 80px;
  border-bottom: 1px solid var(--border-color);

  .main-width {
    position: relative;
  }

  .logo-wrap {
    left: 0;
    width: auto;
    z-index: 100;
    padding: 0px;

    a {
      display: inline-block;
      height: 80px;
      padding: 30px 20px 0;
      position: relative;
      &.active {
        &::after {
          content: "";
          display: inline-block;
          height: 3px;
          width: 100%;
          background: #457ff5;
          position: absolute;
          top: 76px;
          left: 0px;
        }
      }
      .logo {
        height: 25px;
      }
    }
    .logo {
      height: 28px;
    }
  }

  .search-wrap {
    height: 80px;
    padding-top: 20px;
  }

  .language-wrap {
    height: 80px;
    padding-top: 20px;
    float: right;
  }

  .user-wrap {
    height: 50px;
    text-align: right;
    margin-top: 30px;
  }
}
</style>
