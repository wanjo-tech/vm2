
const console_log = console.log;
const Object_getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
const Object_getPrototypeOf = Object.getPrototypeOf;
const Object_getOwnPropertyNames = Object.getOwnPropertyNames;
const Object_assign = Object.assign;
const Object_setPrototypeOf = Object.setPrototypeOf;

var {dumptree} = require('./dumptree');

var s_Promise = JSON.stringify(dumptree(Promise));

console.log(s_Promise);

const Promise_prototype = Promise.prototype;
const Promise_prototype_getPrototypeOf = Object_getPrototypeOf(Promise.prototype);
const Promise_getPrototypeOf = Object_getPrototypeOf(Promise);
const Promise_constructor = Promise.constructor;

const Promise___proto___apply = Promise.__proto__.apply;
const Promise_prototype_catch = Promise.prototype.catch;
const Promise_prototype_then = Promise.prototype.then;
const Promise_prototype_apply = Promise.prototype.apply;

/////


Object_setPrototypeOf(Promise.prototype,null);
Object_setPrototypeOf(Promise,null);

/////

Promise.prototype = Promise_prototype;
Object.setPrototypeOf(Promise.prototype,Promise_prototype_getPrototypeOf);
Object.setPrototypeOf(Promise,Promise_getPrototypeOf);

Promise.prototype.constructor=Promise;

  Promise.__proto__.apply = Promise___proto___apply;
  Promise.prototype.catch = Promise_prototype_catch;
  Promise.prototype.apply= Promise_prototype_apply;
  Promise.prototype.then= Promise_prototype_then;
  Promise.__proto__.constructor=Function;//last piece ;)

var s_Promise2 = JSON.stringify(dumptree(Promise));

console.log(s_Promise2);
