!function(global,factory){"object"==typeof exports&&"undefined"!=typeof module?module.exports=factory():"function"==typeof define&&define.amd?define(factory):global.HBPlayer=factory()}(this,function(){"use strict";var Events={on:function(el,name,handle){el.addEventListener?el.addEventListener(name,handle):el.attachEvent("on"+name,handle)}};!function(css,ref){void 0===ref&&(ref={});var insertAt=ref.insertAt;if(css&&"undefined"!=typeof document){var head=document.head||document.getElementsByTagName("head")[0],style=document.createElement("style");style.type="text/css","top"===insertAt&&head.firstChild?head.insertBefore(style,head.firstChild):head.appendChild(style),style.styleSheet?style.styleSheet.cssText=css:style.appendChild(document.createTextNode(css))}}("/**\r\npdf\r\n \uff08\u4f2a\u88c5\uff09\u64ad\u653e\u5668\u7684\u8fdb\u5ea6\u6837\u5f0f\r\n */\r\n.cont-container {\r\n    position: absolute;\r\n    bottom: -38px;\r\n    height: 35px;\r\n    background: #484545;\r\n    /* margin: 0 auto; */\r\n    z-index: 1;\r\n    border-radius: 4px;\r\n    left: 50%;\r\n    font-size: 12px;\r\n    margin-left: -250px;\r\n    font-weight: bold;\r\n    color: white;\r\n    font-family: \u5fae\u8f6f\u96c5\u9ed1;\r\n    -webkit-transition: all .5s;\r\n    -moz-transition: all .5s;\r\n    -ms-transition: all .5s;\r\n    -o-transition: all .5s;\r\n    transition: all .5s;\r\n}\r\n\r\n.cont-container .current-time {\r\n    float: left;\r\n    width: 100px;\r\n    /* background: red; */\r\n    height: 100%;\r\n    text-align: center;\r\n    line-height: 35px;\r\n}\r\n\r\n.cont-container .middle {\r\n    width: 300px;\r\n    height: 100%;\r\n    float: left;\r\n}\r\n\r\n.cont-container .total-time {\r\n    width: 100px;\r\n    float: left;\r\n    height: 100%;\r\n    line-height: 35px;\r\n    text-align: center;\r\n}\r\n\r\n.cont-container .progress-container {\r\n    width: 90%;\r\n    height: 10px;\r\n    background: #ffffff;\r\n    /* line-height: 23px; */\r\n    border-radius: 6px;\r\n    vertical-align: middle;\r\n    position: relative;\r\n    top: 50%;\r\n    margin-top: -5px;\r\n    left: 50%;\r\n    margin-left: -45%;\r\n}\r\n\r\n.cont-container .progress-container .progress {\r\n    width: 0;\r\n    background: #1b6cc1;\r\n    height: 100%;\r\n    border-radius: 4px;\r\n    -webkit-transition: all 1s;\r\n    -moz-transition: all 1s;\r\n    -ms-transition: all 1s;\r\n    -o-transition: all 1s;\r\n    transition: all 1s;\r\n}\r\n\r\n.ie8.cont-container {\r\n    left: 0;\r\n    margin-left: 0;\r\n    width: 100%;\r\n}\r\n\r\n.ie8.cont-container .middle {\r\n    width: 80%;\r\n}\r\n\r\n.ie8.cont-container .current-time {\r\n    width: 10%;\r\n}\r\n\r\n.ie8.cont-container .total-time {\r\n    width: 10%;\r\n}\r\n");var Asserts=function(flag,msg){if(flag)throw new Error(msg)},prototypeString=Object.prototype.toString,isFunction=function(func){return"[object Function]"===prototypeString.call(func)},isArray=function(arr){return"[object Array]"===prototypeString.call(arr)},isUndefined=function(unde){return"[object Undefined]"===prototypeString.call(unde)||!!isArray(unde)&&unde.length},formatTime=function(seconds){var minute=seconds/60,second=seconds%60,hour=minute/60;return minute%=60,(10<=(hour=parseInt(hour,10))?hour:"0"+hour)+":"+(10<=(minute=parseInt(minute,10))?minute:"0"+minute)+":"+(10<=(second=parseInt(second,10))?second:"0"+second)};function _extend(dest,source){Object.keys(source).forEach(function(key){dest[key]&&"[object Object]"===Object.prototype.toString.call(source[key])?extend(dest[key],source[key]):dest[key]=source[key]})}var _ERROR_TYPE,extend=function(){for(var _len=arguments.length,args=Array(_len),_key=0;_key<_len;_key++)args[_key]=arguments[_key];var other=args.slice(1),first=args[0];return other.forEach(function(item){_extend(first,item)}),first},classCallCheck=function(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")},possibleConstructorReturn=function(self,call){if(!self)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!call||"object"!=typeof call&&"function"!=typeof call?self:call},TikTok=function(){function TikTok(handle,time){classCallCheck(this,TikTok),this._intervalId=setInterval(handle,time)}return TikTok.prototype.stop=function(){clearInterval(this._intervalId)},TikTok}(),Timer=function(){function Timer(){classCallCheck(this,Timer),this._list={}}return Timer.prototype.add=function(id,handle,time){this._list[id]=new TikTok(handle,time)},Timer.prototype.remove=function(id){this._list[id]&&(this._list[id].stop(),delete this._list[id])},Timer.prototype.clear=function(){var _this=this;Object.keys(this._list).forEach(function(timer){_this.remove(timer)}),this._list={}},Timer.prototype.get=function(id){return this._list[id]},Timer}(),ERROR_TYPE_CODE_et_10000="et_10000",ERROR_TYPE_CODE_et_10001="et_10001",ERROR_TYPE_CODE_et_10002="et_10002",ERROR_TYPE_CODE_et_10003="et_10003",BUILD_IN_buildInEventName=((_ERROR_TYPE={})["et_00000"]="\u521d\u59cb\u5316\u5931\u8d25",_ERROR_TYPE[ERROR_TYPE_CODE_et_10000]="\u5e93\u6ca1\u6709\u52a0\u8f7d\u5b8c\u6210\u3002\u521d\u59cb\u5316\u52a8\u4f5c\u5b8c\u6210\u5931\u8d25\uff01",_ERROR_TYPE[ERROR_TYPE_CODE_et_10001]="\u63d0\u4f9b\u7684\u6a21\u5f0f\u65e0\u6cd5\u4e0e\u7cfb\u7edf\u5339\u914d",_ERROR_TYPE[ERROR_TYPE_CODE_et_10002]="\u91cd\u590d\u64ad\u653e",_ERROR_TYPE[ERROR_TYPE_CODE_et_10003]="\u9700\u8981\u5237\u65b0\u64ad\u653e","build_in_event"),Player=function(){function Player(){classCallCheck(this,Player),this.version="0.0.1",this.name="hb-player",this._events={init:{},start:{},end:{},destroy:{},playing:{},resume:{},pause:{},seek:{},volumeUp:{},volumeDown:{},mute:{},ready:{},beforeCommit:{},afterCommit:{},error:{}},this._ts=new Timer}return Player.prototype.getSchedule=function(){var _duration=void 0,_currentTime=void 0;try{_duration=this.getDuration(),_currentTime=this.getTime()}catch(e){console.log(e)}return parseFloat((_currentTime/_duration*100).toFixed(2))},Player.prototype.getTime=function(){},Player.prototype.play=function(time){},Player.prototype.getState=function(){},Player.prototype.getDuration=function(){},Player.prototype.start=function(){},Player.prototype.stop=function(){},Player.prototype.pause=function(){},Player.prototype.resume=function(){},Player.prototype.getVolume=function(){return 0},Player.prototype.setVolume=function(volume){return volume},Player.prototype.getMute=function(){},Player.prototype.setMute=function(flag){},Player.prototype.getDefinitions=function(){},Player.prototype.getPlayerVersion=function(){},Player.prototype.setDefinition=function(name){},Player.prototype.seek=function(time){},Player.prototype.getVersion=function(){return this.version},Player.prototype.resize=function(){},Player.prototype.destroy=function(){},Player.prototype.commit=function(){},Player.prototype.setOption=function(property,value){},Player.prototype.on=function(type,id,handle){if(Asserts(isUndefined(id)&&isUndefined(handle),"\u4e8b\u4ef6\u7ed1\u5b9a\u7684\u65b9\u5f0f\u4e0d\u6b63\u786e!"),Asserts(isUndefined(this._events[type]),type+" -> \u5f53\u524d\u4e8b\u4ef6\u4e0d\u5728\u4e8b\u4ef6\u5217\u8868\u5f53\u4e2d"),!handle&&isFunction(id)&&(handle=id,id=BUILD_IN_buildInEventName),isFunction(this._events[type][id])){var cache=this._events[type][id];this._events[type][id]=[cache]}return isArray(this._events[type][id])?this._events[type][id].push(handle):this._events[type][id]=handle,this},Player.prototype.off=function(type,id){return Asserts(isUndefined(this._events[type]),type+" -> \u5f53\u524d\u4e8b\u4ef6\u4e0d\u5728\u4e8b\u4ef6\u5217\u8868\u5f53\u4e2d"),Asserts(isUndefined(this._events[type][id]),id+" -> \u6307\u5b9a\u4e8b\u4ef6\u540d\u79f0\u4e0d\u5b58\u5728"),id?delete this._events[type][id]:this._events[type]={},this},Player.prototype.trigger=function(type,id,options){var _this=this;return Asserts(isUndefined(this._events[type]),type+" -> \u5f53\u524d\u4e8b\u4ef6\u4e0d\u5728\u4e8b\u4ef6\u5217\u8868\u5f53\u4e2d"),options?(options.eventType=id,triggerFun.call(this,this._events[type][id],options)):(options=id,Object.keys(this._events[type]).forEach(function(event){options.eventType=event,triggerFun.call(_this,_this._events[type][event],options)})),this},Player}();function triggerFun(func,options){var _this2=this;isFunction(func)&&func.call(this,options),isArray(func)&&func.forEach(function(event){event.call(_this2,options)})}var supportsPDFs,createAXO,supportsPdfActiveX,buildFragmentString,log,embedError,_embed,getTargetElement,generatePDFJSiframe,generateEmbedElement,supportsPdfMimeType="undefined"!=typeof navigator.mimeTypes["application/pdf"],isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase());createAXO=function(type){var ax;try{ax=new ActiveXObject(type)}catch(e){ax=null}return ax},supportsPdfActiveX=function(){return!(!createAXO("AcroPDF.PDF")&&!createAXO("PDF.PdfCtrl"))},supportsPDFs=supportsPdfMimeType||function(){return!!(window.ActiveXObject||"ActiveXObject"in window)}()&&supportsPdfActiveX(),buildFragmentString=function(pdfParams){var prop,string="";if(pdfParams){for(prop in pdfParams)pdfParams.hasOwnProperty(prop)&&(string+=encodeURIComponent(prop)+"="+encodeURIComponent(pdfParams[prop])+"&");string&&(string=(string="#"+string).slice(0,string.length-1))}return string},log=function(msg){"undefined"!=typeof console&&console.log&&console.log("[PDFObject] "+msg)},embedError=function(msg){return log(msg),!1},getTargetElement=function(targetSelector){var targetNode=document.body;return"string"==typeof targetSelector?targetNode=document.querySelector(targetSelector):"undefined"!=typeof jQuery&&targetSelector instanceof jQuery&&targetSelector.length?targetNode=targetSelector.get(0):"undefined"!=typeof targetSelector.nodeType&&1===targetSelector.nodeType&&(targetNode=targetSelector),targetNode},generatePDFJSiframe=function(targetNode,url,pdfOpenFragment,PDFJS_URL,id){var fullURL=PDFJS_URL+"?file="+encodeURIComponent(url)+pdfOpenFragment,iframe="<div style='"+(isIOS?"-webkit-overflow-scrolling: touch; overflow-y: scroll; ":"overflow: hidden; ")+"position: absolute; top: 0; right: 0; bottom: 0; left: 0;'><iframe  "+id+" src='"+fullURL+"' style='border: none; width: 100%; height: 100%;' frameborder='0'></iframe></div>";return targetNode.className+=" pdfobject-container",targetNode.style.position="relative",targetNode.style.overflow="auto",targetNode.innerHTML=iframe,targetNode.getElementsByTagName("iframe")[0]},generateEmbedElement=function(targetNode,targetSelector,url,pdfOpenFragment,width,height,id){var style="";return style=targetSelector&&targetSelector!==document.body?"width: "+width+"; height: "+height+";":"position: absolute; top: 0; right: 0; bottom: 0; left: 0; width: 100%; height: 100%;",targetNode.className+=" pdfobject-container",targetNode.innerHTML='<embed  wmode="transparent" windowlessVideo="1" '+id+" class='pdfobject' src='"+url+pdfOpenFragment+"' type='application/pdf' style='overflow3: auto;z-index: -1; "+style+"'/>",targetNode.getElementsByTagName("embed")[0]},_embed=function(url,targetSelector,options){if("string"!=typeof url)return embedError("URL is not valid");targetSelector=void 0!==targetSelector&&targetSelector;var pdfOpenFragment,id=(options=void 0!==options?options:{}).id&&"string"==typeof options.id?"id='"+options.id+"'":"",page=!!options.page&&options.page,pdfOpenParams=options.pdfOpenParams?options.pdfOpenParams:{},fallbackLink="undefined"==typeof options.fallbackLink||options.fallbackLink,width=options.width?options.width:"100%",height=options.height?options.height:"100%",forcePDFJS="boolean"==typeof options.forcePDFJS&&options.forcePDFJS,PDFJS_URL=!!options.PDFJS_URL&&options.PDFJS_URL,targetNode=getTargetElement(targetSelector),fallbackHTML="";return targetNode?(page&&(pdfOpenParams.page=page),pdfOpenFragment=buildFragmentString(pdfOpenParams),forcePDFJS&&PDFJS_URL?generatePDFJSiframe(targetNode,url,pdfOpenFragment,PDFJS_URL,id):supportsPDFs?generateEmbedElement(targetNode,targetSelector,url,pdfOpenFragment,width,height,id):PDFJS_URL?generatePDFJSiframe(targetNode,url,pdfOpenFragment,PDFJS_URL,id):(fallbackLink&&(fallbackHTML="string"==typeof fallbackLink?fallbackLink:'\n            <div style="text-align: center">\n                <h4>\u6211\u4eec\u9700\u8981Adobe Acrobat Reader DC\u6765\u64ad\u653ePDF\u6587\u6863</h4>\n                <h4>\u8bf7\u70b9\u51fb\u4e0b\u8f7d\u6700\u65b0\u7684Adobe Acrobat Reader</h4>\n                <a href="https://get.adobe.com/cn/reader/" target="_blank">\n                   <p>\u5b98\u7f51\u4e0b\u8f7d</p>\n                </a>                    \n            </div>\n        ',targetNode.innerHTML=fallbackHTML.replace(/\[url\]/g,url)),embedError("This browser does not support embedded PDFs"))):embedError("Target element cannot be determined")};var PDFObject={embed:function(a,b,c){return _embed(a,b,c)},pdfobjectversion:"2.0.201604172",supportsPDFs:supportsPDFs,supportsPdfMimeType:supportsPdfMimeType},browserDetect=new(function(){function BrowserDetect(){classCallCheck(this,BrowserDetect),this.dataBrowser=[{string:navigator.userAgent,subString:"Chrome",identity:"Chrome"},{string:navigator.userAgent,subString:"OmniWeb",versionSearch:"OmniWeb/",identity:"OmniWeb"},{string:navigator.vendor,subString:"Apple",identity:"Safari",versionSearch:"Version"},{prop:window.opera,identity:"Opera"},{string:navigator.vendor,subString:"iCab",identity:"iCab"},{string:navigator.vendor,subString:"KDE",identity:"Konqueror"},{string:navigator.userAgent,subString:"Firefox",identity:"Firefox"},{string:navigator.vendor,subString:"Camino",identity:"Camino"},{string:navigator.userAgent,subString:"Netscape",identity:"Netscape"},{string:navigator.userAgent,subString:"MSIE",identity:"Internet Explorer",versionSearch:"MSIE"},{string:navigator.userAgent,subString:"Gecko",identity:"Mozilla",versionSearch:"rv"},{string:navigator.userAgent,subString:"Mozilla",identity:"Netscape",versionSearch:"Mozilla"}],this.dataOS=[{string:navigator.platform,subString:"Win",identity:"Windows"},{string:navigator.platform,subString:"Mac",identity:"Mac"},{string:navigator.userAgent,subString:"iPhone",identity:"iPhone/iPod"},{string:navigator.platform,subString:"Linux",identity:"Linux"}]}return BrowserDetect.prototype.init=function(){this.browser=this.searchString(this.dataBrowser)||"An unknown browser",this.version=this.searchVersion(navigator.userAgent)||this.searchVersion(navigator.appVersion)||"an unknown version",this.OS=this.searchString(this.dataOS)||"an unknown OS"},BrowserDetect.prototype.searchString=function(data){for(var i=0;i<data.length;i++){var dataString=data[i].string,dataProp=data[i].prop;if(this.versionSearchString=data[i].versionSearch||data[i].identity,dataString){if(-1!==dataString.indexOf(data[i].subString))return data[i].identity}else if(dataProp)return data[i].identity}},BrowserDetect.prototype.searchVersion=function(dataString){var index=dataString.indexOf(this.versionSearchString);if(-1!==index)return parseFloat(dataString.substring(index+this.versionSearchString.length+1))},BrowserDetect}());browserDetect.init(),browserDetect.isIe8=function(){return"Internet Explorer"===this.browser&&this.version<=8};var Pdf=function(){function Pdf(){var _this=this,options=0<arguments.length&&arguments[0]!==undefined?arguments[0]:{};classCallCheck(this,Pdf),this.options=extend({},options),function(callback){var _this2=this,pdfSourceUrl=""+this.options.host+this.options.id;this.el_box=document.getElementById(this.options.boxId),Asserts(!this.el_box,"\u8bf7\u63d0\u4f9b\u5bb9\u5668\u6765\u64ad\u653e");if(browserDetect.isIe8()){this.viewerApplication={};var div=document.createElement("div");if(div.id="innerBoxForPDFReader",this.options.showSchedule?div.setAttribute("style","\n                    position: absolute;\n                    top: 0;\n                    right: 0;\n                    left: 0;\n                    bottom: 35px;\n        "):div.setAttribute("style","width: "+this.options.width+";height: "+this.options.height),this.el_box.appendChild(div),PDFObject.embed(pdfSourceUrl,div,{pdfOpenParams:{view:"FitV",page:"2"}}),!PDFObject.supportsPDFs)return;isFunction(callback)&&callback()}else this.el_iframe=document.createElement("iframe"),this.el_iframe.style.width="100%",this.el_iframe.style.height="100%",this.el_iframe.setAttribute("frameborder",0),this.el_iframe.src=(this.options.pdfHtmlAddress||"/bower_components/pdf-viewer/main")+"/viewer.html?file="+pdfSourceUrl,this.el_box.appendChild(this.el_iframe),this.el_iframe.addEventListener("load",function(){_this2.viewerApplication=_this2.el_iframe.contentWindow.PDFViewerApplication,Object.keys(_this2.options.ui).forEach(function(ui){var el_ui=_this2.el_iframe.contentDocument.getElementById(ui);el_ui&&(el_ui.style.display=_this2.options.ui[ui]?"block":"none")}),isFunction(callback)&&callback()})}.call(this,function(){isFunction(_this.options.init)&&_this.options.init(),_this.init()})}return Pdf.prototype.init=function(){},Pdf.prototype.getPage=function(){return this.viewerApplication.page},Pdf.prototype.getTotalPage=function(){return this.viewerApplication.pagesCount},Pdf.prototype.destroy=function(){this.el_box.parentNode.removeChild(this.el_box)},Pdf}();var Config={token:window.token||"",width:"100%",height:"100%"},Config$1=extend({},Config,{ui:{download:!0,print:!0,openFile:!0,presentationMode:!0},docTime:0}),DocPlayer=function(_Player){function DocPlayer(options){classCallCheck(this,DocPlayer);var _this2=possibleConstructorReturn(this,_Player.call(this));return _this2.options=extend({},Config$1,options),_this2._playerState="playing",_this2.currentTime=0,_this2.init(),_this2}return function(subClass,superClass){if("function"!=typeof superClass&&null!==superClass)throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:!1,writable:!0,configurable:!0}}),superClass&&(Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass)}(DocPlayer,_Player),DocPlayer.prototype.init=function(){var getOptions={ui:this.options.ui},_this$options=this.options;getOptions.host=_this$options.host,getOptions.id=_this$options.id,getOptions.boxId=_this$options.boxId,getOptions.width=_this$options.width,getOptions.height=_this$options.height,getOptions.showSchedule=_this$options.showSchedule,this.options.showSchedule&&(getOptions.init=function(){var _this3=this,_el_player_container=function(){var uiHtml='<div class="current-time" id="_doc_player_current_time_">00:00:00</div>\n                                    <div class="middle">\n                                        <div class="progress-container">\n                                        <div class="progress" id="_doc_player_progress_"></div>\n                                    </div>\n                                </div>\n                                <div class="total-time" id="_doc_player_total_time_">'+formatTime(this.options.docDuration)+"</div>";this.$el.el_playerControlContainer=document.createElement("div"),this.$el.el_playerControlContainer.setAttribute("class","cont-container"),this.$el.el_playerControlContainer.innerHTML=uiHtml;var _el_player_container=document.getElementById(this.options.boxId);return _el_player_container.appendChild(this.$el.el_playerControlContainer),this.$el.el_currentTime=document.getElementById("_doc_player_current_time_"),this.$el.el_process=document.getElementById("_doc_player_progress_"),this.$el.el_totalTime=document.getElementById("_doc_player_total_time_"),_el_player_container}.call(this);this.trigger("start",{}),this.$el.el_playerControlContainer.style.bottom=0,browserDetect.isIe8()?this.$el.el_playerControlContainer.setAttribute("class",this.$el.el_playerControlContainer.getAttribute("class")+" ie8"):(this.time_to_hide=setTimeout(function(){_this3.$el.el_playerControlContainer.style.bottom="-38px"},2500),Events.on(_el_player_container,"mouseenter",function(event){window.clearTimeout(_this3.time_to_hide),_this3.$el.el_playerControlContainer.style.bottom=0}),Events.on(_el_player_container,"mouseleave",function(event){_this3.$el.el_playerControlContainer.style.bottom="-38px"}));this.options.docDuration&&listeners.call(this)}.bind(this)),{pdf:function(){this.docInstance=new Pdf(getOptions)}}[this.options.series].call(this)},DocPlayer.prototype.destroy=function(){this._ts.clear(),this.trigger("destroy",{}),this.docInstance&&this.docInstance.destroy(),this.$el.el_playerControlContainer&&this.$el.el_playerControlContainer.parentNode&&this.$el.el_playerControlContainer.parentNode.removeChild(this.$el.el_playerControlContainer)},DocPlayer.prototype.getState=function(){return this._playerState},DocPlayer.prototype.getDuration=function(){return this.options.docDuration},DocPlayer.prototype.getTime=function(){return this.currentTime},DocPlayer.prototype.play=function(time){Number.isInteger(time)&&(this.currentTime=time)},DocPlayer.prototype.seek=function(time){this.play(time)},DocPlayer.prototype.stop=function(){this._playerState="end",this._ts.remove("pdf_player_playing"),this.trigger("end",{})},DocPlayer.prototype.pause=function(){this._ts.remove("pdf_player_playing")},DocPlayer.prototype.resume=function(){listeners.call(this)},DocPlayer}(Player);function listeners(){var _this4=this;this._ts.add("pdf_player_playing",function(){_this4.currentTime++,_this4.$el.el_process.style.width=_this4.getSchedule()+"%",_this4.$el.el_currentTime.innerHTML=formatTime(_this4.getTime()),_this4.trigger("playing",{time:_this4.getTime(),duration:_this4.getDuration()}),_this4.currentTime>=_this4.getDuration()&&_this4.stop()},1e3)}return DocPlayer.prototype.$el={},function(){function PlayerManager(){var options=0<arguments.length&&arguments[0]!==undefined?arguments[0]:{};classCallCheck(this,PlayerManager),this.options=options}return PlayerManager.prototype.init=function(){var _this=this;return new Promise(function(res,rej){res(new DocPlayer(_this.options))})},PlayerManager}()});