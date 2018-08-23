define(['modules/home/controllers/main-ctrl', 'modules/home/controllers/preview-ctrl'], function (homeCtrl, previewCtrl) {
    'use strict'
    angular.module('app.home.main', [])
        .controller('app.home.homeCtrl', homeCtrl)
        .controller('app.home.previewCtrl', previewCtrl)

        .directive('particlesBg', [function () {
            return {
                link: function ($scope, $element, $attr) {
                    var match = navigator.userAgent.match(/MSIE ([\d.]+)?/)
                    var IE_VERSION = match && +match[1]
                    $element.css({
                        width: '100%',
                        height: '100%'
                    })
                    if (IE_VERSION == 8) {
                        $element.css({
                            backgroundImage: 'url("images/player-bg.png")',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                        })
                    } else {
                        require(['particles'], function () {
                            var config = {
                                particles: {
                                    number: {value: 20, density: {enable: !0, value_area: 1E3}},
                                    color: {value: '#e1e1e1'},
                                    shape: {
                                        type: 'circle',
                                        stroke: {width: 0, color: '#000000'},
                                        polygon: {nb_sides: 5},
                                        image: {src: 'img/github.svg', width: 100, height: 100}
                                    },
                                    opacity: {
                                        value: .5,
                                        random: !1,
                                        anim: {enable: !1, speed: 1, opacity_min: .1, sync: !1}
                                    },
                                    size: {
                                        value: 15, random: !0, anim: {
                                            enable: !1,
                                            speed: 180, size_min: .1, sync: !1
                                        }
                                    },
                                    line_linked: {
                                        enable: !0,
                                        distance: 650,
                                        color: '#cfcfcf',
                                        opacity: .26,
                                        width: 1
                                    },
                                    move: {
                                        enable: !0,
                                        speed: 2,
                                        direction: 'none',
                                        random: !0,
                                        straight: !1,
                                        out_mode: 'out',
                                        bounce: !1,
                                        attract: {enable: !1, rotateX: 600, rotateY: 1200}
                                    }
                                }, interactivity: {
                                    detect_on: 'canvas',
                                    events: {
                                        onhover: {enable: !1, mode: 'repulse'},
                                        onclick: {enable: !1, mode: 'push'},
                                        resize: !0
                                    },
                                    modes: {
                                        grab: {distance: 400, line_linked: {opacity: 1}},
                                        bubble: {distance: 400, size: 40, duration: 2, opacity: 8, speed: 3},
                                        repulse: {distance: 200, duration: .4},
                                        push: {particles_nb: 4},
                                        remove: {particles_nb: 2}
                                    }
                                }, retina_detect: !0
                            }
                            particlesJS($attr.id, config)
                        })
                    }
                }
            }
        }])

        .controller('app.home.rootCtrl', ['$scope', 'lesson', 'system_config', '$rootScope', '$state',
            function ($scope, lesson, system_config, $rootScope, $state) {

                var currentPlayInfo = $rootScope.currentPlayInfo

                $scope.showVideoFirst = system_config.showVideoFirst
                // 返回按钮
                $scope.backTargetUrl = system_config.backTargetUrl
                // 课程信息
                $scope.lesson = lesson.lesson
                // 是否有上一个
                $scope.hasPrev = currentPlayInfo.hasPrev
                // 是否有下一个
                $scope.hasNext = currentPlayInfo.hasNext
                // 边栏样式， 点击伸缩的时候切换
                $scope.style = {
                    side: {
                        right: system_config.showDirectoryFirst ? 0 : '-350px'
                    },
                    content: {
                        right: system_config.showDirectoryFirst ? '350px' : 0
                    }
                }

                function goState (goInfo) {
                    var params = {
                        playMode: $state.params.playMode,
                        lessonId: $state.params.lessonId,
                        courseWareId: goInfo.courseWare.id
                    }

                    var href = $state.href('states.home', params)

                    if (window.location.replace && href) {
                        window.location.replace(href)
                    } else {
                        $state.go('states.home', params)
                    }
                }

                function setInfo (obj, operate) {

                }

                $scope.events = {
                    backToTarget: function () {
                        window.location.replace ? window.location.replace($scope.backTargetUrl) : (window.location.href = $scope.backTargetUrl)
                    },
                    playNext: function () {
                        var goInfo = {}
                        // 获取当前播放课件的索引
                        var currentCourseWareIndex = $scope.currentPlayInfo.courseWare.index
                        var currentChapterIndex = $scope.currentPlayInfo.chapter.index

                        // 当前课件索引等于课件集合的长度数量- 1说明当前章节没有下一个课件了
                        // else 则选择当前的章节，下一个课件, 第一个媒体播放
                        if (currentCourseWareIndex === $scope.currentPlayInfo.chapter.courseWareList.length - 1) {
                            // 同样， 当前章节的索引等于当前课程的章节的总数-1的时候，说明没有下一个章节了
                            // else 有的话，则跳过选择下一个章节的第一个课件第一个 媒体作为播放
                            if (currentChapterIndex === $scope.lesson.chapterList.length - 1) {
                                return false
                            } else {
                                goInfo.chapter = $scope.lesson.chapterList[currentChapterIndex + 1]
                                goInfo.chapter.index = currentChapterIndex + 1
                                goInfo.courseWare = goInfo.chapter.courseWareList[0]
                                goInfo.courseWare && (goInfo.courseWare.index = 0)
                            }
                        } else {
                            goInfo.chapter = $scope.lesson.chapterList[currentChapterIndex]
                            goInfo.chapter.index = currentChapterIndex
                            goInfo.courseWare = goInfo.chapter.courseWareList[currentCourseWareIndex + 1]
                            goInfo.courseWare.index = currentCourseWareIndex + 1
                        }


                        if (goInfo.courseWare) {
                            goInfo.media = goInfo.courseWare.mediaList[0]
                            goInfo.media.index = 0
                        }

                        goState(goInfo)
                    },
                    playPrev: function () {
                        var goInfo = {}

                        // 获取当前播放课件的索引
                        var currentCourseWareIndex = $scope.currentPlayInfo.courseWare.index
                        var currentChapterIndex = $scope.currentPlayInfo.chapter.index

                        // 当前课件索引等于课件集合的长度数量- 1说明当前章节没有下一个课件了
                        // else 则选择当前的章节，下一个课件, 第一个媒体播放
                        if (!currentCourseWareIndex) {
                            // 同样， 当前章节的索引等于当前课程的章节的总数-1的时候，说明没有下一个章节了
                            // else 有的话，则跳过选择下一个章节的第一个课件第一个 媒体作为播放
                            if (!currentChapterIndex) {
                                return false
                            } else {
                                goInfo.chapter = $scope.lesson.chapterList[currentChapterIndex - 1]
                                goInfo.chapter.index = currentChapterIndex - 1
                                goInfo.courseWare = goInfo.chapter.courseWareList[goInfo.chapter.courseWareList.length - 1]
                                goInfo.courseWare.index = 0
                            }
                        } else {
                            goInfo.chapter = $scope.lesson.chapterList[currentChapterIndex]
                            goInfo.chapter.index = currentChapterIndex
                            goInfo.courseWare = goInfo.chapter.courseWareList[currentCourseWareIndex - 1]
                            goInfo.courseWare.index = currentCourseWareIndex - 1
                        }

                        if (goInfo.courseWare) {
                            goInfo.media = goInfo.courseWare.mediaList[0]
                            goInfo.media.index = 0
                        }
                        goState(goInfo)
                    }
                }
            }])

        .directive('bBar', [function () {
            function getStyle (element, att) {
                //特性侦测
                if (window.getComputedStyle) {
                    //优先使用W3C规范
                    return window.getComputedStyle(element)[att]
                } else {
                    //针对IE9以下兼容
                    return element.currentStyle[att]
                }
            }

            return {
                scope: {
                    playParams: '=?',
                    listenEnd: '=?'
                },
                replace: true,
                templateUrl: 'templates/footer-bar.html',
                link: function ($scope, $element, $attr) {
                    //获取当前样式
                    $scope.threeBarStyle = {
                        width: $scope.playParams.catalogList.length * 152 + 'px',
                        left: 0,
                        transition: 'left .5s',
                        webkitTransition: 'left .5s',
                        mozTransition: 'left .5s',
                        oTransition: 'left .5s',
                        msTransition: 'left .5s'
                    }

                    function getElementsWidth () {
                        return {
                            fatherWidth: parseInt(getStyle($element[0].getElementsByClassName('name-bd')[0], 'width')),
                            ulWidth: parseInt(getStyle($element.find('ul')[0], 'width'))
                        }
                    }

                    var oneWidth = 152
                    $scope
                        .events = {
                        goLeft: function () {
                            var elementsWidth = getElementsWidth()
                            if (elementsWidth.ulWidth > elementsWidth.fatherWidth) {
                                var judge = Math.round(elementsWidth.fatherWidth / oneWidth)
                                elementsWidth.fatherWidth = judge * oneWidth
                                var left = parseInt($scope.threeBarStyle.left) + elementsWidth.fatherWidth
                                if (left > 0) {
                                    left = 0
                                }
                                $scope.threeBarStyle.left = left + 'px'
                            }
                        },
                        goRight: function () {
                            var elementsWidth = getElementsWidth()
                            if (Math.abs(parseInt($scope.threeBarStyle.left)) + elementsWidth.fatherWidth >= elementsWidth.ulWidth) return
                            if (elementsWidth.ulWidth > elementsWidth.fatherWidth) {
                                var judge = Math.round(elementsWidth.fatherWidth / oneWidth)
                                elementsWidth.fatherWidth = judge * oneWidth
                                $scope.threeBarStyle.left = (parseInt($scope.threeBarStyle.left) - elementsWidth.fatherWidth) + 'px'
                            }
                        },
                        dumpPlay: function (catalog) {
                            $scope.$emit('events:dump_play', catalog)
                        }
                    }
                }
            }
        }])

        .directive('togglePlayer', ['$timeout', function ($timeout) {
            return {
                link: function ($scope, $element) {
                    $timeout(function () {
                        $scope.showTip_0 = true
                    }, 1000)
                    $scope.hideTip_0 = function () {
                        $scope.showTip_0 = false
                    }
                }
            }
        }])
})