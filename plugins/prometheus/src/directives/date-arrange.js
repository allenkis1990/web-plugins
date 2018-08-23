/**
 * Created by wengpengfei on 2016/11/28.
 */
define ( function ( mod ) {
    'use strict';

    /**
     *
     */
    return ['$rootScope', function ( $rootScope ) {
        return {
            scope      : {
                startDate: '=',
                endDate  : '=',
                config   : '=',
                sbMode   : '='
            },
            controller : ['$scope', '$timeout',
                function ( $scope, $timeout ) {

                    function isEmptyString( val ) {
                        if ( !val || val === '' || val === null || ((val + '').replace ( /(^s*)|(s*$)/g, "" ).length) === 0 ) {
                            return true;
                        }
                        return false;
                    }

                    $scope.datePickerConfig = {
                        culture: 'zh-CN',
                        format : "yyyy-MM-dd"
                    };
                    angular.extend ( $scope.datePickerConfig, $scope.config );

                    var self = this;

                    /**
                     * 判断字符串是否为空
                     * @param val
                     * @returns {boolean}
                     */

                    this.minDate = new Date ( 1997, 0, 1 );
                    this.maxDate = new Date ( new Date ().getFullYear () + 100, 0, 1 );
                    function setMaxMin( value, who, method ) {
                        if ( !isEmptyString ( value ) ) {
                            $scope.node[who][method] ( value );
                        } else {
                            $scope.node[who][method] ( method === 'max' ? self.maxDate : self.minDate );
                        }
                    }

                    var startDateWatch = $scope.$watch ( 'startDate', function ( nV, oV ) {
                        $timeout ( function () {
                            setMaxMin ( nV, 'endDate', 'min' );
                        } )
                    } );

                    var endDateWatch = $scope.$watch ( 'endDate', function ( nV, oV ) {
                        $timeout ( function () {
                            setMaxMin ( nV, 'startDate', 'max' );
                        } )
                    } );

                    if ( $scope.sbMode ) {
                        $scope.$watch ( 'endDate', function ( nv ) {
                            if ( nv ) {
                                $scope.mustOfferEndTime = false;
                                $rootScope.$broadcast ( 'events:mustOfferEndTime', false );
                            } else {
                                if ( $scope.startDate ) {
                                    $scope.mustOfferEndTime = true;
                                }
                            }
                        } );
                    }
                    $scope.$on ( 'events:mustOfferEndTime', function ( event, data ) {
                        $scope.mustOfferEndTime = data;
                    } )

                    $scope.$on ( '$destroy', function () {
                        startDateWatch ();
                        endDateWatch ();
                    } )
                }],
            templateUrl: function ( element, attrs ) {
                return attrs.templateUrl || 'templates/tpls/tpl-date-arrange.html';
            },
            link       : function ( $scope, $element, $attr ) {
                $scope.arrangeConfig = {
                    startPlaceholder: $attr.startPlaceholder || '请选择开始时间',
                    endPlaceholder  : $attr.endPlaceholder || '请选择结束时间'
                }
            }
        };
    }]
} );
