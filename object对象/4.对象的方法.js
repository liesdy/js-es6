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