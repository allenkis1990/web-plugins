define('stateConfig', ['modules/home/main'], function () {

    function isAdmin (userType) {
        return userType !== 1
    }

    var getMode = function () {
        return ['$stateParams', 'hasPermissionToPlay',
            function ($stateParams, hasPermissionToPlay) {
                return ({
                    learn: 3,
                    listen: 1,
                    previewLesson: 2
                })[$stateParams.playMode]
            }]
    }
    var undefined_ = function () {
        return arguments[1]
    }()
    var templateCode_ = {
        normal: 100,
        out_of_date: 101,
        out_of_play_time: 102,
        can_not_listen: 103,
        must_buy: 104
    }
    return function ($stateProvider) {
        $stateProvider.state('states', {
            url: '/{playMode: learn|listen|previewLesson}/:trainClassId/:lessonId?exts&unitName',
            abstract: true,
            resolve: {
                hasPermissionToPlay: ['$http', 'system_config', '$location', '$q', '$stateParams', '$interval',
                    function ($http, system_config, $location, $q, $stateParams, $interval) {
                        var defer = $q.defer()

                        // 如果是学习模式， 则判断各种是否能学习的条件
                        if ($stateParams.playMode !== 'listen') {
                            $http.get(system_config.loginInfoUrl, {params: {exts: $location.$$search.exts}})

                                .then(function (data) {
                                    var info = data.data.info
                                    // 如果是学习模式，并且登录了
                                    if (info.userId) {

                                        // 只有管理员才能预览
                                        if ($stateParams.playMode === 'previewLesson') {

                                            // 假装自己是管理员
                                            if (isAdmin(info.userType)) {
                                                defer.resolve({code: 1000})
                                            } else {
                                                defer.resolve({
                                                    // 不是管理员不能预览
                                                    code: 1001
                                                })
                                            }
                                        } else {
                                            // 管理员不能学习
                                            if (!isAdmin(info.userType)) {
                                                defer.resolve({code: 1000})
                                            } else {
                                                defer.resolve({
                                                    // 管理员不能学习
                                                    code: 1002
                                                })
                                            }
                                        }
                                    } else {
                                        defer.resolve({
                                            // 未登录不能学习
                                            code: 1003
                                        })
                                    }
                                })

                            window.lesson_page_communication_with_serverClient = $interval(function () {
                                $http.get(system_config.loginInfoUrl)
                                // 6分钟通信一次服务器
                            }, 300000)
                        } else {
                            // 消除通信
                            $interval.cancel(window.lesson_page_communication_with_serverClient)
                            defer.resolve({
                                code: 1000
                            })
                        }
                        return defer.promise
                    }],
                // 获取播放的模式
                mode: getMode(),

                // 获取课程信息
                lesson: ['$http', 'system_config', '$stateParams', 'mode', 'hasPermissionToPlay', '$q', '$rootScope',
                    function ($http, system_config, $stateParams, mode, hasPermissionToPlay, $q, $rootScope) {
                        var defer = $q.defer()
                        if (hasPermissionToPlay.code === 1000) {
                            $http.get(system_config.lessonUrl, {
                                params: {
                                    lessonId: $stateParams.lessonId,
                                    trainClassId: $stateParams.trainClassId,
                                    mode: mode,
                                    exts: $stateParams.exts
                                },
                                headers: {
                                    'Hb-Domain-Path': $stateParams.unitName
                                }
                            })
                                .then(function (data) {
                                    if (data.data.status) {
                                        defer.resolve(data.data.info)
                                    } else {
                                        hasPermissionToPlay.code = 1004
                                        $rootScope.errorInfo = {
                                            code: 500,
                                            message: data.data.info
                                        }
                                        defer.resolve()
                                    }
                                }, function () {
                                    hasPermissionToPlay.code = 1004
                                    $rootScope.errorInfo = {
                                        code: 500,
                                        message: '系统异常!'
                                    }
                                    defer.resolve()
                                })
                        } else {
                            defer.resolve()
                        }
                        return defer.promise
                    }]
            },
            views: {
                '': {
                    templateProvider: ['hasPermissionToPlay', '$http',
                        function (hasPermissionToPlay, $http) {
                            var url = 'views/root.html'
                            // 没权限去学习的需要提示用户登录后才能学习
                            switch (hasPermissionToPlay.code) {
                                case 1001:
                                    url = 'views/common/errors/student-cannot-preview.html'
                                    break
                                case 1002:
                                    url = 'views/common/errors/admin-cannot-learn.html'
                                    break
                                case 1003:
                                    url = 'views/common/errors/401.html'
                                    break
                                case 1004:
                                    url = 'views/common/errors/has-no-course500.html'
                                    break
                            }
                            return $http.get(url)
                                .then(function (data) {
                                    return data.data
                                })
                        }],
                    controllerProvider: ['hasPermissionToPlay', function (hasPermissionToPlay) {
                        if (hasPermissionToPlay.code === 1000) {
                            return 'app.home.rootCtrl'
                        }
                        return [function () {

                        }]
                    }]
                }
            }
        })
            .state('states.home', {
                url: '/:courseWareId',
                resolve: {
                    currentPlayInfo: ['lesson', '$stateParams', '$rootScope', 'hasPermissionToPlay', '$q',
                        function (lesson, $stateParams, $rootScope, hasPermissionToPlay, $q) {
                            var defer = $q.defer()
                            if (hasPermissionToPlay.code === 1000) {
                                // 说明没有传courseWareId
                                try {
                                    var courseWareId
                                    var findOut = {
                                        hasNext: true,
                                        hasPrev: true
                                    }

                                    if ($stateParams.courseWareId === 'courseware') {
                                        // 如果最后一次播放信息中没有课件id，则获取第一个章节第一个课件播放
                                        if (lesson.lastPlayInfo) {
                                            courseWareId = lesson.lastPlayInfo.courseWareId
                                        }
                                    } else {
                                        courseWareId = $stateParams.courseWareId
                                    }

                                    var chapterList = lesson.lesson.chapterList
                                    var len = chapterList.length
                                    var setDefaultFindOut = function () {
                                        findOut.chapter = chapterList[0]
                                        findOut.chapter.index = 0
                                        findOut.courseWare = findOut.chapter.courseWareList[0]
                                        findOut.courseWare.index = 0
                                        findOut.media = findOut.courseWare.mediaList[0]
                                        findOut.media.index = 0
                                    }
                                    if (!courseWareId) {
                                        setDefaultFindOut()
                                    } else {
                                        outter:
                                            for (var i = 0; i < len; i++) {
                                                var chapter = chapterList[i]
                                                var courseWareList = chapter.courseWareList
                                                var courseWareLen = courseWareList.length
                                                innter:
                                                    for (var j = 0; j < courseWareLen; j++) {
                                                        var courseWare = courseWareList[j]
                                                        if (courseWareId === courseWare.id) {
                                                            findOut.chapter = chapter
                                                            findOut.chapter.index = i
                                                            findOut.courseWare = courseWare
                                                            findOut.courseWare.index = j
                                                            findOut.media = courseWare.mediaList[0]
                                                            findOut.media.index = 0
                                                            break innter
                                                        }
                                                    }
                                                if (findOut.courseWare) {
                                                    break outter
                                                }
                                            }
                                    }
                                } catch (e) {
                                    console.log(e)
                                }
                                if (!findOut.courseWare) {
                                    setDefaultFindOut()
                                }

                                // 如果章节的索引等于章节数则判断当前课件的索引
                                if (findOut.chapter.index === chapterList.length - 1) {
                                    if (findOut.courseWare.index === findOut.chapter.courseWareList.length - 1) {
                                        findOut.hasNext = false
                                    }
                                }

                                // 如果章节的索引等于章节数则判断当前课件的索引
                                if (findOut.chapter.index === 0) {
                                    if (findOut.courseWare.index === 0) {
                                        findOut.hasPrev = false
                                    }
                                }

                                document.title = '《' + findOut.courseWare.name + ' 》 正在播放'
                                $rootScope.currentPlayInfo = findOut
                                defer.resolve(findOut)
                            } else {
                                defer.resolve()
                            }
                            return defer.promise
                        }],
                    // 获取播放参数
                    playParams: ['$http', 'system_config', 'mode', '$stateParams', 'currentPlayInfo', '$rootScope',
                        function ($http, system_config, mode, $stateParams, currentPlayInfo, $rootScope) {
                            if (!currentPlayInfo) {
                                return
                            }
                            return $http.get(system_config.playParamsUrl, {
                                params: {
                                    lessonId: $stateParams.lessonId,
                                    exts: $stateParams.exts,
                                    courseWareId: currentPlayInfo.courseWare.id,
                                    mediaId: currentPlayInfo.media.id,
                                    trainClassId: $stateParams.trainClassId,
                                    mode: mode
                                    // type: 1
                                },
                                headers: {
                                    'Hb-Domain-Path': $stateParams.unitName
                                }
                            })
                                .then(function (data) {
                                    var info = data.data.info
                                    var keys = []
                                    for (var theKey in info.resources) {
                                        var item = info.resources[theKey]
                                        if (item && item.resource && item.streamHost) {
                                            keys.push(theKey)
                                        }
                                    }
                                    $rootScope.hasMultiResource = keys.length > 1
                                    system_config.playParams = info
                                    return info
                                })
                        }],
                    templateCode: ['playParams', 'currentPlayInfo', '$q', '$stateParams',
                        function (playParams, currentPlayInfo, $q, $stateParams) {
                            var defer = $q.defer()
                            if (!playParams) {
                                defer.resolve(1000)
                            } else {
                                var media = currentPlayInfo.media
                                var code = templateCode_.normal

                                if ($stateParams.playMode === 'learn') {
                                    // 如果已经播放时间大于等于媒体播放时间乘以允许播放次数---》 不允许播放
                                    if (media.allowPlayTimes && media.alreadyPlayTime >= media.time * media.allowPlayTimes) {
                                        code = templateCode_.out_of_play_time
                                    }
                                } else {
                                    media.allowPlayTimes = undefined_
                                    code = templateCode_.normal
                                }
                                defer.resolve(code)
                            }

                            return defer.promise
                        }]
                },
                views: {
                    'playerBox': {
                        templateProvider: ['playParams', '$http', '$stateParams', 'templateCode', 'currentPlayInfo', 'CONSTANT', '$q', '$rootScope', 'hasPermissionToPlay',
                            function (playParams, $http, $stateParams, templateCode, currentPlayInfo, CONSTANT, $q, $rootScope, hasPermissionToPlay) {
                                var templateUrl = ''
                                var defer = $q.defer()
                                if (!currentPlayInfo) {
                                    templateUrl = 'views/common/errors/noop.html'
                                } else {

                                    var currentMedia = currentPlayInfo.media

                                    $rootScope.rootClass = undefined_
                                    switch (templateCode) {
                                        case templateCode_.normal:

                                            // 如果是学习模式
                                            if ($stateParams.playMode === 'learn') {

                                                /// 不需要购买
                                                if (currentMedia.mode === CONSTANT.mode.play) {
                                                    end()
                                                } else {
                                                    if (currentMedia.mode === CONSTANT.mode.buyPlay && !currentMedia.isBuy) {
                                                        templateUrl = 'views/common/must-buy-tpl.html'
                                                    } else {
                                                        end()
                                                    }
                                                }
                                            } else {
                                                // 支持试听
                                                if (currentMedia.mode === CONSTANT.mode.listen) {
                                                    end()
                                                } else {
                                                    if (currentMedia.mode === CONSTANT.mode.play) {
                                                        templateUrl = 'views/common/can-not-listen-tpl.html'
                                                    } else {
                                                        if (hasPermissionToPlay.code === 1000) {
                                                            if (currentMedia.mode === CONSTANT.mode.buyPlay && currentMedia.isBuy) {
                                                                end()
                                                            } else {
                                                                templateUrl = 'views/common/must-buy-tpl.html'
                                                            }
                                                        } else {
                                                            templateUrl = 'views/common/must-buy-tpl.html'
                                                        }
                                                    }
                                                }
                                            }
                                            break
                                        case templateCode_.out_of_date:
                                            // 该课程已经过期不能再播放
                                            templateUrl = 'views/common/out-of-date-tpl.html'
                                            break
                                        case templateCode_.out_of_play_time:
                                            // 该课程播放时长已经用完不能继续播放了
                                            templateUrl = 'views/common/out-of-play-time-tpl.html'
                                            break
                                    }

                                    function end () {
                                        if (CONSTANT.courseWareType.single === currentMedia.type) {
                                            templateUrl = 'views/learn/single.html'
                                        } else if (CONSTANT.courseWareType.pdf === currentMedia.type) {
                                            templateUrl = 'views/learn/doc.html'
                                        } else if (CONSTANT.courseWareType.three === currentMedia.type) {
                                            templateUrl = 'views/learn/three.html'
                                            $rootScope.rootClass = 'three-player'
                                        } else {
                                            defer.reject()
                                        }
                                    }
                                }
                                $http.get(templateUrl)

                                    .then(function (data) {
                                        defer.resolve(data.data)
                                    })
                                return defer.promise
                            }],
                        controllerProvider: ['$stateParams', 'currentPlayInfo', 'templateCode', 'CONSTANT', 'hasPermissionToPlay',
                            function ($stateParams, currentPlayInfo, templateCode, CONSTANT, hasPermissionToPlay) {
                                var controller
                                var emptyController = [function () {

                                }]
                                if (hasPermissionToPlay.code === 1000) {
                                    var currentMedia = currentPlayInfo.media
                                    if ($stateParams.playMode !== 'listen') {
                                        if ($stateParams.playMode === 'previewLesson') {
                                            controller = 'app.home.homeCtrl'
                                        } else {
                                            if ((
                                                    // 条件1 当当前媒体的模式是试听模式或者是播放不支持试听模式的时候并且当前获取到的模板code为普通类型
                                                (currentMedia.mode === CONSTANT.mode.listen || currentMedia.mode === CONSTANT.mode.play) && templateCode === templateCode_.normal)
                                                // 或者当前媒体的模式是必须要购买才能播放并且已经购买过了，并且code为普通类型， 则需要走业务逻辑控制器
                                                || (currentMedia.mode === CONSTANT.mode.buyPlay && currentMedia.isBuy && templateCode === templateCode_.normal)
                                            ) {
                                                controller = 'app.home.homeCtrl'
                                            } else {
                                                controller = emptyController
                                            }
                                        }
                                    } else {
                                        // 支持试听
                                        if (currentMedia.mode === CONSTANT.mode.listen) {
                                            controller = 'app.home.homeCtrl'
                                        } else {
                                            controller = emptyController
                                        }
                                    }
                                } else {
                                    controller = emptyController
                                }
                                return controller
                            }]
                    }
                }
            })
            .state('preview', {
                url: '/preview',
                resolve: {
                    hasPermissionToPlay: ['$http', 'system_config', '$location', '$q',
                        function ($http, system_config, $location, $q) {
                            var defer = $q.defer()

                            return $http.get(system_config.loginInfoUrl, {params: {exts: $location.$$search.exts}})

                                .then(function (data) {
                                    var info = data.data.info
                                    if (info.userId) {
                                        if (isAdmin(info.userType)) {
                                            defer.resolve({
                                                code: 1000
                                            })
                                        } else {
                                            // 不是管理员不能预览
                                            defer.resolve({
                                                code: 1001
                                            })
                                        }
                                    } else {
                                        defer.resolve({
                                            // 未登录不能学习
                                            code: 1003
                                        })
                                    }
                                    return defer.promise
                                })
                        }]
                },
                views: {
                    '': {
                        templateProvider: ['hasPermissionToPlay', '$http',
                            function (hasPermissionToPlay, $http) {
                                var url = 'views/preview-root.html'
                                // 没权限去学习的需要提示用户登录后才能学习
                                switch (hasPermissionToPlay.code) {
                                    case 1001:
                                        url = 'views/common/errors/courseware-student-cannot-preview.html'
                                        break
                                    case 1003:
                                        url = 'views/common/errors/preview401.html'
                                        break
                                }
                                return $http.get(url)
                                    .then(function (data) {
                                        return data.data
                                    })
                            }]
                    }
                }
            })
            .state('preview.play', {
                url: '/:courseWareId',
                onEnter: function () {
                    document.title = '预览课件'
                },
                resolve: {
                    playParams: ['$http', '$q', '$stateParams', '$timeout', '$rootScope', '$location', 'system_config',
                        function ($http, $q, $stateParams, $timeout, $rootScope, $location, system_config) {
                            var defer = $q.defer()
                            $rootScope.systemLoading = true
                            $http.get(system_config.playParamsUrl,
                                {
                                    params: {
                                        exts: $location.$$search.exts,
                                        lessonId: $stateParams.lessonId,
                                        courseWareId: $stateParams.courseWareId,
                                        trainClassId: $stateParams.trainClassId,
                                        mode: 2
                                    }
                                })
                                .then(function (data) {
                                    var info = data.data.info
                                    var keys = []
                                    for (var theKey in info.resources) {
                                        var item = info.resources[theKey]
                                        if (item && item.resource && item.streamHost) {
                                            keys.push(theKey)
                                        }
                                    }
                                    $rootScope.hasMultiResource = keys.length > 1

                                    $timeout(function () {
                                        defer.resolve(data.data.info)
                                        $rootScope.systemLoading = false
                                    }, 500)
                                })
                            return defer.promise
                        }]
                },
                views: {
                    '@preview': {
                        templateProvider: ['playParams', '$q', 'CONSTANT', '$http', '$rootScope',
                            function (playParams, $q, CONSTANT, $http, $rootScope) {
                                var defer = $q.defer()
                                var templateUrl
                                if (CONSTANT.courseWareType.single === playParams.type) {
                                    templateUrl = 'views/preview/single/index.html'
                                } else if (CONSTANT.courseWareType.pdf === playParams.type) {
                                    templateUrl = 'views/preview/pdf/index.html'
                                } else if (CONSTANT.courseWareType.three === playParams.type) {
                                    templateUrl = 'views/preview/three/index.html'
                                    $rootScope.rootClass = 'three-player'
                                } else {
                                    defer.reject()
                                }

                                $http.get(templateUrl).then(function (data) {
                                    defer.resolve(data.data)
                                })

                                return defer.promise
                            }],
                        controller: 'app.home.previewCtrl'
                    }
                }
            })
            .state('404', {
                url: '/404',
                views: {
                    '': {
                        templateUrl: 'views/common/errors/404.html'
                    }
                }
            })
    }
})

