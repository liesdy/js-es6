/**
 * substring
 */
// 用于从原字符串取出子字符串并返回，不改变原字符串，跟字符串的slice方法很相像。它的第一个参数表示子字符串的开始位置，第二个位置表示结束位置，如果省略第二个参数，则表示子字符串一直到原字符串的结束。
'JavaScript'.substring(0, 4) // "Java"
'JavaScript'.substring(4) // "Script"
// 当两个参数值相对正常的情况下，这个方法的表现基本与slice一致
// 与slice不同的地方在于当这两个参数反常的情况下。主要体现在两个方面

// 1 当第一个参数大于第二个参数，substring方法会自动更换两个参数的位置。
'JavaScript'.substring(10, 4) // "Script"
// 等同于
'JavaScript'.substring(4, 10) // "Script"

// 2 如果参数是负数，substring方法会自动将负数转为0。
'JavaScript'.substring(-3) // "JavaScript"
'JavaScript'.substring(4, -3) // "Java"
// 上面代码中， 第二个例子的参数 - 3 会自动变成0， 等同于 'JavaScript'.substring(4, 0)。 由于第二个参数小于第一个参数， 会自动互换位置， 所以返回Java。

// 由于这些规则违反直觉， 因此不建议使用substring方法， 应该优先使用slice。


/**
 * substr()
 */
// substr方法用于从原字符串取出子字符串并返回， 不改变原字符串， 跟slice和substring方法的作用相同。
// 而其应用特征有些类似于数组的splice。当然，string对象并没有splice方法，也无法像splice那样在其中插入别的东西，同样也不会想splice那样更改原字符串。

// substr方法的第一个参数是子字符串的开始位置（ 从0开始计算）， 第二个参数是子字符串的长度。
'JavaScript'.substr(4, 6) // "Script"

// 如果省略第二个参数， 则表示子字符串一直到原字符串的结束。
'JavaScript'.substr(4) // "Script"

// 如果第一个参数是负数， 表示倒数计算的字符位置。 如果第二个参数是负数， 将被自动转为0， 因此会返回空字符串。
'JavaScript'.substr(-6) // "Script"
'JavaScript'.substr(4, -1) // ""
// 上面代码中， 第二个例子的参数 - 1 自动转为0， 表示子字符串长度为0， 所以返回空字符串。