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

