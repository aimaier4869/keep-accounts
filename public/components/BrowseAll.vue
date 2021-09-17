<template>
    <div>
        <el-page-header @back="$router.push('/home')" title="回到首页" content="所有记录"></el-page-header>
        <div class="info">共 {{ logCount.all }} 条记录，其中有 {{ logCount.expenses }} 笔支出，有 {{ logCount.receipts }} 笔收入。</div>
        <!-- 表格区域 -->
        <el-table :data="tableData" border max-height="700px" v-if="baseConfig">
            <el-table-column prop="logDate" label="记录id" width="130"> </el-table-column>
            <el-table-column label="交易类型" width="80">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.bargainType === 'receipts'" type="success">{{ filter(scope.row.bargainType, 'bargain') }}</el-tag> 
                    <el-tag v-else-if="scope.row.bargainType === 'expenses'" type="danger">{{ filter(scope.row.bargainType, 'bargain') }}</el-tag> 
                    <el-tag v-else-if="scope.row.bargainType === 'transfer'" type="info">{{ filter(scope.row.bargainType, 'bargain') }}</el-tag> 
                </template>
            </el-table-column>
            <el-table-column label="账本" width="100">
                <template slot-scope="scope">{{ filter(scope.row.accountId, 'account') }}</template>
            </el-table-column>
            <el-table-column label="存储介质" width="200">
                <template slot-scope="scope">
                    <Card style="margin: 0;" class="mini" :class="filter(scope.row.storageId, 'storage', 'class')" :label="filter(scope.row.storageId, 'storage')">

                    </template>
            </el-table-column>
            <el-table-column label="分类" width="100">
                <template slot-scope="scope"
                    ><el-tag>{{ filter(scope.row.type, scope.row.bargainType + 'Type') }}</el-tag></template
                >
            </el-table-column>
            <el-table-column label="子分类" width="150">
                <template slot-scope="scope"
                    ><el-tag effect="plain" v-if="scope.row.subType" type="info">{{
                        scope.row.subType
                    }}</el-tag></template
                >
            </el-table-column>
            <el-table-column label="交易日期" width="150">
                <template slot-scope="scope">
                   {{ getDay(scope.row.bargainDate) }}
                </template>
            </el-table-column>
            <el-table-column label="交易金额" width="150">
                <template slot-scope="scope">
                    <div :class="{red: isExpenses(scope.row) === 0,green: isExpenses(scope.row) === 1,yellow: isExpenses(scope.row) === 2 || isExpenses(scope.row) === 3}">
                        ￥ {{ isExpenses(scope.row) == 0 || isExpenses(scope.row) == 2 ? '-' + scope.row.amount : scope.row.amount }}
                    </div>
                    </template>
            </el-table-column>
            <el-table-column prop="comment" label="备注" width="200"> </el-table-column>
            <el-table-column label="操作"
                ><template slot-scope="scope">
                    <el-button size="mini"  :disabled="scope.row.bargainType === 'transfer'" icon="el-icon-edit" @click="showEditPanel(scope.row.logDate)">编辑</el-button>
                    <el-button size="mini" @click="deleteLog(scope.row.logDate)" icon="el-icon-delete" type="danger">删除</el-button>
                </template></el-table-column
            >
        </el-table>
        <!-- 编辑对话框 -->
        <el-dialog :title="filter(form.bargainType, 'bargain')" v-if="dialogVisible" :visible.sync="dialogVisible">
            <el-form ref="form" :model="form" label-width="100px">
            <el-divider content-position="left" v-if="form.bargain === 'transfer'">从</el-divider>
            <el-form-item label="账本">
                <el-radio v-model="form.accountId" v-for="i in baseConfig.account" :key="i.label" :label="i.id" border>{{
                    i.label
                }}</el-radio>
            </el-form-item>
            <el-form-item label="存储介质">
                    <el-select v-model="form.storageId" placeholder="请选择">
                        <el-option
                        v-for="i in baseConfig.storage"
                        :key="i.label"
                        :label="i.label"
                        :value="i.id">
                        </el-option>
                    </el-select>
            </el-form-item>
            <el-form-item label="分类" v-if="form.bargain !== 'transfer'">
                <el-radio-group v-model="type">
                    <template v-if="form.bargainType === 'expenses'">
                        <el-radio-button v-for="i in baseConfig.expensesType" :key="i.label" :label="i.id">{{
                        i.label
                    }}</el-radio-button>
                    </template>
                    <template v-if="form.bargainType === 'receipts'">
                    <el-radio-button v-for="i in baseConfig.receiptsType" :key="i.label" :label="i.id">{{
                        i.label
                    }}</el-radio-button>
                    </template>
            </el-form-item>
            <el-form-item label="子分类" v-if="subTypes.length!== 0 && form.bargainType === 'expenses'">
                <el-radio-group v-model="form.subType">
                    <el-radio-button v-for="i in subTypes" :key="i" :label="i">{{ i }}</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="交易日期" v-if="form.bargain !== 'transfer'">
                <el-date-picker
                    v-model="form.bargainDate"
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
            <el-form-item label="账户类型" v-if="form.bargain === 'transfer'">
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
                    <el-radio-button v-for="i in config.storage" :key="i.label" :label="i.id">{{
                        i.label
                    }}</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="备注" v-if="form.bargain !== 'transfer'">
              <el-input v-model="form.comment" style="width: 300px"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="modifyLog">修改</el-button>
                <el-button @click="dialogVisible = false">取消</el-button>
            </el-form-item>
        </el-dialog>
    </div>
