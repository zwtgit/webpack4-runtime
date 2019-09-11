import ajax from './service/ajax'
import {loadJs,creatIframe,createRandomId,expose,os} from './service/util'
import {setRequestTimes} from './sdkPlugin/reqTimes'
import { scrollDaq } from './sdkPlugin/DAQ/scroll'
import { touchDaq } from './sdkPlugin/DAQ/touch'
// import { unloadDaq } from './sdkPlugin/DAQ/unload'
function TaurusWULI(){
  // this.host = "sandbox.8bcd9.com:7777" //stage
  this.host = "//adx.8bcd9.com" //online
  this.datas = [];
  this.messageHandles = {};
  this.bindEvent();
  this.bindScroll()
  this.bindClick()
  // this.bindUnload()
}
TaurusWULI.prototype = {
  push(data){
    var that = this
    if(!data.sid || !data.pid || !data.el) {
      throw new Error("缺少sid、pid、el参数");
      return
    }
    /*获取渲染类型  网盟、DSP*/
    ajax({
      type: 'get',
      url: this.host+'/adx/get/type/v1/'+data.sid+'/'+data.pid,
      dataType: 'jsonp',
      success: function(res){
        if(res.type){
          // //唯一ID，dom
          data.absid = createRandomId()
          data.dom = document.getElementById(data.el)
          data.type = res.type
          that.datas.push(data);
          that.render(data);
        }else {
          throw new Error('未查到当前广告');
        }
      },
      error: function(err){
        throw new Error(err);
      },
    })
  },
  render(data){
    var that = this
    /*刷新效果(效果插件已经弃用)重复调用render,所以createTime放在render*/
    data.createTime = new Date().getTime()
    /*通过cookie计算当前广告次数*/
    setRequestTimes(data)

    if(data.type == 'NATIVE'){
      ajax({
        type: 'get',
        url: this.host+'/ads/call/wap/jp/1?sid='+data.sid+'&c='+data.pid+'&tm='+data.createTime+'&cnt='+data.reqCount,
        dataType: 'jsonp',
        success: function(res){
          if(res.code == '10000'){
            var res = res.ad
            var info = JSON.parse(res.info)
            data.els = res.els
            if(info.cross == 1){//针对百度可跨域
              info.refs.forEach(function (item,i) {
                // 地址栏添加id
                item += '&absid='+ data.absid
                creatIframe(data.dom,item, function (ifm,ins){
                  // 监听iframe内的postMessage事件
                  that.messageHandles[data.absid] = (event)=>{
                    if(data.absid == event.data.absid ){
                      if(!data.loaded) { // wuli直客系统正常吐出广告  && 第一次发送事件
                        data.loaded = true;
                        ins.style.height = event.data.setHeight;
                        data.els.forEach(function (src){expose(src)})
                      }
                    }
                  }
                })
              });
            }else {//非跨域
              //info.refs 兼容老版本
              if(info.refs.length && info.scripts){
                info.refs.forEach(function (item,i) {
                  if(i == info.refs.length-1){
                    loadJs(item,null, function() {
                      if(i == info.refs.length -1){
                        if(info.scripts){
                          data.dom.innerHTML ='';//先清空
                          var js = info.scripts.replace(/#{viewId}/g,data.el)
                          eval(js)
                          data.els.forEach(function (src){expose(src)})
                        }
                      }
                    });
                  }
                })
              }else if(!info.refs.length && info.scripts){
                data.dom.innerHTML ='';//先清空
                var js = info.scripts.replace(/#{viewId}/g,data.el)
                eval(js)
                data.els.forEach(function (src){expose(src)})
              }
            }
          }
        },
        error: function(err){
          throw new Error(err);
        },
      })
    }else if(data.type == 'TEMPLATE'){
      // 生成iframe
      // var src = `${this.host}?sid=${data.sid}&c=${data.pid}&absid=${data.absid}&tm=${data.createTime}&cnt=${data.reqCount}`;//stage
      var src = this.host+'/ads/call/wap/dm/2?sid='+data.sid+'&c='+data.pid+'&absid='+data.absid+'&tm='+data.createTime+'&cnt='+data.reqCount;//online
      creatIframe(data.dom,src,function (ifm,ins) {
        // 监听iframe内的postMessage事件
        that.messageHandles[data.absid] = (event)=>{
          if(data.absid == event.data.absid ){
            //设置ins高（防止死循环，以后可做截流）
            if(ins.offsetHeight != event.data.setHeight){
              ins.style.height = event.data.setHeight + 'px';
            }
            if(event.data.ret && !data.loaded) { // wuli直客系统正常吐出广告  && 第一次发送事件
              data.loaded = true
              Object.assign(data,event.data)
            }else if(!event.data.ret){
              data.dom.innerHTML = ''
            }
          }
        }
      })
    }
  },
  bindEvent(){
    var that = this;
    // 监听 ads.9wuli.com 的message事件
    window.addEventListener('message', function(e){
      // e.origin.indexOf(that.host)//dsp
      // e.origin.indexOf('yk.1ting.com') // 可跨域百度广告
      if(e.origin.indexOf(that.host) > -1 || e.origin.indexOf('yk.1ting.com')> -1){
        for(var absid in that.messageHandles){
          that.messageHandles[absid].call(that, e);
        }
      }
    },false)
  },
  bindScroll(){
    //监听广告进入页面事件
    window.addEventListener('scroll', function () {
      scrollDaq.statistics()
    },false)
  },
  bindClick(){
    if(!os().isPc){
      document.addEventListener('touchstart',function (e) {
        touchDaq.start(e)
      },false);
      document.addEventListener('touchend',function (e) {
        touchDaq.end(e)
      },false);
    }
  },
  // bindUnload(){
  //   unloadDaq.pushState()
  //   window.addEventListener("popstate", function(){
  //     unloadDaq.back()
  //   }, false)
  // }
}
/*动态加载
 loadjs('./wuli.js',function () {
 window.TaurusWULI = window.TaurusWULI || [];
 TaurusWULI.push({sid: "xxx",pid: "xxx",el:'xxx', type: "native",});})
 * */
/*调用前加载
 <script src="wuli.js"></script>
 window.TaurusWULI = window.TaurusWULI || [];
 TaurusWULI.push({sid: "xxx",pid: "xxx",el:'xxx', type: "native",});})
 * */
/*调用后加载
 window.TaurusWULI = window.TaurusWULI || [];
 TaurusWULI.push({sid: "xxx",pid: "xxx",el:'xxx', type: "native",});})
 <script src="wuli.js"></script>
 * */
if(window.TaurusWULI){
  if( window.TaurusWULI instanceof Array){
    var datas = window.TaurusWULI
    window.TaurusWULI = new TaurusWULI();
    datas.forEach(function(item){ window.TaurusWULI.push(item);})
  }
}else {
  window.TaurusWULI = new TaurusWULI();
}
