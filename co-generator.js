// co 模块的源码
// co 就是上面那个自动执行器的扩展，它的源码只有几十行，非常简单。

// 首先，co 函数接受 Generator 函数作为参数，返回一个 Promise 对象。

function co(gen) {
  var ctx = this;

  return new Promise(function(resolve, reject) {
  });
}
// 在返回的 Promise 对象里面，co 先检查参数gen是否为 Generator 函数。如果是，就执行该函数，得到一个内部指针对象；如果不是就返回，并将 Promise 对象的状态改为resolved。

function co(gen) {
  var ctx = this;

  return new Promise(function(resolve, reject) {
    if (typeof gen === 'function') gen = gen.call(ctx);
    if (!gen || typeof gen.next !== 'function') return resolve(gen);
  });
}
// 接着，co 将 Generator 函数的内部指针对象的next方法，包装成onFulfilled函数。这主要是为了能够捕捉抛出的错误。

function co(gen) {
  var ctx = this;

  return new Promise(function(resolve, reject) {
    if (typeof gen === 'function') gen = gen.call(ctx);
    if (!gen || typeof gen.next !== 'function') return resolve(gen);

    onFulfilled();
    function onFulfilled(res) {
      var ret;
      try {
        ret = gen.next(res);
      } catch (e) {
        return reject(e);
      }
      next(ret);
    }
  });
}
// 最后，就是关键的next函数，它会反复调用自身。

function next(ret) {
  if (ret.done) return resolve(ret.value);
  var value = toPromise.call(ctx, ret.value);
  if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
  return onRejected(
    new TypeError(
      'You may only yield a function, promise, generator, array, or object, '
      + 'but the following object was passed: "'
      + String(ret.value)
      + '"'
    )
  );
}
// 上面代码中，next函数的内部代码，一共只有四行命令。

// 第一行，检查当前是否为 Generator 函数的最后一步，如果是就返回。

// 第二行，确保每一步的返回值，是 Promise 对象。

// 第三行，使用then方法，为返回值加上回调函数，然后通过onFulfilled函数再次调用next函数。

// 第四行，在参数不符合要求的情况下（参数非 Thunk 函数和 Promise 对象），将 Promise 对象的状态改为rejected，从而终止执行。









/**
 * co 实例
 */
// Node 提供 Stream 模式读写数据， 特点是一次只处理数据的一部分， 数据分成一块块依次处理， 就好像“ 数据流” 一样。 这对于处理大规模数据非常有利。 Stream 模式使用 EventEmitter API， 会释放三个事件。

// data事件： 下一块数据块已经准备好了。
// end事件： 整个“ 数据流” 处理完了。
// error事件： 发生错误。
// 使用Promise.race() 函数， 可以判断这三个事件之中哪一个最先发生， 只有当data事件最先发生时， 才进入下一个数据块的处理。 从而， 我们可以通过一个while循环， 完成所有数据的读取。

const co = require('co');
const fs = require('fs');

const stream = fs.createReadStream('./les_miserables.txt');
let valjeanCount = 0;

co(function* () {
  while (true) {
    const res = yield Promise.race([
      new Promise(resolve => stream.once('data', resolve)),
      new Promise(resolve => stream.once('end', resolve)),
      new Promise((resolve, reject) => stream.once('error', reject))
    ]);
    if (!res) {
      break;
    }
    stream.removeAllListeners('data');
    stream.removeAllListeners('end');
    stream.removeAllListeners('error');
    valjeanCount += (res.toString().match(/valjean/ig) || []).length;
  }
  console.log('count:', valjeanCount); // count: 1120
});
// 上面代码采用 Stream 模式读取《 悲惨世界》 的文本文件， 对于每个数据块都使用stream.once方法， 在data、 end、 error三个事件上添加一次性回调函数。 变量res只有在data事件发生时才有值， 然后累加每个数据块之中valjean这个词出现的次数。