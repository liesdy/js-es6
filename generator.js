/**
 * 例1
 * 测试没有return时候的yield返回
 */
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  // return 'ending';
}

var hw = helloWorldGenerator();


/**
 * 例2
 * 测试yield的实际执行步骤和顺序
 */
function* dataConsumer() {
  console.log('Started');
  console.log(`1. ${yield}`);
  console.log(`2. ${yield}`);
  return 'result';
}

let genObj = dataConsumer();
genObj.next();
// Started
// {value: undefined, done: false}
genObj.next('a');
// 1. a
// {value: undefined, done: false}
genObj.next('b');
// 2. b
// {value: "result", done: true}

//解析： 因为next（）是执行到本次yield语句结束。而包裹着yield语句的console.log语句有一部分在yield语句后面，因此不会在本次next（）中执行，只能等到下一轮next（）才会执行

/**
 * .throw()
 */
var g = function* () {
  try {
    var val1 = yield console.log('1');
    var val2 = yield console.log('val1', val1);
    var val3 = yield console.log('val2', val2);
  } catch (e) {
    console.log('内部捕获', e);
  }
  var val4 = yield console.log('val3', val3);
  var val5 = yield console.log('val4', val4);
};

var i = g();
i.next();

try {
  i.next('a');
  i.throw('b');
  i.next('c');
} catch (e) {
  console.log('外部捕获', e);
}
// 1

// val1 a

// 内部捕获 b
// val3 undefined

// val4 c 

// {
//   value: undefined,
//   done: false
// }

var gen = function* gen() {
  try {
    yield console.log('a');
  } catch (e) {
    // ...
  }
  yield console.log('b');
  yield console.log('c');
  yield console.log('d');
  yield console.log('e');
}
var g = gen();

g.next() // a
g.next() // b
g.throw() // Uncaught
g.next() // console.log('d');这一句并不会执行，因为throw已经中断了执行，最后这个语句本身返回的是{value: undefined, done: true}的这么一个对象
g.next() // 还是{value: undefined, done: true}，执行在上一步之前就已经中断了

/**
 * gen.throw的终极测试
 */
var g = function* () {
  try {
    var val1 = yield console.log('1');
    var val2 = yield console.log('val1', val1);
    console.log('监控节点');
    var val3 = yield console.log('val2', val2);
  } catch (e) {
    console.log('内部捕获', e);
    var val4 = yield console.log('val3', val3);
    var val5 = yield console.log('val4', val4);
  }
  var val6 = yield console.log('val5', val5);
  var val7 = yield console.log('val6', val6);
};

var i = g();
i.next();
// 1
try {
  i.next('a');
  i.throw('b');
  i.next('c');
} catch (e) {
  console.log('外部捕获', e);
}
// val1 a

// 内部捕获 b
// val3 undefined

// val4 c

/**
 * yield*
 */
function* inner() {
  yield 'hello!';
  console.log('test');
  yield 'hello hello hello!';
}
function* outer2() {
  yield 'open'
  yield* inner()
  yield 'close'
}
var gen = outer2()
gen.next().value

/**
 * 二叉树
 */
let tree = make([[['a'], 'b', ['c']], 'd', [['e'], 'f', ['g']]]);
// 下面是二叉树的构造函数，
// 三个参数分别是左树、当前节点和右树
function Tree(left, label, right) {
  this.left = left;
  this.label = label;
  this.right = right;
}
// 下面生成二叉树
function make(array) {
  // 判断是否为叶节点
  if (array.length == 1) return new Tree(null, array[0], null);
  return new Tree(make(array[0]), array[1], make(array[2]));
}
// 下面是中序（inorder）遍历函数。
// 由于返回的是一个遍历器，所以要用generator函数。
// 函数体内采用递归算法，所以左树和右树要用yield*遍历
function* inorder(t) {
  if (t) {
    yield* inorder(t.left);
    yield t.label;
    yield* inorder(t.right);
  }
}
// 遍历二叉树
var result = [];
for (let node of inorder(tree)) {
  result.push(node);
}
result
// ['a', 'b', 'c', 'd', 'e', 'f', 'g']

// 解析
// 第一步用make方法对原始数组进行处理
// 处理过程中用到了构造函数Tree
// 最后得到的是一个多层嵌套的对象。
// 这个对象的结构和二叉树一样，
// 每个节点有一个label和两个分支。
// 分支的末端有label， 他的另外两个分支都是null
// 然后用inorder方法把这个二叉树形式的对象转化成一个遍历器。 
// 这个遍历器会把二叉树形式的对象转化成一个有顺序的扁平的可遍历对象。 
// 最后用for...of循环加上push方法来填充得到一个新的数组