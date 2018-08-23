/**
 * prometheus - 普罗米修斯
 * @author 
 * @version v1.0.91
 * @link 
 * @license MIT
 */
define([],function(){"use strict";return["$timeout","$parse",function(n,e){return{require:"ngModel",link:function(t,i,o,r){function u(e,t){var i=e===t;n(function(){r.$setValidity("compare",i)})}if(r){var a=e(o.hbCompare);i.on("keyup change",function(){u(a(t),i.val())}),t.$watch(o.hbCompare,function(n){u(i.val(),n)})}}}}]});