<template>
    <div>
        <el-page-header title="" content="首页"></el-page-header>
        <template v-if="config">
            <div class="top">
                <div class="left">
                    <h3>本月统计</h3>
                    <div class="content">
                        <div>
                            <div class="title">收入</div>
                            <div class="amount">￥ {{ thisMonth.receipts }}</div>
                        </div>
                        <div>
                            <div class="title">支出</div>
                            <div class="amount">￥ {{ thisMonth.expenses }}</div>
                        </div>
                        <div>
                            <div class="title">剩余</div>
                            <div class="amount">￥ {{ thisMonth.subtract }}</div>
                        </div>
                    </div>
                </div>
                <div class="right">
                    <h3>账本统计</h3>
                    <div class="content">
                        <div>
                            <div class="title">所有资产</div>
                            <div class="amount">￥ {{ getAccountAllAmount('all') }}</div>
                        </div>
                        <div v-for="i in config.account" :key="i.label">
                            <div class="title">{{ i.label }}</div>
                            <div class="amount">￥ {{ getAccountAllAmount(i.id) }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <h3>所有余额</h3>
            <div class="storages">
                <Card
                    :label="item.label"
                    :amount="getStorageAllAmount(item.id)"
                    :class="item.class"
                    v-for="item in config.storage"
                    :key="item.label"
                    :tags="getTags(item.id)"
                ></Card>
                <Card style="visibility: hidden" v-for="item in config.storage.length - 1" :key="item + 'i'"></Card>
            </div>
        </template>
    </div>
</template>

<script>
const Card = httpVueLoader('./Card.vue')

module.exports = {
    data() {
        return {
            config: null,
            thisMonth: {}
        }
    },
    async created() {
        let res = await fetch('/api/alllogs')
        let data = await res.json()
        this.allLogs = data.arr
        res = await fetch('/api/baseconfig')
        data = await res.json()
        this.config = data
        this.getThisMonth()
    },
    methods: {
        getStorageAllAmount(id) {
            let result = 0
            this.allLogs.forEach((v, i) => {
                if (v.storageId === id || id === 'all') {
                    if (v.bargainType === 'expenses') {
                        result -= v.amount
                    } else if (v.bargainType === 'receipts') {
                        result += v.amount
                    } else if (v.bargainType === 'transfer') {
                        if (v.subType === '转出') {
                            result -= v.amount
                        } else if (v.subType === '转入') {
                            result += v.amount
                        }
                    }
                }
            })
            result = +result.toFixed(2)
            return result
        },
        getThisMonth() {
            let obj = {
                expenses: 0,
                receipts: 0
            }
            let date = new Date()
            let thisMonth = date.getMonth() + 1 
            this.allLogs.forEach((v, i) => {
                let month = +v.bargainDate.split('-')[1]
                if (month === thisMonth) {
                    if (v.bargainType === 'expenses') {
                        obj.expenses += v.amount
                    } else if (v.bargainType === 'receipts') {
                        obj.receipts += v.amount
                    }
                }
            })
            obj.subtract = (obj.receipts - obj.expenses).toFixed(2)
            obj.expenses = obj.expenses.toFixed(2)
            obj.receipts = obj.receipts.toFixed(2)
            this.thisMonth = obj
        },
        getAccountAllAmount(id) {
            let result = 0
            this.allLogs.forEach((v, i) => {
                if (v.accountId === id || id === 'all') {
                    if (v.bargainType === 'expenses') {
                        result -= v.amount
                    } else if (v.bargainType === 'receipts') {
                        result += v.amount
                    } else if (v.bargainType === 'transfer') {
                        if (v.subType === '转出') {
                            result -= v.amount
                        } else if (v.subType === '转入') {
                            result += v.amount
                        }
                    }
                }
            })
            result = +result.toFixed(2)
            return result
        },
        getTags(storageId) {
            let tags = []
            this.config.account.forEach((v, i) => {
                let obj = {}
                obj.tagAmount = 0
                obj.tag = v.label.substr(0, 2)
                this.allLogs.forEach((val, i) => {
                    if (val.storageId === storageId && val.accountId === v.id) {
                        if (val.bargainType === 'expenses') {
                            obj.tagAmount -= val.amount
                        } else if (val.bargainType === 'receipts') {
                            obj.tagAmount += val.amount
                        } else if (val.bargainType === 'transfer') {
                            if (val.subType === '转出') {
                                obj.tagAmount -= val.amount
                            } else if (val.subType === '转入') {
                                obj.tagAmount += val.amount
                            }
                        }
                    }
                })
                tags.push(obj)
            })
            return tags;
        }
    },
    components: {
        Card
    }
}
</script>

<style scoped>
.top {
    display: flex;
    margin-bottom: 30px;
    padding: 10px;
}

.top h3 {
    color: #010103;
}

.top > div {
    flex: 1;
    background: #f2f3f7;
    margin: 10px 40px;
    padding: 30px;
    border-radius: 20px;
}

.top .content {
    display: flex;
}

.top .content > div {
    flex: 1;
    text-align: center;
    height: 110px;
    background: #e7ecf2;
    border-radius: 20px;
    margin: 0 20px;
    padding-top: 20px;
}

.top .content .title {
    font-size: 20px;
    margin-bottom: 20px;
    color: #a6a9b7;
}

.top .content .amount {
    font-size: 26px;
}

.storages {
    margin: 10px 40px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
</style>