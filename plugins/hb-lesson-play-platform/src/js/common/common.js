define('constants', function (mod) {
    return function (module) {
        module.constant('CONSTANT', {
            courseWareType: {
                pdf: 1,
                single: 2,
                three: 3,
                web: 4
            }
        })
    }
})

define('directives', function (mod) {
    return function (module) {
        module.directive('playerSide', ['CONSTANT', 'components', '$stateParams', 'system_config',
            function (CONSTANT, components, $stateParams, system_config) {
                return {
                    templateUrl: 'templates/player-side.html',
                    replace: true,
                    scope: {
                        lesson: '=?',
                        ctrlStyle: '=?',
                        currentPlayInfo: '=?'
                    },
                    link: function ($scope) {
                        $scope.availableTime = '00:00:00'
                        // 获取tab集合
                        $scope.components = components.getComponentsList()
                        $scope.playMode = $stateParams.playMode
                        // 设置默认为第一个选中
                        $scope.currentActiveDirectory = $scope.components[0]
                        $scope.currentActiveDirectory.meetted = true

                        var operation = (function ($scope) {
                            /**
                             *
                             * @constructor
                             */
                            function Operation () {
                                var me = this
                                angular.forEach($scope.components, function (item) {
                                    me[item.name] = function (type) {
                                        me.toggle(type)
                                    }
                                })
                                this.open = system_config.showDirectoryFirst
                                this.setStyle()
                            }

                            Operation.prototype = {
                                toggle: function (who) {
                                    // 如果点击的还是当前的选项卡， 则收缩右边的目录栏
                                    if ($scope.currentActiveDirectory.name === who.name) {
                                        if (this.open) {
                                            this.open = false
                                        } else {
                                            this.open = true
                                        }
                                    } else {
                                        this.open = true
                                        $scope.currentActiveDirectory = who
                                    }
                                    this.setStyle()
                                },
                                setStyle: function () {
                                    if (this.open) {
                                        $scope.ctrlStyle.side.right = 0
                                        $scope.ctrlStyle.content.right = '350px'
                                    } else {
                                        $scope.ctrlStyle.side.right = '-350px'
                                        $scope.ctrlStyle.content.right = '0'
                                    }
                                }
                            }
                            return new Operation()
                        })($scope)

                        $scope.events = {
                            toggleDirectory: function ($event, nav) {
                                // ie8下面 a标签切换导致800li播放器无法正常播放器
                                $event.preventDefault()
                                operation[nav.name](nav)
                                nav.meetted = true
                                $scope.currentActiveDirectory = nav

                            }
                        }
                    }
                }
            }])

            .directive('restTip', [function () {
                return {}
            }])

            .directive('components', ['components', '$compile', function (components, $compile) {
                return {
                    link: function ($scope, $element) {

                        $scope.$watch('components', function (nv) {
                            angular.forEach(nv, function (item) {
                                var childScope = $scope.$new(),
                                    ele = angular.element('<div ' + item.name + '' +
                                        ' lesson="lesson"' +
                                        ' current-play-info="currentPlayInfo"' +
                                        ' current-active-directory="currentActiveDirectory" ng-if="component.meetted" ' +
                                        ' ng-show="currentActiveDirectory.name === component.name"></div>')

                                childScope.component = item

                                $element.append(ele)

                                $compile(ele)(childScope)
                            })
                        })
                    }
                }
            }])

            .directive('directory', ['$state', 'CONSTANT', '$stateParams', 'common.factory', '$http', 'system_config', 'common.TinyDialog',
                function ($state, CONSTANT, $stateParams, commonService, $http, system_config, TinyDialog) {
                    return {
                        scope: {
                            lesson: '=?',
                            currentActiveDirectory: '=?',
                            currentPlayInfo: '=?'
                        },
                        templateUrl: 'templates/sides/directory.html',
                        link: function ($scope) {
                            $scope.courseWareType = CONSTANT.courseWareType
                            $scope.playMode = $stateParams.playMode
                            $scope.events = $scope.events || {}
                            $scope.events = {
                                goTest: function ($event, witch) {
                                    $event.preventDefault()

                                    function go_to () {
                                        system_config.playParams.requestType = 7
                                        commonService.openWindow(witch.href + commonService.genTestUrl(system_config.playParams, witch.objectList, witch.configId, $scope.lesson.name))
                                    }

                                    function to_test (witch, data) {
                                        data = data || {}
                                        var config = {
                                                title: '提示',
                                                noop: function () {
                                                    return true
                                                },
                                                width: 300,
                                                height: 160,
                                                noopText: '取消',
                                                content: '课后测验次数已使用完毕！无法再测验！'
                                            },
                                            method = 'confirm'
                                        if (data.historyId && data.configId) {
                                            config.yes = function () {
                                                system_config.playParams.requestType = 8
                                                system_config.playParams.historyId = data.historyId
                                                witch && commonService.openWindow(witch.href + commonService.genTestUrl(system_config.playParams,
                                                    witch.objectList, data.configId, $scope.lesson.name))
                                                return true
                                            }
                                            config.yesText = '查看测验详情'
                                        } else {
                                            method = 'alert'
                                            config.yesText = '确定'
                                        }
                                        TinyDialog[method](config)
                                    }

                                    if (system_config.askLessonScheduleUrl) {

                                        witch && $http.get(system_config.askLessonScheduleUrl, {
                                            params: {
                                                lessonId: $stateParams.lessonId,
                                                trainClassId: $stateParams.trainClassId
                                            }
                                        }).success(function (data) {
                                            if ($scope.lesson.goTestMustFinishLearn) {
                                                if (data.info.finish) {
                                                    if (data.info.testTimes > 0 || data.info.testTimes === -1) {
                                                        go_to()
                                                    } else {
                                                        to_test(witch, data.info.testInfo)
                                                    }
                                                } else {
                                                    TinyDialog.alert({
                                                        title: '提示',
                                                        width: 300,
                                                        height: 160,
                                                        yesText: '继续学习',
                                                        content: '未完成课程学习不能去测验！<br/>当前学习进度<span style="color: red;font-weight: bold">' + $scope.lesson.schedule + '%</span>',
                                                        yes: function () {
                                                            return true
                                                        }
                                                    })
                                                }
                                            } else {
                                                if (data.info.testTimes > 0 ||
                                                    data.info.testTimes === -1) {
                                                    go_to()
                                                } else {
                                                    to_test(witch, data.info.testInfo)
                                                }
                                            }
                                        })
                                    }
                                },
                                playSelect: function (chapter, courseWare, media, chapterIndex, courseWareIndex) {
                                    if ($scope.currentPlayInfo.courseWare.id === courseWare.id
                                        && $scope.currentPlayInfo.media.id === media.id) {
                                        //  ( '当前播放的就是你点击的课件' );
                                        return false
                                    }

                                    var params = {
                                        playMode: $state.params.playMode,
                                        lessonId: $state.params.lessonId,
                                        courseWareId: courseWare.id
                                    }

                                    var href = $state.href('states.home', params)

                                    if (window.location.replace && href) {
                                        window.location.replace(href)
                                    } else {
                                        $state.go('states.home', params)
                                    }
                                }
                            }
                        }
                    }
                }])

            .directive('cannotRemove', [function () {
                return {
                    link: function ($scope, $element) {
                        add($element)

                        function add (clone) {
                            clone.on('DOMNodeRemoved', function () {
                                var _clone = clone.clone()
                                clone.parent()
                                    .append(_clone)
                                add(_clone)
                            })
                        }
                    }
                }
            }])
        return module
    }
})

