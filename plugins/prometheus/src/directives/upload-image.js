/**
 * 作者: 翁鹏飞
 *            --- > 亡灵走秀
 * 日期: 2015/6/19
 * 时间: 15:08
 *
 */

define(['webuploader', 'angular'],
    function (WebUploader, angular, undefined) {
        function minError(message) {
            throw new Error(message);
        }

        /**
         *
         * @doc
         *
         *      上传图片说明，此指令仅适用上传图片，其他文件无法适配
         *
         * @example
         *      define(['../xx/upload-image-directive', function(uploadImageDirective) {
         *          angular.module('xxxx', []).directive('uploadImageDirective', uploadImageDirective())
         *
         *          .controller('', ['$scope', function ($scope) {
         *              ////////////////////////////////////////
                        $scope.acceptFileType = "jpg,png,jpeg";
                        // or
                        $scope.acceptFileType = ['jpg', 'png'];
                        ////////////////////////////////////////

                        // 如果提供了scaleImage这个功能则width 和height必须同时又有，否则报错、无法执行下去
                        ////////////////////////////////////////
                        $scope.scaleImage = {
                            width: 100,
                            height: 100
                        };
                        // or
                        // 即使为数组也必须每个数组元素对象同时存在width和height
                        $scope.scaleImage = [
                            {
                                width: 100,
                                height: 100
                            },
                            {
                                width: 200,
                                height: 200
                            }
                        ]
                        ////////////////////////////////////////
                    }])
         *      }])
         *
         *      <div upload-image-directive accept-file-type="accept" scale="scaleImage" ng-model="test"></div>
         *
         *
         *      * accept 可选 默认不给“png,jpg,jpeg,bmp”
         *      * scale 可选
         *      * ngModel 必须提供
         *
         * @type {*[]}
         * @params options {uploadImageUrl: '上传图片的地址', showImageUrl: '显示图片的地址'}
         */

        return ['$timeout', '$compile', '$log', '$parse', '$rootScope', 'HB_notification',
            function ($timeout, $compile, $log, $parse, $rootScope, HB_notification) {

                var options = $rootScope.uploadConfigOptions || {};

                ////////////////////设置获取uploader.swf   ie8 下面启动flash upload////////////////
                (options.flashUrl = options.flashUrl || '/bower_components/fex-webuploader/dist/Uploader.swf');
                ////////////////////////////////////////////////////////////////////////////////
                if (!options.uploadImageUrl) {
                    minError("please offer " + (function () {
                            var who = '';
                            if (!options.uploadImageUrl) {
                                who = 'uploadImageUrl';
                            }
                            return who;
                        })());
                }

                return {
                    require: 'ngModel',
                    restrict: 'A',

                    /**
                     * 链接函数
                     * @param scope 作用域
                     * @param element 元素
                     * @param attributes 属性
                     * @param ngModelCtrl 控制器
                     */
                    link: function (scope, element, attributes, ngModelCtrl) {
                        if (!ngModelCtrl) {
                            minError('元素节点上面必须要有ngModel指定对象!');
                        }

                        function validate(scale) {
                            if (scale.width && !scale.height) {
                                minError('please offer scale.height');
                            }

                            if (!scale.width && scale.height) {
                                minError('please offer scale.width');
                            }
                        }

                        /**
                         *
                         * @returns {*}
                         */
                        function getScale() {
                            if (!attributes.scale) {
                                return arguments[2];
                            } else {
                                var getter = $parse(attributes.scale),
                                    scale = getter(scope);
                                // 判断是否提供scale功能，如果有， 且只提供width或者只提供height则报错
                                if (scale) {
                                    // 如果是数组的话
                                    if (angular.isArray(scale)) {
                                        var len = scale.length;
                                        for (var i = 0; i < len; i++) {
                                            var item = scale[i];
                                            validate(item);
                                            item.type = 'scale';
                                        }
                                        return JSON.stringify(scale);
                                    } else {
                                        validate(scale);
                                        scale.type = 'scale';
                                        return JSON.stringify([scale]);
                                    }
                                }
                            }
                            return arguments[2];
                        }

                        /**
                         *
                         * @returns {string}
                         */
                        function genServerUrl() {
                            if (options.uploadImageUrl.indexOf('?') === -1) {
                                options.uploadImageUrl += '?1=1';
                            }
                            var uploadSync = true,
                                result = [options.uploadImageUrl, 'uploadSync=' + uploadSync],
                                scale = getScale();
                            if (scale) {
                                result.push('needOperate=' + scale);
                            }
                            return result.join('&');
                        }

                        // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
                        var serverUrl = genServerUrl(),
                            // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
                            accept = (function () {
                                var getter = $parse(attributes.acceptFileType),
                                    accept = getter(scope);
                                if (accept) {
                                    if (angular.isArray(accept)) {
                                        return accept.join(',');
                                    }
                                    if (angular.isString(accept)) {
                                        return accept;
                                    }
                                }
                                return arguments[2];
                            })(),
                            // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
                            defaultConfiguration = $.extend({}, {
                                // {Selector} [可选] [默认值：undefined] 指定Drag And Drop拖拽的容器，如果不指定，则不启动。
                                // {Selector} [可选] [默认值：false] 是否禁掉整个页面的拖拽功能，如果不禁用，图片拖进来的时候会默认被浏览器打开。
                                disableGlobalDnd: false, dnd: undefined,

                                pick: {
                                    id: element || undefined,
                                    innerHTML: (attributes.uploadbuttonname != undefined && attributes.uploadbuttonname != '') ? attributes.uploadbuttonname : '选择文件',
                                    //{Boolean} 是否开起同时选择多个文件能力。
                                    multiple: false
                                },
                                formData: {
                                    context: options.context,
                                    requestContext: options.requestContext
                                },
                                accept: {
                                    title: 'files',
                                    extensions: accept || 'jpg,jpeg,bmp,png'
                                },
                                compress: false,
                                fileSizeLimit: attributes.limit,
                                auto: true,
                                swf: options.flashUrl,
                                server: serverUrl,
                                // 上传最大并发数: 默认---3
                                threads: 3
                            }, attributes);
                        $timeout(function () {
                            /**
                             * 适应三种类型的上传，
                             *            1. 光图片上传
                             *            2. 课件上传 (带进度条)
                             *            3. 头像上传 (带剪切)
                             * @type {this.defaultConfiguration}
                             */
                            var uploaderInstance = WebUploader.create(defaultConfiguration),
                                instance = uploaderInstance;
                            /**
                             * 为其设定
                             * type:
                             *        image|files
                             */
                            instance.on('uploadSuccess', function (file, response) {
                                if (attributes.queueContainerId) {
                                    var id = attributes.queueContainerId;
                                    // 标示为上传图片的时候处理方式
                                    var imageContainer = $('#' + id),
                                        isImageTag = imageContainer[0].tagName === 'IMG' ? true : false,
                                        uploadedNewPath = angular.fromJson(response)['newPath'];
                                    imageContainer = isImageTag ? imageContainer : imageContainer.find('img');
                                    imageContainer.attr('src', options.showImageUrl + uploadedNewPath);
                                    imageContainer.show();
                                }
                                $timeout(function () {
                                    // *************************
                                    if (attributes.valueArray) {
                                        var imageModel = {
                                            ImageName: angular.fromJson(response)['fileName'],
                                            ImagePath: angular.fromJson(response)['newPath']
                                        };
                                        ngModelCtrl.$viewValue.push(imageModel);
                                    } else {
                                        ngModelCtrl.$setViewValue(angular.fromJson(response));
                                    }
                                    // *************************
                                });
                                // 重置上传插件
                                instance.reset();
                            });

                            instance.on('beforeFileQueued', function (file) {
                                var fileExt = file.ext.toLowerCase(),
                                    extensions = defaultConfiguration.accept.extensions;
                                if (extensions.indexOf(fileExt) === -1) {
                                    HB_notification.alert('请上传' + defaultConfiguration.accept.extensions + '格式的图片!');
                                    return false;
                                }

                                file.formatSize = WebUploader.Base.formatSize(file.size);
                            });

                            instance.on('error', function (error) {
                                if (error == "Q_EXCEED_SIZE_LIMIT") {
                                    HB_notification.alert('文件不能超过' + WebUploader.Base.formatSize(defaultConfiguration.fileSizeLimit));
                                    return false;
                                }

                            });

                            var watchScale = scope.$watch(attributes.scale, function (ov, nv) {
                                instance.option('server', genServerUrl());
                            }, true);
                            scope.$on('$destroy', function () {
                                watchScale();
                            })
                        });
                    }
                };
            }];
    });

