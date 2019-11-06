/**
 * 构造函数就是一般的函数，但是有自己的特征和用法（从使用惯例上说，构造函数一般首字母会大写）
 * 函数体内部使用了this关键字， 代表了所要生成的对象实例。
 * 生成对象的时候， 必须使用new命令。
 */

 /**
  * new命令
  */
 var Vehicle = function () {
   this.price = 1000;
 };

 var v = new Vehicle();
 v.price // 1000

 //使用new命令时，根据需要，构造函数也可以接受参数。
 var Vehicle = function (p) {
   this.price = p;
 };

 var v = new Vehicle(500);

 // 如果忘了使用new命令,构造函数就变成了普通函数，并不会生成实例对象。而且由于后面会说到的原因，this这时代表全局对象，将造成一些意想不到的结果。因此，应该非常小心，避免不使用new命令、直接调用构造函数。
 var Vehicle = function () {
   this.price = 1000;
 };

 var v = Vehicle();
 v // undefined
 price // 1000




 // 如果构造函数内部有return语句，而且return后面跟着一个对象，new命令会返回return语句指定的对象；否则，就会不管return语句，返回this对象。
 var Vehicle = function () {
   this.price = 1000;
   return 1000;
 };

 (new Vehicle()) === 1000
 // false

 // 如果return语句返回的是一个跟this无关的新对象，new命令会返回这个新对象，而不是this对象
 var Vehicle = function () {
   this.price = 1000;
   return {
     price: 2000
   };
 };

 (new Vehicle()).price
 // 2000

 // 如果对普通函数（内部没有this关键字的函数）使用new命令，则会返回一个空对象。
 function getMessage() {
   return 'this is a message';
 }

 var msg = new getMessage();

 msg // {}
 typeof msg // "object"


 /**
  * new.target
  */
 // 函数内部可以使用new.target属性。如果当前函数是new命令调用，new.target指向当前函数，否则为undefined。
 function f() {
   console.log(new.target === f);
 }

 f() // false
 new f() // true

 /**
  * Object.create() 创建实例对象
  */
 var person1 = {
   name: '张三',
   age: 38,
   greeting: function () {
     console.log('Hi! I\'m ' + this.name + '.');
   }
 };

 var person2 = Object.create(person1);

 person2.name // 张三
 person2.greeting() // Hi! I'm 张三.
//  上面代码中， 对象person1是person2的模板， 后者继承了前者的属性和方法。