### 课程播放页面功能块

> 允许播放条件

1. 课件播放模式为可试听
`在试听模式下面（即：#/listen/xx路由中），单媒体的mode为1，则这个媒体可以支持试听，试听时间限制listenTime内可试听。不可拖拽到listenTime之外`
2. 课件播放模式为不可试听
`在试听模式下面（即：#/listen/xx路由中），单媒体的mode为2，则这个媒体不能在这个页面中播放。`
3. 课件播放模式为购买播放

#### 弹窗题
#### 弹窗拍照
#### 课程第一次学完跳转到测验练习页面


__ 没有trainClassId 传trainClass
__ 没有courseWareId 传courseware

1. 预览课件

`/preview/:courseWareId`

2. 预览课程

`/previewLesson/:trainClassId/:courseId/:courseWareId`

3. 试听课程

`/listen/:trainClassId/:courseId/:courseWareId`

4. 学习课程

`/learn/:trainClassId/:courseId/:courseWareId?exts={}&unitName`

> exts 对象字符串 ，服务端解析

> unitName


# 提供服务弹窗 `common.TinyDialog`

.alert(options)

.confirm(options)

> `options` 参数

1. width
2. height
3. content
4. yesText
5. noopText
6. yes `function`
7. noop `function`


## 升级指东

1. 增加bower_compnents 组件包

hb-lesson-play-platform
hb-player
hb-plugin-pop-question
bluebird

2. 定位 `tasks/player-app.js`

将：

````javascript
module.exports = function (req, res, next) {
    if (/^\/play/.test(req.url)) {
        var realPath = req.originalUrl;
        if (!fs.existsSync('./app/' + realPath.split('?')[0])) {
            req.url = req.url.replace(/^\/play\//, '');
            var stream = send(req, req.url.split('?')[0], {
                root: './bower_components/lesson-platform/dist'
            });
            stream.pipe(res);
        } else {
            next();
        }
    } else {
        next();
    }
};
````

改成：

````javascript
module.exports = function (req, res, next) {
    if (req.originalUrl === '/play/') {
        req.originalUrl = '/play/index.html'
        req.url = '/play/index.html'
    }
    if (/^\/play/.test(req.url)) {
        var realPath = req.originalUrl
        if (!fs.existsSync('./app/' + realPath.split('?')[0])) {
            req.url = req.url.replace(/^\/play\//, '')
            var stream = send(req, req.url.split('?')[0], {
                root: './bower_components/hb-lesson-play-platform/dist'
            })
            stream.pipe(res)
        } else {
            next()
        }
    } else {
        next()
    }
}
````

3. 定位 `tasks/player-app.js`

将 `lesson-platform` 全局替换成 `hb-lesson-play-platform`

4. 删除 `bower_components/` 下面的

* `lesson-platform`
* `d3`
* `player`
* `uplodify`

5. 定位 `tasks/bower-components.js`

line: 41

将：

````javascript
    return gulp.src(['./app/**/*main.config.js', './app/**/index.html'])
````

修改成
````javascript
    return gulp.src(['./app/**/*main.config.js', './app/**/index.html',
        './bower_components/hb-lesson-play-platform/dist/js/main.config.js',
        './bower_components/hb-lesson-play-platform/dist/index.html'])
````

末尾、新增任务

````
gulp.task('copyBlueBird', function () {
    return gulp.src(`./bower_components/bluebird/js/**/*.*`)

        .pipe(gulp.dest(`${env.buildPath}/bower_components/bluebird/js`))
})

gulp.task('bowerSolution', ['copySWF', 'copyBlueBird'], function () {

})

````

将 `copyBlueBird` 添加到 `bowerSolution` 任务队列中.


