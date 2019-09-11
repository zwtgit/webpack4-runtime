/**
 * [未完待续 description]
 * @type {[type]}
 */
import {isArray,isPlainObject,each,getType,isFunction,deepClone,loadJs} from "./util"
var jsonpID = +new Date(),
  document = window.document,
  key,
  name,
  rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  scriptTypeRE = /^(?:text|application)\/javascript/i,
  xmlTypeRE = /^(?:text|application)\/xml/i,
  jsonType = 'application/json',
  htmlType = 'text/html',
  blankRE = /^\s*$/,
  originAnchor = document.createElement('a')
originAnchor.href = window.location.href;
function empty() {}
var ajaxSettings = {
  // Default type of request
  type: 'GET',
  // Callback that is executed before request
  beforeSend: empty,
  // Callback that is executed if the request succeeds
  success: empty,
  // Callback that is executed the the server drops error
  error: empty,
  // Callback that is executed on request complete (both: error and success)
  complete: empty,
  // The context for the callbacks
  context: null,
  // Whether to trigger "global" Ajax events
  global: true,
  // Transport
  xhr: function () {
    return new window.XMLHttpRequest()
  },
  // MIME types mapping
  // IIS returns Javascript as "application/x-javascript"
  accepts: {
    script: 'text/javascript, application/javascript, application/x-javascript',
    json:   jsonType,
    xml:    'application/xml, text/xml',
    html:   htmlType,
    text:   'text/plain'
  },
  // Whether the request is to another domain
  crossDomain: false,
  // Default timeout
  timeout: 0,
  // Whether data should be serialized to string
  processData: true,
  // Whether the browser should be allowed to cache GET responses
  cache: true,
  //Used to handle the raw response data of XMLHttpRequest.
  //This is a pre-filtering function to sanitize the response.
  //The sanitized response should be returned
  dataFilter: empty
}
function ajaxBeforeSend(xhr, settings) {

}
function ajaxSuccess(data, xhr, settings, deferred) {
  var context = settings.context, status = 'success'
  settings.success.call(context, data, status, xhr)
  ajaxComplete(status, xhr, settings)
}
// type: "timeout", "error", "abort", "parsererror"
function ajaxError(error, type, xhr, settings, deferred) {
  ajaxComplete(type, xhr, settings)
}
// status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
function ajaxComplete(status, xhr, settings) {

}
function serializeData(options) {
  if (options.processData && options.data && typeof options.data != "string"){
    options.data = param(options.data, options.traditional)
  }
  if (options.data && (!options.type || options.type.toUpperCase() == 'GET' || 'jsonp' == options.dataType)){
    options.url = appendQuery(options.url, options.data), options.data = undefined
  }
}
function serialize(params, obj, traditional, scope){
  var type, array = isArray(obj), hash = isPlainObject(obj)
  each(obj, function(key, value) {
    type = getType(value);
    if (scope) key = traditional ? scope :
      scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']'
    // handle data in serializeArray() format
    if (!scope && array) params.add(value.name, value.value)
    // recurse into nested objects
    else if (type == "array" || (!traditional && type == "object"))
      serialize(params, value, traditional, key)
    else params.add(key, value)
  })
}

function param(obj, traditional){
  var params = []
  params.add = function(key, value) {
    if (isFunction(value)) value = value()
    if (value == null) value = ""
    this.push(escape(key) + '=' + escape(value))
  }
  serialize(params, obj, traditional)
  return params.join('&').replace(/%20/g, '+')
}
function appendQuery(url, query) {
  if (query == '') return url
  return (url + '&' + query).replace(/[&?]{1,2}/, '?')
}
function ajaxDataFilter(data, type, settings) {
  if (settings.dataFilter == empty) return data
  var context = settings.context
  return settings.dataFilter.call(context, data, type)
}
function ajax(options){
  // 0. isJsonp
  // 1. xhr
  // 2. open
  // 3. setHeader
  // 4. event
  // 5. send
  var settings = deepClone(options), urlAnchor, hashIndex;
  for (key in ajaxSettings) {
    if (settings[key] === undefined)
      settings[key] = ajaxSettings[key];
  }
  if (!settings.crossDomain) {
    urlAnchor = document.createElement('a')
    urlAnchor.href = settings.url
    // cleans up URL for .href (IE only), see https://github.com/madrobby/zepto/pull/1049
    urlAnchor.href = urlAnchor.href
    settings.crossDomain = (originAnchor.protocol + '//' + originAnchor.host) !== (urlAnchor.protocol + '//' + urlAnchor.host)
  }
  if (!settings.url) settings.url = window.location.toString();
  if ((hashIndex = settings.url.indexOf('#')) > -1) settings.url = settings.url.slice(0, hashIndex)
  serializeData(settings)
  var dataType = settings.dataType, hasPlaceholder = /\?.+=\?/.test(settings.url)
  if (hasPlaceholder) dataType = 'jsonp'
  if (settings.cache === false || (
      (!options || options.cache !== true) &&
      ('script' == dataType || 'jsonp' == dataType)
    )){
    settings.url = appendQuery(settings.url, '_=' + Date.now())
  }
  if ('jsonp' == dataType) {
    if (!hasPlaceholder)
      settings.url = appendQuery(settings.url,
        settings.jsonp ? (settings.jsonp + '=?') : settings.jsonp === false ? '' : 'callback=?')
    return ajaxJsonp(settings)
  }
  var xhr = new XMLHttpRequest(), headers = settings.headers || {},
    protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol;
  var async = 'async' in settings ? settings.async : true;
  xhr.open(settings.type, settings.url, async, settings.username, settings.password);
  headers['contentType'] = settings.contentType || 'application/x-www-form-urlencoded';
  if (!settings.crossDomain) {
    headers['X-Requested-With'] = 'XMLHttpRequest'
  }
  for(var name in headers){
    xhr.setRequestHeader(name, headers['name']);
  }
  xhr.onreadystatechange = function(){
    if (xhr.readyState == 4) {
      xhr.onreadystatechange = empty;
    }
    var result;
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
      if (xhr.responseType == 'arraybuffer' || xhr.responseType == 'blob'){
        result = xhr.response
      }else {
        result = xhr.responseText;
      }
      try {
        // http://perfectionkills.com/global-eval-what-are-the-options/
        // sanitize response accordingly if data filter callback provided
        result = ajaxDataFilter(result, dataType, settings)
        if (dataType == 'script'){

        }else if(dataType == 'xml') {
          result = xhr.responseXML
        }else if (dataType == 'json') {
          result = JSON.parse(result);
        }
      } catch (e) {
        ajaxError(e);
      }
      ajaxSuccess(result, xhr, settings)
    }
  }
  xhr.send(settings.data ? settings.data : null)
  return xhr
}
function ajaxJsonp(options){
  var _callbackName = options.jsonpCallback,
    callbackName = (isFunction(_callbackName) ?
        _callbackName() : _callbackName) || ('TAURUS' + (jsonpID++)),
    responseData,
    originalCallback = window[callbackName],
    abort = function(errorType) {
    },
    xhr = { abort: abort };
  var src = options.url.replace(/\?(.+)=\?/, '?$1=' + callbackName)
  loadJs(src, null, function(node){
    // remove
    if (!responseData) {
      ajaxError(null, 'error', xhr, options)
    } else {
      ajaxSuccess(responseData[0], xhr, options)
    }
    window[callbackName] = originalCallback;
    if (responseData && isFunction(originalCallback))
      originalCallback(responseData[0])
  }, 'head')
  window[callbackName] = function(){
    responseData = arguments;
  }
}
export default ajax;
