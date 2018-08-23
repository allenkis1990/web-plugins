/**
 * 作者: 翁鹏飞
 *            --- > 亡灵走秀
 * 日期: 2015/8/29
 * 时间: 14:34
 *
 */

define ( ['angular', 'jqueryNiceScroll'], function ( angular ) {
    'use strict';
    var hbNiceScrollModule = angular.module ( 'hb.niceScroll', [] );

    hbNiceScrollModule.directive ( 'hbNiceScroll', hbNiceScroll );
    hbNiceScroll.$inject = ['$timeout', '$parse', '$q'];
    function hbNiceScroll( $timeout, $parse, $q ) {
        return {
            restrict: 'A',
            scope   : {
                hideOnSomeOp : '=',
                hideMode     : '=',
                niceScrollEnd: '&'
            },
            link    : function ( $scope, $element, $attr ) {
                $element.nice = $element.getNiceScroll ();
                $element.css ( { overflow: 'hidden' } );
                function init() {
                    if ( $element.nice.length <= 0 ) {
                        var niceOption = $scope.$eval ( $attr['niceOption'] );
                        $element.niceScroll ( angular.extend ( {},
                            niceOption, {
                                autohidemode: false,
                                cursorborder: 'none',
                                cursorcolor : 'rgb(47, 64, 74)'
                            }
                        ) );
                        $element.nice = $element.getNiceScroll ();
                    }
                }

                $scope.$watch ( 'hideOnSomeOp', function ( nl, ol ) {
                    if ( !nl ) {
                        $element.nice.hide ();
                    } else {
                        $timeout ( function () {
                            $element.nice.show ();
                        }, 500 );
                    }
                } );
                $timeout ( function () {
                    init ();
                }, 1000 );
            }
        }
    }
} );