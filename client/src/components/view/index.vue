<template>
  <el-container>
    <el-header width="100%">
      <app-header @search="query"></app-header>
    </el-header>
    <el-container>
      <el-aside width="300px" style="padding: 40px">
        <div>
          <el-tree
            :auto-expand-parent="true"
            :default-expanded-keys="checkedKeys"
            node-key="id"
            :data="treeData"
            :props="defaultProps"
            @node-click="selectTree"
            highlight-current
          ></el-tree>
        </div>
      </el-aside>

      <el-main id="main" v-viewer>
        <div v-if="search" style="margin-top: 10px">
          <span v-for="(data, index) in queryData" :key="index">
            <el-tag
              type="success"
              style="cursor: pointer"
              @click="searchDoc(data)"
              >{{ data.name }}</el-tag
            >
            &nbsp;
          </span>
          <el-divider></el-divider>
        </div>
        <div>
          <router-view></router-view>
        </div>
        <div class="fix_nav" v-if="!search">
          <div class="tit_index">
            {{ $t("index.directory") }}
          </div>
          <ul></ul>
          <div class="cur_bg"></div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AppHeader from "./header";
export default {
  name: "ViewIndex",
  components: {
    AppHeader,
  },
  data() {
    return {
      expandedKeys: [],
      checkedKeys: [],
      uid: "--",
      activeIndex: "0",
      search: false,
      isLogin: false,
      queryData: [],
      treeErrMsg: "load failed",
      treeData: [],
      treeSearchKey: "",
      loading: false,
      html: "",
      page: "README.md",
      isIconPlay: false,
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      let ticket = window.localStorage.ticket;

      if (!ticket) {
        vm.$loginUtil.onLogin(false);
      } else {
        vm.$loginUtil.onLogin(true);
        vm.isLogin = true;
      }
    });
  },
  methods: {
    backTop() {
      document.getElementById("main").scrollTop = 0;
    },
    query(search) {
      this.$ajax
        .getJSON("/api/search", { query: search })
        .then((data) => {
          location.hash = "/";
          this.search = true;
          this.queryData = data.page;
        })
        .catch(() => {});
    },
    searchDoc(nodeKey) {
      this.search = true;

      if (nodeKey.href) {
        this.$router.push(`${nodeKey.href.substring(1)}`);
      }
    },
    selectTree(nodeKey) {
      this.search = false;

      if (nodeKey.href) {
        this.$router.push(`/${nodeKey.href}`);
      }
      setTimeout('document.getElementById("main").scrollTop = 0', 200);
    },
    // 处理接口返回数据
    handleData(res) {
      if (!res || !res.length) return;
      res.forEach((node) => {
        node.label = node.name; //eslint-disable-line
        node.nodeKey = node.id; //eslint-disable-line

        if (this.treeSearchKey) {
          node.expand = true;
        }

        if (node.children && node.children.length) {
          this.handleData(node.children);
        }
      });
    },
    // 主方法查询目标节点
    searchTree(tree, id) {
      let res = this.findNode(tree, id);
      //边界处理，输入的id不存在相对应的节点时
      if (res == undefined) {
        return "";
      }
      res.path.unshift(tree.id);
      let path = res.path;
      let node = res.node;
      let leaves = this.findLeaves(node);
      return {
        path,
        leaves,
      };
    },
    // 深度遍历查找目标节点及缓存相关路径
    findNode(tree, id) {
      if (tree.id == id) {
        return {
          path: [],
          node: tree,
        };
      }
      let res;
      if (tree.children) {
        for (let i = 0; i < tree.children.length; i++) {
          res = this.findNode(tree.children[i], id);
          if (res != undefined) {
            res.path.unshift(tree.children[i].id);
            return res;
          }
        }
      }
      return undefined;
    },
    // 递归获取叶子节点
    findLeaves(node) {
      if (!node.children || node.children.length == 0) {
        return [node.id];
      }
      let leaves = [];
      let res = [];
      for (let i = 0; i < node.children.length; i++) {
        res = this.findLeaves(node.children[i]);
        leaves = res.concat(leaves);
      }
      return leaves;
    },
    // 查询目标节点path
    queryTargetNode(jsonData, targetNode) {
      let target = {};
      if (jsonData && jsonData.length > 0) {
        for (let i = 0, len = jsonData.length; i < len; i++) {
          let res = this.searchTree(jsonData[i], targetNode);
          if (res) {
            target = res;
            break;
          }
        }
      }
      return target;
    },
    getTreeData(key, type) {
      this.treeData = [];

      this.$ajax
        .getJSON("/api/tree", {
          searchKey: key || "",
          type: type,
        })
        .then((data) => {
          document.title = data.title;
          this.treeData = data.tree;
          this.handleData(this.treeData);
          this.selectTree({ href: "" });

          //递归实现
          //@href    查找对应的id，
          //@nodes   原始Json数据
          //@path    供递归使用
          function findPathByLeafId(href, nodes, path) {
            if (path === undefined) {
              path = [];
            }
            for (var i = 0; i < nodes.length; i++) {
              var tmpPath = path.concat();
              tmpPath.push(nodes[i].href);
              if (href == nodes[i].href) {
                // return nodes[i].id;
                return nodes[i].id;
              }
              if (nodes[i].children) {
                var findResult = findPathByLeafId(
                  href,
                  nodes[i].children,
                  tmpPath
                );
                if (findResult) {
                  // return nodes[i].children.id;
                  return findResult;
                }
              }
            }
          }
          var curNode = findPathByLeafId(
            decodeURIComponent(this.$route.path.substr(1)),
            data.tree
          );

          try {
            const expandedRes = this.queryTargetNode(data.tree, curNode);

            this.expandedKeys = expandedRes.path;

            this.checkedKeys = expandedRes.leaves;
            if (this.checkedKeys.length > 1) {
              this.checkedKeys = [];
              this.checkedKeys.push(this.expandedKeys[0]);
            }
            // this.checkedKeys.pop()
            // console.log(`checkedKeys`, this.checkedKeys)
          } catch (error) {
            // console.log(error)
          }
        })
        .catch((err) => {
          this.treeErrMsg = err.err_msg || err.message || "load failed";
          this.treeData = [];
        });
    },
  },
  created() {
    this.getTreeData("", 0);
  },
  mounted() {
    $(".section_index").click(function () {
      $(".fix_nav").toggleClass("show");
    });
  },
};
</script>
