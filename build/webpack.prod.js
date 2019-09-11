const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const baseConfig = require('./webpack.common');

const webpackConfig = {
  mode: 'production',
  devtool:'cheap-module-source-map' ,
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        libs: {
          name: 'libs',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial' // 只打包初始时依赖的第三方
        },
        // elementUI: {
        //   name: 'chunk-elementUI', // 单独将 elementUI 拆包
        //   priority: 20, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
        //   test: /[\\/]node_modules[\\/]element-ui[\\/]/
        // }
      }
    },
    minimizer: [
      /*js代码压缩*/
      new UglifyJsPlugin({
        uglifyOptions: {
          ecma: 8,
          safari10: true
        },
        sourceMap: true,
        cache: true,
        parallel: true
      }),
      /*压缩css文件*/
      new OptimizeCSSAssetsPlugin()
    ]
  },
  module: {
    rules:[
      /*注意执行顺序 css-loader => style-loader */
      {
        test: /\.css$/,/*需要安装style-loader,css-loader*/
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      /*注意执行顺序 less-loader => css-loader => style-loader */
      {
        test: /\.less$/,/*需要安装style-loader,css-loader,less,less-loader*/
        use: [
          MiniCssExtractPlugin.loader,
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
    /*把css从js文件中分离*/
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[name].chunk.[hash].css',
    }),
    /*打包前先清空dist*/
    new CleanWebpackPlugin(),
  ]
}

module.exports = merge(webpackConfig,baseConfig);
