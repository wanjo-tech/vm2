const vm = require('node:vm');
const console_log = console.log;

const Object_getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

const Object_getOwnPropertySymbols = Object.getOwnPropertySymbols;
const Object_getPrototypeOf = Object.getPrototypeOf;
const Object_defineProperty = Object.defineProperty;
const Object_defineProperties = Object.defineProperties;
const Object_freeze = Object.freeze;
const Object_assign = Object.assign;

const Promise_prototype_then = Promise.prototype.then;
const Promise_prototype_catch = Promise.prototype.catch;

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
let jevalx_raw = (js,ctxx,timeout=666,js_opts)=>[ctxx,vm.createScript(js,js_opts).runInContext(ctxx,{breakOnSigint:true,timeout})];

//const sFunction="(...args)=>eval(`(${args.slice(0,-1).join(',')})=>{${args[args.length-1]}}`)";

const jevalx_ext = (js,ctx,timeout=666,js_opts)=>{
  let rst,ctxx;
  fwd_eval=(js)=>jevalx_raw(js,ctxx,timeout,js_opts)[1];
  if (!ctx || !vm.isContext(ctx)){
    function ObjectX(){};
    let ctx_base = new ObjectX;
    ctx_base.constructor.constructor = (...args)=>fwd_eval(`(${args.slice(0,-1).join(',')})=>{${args[args.length-1]}}`);
    ctxx = vm.createContext(ctx_base);
    //[ctxx,rst] = jevalx_raw(`delete Function;constructor.__proto__.constructor=Object.__proto__.constructor=Function=${sFunction};delete Object.prototype.__defineGetter__;delete Object.prototype.__defineGetter__;for(let k of Object.getOwnPropertyNames(Object))delete Object[k];delete eval;delete Symbol;delete Reflect;delete Proxy;`,ctxx);
    [ctxx,rst] = jevalx_raw(`delete Function;constructor.__proto__.constructor=Function=constructor.constructor;delete Object.prototype.__defineGetter__;delete Object.prototype.__defineGetter__;for(let k of Object.getOwnPropertyNames(Object))delete Object[k];delete eval;delete Symbol;delete Reflect;delete Proxy;`,ctxx);
    ctxx.console= console;//for tmp debug only...to see if danger...
    ctxx.eval=fwd_eval;
    ctxx.Symbol = (...args)=>{throw {message:'TodoSymbol'}};
    ctxx.Reflect=(...args)=>{throw {message:'TodoReflect'}};
    ctxx.Proxy=(...args)=>{throw {message:'TodoProxy'}};
    if (ctx) Object_assign(ctxx,ctx);
  }else{ ctxx = ctx; }
  return jevalx_raw(js,ctxx,timeout,js_opts)
}

let jevalx_core = async(js,ctx,timeout=666)=>{
  let ctxx,rst,err,evil=0;
  let tmpHandler = (reason, promise)=>{ if (!err) err={message:'Evil',js} };
  process.addListener('unhandledRejection',tmpHandler);
  try{
    //dirty hijack for import().catch(), kill the Evil Promise Escape ( or return the sandbox promise later)
    Promise.prototype.catch = function() {
      //console.log('Promise_prototype_catch',this,arguments);
      if (evil) throw err; rst=undefined;
      return Promise_prototype_catch.apply(this, arguments);
    };

    let js_opts=({async importModuleDynamically(specifier, referrer, importAttributes){
      //TODO make some fake import in future...or put it in the args by caller...
      //console_log('TODO EvilImport',{specifier,referrer});
      evil++; err = {message:'EvilImport',js};
      if (specifier=='fs'){ return import(`./fake${specifier||""}.mjs`) }
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
  finally {
    Promise.prototype.catch = Promise_prototype_catch;
    Promise.prototype.then= Promise_prototype_then;
  }
  process.removeListener('unhandledRejection',tmpHandler);
  if (evil || err) throw err;
  return rst;
}
var jevalx = jevalx_core;
if (typeof module!='undefined') module.exports = {jevalx,jevalx_core,jevalx_raw,jevalx_ext}

