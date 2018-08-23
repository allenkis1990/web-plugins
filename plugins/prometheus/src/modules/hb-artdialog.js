/**
 * Created by wengpengfei on 2016/9/22.
 */

define ( ["angular", 'artDialog'], function ( angular, artDialog ) {
    'use strict';

    function ngDialog( options ) {
        return this.init ( options );
    }

    var timers = {},
        uuid   = 0;

    ngDialog.prototype = {
        dialogConfig  : {
            okValue    : '确定',
            cancelValue: '取消'
        },
        /**
         *
         * @param obj
         * @param ext
         */
        extend        : function ( obj, ext ) {
            for ( var pro in ext ) {
                if ( !obj.hasOwnProperty ( pro ) ) {
                    obj[pro] = ext[pro];
                }
            }
        },
        /**
         *
         * @param options
         */
        init          : function ( options ) {
            var me = this;
            this.extend ( options, this.dialogConfig );
            if ( options.time ) {
                var oldClose    = options.onclose;
                options.onclose = function () {
                    me.clearTimerById ( this.name );
                    oldClose && oldClose ();
                };
            }
            var nd = artDialog.apply ( this, arguments );

            if ( options.visible ) {
                nd.show ();
            }
            if ( options.modal ) {
                nd.showModal ();
            }

            nd.name = 'ngDialog_' + uuid++;
            if ( options.time ) {
                var timerId = this.timerClose ( 1,
                    function () {
                        options.time--;
                        if ( options.time === 0 ) {
                            nd.close ().remove ();
                        } else {
                            nd.content ( nd.original.content + options.time );
                        }
                    } );
                me.addTimer ( nd.name, timerId );
            }

            return nd;
        },
        /**
         *
         * @param timerName
         */
        clearTimerById: function ( timerName ) {
            timerName && window.clearTimeout ( this.getTimer ( timerName ) );
            delete timers[timerName];
        },
        /**
         *
         * @param name
         * @returns {*}
         */
        getTimer      : function ( name ) {
            return timers[name];
        },
        /**
         *
         * @param name
         * @param id
         * @returns {*}
         */
        addTimer      : function ( name, id ) {
            return timers[name] = id;
        },
        /**
         *
         * @param time
         * @param callback
         * @returns {number}
         */
        timerClose    : function ( time, callback ) {
            return window.setInterval ( function () {
                callback && callback ();
            }, time * 1000 );
        }
    };
    /**
     *
     */
    angular.module ( 'ngArtDialog', [] )
        /**
         *
         */
        .provider ( '$dialog', [function () {
            this.$get = ['$http', '$compile', '$q',
                function ( $http, $compile, $q ) {
                    return {
                        alert        : function ( options ) {
                            return new ngDialog ( options );
                        },
                        confirm      : function ( options ) {
                            return new ngDialog ( options );
                        },
                        tip          : function ( options ) {
                            return new ngDialog ( options );
                        },
                        loading      : function ( options ) {
                            return new ngDialog ( options );
                        },
                        contentDialog: function ( options, $scope ) {
                            var defer = $q.defer ();
                            if ( options.contentUrl ) {
                                $http.get ( options.contentUrl ).success ( function ( data ) {
                                    options.content = data;
                                    var dialog      = new ngDialog ( options );
                                    $compile ( dialog.node ) ( $scope );
                                    defer.resolve ( dialog );
                                } )
                            }
                            return defer.promise;
                        }
                    }
                }]
        }] )

} );