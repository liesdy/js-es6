/**
 * Object.getPrototypeOf()
 */
// Object.getPrototypeOf方法返回参数对象的原型。这是获取原型对象的标准方法。
var F = function () {};
var f = new F();
Object.getPrototypeOf(f) === F.prototype // true

// 函数的原型是 Function.prototype
function f() {}
Object.getPrototypeOf(f) === Function.prototype // true


/**
 * Object.setPrototypeOf
 */
// Object.setPrototypeOf方法为参数对象设置原型，返回该参数对象。它接受两个参数，第一个是现有对象，第二个是原型对象。
var a = {};
var b = {
  x: 1
};
Object.setPrototypeOf(a, b);

Object.getPrototypeOf(a) === b // true
a.x // 1

// new命令可以使用Object.setPrototypeOf方法模拟。
var F = function () {
  this.foo = 'bar';
};

var f = new F();
// 等同于
var f = Object.setPrototypeOf({}, F.prototype);
F.call(f);
// 由此根据我个人推测，setPrototypeOf方法中的this是指向第一个参数的

/**
 * Object.create(obj)
 */
// 以参数对象为原型生成实例对象(参数不能为空，否则会报错)

var A = {
  print: function () {
    console.log('hello');
  }
};
var B = Object.create(A);

Object.getPrototypeOf(B) === A // true
B.print() // hello
B.print === A.print // true

// 原理
if (typeof Object.create !== 'function') {
  Object.create = function (obj) {
    function F() {}
    F.prototype = obj;
    return new F();
  };
}
// 上面代码表明，Object.create方法的实质是新建一个空的构造函数F，然后让F.prototype属性指向参数对象obj，最后返回一个F的实例，从而实现让该实例继承obj的属性。

// 如果想要生成一个不继承任何属性（比如没有toString和valueOf方法）的对象，可以将Object.create的参数设为null。
var obj = Object.create(null);
obj.valueOf()
// TypeError: Object [object Object] has no method 'valueOf'

/**
 * Object.getOwnPropertyNames()
 * for in (in 运算符)
 * Object.keys()
 */
// Object.getOwnPropertyNames()只获取实例自身的属性，不获取来自原型链的属性，且不管该属性是否可以被遍历，都会被获取
// （for in）只获取可遍历的属性，但不区分是实例自身属性还是来自原型链  in 运算符直接返回布尔值，似乎不管是否可遍历
var obj = {};
'toString' in obj // true
// Object.keys()只获取实例自身可遍历的属性
// 题外话 一个属性是否可遍历取决于属性自身的描述对象中的enumerable属性，true为可遍历，false为不可遍历。
// 不可遍历的属性用for...in    Object.keys   JSON.stringify()这三种方式都取不到

// 如果想要获取对象的所有属性（不管是自身的还是继承的，也不管是否可枚举），可以使用下面的函数。
function inheritedPropertyNames(obj) {
var props = {};
while (obj) {
  Object.getOwnPropertyNames(obj).forEach(function (p) {
    props[p] = true;
  });
  obj = Object.getPrototypeOf(obj);
}
return Object.getOwnPropertyNames(props);
}




/**
 * Object.prototype.isPrototypeOf()
 */
// 实例对象的isPrototypeOf方法， 用来判断该对象是否为参数对象的原型。

var o1 = {};
var o2 = Object.create(o1);
var o3 = Object.create(o2);

o2.isPrototypeOf(o3) // true
o1.isPrototypeOf(o3) // true


/**
 * Object.prototype.hasOwnProperty()
 */
// 对象实例的hasOwnProperty方法返回一个布尔值，用于判断某个属性定义在对象自身，还是定义在原型链上。
Date.hasOwnProperty('length') // true
Date.hasOwnProperty('toString') // false
// 上面代码表明，Date.length（构造函数Date可以接受多少个参数）是Date自身的属性，Date.toString是继承的属性
// 另外，hasOwnProperty方法是 JavaScript 之中唯一一个处理对象属性时，不会遍历原型链的方法。



/**
 * Object.prototype.__proto__
 */
// 实例对象的__proto__属性（ 前后各两个下划线）， 返回该对象的原型。 该属性可读写。

var obj = {};
var p = {};

obj.__proto__ = p;
Object.getPrototypeOf(obj) === p // true
// 上面代码通过__proto__属性，将p对象设为obj对象的原型。
// 根据语言标准，__proto__属性只有浏览器才需要部署，其他环境可以没有这个属性。它前后的两根下划线，表明它本质是一个内部属性，不应该对使用者暴露。因此，应该尽量少用这个属性，而是用Object.getPrototypeOf()和Object.setPrototypeOf()，进行原型对象的读写操作。