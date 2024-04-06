const vm = require('node:vm');
const console_log = console.log;

const Object_getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
const Object_getPrototypeOf = Object.getPrototypeOf;
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

let jevalx_raw = (js,ctxx,timeout=666,js_opts)=>{
  if (!vm.isContext(ctxx||{})) ctxx = vm.createContext(ctxx||{});
  return [ctxx,vm.createScript(js,js_opts).runInContext(ctxx,{breakOnSigint:true,timeout})]
}

const throwx=e=>{throw(e)}
let jevalx_core = async(js,ctx,timeout=666)=>{
  let [ctxx,_] = jevalx_raw(`
//const host_then = import('').then(_=>_,_=>_).then;
const host_then = (async()=>1)().then(_=>_,_=>_).then;
host_then.constructor=undefined;
Object.freeze(host_then);
constructor.constructor=undefined;
constructor.keys=undefined;
constructor.__proto__.constructor=undefined;//
Object.freeze(constructor);//
delete Object.defineProperty;
delete Object.defineProperties;
delete Object.getPrototypeOf;
delete Object.getOwnPropertySymbols;
delete Object.prototype.__defineGetter__;
delete Object.prototype.__defineSetter__;
delete Object.constructor;
delete Object.freeze;
delete Symbol;//replaced
delete Error;//replaced.
`,ctx);
  //ctxx.import=()=>throwx('EvilImportX');//to break the evil
  //ctxx.console_log = console_log;//for dev-tmp

  let rst,err,evil=0,done=false,warnings=[];

  let tmpHandler = (reason, promise)=>{err={message:''+reason,js}};
  process.addListener('unhandledRejection',tmpHandler);
  try{
    let js_opts=({async importModuleDynamically(specifier, referrer, importAttributes){
      console_log('EvilImport',{importAttributes});
      evil++; err = {message:'EvilImport',js};
      //const m = new vm.SyntheticModule(['bar'], () => { });
      //await m.link(() => { });
      //m.setExport('bar', { hello: 'world' });
      //return m;
    }});
    //ctxx.eval = (js)=>jevalx_raw(js,ctxx,timeout)[1];
    ctxx.Error = function(message,code){return{message,code,stack}};
    ctxx.Symbol = function(...args){throw {message:'EvilSymbol'}};
    await new Promise(async(r,j)=>{
      setTimeout(()=>{j({message:'TimeoutX',js,js_opts})},timeout+666)//FOR DEV ONLY...
      try{
        [ctxx,rst] = jevalx_raw(js,ctxx,timeout,js_opts);
        let sandbox_level = 9;
        for (var i=0;i<sandbox_level;i++) {
          //console_log('debug',i,rst);
          if (evil || !rst || err) break;
          if (findEvilGetter(rst)) throw {message:'EvilProto',js};
          if ('function'==typeof rst) {//run in the sandbox !
            ctxx['rst_tmp']=rst;
            [ctxx,rst] = jevalx_raw('rst_tmp()',ctxx,timeout,js_opts);
          }else if (rst.then){
            rst = await new Promise(async(r,j)=>{
              setTimeout(()=>j({message:'Timeout',js}),timeout);
              try{ r(await rst) } catch(ex) { j(ex) };
            });
          } else break;
        }
      }catch(ex){ err = {message:ex?.message||'EvilUnknown',js}}
      setTimeout(()=>{ if (!done){ done = true; if (evil||err) j(err); else r(rst); } },1);
    });
  }catch(ex){ err = {message:ex?.message||'EvilX',js};/* console_log('EvilX',ex)*/ }
  process.removeListener('unhandledRejection',tmpHandler);

  if (evil || err) throw err;
  return rst;
}
var jevalx = jevalx_core;
var jevalx_dev = jevalx_core;

if (typeof module!='undefined') module.exports = {jevalx,jevalx_core,jevalx_raw,jevalx_dev}




//let tmpObject = undefined;
//try{Object_defineProperty(globalThis,'Object',{get(k){ return undefined},set(o){ throw 'EvilObject' }})}catch(ex){console_log('Object_defineProperty',ex)}

