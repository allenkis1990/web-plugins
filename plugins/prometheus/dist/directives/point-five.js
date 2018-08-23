/**
 * prometheus - 普罗米修斯
 * @author 
 * @version v1.0.91
 * @link 
 * @license MIT
 */
define([],function(){"use strict";return[function(){return{require:"?^ngModel",link:function(i,t,e,n){var r=function(i){return(n.$viewValue-0)%.5!==0?(n.$setValidity("pointFive",!1),!1):(n.$setValidity("pointFive",!0),i)};n.$formatters.push(r),n.$parsers.unshift(r)}}}]});