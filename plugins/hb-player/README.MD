# 记录处理800li库出现的问题以及解决的方案

> 800li player.js 引用产商提供的js的时候在ie8下面出现状况

状况描述: 代码中对数组元素的遍历使用 in 的方式，在ie8下面in会将prototype的方法给枚举出来，导致系统代码报错

解决方案：更改源码，将for(var f in arra) 改成 for(var i = 0; i < arra.length; i ++) {} 的方式。

> 提供给800li的容器id不能使用 /x/x/ 的方式 会导致系统bug

> 兼容ie8需要做的事情

引入

```
        // 26k
        <script src="/node_modules/es5-shim/es5-shim.min.js"></script>
        // 6k
        <script src="/node_modules/es5-shim/es5-sham.min.js"></script>
        //  78k
        <script src="/node_modules/bluebird/js/browser/bluebird.min.js"></script>

        总110k
```


