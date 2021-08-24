<template>
    <div>
        <el-page-header @back="$router.push('/home')" title="回到首页" content="基本设置"></el-page-header>
        <el-card class="box-card padding0" shadow="never">
            <div slot="header" class="clearfix"><span>交易类型</span></div>
            <Card
                :label="item.label"
                @click.native="edit('bargain', item.id)"
                class="small"
                v-for="item in config.bargain"
                :key="item.label"
            ></Card>
        </el-card>
        <el-card class="box-card padding0" shadow="never">
            <div slot="header" class="clearfix">
                <span>存储介质</span>
                <el-button style="margin-left: 10px" @click="add('storage')" size="mini" icon="el-icon-plus"
                    >添加</el-button
                >
                <el-button style="margin-left: 10px" @click="fDelete('storage')" size="mini" icon="el-icon-sort"
                    >调换顺序</el-button
                >
            </div>
            <Card
                :label="item.label"
                class="small"
                :class="item.class"
                @click.native="edit('storage', item.id)"
                v-for="item in config.storage"
                :key="item.label"
            ></Card>
        </el-card>
        <el-card class="box-card padding0" shadow="never">
            <div slot="header" class="clearfix">
                <span>账本</span>
                <el-button style="margin-left: 10px" @click="add('account')" size="mini" icon="el-icon-plus"
                    >添加</el-button
                >
                <el-button style="margin-left: 10px" @click="fDelete('account')" size="mini" icon="el-icon-sort"
                    >调换顺序</el-button
                >
            </div>
            <Card
                @click.native="edit('account', item.id)"
                :label="item.label"
                class="small"
                v-for="item in config.account"
                :key="item.label"
            ></Card>
        </el-card>
        <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
                <span>支出类型</span>
                <el-button style="margin-left: 10px" @click="add('expensesType')" size="mini" icon="el-icon-plus"
                    >添加</el-button
                >
                <el-button style="margin-left: 10px" @click="fDelete('expensesType')" size="mini" icon="el-icon-sort"
                    >调换顺序</el-button
                >
            </div>
            <div style="margin-bottom: 5px" v-for="item in config.expensesType" :key="item.label">
                <el-tag @click="edit('expensesType', item.id)">{{ item.label }}</el-tag>
                <el-tag type="info" effect="plain" v-for="val in item.subType" :key="val">{{ val }}</el-tag>
            </div>
        </el-card>
        <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
                <span>收入类型</span>
                <el-button style="margin-left: 10px" @click="add('receiptsType')" size="mini" icon="el-icon-plus"
                    >添加</el-button
                >
                <el-button style="margin-left: 10px" @click="fDelete('receiptsType')" size="mini" icon="el-icon-sort"
                    >调换顺序</el-button
                >
            </div>
            <el-tag @click="edit('receiptsType', item.id)" v-for="item in config.receiptsType" :key="item.label">{{
                item.label
            }}</el-tag>
        </el-card>
        <el-dialog title="修改交易类型" :visible.sync="showDialogBargain">
            <el-form label-width="150px">
                <el-form-item label="类型id">
                    <el-input v-model="dialogBargain.id" disabled style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="类型名称">
                    <el-input v-model="dialogBargain.label" style="width: 200px"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showDialogBargain = false">取 消</el-button>
                <el-button @click="editSubmit('bargain')" type="primary">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改存储介质" :visible.sync="showDialogStorage">
            <el-form label-width="150px">
                <el-form-item label="id">
                    <el-input v-model="dialogStorage.id" disabled style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="名称">
                    <el-input v-model="dialogStorage.label" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="类别">
                    <el-select v-model="dialogStorage.class" placeholder="请选择">
                        <el-option label="微信" value="weixin"></el-option>
                        <el-option label="校园卡" value="xiaoyuanka"></el-option>
                        <el-option label="支付宝" value="zhifubao"></el-option>
                        <el-option label="农业银行储蓄卡" value="nongyeyinhang"></el-option>
                        <el-option label="工商银行储蓄卡" value="gongshangyinhang"></el-option>
                        <el-option label="中国银行储蓄卡" value="zhongguoyinhang"></el-option>
                        <el-option label="现金" value="xianjin"></el-option>
                        <el-option label="QQ" value="qq"></el-option>
                        <el-option label="其他" value="qita"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showDialogStorage = false">取 消</el-button>
                <el-button @click="editSubmit('storage')" type="primary">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改账本" :visible.sync="showDialogAccount">
            <el-form label-width="150px">
                <el-form-item label="账本id">
                    <el-input v-model="dialogAccount.id" disabled style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="账本名称">
                    <el-input v-model="dialogAccount.label" style="width: 200px"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showDialogAccount = false">取 消</el-button>
                <el-button @click="editSubmit('account')" type="primary">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改支出类型" :visible.sync="showDialogExpensesType">
            <el-form label-width="150px">
                <el-form-item label="支出类型id">
                    <el-input v-model="dialogExpensesType.id" disabled style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="支出类型名称">
                    <el-input v-model="dialogExpensesType.label" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="子类型">
                    <el-tooltip content="以英文逗号(,)分割" placement="top" effect="light">
                        <el-input v-model="dialogExpensesType.subType" style="width: 500px"></el-input>
                    </el-tooltip>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showDialogExpensesType = false">取 消</el-button>
                <el-button @click="editSubmit('expensesType')" type="primary">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改收入类型" :visible.sync="showDialogReceiptsType">
            <el-form label-width="150px">
                <el-form-item label="收入类型id">
                    <el-input v-model="dialogReceiptsType.id" disabled style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="收入类型名称">
                    <el-input v-model="dialogReceiptsType.label" style="width: 200px"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showDialogReceiptsType = false">取 消</el-button>
                <el-button @click="editSubmit('receiptsType')" type="primary">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改收入类型" :visible.sync="showDialogDelete">
            <div class="list-item" v-for="(item, i) in dialogDelete" :key="'delete' + item.label">
                <div class="text">{{ item.label }}</div>
                <div class="btns">
                    <el-button size="mini" @click="deleteSubmit(i, i - 1)" icon="el-icon-top" :disabled="i === 0">上移</el-button>
                    <el-button size="mini" @click="deleteSubmit(i, i + 1)" icon="el-icon-bottom" :disabled="i === dialogDelete.length - 1"
                        >下移</el-button
                    >
                    <el-button size="mini" type="danger" icon="el-icon-delete" :disabled="dialogDelete.length <=1 " @click="deleteSubmit(i)" plain>删除</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
