"# my_webpack" 
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/cmj1014/my_webpack.git
git push -u origin main

# 安装webpack5 和配置
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

# 开发环境
## 使用 source map 显示错误
在webpack.config.js中配置inline-source-map可以在打包后显示错误来源
webpack.config.js
```
const path = require('path');
 const HtmlWebpackPlugin = require('html-webpack-plugin');

 module.exports = {
   mode: 'development',
   entry: {
     index: './src/index.js',
     print: './src/print.js',
   },
  devtool: 'inline-source-map',
   plugins: [
     new HtmlWebpackPlugin({
       title: 'Development',
     }),
   ],
   output: {
     filename: '[name].bundle.js',
     path: path.resolve(__dirname, 'dist'),
     clean: true,
   },
 };
```
src/print.js  文件下故意拼错单词，引用时报错
```
 export default function printMe() {

  cosnole.log('I get called from print.js!');
 }
```

运行 npm run build ,打开index.html 页面的按钮，会报错误，显示具体位置


## 选择一个开发工具
webpack 提供几种可选方式，帮助你在代码发生变化后自动编译代码：

webpack's Watch Mode
webpack-dev-server
webpack-dev-middleware
多数场景中，你可能需要使用 webpack-dev-server，但是不妨探讨一下以上的所有选项

### 使用 watch mode(观察模式)
package.json 里面配置"watch": "webpack --watch" 脚本
```
 {
   "name": "webpack-demo",
   "version": "1.0.0",
   "description": "",
   "private": true,
   "scripts": {
     "test": "echo \"Error: no test specified\" && exit 1",
    "watch": "webpack --watch",
     "build": "webpack"
   },
   "keywords": [],
   "author": "",
   "license": "ISC",
   "devDependencies": {
     "html-webpack-plugin": "^4.5.0",
     "webpack": "^5.4.0",
     "webpack-cli": "^4.2.0"
   },
   "dependencies": {
     "lodash": "^4.17.20"
   }
 }
 ```
现在，你可以在命令行中运行 npm run watch，然后就会看到 webpack 是如何编译代码。 然而，你会发现并没有退出命令行。这是因为此 script 当前还在 watch 你的文件
唯一的缺点是，为了看到修改后的实际效果，你需要刷新浏览器。如果能够自动刷新浏览器就更好了，因此接下来我们会尝试通过 webpack-dev-server 实现此功能

### 使用 webpack-dev-server
webpack-dev-server 为你提供了一个简单的 web server，并且具有 live reloading(实时重新加载)

> 先安装模块  npm install --save-dev webpack-dev-server

webpack.config.js  增加devServer配置，让资源自动保存加载，默认自动启动端口号8080
```
const path = require('path');
 const HtmlWebpackPlugin = require('html-webpack-plugin');

 module.exports = {
   mode: 'development',
   entry: {
     index: './src/index.js',
     print: './src/print.js',
   },
   devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
  },
   plugins: [
     new HtmlWebpackPlugin({
       title: 'Development',
     }),
   ],
   output: {
     filename: '[name].bundle.js',
     path: path.resolve(__dirname, 'dist'),
     clean: true,
   },
 }
```
package.json配置启动命令  "start": "webpack serve --open",


在命令行中运行 npm start，我们会看到浏览器自动加载页面。如果你更改任何源文件并保存它们，web server 将在编译代码后自动重新加载。更多服务器配置可以查看相应文档

### 使用 webpack-dev-middleware 
webpack-dev-middleware 是一个封装器(wrapper)，它可以把 webpack 处理过的文件发送到一个 server。 webpack-dev-server 在内部使用了它，然而它也可以作为一个单独的 package 来使用，以便根据需求进行更多自定义设置

> 首先，安装 express 和 webpack-dev-middleware
npm install --save-dev express webpack-dev-middleware
现在，我们需要调整 webpack 配置文件，以确保 middleware(中间件) 功能能够正确启用：

webpack.config.js 中的output增加 publicPath: '/',

```
 const path = require('path');
 const HtmlWebpackPlugin = require('html-webpack-plugin');

 module.exports = {
   mode: 'development',
   entry: {
     index: './src/index.js',
     print: './src/print.js',
   },
   devtool: 'inline-source-map',
   devServer: {
     contentBase: './dist',
   },
   plugins: [
     new HtmlWebpackPlugin({
       title: 'Development',
     }),
   ],
   output: {
     filename: '[name].bundle.js',
     path: path.resolve(__dirname, 'dist'),
     clean: true,
    publicPath: '/',
   },
 };
```

我们将会在 server 脚本使用 publicPath，以确保文件资源能够正确地 serve 在 http://localhost:3000 下，稍后我们会指定 port number(端口号)。接下来是设置自定义 express server
> 创建 server.js文件 在webpack.config.js同级
server.js
```
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);

// 告知 express 使用 webpack-dev-middleware，
// 以及将 webpack.config.js 配置文件作为基础配置。
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  })
);

// 将文件 serve 到 port 3000。
app.listen(3000, function () {
  console.log('Example app listening on port 3000!\n');
});
```

现在，添加一个 npm script，以使我们更方便地运行 server：

> package.json 添加命令"server": "node server.js" 启动它

# 代码分离

代码分离是 webpack 中最引人注目的特性之一。此特性能够把代码分离到不同的 bundle 中，然后可以按需加载或并行加载这些文件。代码分离可以用于获取更小的 bundle，以及控制资源加载优先级，如果使用合理，会极大影响加载时间。

> 常用的代码分离方法有三种：
入口起点：使用 entry 配置手动地分离代码。
防止重复：使用 Entry dependencies 或者 SplitChunksPlugin 去重和分离 chunk。
动态导入：通过模块的内联函数调用来分离代码。

## 入口起点(entry point) 
这是迄今为止最简单直观的分离代码的方式。不过，这种方式手动配置较多，并有一些隐患，我们将会解决这些问题。先来看看如何从 main bundle 中分离 another module(另一个模块)：
在src下创建another-module.js 
another-module.js
```
import _ from 'lodash';

console.log(_.join(['Another', 'module', 'loaded!'], ' '));

```

webpack.config.js    entry 中增加配置名称another
```
 const path = require('path');

 module.exports = {
  entry: './src/index.js',
  mode: 'development',
  entry: {
    index: './src/index.js',
    another: './src/another-module.js',
  },
   output: {
    filename: 'main.js',
    filename: '[name].bundle.js',
     path: path.resolve(__dirname, 'dist'),
   },
 };
```

正如前面提到的，这种方式存在一些隐患：

如果入口 chunk 之间包含一些重复的模块，那些重复模块都会被引入到各个 bundle 中。
这种方法不够灵活，并且不能动态地将核心应用程序逻辑中的代码拆分出来。
以上两点中，第一点对我们的示例来说无疑是个问题，因为之前我们在 ./src/index.js 中也引入过 lodash，这样就在两个 bundle 中造成重复引用。