//const processWtf = require('process');
//const setTimeoutWtf=setTimeout;
////const PromiseWtf=Promise;
////
////const ArrayWtf = Array;
////const Array_prototype_push = ArrayWtf.prototype.push;
////
////const Object_getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
////
////const ObjectWtf = Object;
////const Object_keys = Object.keys;
////const Object_getPrototypeOf = Object.getPrototypeOf;
////const Object_getOwnPropertySymbols = Object.getOwnPropertySymbols;
////const Object_defineProperty = Object.defineProperty;
////const Object_defineProperties = Object.defineProperties;
////const Object_freeze = Object.freeze;
////const Object_assign = Object.assign;
////
////const Object_hasOwnProperty = Object.hasOwnProperty;
////const Object_getOwnPropertyNames = Object.getOwnPropertyNames;
////
////const Promise_prototype_then = Promise.prototype.then;
//////we are sandbox(run js inside ctx) instead of vm(full function), remove everything vulnerable!!
////const prejs_delete = [
////  'process',//L0
////  'Object.getPrototypeOf','Object.defineProperties','Object.defineProperty','Object.getOwnPropertySymbols','Object.freeze',//L0
////  'Proxy','Reflect',//L0
////  'Object.assign',//L0
////  //'eval',
////  //'require',
////  'Object.prototype.__defineGetter__',//L2
////  'Object.prototype.__defineSetter__',//L2
////  //'Promise',
////  //'Function',
////  'Symbol','Error',
////].map(w=> `delete ${w};`).join('');
////let jevalx_core = async(js,ctx,timeout=666)=>{
////  let rst,err,evil=0,done=false,warnings=[];
////  let tmpHandler = (reason, promise)=>{err={message:''+reason,js}};
////  processWtf.addListener('unhandledRejection',tmpHandler);
////  let Wtf={};
////  try{
////    for(let k of[...Object_keys(globalThis),...['process','require']]){if(globalThis[k]){Wtf[k]=globalThis[k];delete globalThis[k]}};
////
////    //should not allow sandbox have these://L0
////    delete Object.prototype.__defineGetter__;
////    delete Object.prototype.__defineSetter__;
////    delete Object.freeze;
////    delete Object.defineProperties;
////    delete Object.defineProperty;
////    delete Object.getPrototypeOf;
////    delete Object.getOwnPropertySymbols;
////    delete Object.assign;
////
////    process = undefined;//L0
////
////    await new PromiseWtf(async(r,j)=>{
////      try{
////        let sandbox_level=9;//
////        //ctx.console_log = console_log;//for dev-tmp
////        let ctxx = vm.createContext({});//
////        vm.createScript(prejs_delete
////+`constructor.constructor=undefined;delete constructor;import('').then(_=>_,_=>_).then.constructor=undefined;`
////).runInContext(ctxx);//prepare
////        Object_assign(ctxx,ctx||{});
////
////        rst = vm.createScript(js,{importModuleDynamically(specifier, referrer, importAttributes){
////          evil++; err = {message:'EvilImport',js};globalThis['process'] = undefined;
////        }}).runInContext(ctxx,{breakOnSigint:true,timeout});
////        for (var i=0;i<sandbox_level;i++) {
////          if (evil || !rst || err) break;
////          ////PromiseWtf.prototype.then = Promise_prototype_then;//important for Promise hack.
////          if (findEvilGetter(rst)) throw {message:'EvilProto',js};
////          if ('function'==typeof rst) {//run in the sandbox !
////            ctxx['rst_tmp']=rst;
////            rst = vm.createScript('rst_tmp()'
////                ,{importModuleDynamically(specifier, referrer, importAttributes){
////              evil++; err = {message:'EvilImport',js};globalThis['process'] = undefined;
////            }}).runInContext(ctxx,{breakOnSigint:true,timeout});
////          }else if (rst.then){
////            rst = await new PromiseWtf(async(r,j)=>{
////              setTimeoutWtf(()=>j({message:'Timeout',js}),timeout);
////              try{ r(await rst) } catch(ex) { j(ex) };
////            });
////          } else break;
////        }
////        if (rst){
////          (rst==globalThis)&&throwx({message:'EvilGlobal',js});
////          if (warnings.push!=Array_prototype_push) {//tmp solution, will improve later.
////            Array.prototype.push = Array_prototype_push;//
////            throwx({message:'EvilArray',js});
////          }
////
////          //quick concept prove, will clean up later...
////          for (let k of Object_getOwnPropertyNames(rst)){
////            if (k=='toString' || k =='then'){
////              //warnings.push({[k]:rst[k]})
////              //console_log('!!! DEBUG TODO evil.',k,rst[k]);
////              delete rst[k];
////            }
////          }
////          //console_log('DEBUG Object_getOwnPropertyNames',Object_getOwnPropertyNames(rst));
////
////          findEvilGetter(rst)&&throwx({message:'EvilProto',js});
////          (rst.then)&&throwx({message:'EvilPromiseX',js});
////          ('function'==typeof(rst))&&throwx({message:'EvilFunction',js});
////        }
////      }catch(ex){ err = {message:ex?.message||'EvilUnknown',js}}
////      setTimeoutWtf(()=>{ if (!done){ done = true; if (evil||err) j(err); else r(rst); } },1);
////    });
////  }catch(ex){ err = {message:ex?.message||'EvilX',js} }
////
////  processWtf.removeListener('unhandledRejection',tmpHandler);
////  for(var k in Wtf){globalThis[k]=Wtf[k]};
////
////  //Array = ArrayWtf;//L0
////  //Array.prototype.push = Array_prototype_push;//
////  console_log('debug .push',Array.prototype?.push,warnings.push);
////
////  Object = ObjectWtf;//L0
////  Object.getOwnPropertySymbols = Object_getOwnPropertySymbols;
////  Object.defineProperty = Object_defineProperty;
////  Object.defineProperties = Object_defineProperties;
////  Object.getPrototypeOf = Object_getPrototypeOf;
////  Object.freeze = Object_freeze;
////  Object.assign = Object_assign;
////
////  Promise = PromiseWtf;
////  PromiseWtf.prototype.then = Promise_prototype_then;//important for Promise hack.
////
////  //change design, now caller to jevalx_core() have own decision:
////  return [(evil||err)?undefined:rst,(evil||err)?err:undefined,warnings];
////
////  //if (evil || err) throw err;
////  //return rst;
////}
//var jevalx = async(js,ctx,timeout)=>{
//  var [rst,err,warnings] = await jevalx_core(js,ctx,timeout);
//  if (warnings) { console_log('warnings',warnings); }
//  if (err) throw err;
//  return rst;
//}
//no use:`[function(){return eval(arguments[1])}][0](${JSON.stringify(js)})`
/* NOTES find a way to hide the hostGlobal
//example to test...
let hostFunction=this.constructor.constructor;
let hostFunction=import('').then(_=>_,_=>_).then.constructor;
let hostGlobal=hostFunction("return(this)")();[hostFunction,hostGlobal]
await jevalx_dev(`this.constructor.constructor("return this")()`)
await jevalx_dev(`this.constructor.constructor("return this.constructor.constructor('return this')()")()`)
await jevalx_dev(`import('').then(_=>_,_=>_).then.constructor("return this")()`)
await jevalx_dev(`[].constructor.constructor("return this.constructor.constructor('return this')()")()`)
await jevalx_dev(`constructor.keys(0).__proto__.push=undefined;`);Array.prototype.push;
await jevalx_dev(`delete constructor;delete constructor.constructor;constructor.constructor("return process")()`)
await jevalx_dev(`constructor.__proto__.constructor("return process")()`)
await jevalx('delete (async()=>{})().then(_=>_,_=>_).then.constructor;(async()=>{})().then(_=>_,_=>_).then.constructor("return process")
*/
