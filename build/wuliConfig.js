module.exports = {
  entry:{
    'index': './src/app/wuli/index.js',
  },
  pages: [
    {
      template: './src/app/wuli/index.html',
      filename: './index.html',
      chunks: ['index'],
      inject: 'body'
    },
  ],
}
