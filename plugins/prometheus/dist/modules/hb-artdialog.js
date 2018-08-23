/**
 * prometheus - 普罗米修斯
 * @author 
 * @version v1.0.91
 * @link 
 * @license MIT
 */
define(["angular","artDialog"],function(n,e){"use strict";function t(n){return this.init(n)}var i={},o=0;t.prototype={dialogConfig:{okValue:"确定",cancelValue:"取消"},extend:function(n,e){for(var t in e)n.hasOwnProperty(t)||(n[t]=e[t])},init:function(n){var t=this;if(this.extend(n,this.dialogConfig),n.time){var i=n.onclose;n.onclose=function(){t.clearTimerById(this.name),i&&i()}}var r=e.apply(this,arguments);if(n.visible&&r.show(),n.modal&&r.showModal(),r.name="ngDialog_"+o++,n.time){var c=this.timerClose(1,function(){n.time--,0===n.time?r.close().remove():r.content(r.original.content+n.time)});t.addTimer(r.name,c)}return r},clearTimerById:function(n){n&&window.clearTimeout(this.getTimer(n)),delete i[n]},getTimer:function(n){return i[n]},addTimer:function(n,e){return i[n]=e},timerClose:function(n,e){return window.setInterval(function(){e&&e()},1e3*n)}},n.module("ngArtDialog",[]).provider("$dialog",[function(){this.$get=["$http","$compile","$q",function(n,e,i){return{alert:function(n){return new t(n)},confirm:function(n){return new t(n)},tip:function(n){return new t(n)},loading:function(n){return new t(n)},contentDialog:function(o,r){var c=i.defer();return o.contentUrl&&n.get(o.contentUrl).success(function(n){o.content=n;var i=new t(o);e(i.node)(r),c.resolve(i)}),c.promise}}}]}])});