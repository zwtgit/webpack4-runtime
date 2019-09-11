/**
 * Created by 43872 on 2019/5/13.
 */
import big from '../images/big.png'
import small from '../images/small.png'
export default function () {
  var img1 = new Image()
  img1.src = big
  document.body.appendChild(img1)
  var img = new Image()
  img.src = small
  img.style.height = '200px'
  img.className = 'img'
  document.body.appendChild(img)
}