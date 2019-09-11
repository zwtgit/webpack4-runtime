
export default function () {
  var dom = document.createElement('button')
  dom.innerHTML = '测试hmr'
  document.body.appendChild(dom)
  dom.onclick = function () {
    var a = document.createElement('p')
    a.innerHTML = new Date()
    document.body.appendChild(a)
  }


}