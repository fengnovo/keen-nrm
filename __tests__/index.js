const { exec } = require('child_process');

expect.extend({
    anyContain: (received, resArr) => {
        let res = resArr.filter(item => received.indexOf(item) !== -1).length > 0
        if (res) {
            return {
                message: () => `${received} success`,
                pass: true
            }
        } else {
            return {
                message: () => `${received} error`,
                pass: false
            }
        }
    }
})

test('keen-nrm -v', () => {
    const { name, version } = require('../package.json');
    exec('node bin/index.js -v', (err, stdout, stderr) => {
        if (err) { console.error(`exec error: ${error}`); return }
        expect(stdout).toContain(`${name} V${version}`)
    })
})

test('keen-nrm ls', () => {
    const data = require('../bin/data.json');
    exec('node bin/index.js ls', (err, stdout, stderr) => {
        if (err) { console.error(`exec error: ${err}`); return }
        data.forEach(item => {
            for (key in item) {
                expect(stdout).toContain(item[key])
            }
        })
    })
})

test('keen-nrm add key value', () => {
    const key = 'local'
    const value = 'http://localhost:4123'
    exec(`node bin/index.js add ${key} ${value}`, (err, stdout, stderr) => {
        if (err) { console.error(`exec error: ${error}`); return }
        expect(stdout).toContain(`add ${key} registry success!`)
        exec('node bin/index.js ls', (err, stdout, stderr) => {
            if (err) { console.error(`exec error: ${err}`); return }
            expect(stdout).toContain(key)
        })
    })

})

test('keen-nrm del key', () => {
    const key = 'local'
    setTimeout(() => {  // 有可能上个测试用例正在操作bin/data.json这个文件，造成对这个测试用例的影响，所以做一个延迟执行
        exec(`node bin/index.js del ${key}`, (err, stdout, stderr) => {
            if (err) { console.error(`exec error: ${error}`); return }
            expect(stdout).toContain(`del ${key} registry success!`)
        })
        exec('node bin/index.js ls', (err, stdout, stderr) => {
            if (err) { console.error(`exec error: ${err}`); return }
            expect(stdout).not.toContain(key)
        })
    }, 300);
})

test('keen-nrm use key', () => {
    const key = 'taobao'
    setTimeout(() => { // 有可能上个测试用例正在操作bin/data.json这个文件，造成对这个测试用例的影响，所以做一个延迟执行
        exec(`node bin/index.js use ${key}`, (err, stdout, stderr) => {
            if (err) { console.error(`exec error: ${error}`); return }
            expect(stdout).anyContain([
                `set registry success`,
                `${key} is not in list`
            ])
        })

        test('npm config get regsitry correct', () => {
            exec('npm config get registry', (err, stdout, stderr) => {
                if (err) { console.error(`exec error: ${err}`); return }
                const data = require('../bin/data.json')
                data.forEach(item => {
                    console.log(item[key])
                })
                // 匹配use key所设置的url地址
                let res = data.filter(item => item[key][0])
                if (res) {
                    // 若匹配到
                    expect(stdout).toContain(res[key])
                } else {
                    throw (`${key} is not in list`)
                }
            })
        })
    }, 300);
})