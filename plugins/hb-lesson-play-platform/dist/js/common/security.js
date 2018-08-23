/**
 *
 * @ 模块控制播放器在播放的时候安全控制
 */

define(function (mod) {
    var security = {
        /**
         * 禁用鼠标有单击
         */
        disableContextMenu: function () {
            document.oncontextmenu = function (event) {
                event.returnValue = false
            }
            return this
        },
        /**
         * 启用右单击
         */
        enableContextMenu: function () {
            document.oncontextmenu = true
            return this
        },
        /**
         * 禁用f12
         */
        disableF12: function () {
            document.onkeydown = function (event) {
                var e = e || window.event || event
                if (e.keyCode === 123) {
                    e.returnValue = false
                }
            }
            return this
        }
    }

    security
        .disableContextMenu()
        .disableF12()
})
