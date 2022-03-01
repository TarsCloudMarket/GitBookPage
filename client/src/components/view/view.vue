<template>
  <div
    v-loading="loading"
    :element-loading-text="$t('common.loading')"
    element-loading-spinner="el-icon-loading"
    style="padding: 20px; width: 75%"
  >
    <div class="markdown-body hljs" v-html="html"></div>
  </div>
</template>

<script>
/* eslint-disable */
import "@/assets/css/github-markdown-light.css";
export default {
  name: "ViewPage",
  data() {
    return {
      loading: false,
      html: "",
    };
  },
  methods: {
    doFetchData(page, locale) {
      if (locale == "en" || locale == "cn") {
        this.$cookie.set("locale", locale);
      }

      location.href = page;

      this.$nextTick(() => {
        window.location.reload();
      });
    },
    fetchData() {
      let page = location.hash;

      if (page == "#/default-index") {
        page = "#/README.md";
      }

      if (page.endsWith("pdf") || page.endsWith("pptx")) {
        this.$ajax.download("/api/view", { page });
      } else {
        this.loading = true;

        let that = this;

        this.$ajax
          .getJSON("/api/view", {
            page,
          })
          .then((data) => {
            this.loading = false;
            that.html = data.data;

            this.$nextTick(() => {
              const pos = page.lastIndexOf("#");
              if (pos != -1 && pos != 0) {
                let anchor = page.substring(pos + 1);

                if (anchor && document.getElementById(anchor)) {
                  document.getElementById(anchor).scrollIntoView();
                }
              }

              // 移动端表格处理
              $("table").wrap('<div class="table_wrap"></div>');

              // 展示右侧导航
              var list = [],
                idList = [];
              $(".cur_bg").css("top", 0);

              $("main h1,main h2,main h3").each(function (i) {
                $(this).attr("role", i);
                idList.push(i);
                list.push(
                  '<li class="' +
                    ($(this).get(0).tagName == "H2"
                      ? "h2"
                      : $(this).get(0).tagName == "H1"
                      ? "h1"
                      : "h3") +
                    '"><a href="javascript:document.getElementById(&apos;' +
                    $(this).attr("id") +
                    '&apos;).scrollIntoView()">' +
                    $(this).text() +
                    "</a></li>"
                );
              });
              function showFixNav() {
                $(".fix_nav ul").html(list);
                $(".fix_nav ul li").eq(0).addClass("active");
              }
              showFixNav();
              $("main").scroll(function () {
                if (
                  $("main").scrollTop() + $("main").height() >=
                  $("main>div").height()
                ) {
                  $(".fix_nav ul li")
                    .eq(idList.length - 1)
                    .addClass("active")
                    .siblings()
                    .removeClass("active");
                  $(".cur_bg").css("top", (idList.length - 1) * 26);
                } else {
                  for (let i = 0; i < idList.length; i++) {
                    if (
                      $('[role ="' + idList[i] + '"]').offset() != null &&
                      $('[role ="' + idList[i + 1] + '"]').offset() != null
                    ) {
                      if (
                        $('[role ="' + idList[i] + '"]').offset().top - 100 <
                          0 &&
                        $('[role ="' + idList[i + 1] + '"]').offset().top > 0
                      ) {
                        $(".fix_nav ul li")
                          .eq(i)
                          .addClass("active")
                          .siblings("li")
                          .removeClass("active");
                        $(".cur_bg").css("top", i * 26);
                      }
                    }
                  }
                }
              });

              $(".fix_nav ul li a").on("click", function () {
                $("this")
                  .parent()
                  .addClass("active")
                  .siblings()
                  .removeClass("active");
                $(".cur_bg").css("top", $(this).parent().index() * 26);
              });
            });
          })
          .catch((err) => {
            console.log(err);
            this.loading = false;
          });
      }
    },
  },
  watch: {
    $route(to, from) {
      console.log(to);
      this.fetchData();
    },
  },
  created() {
    window.vue = this;
  },
  mounted() {
    this.fetchData();
  },
};

window.doFetchData = (file, locale) => {
  window.vue.doFetchData(file, locale);
};
</script>

<style>
.table_wrap {
  width: calc(100% - 0px);
  overflow-x: auto;
  margin-bottom: 30px;
}
.table_wrap table {
  margin: 0;
}
.fix_nav {
  position: fixed;
  right: 10px;
  top: 120px;
  padding-left: 0px;
  border-left: 2px solid #eeeff1;
  width: 18%;
}
.fix_nav ul {
  position: relative;
  z-index: 2;
  margin-bottom: 0;
  padding-left: 10px;
}
.fix_nav li {
  margin: 0;
  line-height: 1.2;
  list-style: none;
  height: 26px;
  line-height: 26px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.fix_nav li.h2 {
  list-style: square;
  list-style-position: inside;
  padding-left: 0px;
}
.fix_nav li.h3 {
  list-style: circle;
  list-style-position: inside;
  padding-left: 10px;
}

.fix_nav li a {
  text-decoration: none;
}
.fix_nav li.h1 a {
  font-weight: bold;
  color: #333;
}
.fix_nav li.h2 a {
  padding-left: 0px;
  position: relative;
  left: -10px;
}

.fix_nav li.active a {
  color: #4d7fbf;
}
.fix_nav li a {
  color: #666;
  font-size: 12px;
  line-height: 26px;
  height: 26px;
  margin: 0 !important;
}

.cur_bg {
  position: absolute;
  background: #f0f7ff;
  height: 26px;
  width: 100%;
  border-left: 2px solid #4d7fbf;
  left: -2px;
  top: 0;
  transition: all 0.25s ease-out;
}

.tit_index {
  position: absolute;
  top: -24px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  color: #999;
}
.viewer-navbar {
  display: none;
}
</style>
