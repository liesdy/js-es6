/**
 * Number
 */

// 字符串：如果不可以被解析为数值，返回 NaN
Number('324abc') // NaN
// 空字符串转为0
Number('') // 0
// undefined：转成 NaN
Number(undefined) // NaN
// null：转成0
Number(null) // 0

// Number函数将字符串转为数值， 要比parseInt函数严格很多。 基本上， 只要有一个字符无法转成数值， 整个字符串就会被转为NaN。
// 简单的规则是， Number方法的参数是对象时， 将返回NaN， 除非是包含单个数值的数组。

Number({
  a: 1
}) // NaN
Number([1, 2, 3]) // NaN
Number([5]) // 5

// 原理
// 第一步， 调用对象自身的valueOf方法。 如果返回原始类型的值， 则直接对该值使用Number函数， 不再进行后续步骤。

// 第二步， 如果valueOf方法返回的还是对象， 则改为调用对象自身的toString方法。 如果toString方法返回原始类型的值， 则对该值使用Number函数， 不再进行后续步骤。

// (ps: 数组 字符串  函数  Date对象都各自重新定义了toString方法)
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

// 第三步， 如果toString方法返回的是对象， 就报错。


/**
 * String()
 */
String(123) // "123"
String('abc') // "abc"
String(true) // "true"
String(undefined) // "undefined"
String(null) // "null"

// String方法的参数如果是对象， 返回一个类型字符串； 如果是数组， 返回该数组的字符串形式。
String({
  a: 1
}) // "[object Object]"
String([1, 2, 3]) // "1,2,3"
// String方法背后的转换规则， 与Number方法基本相同， 只是互换了valueOf方法和toString方法的执行顺序。
// 1.先调用对象自身的toString方法。 如果返回原始类型的值， 则对该值使用String函数， 不再进行以下步骤。

// 2.如果toString方法返回的是对象， 再调用原对象的valueOf方法。 如果valueOf方法返回原始类型的值， 则对该值使用String函数， 不再进行以下步骤。

// 3.如果valueOf方法返回的是对象， 就报错。

/**
 * Boolean()
 */
Boolean(undefined) // false
Boolean(null) // false
Boolean(0) // false
Boolean(NaN) // false
Boolean('') // false
// 除此以外其他都是 true

/**
 * 自动转换的规则
 */
// 预期什么类型的值， 就调用该类型的转换函数。 比如， 某个位置预期为字符串， 就调用String函数进行转换。 如果该位置即可以是字符串， 也可能是数值， 那么默认转为数值。

/**
 * 自动转换为字符串
 */
'5' + 1 // '51'
'5' + true // "5true"
'5' + false // "5false"
'5' + {} // "5[object Object]"
'5' + [] // "5"
'5' + function () {} // "5function (){}"
'5' + undefined // "5undefined"
'5' + null // "5null"

/**
 * 自动转换为数值
 */
'5' - '2' // 3
'5' * '2' // 10
true - 1 // 0
false - 1 // -1
'1' - 1 // 0
'5' * [] // 0
false / '5' // 0
'abc' - 1 // NaN
null + 1 // 1
undefined + 1 // NaN

// 一元运算符也会把运算子转成数值。
+'abc' // NaN
-'abc' // NaN
+true // 1
-false // 0