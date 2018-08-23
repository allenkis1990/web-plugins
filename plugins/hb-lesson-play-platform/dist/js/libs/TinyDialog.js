define(function (mod) {

    function TinyDialog (options) {
    }

    var util = {
        isFunction: function (func) {
            return Object.prototype.toString.call(func) === '[object Function]'
        }
    }

    TinyDialog.prototype.alert = function (options) {
        this.options = {
            width: options.width || 100,
            height: options.height || 80,
            title: options.title || '标题',
            content: options.content || '',
            modal: options.content.modal || true,
            yesText: options.content.yesText || '确定'
        }
        createDom.call(this)
    }

    TinyDialog.prototype.confirm = function (options) {
        this.options = {
            width: options.width || 100,
            height: options.height || 80,
            title: options.title || '标题',
            content: options.content || '',
            modal: options.content.modal || true,
            yes: options.yes,
            noop: options.noop,
            yesText: options.yesText || '确定',
            noopText: options.noopText || '取消'
        }
        return createDom.call(this)
    }

    TinyDialog.prototype.instanceIndex = 5000

    function createDom () {

        var _this = this
        var el_container = this.el_container = document.createElement('div')
        el_container.setAttribute('class', 'tiny-dialog')
        var el_dialogContentWrap = document.createElement('div')
        el_dialogContentWrap.setAttribute('class', 'tiny-dialog-content-wrap')
        var el_TinyDialogBody = document.createElement('div')
        el_TinyDialogBody.setAttribute('class', 'tiny-dialog-body')
        var el_dialogTitle = document.createElement('div')
        el_dialogTitle.setAttribute('class', 'tiny-dialog-title')
        var el_dialogFoot = document.createElement('div')
        el_dialogFoot.setAttribute('class', 'tiny-dialog-foot')
        var footerInnerHTML = '<button class="tiny-dialog-certain">' +
            this.options.yesText +
            '</button>'
        if (this.options.noopText) {
            footerInnerHTML += '<button class="tiny-dialog-cancel">' +
                this.options.noopText +
                '</button>'
        }
        el_dialogFoot.innerHTML = footerInnerHTML
        el_dialogContentWrap.addEventListener('click', function (event) {
            var handle = ({
                'tiny-dialog-certain': function () {
                    if (util.isFunction(_this.options.yes)) {
                        _this.options.yes(_this)
                    } else {
                        el_container.parentNode.removeChild(el_container)
                    }
                },
                'tiny-dialog-cancel': function () {
                    if (util.isFunction(_this.options.noop)) {
                        _this.options.noop(_this)
                    }
                    el_container.parentNode.removeChild(el_container)
                },
                'tiny-dialog-close': function () {
                    _this.close()
                }
            })[event.target.className]
            util.isFunction(handle) && handle()
        })

        if (this.options.modal) {
            var el_mask = document.createElement('div')
            el_mask.setAttribute('class', 'tiny-dialog-mask')
            el_container.appendChild(el_mask)
        }
        //
        el_dialogContentWrap.style.height = this.options.height + 'px'
        el_dialogContentWrap.style.width = this.options.width + 'px'
        el_dialogContentWrap.style.marginLeft = -(this.options.width / 2) + 'px'
        el_dialogContentWrap.style.marginTop = -(this.options.height / 2) + 'px'

        //  el_dialogTitle
        el_dialogTitle.innerHTML = this.options.title + '<i class="tiny-dialog-close"></i>'

        // el_dialogContent
        el_TinyDialogBody.innerHTML = this.options.content

        el_dialogContentWrap.appendChild(el_dialogTitle)
        el_dialogContentWrap.appendChild(el_TinyDialogBody)
        el_dialogContentWrap.appendChild(el_dialogFoot)
        //

        el_container.appendChild(el_dialogContentWrap)
        el_container.setAttribute('style', 'z-index:' + this.instanceIndex++)
        document.body.appendChild(el_container)
        return el_container
    }

    TinyDialog.prototype.close = function () {
        this.el_container.parentNode.removeChild(this.el_container)
    }

    return TinyDialog
})