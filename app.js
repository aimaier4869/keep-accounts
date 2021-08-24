const little = require('node-little-db');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const getDate = require('./util/getDate');
const fs = require('fs')
const { exec } = require("child_process");

const app = express();
const baseConfig = little.create('baseConfig');

let date = getDate();
let logs = little.create(`logs${date.year}${date.month}`);

if (JSON.stringify(logs) === '{}') {
    logs = little.create(`logs${date.year}${date.month}`, []);
    baseConfig.push(`logs${date.year}${date.month}`)
}

app.use(express.static(path.resolve(__dirname, './public')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/api/baseconfig', (req, res) => {
    res.json(baseConfig);
})

app.get('/api/logs', (req, res) => {
    res.json(logs);
})

function getAllLogs() {
    let arr = [];
    for (let i = 0; i < baseConfig.logBooks.length; i++) {
        let newArr = JSON.parse(fs.readFileSync(path.resolve('./', 'db', baseConfig.logBooks[i] + '.json')))
        arr = arr.concat(newArr)
    }
    return arr
}

app.get('/api/alllogs', (req, res) => {
    let arr = getAllLogs();
    res.json({ arr })
})

app.post('/api/log/expenses', (req, res) => {
    let data = req.body;
    logs.push(data);
    res.json({ msg: '记账成功！', success: true });
})

app.post('/api/log/receipts', (req, res) => {
    let data = req.body;
    logs.push(data);
    res.json({ msg: '记账成功！', success: true });
})

app.post('/api/log/transfer', (req, res) => {
    let data = req.body;
    logs.push({
        bargainType: "transfer",
        logDate: Date.now(),
        type: "transfer",
        subType: "转出",
        storageId: data.storageId,
        accountId: data.accountId,
        bargainDate: data.bargainDate,
        amount: data.amount,
        comment: data.comment
    });
    logs.push({
        bargainType: "transfer",
        logDate: Date.now(),
        type: "transfer",
        subType: "转入",
        storageId: data.toStorageId,
        accountId: data.toAccountId,
        bargainDate: data.bargainDate,
        amount: data.amount,
        comment: data.comment
    });
    res.json({ msg: '转移成功！', success: true })
})

app.post('/api/modifylog', (req, res) => {
    let index = logs.findIndex((v, i) => {
        return v.logDate === req.body.logDate
    })
    if (index === -1) return res.json({ msg: '未找到记录，修改失败！', success: false })

    for (const key in req.body) {
        logs[index][key] = req.body[key]
    }

    res.json({ msg: '修改成功！', success: true })
})

app.post('/api/baseconfig/edit', (req, res) => {
    let data = req.body

    let index = baseConfig[data.type].findIndex(v => {
        return v.id === data.id
    })

    if (index !== -1) {
        for (const key in baseConfig[data.type][index]) {
            baseConfig[data.type][index][key] = data[key]
        }
        res.json({ msg: '修改成功', success: true })
    } else {
        res.json({ msg: '修改失败', success: false })
    }
})
app.post('/api/baseconfig/add', (req, res) => {
    let data = req.body
    let type = data.type
    delete data.type
    delete data.edit

    let success = baseConfig[type].push(data)

    if (success) {
        res.json({ msg: '新增成功', success: true })
    } else {
        res.json({ msg: '新增失败', success: false })
    }
})

app.post('/api/baseconfig/exchange', (req, res) => {
    let data = req.body
    let type = data.type

    let obj1 = { ...baseConfig[type][data.index1] }
    let obj2 = { ...baseConfig[type][data.index2] }
    baseConfig[type][data.index2] = obj1
    baseConfig[type][data.index1] = obj2
    res.json({ msg: '调换成功', success: true })
})

app.delete('/api/deleteLog/:id', (req, res) => {
    let id = +req.params.id
    let index = -1,thisLog
    for (let i = 0; i < baseConfig.logBooks.length; i++) {
        thisLog = little.create(baseConfig.logBooks[i])
        index = thisLog.findIndex((v, i) => {
            return v.logDate === id
        })
        if (index !== -1) break
    }
    if (index === -1) return res.json({ msg: '未找到记录，删除失败！', success: false })

    let success = thisLog.splice(index, 1);

    if (success.length !== 0) {
        res.json({ msg: '删除成功！', success: true })
    }
})

app.delete('/api/baseconfig/item', (req, res) => {
    let data = req.body
    let allLogs = getAllLogs();
    let type = ''

    if (data.type === 'receiptsType' || type === 'expensesType') {
        type = 'type'
    } else {
        type = data.type + 'Id'
    }

    let has = allLogs.some(v => {
        return v[type] === data.id
    })

    if (has) {
        return res.json({ msg: '已有记录绑定了该属性，你需要先删除记录后才能删除此项！', success: false })
    } else {
        baseConfig[data.type].some((v, i, arr) => {
            if (v.id === data.id) {
                arr.splice(i, 1)
                return true
            }
        })
        return res.json({ msg: '删除成功！', success: true })
    }

})

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, './public/index.html'));
})


app.listen(8081);
console.log('http://localhost:8081/')
exec('start http://localhost:8081/')