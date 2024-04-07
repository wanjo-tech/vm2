const vm = require('node:vm');
const console_log = console.log;

const Object_getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
const Object_getPrototypeOf = Object.getPrototypeOf;
const Object_assign = Object.assign;

function findEvilGetter(obj,deep=3) {
  let currentObj = obj;
  let i=0;
  while (currentObj !== null) {
    if (i>2) return true;//found if too deep
    const descriptor = Object_getOwnPropertyDescriptor(currentObj, 'then');
    if (descriptor && typeof descriptor.get === 'function') {
      return descriptor.get; // Stop if the 'then' getter is found
    }
    currentObj = Object_getPrototypeOf(currentObj); // Move up the prototype chain
  }
  return false;
}

//e.g. [ctxx,rst] = await jevalx_raw('Math.random()')
// [ctxx,rst] = await jevalx_raw('[({}).constructor,constructor]') //sandbox and host
let jevalx_raw = (js,ctxx,timeout=666,js_opts)=>(ctxx=ctxx||vm.createContext(new function ObjectX(){}),[ctxx,vm.createScript(js,js_opts).runInContext(ctxx,{breakOnSigint:true,timeout})]);

const sFunction="(...args)=>eval(`(${args.slice(0,-1).join(',')})=>{${args[args.length-1]}}`)";

const jevalx_ext = (js,ctx,timeout=666,js_opts)=>{
  let rst,ctxx;
  if (!vm.isContext(ctx||{})) {
    [ctxx,rst] = jevalx_raw(`delete Function;constructor.__proto__.constructor=Object.__proto__.constructor=Function=${sFunction};Object.freeze(constructor,__proto__.constructor);delete Object.prototype.__defineGetter__;delete Object.prototype.__defineGetter__;for(let k of Object.getOwnPropertyNames(Object))delete Object[k];delete eval;delete Symbol;delete Reflect;delete Proxy;`);
    ctxx.eval=(js)=>jevalx_raw(js,ctxx,timeout,js_opts)[1];//NOTES no need use js_opts for eval()
    ctxx.Symbol = (...args)=>{throw {message:'TodoSymbol'}};
    ctxx.Reflect=(...args)=>{throw {message:'TodoReflect'}};
    ctxx.Proxy=(...args)=>{throw {message:'TodoProxy'}};
    if (ctx) Object_assign(ctxx,ctx);
  }else{ ctxx = ctx; }
  return jevalx_raw(js,ctxx,timeout,js_opts)
}

let jevalx_core = async(js,ctx,timeout=666)=>{
  let ctxx,rst,err,evil=0;
  let tmpHandler = (reason, promise)=>{ err={message:'Evil',js} };
  process.addListener('unhandledRejection',tmpHandler);
  try{
    let js_opts=({async importModuleDynamically(specifier, referrer, importAttributes){
      //TODO make some fake import in future...or put it in the args by caller...
      //console_log('TODO EvilImport',{specifier,referrer});
      evil++; err = {message:'EvilImport',js};
      if (specifier=='fs'){
        return import(`./fake${specifier||""}.mjs`)
      }
      throw('EvilImport');
    }});
    await new Promise(async(r,j)=>{
      setTimeout(()=>{j({message:'TimeoutX',js,js_opts})},timeout+666)//FOR DEV ONLY...
      try{
        [ctxx,rst] = jevalx_ext(js,ctx,timeout,js_opts);
        let sandbox_level = 9;
        for (var i=0;i<sandbox_level;i++) {
          //console_log('debug',i,rst);
          if (evil || !rst || err) break;
          if (findEvilGetter(rst)) throw {message:'EvilProto',js};
          if ('function'==typeof rst) {//run in the sandbox !
            ctxx['rst_tmp']=rst;
            [ctxx,rst] = jevalx_ext('rst_tmp()',ctxx,timeout,js_opts);
          }else if (rst.then){
            rst = await new Promise(async(r,j)=>{
              setTimeout(()=>j({message:'Timeout',js}),timeout);
              try{ r(await rst) } catch(ex) { j(ex) };
            });
          } else break;
        }
      }catch(ex){ err={message:typeof(ex)=='string'?ex:(ex?.message|| 'EvilUnknown'),js}; }
      setTimeout(()=>{ if (evil||err) j(err); else r(rst); },1);
    });
  }catch(ex){ err = {message:ex?.message||'EvilX',js}; }
  process.removeListener('unhandledRejection',tmpHandler);
  if (evil || err) throw err;
  return rst;
}
var jevalx = jevalx_core;
if (typeof module!='undefined') module.exports = {jevalx,jevalx_core,jevalx_raw,jevalx_ext}

/**
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
*/

