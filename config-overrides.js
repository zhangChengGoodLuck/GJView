const { override, addWebpackAlias } = require("customize-cra")

const path = require("path");

module.exports=override(
    //引入插件写相关配置
  addWebpackAlias({
    "@" : path.resolve(__dirname, "src"),
    "@api" : path.resolve(__dirname, "src/assets/js/api")
  })
)