const Card = httpVueLoader('./Card.vue')

module.exports = {
    data() {
        return {
            config: {},
            showDialogBargain: false,
            dialogBargain: {},
            showDialogStorage: false,
            dialogStorage: {},
            showDialogAccount: false,
            dialogAccount: {},
            showDialogExpensesType: false,
            dialogExpensesType: {},
            showDialogReceiptsType: false,
            dialogReceiptsType: {},
            editType: {},
            showDialogDelete: false,
            dialogDelete: []
        }
    },
    components: {
        Card
    },
    created() {
        this.getData()
    },
    methods: {
        async getData() {
            let res = await fetch('/api/baseconfig')
            let data = await res.json()
            this.config = data
        },
        edit(type, id) {
            let dialog = this.firstToUpper(type)
            let obj = this.config[type].find((v) => {
                return v.id === id
            })
            let newObj = { ...obj }
            newObj.edit = 'edit'
            if (type === 'expensesType') {
                newObj.subType = newObj.subType.join(',')
            }
            this['dialog' + dialog] = newObj
            this['showDialog' + dialog] = true
        },
        add(type) {
            let dialog = this.firstToUpper(type)
            let arr = []
            this.config[type].forEach((v) => {
                arr.push(v.id)
            })
            arr.sort((a, b) => {
                return a - b
            })
            let newId = null
            let index = 0
            while (!newId && newId !== 0) {
                if (arr[index] !== index) newId = index
                index++
            }

            let obj = { ...this.config[type][0] }
            obj.id = newId
            obj.label = '新增项'
            obj.edit = 'add'
            if (type === 'storage') obj.class = 'qita'
            if (type === 'expensesType') obj.subType = '例1,例2'
            this['dialog' + dialog] = obj
            this['showDialog' + dialog] = true
        },
        fDelete(type) {
            let arr = []
            this.config[type].forEach((v) => {
                let obj = {}
                obj.label = v.label
                obj.id = v.id
                obj.type = type
                arr.push(obj)
            })
            this.dialogDelete = arr
            this.showDialogDelete = true
        },
        async deleteSubmit(index1, index2) {
            let data = null
            if (!index2 && index2 !== 0) {
                let res = await fetch('/api/baseconfig/item', {
                    method: 'DELETE',
                    body: JSON.stringify(this.dialogDelete[index1]),
                    headers: {
                        'content-type': 'application/json'
                    }
                })
                data = await res.json()
            }else {
                let res = await fetch('/api/baseconfig/exchange', {
                    method: 'POST',
                    body: JSON.stringify({index1, index2, type: this.dialogDelete[index1].type}),
                    headers: {
                        'content-type': 'application/json'
                    }
                })
                data = await res.json()
            }

            if (data.success) {
                this.$message.success(data.msg)
                await this.getData()
                this.fDelete(this.dialogDelete[index1].type)
            } else {
                this.$message.error(data.msg)
            }
        },
        firstToUpper(str) {
            return str.trim().replace(str[0], str[0].toUpperCase())
        },
        async editSubmit(type) {
            let dialog = this.firstToUpper(type)
            let obj = { ...this['dialog' + dialog] }
            obj.type = type
            if (type === 'expensesType') {
                obj.subType = obj.subType.split(',')
            }

            let res = await fetch(`/api/baseconfig/${obj.edit}`, {
                method: 'POST',
                body: JSON.stringify(obj),
                headers: {
                    'content-type': 'application/json'
                }
            })
            let data = await res.json()
            if (data.success) {
                this.$message.success(data.msg)
                this['showDialog' + dialog] = false
                this.getData()
            } else {
                this.$message.error(data.msg)
            }
        }
    }
}
</script>

<style scoped>
.padding0 .el-card__body {
    padding-bottom: 0px;
}

.box-card:last-of-type {
    margin-bottom: 100px;
}

.card,
.el-tag--light {
    cursor: pointer;
}

.list-item {
    display: flex;
    margin-bottom: 10px;
}

.list-item .text {
    flex: 2;
    line-height: 28px;
    font-size: 16px;
    padding-left: 30px;
}
.list-item .btns {
    flex: 1;
}
</style>