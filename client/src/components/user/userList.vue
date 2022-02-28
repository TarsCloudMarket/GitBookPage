<template>
  <div style="width: 90%" class="user_list">
    <el-table :data="userList" stripe style="width: 100%">
      <el-table-column prop="uid" sortable :label="$t('user.user')">
      </el-table-column>
      <el-table-column prop="loginTime" sortable :label="$t('user.loginTime')">
      </el-table-column>
      <el-table-column
        prop="createTime"
        sortable
        :label="$t('user.createTime')"
      >
      </el-table-column>
      <el-table-column fixed="right" :label="$t('user.operator')" width="150">
        <template slot-scope="scope">
          <el-button
            slot="reference"
            @click="handleDelete(scope.row)"
            type="text"
            size="small"
            >{{ $t("user.delete") }}</el-button
          >
          <el-button
            slot="reference"
            v-if="scope.row.activated != true"
            @click="handleActivate(scope.row)"
            type="text"
            size="small"
            >{{ $t("user.activated") }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <br />
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pagination.page"
      :page-size="pagination.size"
      layout="prev, pager, next, jumper, total"
      :total="pagination.total"
    >
    </el-pagination>
  </div>
</template>
<style>
.user_list {
  text-align: center;
  padding-left: 8%;
  padding-top: 20px;
  border-right: 1px solid #ebeef5;
}
.user_list table {
  margin: 0;
}
.el-table td,
.el-table th {
  padding: 5px 0 !important;
}
table td,
table th {
  border-right: none !important;
  border-bottom: none !important;
}
</style>

<script>
import moment from "moment";
export default {
  name: "User",
  data() {
    return {
      filter: false,
      // 分页
      pagination: {
        page: 1,
        size: 15,
        total: 0,
      },
      userList: [],
    };
  },
  methods: {
    fetchData(currentPage) {
      this.$ajax
        .postJSON("/sso/userList", {
          pagesize: this.pagination.size,
          pagenum: currentPage,
        })
        .then((data) => {
          this.userList = data.rows;
          this.pagination.total = data.count;
          this.pagination.page = currentPage;

          this.userList.forEach((item) => {
            item.loginTime = moment(item.loginTime).format(
              "YYYY-MM-DD HH:mm:ss"
            );
            item.createTime = moment(item.createTime).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          });
        })
        .catch((err) => {});
    },
    handleCurrentChange(pagecount) {
      this.fetchData(pagecount);
    },
    handleSizeChange() {
      this.fetchData(this.pagination.page);
    },
    handleActivate(data) {
      this.$confirm(
        this.$t("user.confirmActivated"),
        this.$t("user.activated"),
        {
          confirmButtonText: this.$t("user.activated"),

          cancelButtonText: this.$t("user.cancel"),
        }
      ).then(() => {
        this.$ajax
          .getJSON("/sso/activateUser", { uid: data.uid })
          .then(() => {
            this.fetchData(this.pagination.page);
          })
          .catch((err) => {});
      });
    },
    handleDelete(data) {
      this.$confirm(this.$t("user.confirmDelete"), this.$t("user.delete"), {
        confirmButtonText: this.$t("user.delete"),

        cancelButtonText: this.$t("user.cancel"),
      }).then(() => {
        this.$ajax
          .postJSON("/sso/deleteUser", { uid: data.uid })
          .then(() => {
            this.fetchData(this.pagination.page);
          })
          .catch((err) => {});
      });
    },
  },

  created() {
    this.fetchData(this.pagination.page);
  },
  mounted() {
    document.title = this.$t("user.userManage");
  },
};
</script>
