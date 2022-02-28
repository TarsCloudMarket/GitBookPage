# 代码说明

整体代码采用 nodejs + vue + element-ui 实现, 分两部分:

- 客户端部分: 客户端表示 vue 页面这部分, 在 client 目录下
- 服务器端部分: 服务器代码在 src 目录下

# 代码逻辑

服务器启动以后, 加载 docs 目录, web 页面会实时解析 markddown 文件, 并转化成 html

# 如何调试

启动 client:

- 进入 client 目录
- npm install
- npm run dev

启动 server:

- 源码目录: npm install
- npm run dev

访问: http://localhost:6001/ 即可

开发时修改任何代码, 服务器和客户端都会自动编译和更新.

# 源码如何发布

作为 TARS 服务, 通过 github action 自动发布到 K8S 集群中

**注意默认开启的是 6080 端口!!(config/config.json 中修改)**

# config.json 字段说明

服务的关键字段都在 config.json 中(config/config.json)

# 关于搜索

搜索用到分词技术, 使用了一个 nodejieba 的库, 注意他底层是 c++写的, 因此导致了这部分是无法跨平台的!

# 关于用户系统

默认是没有开启用户登录的, 如果开启用户登录, 则用户需要通过 email 注册和激活, 才能完成访问.
开启方式: 打开 config.json 中的 enableLogin

# 关于配置

你可以指定自己的 git, 修改 config/config.json 即可(正式发布, 不要忘了 npm run build)

# 关于分支

master 分支自动发布到测试环境(tars-dev.prod.tarsyun.com), 对应域名: http://gitbook.prod.tarsyun.com/
release 分支自动发布到正式环境(od.prod.tarsyun.com), 对应域名: http://doc.tarsyun.com/

# 关于更新

TarsDocs/TarsDocs_en 更新时, 会自动触发 Gitbook 重建和发布!
