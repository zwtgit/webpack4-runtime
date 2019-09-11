/**
 * Created by 43872 on 2018/8/3.
 */
var class2type = {},
  toString = class2type.toString;
"Boolean Number String Function Array Date RegExp Object Error".split(" ").forEach(function(name, i) {
  class2type[ "[object " + name + "]" ] = name.toLowerCase()
})
function isObject(obj)  { return isType(obj) == "object" }
function isWindow(obj) { return obj != null && obj == obj.window }
function isType(obj) {return obj == null ? String(obj) : class2type[toString.call(obj)] || "object"}
function likeArray(obj) {
  var length = !!obj && 'length' in obj && obj.length,
    _type = isType(obj)

  return 'function' != _type && !isWindow(obj) && (
      'array' == _type || length === 0 ||
      (typeof length == 'number' && length > 0 && (length - 1) in obj)
    )
}
export function isArray (obj){ return obj.isArray ||  obj instanceof Array }
export function isPlainObject(obj) {return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype}// 普通对象，不包含dom bom对
export function each(elements, callback){
  var i, key
  if (likeArray(elements)) {
    for (i = 0; i < elements.length; i++)
      if (callback.call(elements[i], i, elements[i]) === false) return elements
  } else {
    for (key in elements)
      if (callback.call(elements[key], key, elements[key]) === false) return elements
  }
  return elements;
}
export function getType(obj) {return obj == null ? String(obj) : class2type[toString.call(obj)] || "object"}
export function isFunction(value) { return isType(value) == "function" }
export function deepClone(obj) {
  var newObj = obj instanceof Array ? [] : {};
  //obj属于基本数据类型,直接返回obj
  if(typeof obj !== 'object') {
    return obj;
  } else {
    //obj属于数组或对象，遍历它们
    for(var i in obj) {
      newObj[i] = typeof obj[i] === 'object' ? deepClone(obj[i]):obj[i];
    }
  }
  return newObj;
}
/*获取URL参数*/
export function getUrlParam(name) {
  var search = window.location.search.substr(1);
  var mappers = search.split("&");
  var hash = {};
  for(var i in mappers){
    var index = mappers[i].indexOf("=");
    hash[mappers[i].substring(0,index)] = mappers[i].substring(index+1)
  }
  if(name){
    return hash[name];
  }
  return hash;
}
/*创建iframe*/
export function creatIframe(dom,src,call){
  var time = new Date().getTime()
  var TaurusWrapId = 'TaurusWULI_wrapper_' + time;
  var TaurusIframeId = 'TaurusWULI_iframe_' + time;
  var ins = document.createElement("ins");
  var ifm = document.createElement("iframe");
  ins.setAttribute("id", TaurusWrapId);
  ins.setAttribute("style","-webkit-overflow-scrolling: touch;width: 100%;height:0; line-height: 0; font-size: 0px; position: relative; visibility: visible; border: none; margin: 0px; padding: 0px; overflow: hidden; z-index: 1;display: block;");

  ifm.setAttribute("id", TaurusIframeId);
  ifm.setAttribute("src", src);
  ifm.setAttribute("style", " width: 1px;min-width: 100%; *width: 100%; height:100%; border: none;");
  ifm.setAttribute("scrolling","no");
  ins.appendChild(ifm);
  // 渲染
  dom.appendChild(ins);
  call && call(ifm, ins);

  // var time = new Date().getTime()
  // var TaurusWrapId = 'TaurusWULI_wrapper_' + time;
  // var TaurusIframeId = 'TaurusWULI_iframe_' + time;
  // var el = `<ins style="-webkit-overflow-scrolling: touch;width: 100%;height:0; line-height: 0; font-size: 0px; position: relative; visibility: visible; border: none; margin: 0px; padding: 0px; overflow: hidden; z-index: 1;display: block;" id="${TaurusWrapId}"><iframe id="${TaurusIframeId}" src="${src}" style="min-width:100%;width: 0;*width:100%; height:100%; border: none;" scrolling="no"></iframe></ins>`
  // dom.innerHTML = el;
  // call&&call(document.getElementById(TaurusIframeId),document.getElementById(TaurusWrapId))
}
/*动态加载script*/
export function loadJs(filename, attrArr, callback){
  var fileRef = document.createElement('script'); //创建标签
  fileRef.type = "text/javascript"; //定义属性type的值为text/javascript
  fileRef.src = filename; //文件的地址
  if(attrArr) {
    var attrLen = attrArr.length;
    for(var i = 0; i < attrLen; i++) {
      fileRef.setAttribute(attrArr[i][0], attrArr[i][1]);
    }
  }
  if(callback && typeof callback == "function") {
    if(fileRef.readyState) {
      fileRef.onreadystatechange = function() {
        if(fileRef.readyState == "loaded" || fileRef.readyState == "complete") {
          fileRef.onreadystatechange = null;
          callback(fileRef);
          document.getElementsByTagName("head")[0].removeChild(this);
        }
      };
    } else {
      fileRef.onload = function() {
        callback(fileRef);
        document.getElementsByTagName("head")[0].removeChild(this);
      };
    }
  }
  document.getElementsByTagName("head")[0].appendChild(fileRef);
}
/*动态加载css*/
export function loadCss(css){
  var style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML= css;
  document.getElementsByTagName('head')[0].appendChild(style)
}
// 函数防抖
export function debounce(fun, delay) {
  var timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fun.apply(this, args)
    }, delay)
  }
}
// 随机范围
export function randomRange(n,m){
  var c = m-n+1;
  return Math.floor(Math.random() * c + n);
}
/*获取屏幕高度*/
export function getScreenHeight() {
  var clientHeight=0;
  if(document.body.clientHeight&&document.documentElement.clientHeight)
  {
    clientHeight = (document.body.clientHeight<document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
  }
  else
  {
    clientHeight = (document.body.clientHeight>document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
  }
  return clientHeight;
}
/*创建随机ID*/
export function createRandomId() {
  return (Math.random()*10000000).toString(16).substr(0,4)+(new Date()).getTime()+Math.random().toString().substr(2,5);
}
/*设置cookie*/
export const Cookie = {
  set(name,value,date){
    var exp = new Date();
    var Days = date || 30*24*3600*1000;
    exp.setTime(exp.getTime() + Days);
    document.cookie = name + "="+ escape(value) + ";expires=" + exp.toGMTString();
  },
  get(name){
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg)){
      return unescape(arr[2]);
    }else{
      return null;
    }
  },
  del(name){
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg)){
      var exp = new Date();
      var value = unescape(arr[2])
      exp.setTime(exp.getTime() - 1);
      document.cookie= name + "="+value+";expires="+exp.toGMTString();
    }
  },
  getInfo(name){
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg)){
      return {
        len:arr[2].length,
        val:unescape(arr[2])
      };
    }else {
      return null;
    }
  },
};
export function tmpl(str, data){
  var cache = {};
  // Figure out if we're getting a template, or if we need to
  // load the template - and be sure to cache the result.
  var fn = !/\W/.test(str) ? cache[str] = cache[str] || tmpl(document.getElementById(str).innerHTML) :
    // Generate a reusable function that will serve as a template
    // generator (and which will be cached).
    new Function("obj",
      "var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('" +
      // Convert the template into pure JavaScript
      str.replace(/[\r\t\n]/g, " ")
        .split("<@").join("\t")
        .replace(/((^|@>)[^\t]*)'/g, "$1\r")
        .replace(/\t=(.*?)@>/g, "',$1,'")
        .split("\t").join("');")
        .split("@>").join("p.push('")
        .split("\r").join("\\'")
      + "');}var out=p.join('');return p.join('');");
  //console.log(fn(data));
  // Provide some basic currying to the user
  return data ? fn( data ) : fn;
}
export function getComputedStyle(dom,attribute) {
  if (window.getComputedStyle) {
    return window.getComputedStyle(dom, null)[attribute];
  } else {
    //ie低版本的方法
    return dom.currentStyle[attribute];
  }
}
export function setStyle(dom,obj) {
  Object.keys(obj).forEach(function (item) {
    dom.style[item] = obj[item]
  })
}
export function expose(src) {
  var img = new Image(), key = 'zy_export_' + Math.floor(Math.random() * 2147483648).toString(36);
  window[key] = img;
  img.src = src;//利用image src加载url实现曝光统计
  img.onload = img.onerror = img.onabort = function () {//销毁相关实例
    img.onload = img.onerror = img.onabort = null;
    window[key] = null;
    img = null;
  };
}

export function os() {
  var ua = navigator.userAgent,
    isWindowsPhone = /(?:Windows Phone)/.test(ua),
    isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
    isAndroid = /(?:Android)/.test(ua),
    isWX = /MicroMessenger/i.test(ua),
    isFireFox = /(?:Firefox)/.test(ua),
    isChrome = /(?:Chrome|CriOS)/.test(ua),
    isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
    isPhone = /(?:iPhone)/.test(ua) && !isTablet,
    isPc = !isPhone && !isAndroid && !isSymbian;
  return {
    isTablet: isTablet,
    isPhone: isPhone,
    isAndroid : isAndroid,
    isPc : isPc,
    isWX:isWX
  };
}
