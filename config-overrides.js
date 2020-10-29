const {
  override,
  fixBabelImports,
  addLessLoader,
  addBabelPlugins,
  addWebpackAlias,
  addWebpackPlugin
}  = require('customize-cra');
const path = require("path");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();

const isEnvProduction = process.env.REACT_APP_CONFIG_ENV === "prod";
console.log("process.env.NODE_ENV",process.env.NODE_ENV);
console.log(process.env.REACT_APP_CONFIG_ENV);

const addCompression = () => config => {
  if (isEnvProduction) {
    config.plugins.push(
      // gzip压缩
      new CompressionWebpackPlugin({
        test: /\.(css|js)$/,
        // 只处理比1kb大的资源
        threshold: 1024,
        // 只处理压缩率低于90%的文件
        minRatio: 0.9
      })
    );
  }

  return config;
};

// 查看打包后各包大小
const addAnalyzer = () => config => {
  if (isEnvProduction) {
    config.plugins.push(new BundleAnalyzerPlugin());
  }

  return config;
};
//
const bundleInfo = () => config =>{
  smp.wrap(config);
}


module.exports = override(
  fixBabelImports('import', {
    libraryName: "antd-mobile",
    libraryDirectory: "es",
    style: true
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars:{"@primary-color":"#1da57a"}
  }),
  addBabelPlugins(
    [
      "@babel/plugin-proposal-decorators",
         {
            "legacy": true
         }
     ]
   ),
  addCompression(),
  // addAnalyzer(),
  addWebpackPlugin(
    // 终端进度条显示
    new ProgressBarPlugin()
  ),
  addWebpackAlias({
    ["@"]: path.resolve(__dirname, "src")
  }),
  // bundleInfo({})

);
