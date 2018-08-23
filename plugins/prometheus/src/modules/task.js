/**
 * 作者: 翁鹏飞
 *            --- > 亡灵走秀
 * 日期: 2015/10/16
 * 时间: 14:11
 *
 */


define ( ['angular', 'lodash'], function ( angular, _ ) {
    'use strict';

    var taskModule = angular.module ( 'hb.task', [] );

    taskModule.run ( ['$rootScope', 'hbTask', '$http', '$q', '$timeout', function ( $rootScope, hbTask, $http, $q, $timeout ) {
        $rootScope.$on ( 'event:taskQueued', function ( event, data ) {
            hbTask.loadingTask ();
        } )
    }] );

    hbTask.$inject = [];
    function hbTask() {
        this.$get = ['$http', '$rootScope', '$compile', '$q', '$timeout', function ( $http, $rootScope, $compile, $q, $timeout ) {
            var taskService = {
                SuspensionBoxStatus: false,
                box                : null,
                taskQueue          : [],
                addTaskQueue       : function ( $scope, promise ) {
                    taskService.taskQueue.push ( promise );
                    $scope.$emit ( 'event:taskQueued', 123 );
                },
                showSuspensionBox  : function () {
                    if ( !this.SuspensionBoxStatus ) {
                        this.SuspensionBoxStatus = true;
                        this.box                 = angular.element ( '<div class="hb-ajax-task" hb-parade></div>' );
                        angular.element ( 'body' ).append ( $compile ( this.box ) ( $rootScope ) );
                    }
                },
                hideSuspensionBox  : function () {
                    if ( this.taskQueue.length === 0 ) {
                        if ( this.SuspensionBoxStatus ) {
                            this.box.remove ();
                            this.box                 = null;
                            this.SuspensionBoxStatus = false;
                            taskService.watchSome ();
                        }
                    }
                },
                loadingTask        : function () {
                    var self = this;
                    angular.forEach ( this.taskQueue, function ( item, index ) {
                        if ( !item.request ) {
                            item.method       = 'get';
                            item.request      = true;
                            item.response     = false;
                            item.requestTime  = new Date ().getTime ();
                            item.responseTime = null;
                            item.$$__key      = '$$__key' + new Date ().getTime ();
                            $http ( item ).success ( function ( data ) {
                                item.request      = false;
                                item.response     = true;
                                item.responseTime = new Date ().getTime ();
                                _.remove ( self.taskQueue, function ( tq ) {
                                    return tq.$$__key === item.$$__key;
                                } );
                                self.hideSuspensionBox ();
                            } ).error ( function ( data ) {
                                item.responseError = true;
                                item.errorReturn   = data;
                            } )
                        }
                    } );
                    this.showSuspensionBox ();
                }
            };
            return taskService;
        }];
    }

    taskModule.provider ( 'hbTask', hbTask );

    parade.$inject = ['hbTask', '$timeout'];
    function parade( hbTask, $timeout ) {
        return {
            restrict: 'AE',
            template: '<div class="task-queue-con"><div class="task-queue-close"></div><div class="task-queue-content"  ng-repeat="task in taskQueue">{{task.name}}</div></div>',
            compile : function ( $tElement, $tAttr ) {
                return {
                    post: function ( $scope ) {
                        $scope.taskQueue = hbTask.taskQueue;
                        hbTask.watchSome = $scope.$on ( 'event:taskQueued', function () {
                            $timeout ( function () {
                                $scope.taskQueue = hbTask.taskQueue;
                            } )
                        } )
                    }
                }
            }
        };
    }

    taskModule.directive ( 'hbParade', parade );
} );
