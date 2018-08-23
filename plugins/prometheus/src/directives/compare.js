/**

 * Created by wengpengfei on 2016/4/25.
 */
define ( [], function () {
    "use strict";

    /**
     * 对比两个文本的内容是否相等
     * # completed at 2016-11-24 13:48:00 ---> 翁鹏飞
     */
    return ['$timeout', '$parse', function ( $timeout, $parse ) {
        return {
            require: "ngModel",
            link   : function ( $scope, element, attributes, ngModel ) {
                if ( !ngModel ) return;

                var getter = $parse ( attributes.hbCompare );

                function setValidity( myValue, compareValue ) {
                    var result = myValue === compareValue;
                    $timeout ( function () {
                        ngModel.$setValidity ( 'compare', result );
                    } );
                }

                element.on ( 'keyup change', function () {
                    setValidity ( getter ( $scope ), element.val () );
                } );

                $scope.$watch ( attributes['hbCompare'], function ( value ) {
                    setValidity ( element.val (), value );
                } );
            }
        };
    }];
} );
