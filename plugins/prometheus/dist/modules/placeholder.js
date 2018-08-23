/**
 * prometheus - 普罗米修斯
 * @author 
 * @version v1.0.91
 * @link 
 * @license MIT
 */
define(["angular"],function(e,n){"use strict";var r,t;r="placeholder",t={},e.module("Placeholder",[]).directive("placeholder",["$document","$timeout",function(a,o){function s(e){return e&&"password"===e.toLowerCase()}return e.forEach(["INPUT","TEXTAREA"],function(e){t[e]=a[0].createElement(e)[r]===n}),{require:"?^ngModel",restrict:"A",link:function(e,n,a,l){var u,i,c;c=a[r],u=a[r+"Class"]||r,i=t[n[0].nodeName],n.bind("blur",function(){var e;e=n.val(),e||(n.addClass(u),i&&o(function(){n.val(c)},1))}),n.bind("focus",function(){i&&n.hasClass(u)&&n.val(""),n.removeClass(u)}),i&&l.$formatters.unshift(function(e){return s(n.prop("type"))?e:e?(n.removeClass(u),e):(n.addClass(u),c)})}}}])});