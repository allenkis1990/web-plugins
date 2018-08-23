## 说明

## 弹窗题插件

## 使用方式

`requirejs `

````javascript
require(['question'], function(Question) {
    var popQuestion = new Question({
        ...
    })


    setInterval(function() {
        // 调用
        popQuestion.apply(time)
    })
})
````

## 参数说明 options

````
{
    /**
     * 拦截模式|0/1，知识点弹题/随机题
     */
    mode: Number,
    /**
     * 当mode为0时，该值为题目列表
     */
    questions: [],

    // 触发形式|0/1/2，固定时间点/固定百分比间隔/固定时间间隔
    triggerForm: Number,

    // 触发形式值|在TriggerForm值不为0时，该值必填
    triggerValue: Number,
    // 播放内容总时长
    duration: Number,
    // 是否保存答题记录
    isStoreRecord: Boolean,
    // 宽度
    width: string,
    // 高度
    height: string,
    // 考试服务地址， 获取弹题数据
    examServiceUrl: '',
    objectIdList: Array,
    // java上下文
    context: Object,

    canClose: boolean,
    // 不管答对答错， 多久退出弹窗
    timeClose: Number
}
````


