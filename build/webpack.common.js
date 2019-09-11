const HtmlWebpackPlugin = require('html-webpack-plugin')
const pageConfig = require('./wuliConfig')
const path = require('path');
/*多页面配置*/
let entry  =  pageConfig.entry
let HtmlWebpackPages = pageConfig.pages.map(item => new HtmlWebpackPlugin(item) )

module.exports = {
  // entry:{
  // main:'./src/app/test/js/index.js'
  // },
  entry : entry,
  module: {
    rules:[
      /*es6编译*/
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      /*打包静态文件 url-loader,fill-loader*/
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        loader: 'url-loader',/*需要安装 url-loader,fill-loader*/
        options: {
          limit: 20480,/*20kb以内转为DataUrl*/
          name: '[name].[hash:7].[ext]',
          outputPath: 'images/',
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 20480,/*20kb以内转为DataUrl*/
          name: '[name].[hash:7].[ext]',
          outputPath: 'fonts/',
        }
      },
    ]
  },
  plugins: [
    /*html模版*/
    // new HtmlWebpackPlugin({
    //   template:'./src/app/test/index.html'
    // }),
    ...HtmlWebpackPages,
  ],
  output: {
    publicPath:'./',/*写入绝对路径全地址*/
    filename: '[name].[hash].js',
    path:path.resolve(__dirname,'../dist'),
    chunkFilename: '[name].chunk.js',
  }
}
