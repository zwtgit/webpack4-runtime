import {Cookie} from "../../service/util";

function DAQ_TOUCH() {
  this.type = null
  this.startX = null;
  this.startY = null;
  this.endX = null;
  this.endY = null;
}
DAQ_TOUCH.prototype = {
  start(e){
    if(this.type == 'start'){
      return
    }
    try{
      var touch = e.touches[0] //获取第一个触点
      this.type = 'start'
      this.startX = Number(touch.clientX);
      this.startY = Number(touch.clientY);
    }catch(e){
      console.log(e.message)
    }
  },
  end(e){
    if(this.type == 'end'){
      return
    }
    try{
      this.type = 'end'
      var touch = e.changedTouches[0] //获取第一个触点
      this.endX = Number(touch.clientX);
      this.endY = Number(touch.clientY);
      //判定点击事件
      if(Math.abs(this.startX - this.endX)<5 && Math.abs(this.startY - this.endY)<5){-+
        this.setStatistics('ZY_DAQ_CLK')
      }else{
        this.setStatistics('ZY_DAQ_MOV')
      }
    }catch(e){
      console.log(e.message)
    }
  },
  setStatistics(typeName){
    var cookieScroll = Cookie.getInfo(typeName) || null
    if(cookieScroll == null){
      Cookie.set(typeName,this.startX+'.'+this.startY+'.'+this.endX+'.'+this.endY)
    }else if(cookieScroll.len > 2000){
      ///////////////////////////////////
      Cookie.del(typeName)
      Cookie.set(typeName,this.startX+'.'+this.startY+'.'+this.endX+'.'+this.endY)
    }else{
      ///////////////////////////////////
      Cookie.set(typeName,cookieScroll.val+'_'+this.startX+'.'+this.startY+'.'+this.endX+'.'+this.endY)
    }
  }
}
const touchDaq = new DAQ_TOUCH()

export {touchDaq}
