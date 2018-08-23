define(['common/player'], function (Player) {
    require.playerType = {}
    return ['playParams', 'system_config', '$http', '$stateParams', '$rootScope', '$scope',
        '$timeout', '$location', 'common.TinyDialog', 'common.factory', '$interval',
        function (playParams, system_config, $http, $stateParams, $rootScope, $scope,
                  $timeout, $location, TinyDialog, commonService, $interval) {
            for (var i = 0; i < 1000; i++) {
                window.clearInterval(i)
            }
            // return
            $scope.playParams = playParams
            $scope.events = $scope.events || {}

            function toggle () {
                return playParams.defaultResourceType === 'player_polyv' ? 'player_800li' : 'player_polyv'
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

            doInit()

            function doInit () {
                init(playParams.type, function (Player, PlayerCtor, ThirdCtor) {

                    if (playParams.type !== 2) {
                        playParams.series = 'pdf'
                    }
                    //
                    var videoConfig = {
                        autoPlay: true,
                        playMode: 'listen',
                        playParams: playParams,
                        type: playParams.type,
                        playerOptions: {
                            script: playParams.script,
                            id: playParams.streamPath,
                            host: playParams.streamHost,
                            boxId: 'lesson_player_box_container',
                            width: playParams.type !== 1 ? (system_config.single ? system_config.single.width : '100%') : '100%',
                            height: playParams.type !== 1 ? (system_config.single ? system_config.single.height : '100%') : '100%',
                            // doc
                            series: playParams.series,
                            showSchedule: true,
                            docDuration: 0
                        },
                        duplicatePlayTip: ' 对不起，您已经打开另外一个播放页面！当前页面无法继续播放！',
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
                            },
                            commit: function (player, remoteData) {
                            },
                            playing: function (player, options) {
                            },
                            start: function (player) {
                            },
                            seek: function (player) {
                            },
                            pause: function (player) {
                            },
                            repeatPlay: function (player) {
                            },
                            mustRefresh: function () {

                            }
                        }
                    }

                    //
                    $scope.player = new Player(videoConfig)
                    $scope.player.initPlayer({
                        isWriteHistory: true,
                        filterList: [],
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