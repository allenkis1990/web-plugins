/**
 * prometheus - 普罗米修斯
 * @author 
 * @version v1.0.91
 * @link 
 * @license MIT
 */
define(["angular","webuploader"],function(e,i){"use strict";function o(e,o){var t={standard:"small",superBigFileSize:1610612736,smallFileStandard:10485760,chunkSize:52428800,fileImageType:"jpg,jpeg,gif,png",HB_WU_S:{},CURRENT_HB_WU:null};return t.doSpecialLog=function(e,i){o.log("%c"+e,"color:"+i)},t.uploadComplete=function(e,i){t.CURRENT_HB_WU.trigger("uploadProgress",e,1),t.CURRENT_HB_WU.trigger("uploadComplete",e),t.CURRENT_HB_WU.trigger("uploadSuccess",e,i),t.CURRENT_HB_WU.trigger("uploadFinished",e)},t.checkIsBigFile=function(e){return e>=t.smallFileStandard},t.isIe=function(){return function(e){var i=e.match(/MSIE\s([\d\.]+)/)||e.match(/(?:trident)(?:.*rv:([\w.]+))?/i);return i&&parseFloat(i[1])}(navigator.userAgent)},t.registerBigFileUpload=function(o){t.md5CheckUrl=o.md5CheckPath,t.blockMd5CheckUrl=o.blockMd5CheckPath,t.uploadBigFileUrl=o.uploadBigFilePath,t.uploadSmallFileUrl=o.resourceServicePath;var n=new i.Runtime.Html5.Md5({});i.Uploader.register({"before-send-file":"beforeSendFile","before-send":"beforeSend"},{beforeSendFile:function(r){var l=$.Deferred(),a=r.size;if(r.guid=i.Base.guid(),e(function(){r.liveStatus=1}),r.md5=n.md5String([r.lastModifiedDate.getTime(),r.name,r.size].join("-")),t.checkIsBigFile(a)&&!t.isIe()){t.doSpecialLog("文件大小超过10M,并且开始执行文件的第一次md5计算","red");var u=r.name;$.ajax({type:"post",url:t.md5CheckUrl,data:{md5:r.md5,guid:r.guid,originalFileName:u,context:o.context,requestContext:o.requestContext},cache:!1,dataType:"json",success:function(e){e.exists?(t.doSpecialLog("服务器存在计算完成的文件的md5，不执行上传，实现秒传","red"),t.uploadComplete(r,e),t.CURRENT_HB_WU.skipFile(r),l.reject(),r.newPath=e.newPath):l.resolve()},error:function(){l.resolve()}})}else e(function(){r.liveStatus=2}),l.resolve();return $.when(l)},beforeSend:function(e){var i=$.Deferred();if(t.checkIsBigFile(e.file.size)&&!t.isIe()){e.file.chunkMd5=n.md5String([e.file.lastModifiedDate.getTime(),e.file.name,e.chunk,e.file.size].join("-"));var r=e.file.name,l={md5:e.file.md5,guid:e.file.guid,originalFileName:r,size:e.file.size,context:o.context,requestContext:o.requestContext},a=e.chunks,u=e.chunk;a>1?(l.chunks=a,l.chunk=u,l.chunkMd5=e.file.chunkMd5,l.chunkSize=e.blob.size,$.ajax({type:"post",url:t.blockMd5CheckUrl,data:l,cache:!1,dataType:"json"}).then(function(e){e.exists?i.reject():i.resolve()},function(){i.resolve()})):i.resolve()}else i.resolve();return $.when(i)}})},t}function t(o,t,n,r,l,a,u){return{restrict:"AE",require:"?^ngModel",scope:{onProgress:"&",onSuccess:"&",onFileQueued:"&",onFileTypeDenied:"&",onUploadStart:"&",onUploadStop:"&",onSave:"&",multi:"=",returnIsArray:"@",standard:"@",sizeLimit:"@",accepts:"@",hbFileUploader:"="},link:function(s,c,d,p){function f(i,o){var t=r(i[o]);return e.isFunction(t.assign)}function g(){return"big"===s.standard}function h(i){i=e.fromJson(i.raw),e.isArray(p.$viewValue)?p.$viewValue.push(i):e.isObject(p.$viewValue)?p.$setViewValue(i):s.multi?p.$viewValue.push(i):p.$setViewValue(i)}function U(e){return 1===e}if(!p)return!1;s.$on("$destroy",function(){p.$setViewValue(""),null!==o.CURRENT_HB_WU&&o.CURRENT_HB_WU.stop(!0),p.$setValidity("required",!1)}),s.multi&&!p.$modelValue&&!e.isArray(p.$modelValue)&&p.$setViewValue([]);var S=a.getResourceInfo();a.registered||o.registerBigFileUpload(S),a.registered=!0;var m=S.resourceServicePath,v=o.isIe();!o.isIe()&&g()&&(m=S.uploadBigFilePath);var _,F=o.chunkSize,B={pick:{id:c.attr("id")?"#"+c.attr("id"):c,innerHTML:d.buttonText||"选择文件",multiple:!1},timeout:0,formData:{context:S.context,requestContext:S.requestContext},compress:!1,fileSizeLimit:s.sizeLimit,auto:!s.multi,swf:"/bower_components/webuploader_fex/dist/Uploader.swf",server:m+"?uploadSync=true",threads:1};v?(o.doSpecialLog("当前模式为ie， flash专享模式","red"),B.runtimeOrder="flash"):g()&&(B.chunked=!0,B.chunkRetry=0,B.chunkSize=F),s.accepts&&(B.accept={title:"files",extensions:s.accepts}),_=i.create(B),_.on("uploadProgress",function(e,i){var o=100*i;100===o&&t(function(){e.liveStatus=3}),t(function(){e.progress=o.toFixed(2)}),s.onProgress&&s.onProgress({percentage:i})}),_.on("uploadSuccess",function(e,i){o.doSpecialLog("上传成功....","#449d44"),e.uploadSuccess=!0,s.onSuccess&&s.onSuccess({file:e}),!s.multi&&_.reset(),t(function(){e.liveStatus=4,e.newPath=i.newPath,e.raw=i._raw,e.uploadStatus=3,h(e)})}),_.on("beforeFileQueued",function(){m||_.option("server",l.uploadConfigOptions&&l.uploadConfigOptions.uploadImageUrl+"?uploadSync=true")}),_.on("stopUpload",function(e){s.onUploadStart&&s.onUploadStop({file:e}),o.doSpecialLog("停止上传.....","#c9302c")}),_.on("uploadStart",function(e){o.doSpecialLog("开始上传.....","#286090"),s.onUploadStart&&s.onUploadStart({file:e}),t(function(){e.uploadBegin=!0,e.uploadStatus=1})}),_.on("error",function(e){}),_.on("uploadBeforeSend",function(e,i,t){if((o.checkIsBigFile(e.file.size)||g())&&!o.isIe()){var n=e.chunks,r=e.chunk;o.doSpecialLog("当前分片数"+e.chunks,"pink"),i.guid=e.file.guid,i.md5=e.file.md5,i.originalFileName=e.file.name,n>1&&(i.chunks=n,i.chunk=r,i.chunkMd5=e.file.chunkMd5,i.chunkSize=e.blob.size)}}),f(d,"hbFileUploader")&&(s.hbFileUploader={localFileQueue:[],name:"hbWebUploader",uploadOne:function(e){t(function(){o.CURRENT_HB_WU=_,o.CURRENT_HB_WU.upload(e),e.uploadStatus=1})},save:function(){o.CURRENT_HB_WU=_;var e=o.CURRENT_HB_WU.getFiles();return e.length<=0?(o.doSpecialLog("上传文件队列不能为空....","red"),!1):void o.CURRENT_HB_WU.upload()},removeOne:function(e,i){function t(){o.CURRENT_HB_WU=_,o.CURRENT_HB_WU.removeFile(e),s.hbFileUploader.localFileQueue.splice(i,1)}return U(e.liveStatus)?(o.doSpecialLog("文件正在md5校验不能从队列中删除....","red"),!1):2===e.liveStatus?(window.confirm("文件正在上传确定要从队列中删除?",function(){t()}),!1):void t()},reupload:function(e){o.CURRENT_HB_WU=_,o.CURRENT_HB_WU.retry(e)},stopAll:function(){o.CURRENT_HB_WU=_,o.CURRENT_HB_WU.stop(!0)},stopOne:function(e){return U(e.liveStatus)?(o.doSpecialLog("文件正在md5校验，请等待校验结束再进行暂停操作!","red"),!1):void t(function(){o.CURRENT_HB_WU=_,o.CURRENT_HB_WU.stop(e),e.uploadStatus=2})}}),_.on("fileQueued",function(t){var n=o.isIe(),r=o.checkIsBigFile(t.size);return o.superBigFileSize<t.size&&n?(u.alert("想体验超爽超大文件上传，请用chrome或者firefox主流浏览器...."),!1):!r||s.standard&&"big"===s.standard||o.isIe()?"big"!==s.standard||r||o.isIe()?(t.guid=i.Base.guid(),t.queueId=d.queueid,t.formatSize=i.Base.formatSize(t.size),t.progress=0,t.uploadStatus=0,t.uploadBegin=!1,t.liveStatus=0,s.multi?s.$apply(function(){s.hbFileUploader&&s.hbFileUploader.localFileQueue&&e.isArray(s.hbFileUploader.localFileQueue)&&s.hbFileUploader.localFileQueue.push(t)}):s.hbFileUploader&&(s.hbFileUploader.selectFile=t),void(s.onFileQueued&&s.onFileQueued())):(o.doSpecialLog("当前上传文件大小定义属于小文件，请配置规格standard为small模式或者不配置.....","red"),!1):(o.doSpecialLog("当前上传文件大小定义属于大文件，请配置规格standard为big模式.....","red"),!1)}),_.on("error",function(o){switch(d.onError&&s.onError({$info:{error:o,uploader:this,instance:_}}),o){case"Q_TYPE_DENIED":var t=this.options.accept,n="请上传:",r="";e.forEach(t,function(e){r+=e.extensions}),n+=r+"的文件类型",d.onFileTypeDenied?s.onFileTypeDenied({$info:{accepts:r,uploader:this,instance:_}}):u.alert(n);break;case"Q_EXCEED_SIZE_LIMIT":u.alert("文件不能超过"+i.Base.formatSize(s.sizeLimit))}!s.multi&&_.reset()}),_.on("uploadError",function(e,i){t(function(){e.liveStatus=-1}),n.log("%c上传过程中出现错误"+i,"color:red")})}}}var n=e.module("hb.webUploader",[]);n.run(["HB_WebUploaderService","$log","$rootScope","HB_WebUploader",function(e,o,t,n){e.doSpecialLog("当前分片每片"+i.Base.formatSize(e.chunkSize)+"起","darkblue"),e.doSpecialLog("注册分片上传以及秒传，断点续传功能....","pink"),e.uploadConfigOptions=t.uploadConfigOptions}]),n.provider("HB_WebUploader",[function(){var e={};this.setResourceInfo=function(i){return["$http","$q",function(o,t){var n=t.defer();return o.get(i).success(function(i){e=i.info,n.resolve(i)}).error(function(e){n.resolve(void 0)}),n.promise}]},this.$get=[function(){return{getResourceInfo:function(){return e}}}]}]),n.factory("HB_WebUploaderService",o),o.$inject=["$timeout","$log"],n.directive("hbFileUploader",t),t.$inject=["HB_WebUploaderService","$timeout","$log","$parse","$rootScope","HB_WebUploader","HB_notification"]});