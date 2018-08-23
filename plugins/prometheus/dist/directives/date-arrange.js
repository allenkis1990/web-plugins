/**
 * prometheus - 普罗米修斯
 * @author 
 * @version v1.0.91
 * @link 
 * @license MIT
 */
define(function(e){"use strict";return["$rootScope",function(e){return{scope:{startDate:"=",endDate:"=",config:"=",sbMode:"="},controller:["$scope","$timeout",function(t,n){function a(e){return!e||""===e||null===e||0===(e+"").replace(/(^s*)|(s*$)/g,"").length}function r(e,n,r){a(e)?t.node[n][r]("max"===r?o.maxDate:o.minDate):t.node[n][r](e)}t.datePickerConfig={culture:"zh-CN",format:"yyyy-MM-dd"},angular.extend(t.datePickerConfig,t.config);var o=this;this.minDate=new Date(1997,0,1),this.maxDate=new Date((new Date).getFullYear()+100,0,1);var i=t.$watch("startDate",function(e,t){n(function(){r(e,"endDate","min")})}),c=t.$watch("endDate",function(e,t){n(function(){r(e,"startDate","max")})});t.sbMode&&t.$watch("endDate",function(n){n?(t.mustOfferEndTime=!1,e.$broadcast("events:mustOfferEndTime",!1)):t.startDate&&(t.mustOfferEndTime=!0)}),t.$on("events:mustOfferEndTime",function(e,n){t.mustOfferEndTime=n}),t.$on("$destroy",function(){i(),c()})}],templateUrl:function(e,t){return t.templateUrl||"templates/tpls/tpl-date-arrange.html"},link:function(e,t,n){e.arrangeConfig={startPlaceholder:n.startPlaceholder||"请选择开始时间",endPlaceholder:n.endPlaceholder||"请选择结束时间"}}}}]});