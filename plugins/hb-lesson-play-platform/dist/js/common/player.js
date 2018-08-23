(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global.HBPlayer = factory())
}(this, (function () {
    'use strict'

    function isFunction (func) {
        return Object.prototype.toString.call(func) === '[object Function]'
    }

    function wrapData (data) {
        return {
            data: data,
            head: {
                appVersion: '1.0.0',
                osPlatform: 'web',
                requestTime: (+new Date())
            }
        }
    }

    function forEach (array, handle) {

        var len = array.length
        var i = 0
        for (i = 0; i < len; i++) {
            handle(array[i], i)
        }
    }

    function Player (options) {
        this.options = options

        // 学习模式才提交等
        if (this.options.playMode === 'learn') {
            this.server = new Server({
                studyServer: this.options.studyServer,
                ajax: this.options.ajax,
                type: this.options.playParams.type,
                context: this.options.context,
                lesson: this.options.lesson
            })
        }

        this.commitTimer = undefined

        this.objectives = undefined
    }

    Player.prototype.destroy = function () {
        window.clearInterval(this.commitTimer)
        this.player && this.player.destroy()
        this.player = undefined
    }

    function Server (options) {
        this.options = options

        this.commitServer = ({
            1: this.options.studyServer.documentTiming,
            2: this.options.studyServer.timing,
            3: this.options.studyServer.threeTiming
        })[this.options.type]

        this.getFilterItems = function () {
            var filterItem = []

            var lessonId = this.options.lesson.id

            function isFilter (mode) {
                return mode === 1
            }

            forEach(this.options.lesson.chapterList, function (chapter) {
                forEach(chapter.courseWareList, function (courseWare) {
                    forEach(courseWare.mediaList, function (media) {
                        if (media.type === 2) {
                            var filter = isFilter(media.mode)
                            filterItem.push({
                                courseId: lessonId,
                                coursewareId: courseWare.id,
                                filterType: 0,
                                entityId: media.id,
                                isFilter: filter
                            })
                        }
                    })
                })
            })
            return filterItem
        }
    }

    Server.prototype.init = function (postData) {
        postData.context = this.options.context
        postData.originalAbilityId = postData.context.originalAbilityId
        postData.filterList = this.getFilterItems()
        return this.options.ajax.post(
            this.options.studyServer.init,
            wrapData(postData),
            {
                headers: {
                    'Content-Type': 'text/plain'
                }
            }
        )

            .then(function (data) {
                window.token = data.data.data.core.token
                return data
            }, function () {

            })
    }

    Server.prototype.commit = function (postData) {

    }

    var three = {
        main: function (player, playParams) {
            // 三分屏要做的事情
        },
        timing: function (player, playParams) {

            var currentPlayTime = player.getTime()
            var catalogListLength = playParams.catalogList.length
            var point = []
            for (var i = 0; i < catalogListLength; i++) {
                var current = playParams.catalogList[i]
                var next = playParams.catalogList[i + 1]
                var nextTime
                if (!next) {
                    nextTime = player.getDuration()
                } else {
                    nextTime = next.timePoint
                }

                if (currentPlayTime > current.timePoint) {
                    point.push(i)
                }
                // var someSign = currentPlayTime - current.timePoint
                // if (someSign < nextTime && someSign >= 0) {
                //     current.schedule = someSign / (nextTime - current.timePoint) * 100
                // } else {
                //     if (someSign >= 0) {
                //         current.schedule = 100
                //     }
                // }
            }
            if (point.length) {
                $('.name-bd > .ul-name').find('li').eq(point.length - 1).addClass('current').siblings().removeClass('current')
            }
        }
    }


    function docPlayer (config, DocPlayerCtor) {
        var el_docContainer = document.getElementById('lesson_player_box_doc_container')
        var path = '/mfs' + config.path
        // var path = '/sources/test.html'
        var needChange = false
        if (DocPlayerCtor.currentPath !== path) {
            DocPlayerCtor.currentPath = path
            needChange = true
        }
        var match = path.match(/\.(png|pdf|jpg|jpeg|html)$/i)
        var imageHandle = function () {
            var img = el_docContainer.getElementsByTagName('img')
            if (!img[0]) {
                el_docContainer.innerHTML = '<img  src="' + path + '"/>'
            } else {
                if (needChange) {
                    el_docContainer.innerHTML = '<img  src="' + path + '"/>'
                }
            }
        }
        if (match && match.length) {
            ({
                '.png': imageHandle,
                '.jpg': imageHandle,
                '.jpeg': imageHandle,
                '.html': function () {
                    var iframe = el_docContainer.getElementsByTagName('iframe')
                    if (!iframe[0]) {
                        el_docContainer.innerHTML = '<iframe height="100%" frameborder="0" width="100%"  src="' + path + '"></iframe>'
                    } else {
                        if (needChange) {
                            el_docContainer.innerHTML = '<iframe  frameborder="0"  height="100%" width="100%" src="' + path + '"></iframe>'
                        }
                    }
                },
                '.pdf': function () {
                    if (needChange) {
                        var pdf = new DocPlayerCtor({
                            scripts: '',
                            series: 'pdf',
                            duration: '100',
                            host: '/',
                            boxId: 'lesson_player_box_doc_container',
                            id: path
                        })
                            .init()
                    }
                }
            })[match[0].toLowerCase()]()
        }
    }

    function is100 (num) {
        return num === 100
    }

    function init () {
        var _this = this
        // this.options.playerOptions.flashvars = this.options.playerOptions.flashvars || {}
        // this.options.playerOptions.flashvars.is_play_once = 'on'

        var playerManager = new _this.options.PlayerCtor(_this.options.playerOptions)
        playerManager.init()

            .then(function (player) {
                _this.player = player
                // 初始化的时候自动播放
                player.on('init', function () {
                    setTimeout(function () {
                        player.play()
                    })
                })

                callEvents.call(_this, 'init')

                // 如果是学习模式，将进度跳到学习服务的进度播放
                player.on('start', function (data) {

                    callEvents.call(_this, 'start', data)

                    // 三分屏处理
                    if (_this.options.playParams === 3) {
                        three.main(player, _this.options.playParams)
                    }
                })

                player.on('playing', function (data) {
                    callEvents.call(_this, 'playing', data)

                    if (!player.lastPlayScale || data.time > player.lastPlayScale) {
                        player.lastPlayScale = data.time
                    }

                    // 三分屏
                    if (_this.options.playParams.type === 3) {
                        three.timing(player, _this.options.playParams)
                        var lecture,
                            len = _this.options.playParams.lectureList.length

                        for (var i = 0; i < len; i++) {
                            var item = _this.options.playParams.lectureList[i]
                            if (data.time > item.timePoint) {
                                lecture = item
                            }
                        }

                        if (!lecture) {
                            lecture = _this.options.playParams.lectureList[0]
                        }

                        docPlayer(lecture, _this.options.DocPlayerCtor)
                    }
                })
            })

    }

    var studyMode =
        {
            learn: function (postData) {
                var _this = this
                // on表示不记录当前的播放时间，并且不续播
                this.options.playerOptions.flashvars = this.options.playerOptions.flashvars || {}
                this.options.playerOptions.flashvars.ban_history_time = 'on'
                return this.server.init(postData)

                    .then(function (data) {
                        // 文档类型百分百不显示进度条
                        if (is100(data.data.data.core.studySchedule)) {
                            _this.options.playerOptions.showSchedule = false
                        }

                        var playerManager = new _this.options.PlayerCtor(_this.options.playerOptions)
                        var core = data.data.data.core

                        // 保留服务端的初始化数据
                        _this.serverEndData = data.data.data
                        _this.server.server_study_info = data.data.data.core
                        if (!serverResponse.call(_this, data.data.data)) return

                        playerManager.init()

                            .then(function (player) {
                                _this.player = player
                                // 初始化的时候自动播放
                                player.on('init', function () {
                                    setTimeout(function () {
                                        player.play()
                                    })
                                })

                                function hasPop (popQuestion) {
                                    return popQuestion && popQuestion.hasCurrentPop() && !popQuestion.hasCurrentPop().can_not_answer_again
                                }

                                callEvents.call(_this, 'init')

                                // 如果是学习模式，将进度跳到学习服务的进度播放
                                player.on('start', function (curryData) {

                                    setTimeout(function () {
                                        var playTime = 0// 如果播放进度已经是百分百了，  就从0开始播放
                                        if (data.data.data.core.studySchedule !== 100) {
                                            playTime = Math.floor(player.getDuration() * (core.studySchedule / 100))
                                        }
                                        player.play(playTime)
                                    }, 500)

                                    callEvents.call(_this, 'start', curryData)

                                    // 三分屏处理
                                    if (_this.options.playParams === 3) {
                                        three.main(player, _this.options.playParams)
                                    }
                                })

                                player.on('resume', function (data) {
                                    if (hasPop(player.popQuestion)) {
                                        // 判断到有一个弹出来的没有正常回答
                                        player.popQuestion.pop(player.popQuestion.hasCurrentPop())
                                        player.play(player.popQuestion.hasCurrentPop().time)
                                        player.pause()
                                        return
                                    }

                                    callEvents.call(_this, 'resume', data)
                                })
                                player.on('pause', function (data) {
                                    callEvents.call(_this, 'pause', data)
                                })

                                player.on('playing', function (data) {
                                    callEvents.call(_this, 'playing', data)

                                    if (!player.lastPlayScale || data.time > player.lastPlayScale) {
                                        player.lastPlayScale = data.time
                                    }

                                    // 三分屏
                                    if (_this.options.playParams.type === 3) {
                                        three.timing(player, _this.options.playParams)
                                        var lecture,
                                            len = _this.options.playParams.lectureList.length

                                        for (var i = 0; i < len; i++) {
                                            var item = _this.options.playParams.lectureList[i]
                                            if (data.time > item.timePoint) {
                                                lecture = item
                                            }
                                        }

                                        if (!lecture) {
                                            lecture = _this.options.playParams.lectureList[0]
                                        }

                                        docPlayer(lecture, _this.options.DocPlayerCtor)
                                    }
                                })

                                player.on('seek', function (data) {
                                    var lastPlayTime = Math.floor(player.getDuration() * (core.studySchedule / 100))
                                    var time
                                    try {
                                        if (angular.isArray(data)) {
                                            time = data[1]
                                        } else if (angular.isObject(data)) {
                                            time = data.time
                                        }
                                        if (time > lastPlayTime) {
                                            player.play(player.lastPlayScale)
                                        }
                                    } catch (e) {
                                        console.log(e)
                                    }

                                    callEvents.call(_this, 'seek', player, data.time)
                                })

                                player.on('end', function (data) {

                                    // 最后一次提交
                                    commit.call(_this, 100)

                                        .then(function (remoteData) {
                                            // 结束的时候， 触发结束事件
                                            callEvents.call(_this, 'end', remoteData.data.data)
                                        })

                                    window.clearInterval(_this.commitTimer)
                                })
                            })

                    })
            },
            listen: function () {
                init.call(this)
            },
            previewLesson: function () {
                this.options.playerOptions.showSchedule = false
                init.call(this)
            }
        }

    /**
     * 初始化播放器
     * @returns {Promise.<TResult>|*}
     */
    Player.prototype.initPlayer = function (postData) {
        // 学习模式情况下要处理的事情
        return studyMode[this.options.playMode].call(this, postData)
    }


    /**
     * 调用事件
     * @param name
     * @param options
     */
    function callEvents (name, options) {
        if (!this.options.events) return
        isFunction(this.options.events[name]) && this.options.events[name](this.player, options, this.server && this.server.server_study_info)
    }

    function serverResponse (response) {

        // 判断是否重复播放
        if (response.core.isRepeatPlay) {
            duplicatePlay.call(this)
            return false
        }

        if (response.core.isMustRefresh) {
            callEvents.call(this, 'mustRefresh')
            return false
        }

        intervalPolicy.call(this, response.objectives)
        return true
    }

    function intervalPolicy (_objectives) {
        var _this = this
        if (!this.objectives || this.objectives.policy.intervalTime !== _objectives.policy.intervalTime) {
            this.objectives = _objectives
        } else {
            return
        }
        window.clearInterval(this.commitTimer)
        this.commitTimer = window.setInterval(function () {
            // 构造提交的数据
            commit.call(_this, _this.player.getSchedule())

                .then(function (data) {
                    serverResponse.call(_this, data.data.data)
                })
        }, this.objectives.policy.intervalTime * 1000)
    }

    function commit (schedule) {
        var postData = {
            core: {
                primaryKey: this.serverEndData.core.primaryKey,
                courseRecordId: this.serverEndData.core.courseRecordId,
                coursewareRecordId: this.serverEndData.core.coursewareRecordId,
                lessonId: this.serverEndData.core.lessonId,
                lessonLocation: this.serverEndData.core.lessonLocation,
                studyMode: this.serverEndData.core.studyMode,
                // 最后一次播放刻度
                studyLastScale: this.player.getTime(),
                // 最高服务端播放的刻度
                studyCurrentScale: this.serverEndData.core.studyCurrentScale,
                // 外面传进来是因为保利威视在播放完成后获取的当前播放时间为0
                studySchedule: schedule,
                timingMode: 'schedule',
                // 没什么用
                studyStatus: this.serverEndData.core.studyStatus,
                // 没什么用
                lessonStatus: this.serverEndData.core.lessonStatus,
                token: this.serverEndData.core.token,
                intervalTime: this.serverEndData.objectives.policy.intervalTime
            },
            extend: this.options.context
        }
        var _this = this
        return this.options.ajax.post(this.server.commitServer, wrapData(postData), {
            headers: {
                'Content-Type': 'text/plain'
            }
        })
            .then(function (data) {
                // 结束的时候， 触发结束事件
                callEvents.call(_this, 'commit', data)
                _this.server.server_study_info = data.data.data.core
                return data
            })
    }

    var Event = {
        on: function (el, name, handle) {
            if (el.addEventListener) {
                el.addEventListener(name, handle)
            } else {
                el.attachEvent('on' + name, handle)
            }
        }
    }

    function duplicatePlay () {
        var _this = this
        window.clearInterval(this.commitTimer)
        callEvents.call(this, 'repeatPlay')
        var masker = '<div style="width: 100%;height: 100%;position: absolute;opacity: .8;background: black;filter: alpha(opacity=80)"></div>' +
            '<div style="position: relative;top: 50%;color: #bfbfbf;font-size: 25px;">' +
            this.options.duplicatePlayTip +
            '</div>'

        // 浏览器标题设置为重复播放提示
        document.title = this.options.duplicatePlayTip

        var el_masker = document.createElement('div')
        el_masker.innerHTML = masker
        el_masker.setAttribute('style', 'position: absolute;width: 100%;height: 100%;z-index: 5000;text-align: center;top: 0')
        el_masker.setAttribute('id', 'player_is_duplicate_play')
        document.body
            .appendChild(el_masker)

        Event.on(el_masker, 'DOMNodeRemoved', function () {
            duplicatePlay.call(_this)
        })
    }

    return Player
})))