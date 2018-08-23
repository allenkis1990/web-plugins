/**
 * 作者: 翁鹏飞
 *            --- > 亡灵走秀
 * 日期: 2015/8/19
 * 时间: 10:47
 *
 */

define ( ['angular'], function ( angular ) {
    'use strict';

    var HB_interceptor = angular.module ( 'HB_interceptor', [] )

        .provider ( 'HBInterceptor',
            [function () {
                var that          = this;
                this.app          = undefined;
                this.loginPageStr = undefined;
                this.$get         = [function () {
                    return {
                        getAppString: function () {
                            return that.app;
                        },
                        getApp      : function () {
                            return that.app === 'admin' ? 2 : 1;
                        },
                        getLoginPage: function () {
                            return that.loginPageStr || '/login/index.html';
                        },
                        toLoginPage : function () {
                            window.location.href = this.getLoginPage ();
                        }
                    }
                }]
            }] )

        .config ( ['$httpProvider', function ( $httpProvider ) {

            $httpProvider.interceptors.push ( 'ajaxInterceptor' );

        }] )

        .run ( ['hbLoginService', 'HBInterceptor', '$rootScope', 'HB_notification', '$http',
            function ( hbLoginService, HBInterceptor, $rootScope, HB_notification, $http ) {
                $rootScope.$on ( 'event:ajaxRequestErrorResponse', function ( a, response ) {
                    switch ( response['code'] ) {
                        case 401:
                            hbLoginService.createLoginForm ();
                            break;
                        case 404:
                            HB_notification.showTip ( '请求地址找不到!', 'error' );
                            break;
                        case 500:
                            HB_notification.add500Error ( $rootScope, response );
                            break;
                        case 403:
                            HB_notification.showTip ( '当前请求没权限!', 'error' );
                            break;
                    }
                } );

                $rootScope.$on ( 'event:error_5oo_add_error', function () {
                    HB_notification.show500Error ();
                } );

                HBInterceptor.getApp () === 2 ? (function () {
                    HBInterceptor.storeVar = 'adminUserInfo';
                }) () : (function () {
                    HBInterceptor.storeVar = 'frontUserInfo';
                }) ();

                $.ajaxSetup ( {
                    cache     : false,
                    statusCode: {
                        404: function ( data, aa, bb ) {
                            $rootScope.$broadcast ( 'event:ajaxRequestErrorResponse', {
                                code: 404
                            } );
                        },
                        401: function ( data ) {
                            $rootScope.$broadcast ( 'event:ajaxRequestErrorResponse', { code: 401 } );
                        },
                        500: function ( data, ee, aa, cc ) {
                            $rootScope.$broadcast ( 'event:ajaxRequestErrorResponse', {
                                message: data['responseJSON'],
                                code   : data.status
                            } );
                        },
                        403: function ( data, ee, aa, cc ) {
                            $rootScope.$broadcast ( 'event:ajaxRequestErrorResponse', { code: 403 } );
                        }
                    }
                } );

            }] );

    HB_interceptor.factory ( 'ajaxInterceptor', ['$q', '$rootScope',
        function ( $q, $rootScope ) {
            var responseInterceptor = {
                request      : function ( request ) {
                    if ( request.url.indexOf ( '/web/' ) !== -1 ) {
                        if ( request.url.indexOf ( '?' ) !== -1 ) {
                            request.url += ('&_q_=' + Date.now ());
                        } else {
                            request.url += ('?_q_=' + Date.now ());
                        }
                    }
                    return request;
                },
                responseError: function ( rejection ) {
                    $rootScope.$broadcast ( 'event:ajaxRequestErrorResponse', {
                        code   : rejection.status,
                        message: rejection.data
                    } );
                    return $q.reject ( rejection );
                }
            };
            return responseInterceptor;
        }] )

        .factory ( 'cookieOp', [function () {
            return {
                rememberPassword: function ( var_, info, date ) {
                    var Days = 30,
                        exp  = new Date ();
                    exp.setTime ( exp.getTime () + Days * 24 * 60 * 60 * 1000 );

                    var expires = exp.toGMTString ();

                    if ( typeof date !== 'undefined' ) {
                        var oldDate = new Date ();
                        oldDate.setDate ( oldDate.getDate () + date );
                        expires = oldDate.toGMTString ();
                    }

                    document.cookie = var_ + '=' + angular.toJson ( info ) + ";expires=" + expires + ';path=/';
                },
                removeFromCookie: function ( key ) {
                    this.rememberPassword ( key, 1, 1, -1 );
                },
                getUserCookie   : function ( key ) {
                    var arr, reg = new RegExp ( "(^| )" + key + "=([^;]*)(;|$)" );
                    if ( arr = document.cookie.match ( reg ) )
                        return unescape ( arr[2] );
                }
            }
        }] )

    HB_interceptor.factory ( 'hbLoginService', ['$injector', '$rootScope', '$http', '$state', '$stateParams', 'cookieOp', 'HBInterceptor', '$q', '$interval', '$log',
        function ( $injector, $rootScope, $http, $state, $stateParams, cookieOp, HBInterceptor, $q, $interval, $log ) {
            var hbLoginServiceInstance               = {};
            hbLoginServiceInstance.getScriptInterval = null;
            hbLoginServiceInstance.createLoginForm   = function () {
                if ( !hbLoginServiceInstance.loginForm ) {
                    var loginHtml                    = '<div hb-login-form></div>',
                        $compile                     = $injector.get ( '$compile' ),
                        linkFunc                     = $compile ( loginHtml ) ( $rootScope );
                    hbLoginServiceInstance.loginForm = linkFunc;
                    angular.element ( 'body' ).append ( linkFunc );
                }
            };

            hbLoginServiceInstance.closeLoginForm = function () {
                $interval.cancel ( hbLoginServiceInstance.getScriptInterval );
                $log.info ( '关闭获取登录票......' + new Date ().toLocaleString () );
                if ( this.loginForm ) {
                    this.loginForm.remove ();
                    this.loginForm = undefined;
                }
            };

            function rememberThePass( $theScopeModel ) {
                // 当选中记住密码的时候，登录完成执行记住密码操作， 将密码账号保存到本地cookie当中
                if ( $theScopeModel['rememberPass'] ) {
                    cookieOp.rememberPassword ( HBInterceptor.storeVar, {
                        userName: $theScopeModel.userName,
                        password: $theScopeModel.password
                    } );
                } else {
                    cookieOp.removeFromCookie ( HBInterceptor.storeVar );
                }
            }

            function encodeReturnCode( data, $theScopeModel ) {
                var defer       = $q.defer (),
                    promise     = defer.promise;
                var loginResult = {
                        style  : {
                            marginLeft: '30px',
                            fontSize  : '13px',
                            fontWeight: 'bold'
                        },
                        message: '没有定义的错误'
                    },
                    code        = data.code;
                switch ( code ) {
                    case 600:
                        loginResult.style.color = 'yellow';
                        loginResult.message     = '等待登录!';
                        defer.resolve ( loginResult );
                        break;
                    case 603:
                        $http ( {
                            url    : data.location,
                            method : 'get',
                            headers: {
                                "X-Requested-With": "X-Request-With"
                            }
                        } ).success ( function ( retu ) {
                            var result = retu.state || retu.status;
                            if ( result ) {
                                HBInterceptor.userInfo  = $theScopeModel;
                                loginResult.style.color = 'green';
                                loginResult.message     = '登录成功!';
                                hbLoginServiceInstance.closeLoginForm ();
                                rememberThePass ( $theScopeModel );
                                $state.reload ( $state.current );
                                defer.resolve ( loginResult );
                            }
                        } );
                        break;
                    case 604:
                        loginResult.style.color = 'blue';
                        loginResult.message     = '登录成功，账户未绑定!';
                        defer.resolve ( loginResult );
                        break;
                    case 610:
                        loginResult.style.color = 'red';
                        loginResult.message     = '用户名密码不匹配';
                        defer.resolve ( loginResult );
                        break;
                    case 611:
                        loginResult.style.color = 'gray';
                        loginResult.message     = '帐户被锁定';
                        defer.resolve ( loginResult );
                        break;
                }
                return promise;
            }

            hbLoginServiceInstance.getLoginScript = function ( $scope ) {
                return $http ( {
                    url   : '/web/login/login/getLoginParameters.action',
                    method: 'get'
                } )
                    .success ( function ( data ) {
                        // 清除数据
                        var loginScript = $ ( '#_login_script' );
                        if ( loginScript.length > 0 ) {
                            loginScript.remove ();
                            delete window.ssoLogin;
                            delete window.loginThen;
                        }

                        window.loginThen = function ( data ) {
                            $scope.$apply ( function () {
                                encodeReturnCode ( data, $scope.model )
                                    .then ( function ( data ) {
                                        $scope.model.loginResult = data;
                                        $interval.cancel ( hbLoginServiceInstance.getScriptInterval );
                                    } )
                            } )
                        };
                        var script       = document.createElement ( "script" );
                        script.id        = '_login_script';
                        script.type      = "text/javascript";
                        script.src       = data.info.casDomain + "/login?TARGET=" + data.info.currentDomain + "/web/sso/auth&js&callback=loginThen&" + new Date ().getTime ();
                        angular.element ( 'head' ).append ( script );
                    } );
            };

            return hbLoginServiceInstance;
        }] )

    //
    // HB_interceptor.directive ( 'hbLoginForm', LoginDirective );
    // LoginDirective.$inject = ['hbLoginService', 'cookieOp', '$interval', '$log'];
    // function LoginDirective( hbLoginService, cookieOp, $interval, $log ) {
    //     var linkFunc   = {};
    //     linkFunc.scope = {};
    //     linkFunc.link  = function ( $scope, $element, $attr, $controller ) {
    //
    //         $log.info ( '开启每3分钟获取登录票...' + new Date ().toLocaleString () );
    //         $scope.handler = $controller.handler;
    //         // 3分钟去获取一次登录票
    //         $interval.cancel ( hbLoginService.getScriptInterval );
    //         hbLoginService.getLoginScript ( $scope );
    //         hbLoginService.getScriptInterval = $interval ( function () {
    //             $log.info ( '获取登录票...' + new Date ().toLocaleString () );
    //             hbLoginService.getLoginScript ( $scope );
    //         }, 60000 * 3 );
    //
    //         $scope.$on ( '$destroy', function () {
    //             $interval.cancel ( hbLoginService.getScriptInterval );
    //         } )
    //     };
    //
    //     linkFunc.controller  = ['hbLoginService', 'HBInterceptor', '$scope', '$window', '$element',
    //         function ( hbLoginService, HBInterceptor, $scope, $window, $element ) {
    //             $scope.model          = {};
    //             var userInfo          = cookieOp.getUserCookie ( HBInterceptor.storeVar );
    //             userInfo              = ( userInfo && angular.fromJson ( userInfo ) ) || { userName: '', password: '' };
    //             $scope.model.userName = userInfo.userName;
    //             $scope.model.password = userInfo.password;
    //             if (
    //                 $scope.model.userName !== ''
    //                 && $scope.model.password !== ''
    //                 && angular.isDefined ( $scope.model.userName )
    //                 && angular.isDefined ( $scope.model.password )
    //             ) {
    //                 $scope.model.rememberPass = true;
    //             } else {
    //                 $scope.model.rememberPass = false;
    //             }
    //             this.handler = {
    //                 closeLoginForm: function ( $e ) {
    //                     hbLoginService.closeLoginForm ();
    //                     $e.preventDefault ();
    //                 },
    //
    //                 login     : function ( $e ) {
    //                     if ( $scope.theLoginForm.$invalid ) return false;
    //                     var loginHandle = ssoLogin || {};
    //                     if ( loginHandle ) {
    //                         var loginParams = {
    //                             accountType: HBInterceptor.getApp (),
    //                             username   : $scope.model.userName,
    //                             password   : $scope.model.password
    //                         };
    //                         loginHandle.login ( loginParams, "{'portalType':'mall'}" );
    //                     }
    //                 },
    //                 forgotPass: function ( $e ) {
    //                     $window.location.href = '/login/forgetPassword.html';
    //                     if ( $e ) {
    //                         $e.preventDefault ();
    //                     }
    //                 },
    //                 enterKeyDo: function ( $e ) {
    //                     if ( $e.keyCode === 13 ) {
    //                         this.login ( $e );
    //                     }
    //                 }
    //             }
    //         }];
    //     linkFunc.templateUrl = function ( $element, $attr ) {
    //         return $attr.templateUrl || 'templates/common/login.html';
    //     };
    //     linkFunc.restrict    = 'AE';
    //     return linkFunc;
    // }
} );
