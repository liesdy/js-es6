import { stat, exists, readFile} from 'fs';

/**
 * export 命令
 */
export var firstName = 'Michael';
export var lastName = 'Jackson';
export var year = 1958;
// 或者
var firstName = 'Michael';
var lastName = 'Jackson';
var year = 1958;

export { firstName, lastName, year };

// export命令除了输出变量，还可以输出函数或类（class）。
export function multiply(x, y) {
  return x * y;
};

// 通常情况下， export输出的变量就是本来的名字， 但是可以使用as关键字重命名。
function v1() {
  // ...
}
function v2() {
  // ...
}
export {
  v1 as streamV1,
  v2 as streamV2,
  v2 as streamLatestVersion
};

// 需要特别注意的是， export命令规定的是对外的接口， 必须与模块内部的变量建立一一对应关系。

// 报错
export 1;

// 报错
var m = 1;
export m;

// 正确的写法
// 写法一
export var m = 1;

// 写法二
var m = 1;
export { m };

// 写法三
var n = 1;
export { n as m };

// export命令可以出现在模块的任何位置， 只要处于模块顶层就可以。 如果处于块级作用域内， 就会报错  import命令也是如此。这是因为处于条件代码块之中，就没法做静态优化了，违背了 ES6 模块的设计初衷

/**
 * import命令
 */
// 注意import是只读的，不允许对导入的内容进行改写，否则会报错
import {firstName, lastName, year} from './profile.js';
// 导入并重命名
import { lastName as surname } from './profile.js';

// import后面的from指定模块文件的位置，可以是相对路径，也可以是绝对路径，.js后缀可以省略。如果只是模块名，不带有路径，那么必须有配置文件，告诉 JavaScript 引擎该模块的位置。
// import命令是编译阶段执行的，在代码运行之前，因此下面这种情况不会报错
foo();
import { foo } from 'my_module';

// 由于import是静态执行， 所以不能使用表达式和变量， 这些只有在运行时才能得到结果的语法结构。

// import语句会执行所加载的模块，因此可以有下面的写法。
import 'lodash';
// 上面代码仅仅执行lodash模块， 但是不输入任何值。

//目前阶段，通过 Babel 转码，CommonJS 模块的require命令和 ES6 模块的import命令，可以写在同一个模块里面，但是最好不要这样做。因为import在静态解析阶段执行，所以它是一个模块之中最早执行的。下面的代码可能不会得到预期结果。

require('core-js/modules/es6.symbol');
require('core-js/modules/es6.promise');
import React from 'React';

/**
 * 模块的整体加载
 */
// 除了指定加载某个输出值， 还可以使用整体加载， 即用星号（ * ）指定一个对象， 所有输出值都加载在这个对象上面。
// 目前来看似乎这种方式在导入的时候都要用as重命名再用比较好
// circle.js   这是源模块
export function area(radius) {
  return Math.PI * radius * radius;
}

export function circumference(radius) {
  return 2 * Math.PI * radius;
}
// 导入源模块的方式
import * as circle from './circle';
console.log('圆面积：' + circle.area(4));
console.log('圆周长：' + circle.circumference(14));

/**
 * export default 命令
 */
// 与一般写法的对比
// 一般写法
export default function crc32() { // 输出
  // ...
}
import crc32 from 'crc32'; // 输入

// export default 写法
export function crc32() { // 输出
  // ...
};
import { crc32 } from 'crc32'; // 输入


// export default命令其实只是输出一个叫做default的变量， 所以它后面不能跟变量声明语句。
// 错误写法
export default var a = 1;
// export default命令的本质是将后面的值，赋给default变量，所以可以直接将一个值写在export default之后
// 正确
export default 42;
// 报错
export 42;


/**
 * export 与  import 的复合写法
 */
export { foo, bar } from 'my_module';
// 上面代码中， export和import语句可以结合在一起， 写成一行。 但需要注意的是， 写成一行以后， foo和bar实际上并没有被导入当前模块， 只是相当于对外转发了这两个接口， 导致当前模块不能直接使用foo和bar。
// 接口改名
export { foo as myFoo } from 'my_module';
// 整体输出
export * from 'my_module';
// 默认接口的写法如下。
export { default } from 'foo';
// 具名接口改为默认接口的写法如下。
export { es6 as default } from './someModule';


/**
 * 注意
 * export *命令会忽略模块输出的default。
 */
// circleplus.js

export * from 'circle';
export var e = 2.71828182846;
export default function (x) {
  return Math.exp(x);
}
// 加载上面模块的写法如下。
// main.js
import * as math from 'circleplus';
import exp from 'circleplus';
console.log(exp(math.e));
// 上面代码中的import exp表示， 将circleplus模块的默认方法加载为exp方法。

 /**
  * import( )
  */
//  import() 返回一个 Promise 对象。
//  import()是运行时执行，也就是说，什么时候运行到这一句，就会加载指定的模块。
//  import()加载模块成功以后，这个模块会作为一个对象，当作then方法的参数。因此，可以使用对象解构赋值的语法，获取输出接口。
import('./myModule.js').then(({ export1, export2 }) => {
  // ...·
});

// 如果模块有default输出接口， 可以用参数直接获得。
import('./myModule.js').then(myModule => {
  console.log(myModule.default);
});
// 上面的代码也可以使用具名输入的形式。
import('./myModule.js').then(({
  default: theDefault
}) => {
  console.log(theDefault);
});
// 如果想同时加载多个模块， 可以采用下面的写法。
Promise.all([
  import('./module1.js'),
  import('./module2.js'),
  import('./module3.js'),
]).then(([module1, module2, module3]) => {
  // ···
});