module.exports = {
  entry:{
    'index': './src/app/test/js/index.js',
    'list': './src/app/test/js/list.js',
  },
  pages: [
    {
      template: './src/app/test/index.html',
      filename: './index.html',
      chunks: ['index'],
      inject: 'body'
    },
    {
      template: './src/app/test/list.html',
      filename: './list.html',
      chunks: ['list'],
      inject: 'body'
    }
  ],
}
