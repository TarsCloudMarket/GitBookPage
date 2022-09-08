<template>
  <div class="app_index__header">
    <div class="main-width">
      <el-row :gutter="24">
        <el-col :span="2" class="menu">
          <i
            class="el-icon-menu"
            @click="showMenu"
            style="
              padding-left: 0px;
              height: 80px;
              line-height: 80px;
              font-size: 20pt;
            "
          ></i>
        </el-col>
        <el-col :span="4">
          <div class="logo-wrap">
            <a :class="{ active: true }" href="/"
              ><img class="logo logo_pc" :src="getPcLogo()" />
              <img class="logo logo_mobile" :src="getMobileLogo()" />
            </a>
          </div>
        </el-col>
        <el-col :span="16" class="search-wrap">
          <div>
            <el-input :placeholder="$t('index.search')" v-model="query">
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="search"
              ></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="4" class="language-wrap">
          <div>
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
        <!-- <el-col :span="4">
          <div class="user-wrap">
            <el-dropdown
              style="display: block !important"
              @command="handleCommand"
              v-if="cloudUid"
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
        </el-col> -->
      </el-row>
    </div>

    <el-dialog :visible.sync="dialogVisible" width="80%" class="star">
      <el-image
        style="width: 100%; height: 100%"
        src="/images/star.jpg"
      ></el-image>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="noStar()">{{
          $t("index.nostar")
        }}</el-button>
        <el-button size="mini" type="primary" @click="goStar()">{{
          $t("index.star")
        }}</el-button>
      </span>
    </el-dialog>
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
      localeMessages: localeMessages,
      query: "",
      dialogVisible: false,
    };
  },
  computed: {
    cloudUid() {
      return this.$store.state.cloudUid.uid;
    },
  },
  methods: {
    getPcLogo() {
      if (this.locale == "en") {
        return "/images/TARS-en-blue.png";
      } else {
        return "/images/TARS-cn-blue.png";
      }
    },
    getMobileLogo() {
      return "/images/tars-logo.png";
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
    showGit() {
      this.dialogVisible = true;
    },
    goStar() {
      this.dialogVisible = false;
      window.open("https://github.com/TarsCloud/Tars", "blank");
      window.localStorage.starTime =
        new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
    },
    noStar() {
      window.localStorage.noStar = true;
      this.dialogVisible = false;
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
    showMenu() {
      this.$emit("showMenu");
    },
    search() {
      this.$emit("search", this.query);
    },
  },
  mounted() {
    window.localStorage.starTime =
      window.localStorage.starTime || new Date().getTime();

    let diff = new Date().getTime() - window.localStorage.starTime;

    // console.log(window.localStorage.noStar, diff);
    if (!window.localStorage.noStar && diff > 0) {
      this.showGit();
    }
  },
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

@media only screen and (max-width: 767px) {
  .main-width {
    padding: 0px;
  }

  .app_index__header .menu {
    display: inine;
  }

  .search-wrap {
    display: none;
  }

  .language-wrap {
    padding-left: 0px !important;
    padding-right: 0px !important;
    width: 100px !important;
  }

  .logo_pc {
    display: none;
  }
}

@media only screen and (min-width: 767px) {
  .app_index__header .menu {
    display: none;
  }

  .logo_mobile {
    display: none;
  }
}
</style>