define([
    './common/stateMapper',
    'stateConfig',
    'angularUiRouter',
    'ocLazyLoad',
    'uiRouterExtras',
    'angularAnimate',
    './common/external',
    './common/common'
], function (stateMapper, stateConfig) {

    var app = angular.module('app', [
        'ui.router',
        'oc.lazyLoad',
        'app.external',
        'ct.ui.router.extras',
        'sys.common',
        'app.home.main',
        'ngAnimate'
    ])
        .config(['$provide', '$futureStateProvider', '$ocLazyLoadProvider', '$stateProvider', '$urlRouterProvider',
            function ($provide, $futureStateProvider, $ocLazyLoadProvider, $stateProvider, $urlRouterProvider) {

                $ocLazyLoadProvider.config({
                    debug: true,
                    jsLoader: requirejs,
                    events: true,
                    loadedModules: ['states'],
                    modules: stateMapper.modules
                })

                $provide.decorator('$ocLazyLoad', ['$delegate', '$q', function ($delegate, $q) {
                    $delegate.jsLoader = requirejs
                    $delegate.jsLoader.requirejs = true
                    return $delegate
                }])

                var ocLazyLoadStateFactory = ['$q', '$ocLazyLoad', 'futureState',
                    function ($q, $ocLazyLoad, futureState) {
                        var deferred = $q.defer()
                        $ocLazyLoad.load(futureState.module).then(function () {
                            deferred.resolve()
                        }, function () {
                            deferred.reject()
                        })
                        return deferred.promise
                    }]

                $futureStateProvider.stateFactory('ocLazyLoad', ocLazyLoadStateFactory)

                // 随便一个注解
                $futureStateProvider.addResolve(['$q', '$injector', '$http', function ($q) {
                    var deferd = $q.defer(),
                        promise = deferd.promise
                    angular.forEach(stateMapper.futureStates, function (futureState) {
                        $futureStateProvider.futureState(futureState)
                    })
                    deferd.resolve(stateMapper.futureStates)
                    return promise
                }])
                stateConfig($stateProvider)
            }])

        .constant('CONSTANT', {
            mode: {
                // 支持试听
                listen: 1,
                // 不支持试听
                play: 2,
                // 必须购买后才能观看
                buyPlay: 3
            },
            courseWareType: {
                single: 2,
                web: 4,
                pdf: 1,
                three: 3
            }
        })
    return app
})

