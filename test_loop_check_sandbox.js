(async()=>{
  const vm = require('node:vm');
  var {jevalx_raw,jevalx_ext} = require('./jevalx');
  let ctxx,rst;
  ctxx = vm.createContext(new(function Object(){}));
  ctxx.eval=(js)=>jevalx_raw(js,ctxx,timeout,js_opts)[1];//NOTES no need use js_opts for eval()
  ctxx.Symbol = (...args)=>{throw {message:'TodoSymbol'}};
  ctxx.Reflect=(...args)=>{throw {message:'TodoReflect'}};
  ctxx.Proxy=(...args)=>{throw {message:'TodoProxy'}};

  //const sFunction="(...args)=>eval(`(${args.slice(0,-1).join(',')})=>{${args[args.length-1]}}`)";
  //[ctxx,rst] = jevalx_raw(`Function=${sFunction};constructor.__proto__.constructor=Function;Object=constructor.__proto__`,ctxx);

  [ctxx,rst] = jevalx_ext(`0;`,ctxx);
  let dump=async(v)=>{
    try{
      let vv = await jevalx_raw(`(()=>{let v=${v};return[typeof v,''+v]})()`,ctxx)[1];
      let ss = JSON.stringify(vv)
      console.log(v,'=>',ss);
    }catch(ex){
      console.error(v,'=>'+ex)
    }
  };
  await dump('Object.getPrototypeOf');
  await dump('Object.prototype.getPrototypeOf');
  await dump('Object.__proto__.getPrototypeOf');
  await dump('constructor');
  await dump('constructor.__proto__');
  await dump('constructor.__proto__.__getSetter__');
  await dump('[].constructor');
  await dump('[].constructor.__proto__');
  await dump('[].constructor.prototype');
})()

/* 
/////////////////// HOST:

typeof                                                  // inspect                    // toString()
            ////////////////////////////////
'undefined' undefined                                   //  undefined                 // 'undefined'
            ////////////////////////////////
'object'    null                                        //null                // 'null'
            Object.prototype.__proto__
            Object.getPrototypeOf(Object.create(null))
            ////////////////////////////////
'object'    Object.prototype                            //[Object: null prototype] {}// [object Object]
            Object.__proto__.__proto__ 
            (new Object()).__proto__                    
            ({}).__proto__                              
            Function.prototype.__proto__                
            ////////////////////////////////
'function'  Function.prototype                          // {}                        // [object Object]
            Object.__proto__
            Function.__proto__
            Array.__proto__
            ////////////////////////////////
'object'    ([]).__proto__                              // Object(0)[]               // ''
            Array.prototype
            ////////////////////////////////
'function'  Object.__proto__.constructor                // [Function: Function]      // 'function Function() { [native code] }'
            Function
            ////////////////////////////////
'function'  ([]).constructor                            // [Function: Array]         //'function Array() { [native code] }'
            Array
            ////////////////////////////////
'function'  ({}).constructor                            // inspect [Function Object] //'function Object() { [native code] }'
            Object
            constructor                                 /* When
            this.constructor                             * Host
            globalThis.constructor                       * Global
            global.constructor                           */
            ////////////////////////////////
//Object.create(null)
Object.getPrototypeOf(Object.create(null)) === null; // true
'toString' in Object.create(null); // false
'hasOwnProperty' in Object.create(null); // false
let obj1 = Object.create(null);
let obj2 = Object.create(null);
console.log(obj1 === obj1); // true
console.log(obj1 === obj2); // false
console.log(obj1 == obj2);  // false
             ////////////////////////////////
> ''+Object.getPrototypeOf(new(function(){})())
'[object Object]'

/////////////////// SANDBOX raw 
> await jevalx_raw(`''+constructor`,vm.createContext())
[ {}, 'function Object() { [native code] }' ]
> await jevalx_raw(`''+constructor`,vm.createContext({}))
[ {}, 'function Object() { [native code] }' ]

> await jevalx_raw(`''+constructor`,vm.createContext(new(function(){})))
[ {}, 'function(){}' ]
> await jevalx_raw(`''+constructor`,vm.createContext(new(function ObjectX(){})))
[ ObjectX {}, 'function ObjectX(){}' ]

> await jevalx_raw(`''+constructor.__proto__`,vm.createContext(new(function ObjectX(){})))
[ ObjectX {}, 'function () { [native code] }' ]
> await jevalx_raw(`''+constructor.__proto__,''+constructor.__proto__.__defineGetter__`,vm.createContext(Object.create(null)))
[
  [Object: null prototype] {},
  'function __defineGetter__() { [native code] }'
]

/////////////////// SANDBOX 

__defineSetter__
__defineSetter__
Object.
  defineProperties;
  defineProperty;
  getPrototypeOf;
  getOwnPropertySymbols;
  assign;
  freeze;
  keys(0)
Function


*/
