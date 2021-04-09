const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // entry: './src/index.js',
    entry: {//引入配置内容
      index: './src/index.js',//命名引入名称
      print: './src/print.js', //命名引入名称
    },
    devtool: 'inline-source-map',//错误追踪--显示未打包时错误位置
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
    }
};