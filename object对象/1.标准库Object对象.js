/**
 * 单词解释
 * instance 例子,实例
 * instanceof运算符用来验证， 一个对象是否为指定的构造函数的实例。
 * 
 * prototype[ˈprəʊtətaɪp] 原型，雏形，最初形态
 * property 所有物，财产，不动产，房产，庄园
 * own 自己的，本人的
 */

// 面向对象编程
// 对象属性的描述对象
// 包装对象
// 数据类型转换

// Object本身是一个函数， 可以当作工具方法使用， 将任意值转为对象。 这个方法常用于保证某个值一定是对象，如果参数本身就是对象则返回自身，如果参数是原始类型的值， Object方法将其转为对应的包装对象的实例（ 参见《 原始类型的包装对象》 一章）。
var obj = Object(1);
obj instanceof Object // true
obj instanceof Number // true

// Object也可以作为构造函数，使用new，传不传值都行，不传值则生成空对象，传值使用的实际结果和上文所提到的Object作为工具方法时返回的结果一样，虽然语义不同。
var obj = new Object();
// 与字面量的写法var obj = {}是等价的。或者说，后者只是前者的一种简便写法。
var o1 = {
  a: 1
};
var o2 = new Object(o1);
o1 === o2 // true

var obj = new Object(123);
obj instanceof Number // true




/**
 * Object的静态方法
 * 部署在Object对象自身上的方法，使用时要通过Object.xxxx（）的形式来调用
 */
// Object.keys方法和Object.getOwnPropertyNames方法都用来遍历对象的属性。Object.keys方法只返回可枚举的属性（详见《对象属性的描述对象》一章），Object.getOwnPropertyNames方法还返回不可枚举的属性名。
var a = ['Hello', 'World'];

Object.keys(a) // ["0", "1"]
Object.getOwnPropertyNames(a) // ["0", "1", "length"]
// 一般情况下， 几乎总是使用Object.keys方法， 遍历对象的属性。



// Object实例方法可以在实例上用自定义方法覆盖

Object.prototype.valueOf()
// valueOf方法的作用是返回一个对象的“值”，默认情况下返回对象本身。

Object.prototype.toString()
// toString方法的作用是返回一个对象的字符串形式， 默认情况下返回类型字符串。
var o1 = new Object();
o1.toString() // "[object Object]"

var o2 = {
  a: 1
};
o2.toString() // "[object Object]"

// 对象在于数字做类似加减运算的时候会调用valueOf方法。
// Object.prototype.toString方法返回对象的类型字符串， 因此可以用来判断一个值的类型。

var obj = {};
obj.toString() // "[object Object]"
// 其中第二个Object表示该值的构造函数。这是一个十分有用的判断数据类型的方法。


/**
 * 通过写自定义方法覆盖它之后可以使这个自定义方法在对象与字符串拼接的时候被调用得到想要的字符串
 * 另外，数组、 字符串、 函数、 Date 对象都分别部署了自定义的toString方法， 覆盖了Object.prototype.toString方法。
 */
[1, 2, 3].toString() // "1,2,3"

'123'.toString() // "123"

(function () {
  return 123;
}).toString()
// "function () {
//   return 123;
// }"

(new Date()).toString()
// "Tue May 10 2016 09:11:31 GMT+0800 (CST)"

// 由于实例对象可能会自定义toString方法， 覆盖掉Object.prototype.toString方法， 所以如果为了判断对象类型的话，最好直接使用Object.prototype.toString方法，配合call方法帮助我们判断这个值的类型
Object.prototype.toString.call(value)

// 不同数据类型的Object.prototype.toString方法返回值如下。

// 数值： 返回[object Number]。
// 字符串： 返回[object String]。
// 布尔值： 返回[object Boolean]。
// undefined： 返回[object Undefined]。
// null： 返回[object Null]。
// 数组： 返回[object Array]。
// arguments 对象： 返回[object Arguments]。
// 函数： 返回[object Function]。
// Error 对象： 返回[object Error]。
// Date 对象： 返回[object Date]。
// RegExp 对象： 返回[object RegExp]。
// 其他对象： 返回[object Object]。

/**
 * Object.prototype.toLocaleString
 */
// Object.prototype.toLocaleString方法与toString的返回结果相同， 也是返回一个值的字符串形式。
// 可以把这个方法理解为toString的一个分支，默认情况下返回值和toString相同，但是可以通过自定义方法覆盖它从而得到必要的转换方式
// 目前主要有Array、Number、Date三个方法自定义了toLocaleString方法
// 最重要的就是日期的实例对象（或者说记住这个差不多就行了，应当说这个可以放在日期对象里面作为一个方法来记忆）
var date = new Date();
date.toString() // "Tue Jan 01 2018 12:01:33 GMT+0800 (CST)"
date.toLocaleString() // "1/01/2018, 12:01:33 PM"

// Object.prototype.hasOwnProperty方法接受一个字符串作为参数， 返回一个布尔值， 表示该实例对象自身是否具有该属性。
var obj = {
  p: 123
};

obj.hasOwnProperty('p') // true
obj.hasOwnProperty('toString') // false