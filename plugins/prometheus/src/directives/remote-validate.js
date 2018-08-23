define ( function () {
    'use strict';

    /**
     *  默认提交的字段名称field=value
     * 1 . ajaxUrl校验地址
     * 2 . ajaxData {object} 请求额外参数
     */
    return ['$timeout', '$http', '$parse', function ( $timeout, $http, $parse ) {
        return {
            require: "ngModel",
            link   : function ( scope, element, attributes, ngModel ) {
                if ( !ngModel ) {
                    return;
                }
                var url = attributes['ajaxUrl'];

                if ( !url ) {
                    throw new Error ( 'url must offer!' );
                }

                scope.$watch ( attributes.ngModel, function ( newValule, oldValue ) {
                    if ( !ngModel.$isEmpty ( newValule ) ) {
                        $timeout.cancel ( ngModel.timer );
                        ngModel.$error['ajaxValidate'] = undefined;
                        ngModel.timer                  = $timeout ( function () {
                            var postData = $parse ( attributes['ajaxData'] ) ( scope ) || {};

                            // 判断这个上面的ajax校验是否通过， 如果通过了 就再校验
                            // 如果
                            postData.field = newValule;

                            $http ( {
                                method: 'GET', url: url, params: postData
                            } ).success ( function ( data ) {
                                // 如果返回的结果的data里面带的info为true说明存在， 则valid 为false, $error.ajaxValidate = true
                                ngModel.$setValidity ( 'ajaxValidate', data.info );
                            } )
                        }, 500 )
                    }
                } )
            }
        };
    }]
} );
