```
/////////////////// HOST:

typeof                                        // inspect                    // toString()
            ////////////////////////////////
'undefined' undefined                         //  undefined                 // 'undefined'
            ////////////////////////////////  i.e. Object.getPrototypeOf(Object.create(null))
'object'    null                              //null                // 'null'
            Object.prototype.__proto__
            ////////////////////////////////  TO REMOVE: __defineGetter__, __defineGetter__
'object'    Object.prototype                  //[Object: null prototype] {}// [object Object]
            Object.__proto__.__proto__ 
            (new Object()).__proto__          
            ({}).__proto__                    
            Function.prototype.__proto__      
            ////////////////////////////////
            {}                                // {}                        // [object Object]
            ////////////////////////////////
'function'  Function.prototype                // {}                        // 'function () { [native code] }'
            Object.__proto__
            Function.__proto__
            Array.__proto__
            ////////////////////////////////
'function'  Object.__proto__.constructor      // [Function: Function]      // 'function Function() { [native code] }'
            (_=>_).constructor
            (function(){}).constructor
            [].__proto__.push.constructor
            Function
            ////////////////////////////////
'function'  ([]).constructor                  // [Function: Array]         //'function Array() { [native code] }'
            Array
            ////////////////////////////////  defineProperties,defineProperty,getPrototypeOf,getOwnPropertySymbols,assign,freeze,keys;
'function'  ({}).constructor                  // [Function Object]         //'function Object() { [native code] }'
            Object                             * sandbox
            constructor                        * sandbox and host
            this.constructor                   * sandbox and host
            globalThis.constructor             * sandbox and host
            global.constructor                 * only in host
            ////////////////////////////////
'object'    this                               * sandbox
            globalThis                         * sandbox
            global                             * only in host
            ////////////////////////////////
'object'    ([]).__proto__                    // Object(0)[]               // ''
            Array.prototype
            ////////////////////////////////  host Function (danger..)
            constructor.__proto__.constructor
            constructor.constructor
            //////////////////////////////// //Object.create(null)
Object.getPrototypeOf(Object.create(null)) === null; // true
'toString' in Object.create(null); // false
'hasOwnProperty' in Object.create(null); // false
let obj1 = Object.create(null);
let obj2 = Object.create(null);
console.log(obj1 === obj1); // true
console.log(obj1 === obj2); // false
console.log(obj1 == obj2);  // false


```
