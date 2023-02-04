#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const argv = process.argv;
const { name, version } = require('../package.json');
// const data = require('./data.json');


const file2Obj = (filePath) => {
    filePath = path.resolve(__dirname, filePath)
    return JSON.parse(fs.readFileSync(filePath).toString())
}

const obj2File = (dataObj) => {
    fs.writeFileSync(
        path.resolve(__dirname, './data.json'),
        JSON.stringify(dataObj, null, 2)
    )
}

let data = file2Obj('./data.json');

if (argv.indexOf('-v') !== -1 || argv.indexOf('-V') !== -1) {
    console.log(`${name} V${version}`);
} else if (argv.indexOf('ls') !== -1) {
    const { exec } = require('child_process')
    exec('npm config get registry', (err, stdout, stderr) => {
        if (err) { console.error(`exec error: ${err}`); return }
        data.forEach(item => {
            for (key in item) {
                let str;
                // 让每次ls输出时当前的带星
                if (item[key].trim() === stdout.trim()) {
                    str = '* '
                } else {
                    str = '  '
                }
                console.log(`${str}${key} => ${item[key]}`)
            }
        });
    })
} else if (argv.indexOf('add') !== -1) {  // keen-nrm add toabao1 xxx
    const index = argv.indexOf('add')
    const key = argv[index + 1]
    const value = argv[index + 2]
    const res = data.filter(item => item[key])
    if (res.length === 0) {
        data.push({ [key]: value })
        console.log(data);
        obj2File(data)
        console.log(`add ${key} registry success!`)
    } else {
        console.log(`${key} has already been in list`);
    }
} else if (argv.indexOf('del') !== -1) {  // keen-nrm del toabao1
    const index = argv.indexOf('del')
    const keyArg = argv[index + 1] // toabao1
    if (keyArg) {
        data = data.filter(item => {
            // Object.entries({a: 1})  ==> [['a', 1], []]
            const [[key]] = Object.entries(item)
            return key === keyArg ? false : true;
        })
        obj2File(data)
    }
    console.log(`del ${keyArg} registry success!`)
} else if (argv.indexOf('use') !== -1) {  // keen-nrm use toabao
    const index = argv.indexOf('use')
    const key = argv[index + 1] // toabao1
    if (!key) {
        return
    }
    let res = data.filter(item => item[key])
    if (res.length === 0) {
        console.log(`${key} is not in list`);
        return
    }
    const { exec } = require('child_process');
    exec(`npm config set registry ${res[0][key]}`, (err, stdout, stderr) => {
        if (err) { console.error(`exec error: ${err}`); return }
        console.log(`set registry success: ${res[0][key]}`);
    })
} else if (argv.indexOf('-h') !== -1) {
    console.log(`
    add: keen-nrm add key value can add registry address to list
    del: keen-nrm del key can delete key of list
    ls:  keen-nrm add ls can show all list and with * one is currently selected
    use: keen-nrm use key can npm config set registry one
    -v:  keen-nrm -v can show version
`
    )
}