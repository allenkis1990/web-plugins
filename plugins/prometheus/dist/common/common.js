/**
 * prometheus - 普罗米修斯
 * @author 
 * @version v1.0.91
 * @link 
 * @license MIT
 */
define(function(e){"use strict";var $={},a={regs:{positiveIntegers:/^[0-9]\d*$/,onlyNumber:/^[0-9]*$/,onlyBigLetter:/^[A-Z]*$/,onlySmallLetter:/^[a-z]*$/,lessThanFiveLength:/[0-9a-zA-Z]{5}/,makeAnyTwo:/^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/,makeThree:/(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&*]+$)(?![\d!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+/,phone:/^1[3|4|5|8|7][0-9]\d{8}$/,nickname:/^[\u4E00-\u9FA5A-Za-z0-9_]+$/,email:/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/}};return{util:$,constant:a}});