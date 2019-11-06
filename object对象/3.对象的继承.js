/**
 * prototype属性与原型对象
 */
// 构造函数具有.prototype属性，这个属性就是通过这个构造函数生成的实例的原型对象。原型对象上有的属性和方法，实例都会继承，实例自身也可以重新定义这些属性和方法。

// 所有对象都有自己的原型对象（prototype）。一方面，任何一个对象，都可以充当其他对象的原型；另一方面，由于原型对象也是对象，所以它也有自己的原型。
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