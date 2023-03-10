# keen-nrm
类似nrm的命令行工具

## 认识nrm
```
npm ls -g

npm config get registry
nrm -V
nrm -h
nrm ls

nrm add local http://localhost:3000
nrm ls
nrm use local
npm config get registry

nrm del local
nrm ls
```

## 实操
```
#!/usr/bin/env node
// const 
console.log('hello world!');

// package.json
"bin": {
    "keen-nrm": "bin/index.js"
  },

npm pack    // 打包，类似javac 打包出jar
sudo npm install ./keen-nrm-1.0.0.tgz -g
npm ls -g // 能看见多了 keen-nrm@1.0.0
keen-nrm // 能看见多了输出 hello world!


keen-nrm -h

    add: keen-nrm add key value can add registry address to list
    del: keen-nrm del key can delete key of list
    ls:  keen-nrm add ls can show all list and with * one is currently selected
    use: keen-nrm use key can npm config set registry one
    -v:  keen-nrm -v can show version


```

## 原理
-g安装的全局包都放在/usr/local/lib/node_modules


## 单测
https://www.jestjs.cn/
```
var arr = ['red', 'green', 'blue']
for...in 循环主要是为了遍历对象而生，不适用于遍历数组，得到0，1，2 只有arr[0]得到 'red'
for...of 循环可以用来遍历数组、类数组对象，字符串、Set、Map 以及 Generator 对象 ，得到'red', 'green', 'blue'
```


## 发布到npm私服
```
// 使用verdaccio
sudo npm install verdaccio -g
// 运行
verdaccio
// 会运行服务 http://localhost:4873/
// 注册到本地npm list
sudo keen-nrm add local http://localhost:4873/
keen-nrm use local
keen-nrm ls

npm adduser / npm login
npm version patch -m '发布'
npm publish

```


