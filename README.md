"# my_webpack" 
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/cmj1014/my_webpack.git
git push -u origin main

# 安装webpack 和配置
npm install webpack webpack-cli --save-dev
创建以下目录结构、文件和内容：
  webpack-demo
  |- package.json
 |- index.html
 |- /src
   |- index.js
> 编辑
src/index.js
```
function component() {
  const element = document.createElement('div');

  // lodash（目前通过一个 script 引入）对于执行这一行是必需的
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');

  return element;
}

document.body.appendChild(component());
```
index.html
```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>起步</title>

  </head>
  <body>

  </body>
</html>

```
> 我们还需要调整 package.json 文件，以便确保我们安装包是 private(私有的)，并且移除 main 入口。这可以防止意外发布你的代码。
package.json

  "main": "index.js"改成 "private": true,

## 安装lodash模块 和引用
npm install --save lodash
src/index.js
```
import _ from 'lodash';
```

## 初始打包后的文件
dist/index.html
 <script src="main.js"></script>

## 使用一个配置文件
创建一个文件webpack.config.js
```
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
```
启动命令    npx webpack --config webpack.config.js
也可以吧命令写成脚本配置进去
package.json  在scripts里面添加
```
"build": "webpack"
```

## 增加查询webpack版本命令
-package.json
scripts 下增加"webpack": "webpack --version",

## 区分生产和开发环境打包命令
-package.json
"dev": "webpack --mode development",
    "build": "webpack --mode production"

# 资源管理
通过对配置文件webpack.config.js的修改可以引用不同的配置文件

## 加载 CSS 
npm install --save-dev style-loader css-loader  安装  css引用模块,通过正则来匹配文件 
-- test /\.css$/i
-- use ['style-loader', 'css-loader']  引用的模块
webpack.config.js
```
 const path = require('path');

 module.exports = {
   entry: './src/index.js',
   output: {
     filename: 'bundle.js',
     path: path.resolve(__dirname, 'dist'),
   },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
 };
```

创建一个style.css文件
src/style.css
```
.hello {
  color: red;
}
```
src/index.js  引用css配置文件，并直接添加类效果
```
 import _ from 'lodash';
import './style.css';

 function component() {
   const element = document.createElement('div');

   // Lodash, now imported by this script
   element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.classList.add('hello');

   return element;
 }

 document.body.appendChild(component());
```
运行看效果 npm run build，应该是显示的内容变成红字

## 加载 images 图像
webpack.config.js
在rules下配置
```
 {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
```
在src下创建一个图片icon.png,在index.js下应用图片并添加在页面上
src/index.js
```
import _ from 'lodash';
 import './style.css';
import Icon from './icon.png';

 function component() {
   const element = document.createElement('div');

   // Lodash, now imported by this script
   element.innerHTML = _.join(['Hello', 'webpack'], ' ');
   element.classList.add('hello');

  // 将图像添加到我们已经存在的 div 中。
  const myIcon = new Image();
  myIcon.src = Icon;

  element.appendChild(myIcon);

   return element;
 }

 document.body.appendChild(component());
```
src/style.css
```
 .hello {
   color: red;
  background: url('./icon.png');
 }
```

运行看效果 npm run build，应该是显示的有图片

# 管理输出
到目前为止，我们都是在 index.html 文件中手动引入所有资源，然而随着应用程序增长，并且一旦开始 在文件名中使用 hash 并输出 多个 bundle，如果继续手动管理 index.html 文件，就会变得困难起来。然而，通过一些插件可以使这个过程更容易管控。

## 预先准备
创建print.js  在src下
src/print.js
```
export default function printMe() {
  console.log('I get called from print.js!');
}
```
src/index.js
引用print.js 文件 调用里面的函数
```
 import _ from 'lodash';
import printMe from './print.js';

 function component() {
   const element = document.createElement('div');
  const btn = document.createElement('button');

   element.innerHTML = _.join(['Hello', 'webpack'], ' ');

  btn.innerHTML = 'Click me and check the console!';
  btn.onclick = printMe;

  element.appendChild(btn);

   return element;
 }

 document.body.appendChild(component());
```

dist/index.html
更新 dist/index.html 文件，来为 webpack 分离入口做好准备：
```
 <!DOCTYPE html>
 <html>
   <head>
     <meta charset="utf-8" />
    <title>管理输出</title>
    <script src="./print.bundle.js"></script>
   </head>
   <body>
    <script src="./index.bundle.js"></script>
   </body>
 </html>
```

## 动态调整输入输出名称
调整配置。我们将在 entry 添加 src/print.js 作为新的入口起点（print），然后修改 output，以便根据入口起点定义的名称，动态地产生 bundle 名称

webpack.config.js

```
 const path = require('path');

 module.exports = {
  entry: {
    index: './src/index.js',
    print: './src/print.js',
  },
   output: {
    filename: '[name].bundle.js',
     path: path.resolve(__dirname, 'dist'),
   },
 };
```
执行 npm run build，然后看到生成

我们可以看到，webpack 生成 print.bundle.js 和 index.bundle.js 文件，这也和我们在 index.html 文件中指定的文件名称相对应。如果你在浏览器中打开 index.html，就可以看到在点击按钮时会发生什么。
但是，如果我们更改了我们的一个入口起点的名称，甚至添加了一个新的入口，会发生什么？会在构建时重新命名生成的 bundle，但是我们的 index.html 文件仍然引用旧的名称。让我们用 HtmlWebpackPlugin 来解决这个问题。

## 设置 HtmlWebpackPlugin

安装模块 npm install --save-dev html-webpack-plugin
webpack.config.js

```
 const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

 module.exports = {
   entry: {
     index: './src/index.js',
     print: './src/print.js',
   },
  plugins: [
    new HtmlWebpackPlugin({
      title: '管理输出',
    }),
  ],
   output: {
     filename: '[name].bundle.js',
     path: path.resolve(__dirname, 'dist'),
   },
 };
```
在我们构建之前，你应该了解，虽然在 dist/ 文件夹我们已经有了 index.html 这个文件，然而 HtmlWebpackPlugin 还是会默认生成它自己的 index.html 文件。也就是说，它会用新生成的 index.html 文件，替换我们的原有文件

## 清理 /dist 文件夹
你可能已经注意到，由于遗留了之前的指南和代码示例，我们的 /dist 文件夹显得相当杂乱。webpack 将生成文件并放置在 /dist 文件夹中，但是它不会追踪哪些文件是实际在项目中用到的。

通常比较推荐的做法是，在每次构建前清理 /dist 文件夹，这样只会生成用到的文件。让我们使用 output.clean 配置项实现这个需求。

webpack.config.js
clean: true,  设置清空生产文件夹内容
```
 const path = require('path');
 const HtmlWebpackPlugin = require('html-webpack-plugin');

 module.exports = {
   entry: {
     index: './src/index.js',
     print: './src/print.js',
   },
   plugins: [
     new HtmlWebpackPlugin({
       title: 'Output Management',
     }),
   ],
   output: {
     filename: '[name].bundle.js',
     path: path.resolve(__dirname, 'dist'),
    clean: true,
   },
 };
```