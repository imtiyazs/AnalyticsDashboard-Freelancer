module.exports = {
  lintOnSave: false,
  runtimeCompiler: true,
  configureWebpack: () => {
    if (process.env.NODE_ENV === 'production') {
      // mutate config for production...
    } else {
      // mutate for development...
    }
  },
  devServer: {
    proxy: {
      '/server': {
        target: 'http://localhost:9449/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/server': ''
        }
      }
    }
  }
}
