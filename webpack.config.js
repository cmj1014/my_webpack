const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // entry: './src/index.js',
    entry: {//引入配置内容
      index: './src/index.js',//命名引入名称
      print: './src/print.js', //命名引入名称
      another: './src/another-module.js',  //分离的模块
      /* index: {
          import: './src/index.js',
          dependOn: 'shared',
        },
        another: {
          import: './src/another-module.js',
          dependOn: 'shared',
        },
        shared: 'lodash', */
    },
    devtool: 'inline-source-map',//错误追踪--显示未打包时错误位置
    devServer: {
      contentBase: './dist', //修改配置文件， 告知 dev server， 从什么位置查找文件：
    },
     plugins: [
       new HtmlWebpackPlugin({
         title: '管理输出',
       }),
     ],
  output: {//输出配置内容
    // filename: 'main.js',
    // filename: 'bundle.js',
    filename: '[name].bundle.js',//动态配置名字
    path: path.resolve(__dirname, 'dist'),//输出文件名
    clean: true,//清空dist文件
    publicPath: '/', //加载资源的路径 '/' 是当前路径
  },
    mode: 'development',
    module: {
      rules: [
          {
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader' 
              ] 
          } ,
          {
           test: /\.(png|svg|jpg|gif)$/,
             use: [
               'file-loader' 
             ] 
           }
        ] 
    },
    //  optimization: {
    //    runtimeChunk: 'single', //多个入口时设置
    //  },
     optimization: {
       splitChunks: {
         chunks: 'all',
       },
     },
};