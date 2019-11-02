function thunkify(fn) {
  return function () {
    var args = new Array(arguments.length);
    var ctx = this;

    for (var i = 0; i < args.length; ++i) {
      args[i] = arguments[i];
    }

    return function (done) {
      var called;

      args.push(function () {
        if (called) return;
        called = true;
        done.apply(null, arguments);
      });

      try {
        fn.apply(ctx, args);
      } catch (err) {
        done(err);
      }
    }
  }
};

function f(a, b, callback) {
  var sum = a + b;
  callback(sum);
  callback(sum);
}

var ft = thunkify(f);
var print = console.log.bind(console);
ft(1, 2)(print);
// 3

/**
 * 步骤1  得到的ft
 */
function ft() {
  var args = new Array(arguments.length);
  var ctx = this;

  for (var i = 0; i < args.length; ++i) {
    args[i] = arguments[i];
  }

  return function (done) {
    var called;

    args.push(function () {
      if (called) return;
      called = true;
      done.apply(null, arguments);
    });

    try {
      fn.apply(ctx, args);
    } catch (err) {
      done(err);
    }
  }
}

/**
 * 步骤2  得到的ft(1, 2)
 */
function step2(done) {
  // done = print
  // arguments = [1, 2]
  // args = [
  //   1,
  //   2,
  //   function () {
  //     if (called) return;
  //     called = true;
  //     done.apply(null, arguments);
  //   }
  // ]
  var called;

  args.push(function () {
    if (called) return;
    called = true;
    done.apply(null, arguments);
  });

  try {
    fn.apply(ctx, args);
  } catch (err) {
    done(err);
  }
}
// 最后实际执行的是fn.apply(this, args)
// 也就是fn(1, 2, newCallback)
// newCallback实际上是原有的回调函数开头添加了检测重复的功能的新的包装过后的回调函数
// 因此原本fun中会执行两次的callback只能执行一次了


/**
 * Thunk 函数的自动流程管理
 */
function run(fn) {
  var gen = fn();

  function next(err, data) {
    var result = gen.next(data);
    if (result.done) return;
    // 下面这行的result.value(...)是yield返回的后面的执行语句（必须是thunk函数），这个函数执行时传入的next实际上是执行函数的回调
    result.value(next);
  }

  next();
}

var g = function* () {
  var f1 = yield readFileThunk('fileA');
  var f2 = yield readFileThunk('fileB');
  // ...
  var fn = yield readFileThunk('fileN');
};

run(g);