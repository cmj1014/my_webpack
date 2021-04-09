const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // entry: './src/index.js',
    entry: {//引入配置内容
      index: './src/index.js',
      print: './src/print.js',
    },
    devtool: 'inline-source-map',//错误追踪
     plugins: [
       new HtmlWebpackPlugin({
         title: '管理输出',
       }),
     ],
  output: {//输出配置内容
    // filename: 'main.js',
    // filename: 'bundle.js',
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
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