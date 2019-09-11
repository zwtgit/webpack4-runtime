const path = require('path')
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.common');

const webpackConfig = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    publicPath: '/',
    open: true,
    port: 8080,
    host: '0.0.0.0',
    hot: true,
    proxy: {
      '/taurus-portal-service':{
        target:'http://test-portal.ads.5wuli.com:7777/taurus-portal-service/', // stage
        // target:'http://portal.ads.5wuli.com/taurus-portal-service', // online
        changeOrigin:true,
        pathRewrite:{
          '^/taurus-portal-service':''
        }
      },
    },
  },
  module: {
    rules:[
      /*注意执行顺序 css-loader => style-loader */
      {
        test: /\.css$/,/*需要安装style-loader,css-loader*/
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      /*注意执行顺序 less-loader => css-loader => style-loader */
      {
        test: /\.less$/,/*需要安装style-loader,css-loader,less,less-loader*/
        use: [
          'style-loader',
          {
            loader:'css-loader',
            /*当less文件@import less时，在执行一次上一个loader(less-loader)*/
            options:{
              importLoaders:1
            }
          },
          'less-loader'
        ],
      }
    ]
  },
  plugins: [
    /*hmr热更新*/
    new webpack.HotModuleReplacementPlugin()
  ],
}

module.exports = merge(webpackConfig,baseConfig);