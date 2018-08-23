/**
 * Created by wengpengfei on 2016/4/25.
 */

define ( [], function () {
    "use strict";
    /**
     * 是否是0.5的倍数
     * # completed at 2016-11-24 13:40:00 ---> 翁鹏飞
     */
    return [function () {
        return {
            require: '?^ngModel',
            link   : function ( $scope, $element, $attr, ngModel ) {

                var validator = function ( value ) {
                    if ( (ngModel.$viewValue - 0) % 0.5 !== 0 ) {
                        ngModel.$setValidity ( 'pointFive', false );
                        return false;
                    } else {
                        ngModel.$setValidity ( 'pointFive', true );
                        return value;
                    }
                };

                ngModel.$formatters.push ( validator );
                ngModel.$parsers.unshift ( validator );
            }
        }
    }]
} );