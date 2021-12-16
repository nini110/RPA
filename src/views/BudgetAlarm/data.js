import { validPin, validPercent } from "@/validator/validator";

export default {
    alarmDataLeft: [{
            type: "select",
            model: "",
            prop: "user_name",
            label: "PIN:",
            placeholder: "请选择PIN",
            options: [],
            // rules: {
            //   required: true,
            //   validator: validPercent.bind(this, this.alarmDataLeft, 0, 0),
            //   trigger: "change",
            // },
            disabled: false,
        },
        {
            type: "input",
            model: "",
            prop: "password",
            label: "密码:",
            placeholder: "请输入密码",
            // rules: {
            //   required: true,
            //   validator: validPercent.bind(this, this, 0, 1),
            //   trigger: "blur",
            // },
            disabled: true,
        },
        {
            type: "select",
            model: "",
            prop: "product_line",
            label: "产品线:",
            placeholder: "请选择产品线",
            // rules: {
            //   required: true,
            //   validator: validPercent.bind(this, this, 0, 2),
            //   trigger: "change",
            // },
            options: [{
                    name: "京东快车",
                    code: "kuaiche",
                },
                {
                    name: "购物触点",
                    code: "touchPoint",
                },
            ],
            disabled: true,
        },
        {
            type: "input",
            model: "",
            prop: "plan_id",
            label: "推广计划:",
            // rules: {
            // 	required: true,
            // 	validator: validPercent.bind(this, this, 0, 3),
            // 	trigger: 'change'
            // },
            placeholder: "请输入推广计划",
            options: [{
                name: "example",
                code: "575097395",
            }, ],
            disabled: true,
        },
    ],
    alarmDataRight: [{
            txt: "触发条件",
            children: [{
                    type: "select",
                    model: "",
                    prop: "data",
                    label: "时间:",
                    placeholder: "请选择时间",
                    // rules: {
                    // 	required: true,
                    // 	validator: validPercent.bind(this, this, 1, 0),
                    // 	trigger: 'change'
                    // },
                    options: [],
                    disabled: true,
                },
                {
                    type: "select",
                    model: "",
                    prop: "zhibiaoTYpe",
                    label: "指标类型:",
                    placeholder: "请输入指标类型",
                    // rules: {
                    // 	required: true,
                    // 	validator: validPercent.bind(this, this, 1, 1),
                    // 	trigger: 'change'
                    // },
                    disabled: true,
                },
                {
                    type: "select",
                    model: "",
                    prop: "rule",
                    label: "规则:",
                    placeholder: "请选择规则",
                    // rules: {
                    // 	required: true,
                    // 	validator: validPercent.bind(this, this, 1, 2),
                    // 	trigger: 'change'
                    // },
                    options: [],
                    disabled: true,
                },
                {
                    type: "select",
                    model: "",
                    prop: "duibizhibiao",
                    label: "对比指标:",
                    placeholder: "请选择对比指标",
                    // rules: {
                    // 	required: true,
                    // 	validator: validPercent.bind(this, this, 1, 3),
                    // 	trigger: 'change'
                    // },
                    options: [],
                    disabled: true,
                },
                {
                    type: "input",
                    model: "",
                    prop: "target_percentage",
                    label: "阈值:",
                    placeholder: "请输入阈值(0-100的整数)",
                    // rules: {
                    //     required: true,
                    //     validator: validPercent.bind(this, this, 1, 4),
                    //     trigger: "blur",
                    // },
                    disabled: false,
                },
            ],
        },
        {
            txt: "执行操作",
            children: [{
                    type: "select",
                    model: "企业微信发送通知",
                    prop: "optionType",
                    label: "操作类型:",
                    placeholder: "请选择操作类型",
                    // rules: {
                    // 	required: true,
                    // 	validator: validPercent.bind(this, this, 2, 0),
                    // 	trigger: 'change'
                    // },
                    options: [{
                        name: "企业微信发送通知",
                        code: "企业微信发送通知",
                    }, ],
                    disabled: true,
                },
                {
                    type: "input",
                    model: "",
                    prop: "qywx_id",
                    label: "企业微信ID:",
                    placeholder: "请输入企业微信ID ( 以 | 分割 )",
                    // rules: {
                    //     required: true,
                    //     validator: validPercent.bind(this, this, 2, 1),
                    //     trigger: "blur",
                    // },
                    disabled: false,
                },
                {
                    type: "input",
                    model: "",
                    prop: "inform_times",
                    label: "预警通知次数:",
                    placeholder: "请输入预警通知次数",
                    // rules: {
                    //     required: true,
                    //     validator: validPercent.bind(this, this, 2, 2),
                    //     trigger: "blur",
                    // },
                    disabled: false,
                },
                // {
                // 	type: 'select',
                // 	model: '',
                // 	label: '调整类型',
                // 	placeholder: '请选择规则',
                // 	options: []
                // },
                // {
                // 	type: 'input',
                // 	model: '',
                // 	label: '数值',
                // 	placeholder: '请输入数值',
                // },

                // {
                // 	type: 'input',
                // 	model: '',
                // 	label: '单位',
                // 	placeholder: '请输入数值',
                // },
            ],
        },
    ],
}