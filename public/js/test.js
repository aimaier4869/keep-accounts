let a = {
    storage: [
        {
            id: 0,
            label: '微信余额',
            class: 'weixin'
        },
        {
            id: 1,
            label: '微信零钱通',
            class: 'weixin'
        },
        {
            id: 2,
            label: '支付宝',
            class: 'zhifubao'
        },
        {
            id: 3,
            label: '支付宝余额',
            class: 'zhifubao'
        },
        {
            id: 4,
            label: '支付宝理财通',
            class: 'zhifubao'
        },
        {
            id: 5,
            label: '农行7475',
            class: 'nongyeyinhang'
        },
        {
            id: 6,
            label: '工商9240',
            class: 'gongshangyinhang'
        },
        {
            id: 7,
            label: '工商9907',
            class: 'gongshangyinhang'
        },
        {
            id: 8,
            label: '中国银行8668',
            class: 'zhongguoyinhang'
        },
        {
            id: 9,
            label: '校园卡',
            class: 'xiaoyuanka'
        },
        {
            id: 10,
            label: '现金',
            class: 'xianjin'
        },
    ],
    account: [
        {
            id: 0,
            label: '个人账户',
        },
        {
            id: 1,
            label: '私有账户',
        },
    ],
    accountAndStorage: [
        // {
        //     storageId: 0,
        //     accountId: 0,
        //     amount: 1000
        // }
    ],
    bargain: [
        { id: 'expenses', label: '支出' }, { id: 'receipts', label: '收入' }
    ],
    expensesType: [
        {
            id: 0,
            label: '餐饮',
            subType: ['早饭', '午饭', '晚饭']
        },
        {
            id: 1,
            label: '购物',
            subType: ['网购', '实体店购买物品', '购买虚拟产品']
        },
        {
            id: 2,
            label: '充话费',
            subType: ['198', '159']
        },
        {
            id: 3,
            label: '理发',
            subType: ['理发']
        },
        {
            id: 4,
            label: '其他',
            subType: ['其他']
        }
    ],
    receiptsType: [
        {
            id: 0,
            label: '生活费'
        },
        {
            id: 1,
            label: '兼职收入'
        },
        {
            id: 2,
            label: '其他'
        }
    ]
}

let b = [
    {
        bargainDate: '2021-08-12',
        logDate: '2021-08-12',
        storageId: 0,
        accountId: 0,
        bargainType: 'expenses',
        amount: 20,
        type: '餐饮',
        subType: '早饭',
        comment: ''
    }
]