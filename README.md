# Message
![node-icon](https://img.shields.io/badge/node-6.2.2-blue.svg) ![express-icon](https://img.shields.io/badge/express-4.15.2-yellow.svg) ![mongoose-icon](https://img.shields.io/badge/mongoose-4.9.6-yellow.svg) ![jquery-weui-icon](https://img.shields.io/badge/weui-0.8.3-blue.svg) ![build-icon](https://img.shields.io/badge/build-passing-brightgreen.svg) 

> This is a **private letter system** demo.
> Version: 0.1.0

## Installation & Start

+ 1. 克隆文件

```
$ git clone https://github.com/TalkWIthKeyboard/Message.git
```
+ 2. 安装包和前端库

```
$ cd Message
$ npm install
$ bower install
```
+ 3. 启动项目

```
$ nodemon
```
## Design
### Technology Stack
这次的技术栈是 ```express + mongo```，前端使用的是 ```Jade模板``` 和 ```Jquery-weui库```。

### Code Design
```
.
├── app.js
├── builder               // 切面生成器
│   ├── middleBuilder.js
│   ├── responseBuilder.js
│   └── utilBuilder.js
├── model                 // 数据库映射
│   ├── conf.js           // 统一配置文件
│   ├── create.js         // schema到model的生成器
│   ├── friendSchema.js
│   ├── messageSchema.js
│   ├── promise.js        // 数据库操作API Promise对象
│   └── userSchema.js
├── nodemon.json
├── package.json
├── routes                // 路由
│   ├── api-router.js
│   └── h5-router.js
├── server                // 业务逻辑
│   ├── apiServer.js      // 通用的增删查改API
│   ├── messageServer.js  // message相关业务
│   ├── requestServer.js  // 请求参数检测业务
│   └── userServer.js     // user相关业务
```

### Back-end Design
因为时间原因没有来得及实现动态刷新的功能，后面会给出一些思路。现在项目中都是基于 **Http** 的短连接进行实现的，登录用户的状态是通过在服务器端维护 **session** 来进行实现，并且也通过 **session** 做了拦截器，会将没有登录的用户拦截到登录页面。

#### API Design
+ H5 **(GET)** 
    + 登录页面：```/h5/login```
    + 注册页面：```/h5/register```
    + 好友页面：```/h5/friend```
    + 好友搜索：```/h5/search```
    + 消息页面：```/h5/message/:receiver```
+ API
    + 用户注册：```/api/user```
        + Type：**POST**
        + Body：
            + **username**
            + **password** 
    + 用户登录：```/api/login```
        + Type：**POST**
        + Body：
            + **username**
            + **password**
    + 寻找用户：```/api/friend/:username```
        + Type：**GET** 
        + Params：**username**
    + 添加朋友：```/api/friend```
        + Type：**POST**
        + Body：**friend**
    + 删除朋友：```/api/friend/:friend```
        + Type：**DELETE**
        + Params：**friend**
    + 发消息：```/api/message```
        + Type：**POST** 
        + Body：
            + **receiver**
            + **message**
    + 删除消息：```/api/message/:id```
        + Type：**DELETE** 
        + Params：**id**

#### Schema Design
+ User
    + username: String
    + password: String
    + meta:
        + createAt: Date
        + updateAt: Date 
+ Message
    + sender: ObjectId
    + receiver: ObjectId
    + notRead: Number
    + meta:
        + createAt: Date
        + updateAt: Date 
+ Friend
    + adder: ObjectId
    + friend: ObjectId
    + message: String
    + meta:
        + createAt: Date
        + updateAt: Date

## Todo List
+ 前端加密
+ 好友模糊搜索
+ 实时更新 **（以消息接收发送为例）**
    + 进入页面后连入 ```websocket```
    + 定义多个 ```Event```，发送消息后不仅通过 ```HTTP API``` 修改数据库，**send message** 到 ```websocket``` 监听端口，服务端再广播到另一端的用户。
    + 另一端的用户监听到消息以后，通过前端 ```Javascript``` 将消息添加到屏幕。
        
## Demo

```
http://115.159.1.222:8888/
```