define('providers', function (mod) {

    return function (module) {
        module.provider('components', [function () {
            var sideComponents = {
                directory: {
                    name: 'directory',
                    className: 'ico-ml',
                    title: '目录'
                }
            }

            this.addComponents = function (component) {
                sideComponents[component.name] = component
            }

            this.$get = [function () {
                return {

                    getComponents: function () {
                        return sideComponents
                    },

                    addComponents: function (component) {
                        sideComponents[component.name] = component
                    },

                    getComponentsList: function () {
                        var list = []
                        for (var pro in sideComponents) {
                            list.push(sideComponents[pro])
                        }
                        return list
                    }
                }
            }]
        }])

        return module
    }
})

define('services', ['./libs/TinyDialog'], function (TinyDialog) {
    return function (module) {
        module.factory('common.factory', [function () {
            return {
                /**
                 * s -- > hh:mm:ss
                 * @param time
                 * @returns {string}
                 */
                convertTime: function (time) {
                    var minute = time / 60
                    var second = time % 60
                    var hour = minute / 60
                    minute = minute % 60

                    hour = parseInt(hour, 10)
                    minute = parseInt(minute, 10)
                    second = parseInt(second, 10)
                    return (hour >= 10 ? hour : '0' + hour) + ':' + (minute >= 10 ? minute : '0' + minute) + ':' + (second >= 10 ? second : '0' + second)
                },

                isIe8: function () {
                    var isIEEight = false
                    if ((navigator.userAgent.indexOf('MSIE 9.0') > 0 && !window.innerWidth)
                        || (navigator.userAgent.indexOf('MSIE 8.0') > 0 && !window.innerWidth)) {
                        isIEEight = true
                        return isIEEight
                    } else {
                        return isIEEight
                    }
                },
                /**
                 *
                 * @param params
                 * @param objectInfo
                 * @param id
                 * @returns {string}
                 */
                genTestUrl: function (params, objectInfo, id, lesson) {
                    var examService = '/web/examService/examination'
                    // /web/examService/examination?
                    // id=3861cb17-8747-4447-907f-d58b0965e5d2
                    // requestType=7
                    // projectId=402881c74ea1976f014ea19779710000
                    // subProjectId=402881c74ea1976f014ea1977a4d0002
                    // platformId=402881c74e70559e014e7055ade40000
                    // platformVersionId=402881c74e705744014e705751b40000
                    // unitId=2c9180e54e7580cd014e7707b9690004
                    // organizationId=2c91b6e54fa1ad9d014fa2f5a1b80013
                    // userId=2c9181e555e804fe0155ec55915100ed
                    // isAsync=true
                    var temp = {
                        id: id,
                        requestType: params.requestType,
                        projectId: params.projectId,
                        subProjectId: params.subProjectId,
                        platformId: params.platformId,
                        platformVersionId: params.platformVersionId,
                        unitId: params.unitId,
                        organizationId: params.organizationId,
                        userId: lesson.lesson.userId
                    }

                    if (params.historyId) {
                        temp.historyAnswerExamPaperId = params.historyId
                    }

                    examService += '?1=1'

                    for (var pro in temp) {
                        examService += '&' + pro + '=' + temp[pro]
                    }

                    examService += '&isAsync=true'

                    examService += '&bizParams=' + angular.toJson(objectInfo)

                    var lessonName = lesson.lesson.name
                    if (lessonName) {
                        lessonName = lessonName.replace(/\//gi, '-.-')
                        examService += '_' + encodeURI(lessonName)
                    }
                    return examService
                },
                openWindow: function (href, target) {
                    var opened = window.open('about:blank', target)
                    opened.location = href
                },
                resetIframe: function () {
                    this.isIe8() && angular.element('iframe').css({
                        position: 'relative',
                        left: 0
                    })
                },
                setIframeOut: function () {
                    this.isIe8() && angular.element('iframe').css({
                        position: 'fixed',
                        left: -10000 + 'px'
                    })
                },

                removeIframe: function () {
                    this.isIe8() && angular.element('iframe').remove()
                },
                clearAllTimer: function () {
                    for (var i = 0; i < 1000; i++) {
                        window.clearInterval(i)
                    }
                }
            }
        }])

            .factory('common.TinyDialog', [function () {
                return new TinyDialog()
            }])

        return module
    }
})

define('filters', function (mod) {
    return function (module) {
        module.filter('secondFormat', ['common.factory', 'CONSTANT', function (commonService, CONSTANT) {
            return function (val, type) {
                return val ? commonService.convertTime(val) : ''
            }
        }])

        return module
    }
})
define(['directives', 'providers', 'filters', 'constants', 'services'],
    function (Directives, Providers, Filters, Constants, Services) {
        var module = angular.module('sys.common', [])

        Directives(module)
        Providers(module)
        Filters(module)
        Constants(module)
        Services(module)
    })
