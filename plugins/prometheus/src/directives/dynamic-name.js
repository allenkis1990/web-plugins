
define(function () {
    'use strict';
	/**
	 * 这个指令是为了解决在循环中创建表单，
	 * 并且每个表单需要添加校验
	 *
	 * ng-model必须提供
	 * <form name="dynamicNameTest">
	 *       <div ng-repeat="a in somes">
	 *            <input ng-model="model.some" dynamic-name="$index" prefix-name="input_some_name_you_want_to_define_"/>
	 *     </div>
	 * </form>
	 *
	 *  ***　如果不提供prefix-name="input_some_name_you_want_to_define_" 那么指令默认获取标签的名称 + $index来完成表单命名
	 *     最后每个校验的input都可以通过dynamicNameTest['input_some_name_you_want_to_define_' + $index].$error 来获取对应的属性完成校验
	 *     @author 翁鹏飞
     *
     * # completed at 2016-11-24 13:49:00 ---> 翁鹏飞
	 */
    return [
        function () {
            return {
                require: "ngModel",
                link: function (scope, elem, attrs, ngModelCtr) {
                    if (!ngModelCtr) {
                        throw new Error('必须有ng-model');
                        return false;
                    }

                    // 当循环绑定校验的时候， 需要使用这个， 一个是前缀名称，
                    // 如果没有给prefix-name赋值的话，默认是以标签名称来与repeat的索引来创建名
                    var prefixName = attrs.prefixName;

                    if (!prefixName || prefixName === '') {
                        prefixName = elem[0].tagName.toLowerCase();
                    }

                    ngModelCtr.$name = prefixName + scope.$eval(attrs.dynamicName);

                    var formController = elem.controller('form') || {$addControl: angular.noop};
                    formController.$addControl(ngModelCtr);

					scope.$on ('$destroy', function () {
						formController.$removeControl (ngModelCtr);
					});
                }
            };
        }
    ]
});
