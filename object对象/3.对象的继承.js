/**
 * prototype属性与原型对象
 */
// 构造函数具有.prototype属性，这个属性就是通过这个构造函数生成的实例的原型对象。原型对象上有的属性和方法，实例都会继承，实例自身也可以重新定义这些属性和方法。

// 所有对象都有自己的原型对象（prototype），注意，是有原型对象，而不是都有有prototype这个属性（这个属性是函数才有的）。
// 一方面，任何一个对象，都可以充当其他对象的原型；另一方面，由于原型对象也是对象，所以它也有自己的原型。
// 所有对象的原型最终都可以上溯到Object.prototype，即Object构造函数的prototype属性。也就是说，所有对象都继承了Object.prototype的属性。这就是所有对象都有valueOf和toString方法的原因，因为这是从Object.prototype继承的。 
// Object.prototype对象有没有它的原型呢？回答是Object.prototype的原型是null。null没有任何属性和方法，也没有自己的原型。因此，原型链的尽头就是null。

// 如果让构造函数的prototype属性指向一个数组，就意味着实例对象可以调用数组方法
var MyArray = function () {};

MyArray.prototype = new Array();
MyArray.prototype.constructor = MyArray;

var mine = new MyArray();
mine.push(1, 2, 3);
mine.length // 3
mine instanceof Array // t

/**
 * constructor 属性
 */
// prototype对象有一个constructor属性，默认指向prototype对象所在的构造函数
function P() {}
P.prototype.constructor === P // true

// constructor属性的作用是， 可以得知某个实例对象， 到底是哪一个构造函数产生的
function F() {};
var f = new F();

f.constructor === F // true
f.constructor === RegExp // false

/**
 * instanceof
 */
// 运算符的左边是实例对象， 右边是构造函数
var x = [1, 2, 3];
var y = {};
x instanceof Array // true
y instanceof Object // true
// 但其实因为查的是原型链，所以 x instanceof Object 的结果也是true
// 注意，instanceof运算符只能用于对象，不适用原始类型的值。如下
var s = 'hello';
s instanceof String // false
// 此外，对于undefined和null，instanceof运算符总是返回false。
undefined instanceof Object // false
null instanceof Object // false

// 利用instanceof运算符可以更好地黎姐new命令
// 下面的代码使用instanceof运算符，在函数体内部判断this关键字是否为构造函数Fubar的实例。如果不是，就表明忘了加new命令。
function Fubar(foo, bar) {
  if (this instanceof Fubar) {
    this._foo = foo;
    this._bar = bar;
  } else {
    return new Fubar(foo, bar);
  }
}

/**
 * test
 */
function Sub(aa) {
  this.a = aa
}
function Super(bb, cc = '2') {
  this.b = bb
  this.c = cc
}
Sub.prototype = Object.create(Super.prototype);
Sub.prototype.constructor = Sub;
var rect = new Sub('1')
rect instanceof Sub // true
rect instanceof Super // true

rect // {a: "1"}
rect.a // '1'
rect.c // undefined
// 可见Super已经加入到了sub的原型链了，但是除了prototype里面的内容，构造函数Super定义的那些属性并没有被继承
// 所以需要通过下面的方式来实现的构造函数继承。
function Sub(aa) {
  Super.call(this)
  this.a = aa
}
// 或者
function Sub(aa) {
  this.base = Super
  this.base()
  this.a = aa
}

/**
 * 完整的例子
 */
function Sub(aa) {
  this.base = Super
  this.base()
  this.a = aa
}
function Super(bb, cc = '2') {
  // 上面的'2'是cc的默认值，如果没有参数传入则默认取'2'
  this.b = bb
  this.c = cc
}
Sub.prototype = Object.create(Super.prototype);
Sub.prototype.constructor = Sub;
var rect = new Sub('1')
var rect2 = new Sub('2', '3')
rect // Sub {b: undefined, c: "2", a: "1", base: ƒ}
Sub // {b: undefined, c: "2", a: "2", base: ƒ}
// 可见当构造函数和原型链上的构造函数都可以通过传参的方式构造实例时，执行传参构造函数的时候，参数只会为当前构造函数所用，原型链上的构造函数拿不到参数