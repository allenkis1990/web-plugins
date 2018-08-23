/**
 * 作者: 翁鹏飞
 *            --- > 亡灵走秀
 * 日期: 2015/7/28
 * 时间: 17:31
 *
 */
define(['webuploader', 'cropper'],
    function (WebUploader) {

        'use strict';

        /**
         *
         *  define(['angularComponents/directives/upload-head-directive'], function (uploadHead) {
                 ngModule.directive ( 'uploadHead', uploadHead ( {
                    context       : '{"domain":"accountant.com","gUID":"e39bd09a084b4d119a9c5c32e2668260","ip":"192.168.1.72","organizationId":"-1","platformId":"4028812b569c57e001569c5a71a00000","platformVersionId":"4028812b569c57e001569c5a727f0001","projectId":"4028812b569c57e001569c5a73d70004","recordChain":true,"requestUrl":"http://accountant.com:9000/web/login/login/getUserInfo.action","sourceId":"-1","subProjectId":"4028812b569c57e001569c5a74240006","test":false,"unitId":"4028812b569cbdc001569cc00f4d0000","userId":"4028812b569c57e001569c5a75f6000b"}',
                    requestContext: '{"domain":"accountant.com","gUID":"e39bd09a084b4d119a9c5c32e2668260","ip":"192.168.1.72","organizationId":"-1","platformId":"4028812b569c57e001569c5a71a00000","platformVersionId":"4028812b569c57e001569c5a727f0001","projectId":"4028812b569c57e001569c5a73d70004","recordChain":true,"requestUrl":"http://accountant.com:9000/web/login/login/getUserInfo.action","sourceId":"-1","subProjectId":"4028812b569c57e001569c5a74240006","test":false,"unitId":"4028812b569cbdc001569cc00f4d0000","userId":"4028812b569c57e001569c5a75f6000b"}',
                    uploadImageUrl: "http://172.17.0.102:8080/Upload", // 必须提供
                    uploadSync: true  // defualt: true
                } ) );
             })

         <button ng-click="model.uploadHead=true">上传头像</button>

         <div ng-if="model.uploadHead">
         <div upload-head ng-model="model.uploadHeadValue" close="model.uploadHead" style="display: none;">

         </div>
         </div>

         1. ng-model // *
         2. close 窗口关闭为true
         *
         */

        return ['$timeout', '$log', '$rootScope', 'HB_notification',
            function ($timeout, $log, $rootScope, HB_notification) {
                var options = $rootScope.uploadConfigOptions;

                $('head').append('<link href="../bower_components/cropper/dist/cropper.css" rel="stylesheet">');
                return {
                    scope: {
                        closeVar: '=close',
                        aspectRatio: '=?',
                        mouseWheelZoom: '=?',
                        autoCropArea: '=?',
                        previewSelector: '=?'
                    },
                    require: 'ngModel',
                    restrict: 'A',
                    templateUrl: function ($element, $attr) {
                        return $attr.templateUrl || 'templates/tpls/tpl-upload-head-img-tpl.html';
                    },
                    link: function ($scope, element, attrs, ngModuleCtrl) {
                        if (!options) {
                            return false;
                        }
                        // 图片展示容器
                        var imagePreviewContainer = $('#image_preview_container'),
                            file = null,
                            //
                            defaultConfiguration = $.extend({}, {
                                // {Selector} [可选] [默认值：undefined] 指定Drag And Drop拖拽的容器，如果不指定，则不启动。
                                // {Selector} [可选] [默认值：false] 是否禁掉整个页面的拖拽功能，如果不禁用，图片拖进来的时候会默认被浏览器打开。
                                disableGlobalDnd: false, dnd: undefined,
                                pick: {
                                    id: '#upload_btn',
                                    innerHTML: attrs.buttonText || '选择文件',
                                    //{Boolean} 是否开起同时选择多个文件能力。
                                    multiple: false
                                },
                                formData: {
                                    context: options.context,
                                    requestContext: options.requestContext
                                },

                                // 设置用什么方式去生成缩略图。
                                thumb: {
                                    quality: 70,

                                    // 不允许放大
                                    allowMagnify: false,

                                    // 是否采用裁剪模式。如果采用这样可以避免空白内容。
                                    crop: false
                                },
                                accept: {
                                    title: 'files',
                                    extensions: 'jpg,png'
                                },
                                compress: false,
                                auto: false,
                                swf: options.swf || '/bower_components/fex-webuploader/dist/Uploader.swf',
                                server: options.uploadImageUrl + '?uploadSync=' + (typeof options.uploadSync === 'undefined' ? true : options.uploadSync),
                                // 上传最大并发数: 默认---3
                                threads: 3
                            }, attrs),
                            events = {
                                /*
                                 * param --file {File}File对象
                                 *
                                 * 当文件被加入队列以后触发。
                                 */
                                fileQueued: 'fileQueued',
                                beforeFileQueued: 'beforeFileQueued',
                                /*
                                 * param --file {File}File对象
                                 *			response {Object}服务端返回的数据
                                 *	当文件上传成功时触发。
                                 */
                                uploadSuccess: 'uploadSuccess',
                                uploadError: 'uploadError'
                            };

                        var instance = new WebUploader.Uploader(defaultConfiguration);
                        $scope.uploading = false;

                        $scope.windowConfig = {
                            title: false,
                            visible: true,
                            resizable: false,
                            draggable: false,
                            modal: true,
                            open: function () {
                                var width = 665,
                                    height = 530,
                                    theWindow = this.element.parent();
                                theWindow.css({
                                    position: 'fixed',
                                    left: '50%',
                                    top: '50%',
                                    marginLeft: '-' + (width / 2) + 'px',
                                    marginTop: '-' + (height / 2) + 'px'
                                });
                                element.show();
                            },
                            close: function () {
                                $timeout(function () {
                                    $scope.closeVar = false;
                                }, 500);
                            }
                        };

                        function myLoading () {
                            return $('<div>加载中</div>')

                                .css({
                                    background: '#3ca2e2',
                                    color: 'white',
                                    padding: '4px 4px',
                                    width: '70px',
                                    borderRadius: '4px',
                                    position: 'absolute',
                                    left: '50%',
                                    top: '50%',
                                    marginLeft: '-40px',
                                    marginTop: '-15px',
                                    display: 'none'
                                });
                        }

                        $scope.myloading = myLoading();

                        element.find('.or-img-box').append($scope.myloading);

                        function uploadImg () {
                            var Info = imagePreviewContainer.cropper('getData'),
                                server = instance.options.server,
                                result = server + '&needOperate=' + (function () {
                                    var arr = [];
                                    Info.type = 'truncate';
                                    arr.push(Info);
                                    return angular.toJson(arr);
                                })();

                            //&needOperate=[{type:\'truncate\',x:40,y:40, width: 50,height:50}]
                            instance.option('server', result);

                            instance.upload();
                        }

                        instance.on(events.beforeFileQueued, function () {
                            instance.reset();
                        });

                        instance.on(events.fileQueued, function (file) {
                            instance.file = file;
                            $scope.myloading.show();
                            instance.makeThumb(file, function (error, src) {
                                    if (error) {
                                        HB_notification.alert('不能预览');
                                        return;
                                    }

                                    if (!$scope.cropperInstalled) {
                                        $timeout(function () {
                                            imagePreviewContainer.attr('src', src);
                                            imagePreviewContainer.cropper({
                                                aspectRatio: $scope.aspectRatio || 9 / 9,
                                                mouseWheelZoom: !!$scope.mouseWheelZoom,
                                                preview: $scope.previewSelector || '.img-preview',
                                                autoCropArea: $scope.autoCropArea || 0.65
                                            });
                                            $scope.cropperInstalled = true;
                                            $scope.myloading.hide();
                                        });
                                    } else {
                                        imagePreviewContainer.cropper('replace', src);
                                    }
                                }, 1,// 当值是0-1的时候 为百分百
                                1 // 当值是0-1的时候 为百分百
                            );
                        });

                        instance.on(events.uploadSuccess, function (file, response) {
                            $timeout(function () {
                                var res = angular.fromJson(response);
                                ngModuleCtrl.$setViewValue(res);
                                $scope.uploading = false;
                                $scope.node && $scope.node.uploadHeadWindow && $scope.node.uploadHeadWindow.close();
                            });
                        });

                        instance.on(events.uploadError, function (file, response) {
                            $timeout(function () {
                                file.setStatus('inited ');
                                $scope.node.uploadHeadWindow.close();
                                $scope.uploading = false;
                            });
                        });

                        $scope.bigger = function () {
                            imagePreviewContainer.cropper('zoom', '0.1');
                        };
                        $scope.smaller = function () {
                            imagePreviewContainer.cropper('zoom', '-0.1');
                        };
                        $scope.leftScale = function () {
                            imagePreviewContainer.cropper('rotate', '-15');
                        };
                        $scope.rightScale = function () {
                            imagePreviewContainer.cropper('rotate', '15');
                        };
                        $scope.baseSize = function () {
                            imagePreviewContainer.cropper('reset');
                        };
                        $scope.getResult = function ($event) {
                            if ($scope.uploading) {
                                return false;
                            }

                            if ($event && $event.target) {
                                $($event.target).val('上传中...');
                            }

                            $scope.uploading = true;
                            var getData = imagePreviewContainer
                                .cropper('getData');
                            var scale = imagePreviewContainer.get(0).naturalWidth / instance.file._info.width;
                            getData.scale = scale;

                            instance.file._cropData = {
                                x: getData.x,
                                y: getData.y,
                                width: getData.width,
                                height: getData.height,
                                scale: getData.scale
                            };
                            uploadImg();
                        };
                    }
                };
            }];
    });
