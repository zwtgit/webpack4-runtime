import {Cookie} from "../../service/util";

export function setRequestTimes(data){
  var reqCount = Cookie.get(data.sid+data.pid)
  var time = new Date().setHours(0,0,0,0)+(24*3600*1000) - new Date().getTime();
  if(reqCount){
    data.reqCount = Number(reqCount) + 1
  }else {
    data.reqCount = 1
  }
  Cookie.set(data.sid+data.pid,data.reqCount,time)
}
