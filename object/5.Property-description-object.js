// 属性描述对象可以理解为属性的属性
// {
//   value: 123,
//   writable: false,
//   enumerable: true,
//   configurable: false,
//   get: undefined,
//   set: undefined
// }

// value        是该属性的属性值， 默认为undefined。

// writable     是一个布尔值， 表示属性值（ value） 是否可改变（ 即是否可写）， 默认为true。
//              如果原型对象的某个属性的writable为false，那么子对象将无法自定义这个属性。

// enumerable   是一个布尔值， 表示该属性是否可遍历， 默认为true。

// configurable 是一个布尔值， 表示可配置性， 默认为true。 如果设为false， 将阻止某些操作改写该属性， 比如无法删除该属性， 也不得改变该属性的属性描述对象，也就是说， configurable属性控制了属性描述对象的 ！部分 可写性。 configurable为false时，enumerable和configurable都不能被修改了, ！writable ！可以从true改成false但是从false改为true则会报错
// 另外  configurable 如果是false  则这个属性是不能被 ！delete命令 删除的

// writable 和 configurable 这两个属性，这两个属性只要有一个是true。就可以使用Object.defineProperty(obj, 'p', {value: 2})这种方式更改obj的属性'p'
// 而能否通过 obj.p = xxx 的方式来更改属性，则取决于 writable 属性，与  configurable 没有关系


/**
 * 存取器 obj.p定义了get和set属性。 obj.p取值时， 就会调用get； 赋值时， 就会调用set。
 */
// get          是一个函数， 表示该属性的取值函数（ getter）， 默认为undefined。
// set          是一个函数， 表示该属性的存值函数（ setter）， 默认为undefined。
var obj = Object.defineProperty({}, 'p', {
  get: function () {
    return 'getter';
  },
  set: function (value) {
    console.log('setter: ' + value);
  }
});
obj.p // "getter"
obj.p = 123 // "setter: 123"

// JavaScript 还提供了存取器的另一种写法。（使用更广泛）
var obj = {
  get p() {
    return 'getter';
  },
  set p(value) {
    console.log('setter: ' + value);
  }
};
obj.p // "getter"
obj.p = 123 // "setter: 123"



/**
 * Object.defineProperty()， Object.defineProperties()
 */
// Object.defineProperty() 方法允许通过属性描述对象， 定义或修改一个属性， 然后返回修改后的对象，它的用法如下。
// Object.defineProperty(object, propertyName, attributesObject)

// Object.defineProperty方法接受三个参数， 依次如下。
// object： 属性所在的对象
// propertyName： 字符串， 表示属性名
// attributesObject： 属性描述对象
// 举例
var obj = Object.defineProperty({}, 'p', {
  value: 123,
  writable: false,
  enumerable: true,
  configurable: false
});

obj.p // 123

obj.p = 246;
obj.p // 123

// 如果一次性定义或修改多个属性， 可以使用Object.defineProperties() 方法。
var obj = Object.defineProperties({}, {
  p1: {
    value: 123,
    enumerable: true
  },
  p2: {
    value: 'abc',
    enumerable: true
  },
  p3: {
    get: function () {
      return this.p1 + this.p2
    },
    enumerable: true,
    configurable: true
  }
});

obj.p1 // 123
obj.p2 // "abc"
obj.p3 // "123abc"
// 注意， 一旦定义了取值函数get（ 或存值函数set）， 就不能将writable属性设为true， 或者同时定义value属性， 否则会报错。
// Object.defineProperty() 和Object.defineProperties() 参数里面的属性描述对象， writable、 configurable、 enumerable这三个属性的默认值都为false。


/**
 * Object.getOwnPropertyDescriptor() 
 */
// 这个方法可以获取属性描述对象。 它的第一个参数是目标对象， 第二个参数是一个字符串， 对应目标对象的某个属性名。
var obj = {
  p: 'a'
};
Object.getOwnPropertyDescriptor(obj, 'p')
// Object { value: "a",
//   writable: true,
//   enumerable: true,
//   configurable: true
// }

/**
 * Object.prototype.propertyIsEnumerable()
 */
// 实例对象的propertyIsEnumerable() 方法返回一个布尔值， 用来判断某个属性是否可遍历。 注意， 这个方法只能用于判断对象自身的属性， 对于继承的属性一律返回false。

var obj = {};
obj.p = 123;

obj.propertyIsEnumerable('p') // true
obj.propertyIsEnumerable('toString') // false
// 上面代码中， obj.p是可遍历的， 而obj.toString是继承的属性。


/**
 * 控制对象状态
 */
// JavaScript 提供了三种冻结方法， 
// 最弱的一种是Object.preventExtensions     
// 无法再添加新的属性
// Object.isExtensible()  用于检查一个对象是否使用了Object.preventExtensions方法。也就是说，检查是否可以为一个对象添加属性。

// 其次是Object.seal    (seal的单词意思  封上  密封  封盖)   
// 无法添加和修改.  实质是把属性描述对象的configurable属性设为false，因此属性描述对象不再能改变了。
// 不过虽然不能添加和删除，但不影响是否可以修改属性的值（属性值能否修改以 writable 为准）
// Object.isSealed方法用于检查一个对象是否使用了Object.seal方法。

// 最强的是Object.freeze。   
// 无法添加新属性、无法删除旧属性、也无法改变属性的值，使得这个对象实际上变成了常量。
// Object.isFrozen方法用于检查一个对象是否使用了Object.freeze方法。
// 与const相同的是，如果属性值是对象，上面这些方法只能冻结属性指向的对象的内存地址，而不能冻结对象本身的内容