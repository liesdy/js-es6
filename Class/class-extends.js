/**
 * ES5 的继承， 实质是先创造子类的实例对象this， 然后再将父类的方法添加到this上面（ Parent.apply(this)）。 
 * ES6 的继承机制完全不同
 * 实质是先将父类实例对象的属性和方法， 加到this上面（ 所以必须先调用super方法）， 然后再用子类的构造函数修改this。
 */
class Point {}

class ColorPoint extends Point {
  constructor(x, y, color) {
    super(x, y); // 调用父类的constructor(x, y)
    this.color = color;
  }

  toString() {
    return this.color + ' ' + super.toString(); // 调用父类的toString()
  }
}

// 如果子类没有定义constructor方法， 这个方法会被默认添加， 代码如下。 
// 也就是说， 不管有没有显式定义， 任何一个子类都有constructor方法。
class ColorPoint extends Point {}

// 等同于
class ColorPoint extends Point {
  constructor(...args) {
    super(...args);
  }
}

// 另一个需要注意的地方是， 在子类的构造函数中， 只有调用super之后， 才可以使用this关键字， 否则会报错。 
// 这是因为子类实例的构建， 基于父类实例， 只有super方法才能调用父类实例。

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class ColorPoint extends Point {
  constructor(x, y, color) {
    this.color = color; // ReferenceError
    super(x, y);
    this.color = color; // 正确
  }
}

// 父类的静态方法， 也会被子类继承。

class A {
  static hello() {
    console.log('hello world');
  }
}

class B extends A {}

B.hello() // hello world
// 上面代码中， hello() 是A类的静态方法， B继承A， 也继承了A的静态方法。



/**
 * Object.getPrototypeOf()
 */
// Object.getPrototypeOf方法可以用来从子类上获取父类。
Object.getPrototypeOf(ColorPoint) === Point
// true

/**
 * super 关键字
 */
// super这个关键字， 既可以当作函数使用， 也可以当作对象使用。 在这两种情况下， 它的用法完全不同。
// super作为函数调用时， 代表父类的构造函数。 ES6 要求， 子类的构造函数必须执行一次super函数。
class A {
  constructor() {
    console.log(new.target.name);
  }
}
class B extends A {
  constructor() {
    super();
  }
}
new A() // A
new B() // B
// 注意， super虽然代表了父类A的构造函数， 但是返回的是子类B的实例， 即super内部的this指的是B的实例， 因此super() 在这里相当于A.prototype.constructor.call(this)。

// 作为函数时， super() 只能用在子类的构造函数之中， 用在其他地方就会报错。
class A {}
class B extends A {
  m() {
    super(); // 报错
  }
}

// super作为对象时，在普通方法中，指向父类的原型对象；在静态方法中，指向父类。
class A {
  p() {
    return 2;
  }
}

class B extends A {
  constructor() {
    super();
    console.log(super.p()); // 2
  }
}

let b = new B();
// 上面代码中， 子类B当中的super.p()， 就是将super当作一个对象使用。 这时， super在普通方法之中， 指向A.prototype， 所以super.p() 就相当于A.prototype.p()。


// 这里需要注意， 由于super指向父类的原型对象， 所以定义在父类实例上的方法或属性， 是无法通过super调用的。
class A {
  constructor() {
    this.p = 2;
  }
}

class B extends A {
  get m() {
    return super.p;
  }
}

let b = new B();
b.m // undefined
// 上面代码中， p是父类A实例的属性， super.p就引用不到它。

// ES6 规定， 在子类普通方法中通过super调用父类的方法时， 方法内部的this指向当前的子类实例。
class A {
  constructor() {
    this.x = 1;
  }
  print() {
    console.log(this.x);
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
  }
  m() {
    super.print();
  }
}

let b = new B();
b.m() // 2

// 由于this指向子类实例，所以如果通过super对某个属性赋值，这时super就是this，赋值的属性会变成子类实例的属性。
class A {
  constructor() {
    this.x = 1;
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
    super.x = 3;
    console.log(super.x); // undefined
    console.log(this.x); // 3
  }
}

let b = new B();

// 如果super作为对象， 用在静态方法之中， 这时super将指向父类(静态)， 而不是父类的原型对象。

class Parent {
  static myMethod(msg) {
    console.log('static', msg);
  }

  myMethod(msg) {
    console.log('instance', msg);
  }
}

class Child extends Parent {
  static myMethod(msg) {
    super.myMethod(msg);
  }

  myMethod(msg) {
    super.myMethod(msg);
  }
}

Child.myMethod(1); // static 1

var child = new Child();
child.myMethod(2); // instance 2
// 上面代码中， super在静态方法之中指向父类(静态)， 在普通方法之中指向父类的原型对象。


// 另外， 在子类的静态方法中通过super调用父类的方法时， 方法内部的this指向当前的子类， 而不是子类的实例。
class A {
  constructor() {
    this.x = 1;
  }
  static print() {
    console.log(this.x);
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
  }
  static m() {
    super.print();
  }
}

B.x = 3;
B.m() // 3