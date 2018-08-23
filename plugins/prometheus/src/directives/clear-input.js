/**
 * Created by wengpengfei on 2016/4/25.
 */
define ( [], function () {
    "use strict";
    /**
     * 指令只是支持普通的input的标签， 和kendoDateTimePicker, kendoDatePicker;
     * # completed at 2016-11-24 13:40:00 ---> 翁鹏飞
     */
    return ['$timeout', '$parse', '$animate',
        function ( $timeout, $parse, $animate ) {
            var _undefined = arguments[-1];

            return {
                restrict  : 'A',
                require   : '?ngModel',
                transclude: true,
                link      : function ( $scope, $element, attr, ngModelCtrl, $transclude ) {

                    var modelName = attr.ngModel || attr.kNgModel;
                    ngModelCtrl   = ngModelCtrl || {
                            $isEmpty: function ( newValue ) {
                                return newValue === 'undefined' || typeof newValue === 'undefined' || newValue === '';
                            }
                        };
                    var dealWay   = {
                        kendoDateTimePicker: function ( $element ) {
                            kendoWidgetAddClear ( '4.8em' );
                        },
                        kendoDatePicker    : function () {
                            kendoWidgetAddClear ( '2.8em' );
                        },
                        kendoComboBox      : function ( $element ) {
                            var $clearInput = genClearInput ( $element );
                            $clearInput.css ( { right: '30px', zIndex: 1 } );
                        }
                    };

                    /**
                     * kendo的组件添加一个删除的按钮
                     * @param width
                     */
                    function kendoWidgetAddClear( width ) {
                        $timeout ( function () {
                            var $clear = $ ( '<span unselectable="on" class="k-icon k-i-close" role="button">select</span>' );
                            $element
                                .next ()
                                .append ( $clear )
                                .css ( { width: width } )
                                .parent ().css ( { paddingRight: width } );

                            $clear.on ( 'click', function ( e ) {
                                clearInputValue ();
                                e.stopPropagation ();
                            } )
                        } )
                    }

                    function clearInputValue() {
                        $scope.$apply ( function () {
                            $parse ( modelName ).assign ( $scope, _undefined );
                        } );

                        var hasKendoDateTimePicker = $element.data ( 'kendoDateTimePicker' ),
                            hasKendoDatePicker     = $element.data ( 'kendoDatePicker' );
                        if ( hasKendoDateTimePicker ) {
                            hasKendoDateTimePicker.value ( '' );
                            hasKendoDateTimePicker.trigger ( 'change' );
                        }
                        if ( hasKendoDatePicker ) {
                            hasKendoDatePicker.value ( '' );
                            hasKendoDatePicker.trigger ( 'change' );
                        }

                    }

                    var $wrap = $ ( '<div>' ).css ( {
                        display : 'inline-block',
                        position: 'relative'
                    } );

                    $element.wrap ( $wrap );

                    function genClearInput( $element ) {
                        var $clearInput = $ ( '<span>' ).html ( 'x' )

                            .css ( {
                                position  : 'absolute',
                                right     : '5px',
                                width     : 15,
                                height    : 15,
                                top       : '50%',
                                color     : '#999999',
                                fontSize  : '15px',
                                marginTop : '-8px',
                                fontWeight: 'bold',
                                textAlign : 'center',
                                cursor    : 'pointer',
                                display   : 'inline-block',
                                lineHeight: '15px'
                            } );

                        ngModelCtrl.$$clearInput = $clearInput;

                        $clearInput.bind ( 'click', function () {
                            clearInputValue ();
                        } );
                        $element.before ( $clearInput );
                        return $clearInput;
                    }

                    function createClearInput( brother ) {
                        var $clearInput = genClearInput ( brother );
                        $clearInput.css ( {
                            width       : '-=20',
                            paddingRight: '20px'
                        } );
                    }

                    /**
                     * 显示清除按钮
                     */
                    function showClearInput() {
                        ngModelCtrl.$$clearInput && ngModelCtrl.$$clearInput.show ();
                    }

                    /**
                     * 隐藏清除按钮
                     */
                    function hideClearInput() {
                        ngModelCtrl.$$clearInput && ngModelCtrl.$$clearInput.hide ();
                    }

                    $scope.$watch ( modelName, function ( newValue ) {
                        if ( ngModelCtrl.$isEmpty ( newValue ) ) {
                            hideClearInput ();
                        } else {
                            showClearInput ();
                        }
                    } );
                    /**
                     * 为了将input用div包裹起来
                     */
                    $transclude ( function ( clone ) {
                        $animate.enter ( clone, $element.parent (), $element );
                        if ( typeof attr['kendoDateTimePicker'] !== 'undefined' ) {
                            dealWay.kendoDateTimePicker ( $element );
                        } else if ( typeof attr['kendoDatePicker'] !== 'undefined' ) {
                            dealWay.kendoDatePicker ( $element );
                        } else if ( typeof attr['kendoComboBox'] !== 'undefined' ) {
                            dealWay.kendoComboBox ( $element );
                        } else {
                            createClearInput ( $element );
                        }
                    } );
                }
            }
        }];
} );
