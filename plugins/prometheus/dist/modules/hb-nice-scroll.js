/**
 * prometheus - 普罗米修斯
 * @author 
 * @version v1.0.91
 * @link 
 * @license MIT
 */
define(["angular","jqueryNiceScroll"],function(e){"use strict";function c(c,n,i){return{restrict:"A",scope:{hideOnSomeOp:"=",hideMode:"=",niceScrollEnd:"&"},link:function(n,i,o){function r(){if(i.nice.length<=0){var c=n.$eval(o.niceOption);i.niceScroll(e.extend({},c,{autohidemode:!1,cursorborder:"none",cursorcolor:"rgb(47, 64, 74)"})),i.nice=i.getNiceScroll()}}i.nice=i.getNiceScroll(),i.css({overflow:"hidden"}),n.$watch("hideOnSomeOp",function(e,n){e?c(function(){i.nice.show()},500):i.nice.hide()}),c(function(){r()},1e3)}}}var n=e.module("hb.niceScroll",[]);n.directive("hbNiceScroll",c),c.$inject=["$timeout","$parse","$q"]});