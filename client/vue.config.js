const {
  defineConfig
} = require('@vue/cli-service')

const server_port = process.env.SERVER_PORT || '4000'

module.exports = defineConfig({
  transpileDependencies: true,
  runtimeCompiler: true,
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: "TARS",
    },
    user: {
      entry: 'src/user.js',
      template: 'public/index.html',
      filename: 'user.html',
      title: "User",
    },
  },
  devServer: {
    //是否自动在浏览器中打开
    open: true,
    host: '0.0.0.0',
    //web-dev-server地址
    port: 6001,
    //ajax请求代理
    proxy: {
      "/": {
        target: `http://127.0.0.1:${server_port}`,
        changeOrigin: false,
        ws: false
      },
      "/api": {
        target: `http://127.0.0.1:${server_port}`,
        changeOrigin: false
      },
      "/favicon.ico": {
        target: `http://localhost:${server_port}`,
        changeOrigin: false
      }
    }
  }
})