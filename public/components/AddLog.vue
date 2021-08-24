<template>
    <div>
        <el-page-header @back="$router.push('/home')" title="回到首页" content="记账"></el-page-header>

        <el-tabs v-model="form.bargain">
            <el-tab-pane label="支出" name="expenses"></el-tab-pane>
            <el-tab-pane label="收入" name="receipts"></el-tab-pane>
            <el-tab-pane label="转移" name="transfer"></el-tab-pane>
        </el-tabs>

        <el-form ref="form" :model="form" label-width="100px" v-if="allLogs">
            <el-divider content-position="left" v-if="form.bargain === 'transfer'">从</el-divider>
            <el-form-item label="账本">
                <el-radio v-model="form.account" v-for="i in config.account" :key="i.label" :label="i.id" border>{{
                    i.label
                }}</el-radio>
            </el-form-item>
            <el-form-item label="存储介质">
                <el-radio-group v-model="form.storage">
                    <el-radio-button v-for="i in config.storage" :key="i.label" :label="i.id">
                        <div>{{i.label}}</div>
                        <div style="margin-top: 5px;font-size: 11px;">￥ {{getAmount(i.id, form.account)}}</div>
                    </el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="分类" v-if="form.bargain !== 'transfer'">
                <el-radio-group v-model="type">
                    <template v-if="form.bargain === 'expenses'">
                    <el-radio-button v-for="i in config.expensesType" :key="i.label" :label="i.id">{{
                        i.label
                    }}</el-radio-button>
                    </template>
                    <template v-if="form.bargain === 'receipts'">
                    <el-radio-button v-for="i in config.receiptsType" :key="i.label" :label="i.id">{{
                        i.label
                    }}</el-radio-button>
                    </template>
            </el-form-item>
            <el-form-item label="子分类" v-if="subTypes.length!== 0 && form.bargain === 'expenses'">
                <el-radio-group v-model="form.subType">
                    <el-radio-button v-for="i in subTypes" :key="i" :label="i">{{ i }}</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="交易日期" v-if="form.bargain !== 'transfer'">
                <el-date-picker
                    v-model="form.date"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                >
                </el-date-picker>
            </el-form-item>
            <el-divider content-position="left" v-if="form.bargain === 'transfer'">转</el-divider>
            <el-form-item label="交易金额">
                <el-input placeholder="请输入金额" v-model="form.amount" style="width: 300px">
                    <template slot="prepend">￥</template>
                </el-input>
            </el-form-item>
            <el-divider content-position="left" v-if="form.bargain === 'transfer'">到</el-divider>
            <el-form-item label="账本" v-if="form.bargain === 'transfer'">
                <el-radio
                    v-model="form.toAccount"
                    v-for="i in config.account"
                    :key="i.label"
                    :label="i.id"
                    border
                    >{{ i.label }}</el-radio
                >
            </el-form-item>
            <el-form-item label="存储介质" v-if="form.bargain === 'transfer'">
                <el-radio-group v-model="form.toStorage">
                    <el-radio-button v-for="i in config.storage" :key="i.label" :label="i.id">
                        <div>{{i.label}}</div>
                        <div style="margin-top: 5px;font-size: 11px;">￥ {{getAmount(i.id, form.toAccount)}}</div>
                    </el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="备注" v-if="form.bargain !== 'transfer'">
              <el-input clearable v-model="form.comment" style="width: 300px"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">添加</el-button>
                <el-button @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
const Card = httpVueLoader('./Card.vue')

module.exports = {
    data() {
        return {
            form: {
                account: 0,
                storage: 0,
                toAccount: 0,
                toStorage: 0,
                bargain: 'expenses',
                date: '',
                amount: '',
                comment: '',
                subType: ''
            },
            type: '',
            subTypes: [],
            config: {},
            allLogs: null
        }
    },
    watch: {
        type(val) {
            if (this.form.bargain === 'expenses') {
                this.config.expensesType.some((v, i) => {
                    if (v.id === val) {
                        this.subTypes = v.subType
                        this.form.subType = ''
                        return true
                    }
                })
            }
        },
        'form.bargain'(){
            this.type = ''
        }
    },
    async created() {
        let date = new Date()
        let month = date.getMonth() + 1
        this.form.date = `${date.getFullYear()}-${month.toString().padStart(2, '0')}-${date.getDate()}`
        this.getData()
        let res = await fetch('/api/alllogs')
        let data = await res.json()
        this.allLogs = data.arr
    },
    components: {
        Card
    },
    methods: {
        getAmount(storageId, accountId){
            let result = 0
            this.allLogs.forEach((v, i) => {
                if (v.storageId === storageId && v.accountId === accountId) {
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
        async onSubmit() {
            let obj = {}
            obj.bargainType = this.form.bargain

            if (this.form.amount < 0) return this.$message.warning('金额不符合规则')

            obj.logDate = Date.now()

            if (obj.bargainType === 'expenses' || obj.bargainType === 'receipts') {
                if (this.type === '') return this.$message.error('请选择分类')
                if (this.form.subType === '' && obj.bargainType === 'expenses')
                    return this.$message.error('请选择子分类')
                if (this.form.date === '') return this.$message.error('请选择日期')
                if (this.form.amount === '') return this.$message.error('请输入金额')

                obj.type = this.type
                obj.bargainType === 'expenses' && (obj.subType = this.form.subType)
                obj.storageId = +this.form.storage
                obj.accountId = +this.form.account
                obj.bargainDate = this.form.date
                obj.amount = +this.form.amount
                obj.comment = this.form.comment
            } else if (obj.bargainType === 'transfer') {
                if (this.form.amount === '') return this.$message.error('请输入金额')

                obj.storageId = +this.form.storage
                obj.accountId = +this.form.account
                obj.toStorageId = +this.form.toStorage
                obj.toAccountId = +this.form.toAccount
                obj.amount = +this.form.amount
                let date = new Date()
                obj.bargainDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
            } else {
                this.$message.error('bargainType没有匹配到值')
                return
            }

            let res = await fetch(`/api/log/${obj.bargainType}`, {
                body: JSON.stringify(obj),
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                }
            })
            let data = await res.json()
            if (data.success) {
                this.$message.success(data.msg)
                this.form.amount = ''
            } else {
                this.$message.error(data.msg)
            }
        },
        async getData() {
            let res = await fetch('/api/baseconfig')
            let data = await res.json()
            this.config = data
        },
        resetForm() {
            this.form.account = '0'
            this.form.storage = '0'
            this.form.toAccount = '0'
            this.form.toStorage = '0'
            this.form.amount = ''
            this.form.comment = ''
            this.form.subType = ''
            this.type = ''
        }
    }
}
</script>

<style scoped>
.el-radio-button__inner {
    padding: 8px 20px;
    padding-bottom: 5px;
}
</style>