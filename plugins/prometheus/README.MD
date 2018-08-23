# 普罗米修斯
[TOC]

## Version

`1.0.2`

## Supports

> IE 8

## 修复

1. tab在处理三级导航的时候导航异常
2. uploader.js 在处理上传文件的时候，获取上传参数的时机调整

`1.0.3`

> 修复在特殊情况下的ui-view没有监控到初始化的时候的stateChangeSuccess导致视图无法正确渲染到对应的位置
> 修复在该完后无法正确关闭全部tab
> $rootScope.uploadConfigOptions 设置好上传选项后便可以正确上传文件

`1.0.4`

> 将上传组件的bower_components引用地址开启到根路径

`1.0.5`

> 添加不符合提供的文件类型的文件，导致后续的文件无法添加到队列中


`1.0.6`

> upload-image 指令自定义accept导致覆盖了参数的accpet对象为字符串，引起判断文件类型的时候报错
   将参数accpet修改成accept-file-type

`1.0.7`

> upload-image 指令增加文件限制

`1.0.71`

> 文件类型限制的一些bug修复

`1.0.9`

> 对hb-tab文件的修改， 将menuTemplateUrl,和tabTemplateUrl灵活配置

`1.0.91`

> upload-head新增参数

```
    scope: {
        aspectRatio: '=?',              比例： 默认9/9
        mouseWheelZoom: '=?',           是否可以用滚轮缩放控件 默认false
        autoCropArea: '=?',             初始区域大小 默认 0.65
        previewSelector: '=?'           预览选择器  默认 .preview
    }
```