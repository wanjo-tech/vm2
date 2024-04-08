```
/////////////////// HOST:

typeof                                        // inspect                    // toString()
            ////////////////////////////////
'undefined' undefined                         //  undefined                 // 'undefined'
            ////////////////////////////////  i.e. Object.getPrototypeOf(Object.create(null))
'object'    null                              //null                        // 'null'
            Object.prototype.__proto__
            Object.getPrototypeOf(Object.create(null))
            ////////////////////////////////  TO REMOVE: __defineGetter__, __defineGetter__
'object'    Object.prototype                  //[Object: null prototype] {} // [object Object]
            Object.__proto__.__proto__ 
            (_=>_).__proto__.__proto__
            (new Object()).__proto__          
            Object.getPrototypeOf({})
            ({}).__proto__                    
            Function.prototype.__proto__      
            Object.getPrototypeOf(Function.prototype)
            constructor.prototype             
            ////////////////////////////////  [ instance ]
            {}                                // {}                          // [object Object]
            new Object
            ////////////////////////////////
'function'  Function.prototype                // {}                          // 'function () { [native code] }'
            Object.__proto__
            Function.__proto__
            Array.__proto__
            Object.getPrototypeOf(Object)
            Object.getPrototypeOf(Function)
            (async _=>_).__proto__.__proto__ 
            ////////////////////////////////
'function'  Object.__proto__.constructor      // [Function: Function]        // 'function Function() { [native code] }'
            (_=>_).constructor
            (function(){}).constructor
            [].__proto__.push.constructor
            Function.prototype.constructor
            ////////////////////////////////
'function'  (async _=>_).constructor          // [Function: AsyncFunction]   // 'function AsyncFunction() { [native code] }'
            Function
            (async _=>_).__proto__.constructor
            ////////////////////////////////
            (async _=>_).__proto__            // Function [AsyncFunction] {} //
            ////////////////////////////////
'function'  ([]).constructor                  // [Function: Array]           //'function Array() { [native code] }'
            ([]).__proto__.constructor
            Array
            ////////////////////////////////  defineProperties,defineProperty,getPrototypeOf,getOwnPropertySymbols,assign,freeze,keys;
'function'  ({}).constructor                  // [Function Object]           //'function Object() { [native code] }'
            constructor                        
            this.constructor                   
            globalThis.constructor            
            global.constructor                 
!!!!        Object                             
            ////////////////////////////////
'object'    this                              * only when in global scope
            globalThis                         
            global                             
            ////////////////////////////////
'object'    ([]).__proto__                    // Object(0)[]                 // ''
            Array.prototype
            ////////////////////////////////  host Function (danger..)
            constructor.__proto__.constructor
            constructor.constructor
            ////////////////////////////////  instance of nearly null
            Object.create(null)               //[Object: null prototype] {} //Uncaught TypeError: Cannot convert object to primitive value
            //////////////////////////////// 

//NOTES: sandbox this.constructor is not same as Object.constructor
constructor.__proto__ == Object.getPrototypeOf(constructor) //true
constructor.prototype == Object.prototype //true(host), false(node:vm)
constructor.constructor == Object.constructor //true(host), false(node:vm)

Function.prototype.constructor == Function //true
Object.create({}).prototype=={}.prototype //true
Object.getPrototypeOf(Object.create(null)) === null; // true
'toString' in Object.create(null); // false
'hasOwnProperty' in Object.create(null); // false
let obj1 = Object.create(null);
let obj2 = Object.create(null);
console.log(obj1 === obj1); // true
console.log(obj1 === obj2); // false
console.log(obj1 == obj2);  // false

//clear prototype by set to PrototypeOf(null), but node:vm will reset, so do only inside sandbox
Object.setPrototypeOf((new ObjectX).constructor.prototype,Object.create(null))

> Object.getOwnPropertyNames(Object.getPrototypeOf(Object)) //Function.prototype,
[
  'length',      'name',
  'arguments',   'caller',
  'constructor', 'apply',
  'bind',        'call',
  'toString'
]

> Object.getOwnPropertyNames(Object.getPrototypeOf({})) // == Object.prototype, {}.__proto__
[
  'constructor',
  '__defineGetter__',
  '__defineSetter__',
  'hasOwnProperty',
  '__lookupGetter__',
  '__lookupSetter__',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toString',
  'valueOf',
  '__proto__',
  'toLocaleString'
]

> Object.getOwnPropertyNames(Object)
[
  'length',
  'name',
  'prototype',
  'assign',
  'getOwnPropertyDescriptor',
  'getOwnPropertyDescriptors',
  'getOwnPropertyNames',
  'getOwnPropertySymbols',
  'is',
  'preventExtensions',
  'seal',
  'create',
  'defineProperties',
  'defineProperty',
  'freeze',
  'getPrototypeOf',
  'setPrototypeOf',
  'isExtensible',
  'isFrozen',
  'isSealed',
  'keys',
  'entries',
  'fromEntries',
  'values',
  'hasOwn'
]

```
