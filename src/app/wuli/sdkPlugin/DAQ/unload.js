import {Cookie} from "../../service/util";

function DAQ_UNLOAD() {
  this.startT = null
  this.endT = null
}
DAQ_UNLOAD.prototype = {
  pushState(){
    this.startT = new Date().getTime()
    console.log('startT',this.startT)
    window.history.pushState({}, "title", "");
  },
  back(){
    var img = new Image(), key = 'zy_export_' + Math.floor(Math.random() * 2147483648).toString(36);
    window[key] = img;
    img.src = 'http://192.168.1.191:8888/test/666';//利用image src加载url实现曝光统计
    img.onload = img.onerror = img.onabort = function () {//销毁相关实例
      img.onload = img.onerror = img.onabort = null;
      window[key] = null;
      img = null;
    };

    if(this.startT!=null){
      this.endT = new Date().getTime()
      this.setStatistics()
    }
    /*必须放到最后*/
    alert(111)
    history.back()
  },
  setStatistics(){
    var cookieScroll = Cookie.getInfo('ZY_DAQ_DUR') || null
    if(cookieScroll == null){
      Cookie.set('ZY_DAQ_DUR',this.startT+'.'+this.endT)
    }else if(cookieScroll.len > 2000){
      ///////////////////////////////////
      Cookie.del('ZY_DAQ_DUR')
      Cookie.set('ZY_DAQ_DUR',this.startT+'.'+this.endT)
    }else{
      ///////////////////////////////////
      Cookie.set('ZY_DAQ_DUR',cookieScroll.val+'_'+this.startT+'.'+this.endT)
    }
  }
}
const unloadDaq = new DAQ_UNLOAD()

export {unloadDaq}
