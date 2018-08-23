/**
 * lesson-platform -
 * @author wengpengfeijava <wengpengfeijava@163.com>
 * @version v2.0.0
 * @link
    * @license ISC
 */

;(function (name, definition) {
    // 检测上下文环境是否为AMD或CMD
    var hasDefine = typeof define === 'function',
        // 检查上下文环境是否为Node
        hasExports = typeof module !== 'undefined' && module.exports

    if (hasDefine) {
        // AMD环境或CMD环境
        define(definition)
    } else if (hasExports) {
        // 定义为普通Node模块
        module.exports = definition()
    } else {
        // 将模块的执行结果挂在window变量中，在浏览器中this指向window对象
        this[name] = definition()
    }
})('hello', function () {

    var config = {
        paths: {
            angular: '/bower_components/angular/angular',
            angularUiRouter: '/bower_components/angular-ui-router/release/angular-ui-router',
            ocLazyLoad: '/bower_components/oclazyload/dist/ocLazyLoad',
            uiRouterExtras: '/bower_components/ui-router-extras/release/ct-ui-router-extras',
            angularAnimate: '/bower_components/angular-animate/angular-animate',
            player800li: '/bower_components/hb-player/dist/800li.umd',
            playerDoc: '/bower_components/hb-player/dist/doc.umd',
            playerPolyv: '/bower_components/hb-player/dist/polyv.umd',
            question: '/bower_components/hb-plugin-pop-question/dist/question.umd',
            '800liScript': '/bower_components/hb-player/dist/800li.player',
            polyvScript: '//player.polyv.net/script/polyvplayer.min',

            // player800li: 'http://192.168.20.248:8089/public/dist/800li.umd',
            // playerDoc: 'http://192.168.20.248:8089/public/dist/doc.umd',
            // playerPolyv: 'http://192.168.20.248:8089/public/dist/polyv.umd',
            // question: 'http://192.168.20.248:8080/dist/question.umd',
            jquery: '/bower_components/jquery/dist/jquery',
            particles: '/bower_components/particles.js/particles'
        },
        shim: {
            angular: {exports: 'angular'},
            angularAnimate: {deps: ['angular']},
            angularUiRouter: {deps: ['angular']},
            ocLazyLoad: {deps: ['angular']}
        }
    }

    if (require && require.config) {
        require.config(config)(['angular', 'jquery'], function (ng) {
            var injector = angular.injector(['ng'])

            injector.invoke(['$http', function ($http) {
                $http.get('/web/portal/play/getConfig')

                    .then(function (system_config) {
                        require(['./main.app'], function (app) {
                            app.constant('system_config', system_config.data.info)
                            angular.bootstrap(document.documentElement, ['app'])
                        })
                    }, function () {
                        // 如果加载的系统资源有问题，则做另一步处理
                        $http.get('views/common/errors/401.html')

                            .then(function (data) {
                                $('div[ui-view]').html(data.data)
                            })
                    })
            }])
        })
    }

    return config
})
