import {Cookie} from "../../service/util";

function DAQ_SCROLL() {
  this.startPos = null
  this.endPos = null
  this.timer = null
}
DAQ_SCROLL.prototype = {
  statistics(){
    if(this.startPos == null){
      this.startPos = document.documentElement.scrollTop
    }
    if(this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(() => {
      this.endPos = document.documentElement.scrollTop
      this.setStatistics()
      this.startPos = null
    }, 260)
  },
  setStatistics(){
    var cookieScroll = Cookie.getInfo('ZY_DAQ_SCL') || null
    if(cookieScroll == null){
      Cookie.set('ZY_DAQ_SCL',this.startPos+'.'+this.endPos)
    }else if(cookieScroll.len > 3800){
      ///////////////////////////////////
      Cookie.del('ZY_DAQ_SCL')
      Cookie.set('ZY_DAQ_SCL',this.startPos+'.'+this.endPos)
    }else{
      ///////////////////////////////////
      Cookie.set('ZY_DAQ_SCL',cookieScroll.val+'_'+this.startPos+'.'+this.endPos)
    }
  }
}
const scrollDaq = new DAQ_SCROLL()

export {scrollDaq}
