<template>
    <div class="card">
        <div class="label">{{ label }}</div>
        <div class="amount">￥ {{ amount || '0' }}</div>
        <template v-if="tags">
            <div class="info" v-for="i in tags" :key="i.tag + i.tagAmount">
                <div class="tag">{{i.tag}}</div>
                <div class="tagAmount">{{i.tagAmount}}</div>
            </div>
        </template>
    </div>
</template>

<script>
module.exports = {
    props: ['label', 'amount', 'tags'],
    name: 'Card'
}
</script>

<style scoped>
.card {
    min-width: 300px;
    background: #eee url('../img/现金.svg') 220px -20px/80px 80px no-repeat;
    border: 3px solid transparent;
    border-radius: 20px;
    font-size: 20px;
    display: inline-block;
    margin-right: 10px;
    margin-bottom: 20px;
    padding-bottom: 10px;
}

.label {
    margin-top: 15px;
    padding-left: 10px;
    padding-right: 10px;
}

.amount {
    margin-top: 15px;
    margin-bottom: 15px;
    padding-left: 20px;
}

.card.weixin {
    background: #2aae67 url('../img/微信.svg') 220px -20px/100px 100px no-repeat;
    color: #e8f6ef;
}

.card.zhifubao {
    background: #1677ff url('../img/支付宝.svg') 220px -20px/100px 100px no-repeat;
    color: #fff;
}

.card.nongyeyinhang {
    background: #009c96 url('../img/中国农业银行.svg') 230px -20px/90px 90px no-repeat;
    color: #fff;
}

.card.gongshangyinhang {
    background: #e50012 url('../img/工商银行.svg') 230px -20px/90px 90px no-repeat;
    color: #fff;
}

.card.zhongguoyinhang {
    background: #b81c22 url('../img/中国银行.svg') 230px -20px/90px 90px no-repeat;
    color: #fff;
}

.card.xiaoyuanka {
    background: #409eff url('../img/校园卡.svg') 220px -20px/90px 90px no-repeat;
    color: #fff;
}

.card.small {
    min-width: 150px;
    height: 40px;
    border-radius: 5px;
    background-position: -20px -10px;
    background-size: 40px 40px;
}

.card.small .amount {
    display: none;
}

.card.small .label {
    margin-top: 5px;
    padding-left: 30px;
    padding-right: 30px;
}

.card.mini {
    min-width: 100px;
    height: 32px;
    border-radius: 5px;
    background-position: -20px -10px;
    background-size: 35px 35px;
    font-size: 14px;
    line-height: 28px;
}

.card.mini .amount {
    display: none;
}

.card.mini .label {
    margin-top: 0px;
    padding-left: 20px;
    padding-right: 10px;
}

.card .info {
    display: flex;
    font-size: 14px;
    margin-top: 10px;
    padding: 0 20px;
}

.card.small .info {
    display: none;
}

.card .info .tag {
    background: #fdf6ec;
    color: #e6a23c;
    padding: 3px;
    border-radius: 3px;
    margin-right: 3px;
}

.card .info .tagAmount {
    padding: 3px;
}
</style>