</template>

<script>
const Card = httpVueLoader('./Card.vue')

module.exports = {
    data() {
        return {
            tableData: [],
            height: 0,
            baseConfig: null,
            dialogVisible: false,
            form: {},
            type: '',
            subTypes: [],
            logCount: {}
        }
    },
    components: { Card },
    watch: {
        type(val) {
            if (val !== this.form.type) {
                this.form.subType = ''
            }
            if (this.form.bargainType === 'expenses') {
                this.baseConfig.expensesType.some((v, i) => {
                    if (v.id === val) {
                        this.subTypes = v.subType
                        return true
                    }
                })
            }
        }
    },
    async beforeCreate() {
        let res = await fetch('/api/baseconfig')
        let data = await res.json()
        this.baseConfig = data
    },
    created() {
        this.getData()
    },
    methods: {
        getDay(date) {
            let dateObj = new Date(date)
            let dayArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
            // 日期后面加周几
            // return date + ' ' + dayArr[dateObj.getDay()]
            return date
        },
        isExpenses(rowData) {
            // 0 收入
            // 1 支出
            // 2 转移转出
            // 3 转移转入
            let code = false
            if (rowData.bargainType === 'expenses') {
                code = 0
            } else if (rowData.bargainType === 'receipts') {
                code = 1
            } else if (rowData.subType === '转出') {
                code = 2
            } else if (rowData.subType === '转入') {
                code = 3
            }
            return code
        },
        async getData() {
            let res = await fetch('/api/alllogs')
            let data = await res.json()
            this.tableData = data.arr.reverse()
            this.height = data.arr.length * 50 + 50

            // compute log count
            let obj = {
                expenses: 0,
                receipts: 0
            }
            this.tableData.forEach((v, i) => {
                if(v.bargainType === 'expenses'){
                    obj.expenses++
                }else if(v.bargainType === 'receipts'){
                    obj.receipts++
                }
            })
            obj.all = obj.expenses + obj.receipts
            this.logCount = obj
        },
        filter(v, configProp, resProp) {
            resProp = resProp || 'label'
            let res = ''
            this.baseConfig[configProp].some((val, i) => {
                if (val.id === v) {
                    res = val[resProp]
                    return true
                }
            })
            return res
        },
        async deleteLog(id) {
            console.log(id)
            let res = await fetch(`/api/deleteLog/${id}`, {
                method: 'DELETE'
            })
            let data = await res.json()
            console.log(data)

            this.$message.warning(data.msg)
            this.getData()
        },
        showEditPanel(id) {
            let obj = this.tableData.find((v, i) => {
                return v.logDate === id
            })
            this.form = obj
            this.type = obj.type
            this.dialogVisible = true
        },
        async modifyLog() {
            if (this.type === '') return this.$message.error('请选择分类')
            if (this.form.subType === '' && this.form.bargainType === 'expenses')
                return this.$message.error('请选择子分类')
            if (this.form.date === '') return this.$message.error('请选择日期')
            if (this.form.amount === '') return this.$message.error('请输入金额')
            this.form.amount = +this.form.amount
            this.form.type = +this.type
            let res = await fetch(`/api/modifylog`, {
                method: 'POST',
                body: JSON.stringify(this.form),
                headers: {
                    'content-type': 'application/json'
                }
            })
            let data = await res.json()
            if (data.success) {
                this.$message.warning(data.msg)
            }
            this.getData()
            this.dialogVisible = false
        }
    }
}
</script>

<style scoped>
.el-table td {
    padding: 5px 0;
}

.green {
    color: #67c23a;
}

.red {
    color: #f56c6c;
}

.yellow {
    color: #e6a23c;
}

.info {
    margin-bottom: 20px;
    padding-left: 10px;
    font-size: 14px;
}
</style>