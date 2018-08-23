/**
 * prometheus - 普罗米修斯
 * @author 
 * @version v1.0.91
 * @link 
 * @license MIT
 */
define(function(){"use strict";return["$timeout","$http","$parse",function(t,r,e){return{require:"ngModel",link:function(i,a,n,o){if(o){var u=n.ajaxUrl;if(!u)throw new Error("url must offer!");i.$watch(n.ngModel,function(a,f){o.$isEmpty(a)||(t.cancel(o.timer),o.$error.ajaxValidate=void 0,o.timer=t(function(){var t=e(n.ajaxData)(i)||{};t.field=a,r({method:"GET",url:u,params:t}).success(function(t){o.$setValidity("ajaxValidate",t.info)})},500))})}}}}]});