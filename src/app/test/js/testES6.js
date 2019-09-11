/**
 * Created by 43872 on 2019/5/13.
 */
function sleep(time) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve('ing');
    }, time);
  })
};

async function start() {
  console.log('start');
  await sleep(3000).then(res=>{
    console.log(res)
  });
  console.log('end');
}


export default function () {
  let arr = [1,2,3,4,5]
  console.log('abcdefg',arr.map(item=>item*2))
  start()
}