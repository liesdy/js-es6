class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }
}

/**
 * ES6 的类， 完全可以看作构造函数的另一种写法。
 */
class Point {
  // ...
}

typeof Point // "function"
Point === Point.prototype.constructor // true

// 使用的时候， 也是直接对类使用new命令， 跟构造函数的用法完全一致。
class Bar {
  doStuff() {
    console.log('stuff');
  }
}

var b = new Bar();
b.doStuff() // "stuff"

// prototype对象的constructor属性， 直接指向“ 类” 的本身， 这与 ES5 的行为是一致的。
Point.prototype.constructor === Point // true

/**
 *!!!!!!!类的内部所有定义的方法， 都是不可枚举的（ non - enumerable） 这一点与 ES5 的行为不一致。
 */

//  实例的属性除非显式定义在其本身（ 即定义在this对象上）， 否则都是定义在原型上（ 即定义在class上）。
//定义类
class Point {

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }

}
var point = new Point(2, 3);
point.toString() // (2, 3)
point.hasOwnProperty('x') // true
point.hasOwnProperty('y') // true
point.hasOwnProperty('toString') // false
point.__proto__.hasOwnProperty('toString') // true

/**
 * 与函数一样， 类也可以使用表达式的形式定义。
 */
const MyClass = class Me {
  getClassName() {
    return Me.name;
  }
};
// 上面代码使用表达式定义了一个类。需要注意的是，这个类的名字是Me，但是Me只在 Class 的内部可用，指代当前类。在 Class 外部，这个类只能用MyClass引用。
let inst = new MyClass();
inst.getClassName() // Me
Me.name // ReferenceError: Me is not defined

// 如果类的内部没用到的话， 可以省略Me， 也就是可以写成下面的形式。

const MyClass = class {  /* ... */ };
// 这样就好理解了


/**
 * 箭头函数可以防止类中的方法被单独拿出来使用后this指向使用环境
 */
// 因为箭头函数中的this始终指向定义时的环境

/**
 * 静态方法
 */
// 加上static关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”。
class Foo {
  static classMethod() {
    return 'hello';
  }
}
// 注意，如果静态方法包含this关键字，这个this指的是类，而不是实例。

Foo.classMethod() // 'hello'

var foo = new Foo();
foo.classMethod()
// TypeError: foo.classMethod is not a function

// 父类的静态方法， 可以被子类继承。

class Foo {
  static classMethod() {
    return 'hello';
  }
}

class Bar extends Foo {}

Bar.classMethod() // 'hello'

/**
 * 实例属性的新写法
 */
// 实例属性除了定义在constructor() 方法里面的this上面， 也可以定义在类的最顶层。
class IncreasingCounter {
  _count = 0;
  get value() {
    console.log('Getting the current value!');
    return this._count;
  }
  increment() {
    this._count++;
  }
}
// 上面代码中， 实例属性_count与取值函数value() 和increment() 方法， 处于同一个层级。 这时， 不需要在实例属性前面加上this。
// 这种新写法的好处是， 所有实例对象自身的属性都定义在类的头部， 看上去比较整齐， 一眼就能看出这个类有哪些实例属性。也比较简洁

/**
 * 静态属性
 */
// 目前ES6 明确规定， Class 内部只有静态方法， 没有静态属性
// 设置静态属性目前只有下面一种方法可行
class Foo {}

Foo.prop = 1;
Foo.prop // 1

// 后期可能会将使用static前缀标注静态属性的方式实现，虽然不知道是什么时候


/**
 * 私有属性和方法
 */
// es6暂不提供类的私有方法和属性，目前有其他的变通方
// 比如这样
class Widget {
  foo(baz) {
    bar.call(this, baz);
  }

  // ...
}

function bar(baz) {
  return this.snaf = baz;
}
// 目前，有一个提案，为class加了私有属性。方法是在属性名之前，使用#表示。
// 这种写法不仅可以写私有属性， 还可以用来写私有方法。

class Foo {
  #a;
  #b;
  constructor(a, b) {
    this.#a = a;
    this.#b = b;
  }
  #sum() {
    return# a + #b;
  }
  printSum() {
    console.log(this.#sum());
  }
}
// 另外， 私有属性也可以设置 getter 和 setter 方法。

class Counter {
  #xValue = 0;

  constructor() {
    super();
    // ...
  }

  get #x() {
    return# xValue;
  }
  set #x(value) {
    this.#xValue = value;
  }
}

// 实例也可以引用私有属性。
class Foo {
  #privateValue = 42;
  static getPrivateValue(foo) {
    return foo.#privateValue;
  }
}

Foo.getPrivateValue(new Foo()); // 42
// 私有属性和私有方法前面，也可以加上static关键字，表示这是一个静态的私有属性或私有方法。
class FakeMath {
  static PI = 22 / 7;
  static# totallyRandomNumber = 4;

  static# computeRandomNumber() {
    return FakeMath.#totallyRandomNumber;
  }

  static random() {
    console.log('I heard you like random numbers…')
    return FakeMath.#computeRandomNumber();
  }
}

FakeMath.PI // 3.142857142857143
FakeMath.random()
// I heard you like random numbers…
// 4
FakeMath.#totallyRandomNumber // 报错
FakeMath.#computeRandomNumber() // 报错

/**
 * new.target 属性
 */
// Class 内部调用new.target， 返回当前 Class。
class Rectangle {
  constructor(length, width) {
    console.log(new.target === Rectangle);
    this.length = length;
    this.width = width;
  }
}

var obj = new Rectangle(3, 4); // 输出 true


// 需要注意的是， 子类继承父类时， new.target会返回子类。

class Rectangle {
  constructor(length, width) {
    console.log(new.target === Rectangle);
    // ...
  }
}

class Square extends Rectangle {
  constructor(length) {
    super(length, width);
  }
}

var obj = new Square(3); // 输出 false

// 利用这个特点， 可以写出不能独立使用、 必须继承后才能使用的类。

class Shape {
  constructor() {
    if (new.target === Shape) {
      throw new Error('本类不能实例化');
    }
  }
}

class Rectangle extends Shape {
  constructor(length, width) {
    super();
    // ...
  }
}

var x = new Shape(); // 报错
var y = new Rectangle(3, 4); // 正确
// 上面代码中， Shape类不能被实例化， 只能用于继承。

// 注意， 在函数外部， 使用new.target会报错。