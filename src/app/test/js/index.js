/**
 * Created by 43872 on 2019/4/18.
 */

/*less测试*/
// import '../style/index.less'
// import '../style/reset.css'

/*url-loader*/
import testUrlLoader from './testless'
testUrlLoader()

/*font测试*/
// import testFont from './testfont'
// testFont()

/*测试hmr*/
// import testhmr from './testhmr'
// testhmr()

/*测试ES6 @babel/polyfill按需打包 */
import testES6 from './testES6'
testES6()

/*测试tree shaking  prod环境下自动按需打包*/
// import {add} from './testTreeShaking'
// add(1,2)

/*测试SplitChunksPlugin*/
// import splitChunksPlugin from './testSplitChunksPlugin'
// splitChunksPlugin()
