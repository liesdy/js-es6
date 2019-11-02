/**
 * 例子1
 */
function fn1() {
  console.log('fn1-this:', this);
}
function fn2() {
  console.log('fn2-this:', this);
}
fn1.call.call(fn2)
// fn1.call.call.call.call(fn2)

// 最后运行的是fun2也就是
// fn2-this: Window

// 运行推导
// 首先.call(fn2)执行
// 执行者是fn1.call。
// 因此fn1.call内部的this变成了fn2
// 而fn1.call内部的this代表的是运行环境，也就是fn1，也就是说fn1.call正常情况下直接执行this的时候相当于fn1执行了，通过.call传入的参数改变的是fn1代码块中的this指向，并没有改变fn1.call执行时使用的那个this
// 但现在因为fn1.call()执行时使用的this变成了fn2，所以再执行fn1.call()时，window被传入且代替了原本函数代码块中的this。而真正指代函数本身的this已经变成了fn2。fn2运行，于是输出了 fn2-this: Window

/**
 * .call()的本质
 */
Function.prototype.call = function (context) {
  // 改变fn中的this关键字
  // eval(....);

  // 让fn方法执行
  this(); // 此时的this就是test1
};

/**
 * 例子2
 */
function fn2(a) {
  console.log('a: ', a);
  console.log('fn2-this:', this);
}
var slice = Function.prototype.call.bind(fn2);
slice(666)
// a: undefind
// fn2-this: Number {666}

function fn2(a) {
  console.log('a: ', a);
  console.log('fn2-this:', this);
}
var slice = Function.prototype.call.bind(fn2);
slice(666, 9)
// a: 9
// fn2-this: Number {666}

/**注意！虽然最终执行的是fn2,但本身还是call方法，其改变原有代码块this指向的功能不变，只是改变完原有代码块中this指向为数字6后。call方法本身最终执行用的那个this指代的方法被改变成了fn2。相当于最终执行一个内部this为6的fn2。
也就是说如果fn2方法是可以传入参数的话，传入的第一个参数就会改变fn2自身this的指向。后续的参数才是形参 */


/**
 * 最后看一个比较离谱的例子
 */
function f() {
  console.log(this.v);
}

var o = {
  v: 123
};
var bind = Function.prototype.call.bind(Function.prototype.bind);
bind(f, o)() // 123

/**实际流程
 * 1.首先bind方法把Function.prototype.call中的this， 也就是最终执行方法改成了Function.prototype.bind （本质还是call方法，只是最终执行方法改掉了）
 * 2. bind（ f, o） 执行， 相当于是Function.prototype.call（ f, o） 执行， 运行的是.call方法的最终执行方法， 也就是Function.prototype.bind
 * 3. 同时， 因为本体是call方法。 所以实现了call改变执行代码内部this指向的功能。 把最终执行的Function.prototype.bind中的this指向了f， 并把o作为参数传给了Function.prototype.bind
 * 4. 因为Function.prototype.bind中的this也是bind的最终执行代码。 所以这时候运行的Function.prototype.bind，实际最终执行的代码是f。
 * 但是这种改变同样只是改变最终执行代码， Function.prototype.bind将执行代码也就是f中的this指向O的功能并没有受到影响
 * 因此，当代码最后运行的时候，实际执行的是内部this被指向O的f函数。于是它打印出了o.v  也就是123
 * 
 */