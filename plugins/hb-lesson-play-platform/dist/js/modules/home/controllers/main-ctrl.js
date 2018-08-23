define(['question', 'common/player'], function (Question, Player) {
    require.playerType = {}
    return ['playParams', 'system_config', '$http', 'lesson', '$stateParams', 'currentPlayInfo', '$rootScope', '$scope',
        '$timeout', '$location', 'common.TinyDialog', 'common.factory', '$interval',
        function (playParams, system_config, $http, lesson, $stateParams, currentPlayInfo, $rootScope, $scope,
                  $timeout, $location, TinyDialog, commonService, $interval) {
            for (var i = 0; i < 1000; i++) {
                window.clearInterval(i)
            }
            // return
            $scope.playParams = playParams
            var currentMedia = currentPlayInfo.media
            $scope.events = $scope.events || {}

            function toggle () {
                return playParams.defaultResourceType === 'player_polyv' ? 'player_800li' : 'player_polyv'
            }

            var ObjectList = []

            if (playParams && playParams.objectList) {
                for (var i = 0; i < playParams.objectList.length; i++) {
                    var mark = playParams.objectList[i]
                    ObjectList.push({
                        objectId: mark.value,
                        type: mark.key
                    })
                }
            }

            $scope.events.toggleSourcePlayer = function () {

                $scope.toggleOpen = true
                $scope.player && $scope.player.destroy()

                playParams.defaultResourceType = toggle()
                doInit()
            }

            function init (type, handle) {
                if (type === 1) {
                    playParams.defaultResourceType = 'player_doc'
                } else {
                    playParams.streamHost = playParams.resources[playParams.defaultResourceType].streamHost
                    playParams.streamPath = playParams.resources[playParams.defaultResourceType].resource
                }

                var requires = []

                function getVideoSrc () {
                    return ({
                        'player_800li': 'player800li',
                        'player_polyv': 'playerPolyv'
                    })[playParams.defaultResourceType]
                }

                // 文档类型的分支

                if (type === 1) {
                    requires.push('playerDoc')
                }

                if (type === 2) {
                    requires.push(getVideoSrc())
                }

                if (type === 3) {
                    // 三分屏
                    requires.push(getVideoSrc(), 'playerDoc')
                }

                if (playParams.defaultResourceType === 'player_800li') {
                    requires.push('800liScript')
                }
                if (playParams.defaultResourceType === 'player_polyv') {
                    requires.push('polyvScript')
                }
                require(requires, function (PlayerCtor, ThirdCtor) {
                    handle(Player, PlayerCtor, ThirdCtor)
                })
            }

            function stopInterval () {
                commonService.timer && $interval.cancel(commonService.timer)
            }

            $scope.$parent.availableTime = ''

            function startInterval (player) {
                stopInterval()
                // $interval.cancel ( commonService.timer );
                // 判断是否有允许播放次数 如果有允许播放次数，则有定时器扫描

                if (currentMedia.allowPlayTimes) {
                    var alreadyPlayTime = currentMedia.alreadyPlayTime,
                        rest = (currentMedia.time * currentMedia.allowPlayTimes) - alreadyPlayTime,
                        devise = rest % system_config.timeToSaveMediaLearnTime
                    commonService.timer = $interval(function () {
                        --rest
                        currentMedia.alreadyPlayTime++
                        if (!((rest % system_config.timeToSaveMediaLearnTime - devise))) {
                            // 10秒一次提交
                            $http.post(system_config.mediaLearnTimeUrl,    // 保存当前已经学习时长
                                {
                                    exts: $location.$$search.exts,
                                    trainClassId: $stateParams.trainClassId,
                                    alreadyPlayTime: currentMedia.alreadyPlayTime,
                                    lessonId: lesson.lesson.lessonId,
                                    courseWareId: currentPlayInfo.courseWare.id,
                                    mediaId: currentMedia.id
                                })
                        }

                        // 计算剩余多少时长
                        $scope.$parent.availableTime = commonService.convertTime(rest)
                        // 学习时间用光后将定时器清除掉
                        if (parseInt($scope.$parent.availableTime.split(':').join('')) <= 0) {

                            $http.post(system_config.mediaLearnTimeUrl,    // 保存当前已经学习时长
                                {
                                    exts: $location.$$search.exts,
                                    trainClassId: $stateParams.trainClassId,
                                    alreadyPlayTime: currentMedia.alreadyPlayTime,
                                    lessonId: lesson.lesson.lessonId,
                                    courseWareId: currentPlayInfo.courseWare.id,
                                    mediaId: currentMedia.id
                                })
                            $interval.cancel(commonService.timer)
                            stopInterval()
                            // 停止播放的记录提交
                            commonService.clearAllTimer()
                            $scope.$parent.availableTime = '播放结束'
                            // 播放结束
                            player.pause()
                            $timeout(function () {
                                $scope.allowTimesOut = true
                            })
                            return false
                        }
                    }, 1000)
                } else {
                    $scope.$parent.availableTime = undefined
                    commonService.timer && $interval.cancel(commonService.timer)
                }
            }

            doInit()

            function doInit () {
                init(playParams.type, function (Player, PlayerCtor, ThirdCtor) {

                    if (playParams.type !== 2) {
                        playParams.series = 'pdf'
                    }
                    var currentMediaSchedule = currentMedia.schedule
                    var popQuestion
                    //
                    var popConfig = playParams.popConfig
                    if (popConfig) {
                        popConfig.context = {
                            markers: playParams.markers || playParams.objectList,
                            objectList: ObjectList,
                            userId: lesson.userId,
                            platformId: playParams.platformId,
                            platformVersionId: playParams.platformVersionId,
                            projectId: playParams.projectId,
                            subProjectId: playParams.subProjectId,
                            unitId: playParams.unitId,
                            organizationId: playParams.organizationId,
                            dataProjectId: playParams.dataProjectId,
                            dataPlatformVersionId: playParams.dataPlatformVersionId,
                            courseId: lesson.lesson.id,
                            courseWareId: currentPlayInfo.courseWare.id,
                            mediaId: currentPlayInfo.media.id,
                            sourceId: lesson.originalAbilityId,
                            test: lesson.test
                        }
                    }
                    var videoConfig = {
                        autoPlay: true,
                        playMode: $stateParams.playMode,
                        playParams: playParams,
                        type: playParams.type,
                        lesson: lesson.lesson,
                        playerOptions: {
                            script: playParams.script,
                            id: playParams.streamPath,
                            host: playParams.streamHost,
                            flashvars: playParams.flashvars,
                            boxId: 'lesson_player_box_container',
                            width: playParams.type !== 1 ? (system_config.single ? system_config.single.width : '100%') : '100%',
                            height: playParams.type !== 1 ? (system_config.single ? system_config.single.height : '100%') : '100%',
                            // doc
                            series: playParams.series,
                            showSchedule: true,
                            docDuration: currentPlayInfo.media.time
                        },
                        duplicatePlayTip: system_config.duplicatePlayTip || ' 对不起，您已经打开另外一个播放页面！当前页面无法继续播放！',
                        studyServer: system_config.studyServer,
                        ajax: $http,
                        PlayerCtor: PlayerCtor,
                        DocPlayerCtor: ThirdCtor,
                        events: {
                            init: function (player) {
                                $timeout(function () {
                                    $scope.toggleOpen = false
                                })
                                var destroyPlayer = $rootScope.$on('$stateChangeStart',
                                    function () {
                                        player && player.destroy()
                                        destroyPlayer()
                                    })
                            },
                            end: function (player, data) {
                                // 如果是学习模式
                                if ($stateParams.playMode === 'learn') {

                                    var test = lesson.lesson.tests && lesson.lesson.tests[0]

                                    // 如果课程进度不是100
                                    // 这样的判断说明是第一次到达百分百
                                    // 如果有测验， 则进入弹窗
                                    if (system_config.askLessonScheduleUrl && system_config.goTestMustFinishLearn && test) {

                                        if (lesson.lesson.schedule !== 100 && data.courseSchedule === 100) {
                                            // 如果是第一次到达百分百， 则判断是否有测验
                                            $http.get(system_config.askLessonScheduleUrl, {
                                                params: {
                                                    exts: $location.$$search.exts,
                                                    lessonId: lesson.lesson.id,
                                                    trainClassId: $stateParams.trainClassId
                                                }
                                            }).then(function (data) {
                                                data = data.data
                                                commonService.setIframeOut()

                                                // 判断是否完成课程
                                                if (data.info.finish) {
                                                    if (data.info.testTimes > 0 ||
                                                        data.info.testTimes === -1) {
                                                        TinyDialog.confirm({
                                                            width: 350,
                                                            height: 180,
                                                            title: '提示',
                                                            content: '课程学习完成，是否立即进入课后测验?',
                                                            yesText: '立即进入',
                                                            noopText: '取消',
                                                            yes: function (dialog) {
                                                                dialog.close()
                                                                commonService.resetIframe()
                                                                playParams.requestType = 7
                                                                commonService.openWindow(test.href + commonService.genTestUrl(playParams,
                                                                    test.objectList, test.configId, lesson))
                                                            },
                                                            noop: function () {
                                                                commonService.resetIframe()
                                                            }
                                                        })
                                                    } else {
                                                        TinyDialog.confirm({
                                                            title: '提示',
                                                            yesText: '查看测验详情',
                                                            width: 350,
                                                            height: 180,
                                                            noop: function () {
                                                                commonService.resetIframe()
                                                            },
                                                            noopText: '取消',
                                                            content: '课后测验次数已使用完毕!无法再测验！',
                                                            yes: function (dialog) {
                                                                playParams.requestType = 8
                                                                playParams.historyId = data.info.testInfo.historyId
                                                                commonService.openWindow(test.href + commonService.genTestUrl(playParams,
                                                                    test.objectList, data.info.testInfo.configId, lesson))
                                                                dialog.close()
                                                            }
                                                        })
                                                    }
                                                }
                                            })
                                        }
                                    }
                                }
                                // 不是第一次达到百分100 不跳下一个课件
                                if (currentMediaSchedule !== 100) {
                                    $scope.events.playNext()
                                }
                            },
                            commit: function (player, remoteData) {
                                // 更新课件媒体进度
                                currentPlayInfo.media.schedule = remoteData.data.data.core.studySchedule
                                // 课程进度也要跟着更新
                                $scope.lesson.schedule = remoteData.data.data.core.courseSchedule
                            },
                            playing: function (player, options) {

                                if (popConfig) {
                                    popQuestion && popQuestion.apply(options.time)
                                }

                                if ($stateParams.playMode === 'listen') {
                                    if (currentMedia.listenTime
                                        && currentMedia.listenTime === Math.floor(player.getTime())) {
                                        player.play(currentMedia.listenTime)
                                        player.pause()
                                        $timeout(function () {
                                            $scope.listenEnd = true
                                        })
                                    }
                                }

                                // 如果检测到当前是学习模式， 并且监听是否学习次数用光的定时器没有启动，则重新启动
                                if ($stateParams.playMode === 'learn' && !commonService.timer) {
                                    startInterval(player)
                                }
                            },
                            start: function (player) {
                                if (popConfig) {
                                    popConfig.duration = player.getDuration()
                                    popConfig.open = function () {
                                        player.pause()
                                    }
                                    popConfig.close = function () {
                                        player.play()
                                    }
                                    try {
                                        popQuestion = player.popQuestion = new Question(popConfig)
                                    } catch (e) {
                                        console.log(e)
                                    }
                                }
                            },
                            seek: function (player, options, coreData) {
                                if (currentMedia.listenTime > 0) {
                                    if (player.getTime() > currentMedia.listenTime) {
                                        player.play(currentMedia.listenTime)
                                    }
                                }
                            },
                            pause: function (player) {
                                stopInterval(player)
                            },
                            repeatPlay: function (player) {
                                if (player) {
                                    player.pause()
                                }
                            },
                            mustRefresh: function () {
                                window.location.reload()
                            }
                        },
                        context: {
                            test: lesson.test,
                            markers: playParams.markers || playParams.objectList,
                            objectList: ObjectList,
                            guid: playParams.guid,
                            plmId: playParams.platformId,
                            pvmId: playParams.platformVersionId,
                            prmId: playParams.projectId,
                            subPrmId: playParams.subProjectId,
                            unitId: playParams.unitId,
                            orgId: playParams.organizationId,
                            dataProjectId: playParams.dataProjectId,
                            dataPlatformVersionId: playParams.dataPlatformVersionId,
                            originalAbilityId: lesson.originalAbilityId
                        }
                    }

                    //
                    $scope.player = new Player(videoConfig)
                    $scope.player.initPlayer({
                        isWriteHistory: true,
                        usrId: lesson.userId,
                        filterList: [],
                        courseId: lesson.lesson.id,
                        courseWareId: currentPlayInfo.courseWare.id,
                        multimediaId: currentPlayInfo.media.id,
                        type: ({
                            1: 'pdf',
                            2: 'single',
                            3: 'three'
                        })[playParams.type],
                        token: window.token || ''
                    })
                    $scope.$on('events:dump_play', function (event, data) {
                        $scope.player.player.play(data.timePoint)
                    })
                })
            }
        }]
})