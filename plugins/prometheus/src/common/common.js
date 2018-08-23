/**
 * Created by wengpengfei on 2016/11/18.
 */
define ( function ( mod ) {
    'use strict';

    // 工具函数
    var util = {};

    /// 产量
    var constant = {
        regs: {
            positiveIntegers  : /^[0-9]\d*$/,
            onlyNumber        : /^[0-9]*$/,
            onlyBigLetter     : /^[A-Z]*$/,
            onlySmallLetter   : /^[a-z]*$/,
            lessThanFiveLength: /[0-9a-zA-Z]{5}/,
            //密码由数字、小写字母、大写字母或其它特殊符号当中的两种组成
            makeAnyTwo        : /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/,
            makeThree         : /(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&*]+$)(?![\d!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+/,
            phone             : /^1[3|4|5|8|7][0-9]\d{8}$/,
            nickname          : /^[\u4E00-\u9FA5A-Za-z0-9_]+$/,
            email             : /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
        }
    };

    return {
        util    : util,
        constant: constant
    };
} );