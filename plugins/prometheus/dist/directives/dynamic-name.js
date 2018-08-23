/**
 * prometheus - 普罗米修斯
 * @author 
 * @version v1.0.91
 * @link 
 * @license MIT
 */
define(function(){"use strict";return[function(){return{require:"ngModel",link:function(n,o,r,e){if(!e)throw new Error("必须有ng-model");var t=r.prefixName;t&&""!==t||(t=o[0].tagName.toLowerCase()),e.$name=t+n.$eval(r.dynamicName);var a=o.controller("form")||{$addControl:angular.noop};a.$addControl(e),n.$on("$destroy",function(){a.$removeControl(e)})}}}]});